import { Extensions } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Focus from "@tiptap/extension-focus";
import { createLowlight, all as lowlightAll } from "lowlight";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Typography from "@tiptap/extension-typography";
import FontFamily from "@tiptap/extension-font-family";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Underline from "@tiptap/extension-underline";
import { HeadingWithId } from "./extensions/HeadingWithId";
import { MathBlock, MathInline } from "./extensions/Math";
import { CustomCodeBlock } from "./extensions/CustomCodeBlock";
import { Markdown } from "tiptap-markdown";
import { FontSize } from "./extensions/FontSize";

export function extensions(options: { useTypography: boolean }) {
    const e = [
        StarterKit.configure({
            codeBlock: false,
            heading: false,
            code: {
                HTMLAttributes: {
                    class: "hljs",
                    spellCheck: false
                }
            }
        }),
        Focus.configure({
            mode: "deepest"
        }),
        HeadingWithId,
        Placeholder.configure({
            placeholder: "Start typing..."
        }),
        CustomCodeBlock.configure({
            lowlight: createLowlight(lowlightAll)
        }),
        Image.configure({
            allowBase64: true
        }),
        Table.configure({
            // resizable: true,
            // lastColumnResizable: false,
            // allowTableNodeSelection: true
        }),
        TableRow,
        TableHeader,
        TableCell,
        TaskList,
        TaskItem.configure({
            nested: true
        }),
        TextStyle,
        FontFamily,
        Color,
        Highlight.configure({
            multicolor: true
        }),
        Link.configure({
            openOnClick: false
        }),
        TextAlign.configure({
            types: ["heading", "paragraph"]
        }),
        Subscript,
        Superscript,
        Underline,
        MathBlock,
        MathInline,
        //Canvas,
        Markdown.configure({
            html: true
        }),
        FontSize
    ] as Extensions;

    if (options.useTypography) e.push(Typography);

    return e;
}
