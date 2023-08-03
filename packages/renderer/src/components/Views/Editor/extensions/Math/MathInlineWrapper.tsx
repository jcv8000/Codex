import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import katex from "katex";
import { useMemo, useContext } from "react";
import { ModalContext } from "components/Modals";
import "katex/dist/katex.min.css";

export function MathInlineWrapper({ node, editor }: NodeViewProps) {
    const modalContext = useContext(ModalContext);

    const text = node.attrs.text as string;

    const formatText = useMemo(() => {
        return katex.renderToString(`${text}`, {
            output: "htmlAndMathml",
            throwOnError: false,
            errorColor: "red"
        });
    }, [text]);

    const content = useMemo(
        () =>
            text.trim() ? (
                <span
                    contentEditable={false}
                    dangerouslySetInnerHTML={{ __html: formatText }}
                    onDoubleClick={() => {
                        modalContext.openEditorMathModal({ editor: editor, startLatex: text });
                    }}
                    style={{
                        cursor: "pointer"
                    }}
                ></span>
            ) : (
                // eslint-disable-next-line react/jsx-no-literals
                <span contentEditable={false}>Error</span>
            ),
        [text, formatText, editor, modalContext]
    );

    return <NodeViewWrapper as="span">{content}</NodeViewWrapper>;
}
