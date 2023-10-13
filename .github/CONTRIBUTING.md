# Contributing a new Translation/Language to Codex

All translations for the app interface are defined in [packages/common/Locales.ts](../packages/common/Locales.ts)

If you want to contribute your own translation/language, first fork the repository, and then edit `packages/common/Locales.ts`.

The first object in the file is a `Locale` type which defines all of the text variables used in the app. You don't need to change this at all.

You will need to add the locale name of your translation to `supportedLocales`. For example if you were adding Spanish (Mexico) you would add `"es_MX"` to the array:

 <table><tr><th>Before</th><th>After</th></tr><tr><td>

```ts
export const supportedLocales = ["en_US"] as const;
//                               ^^^^^^^
```

</td><td>

```ts
export const supportedLocales = ["en_US", "es_MX"] as const;
//                               ^^^^^^^^^^^^^^^^
```

</td></tr></table>

The next line generates a type from the array (you don't have to change this):

```ts
export type SupportedLocales = (typeof supportedLocales)[number]; // would be: "en_US" | "es_MX"
```

Then, the last object in the file is `export const locales`. Select the entire `en_US: { ... }` object and copy/paste it below:

<table><tr><th>Before</th><th>After</th></tr><tr><td>

```ts
export const locales: Record<SupportedLocales, Locale> = {
    en_US: { ... }
};
```

</td><td>

```ts
export const locales: Record<SupportedLocales, Locale> = {
    en_US: { ... },
    es_MX: { ... } // New translation
};
```

</td></tr></table>

Then you can go through the new object and change the strings to your own translation.

Finally, create a pull request on the original repository with your new changes.
