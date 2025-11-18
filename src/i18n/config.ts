export const SUPPORTED_LANGUAGES = ['en', 'ru', 'zh'] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const FALLBACK_LANGUAGES: SupportedLanguage[] = ['en'];

export const DEFAULT_LANGUAGE: SupportedLanguage = FALLBACK_LANGUAGES[0];

export interface LanguageContext extends Record<string, unknown> {
    language: SupportedLanguage;
    languages: SupportedLanguage[];
}
