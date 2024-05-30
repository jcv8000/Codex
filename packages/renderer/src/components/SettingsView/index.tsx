import {
    ActionIcon,
    Alert,
    Checkbox,
    ColorInput,
    Container,
    Fieldset,
    MantineSpacing,
    Select,
    Space,
    StyleProp,
    TextInput,
    Title,
    Tooltip
} from "@mantine/core";
import { codexStore, useLocale, useSnapshot, writePrefs } from "src/state";
import { renderDebug } from "common/Utils";
import { Icon } from "components/Icon";
import { Locale, SupportedLocales, locales } from "common/locales";
import { hljsStyles } from "./hljs_styles";
import { ExampleCode } from "./exampleCode";
import { Prefs } from "common/schemas/v2";

type Option = {
    value: string;
    label: string;
};

type SubComponentProps = {
    texts: Locale["settings"];
    prefs: Readonly<Prefs>;
    margin: StyleProp<MantineSpacing>;
};

export function SettingsView() {
    renderDebug("SettingsView");

    const texts = useLocale().settings;
    const { prefs } = useSnapshot(codexStore);
    const margin: StyleProp<MantineSpacing> = "md";

    return (
        <Container size="sm" my="xl">
            <Fieldset mb={margin} legend={<Title order={2}>{texts.general}</Title>}>
                <AccentColorSetting texts={texts} prefs={prefs} margin={margin} />
                <LanguageSetting texts={texts} prefs={prefs} margin={margin} />
                <ThemeSetting texts={texts} prefs={prefs} margin={margin} />
                <TitlebarSetting texts={texts} prefs={prefs} margin={margin} />
                <AutoSavePageOnSwitchSetting texts={texts} prefs={prefs} margin={0} />
            </Fieldset>

            <Fieldset mb={margin} legend={<Title order={2}>{texts.editor}</Title>}>
                <CodeThemeSetting texts={texts} prefs={prefs} margin={margin} />
                <CodeBlockTabSizeSetting texts={texts} prefs={prefs} margin={margin} />
                <CodeBlockWordWrapSetting texts={texts} prefs={prefs} margin={margin} />
                <EditorWidthSetting texts={texts} prefs={prefs} margin={margin} />
                <EditorBorderSetting texts={texts} prefs={prefs} margin={margin} />
                <EditorSpellcheckSetting texts={texts} prefs={prefs} margin={margin} />
                <EditorTypographySetting texts={texts} prefs={prefs} margin={margin} />
                <OpenPDFOnExportSetting texts={texts} prefs={prefs} margin={0} />
            </Fieldset>

            <Fieldset mb={margin} legend={<Title order={2}>{texts.save_folder}</Title>}>
                <SaveFolderSetting texts={texts} prefs={prefs} margin={0} />
            </Fieldset>
        </Container>
    );
}

function AccentColorSetting({ texts, prefs, margin }: SubComponentProps) {
    return (
        <ColorInput
            mb={margin}
            label={texts.accent_color}
            value={prefs.general.accentColor}
            onChangeEnd={(v) => {
                codexStore.prefs.general.accentColor = v;
                writePrefs();
            }}
            disallowInput
            format="hex"
            swatches={[
                "#1a1a1a",
                "#868e96",
                "#fa5252",
                "#e64980",
                "#be4bdb",
                "#7950f2",
                "#4c6ef5",
                "#228be6",
                "#15aabf",
                "#12b886",
                "#40c057",
                "#82c91e",
                "#fab005",
                "#ff7926"
            ]}
            rightSection={
                <Tooltip label={<>Reset to default</>} withArrow arrowPosition="center">
                    <ActionIcon
                        variant="subtle"
                        color="accent.5"
                        // onClick={() => modifyPrefs((p) => (p.general.accentColor = "#ff7926"))}
                        onClick={() => {
                            codexStore.prefs.general.accentColor = "#ff7926";
                            writePrefs();
                        }}
                    >
                        <Icon icon="refresh-dot" />
                    </ActionIcon>
                </Tooltip>
            }
        />
    );
}

function LanguageSetting({ texts, prefs, margin }: SubComponentProps) {
    const languages = new Array<Option>();
    Object.entries(locales).forEach(([id]) => {
        languages.push({ value: id, label: texts.languages[id as SupportedLocales] });
    });

    return (
        <>
            <Select
                label={texts.language}
                data={languages}
                value={prefs.general.locale}
                leftSection={<Icon icon="language" />}
                onChange={(value) => {
                    codexStore.prefs.general.locale = value as SupportedLocales;
                    writePrefs();
                }}
            />

            <Alert
                p="xs"
                mb={margin}
                mt="xs"
                icon={<Icon icon="alert-circle" vAlign="-3px" />}
                color={prefs.general.accentColor}
            >
                {texts.contribute_language}
            </Alert>
        </>
    );
}

function ThemeSetting({ texts, prefs, margin }: SubComponentProps) {
    return (
        <Select
            mb={margin}
            label={texts.theme}
            leftSection={<Icon icon="brightness-down" />}
            data={[
                { value: "light", label: texts.themes.light },
                { value: "dark", label: texts.themes.dark }
            ]}
            value={prefs.general.theme}
            onChange={(value) => {
                if (value == null) return;
                codexStore.prefs.general.theme = value as "light" | "dark";
                writePrefs();
            }}
        />
    );
}

function TitlebarSetting({ texts, prefs, margin }: SubComponentProps) {
    return (
        <>
            <Select
                label={texts.titlebar_style}
                leftSection={<Icon icon="app-window" />}
                data={[
                    { value: "custom", label: texts.titlebarStyles.custom },
                    { value: "native", label: texts.titlebarStyles.native }
                ]}
                value={prefs.general.titlebarStyle}
                onChange={(value) => {
                    if (value == null) return;
                    codexStore.prefs.general.titlebarStyle = value as "custom" | "native";
                    writePrefs();
                }}
                disabled={window.platform === "darwin"}
            />
            <Alert
                p="xs"
                mb={margin}
                mt="xs"
                icon={<Icon icon="alert-circle" vAlign="-3px" />}
                color={prefs.general.accentColor}
            >
                {texts.setting_requires_restart}
            </Alert>
        </>
    );
}

function AutoSavePageOnSwitchSetting({ texts, prefs, margin }: SubComponentProps) {
    return (
        <Checkbox
            mb={margin}
            label={texts.autosave_page_on_switch}
            checked={prefs.general.autoSaveOnPageSwitch}
            onChange={(e) => {
                codexStore.prefs.general.autoSaveOnPageSwitch = e.currentTarget.checked;
                writePrefs();
            }}
        />
    );
}

function CodeThemeSetting({ texts, prefs, margin }: SubComponentProps) {
    const codeBlockThemes = hljsStyles.map<Option>((s) => ({ value: s, label: s }));

    return (
        <>
            <ExampleCode />

            <Select
                mb={margin}
                label={texts.code_block_theme}
                value={prefs.editor.codeBlockTheme}
                data={codeBlockThemes}
                searchable
                leftSection={<Icon icon="code" />}
                onChange={(value) => {
                    if (value == null) return;
                    codexStore.prefs.editor.codeBlockTheme = value;
                    writePrefs();
                }}
            />
        </>
    );
}

function CodeBlockTabSizeSetting({ texts, prefs, margin }: SubComponentProps) {
    return (
        <Select
            mb={margin}
            label={texts.code_block_tab_size.label}
            description={texts.code_block_tab_size.desc}
            value={prefs.editor.tabSize.toString()}
            data={[
                { value: "4", label: texts.code_block_tab_size.four_spaces },
                { value: "2", label: texts.code_block_tab_size.two_spaces }
            ]}
            leftSection={<Icon icon="indent-increase" />}
            onChange={(value) => {
                if (value == null) return;
                const n = parseInt(value);
                if (Number.isInteger(n)) {
                    codexStore.prefs.editor.tabSize = n;
                    writePrefs();
                }
            }}
        />
    );
}

function CodeBlockWordWrapSetting({ texts, prefs, margin }: SubComponentProps) {
    return (
        <Checkbox
            mb={margin}
            label={texts.code_block_word_wrap}
            checked={prefs.editor.codeWordWrap}
            onChange={(e) => {
                codexStore.prefs.editor.codeWordWrap = e.currentTarget.checked;
                writePrefs();
            }}
        />
    );
}

function EditorWidthSetting({ texts, prefs, margin }: SubComponentProps) {
    return (
        <Select
            mb={margin}
            label={texts.editor_width}
            value={prefs.editor.width}
            data={[
                { value: "md", label: texts.editorWidths.md },
                { value: "lg", label: texts.editorWidths.lg },
                { value: "xl", label: texts.editorWidths.xl }
            ]}
            leftSection={<Icon icon="viewport-wide" />}
            onChange={(value) => {
                if (value == null) return;
                codexStore.prefs.editor.width = value as "md" | "lg" | "xl";
                writePrefs();
            }}
        />
    );
}

function EditorBorderSetting({ texts, prefs, margin }: SubComponentProps) {
    return (
        <Checkbox
            mb={margin}
            label={texts.editor_border}
            checked={prefs.editor.border}
            onChange={(e) => {
                codexStore.prefs.editor.border = e.currentTarget.checked;
                writePrefs();
            }}
        />
    );
}

function EditorSpellcheckSetting({ texts, prefs, margin }: SubComponentProps) {
    return (
        <Checkbox
            mb={margin}
            label={texts.editor_spellcheck}
            checked={prefs.editor.spellcheck}
            onChange={(e) => {
                codexStore.prefs.editor.spellcheck = e.currentTarget.checked;
                writePrefs();
            }}
        />
    );
}

function EditorTypographySetting({ texts, prefs, margin }: SubComponentProps) {
    return (
        <>
            <Checkbox
                label={texts.use_typography_extension}
                checked={prefs.editor.useTypographyExtension}
                onChange={(e) => {
                    codexStore.prefs.editor.useTypographyExtension = e.currentTarget.checked;
                    writePrefs();
                }}
            />
            <Alert
                p="xs"
                mb={margin}
                mt="xs"
                icon={<Icon icon="alert-circle" vAlign="-3px" />}
                color={prefs.general.accentColor}
            >
                {texts.use_typography_description}
            </Alert>
        </>
    );
}

function OpenPDFOnExportSetting({ texts, prefs, margin }: SubComponentProps) {
    return (
        <Checkbox
            mb={margin}
            label={texts.open_pdf_on_export}
            checked={prefs.editor.openPDFonExport}
            onChange={(e) => {
                codexStore.prefs.editor.openPDFonExport = e.currentTarget.checked;
                writePrefs();
            }}
        />
    );
}

function SaveFolderSetting({ texts, prefs, margin }: SubComponentProps) {
    return (
        <>
            <TextInput
                label={texts.save_folder_location}
                value={prefs.general.saveFolder}
                readOnly
                rightSectionWidth={68}
                rightSection={
                    <>
                        <Tooltip withArrow label={texts.change_save_folder_location}>
                            <ActionIcon
                                onClick={async () => {
                                    const newDir = await window.ipc.invoke("get-directory");
                                    if (newDir == undefined) return;

                                    window.ipc.invoke("change-save-location", newDir);
                                }}
                            >
                                <Icon icon="folder-share" />
                            </ActionIcon>
                        </Tooltip>
                        <Space w={4} />
                        <Tooltip withArrow label={texts.reset_save_folder_location}>
                            <ActionIcon
                                disabled={prefs.general.saveFolder == window.defaultSaveLocation}
                                onClick={() => {
                                    window.ipc.invoke("reset-to-default-save-location");
                                }}
                            >
                                <Icon icon="rotate-clockwise" />
                            </ActionIcon>
                        </Tooltip>
                    </>
                }
            />

            <Alert
                mb={margin}
                mt="xs"
                p="xs"
                color="red.5"
                icon={<Icon icon="alert-circle" vAlign="-3px" />}
                title={texts.save_folder_alert_title}
            >
                {texts.save_folder_alert_desc}
            </Alert>
        </>
    );
}
