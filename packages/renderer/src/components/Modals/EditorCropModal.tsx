import { Button, Group, Modal } from "@mantine/core";
import { Editor } from "@tiptap/react";
import { useContext, useEffect, useRef, useState } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { AppContext } from "types/AppStore";
import { locales } from "common/Locales";

export type EditorCropModalState = {
    opened: boolean;
    editor: Editor | null;
    src: string;
};

type Props = {
    state: EditorCropModalState;
    onClose: () => void;
};

export function EditorCropModal({ state, onClose }: Props) {
    const appContext = useContext(AppContext);
    const texts = locales[appContext.prefs.general.locale].editor.cropModal;

    const [crop, setCrop] = useState<Crop>();
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (state.opened) setCrop(undefined);
    }, [state.opened]);

    const getCroppedImage = () => {
        if (!imageRef.current || !crop) return;
        const canvas = document.createElement("canvas");
        const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
        const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
        canvas.width = Math.floor(crop.width * scaleX);
        canvas.height = Math.floor(crop.height * scaleY);
        const ctx = canvas.getContext("2d");

        if (ctx) {
            ctx.drawImage(
                imageRef.current,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width * scaleX,
                crop.height * scaleY
            );

            const base64Image = canvas.toDataURL("image/png");
            if (state.editor) {
                state.editor.chain().focus().setImage({ src: base64Image }).run();
            }
        }
        onClose();
    };

    return (
        <Modal
            opened={state.opened}
            onClose={onClose}
            title={texts ? texts.title : "Crop Image"}
            centered
            size="lg"
        >
            <div style={{ textAlign: "center", maxHeight: "60vh", overflow: "auto" }}>
                <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
                    {state.src && <img ref={imageRef} src={state.src} alt="Crop preview" style={{ maxWidth: "100%" }} />}
                </ReactCrop>
            </div>
            <Group position="right" mt="md">
                <Button variant="default" onClick={onClose}>
                    {texts ? texts.cancel : "Cancel"}
                </Button>
                <Button onClick={getCroppedImage} disabled={!crop || crop.width === 0}>
                    {texts ? texts.save : "Save"}
                </Button>
            </Group>
        </Modal>
    );
}
