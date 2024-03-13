import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ResizableImageWrapper } from "./ResizableImageWrapper";

export const ResizableImage = Image.extend({
    addNodeView() {
        return ReactNodeViewRenderer(ResizableImageWrapper);
    },
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: "auto",
                renderHTML: (attributes) => {
                    return {
                        width: attributes.width
                    };
                }
            }
        };
    },
    renderHTML() {
        return ["span"];
    }
});
