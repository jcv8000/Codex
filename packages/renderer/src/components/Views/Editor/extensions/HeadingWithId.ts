import { Heading } from "@tiptap/extension-heading";

export const HeadingWithId = Heading.extend({
    addAttributes() {
        return {
            id: {
                default: null
            },
            level: {
                default: 1
            }
        };
    }
});
