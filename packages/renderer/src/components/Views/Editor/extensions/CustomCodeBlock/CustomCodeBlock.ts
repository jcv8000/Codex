import CodeBlock, { CodeBlockOptions } from "@tiptap/extension-code-block";
import { InputRule, ReactNodeViewRenderer, textblockTypeInputRule } from "@tiptap/react";
import { LowlightPlugin } from "./LowlightPlugin";
import { CustomCodeBlockWrapper } from "./Wrapper";
import { TextSelection } from "@tiptap/pm/state";

interface CustomCodeBlockOptions extends CodeBlockOptions {
    lowlight: any;
    defaultLanguage: string | null | undefined;
}

export const CustomCodeBlock = CodeBlock.extend<CustomCodeBlockOptions>({
    allowGapCursor: true,
    isolating: true, // TODO This allows the gap cursor to work, make sure there's no other side effects

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
    },

    addKeyboardShortcuts() {
        return {
            // ...this.parent?.(),
            Tab: () => {
                const { $anchor, $head } = this.editor.state.selection;
                if (
                    $anchor.parent.type.name == "codeBlock" &&
                    $head.parent.type.name == "codeBlock"
                ) {
                    if (this.editor.state.selection.empty) {
                        this.editor.view.dispatch(this.editor.state.tr.insertText("    "));
                        return true;
                    } else {
                        const state = this.editor.state;
                        const node = $anchor.parent;
                        const length = node.textContent.length;
                        const tr = state.tr;

                        const start = state.selection.$from.parentOffset;
                        const end = state.selection.$to.parentOffset;
                        const offset = state.selection.$from.pos - start - 1;

                        const _startLineStart = node.textBetween(0, start).lastIndexOf("\n");
                        const startLineStart = _startLineStart === -1 ? 0 : _startLineStart;

                        const _endLineEnd = node.textBetween(end, length).indexOf("\n");
                        const endLineEnd = _endLineEnd === -1 ? length : _endLineEnd + end;

                        const full = node.textBetween(startLineStart, endLineEnd);

                        let newFull = full.replaceAll("\n", "\n    ");
                        let charsAddedInFirstLine = 0;

                        if (start < node.textContent.indexOf("\n")) {
                            newFull = "    " + newFull;
                            charsAddedInFirstLine = 4;
                        } else if (full.startsWith("\n")) charsAddedInFirstLine = 4;

                        const charsAdded = newFull.length - full.length;

                        tr.replaceWith(
                            startLineStart + offset + 1,
                            endLineEnd + offset + 1,
                            this.editor.state.schema.text(newFull)
                        );

                        if ($anchor.pos > $head.pos) {
                            tr.setSelection(
                                TextSelection.create(
                                    tr.doc,
                                    $anchor.pos + charsAdded,
                                    $head.pos + charsAddedInFirstLine
                                )
                            );
                        } else {
                            tr.setSelection(
                                TextSelection.create(
                                    tr.doc,
                                    $anchor.pos + charsAddedInFirstLine,
                                    $head.pos + charsAdded
                                )
                            );
                        }

                        tr.scrollIntoView();
                        this.editor.view.dispatch(tr);
                        return true;
                    }
                }
                return false;
            },
            "Shift-Tab": () => {
                const { $anchor, $head } = this.editor.state.selection;
                if (
                    $anchor.parent.type.name == "codeBlock" &&
                    $head.parent.type.name == "codeBlock"
                ) {
                    // TODO replace all \t's with "    " with a plugin
                    const state = this.editor.state;
                    const node = $anchor.parent;
                    const length = node.textContent.length;
                    const tr = state.tr;

                    if (state.selection.empty) {
                        const pos = $head.parentOffset;
                        const offset = $head.pos - pos - 1;

                        const _lineStart = node.textBetween(0, pos).lastIndexOf("\n");
                        const lineStart = _lineStart === -1 ? 0 : _lineStart + 1;

                        const _lineEnd = node.textBetween(pos, length).indexOf("\n");
                        const lineEnd = _lineEnd === -1 ? length : _lineEnd + pos;

                        let line = node.textBetween(lineStart, lineEnd);

                        for (let i = 0; i < 4; i++) {
                            const c = line.charAt(0);
                            if (c == " ") {
                                tr.delete(lineStart + offset + 1, lineStart + offset + 2);
                                line = line.substring(1, line.length);
                            }
                        }

                        tr.scrollIntoView();
                        this.editor.view.dispatch(tr);
                        return true;
                    } else {
                        const start = state.selection.$from.parentOffset;
                        const end = state.selection.$to.parentOffset;
                        const offset = state.selection.$from.pos - start - 1;

                        const _startLineStart = node.textBetween(0, start).lastIndexOf("\n");
                        const startLineStart = _startLineStart === -1 ? 0 : _startLineStart;

                        const _endLineEnd = node.textBetween(end, length).indexOf("\n");
                        const endLineEnd = _endLineEnd === -1 ? length : _endLineEnd + end;

                        const full = node.textBetween(startLineStart, endLineEnd);

                        const regex = /\n {4}/gm;
                        let newFull = full.replaceAll(regex, "\n");
                        let charsLostInFirstLine = 0;

                        if (start < node.textContent.indexOf("\n")) {
                            if (newFull.startsWith("    ")) {
                                newFull = newFull.substring(4, newFull.length);
                                charsLostInFirstLine = 4;
                            }
                        } else if (full.startsWith("\n    ")) charsLostInFirstLine = 4;

                        const charsLost = full.length - newFull.length;

                        tr.replaceWith(
                            startLineStart + offset + 1,
                            endLineEnd + offset + 1,
                            this.editor.state.schema.text(newFull)
                        );

                        if ($anchor.pos > $head.pos) {
                            tr.setSelection(
                                TextSelection.create(
                                    tr.doc,
                                    Math.min($anchor.pos - charsLost, $anchor.after() - 1),
                                    Math.max($head.pos - charsLostInFirstLine, $head.before() + 1)
                                )
                            );
                        } else {
                            tr.setSelection(
                                TextSelection.create(
                                    tr.doc,
                                    Math.max(
                                        $anchor.pos - charsLostInFirstLine,
                                        $head.before() + 1
                                    ),
                                    Math.min($head.pos - charsLost, $anchor.after() - 1)
                                )
                            );
                        }

                        tr.scrollIntoView();
                        this.editor.view.dispatch(tr);
                        return true;
                    }
                }
                return false;
            }
        };
    }
});
