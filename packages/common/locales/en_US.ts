import { Locale } from ".";

export const en_US: Locale = {
    name: "English (United States)",
    notifications: {
        saved: "Saved",
        exported: "Exported",
        exported_all_pages_in: "Exported all pages in",
        update_available: "New version available",
        running_under_arm_translation_title: "Running under arm64 translator",
        running_under_arm_translation_desc: "Download an arm-specific build from the GitHub"
    },
    sidebar: {
        homeTab: "Home",
        settings: "Settings",
        moreTab: "More",
        more_help: "Help/Docs",
        more_website: "Website",
        more_changelogs: "Changelogs",
        more_github_repo: "GitHub Repository",
        more_issues: "Issues/Bug Reports",
        more_give_feedback: "Give Feedback (Google Forms)",
        search_bar_text: "Search pages",
        search_contains: "Contains",
        new_folder: "New Folder",
        nothing_here: "Nothing here yet..."
    },
    settings: {
        accent_color: "Accent Color",
        code_block_theme: "Code Block Theme",
        code_block_word_wrap: "Word Wrap in Code Blocks",
        code_block_tab_size: {
            label: "Code Block Tab Size",
            desc: "Affects how many spaces to add/remove when pressing Tab/Shift-Tab in code",
            four_spaces: "4 Spaces (Default)",
            two_spaces: "2 Spaces"
        },
        language: "Language",
        contribute_language: "Contribute your own translation by opening a pull request on GitHub",
        theme: "Theme",
        titlebar_style: "Titlebar Style",
        setting_requires_restart: "Changing this setting requires a restart to take effect.",
        use_typography_extension: "Use Typography extension in the Editor",
        use_typography_description: 'This enables turning things like "(c)" into "©".',
        open_pdf_on_export: "Automatically open PDF after exporting",
        saving_section: "Saving Pages",
        autosave_page_on_switch:
            "Automatically save the current page when switching between pages/exiting the editor",
        general: "General",
        editor: "Editor",
        save_folder: "Save Folder",
        editor_width: "Editor Width",
        editor_border: "Editor Border",
        editor_spellcheck: "Editor Spellcheck",
        save_folder_location: "Save Folder Location",
        save_folder_alert_title: "Changing this setting will immediately restart the application.",
        save_folder_alert_desc:
            "Changing locations will not overwrite or copy old data to the new location. You have to copy the 'save.json' and 'notes' folder to the new location.",
        change_save_folder_location: "Change Save Folder Location",
        reset_save_folder_location: "Reset to Default Location",
        themes: {
            light: "Light",
            dark: "Dark"
        },
        languages: {
            en_US: "English (United States)",
            zh_CN: "简体中文"
        },
        titlebarStyles: {
            custom: "Custom",
            native: "Native"
        },
        editorWidths: {
            md: "Medium (Default)",
            lg: "Large",
            xl: "Extra Large"
        },
        restartToApply: "Restart to Apply"
    },
    contextMenu: {
        new_page: "New Page",
        new_folder: "New Folder",
        edit_item: "Edit Item",
        favorite_page: (favorited) => (favorited ? "Unfavorite Page" : "Favorite Page"),
        delete_item: "Delete Item",
        export_page_pdf: "Export Page as PDF",
        export_page_md: "Export Page as MD",
        export_all_pages_pdf: "Export All Pages as PDF",
        export_all_pages_md: "Export All Pages as MD"
    },
    home: {
        version: "Version",
        whats_new: "What's New",
        tip: "Tip",
        tips: [
            "If you're trying to add an image from the web or from your clipboard, you can just Copy + Paste the image directly into the editor",
            "Back up your notes (save.json and notes folder) regularly",
            "You can nest folders inside of folders",
            "You can make a page top-level by dragging it to an empty part of the sidebar",
            'Edit your save.json and try setting a page\'s "color" property to "rainbow"',
            "Contribute your own language to Codex on the GitHub repository (see CONTRIBUTING.md)",
            "Open links in your notes by holding Control (or Cmd) and clicking on it",
            "You can Alt+Click a folder to recursively close all subfolders inside it"
        ],
        favorites: "Favorites"
    },
    menus: {
        save_current_page: "Save Current Page",
        export_page_to_pdf: "Export Current Page as PDF",
        zoom_in_editor: "Zoom In Editor",
        zoom_out_editor: "Zoom Out Editor",
        reset_editor_zoom: "Reset Editor Zoom",
        toggle_sidebar: "Toggle Sidebar",
        reset_sidebar_width: "Reset Sidebar Width",
        toggle_editor_toolbar: "Toggle Editor Toolbar",
        help_docs: "Help/Docs",
        website: "Website",
        changelogs: "Changelogs",
        about: "About"
    },
    shellDialogs: {
        open_external_link: {
            title: "Are you sure you want to open this link?",
            yes: "Yes",
            cancel: "Cancel",
            trust_domain: "Always trust this domain"
        }
    },
    mutateModals: {
        edit_modal_title: (itemName: string) => `Edit ${itemName}`,
        new_page_modal_title: (parentName) => `New Page in ${parentName}`,
        new_folder_modal_title: (parentName) => {
            return parentName == undefined ? "New Folder" : `New Folder in ${parentName}`;
        },
        item_icon: "Item icon",
        item_name: "Item name",
        enter_a_name: "Enter a name",
        cancel: "Cancel",
        save: "Save",
        create: "Create",
        delete: "Delete",
        iconSelector: {
            tooltip: "Click to change icon",
            reset_color_from_rainbow: "Reset color from rainbow",
            modal: {
                title: "Choose an Icon",
                searh_bar_placeholder: "Search icons...",
                category: "Category",
                results: "results",
                categories: {
                    animals: "Animals",
                    arrows: "Arrows",
                    brand: "Brand",
                    buildings: "Buildings",
                    charts: "Charts",
                    communication: "Communication",
                    computers: "Computers",
                    currencies: "Currencies",
                    database: "Database",
                    design: "Design",
                    devices: "Devices",
                    document: "Document",
                    ecommerce: "E-Commerce",
                    electrical: "Electrical",
                    extensions: "Extensions",
                    food: "Food",
                    games: "Games",
                    gestures: "Gestures",
                    health: "Health",
                    laundry: "Laundry",
                    letters: "Letters",
                    logic: "Logic",
                    map: "Map",
                    math: "Math",
                    media: "Media",
                    mood: "Mood",
                    nature: "Nature",
                    numbers: "Numbers",
                    photography: "Photography",
                    shapes: "Shapes",
                    sport: "Sport",
                    symbols: "Symbols",
                    system: "System",
                    text: "Text",
                    vehicles: "Vehicles",
                    versionControl: "Version Control",
                    weather: "Weather",
                    zodiac: "Zodiac"
                }
            }
        },
        delete_item_title: "Delete Item",
        delete_page_text: (itemName: string) => `Are you sure you want to delete "${itemName}"?`,
        delete_folder_text: (itemName: string) =>
            `Are you sure you want to delete "${itemName}" and all of its children?`
    },
    editor: {
        table_of_contents: "Table of Contents",
        toggle_toolbar: "Toggle Editor Toolbar",
        toolbar: {
            undo: "Undo",
            redo: "Redo",
            bold: "Bold",
            italic: "Italic",
            underline: "Underline",
            strikethrough: "Strikethrough",
            inline_code: "Inline Code",
            superscript: "Superscript",
            subscript: "Subscript",
            link: "Link",
            align_left: "Align Left",
            align_right: "Align Right",
            align_center: "Align Center",
            align_justified: "Align Justified",
            image: "Insert/Replace Image",
            paragraph: "Set to Paragraph",
            blockquote: "Set to Block Quote",
            heading: "Heading",
            heading_level: "Level",
            horizontal_rule: "Insert Horizontal Rule",
            bullet_list: "Bullet List",
            ordered_list: "Ordered List",
            check_list: "Checklist",
            code_block: "Code Block",
            codeBlockMenu: {
                all_languages: "All Languages",
                recently_used: "Recently Used"
            },
            table: "Create Table",
            tableMenu: {
                create_table: "Create Table",
                add_column_before: "Add Column Before",
                add_column_after: "Add Column After",
                delete_column: "Delete Column",
                add_row_before: "Add Row Before",
                add_row_after: "Add Row After",
                delete_row: "Delete Row",
                merge_cells: "Merge Selected Cells",
                split_cell: "Split Selected Cell",
                toggle_header_col: "Toggle Header Column",
                toggle_header_row: "Toggle Header Row",
                toggle_header_cell: "Toggle Header Cell",
                delete_table: "Delete Table"
            },
            math_block: "Math Block",
            clear_formatting: "Clear Formatting",
            text_color: "Text Color",
            default_font: "Default Font",
            highlight: "Highlight",
            reset_text_color: "Reset Text Color",
            reset_highlight: "Remove Highlight"
        },
        imageModal: {
            dropzone_title: "Drag image here or click to select file",
            dropzone_desc: "Limit 1 Image file",
            tip_title: "Tip",
            tip_text:
                "If you're trying to add an image from the web, or a screenshot/image from your clipboard, you can just Copy + Paste the image directly into the editor.",
            cancel: "Cancel",
            add_image: "Add Image",
            replace_image: "Replace Image"
        },
        mathModal: {
            edit_math: "Edit Math Expression",
            insert_math: "Insert Math Expression",
            visual_editor: "Visual Editor",
            manual_editor: "Manual KaTeX",
            about: "About",
            aboutMenu: {
                title: "Math/TeX/KaTeX Support",
                text: "The Visual Math Editor uses an open-source math editor called MathLive. The actual Codex editor/document, that you use to write your notes, uses KaTeX to render the math in your notes. MathLive and KaTeX both support most of the same functions/commands/formulas, but they are not 100% compatible. This means that certain specific/complicated KaTeX expressions won't appear correctly in the Visual Math Editor, but you should still be able to see them in your notes by entering the KaTeX manually with the Manual KaTeX button. For example you could copy a complicated KaTeX formula from the internet, select the Manual KaTeX button, and paste the formula into the text box.",
                mathlive_link: "MathLive Supported Functions",
                katex_link: "KaTeX Supported Functions"
            },
            cancel: "Cancel",
            edit: "Edit",
            insert: "Insert"
        },
        linkModal: {
            cancel: "Cancel",
            create_link: "Create Link",
            url: "URL"
        },
        code_block_collapse: "Collapse"
    },
    unsavedChangesDialog: {
        title: (name: string) => `You have unsaved changes to "${name}"`,
        cancel: "Cancel",
        forget: "Discard Changes",
        save: "Save Changes"
    }
};
