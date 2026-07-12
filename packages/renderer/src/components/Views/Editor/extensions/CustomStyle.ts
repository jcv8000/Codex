import { Extension } from "@tiptap/core";
import "@tiptap/extension-text-style";

export type CustomStyleOptions = {
    types: string[];
    customStyles: Record<string, Record<string, string>>;
};

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        customStyle: {
            setCustomStyle: (styleName: string) => ReturnType;
            unsetCustomStyle: () => ReturnType;
        };
    }
}

export const CustomStyle = Extension.create<CustomStyleOptions>({
    name: "customStyle",

    addOptions() {
        return {
            types: ["textStyle", "paragraph", "heading"],
            customStyles: {}
        };
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    customStyleName: {
                        default: null,
                        parseHTML: (element) => element.getAttribute("data-custom-style"),
                        renderHTML: (attributes) => {
                            const stylesConfig = this.options.customStyles;
                            if (!attributes.customStyleName || !stylesConfig[attributes.customStyleName]) {
                                return {};
                            }
                            const cssObj = stylesConfig[attributes.customStyleName];
                            const styleString = Object.keys(cssObj)
                                .filter(v => v !== "tag" && v !== "type")
                                .map((v) => `${v}: ${cssObj[v]}`)
                                .join("; ");
                            return {
                                style: styleString,
                                "data-custom-style": attributes.customStyleName
                            };
                        }
                    }
                }
            }
        ];
    },

    addCommands() {
        return {
            setCustomStyle:
                (styleName) =>
                ({ chain, state }) => {
                    const { selection } = state;
                    if (selection.empty) {
                        return chain()
                            .updateAttributes("paragraph", { customStyleName: styleName })
                            .updateAttributes("heading", { customStyleName: styleName })
                            .run();
                    } else {
                        return chain()
                            .setMark("textStyle", { customStyleName: styleName })
                            .run();
                    }
                },
            unsetCustomStyle:
                () =>
                ({ chain, state }) => {
                    const { selection } = state;
                    if (selection.empty) {
                        return chain()
                            .updateAttributes("paragraph", { customStyleName: null })
                            .updateAttributes("heading", { customStyleName: null })
                            .run();
                    } else {
                        return chain()
                            .setMark("textStyle", { customStyleName: null })
                            .removeEmptyTextStyle()
                            .run();
                    }
                }
        };
    }
});
