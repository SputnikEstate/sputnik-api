import {
    DEFAULT_LANGUAGE,
    FALLBACK_LANGUAGES,
    SUPPORTED_LANGUAGES,
    type SupportedLanguage,
} from '../../i18n/config';

type CapitalizeLanguage<Lang extends string> =
    Lang extends `${infer First}${infer Rest}`
        ? `${Uppercase<First>}${Rest}`
        : Lang;

type TranslationPropertyName<Field extends string> =
    `${Field}${CapitalizeLanguage<SupportedLanguage>}`;

type WithoutTranslationFields<
    RecordType extends Record<string, unknown>,
    Field extends string,
> = Omit<RecordType, TranslationPropertyName<Field>>;

const SUPPORTED_LANGUAGE_SET = new Set<SupportedLanguage>(SUPPORTED_LANGUAGES);

const capitalizeLanguage = (language: SupportedLanguage): string =>
    language.charAt(0).toUpperCase() + language.slice(1);

const buildTranslationPropertyName = <Field extends string>(
    field: Field,
    language: SupportedLanguage,
): TranslationPropertyName<Field> =>
    `${field}${capitalizeLanguage(language)}` as TranslationPropertyName<Field>;

export const resolvePreferredLanguages = (
    preferred?: readonly SupportedLanguage[],
): SupportedLanguage[] => {
    const languages: SupportedLanguage[] = [];
    const seen = new Set<SupportedLanguage>();

    const append = (language: SupportedLanguage) => {
        if (!SUPPORTED_LANGUAGE_SET.has(language) || seen.has(language)) {
            return;
        }

        seen.add(language);
        languages.push(language);
    };

    if (preferred) {
        for (const language of preferred) {
            append(language);
        }
    }

    for (const fallback of FALLBACK_LANGUAGES) {
        append(fallback);
    }

    if (languages.length === 0) {
        append(DEFAULT_LANGUAGE);
    }

    return languages;
};

const hasTranslationValue = (value: unknown): boolean => {
    if (value === null || value === undefined) {
        return false;
    }

    if (typeof value === 'string') {
        return value.trim().length > 0;
    }

    if (Array.isArray(value)) {
        return value.length > 0;
    }

    if (typeof value === 'object') {
        return Object.keys(value as Record<string, unknown>).length > 0;
    }

    return true;
};

export interface ApplyModelTranslationOptions<Field extends string> {
    fields: readonly Field[];
    languages?: readonly SupportedLanguage[];
}

function applyModelTranslationsToRecord<
    RecordType extends Record<string, unknown>,
    Field extends string,
>(
    record: RecordType,
    { fields, languages }: ApplyModelTranslationOptions<Field>,
): WithoutTranslationFields<RecordType, Field> {
    const lngs = resolvePreferredLanguages(languages);
    const result: Record<string, unknown> = { ...record };

    for (const field of fields) {
        let resolved: unknown;

        for (const language of lngs) {
            const propertyName = buildTranslationPropertyName(field, language);

            if (propertyName in record) {
                const candidate = (record as Record<string, unknown>)[
                    propertyName
                ];

                if (hasTranslationValue(candidate)) {
                    resolved = candidate;
                    break;
                }
            }
        }

        if (!hasTranslationValue(resolved) && field in record) {
            const fallback = (record as Record<string, unknown>)[field];

            if (hasTranslationValue(fallback)) {
                resolved = fallback;
            }
        }

        if (resolved !== undefined) {
            result[field] = resolved;
        }

        for (const language of SUPPORTED_LANGUAGES) {
            delete result[buildTranslationPropertyName(field, language)];
        }
    }

    return result as WithoutTranslationFields<RecordType, Field>;
}

export function applyModelTranslations<
    RecordType extends Record<string, unknown>,
    Field extends string,
>(
    records: RecordType[],
    options: ApplyModelTranslationOptions<Field>,
): Array<WithoutTranslationFields<RecordType, Field>>;
export function applyModelTranslations<
    RecordType extends Record<string, unknown>,
    Field extends string,
>(
    record: RecordType,
    options: ApplyModelTranslationOptions<Field>,
): WithoutTranslationFields<RecordType, Field>;
export function applyModelTranslations<
    RecordType extends Record<string, unknown>,
    Field extends string,
>(
    input: RecordType | RecordType[],
    options: ApplyModelTranslationOptions<Field>,
) {
    if (Array.isArray(input)) {
        return input.map((record) =>
            applyModelTranslationsToRecord(record, options),
        );
    }

    return applyModelTranslationsToRecord(input, options);
}

type TranslationSelectKeys<Table, Field extends string> = Extract<
    keyof Table,
    Field | TranslationPropertyName<Field>
>;

type TranslationSelect<Table, Field extends string> = Pick<
    Table,
    TranslationSelectKeys<Table, Field>
>;

export const selectTranslationColumns = <
    Table,
    Field extends Extract<keyof Table, string>,
>(
    table: Table,
    fields: readonly Field[],
    preferredLanguages?: readonly SupportedLanguage[],
): TranslationSelect<Table, Field> => {
    const tableRecord = table as Record<string, unknown>;
    const selection = {} as TranslationSelect<Table, Field>;
    const selectionRecord = selection as Record<string, unknown>;
    const languages = preferredLanguages
        ? resolvePreferredLanguages(preferredLanguages)
        : [...SUPPORTED_LANGUAGES];

    for (const field of fields) {
        selectionRecord[field] = tableRecord[field];

        for (const language of languages) {
            const propertyName = buildTranslationPropertyName(field, language);
            selectionRecord[propertyName] = tableRecord[propertyName];
        }
    }

    return selection;
};
