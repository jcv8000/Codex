import { Heading } from "@tiptap/extension-heading";

// TODO see if v0 saves' headers get id's generated or not
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
