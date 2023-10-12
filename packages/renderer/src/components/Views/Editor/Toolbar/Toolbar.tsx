import {
    Button,
    CloseButton,
    ColorPicker,
    DEFAULT_THEME,
    Flex,
    Menu,
    Paper,
    Select,
    Space
} from "@mantine/core";
import { Editor } from "@tiptap/react";
import { Icon } from "components/Icon";
import { ModalContext } from "components/Modals";
import { ToolbarButton } from "./ToolbarButton";
import { ToolbarDropdown } from "./ToolbarDropdown";
import { ToolbarSplit } from "./ToolbarSplit";
import { useContext, useEffect, useMemo, useState } from "react";
import { createLowlight, all as lowlightAll } from "lowlight";
import { AppContext } from "types/AppStore";
import { locales } from "common/Locales";
import { ToolbarToggler } from "./ToolbarToggler";
import { BUTTON_WIDTH, BUTTON_HEIGHT, SPACING_W } from "./Constants";

type Props = {
    editor: Editor;
};

export default function Toolbar({ editor }: Props) {
    const appContext = useContext(AppContext);
    const modalContext = useContext(ModalContext);
    const texts = locales[appContext.prefs.general.locale].editor.toolbar;

    const languages = useMemo(() => {
        return createLowlight(lowlightAll).listLanguages().sort();
    }, []);

    const [recentLangs, setRecentLangs] = useState(appContext.prefs.editor.recentCodeLangs);
    const [show, setShow] = useState(true);

    useEffect(() => {
        window.api.onToggleEditorToolbar(() => setShow(!show));
    }, [show]);

    const recentLangList: JSX.Element[] = [];
    recentLangs.forEach((lang) => {
        recentLangList.push(
            <Menu.Item
                icon={<Icon icon="clock" />}
                key={lang}
                onClick={() => editor.chain().focus().toggleCodeBlock({ language: lang }).run()}
                rightSection={
                    <CloseButton
                        onClick={(e) => {
                            e.stopPropagation();

                            const newRecentLangs = [...recentLangs];
                            newRecentLangs.splice(newRecentLangs.indexOf(lang), 1);
                            setRecentLangs(newRecentLangs);

                            appContext.modifyPrefs(
                                (p) => (p.editor.recentCodeLangs = newRecentLangs)
                            );
                        }}
                    />
                }
            >
                {lang}
            </Menu.Item>
        );
    });

    return (
        <>
            <ToolbarToggler onClick={() => setShow(!show)} />
            <div
                style={{
                    display: show ? "block" : "none",
                    position: "sticky",
                    top: "0px",
                    zIndex: 200,
                    marginLeft: "64px",
                    marginRight: "64px"
                }}
            >
                <Paper
                    shadow="sm"
                    radius="md"
                    p={6}
                    withBorder
                    style={{
                        width: "fit-content",
                        marginLeft: "auto",
                        marginRight: "auto"
                    }}
                >
                    <Flex gap={6} justify="center" align="center" direction="row" wrap="wrap">
                        <ToolbarButton
                            title={texts.undo}
                            icon="arrow-back-up"
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={() => !editor.can().undo()}
                        />
                        <ToolbarButton
                            title={texts.redo}
                            icon="arrow-forward-up"
                            onClick={() => editor.chain().focus().redo().run()}
                            disabled={() => !editor.can().redo()}
                        />

                        <Space w={SPACING_W} />

                        <ToolbarButton
                            title={texts.bold}
                            icon="bold"
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            isActive={() => editor.isActive("bold")}
                        />
                        <ToolbarButton
                            title={texts.italic}
                            icon="italic"
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            isActive={() => editor.isActive("italic")}
                        />
                        <ToolbarButton
                            title={texts.underline}
                            icon="underline"
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            isActive={() => editor.isActive("underline")}
                        />
                        <ToolbarButton
                            title={texts.strikethrough}
                            icon="strikethrough"
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            isActive={() => editor.isActive("strike")}
                        />
                        <ToolbarButton
                            title={texts.inline_code}
                            icon="code"
                            onClick={() => editor.chain().focus().toggleCode().run()}
                            isActive={() => editor.isActive("code")}
                        />
                        <ToolbarButton
                            title={texts.superscript}
                            icon="superscript"
                            onClick={() => editor.chain().focus().toggleSuperscript().run()}
                            isActive={() => editor.isActive("superscript")}
                        />
                        <ToolbarButton
                            title={texts.subscript}
                            icon="subscript"
                            onClick={() => editor.chain().focus().toggleSubscript().run()}
                            isActive={() => editor.isActive("subscript")}
                        />
                        <ToolbarButton
                            title={texts.link}
                            icon="link"
                            isActive={() => editor.isActive("link")}
                            disabled={() => editor.view.state.selection.empty}
                            onClick={() => {
                                if (editor.isActive("link"))
                                    modalContext.openEditorLinkModal({
                                        editor: editor,
                                        initialUrl: editor.getAttributes("link").href
                                    });
                                else
                                    modalContext.openEditorLinkModal({
                                        editor: editor,
                                        initialUrl: ""
                                    });
                            }}
                        />

                        <Space w={SPACING_W} />

                        <ToolbarButton
                            title={texts.align_left}
                            icon="align-left"
                            onClick={() => editor.chain().focus().setTextAlign("left").run()}
                        />

                        <ToolbarButton
                            title={texts.align_center}
                            icon="align-center"
                            onClick={() => editor.chain().focus().setTextAlign("center").run()}
                        />

                        <ToolbarButton
                            title={texts.align_right}
                            icon="align-right"
                            onClick={() => editor.chain().focus().setTextAlign("right").run()}
                        />

                        <ToolbarButton
                            title={texts.align_justified}
                            icon="align-justified"
                            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                        />

                        <Space w={SPACING_W} />

                        <ToolbarButton
                            title={texts.image}
                            icon="photo-plus"
                            onClick={() => modalContext.openEditorImageModal({ editor: editor })}
                        />

                        <ToolbarButton
                            title={texts.paragraph}
                            icon="pilcrow"
                            onClick={() => editor.chain().focus().setParagraph().run()}
                        />
                        <ToolbarButton
                            title={texts.blockquote}
                            icon="blockquote"
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                            isActive={() => editor.isActive("blockQuote")}
                        />

                        <ToolbarSplit
                            title={texts.heading}
                            icon="heading"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        >
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <Menu.Item
                                    key={i}
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .toggleHeading({ level: i as 1 | 2 | 3 | 4 | 5 | 6 })
                                            .run()
                                    }
                                    icon={<Icon icon={`h-${i}`} />}
                                >
                                    {texts.heading_level} {i}
                                </Menu.Item>
                            ))}
                        </ToolbarSplit>

                        <ToolbarButton
                            title={texts.horizontal_rule}
                            icon="border-horizontal"
                            onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        />

                        <Space w={SPACING_W} />

                        <ToolbarButton
                            title={texts.bullet_list}
                            icon="list"
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            isActive={() => editor.isActive("bulletList")}
                        />
                        <ToolbarButton
                            title={texts.ordered_list}
                            icon="list-numbers"
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            isActive={() => editor.isActive("orderedList")}
                        />
                        <ToolbarButton
                            title={texts.check_list}
                            icon="list-check"
                            onClick={() => editor.chain().focus().toggleTaskList().run()}
                            isActive={() => editor.isActive("taskList")}
                        />

                        <Space w={SPACING_W} />

                        <ToolbarSplit
                            title={texts.code_block}
                            icon="source-code"
                            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        >
                            <Menu.Label>{texts.codeBlockMenu.all_languages}</Menu.Label>

                            <Select
                                m="xs"
                                data={languages}
                                searchable
                                maxDropdownHeight={500}
                                defaultValue={
                                    editor.isActive("codeBlock")
                                        ? editor.getAttributes("codeBlock").language
                                        : undefined
                                }
                                onChange={(value) => {
                                    //if (value == null) editor.chain().focus().setParagraph().run();
                                    //else editor.chain().focus().setCodeBlock({ language: value }).run();
                                    if (value != null) {
                                        editor
                                            .chain()
                                            .focus()
                                            .setCodeBlock({ language: value })
                                            .run();

                                        if (!recentLangs.includes(value)) {
                                            const newRecentLangs = new Array(...recentLangs);
                                            if (newRecentLangs.length >= 8)
                                                newRecentLangs.splice(newRecentLangs.length - 1, 1);
                                            newRecentLangs.splice(0, 0, value);
                                            setRecentLangs(newRecentLangs);

                                            appContext.modifyPrefs(
                                                (p) => (p.editor.recentCodeLangs = newRecentLangs)
                                            );
                                        }
                                    }
                                }}
                            />

                            <Menu.Divider />

                            <Space h="sm" />

                            <Menu.Label>{texts.codeBlockMenu.recently_used}</Menu.Label>

                            {recentLangList}
                        </ToolbarSplit>

                        <ToolbarSplit
                            title={texts.table}
                            icon="table"
                            onClick={() => {
                                if (!editor.isActive("table"))
                                    editor.chain().focus().insertTable().run();
                                else editor.chain().focus();
                            }}
                            isActive={() => editor.isActive("table")}
                        >
                            <Menu.Item
                                disabled={editor.isActive("table")}
                                icon={<Icon icon="table" />}
                                onClick={() => editor.chain().focus().insertTable().run()}
                            >
                                {texts.tableMenu.create_table}
                            </Menu.Item>
                            <Menu.Item
                                disabled={!editor.isActive("table")}
                                icon={<Icon icon="column-insert-right" />}
                                onClick={() => editor.chain().focus().addColumnBefore().run()}
                            >
                                {texts.tableMenu.add_column_before}
                            </Menu.Item>
                            <Menu.Item
                                disabled={!editor.isActive("table")}
                                icon={<Icon icon="column-insert-left" />}
                                onClick={() => editor.chain().focus().addColumnAfter().run()}
                            >
                                {texts.tableMenu.add_column_after}
                            </Menu.Item>
                            <Menu.Item
                                disabled={!editor.isActive("table")}
                                color="red"
                                icon={<Icon icon="trash-x" />}
                                onClick={() => editor.chain().focus().deleteColumn().run()}
                            >
                                {texts.tableMenu.delete_column}
                            </Menu.Item>
                            <Menu.Item
                                disabled={!editor.isActive("table")}
                                icon={<Icon icon="row-insert-bottom" />}
                                onClick={() => editor.chain().focus().addRowBefore().run()}
                            >
                                {texts.tableMenu.add_row_before}
                            </Menu.Item>
                            <Menu.Item
                                disabled={!editor.isActive("table")}
                                icon={<Icon icon="row-insert-top" />}
                                onClick={() => editor.chain().focus().addRowAfter().run()}
                            >
                                {texts.tableMenu.add_row_after}
                            </Menu.Item>
                            <Menu.Item
                                disabled={!editor.isActive("table")}
                                color="red"
                                icon={<Icon icon="trash-x" />}
                                onClick={() => editor.chain().focus().deleteRow().run()}
                            >
                                {texts.tableMenu.delete_row}
                            </Menu.Item>
                            <Menu.Item
                                disabled={!editor.isActive("table")}
                                icon={<Icon icon="fold" />}
                                onClick={() => editor.chain().focus().mergeCells().run()}
                            >
                                {texts.tableMenu.merge_cells}
                            </Menu.Item>
                            <Menu.Item
                                disabled={!editor.isActive("table")}
                                icon={<Icon icon="layout-board-split" />}
                                onClick={() => editor.chain().focus().splitCell().run()}
                            >
                                {texts.tableMenu.split_cell}
                            </Menu.Item>
                            <Menu.Item
                                disabled={!editor.isActive("table")}
                                icon={<Icon icon="layout-sidebar" />}
                                onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
                            >
                                {texts.tableMenu.toggle_header_col}
                            </Menu.Item>
                            <Menu.Item
                                disabled={!editor.isActive("table")}
                                icon={<Icon icon="layout-navbar" />}
                                onClick={() => editor.chain().focus().toggleHeaderRow().run()}
                            >
                                {texts.tableMenu.toggle_header_row}
                            </Menu.Item>
                            <Menu.Item
                                disabled={!editor.isActive("table")}
                                icon={<Icon icon="box-model-2" />}
                                onClick={() => editor.chain().focus().toggleHeaderCell().run()}
                            >
                                {texts.tableMenu.toggle_header_cell}
                            </Menu.Item>
                            <Menu.Item
                                disabled={!editor.isActive("table")}
                                color="red"
                                icon={<Icon icon="trash-x" />}
                                onClick={() => editor.chain().focus().deleteTable().run()}
                            >
                                {texts.tableMenu.delete_table}
                            </Menu.Item>
                        </ToolbarSplit>

                        <ToolbarButton
                            title={texts.math_block}
                            icon="math-function"
                            onClick={() => {
                                if (editor.isActive("mathInline"))
                                    modalContext.openEditorMathModal({
                                        editor: editor,
                                        startLatex: editor.getAttributes("mathInline").text
                                    });
                                else if (editor.isActive("mathBlock"))
                                    modalContext.openEditorMathModal({
                                        editor: editor,
                                        startLatex: editor.getAttributes("mathBlock").text
                                    });
                                else
                                    modalContext.openEditorMathModal({
                                        editor: editor,
                                        startLatex: ""
                                    });
                            }}
                        />

                        <Space w={SPACING_W} />

                        <ToolbarDropdown
                            title={texts.text_color}
                            icon="paint"
                            iconColor={editor.getAttributes("textStyle").color}
                        >
                            <ColorPicker
                                defaultValue="#000000"
                                value={editor.getAttributes("textStyle").color}
                                onChangeEnd={(value) =>
                                    editor.chain().focus().setColor(value).run()
                                }
                                format="hex"
                                swatches={[
                                    ...DEFAULT_THEME.colors.dark,
                                    ...DEFAULT_THEME.colors.gray,
                                    ...DEFAULT_THEME.colors.red,
                                    ...DEFAULT_THEME.colors.orange,
                                    ...DEFAULT_THEME.colors.yellow,
                                    ...DEFAULT_THEME.colors.green,
                                    ...DEFAULT_THEME.colors.blue,
                                    ...DEFAULT_THEME.colors.violet
                                ]}
                            />

                            <Space h="xs" />

                            <Button
                                variant="default"
                                w="100%"
                                onClick={() => editor.chain().focus().unsetColor().run()}
                            >
                                {texts.reset_text_color}
                            </Button>
                        </ToolbarDropdown>

                        <ToolbarDropdown
                            title={texts.highlight}
                            icon="highlight"
                            iconColor={editor.getAttributes("highlight").color}
                        >
                            <ColorPicker
                                defaultValue="#000000"
                                value={editor.getAttributes("highlight").color}
                                onChangeEnd={(value) =>
                                    editor.chain().focus().setHighlight({ color: value }).run()
                                }
                                format="hex"
                                swatches={[
                                    ...DEFAULT_THEME.colors.dark,
                                    ...DEFAULT_THEME.colors.gray,
                                    ...DEFAULT_THEME.colors.red,
                                    ...DEFAULT_THEME.colors.orange,
                                    ...DEFAULT_THEME.colors.yellow,
                                    ...DEFAULT_THEME.colors.green,
                                    ...DEFAULT_THEME.colors.blue,
                                    ...DEFAULT_THEME.colors.violet
                                ]}
                            />

                            <Space h="xs" />

                            <Button
                                variant="default"
                                w="100%"
                                onClick={() => editor.chain().focus().unsetHighlight().run()}
                            >
                                {texts.reset_highlight}
                            </Button>
                        </ToolbarDropdown>

                        <Select
                            size="xs"
                            w={140}
                            icon={<Icon icon="typography" />}
                            data={[
                                { value: "default", label: texts.default_font },
                                "Arial",
                                "Verdana",
                                "Tahoma",
                                "Trebuchet MS",
                                "Impact",
                                "Times New Roman",
                                "Georgia",
                                "Courier",
                                "Comic Sans MS"
                            ]}
                            value={
                                editor.getAttributes("textStyle").fontFamily
                                    ? editor.getAttributes("textStyle").fontFamily
                                    : "default"
                            }
                            onChange={(value) => {
                                if (value == "default" || value == null)
                                    editor.chain().focus().unsetFontFamily().run();
                                else editor.chain().focus().setFontFamily(value).run();
                            }}
                            disabled={!editor.can().setFontFamily("Arial")}
                        />

                        <div>
                            <Button
                                w={BUTTON_WIDTH}
                                h={BUTTON_HEIGHT}
                                p={0}
                                variant="default"
                                onClick={() => {
                                    const oldSize = editor.getAttributes("textStyle").fontSize
                                        ? editor.getAttributes("textStyle").fontSize
                                        : 13;
                                    const size = oldSize - 2;
                                    if (size >= 8) editor.chain().focus().setFontSize(size).run();
                                    else editor.chain().focus().setFontSize(8).run();
                                }}
                                style={{
                                    borderTopRightRadius: 0,
                                    borderBottomRightRadius: 0,
                                    borderRight: "none"
                                }}
                                // eslint-disable-next-line react/jsx-no-literals
                            >
                                −
                            </Button>
                            <Menu>
                                <Menu.Target>
                                    <Button
                                        size="xs"
                                        variant="default"
                                        style={{ borderRadius: 0 }}
                                        w={50}
                                        h={BUTTON_HEIGHT}
                                        p={0}
                                    >
                                        {editor.getAttributes("textStyle").fontSize
                                            ? editor.getAttributes("textStyle").fontSize
                                            : // eslint-disable-next-line react/jsx-no-literals
                                              13}
                                        px
                                    </Button>
                                </Menu.Target>
                                <Menu.Dropdown>
                                    {[
                                        8, 9, 10, 11, 12, 13, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96
                                    ].map((n) => (
                                        <Menu.Item
                                            key={n}
                                            onClick={() => {
                                                if (n == 13)
                                                    editor.chain().focus().unsetFontSize().run();
                                                else editor.chain().focus().setFontSize(n).run();
                                            }}
                                        >
                                            {/* eslint-disable-next-line react/jsx-no-literals */}
                                            {n}px {n == 13 && "(Default)"}
                                        </Menu.Item>
                                    ))}
                                </Menu.Dropdown>
                            </Menu>
                            <Button
                                w={BUTTON_WIDTH}
                                h={BUTTON_HEIGHT}
                                p={0}
                                variant="default"
                                onClick={() => {
                                    const oldSize = editor.getAttributes("textStyle").fontSize
                                        ? editor.getAttributes("textStyle").fontSize
                                        : 13;
                                    const size = oldSize + 2;
                                    if (size <= 96) editor.chain().focus().setFontSize(size).run();
                                    else editor.chain().focus().setFontSize(96).run();
                                }}
                                style={{
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0,
                                    borderLeft: "none"
                                }}
                                // eslint-disable-next-line react/jsx-no-literals
                            >
                                +
                            </Button>
                        </div>

                        <ToolbarButton
                            title={texts.clear_formatting}
                            icon="eraser"
                            onClick={() => editor.chain().focus().unsetAllMarks().run()}
                        />

                        {/* <ToolbarButton
                    title="Canvas"
                    icon="brush"
                    onClick={() => editor.chain().focus().setCanvas().run()}
                /> */}
                    </Flex>
                </Paper>
            </div>
        </>
    );
}
