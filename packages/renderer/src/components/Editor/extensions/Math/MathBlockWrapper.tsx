import katex from "katex";
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { useMemo } from "react";
import { modalStore } from "src/state";

export function MathBlockWrapper({ node, editor }: NodeViewProps) {
    const text = node.attrs.text as string;

    const formatText = useMemo(() => {
        return katex.renderToString(`${text}`, {
            output: "htmlAndMathml",
            displayMode: true,
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
                        modalStore.editorMathModalState = {
                            opened: true,
                            editor: editor,
                            startLatex: text
                        };
                    }}
                    style={{
                        fontSize: "16px",
                        cursor: "pointer"
                    }}
                ></span>
            ) : (
                // eslint-disable-next-line react/jsx-no-literals
                <span contentEditable={false}>Error</span>
            ),
        [text, formatText, editor]
    );

    return <NodeViewWrapper>{content}</NodeViewWrapper>;
}
