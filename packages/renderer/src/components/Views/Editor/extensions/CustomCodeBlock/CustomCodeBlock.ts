import CodeBlock, { CodeBlockOptions } from "@tiptap/extension-code-block";
import { InputRule, ReactNodeViewRenderer, textblockTypeInputRule } from "@tiptap/react";
import { LowlightPlugin } from "./LowlightPlugin";
import { CustomCodeBlockWrapper } from "./Wrapper";

interface CustomCodeBlockOptions extends CodeBlockOptions {
    lowlight: any;
    defaultLanguage: string | null | undefined;
}

export const CustomCodeBlock = CodeBlock.extend<CustomCodeBlockOptions>({
    allowGapCursor: true,
    isolating: true, // TODO This allows the gap cursor to work, make sure there's no other side effects

    addKeyboardShortcuts() {
        return {
            // ...this.parent?.(),
            Tab: () => {
                this.editor.view.dispatch(this.editor.state.tr.insertText("    "));
                return true;
            }
        };
    },

    // Collapsed attribute
    // TODO see if it actually saves/reads the collapsed state when saving
    addAttributes() {
        return {
            ...this.parent?.(),
            collapsed: {
                default: false,
                parseHTML: (element: any) => {
                    return element.getAttribute("data-collapsed");
                },
                rendered: false
            }
        };
    },

    addNodeView() {
        return ReactNodeViewRenderer(CustomCodeBlockWrapper);
    },

    addOptions() {
        return {
            ...this.parent?.(),
            lowlight: {},
            defaultLanguage: null
        };
    },

    addInputRules() {
        const rules: InputRule[] = [];

        // Add input rule for each language listed in hljs
        this.options.lowlight.listLanguages().forEach((lang: string) => {
            rules.push(
                textblockTypeInputRule({
                    find: new RegExp("^```(" + lang + ")?[\\s\\n]$", "i"),
                    type: this.type,
                    getAttributes: (match) => ({
                        language: match[1]
                    })
                })
            );
            rules.push(
                textblockTypeInputRule({
                    find: new RegExp("^\\[(" + lang + ")\\]$", "i"),
                    type: this.type,
                    getAttributes: (match) => ({
                        language: match[1]
                    })
                })
            );
        });

        // Add input rules for aliases
        // REMEMBER to escape any special characters like +
        const languageAliases = new Map<string, string[]>();
        languageAliases
            .set("armasm", ["arm"])
            .set("bash", ["sh"])
            .set("c", ["h"])
            .set("coffeescript", ["coffee"])
            .set("cpp", ["c\\+\\+", "cc", "h\\+\\+", "hpp", "hh"])
            .set("csharp", ["cs", "c\\#"])
            .set("dos", ["bat", "cmd"])
            .set("dockerfile", ["docker"])
            .set("diff", ["patch"])
            .set("erlang", ["erl"])
            .set("fsharp", ["fs"])
            .set("javascript", ["js", "jsx"])
            .set("makefile", ["make", "mk"])
            .set("markdown", ["md"])
            .set("plaintext", ["text", "txt"])
            .set("powershell", ["ps"])
            .set("python", ["py"])
            .set("rust", ["rs"])
            .set("typescript", ["ts", "tsx"])
            .set("x86asm", ["x86"])
            .set("yaml", ["yml"]);

        languageAliases.forEach((aliases, lang) => {
            aliases.forEach((alias) => {
                rules.push(
                    textblockTypeInputRule({
                        find: new RegExp("^```(" + alias + ")?[\\s\\n]$", "i"),
                        type: this.type,
                        getAttributes: () => ({
                            language: lang
                        })
                    })
                );
                rules.push(
                    textblockTypeInputRule({
                        find: new RegExp("^\\[(" + alias + ")\\]$", "i"),
                        type: this.type,
                        getAttributes: () => ({
                            language: lang
                        })
                    })
                );
            });
        });

        return rules;
    },

    addProseMirrorPlugins() {
        return [
            ...(this.parent?.() || []),
            LowlightPlugin({
                name: this.name,
                lowlight: this.options.lowlight,
                defaultLanguage: this.options.defaultLanguage
            })
        ];
    }
});
