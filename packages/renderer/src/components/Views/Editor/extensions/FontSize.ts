import "@tiptap/extension-text-style";

import { Extension } from "@tiptap/core";

export type FontSizeOptions = {
    types: string[];
};

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        fontSize: {
            setFontSize: (size: number) => ReturnType;
            unsetFontSize: () => ReturnType;
        };
    }
}

export const FontSize = Extension.create<FontSizeOptions>({
    name: "fontSize",

    addOptions() {
        return {
            types: ["textStyle"]
        };
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontSize: {
                        default: 13,
                        parseHTML: (element) => element.style.fontSize,
                        renderHTML: (attributes) => {
                            if (!attributes.fontSize) {
                                return {};
                            }

                            return {
                                style: `font-size: ${attributes.fontSize}px`
                            };
                        }
                    }
                }
            }
        ];
    },

    addCommands() {
        return {
            setFontSize:
                (size) =>
                ({ chain }) => {
                    return chain().setMark("textStyle", { fontSize: size }).run();
                },
            unsetFontSize:
                () =>
                ({ chain }) => {
                    return chain()
                        .setMark("textStyle", { fontSize: null })
                        .removeEmptyTextStyle()
                        .run();
                }
        };
    }
});
