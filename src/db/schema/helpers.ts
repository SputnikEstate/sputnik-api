import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../../i18n/config';

type CapitalizeLanguage<Lang extends string> =
    Lang extends `${infer First}${infer Rest}`
        ? `${Uppercase<First>}${Rest}`
        : Lang;

export type TranslationColumns<Base extends string, Builder> = {
    [Key in Base | `${Base}${CapitalizeLanguage<SupportedLanguage>}`]: Builder;
};

type Values<T> = T[keyof T];

type UnionToIntersection<U> = (
    U extends unknown
        ? (k: U) => void
        : never
) extends (k: infer I) => void
    ? I
    : never;

type TranslationPropertyName<Base extends string> =
    `${Base}${CapitalizeLanguage<SupportedLanguage>}`;

export interface TranslationColumnFactoryContext<Base extends string> {
    column: string;
    propertyName: Base | TranslationPropertyName<Base>;
    language?: SupportedLanguage;
}

const capitalizeLanguage = (language: SupportedLanguage): string =>
    language.charAt(0).toUpperCase() + language.slice(1);

const toSnakeCase = (value: string): string =>
    value
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
        .replace(/[\s-]+/g, '_')
        .toLowerCase();

export const translateColumn = <Base extends string, Builder>(
    base: Base,
    factory: (context: TranslationColumnFactoryContext<Base>) => Builder,
): TranslationColumns<Base, Builder> => {
    const columns: Record<string, Builder> = {};
    const baseColumn = toSnakeCase(base);

    columns[base] = factory({
        column: baseColumn,
        propertyName: base,
    });

    for (const language of SUPPORTED_LANGUAGES) {
        const propertyName = `${base}${capitalizeLanguage(
            language,
        )}` as TranslationPropertyName<Base>;
        const column = `${baseColumn}_${language}`;
        columns[propertyName] = factory({
            column,
            propertyName,
            language,
        });
    }

    return columns as TranslationColumns<Base, Builder>;
};

export const merge = <Columns extends Record<string, Record<string, unknown>>>(
    columns: Columns,
): UnionToIntersection<Values<Columns>> => {
    const merged = Object.assign({}, ...Object.values(columns));

    return merged as UnionToIntersection<Values<Columns>>;
};

type ExtractTranslationColumnsMap<
    Definitions extends Record<
        string,
        (context: TranslationColumnFactoryContext<string>) => unknown
    >,
> = {
    [K in keyof Definitions & string]: TranslationColumns<
        K,
        ReturnType<Definitions[K]>
    >;
};

export const translate = <
    Definitions extends Record<
        string,
        (context: TranslationColumnFactoryContext<string>) => unknown
    >,
>(
    definitions: Definitions,
) => {
    const keys = Object.keys(definitions) as Array<keyof Definitions & string>;
    const groups: Partial<ExtractTranslationColumnsMap<Definitions>> = {};

    for (const key of keys) {
        const factory = definitions[key];
        groups[key] = translateColumn(
            key,
            factory as (
                context: TranslationColumnFactoryContext<typeof key>,
            ) => ReturnType<Definitions[typeof key]>,
        );
    }

    const typedGroups = groups as ExtractTranslationColumnsMap<Definitions>;

    return {
        columns: merge(typedGroups),
        fields: keys,
        groups: typedGroups,
    };
};
