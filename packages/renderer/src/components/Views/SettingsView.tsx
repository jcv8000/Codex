import {
    ActionIcon,
    Affix,
    Alert,
    Box,
    Button,
    Checkbox,
    ColorInput,
    Divider,
    Paper,
    Select,
    Space,
    Tabs,
    TextInput,
    Textarea,
    Title,
    Tooltip,
    Transition,
    useMantineTheme
} from "@mantine/core";
import { Icon } from "components/Icon";
import { useContext, useEffect, useMemo, useState } from "react";
import { hljsStyles } from "types/hljsStyles";
import { SupportedLocales, locales } from "common/Locales";
import { AppContext } from "types/AppStore";

import cpp from "highlight.js/lib/languages/cpp";
// @ts-expect-error Bad types
import Lowlight from "react-lowlight";
import { Prefs } from "common/Prefs";

type Option = {
    value: string;
    label: string;
};

export function SettingsView(props: { startPrefs: Prefs }) {
    const { prefs, modifyPrefs } = useContext(AppContext);
    const theme = useMantineTheme();
    const texts = locales[prefs.general.locale].settings;

    Lowlight.registerLanguage("cpp", cpp);
    const exampleCode =
        '#include <iostream>\n\nusing namespace std;\n\nint main(int argc, char* argv[]) {\n\n    /* An annoying "Hello World" example */\n    cout << "Hello, World!" << endl;\n\n}';

    const [customStylesJson, setCustomStylesJson] = useState(() =>
        JSON.stringify(prefs.editor.customTextStyles, null, 4)
    );
    const [customStylesError, setCustomStylesError] = useState("");

    const codeBlockThemes = useMemo(() => {
        const arr = new Array<Option>();
        hljsStyles.forEach((style) => {
            arr.push({ value: style, label: style });
        });

        return arr;
    }, []);

    const languages = new Array<Option>();
    Object.entries(locales).forEach(([id]) => {
        languages.push({ value: id, label: texts.languages[id as SupportedLocales] });
    });

    return (
        <>
            <Paper p="lg" radius="md" maw={800} mx="auto">
                <Tabs defaultValue="general" color={prefs.general.accentColor}>
                    <Tabs.List mb="md">
                        <Tabs.Tab value="general" icon={<Icon icon="settings" />}>
                            {texts.general}
                        </Tabs.Tab>
                        <Tabs.Tab value="editor" icon={<Icon icon="edit" />}>
                            {texts.editor}
                        </Tabs.Tab>
                        <Tabs.Tab value="saving" icon={<Icon icon="save" />}>
                            {texts.saving_section}
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="general" pt="xs">
                        <ColorInput
                            styles={{
                                label: {
                                    marginBottom: "4px"
                                },
                                input: {
                                    cursor: "pointer"
                                }
                            }}
                            mb="xl"
                            label={texts.accent_color}
                            disallowInput
                            value={prefs.general.accentColor}
                            onChangeEnd={(value) => {
                                modifyPrefs((p) => (p.general.accentColor = value));
                            }}
                            swatchesPerRow={7}
                            swatches={[
                                theme.colors.red[7],
                                "#ff7926", // Default orange
                                theme.colors.yellow[5],
                                theme.colors.lime[7],
                                theme.colors.green[7],
                                theme.colors.teal[7],
                                theme.colors.cyan[7],
                                theme.colors.blue[7],
                                theme.colors.indigo[7],
                                theme.colors.violet[7],
                                theme.colors.grape[7],
                                theme.colors.pink[5],
                                theme.colors.gray[7],
                                theme.colors.dark[7]
                            ]}
                            rightSection={
                                <Tooltip label="Reset to default" withArrow arrowPosition="center">
                                    <ActionIcon
                                        onClick={() =>
                                            modifyPrefs((p) => (p.general.accentColor = "#ff7926"))
                                        }
                                    >
                                        <Icon icon="refresh-dot" />
                                    </ActionIcon>
                                </Tooltip>
                            }
                        />

                        <Select
                            label={texts.language}
                            data={languages}
                            value={prefs.general.locale}
                            icon={<Icon icon="language" />}
                            onChange={(value) => {
                                modifyPrefs((p) => (p.general.locale = value as SupportedLocales));
                            }}
                        />

                        <Alert
                            p="xs"
                            mt="xs"
                            mb="xl"
                            icon={<Icon icon="alert-circle" vAlign="-3px" />}
                            color={prefs.general.accentColor}
                        >
                            {texts.contribute_language}
                        </Alert>

                        <Select
                            mb="xl"
                            label={texts.theme}
                            icon={<Icon icon="brightness-down" />}
                            data={[
                                { value: "light", label: texts.themes.light },
                                { value: "dark", label: texts.themes.dark }
                            ]}
                            value={prefs.general.theme}
                            onChange={(value) => {
                                modifyPrefs((p) => (p.general.theme = value as "light" | "dark"));
                            }}
                        />

                        <Select
                            label={texts.titlebar_style}
                            icon={<Icon icon="app-window" />}
                            data={[
                                { value: "custom", label: texts.titlebarStyles.custom },
                                { value: "native", label: texts.titlebarStyles.native }
                            ]}
                            value={prefs.general.titlebarStyle}
                            onChange={(value) => {
                                modifyPrefs(
                                    (p) => (p.general.titlebarStyle = value as "custom" | "native")
                                );
                            }}
                            disabled={window.api.isMac()}
                        />
                        <Alert
                            p="xs"
                            mt="xs"
                            mb="xl"
                            icon={<Icon icon="alert-circle" vAlign="-3px" />}
                            color={prefs.general.accentColor}
                        >
                            {texts.setting_requires_restart}
                        </Alert>
                    </Tabs.Panel>

                    <Tabs.Panel value="editor" pt="xs">
                        <Box
                            mb="xl"
                            style={{
                                borderRadius: theme.radius.sm
                            }}
                        >
                            <Lowlight language="cpp" value={exampleCode} />
                        </Box>

                        <Select
                            mb="xl"
                            label={texts.code_block_theme}
                            value={prefs.editor.codeBlockTheme}
                            data={codeBlockThemes}
                            searchable
                            icon={<Icon icon="code" />}
                            onChange={(value) => {
                                if (value != null)
                                    modifyPrefs((p) => (p.editor.codeBlockTheme = value));
                            }}
                        />

                        <Select
                            mb="xl"
                            label={texts.code_block_tab_size.label}
                            description={texts.code_block_tab_size.desc}
                            value={prefs.editor.tabSize.toString()}
                            data={[
                                { value: "4", label: texts.code_block_tab_size.four_spaces },
                                { value: "2", label: texts.code_block_tab_size.two_spaces }
                            ]}
                            icon={<Icon icon="indent-increase" />}
                            onChange={(value) => {
                                modifyPrefs((p) => (p.editor.tabSize = parseInt(value!)));
                            }}
                        />

                        <Checkbox
                            mb="xl"
                            label={texts.code_block_word_wrap}
                            checked={prefs.editor.codeWordWrap}
                            onChange={(e) => {
                                modifyPrefs(
                                    (p) => (p.editor.codeWordWrap = e.currentTarget.checked)
                                );
                            }}
                        />

                        <Select
                            mb="xl"
                            label={texts.editor_width}
                            value={prefs.editor.width}
                            data={[
                                { value: "md", label: texts.editorWidths.md },
                                { value: "lg", label: texts.editorWidths.lg },
                                { value: "xl", label: texts.editorWidths.xl }
                            ]}
                            icon={<Icon icon="viewport-wide" />}
                            onChange={(value) => {
                                modifyPrefs((p) => (p.editor.width = value as "md" | "lg" | "xl"));
                            }}
                        />

                        <Select
                            mb="xl"
                            label={texts.toolbar_size}
                            value={prefs.editor.toolbarSize}
                            data={[
                                { value: "sm", label: "Small" },
                                { value: "md", label: "Medium" },
                                { value: "lg", label: "Large" }
                            ]}
                            icon={<Icon icon="app-window" />}
                            onChange={(value) => {
                                modifyPrefs(
                                    (p) => (p.editor.toolbarSize = value as "sm" | "md" | "lg")
                                );
                            }}
                        />

                        <Checkbox
                            mb="xl"
                            label={texts.editor_border}
                            checked={prefs.editor.border}
                            onChange={(e) => {
                                modifyPrefs((p) => (p.editor.border = e.currentTarget.checked));
                            }}
                        />

                        <Checkbox
                            mb="xl"
                            label={texts.editor_spellcheck}
                            checked={prefs.editor.spellcheck}
                            onChange={(e) => {
                                modifyPrefs((p) => (p.editor.spellcheck = e.currentTarget.checked));
                            }}
                        />

                        <Checkbox
                            label={texts.use_typography_extension}
                            checked={prefs.editor.useTypographyExtension}
                            onChange={(e) => {
                                modifyPrefs(
                                    (p) =>
                                        (p.editor.useTypographyExtension = e.currentTarget.checked)
                                );
                            }}
                        />
                        <Alert
                            p="xs"
                            mt="xs"
                            mb="xl"
                            icon={<Icon icon="alert-circle" vAlign="-3px" />}
                            color={prefs.general.accentColor}
                        >
                            {texts.use_typography_description}
                        </Alert>

                        <Checkbox
                            mb="xl"
                            label={texts.open_pdf_on_export}
                            checked={prefs.editor.openPDFonExport}
                            onChange={(e) => {
                                modifyPrefs(
                                    (p) => (p.editor.openPDFonExport = e.currentTarget.checked)
                                );
                            }}
                        />

                        <Divider my="xl" variant="dashed" />

                        <Title order={6} mb="xs">
                            Custom Text Styles
                        </Title>
                        <Textarea
                            minRows={10}
                            mb="xs"
                            value={customStylesJson}
                            error={customStylesError}
                            onChange={(e) => {
                                const val = e.currentTarget.value;
                                setCustomStylesJson(val);
                                try {
                                    const parsed = JSON.parse(val);
                                    if (!parsed || typeof parsed !== "object") throw new Error();
                                    setCustomStylesError("");
                                    modifyPrefs((p) => {
                                        p.editor.customTextStyles = parsed;
                                    });
                                } catch {
                                    setCustomStylesError("Invalid JSON format");
                                }
                            }}
                        />
                        <Alert
                            p="xs"
                            mt="xs"
                            mb="xl"
                            icon={<Icon icon="info-circle" vAlign="-3px" />}
                            color="blue"
                        >
                            Define Custom Styles for the Toolbar in raw JSON map form. Reload to see
                            them.
                        </Alert>
                    </Tabs.Panel>

                    <Tabs.Panel value="saving" pt="xs">
                        <Checkbox
                            mb="xl"
                            label={texts.autosave_page_on_switch}
                            checked={prefs.general.autoSaveOnPageSwitch}
                            onChange={(e) => {
                                modifyPrefs(
                                    (p) =>
                                        (p.general.autoSaveOnPageSwitch = e.currentTarget.checked)
                                );
                            }}
                        />

                        <Checkbox
                            mb="md"
                            label={texts.autosave}
                            checked={prefs.general.autoSave}
                            onChange={(e) => {
                                modifyPrefs((p) => (p.general.autoSave = e.currentTarget.checked));
                            }}
                        />

                        <Select
                            mb="xl"
                            label={texts.autosave_interval}
                            disabled={!prefs.general.autoSave}
                            data={[
                                { value: "1", label: "1 Minute" },
                                { value: "2", label: "2 Minutes" },
                                { value: "5", label: "5 Minutes" },
                                { value: "10", label: "10 Minutes" },
                                { value: "30", label: "30 Minutes" }
                            ]}
                            value={prefs.general.autoSaveInterval.toString()}
                            onChange={(value) => {
                                modifyPrefs((p) => (p.general.autoSaveInterval = parseInt(value!)));
                            }}
                        />

                        <Divider my="xl" variant="dashed" />

                        <Title order={5} mb="md">
                            {texts.save_folder}
                        </Title>

                        <TextInput
                            label={texts.save_folder_location}
                            value={prefs.general.saveFolder}
                            readOnly
                            rightSectionWidth={68}
                            rightSection={
                                <>
                                    <Tooltip withArrow label={texts.change_save_folder_location}>
                                        <ActionIcon
                                            variant="filled"
                                            color="primary"
                                            onClick={() => {
                                                const newDir = window.api.getDirectory();

                                                if (newDir != undefined)
                                                    window.api.changeSaveLocation(newDir);
                                            }}
                                        >
                                            <Icon icon="folder-share" />
                                        </ActionIcon>
                                    </Tooltip>
                                    <Space w={4} />
                                    <Tooltip withArrow label={texts.reset_save_folder_location}>
                                        <ActionIcon
                                            variant="filled"
                                            color="primary"
                                            disabled={
                                                prefs.general.saveFolder ==
                                                window.api.getDefaultSaveLocation()
                                            }
                                            onClick={() => {
                                                window.api.changeSaveLocation(
                                                    window.api.getDefaultSaveLocation()
                                                );
                                            }}
                                        >
                                            <Icon icon="rotate-clockwise" />
                                        </ActionIcon>
                                    </Tooltip>
                                </>
                            }
                        />

                        <Alert
                            color="red"
                            p="xs"
                            mt="xs"
                            mb="xl"
                            icon={<Icon icon="alert-circle" vAlign="-3px" />}
                            title={texts.save_folder_alert_title}
                        >
                            {texts.save_folder_alert_desc}
                        </Alert>
                    </Tabs.Panel>
                </Tabs>
            </Paper>

            <Affix position={{ bottom: "20px", right: "36px" }}>
                <Transition
                    transition="slide-up"
                    mounted={props.startPrefs.general.titlebarStyle != prefs.general.titlebarStyle}
                >
                    {(transitionStyles) => (
                        <Button
                            leftIcon={<Icon icon="refresh" />}
                            style={transitionStyles}
                            onClick={window.api.restart}
                        >
                            {texts.restartToApply}
                        </Button>
                    )}
                </Transition>
            </Affix>
        </>
    );
}
