import {
    Anchor,
    Button,
    Center,
    Group,
    Modal,
    SegmentedControl,
    Space,
    Textarea,
    Title
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { MathfieldElementAttributes, MathfieldElement } from "mathlive";
import { DOMAttributes, useContext, useEffect, useRef, useState } from "react";
import { Editor } from "@tiptap/core";
import { locales } from "common/Locales";
import { AppContext } from "types/AppStore";

export type EditorMathModalState = {
    opened: boolean;
    editor: Editor | null;
    startLatex: string;
};

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElements {
            "math-field": Partial<
                MathfieldElementAttributes & DOMAttributes<MathfieldElementAttributes>
            >;
        }
    }
}

export function EditorMathModal(props: { state: EditorMathModalState; onClose: () => void }) {
    const { opened, editor } = props.state;

    const { prefs } = useContext(AppContext);
    const texts = locales[prefs.general.locale].editor.mathModal;

    const [activeTab, setActiveTab] = useState("mathlive");
    const [latex, setLatex] = useState(props.state.startLatex);

    const mathRef = useRef<MathfieldElement>(null);
    const modalsManager = useModals();

    useEffect(() => {
        setLatex(props.state.startLatex);
    }, [props.state]);

    useEffect(() => {
        import("mathlive");
    }, []);

    // This is to fix the "Toggle Virtual Keyboard" tooltip going off to the right in the modal
    useEffect(() => {
        setTimeout(() => {
            if (mathRef.current && mathRef.current.shadowRoot) {
                const style = document.createElement("style");
                style.innerHTML = "[data-ml__tooltip]::after { left: auto !important; }";
                mathRef.current.shadowRoot.appendChild(style);
            }
        }, 100);
    });

    const onClose = () => {
        props.onClose();
        setLatex("");
    };
    return (
        <Modal
            size="lg"
            opened={opened}
            onClose={onClose}
            title={
                <Title order={3}>
                    {editor?.isActive("mathInline") || editor?.isActive("mathBlock")
                        ? texts.edit_math
                        : texts.insert_math}
                </Title>
            }
        >
            <Center>
                <SegmentedControl
                    value={activeTab}
                    onChange={setActiveTab}
                    data={[
                        { label: texts.visual_editor, value: "mathlive" },
                        { label: texts.manual_editor, value: "manual" }
                    ]}
                    mb="xl"
                />
            </Center>

            {activeTab == "mathlive" && (
                <math-field
                    ref={mathRef}
                    onInput={() => {
                        if (mathRef.current != null) setLatex(mathRef.current.value);
                    }}
                    sounds-directory="/node_modules/mathlive/dist/sounds"
                    fonts-directory="/node_modules/mathlive/dist/fonts"
                    default-mode="math"
                    locale={prefs.general.locale}
                    plonk-sound="none"
                    keypress-sound="none"
                    virtual-keyboard-mode="manual"
                >
                    {latex}
                </math-field>
            )}
            {activeTab == "manual" && (
                <Textarea
                    autosize
                    minRows={3}
                    value={latex}
                    onChange={(e) => setLatex(e.currentTarget.value)}
                    styles={{
                        input: {
                            fontFamily: "monospace"
                        }
                    }}
                />
            )}

            <Group position="apart" mt="md">
                <Anchor
                    onClick={() => {
                        modalsManager.openModal({
                            modalId: "editorMathModalAboutMenu",
                            size: "md",
                            title: <Title order={3}>{texts.aboutMenu.title}</Title>,
                            children: (
                                <>
                                    {texts.aboutMenu.text}

                                    <Space h="sm" />

                                    <Anchor
                                        onClick={() => window.api.openLink("mathlive_commands")}
                                    >
                                        {texts.aboutMenu.mathlive_link}
                                    </Anchor>
                                    <Space h="xs" />
                                    <Anchor onClick={() => window.api.openLink("katex_commands")}>
                                        {texts.aboutMenu.katex_link}
                                    </Anchor>
                                </>
                            )
                        });
                    }}
                >
                    {texts.about}
                </Anchor>
                <Group>
                    <Button variant="default" onClick={onClose}>
                        {texts.cancel}
                    </Button>
                    <Button
                        onClick={() => {
                            onClose();
                            setTimeout(() => {
                                if (editor?.isActive("mathInline")) {
                                    editor?.chain().focus().setMathInline({ text: latex }).run();
                                } else {
                                    editor?.chain().focus().setMathBlock({ text: latex }).run();
                                }
                            }, 100);
                        }}
                    >
                        {editor?.isActive("mathInline") || editor?.isActive("mathBlock")
                            ? texts.edit
                            : texts.insert}
                    </Button>
                </Group>
            </Group>
        </Modal>
    );
}
