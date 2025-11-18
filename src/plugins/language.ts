import { Elysia } from 'elysia';
import {
    DEFAULT_LANGUAGE,
    FALLBACK_LANGUAGES,
    type LanguageContext,
    SUPPORTED_LANGUAGES,
    type SupportedLanguage,
} from '../i18n/config';

const SUPPORTED_LANGUAGE_SET = new Set<SupportedLanguage>(SUPPORTED_LANGUAGES);

const normalizeLanguage = (
    raw: string | undefined,
): SupportedLanguage | null => {
    if (!raw) {
        return null;
    }

    const base = raw.toLowerCase().split('-')[0] as SupportedLanguage;

    return SUPPORTED_LANGUAGE_SET.has(base) ? base : null;
};

const parseAcceptLanguageHeader = (
    header: string | null,
): SupportedLanguage[] => {
    if (!header) {
        return [...FALLBACK_LANGUAGES];
    }

    const weightedLanguages: Array<{
        language: SupportedLanguage;
        quality: number;
    }> = [];

    for (const rawPart of header.split(',')) {
        const trimmed = rawPart.trim();

        if (!trimmed) {
            continue;
        }

        const [languageTag, ...rawParams] = trimmed.split(';');
        const normalized = normalizeLanguage(languageTag);

        if (!normalized) {
            continue;
        }

        let quality = 1;

        for (const param of rawParams) {
            const [key, value] = param.trim().split('=');

            if (key === 'q') {
                const parsed = Number.parseFloat(value);

                if (!Number.isNaN(parsed)) {
                    quality = parsed;
                }

                break;
            }
        }

        weightedLanguages.push({
            language: normalized,
            quality,
        });
    }

    weightedLanguages.sort((a, b) => b.quality - a.quality);

    const ordered: SupportedLanguage[] = [];
    const seen = new Set<SupportedLanguage>();

    for (const { language } of weightedLanguages) {
        if (seen.has(language)) {
            continue;
        }

        seen.add(language);
        ordered.push(language);
    }

    for (const fallback of FALLBACK_LANGUAGES) {
        if (!seen.has(fallback)) {
            ordered.push(fallback);
            seen.add(fallback);
        }
    }

    return ordered;
};

export const language = new Elysia({ name: 'language' }).derive(
    { as: 'scoped' },
    ({ request }): LanguageContext => {
        const preferredLanguages = parseAcceptLanguageHeader(
            request.headers.get('accept-language'),
        );

        return {
            preferredLanguages,
            primaryLanguage: preferredLanguages[0] ?? DEFAULT_LANGUAGE,
        };
    },
);

export { parseAcceptLanguageHeader as parseAcceptLanguage };
