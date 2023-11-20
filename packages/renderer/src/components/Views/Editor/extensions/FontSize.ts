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
                        parseHTML: (element) => {
                            const size = element.style.fontSize;
                            if (size.endsWith("px")) return size.substring(0, size.length - 2);
                            return size;
                        },
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
