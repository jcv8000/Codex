import { getAttributes, mergeAttributes } from "@tiptap/core";
import Link from "@tiptap/extension-link";
import { Plugin, PluginKey } from "@tiptap/pm/state";

export const CustomLink = Link.extend({
    renderHTML({ HTMLAttributes, mark }) {
        return [
            "a",
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                title: mark.attrs.href
            }),
            0
        ];
    },

    addProseMirrorPlugins() {
        const clickHandler = new Plugin({
            key: new PluginKey("handleClickLink"),
            props: {
                handleDOMEvents: {
                    keydown: (view, event) => {
                        if (event.key == "Control") {
                            document.querySelectorAll(".ProseMirror a").forEach((value) => {
                                const el = value as HTMLAnchorElement;

                                el.classList.add("ctrl");
                            });
                        }
                    },
                    keyup: (view, event) => {
                        if (event.key == "Control") {
                            document.querySelectorAll(".ProseMirror a").forEach((value) => {
                                const el = value as HTMLAnchorElement;

                                el.classList.remove("ctrl");
                            });
                        }
                    }
                },
                handleClick: (view, pos, event) => {
                    if (event.button !== 0) {
                        return false;
                    }

                    const eventTarget = event.target as HTMLElement;

                    if (eventTarget.nodeName !== "A") {
                        return false;
                    }

                    const attrs = getAttributes(view.state, "link");
                    const link = event.target as HTMLLinkElement;

                    const href = link?.href ?? attrs.href;
                    // const target = link?.target ?? attrs.target;

                    if (link && href) {
                        if (view.editable) {
                            // window.open(href, target);
                            if (event.ctrlKey) {
                                window.api.openExternalLink(href);
                            }
                        }

                        return true;
                    }

                    return false;
                }
            }
        });

        const oldPlugins = this.parent?.() || [];

        // Remove old click handler plugin, but keep paste handler and autolinking
        oldPlugins.splice(1, 1);

        return [...oldPlugins, clickHandler];
    }
});
