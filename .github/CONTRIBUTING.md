# Contributing a new Translation/Language to Codex

All translations for the app interface are defined in [packages/common/locales](../packages/common/locales), each locale is now a separate file.

If you want to contribute your own translation/language, first fork the repository.

Go to `packages/common/locales`, copy + paste `en_US.ts` and rename it to the new locale's name, for example `es_MX.ts`

In the new file, rename the exported object from `en_US` to `es_MX`

<table><tr><th>Before</th><th>After</th></tr><tr><td>

```ts
export const en_US: Locale = {
//           ^^^^^
```

</td><td>

```ts
export const es_MX: Locale = {
//           ^^^^^
```

</td></tr></table>

**Then go through the file and replace all of the strings with your translations.**

You will need to add the locale name of your translation to `supportedLocales` which is defined in [packages/common/locales/index.ts](../packages/common/locales/index.ts).

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

Then, add your locale to the exported `locales` object:

<table><tr><th>Before</th><th>After</th></tr><tr><td>

```ts
export const locales: Record<SupportedLocales, Locale> = {
    en_US: en_US
};
```

</td><td>

```ts
import { es_MX } from "./es_MX"; // at the top of the file

export const locales: Record<SupportedLocales, Locale> = {
    en_US: en_US,
    es_MX: es_MX
};
```

</td></tr></table>

Finally, create a pull request on the original repository with your new changes.
