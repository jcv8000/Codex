import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { useRef } from "react";

// Based off of https://github.com/breakerh/tiptap-image-resize/blob/main/src/component/ImageResizeComponent.tsx
export function ResizableImageWrapper({ node, updateAttributes }: NodeViewProps) {
    const imageRef = useRef<HTMLImageElement>(null);

    const handler = (mouseDownEvent: React.MouseEvent<HTMLImageElement>) => {
        const startPosition = { x: mouseDownEvent.clientX, y: mouseDownEvent.clientY };
        const startSize = { x: imageRef.current!.clientWidth, y: imageRef.current!.clientHeight };

        const maxWidth = document.getElementById("tiptap-editor")!.offsetWidth;

        function onMouseMove(e: MouseEvent) {
            let p = Math.ceil(((startSize.x - startPosition.x + e.clientX) / maxWidth) * 100);

            if (p > 100) p = 100;
            if (p < 3) p = 3;

            updateAttributes({
                width: p + "%"
            });
        }
        function onMouseUp() {
            document.body.removeEventListener("mousemove", onMouseMove);
        }

        document.body.addEventListener("mousemove", onMouseMove);
        document.body.addEventListener("mouseup", onMouseUp, { once: true });
    };

    return (
        <NodeViewWrapper>
            <div style={{ display: "flex" }}>
                <img
                    style={{ display: "inline" }}
                    ref={imageRef}
                    width={node.attrs.width}
                    src={node.attrs.src}
                    alt={node.attrs.alt}
                    title={node.attrs.title}
                />
                <span
                    style={{
                        display: "inline-flex",
                        flex: "0 0 4px",
                        flexDirection: "column",
                        cursor: "se-resize"
                    }}
                    onMouseDown={handler}
                />
            </div>
            <div
                style={{
                    display: "flex",
                    height: "4px",
                    flex: 1,
                    cursor: "se-resize"
                }}
                onMouseDown={handler}
            />
        </NodeViewWrapper>
    );
}
