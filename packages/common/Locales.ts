export type Locale = {
    name: string;
    notifications: {
        saved: string;
        exported: string;
        exported_all_pages_in: string;
        update_available: string;
        running_under_arm_translation_title: string;
        running_under_arm_translation_desc: string;
    };
    sidebar: {
        homeTab: string;
        settings: string;
        moreTab: string;
        more_help: string;
        more_website: string;
        more_changelogs: string;
        more_github_repo: string;
        more_issues: string;
        more_give_feedback: string;
        search_bar_text: string;
        search_contains: string;
        new_folder: string;
        nothing_here: string;
    };
    settings: {
        accent_color: string;
        code_block_theme: string;
        language: string;
        contribute_language: string;
        theme: string;
        titlebar_style: string;
        setting_requires_restart: string;
        use_typography_extension: string;
        use_typography_description: string;
        open_pdf_on_export: string;
        show_page_saved_notification: string;
        general: string;
        editor: string;
        save_folder: string;
        editor_width: string;
        editor_border: string;
        editor_spellcheck: string;
        save_folder_location: string;
        save_folder_alert_title: string;
        save_folder_alert_desc: string;
        change_save_folder_location: string;
        reset_save_folder_location: string;
        themes: {
            light: string;
            dark: string;
        };
        languages: Record<SupportedLocales, string>;
        titlebarStyles: {
            custom: string;
            native: string;
        };
        editorWidths: {
            md: string;
            lg: string;
            xl: string;
        };
        restartToApply: string;
    };
    contextMenu: {
        new_page: string;
        new_folder: string;
        edit_item: string;
        favorite_page: (favorited: boolean) => string;
        delete_item: string;
        export_page_pdf: string;
        export_page_md: string;
        export_all_pages_pdf: string;
        export_all_pages_md: string;
    };
    home: {
        version: string;
        whats_new: string;
        tip: string;
        tips: string[];
        favorites: string;
    };
    menus: {
        save_current_page: string;
        export_page_to_pdf: string;
        zoom_in_editor: string;
        zoom_out_editor: string;
        reset_editor_zoom: string;
        toggle_sidebar: string;
        reset_sidebar_width: string;
        toggle_editor_toolbar: string;
        help_docs: string;
        website: string;
        changelogs: string;
        about: string;
    };
    shellDialogs: {
        open_external_link: {
            title: string;
            yes: string;
            cancel: string;
            trust_domain: string;
        };
    };
    mutateModals: {
        edit_modal_title: (itemName: string) => string;
        new_page_modal_title: (parentName: string) => string;
        new_folder_modal_title: (parentName?: string) => string;
        item_icon: string;
        item_name: string;
        enter_a_name: string;
        cancel: string;
        save: string;
        create: string;
        delete: string;
        iconSelector: {
            tooltip: string;
            reset_color_from_rainbow: string;
            modal: {
                title: string;
                searh_bar_placeholder: string;
                category: string;
                results: string;
                categories: {
                    animals: string;
                    arrows: string;
                    brand: string;
                    buildings: string;
                    charts: string;
                    communication: string;
                    computers: string;
                    currencies: string;
                    database: string;
                    design: string;
                    devices: string;
                    document: string;
                    ecommerce: string;
                    electrical: string;
                    filled: string;
                    food: string;
                    gestures: string;
                    health: string;
                    letters: string;
                    logic: string;
                    map: string;
                    math: string;
                    media: string;
                    mood: string;
                    nature: string;
                    numbers: string;
                    photography: string;
                    shapes: string;
                    sport: string;
                    symbols: string;
                    system: string;
                    text: string;
                    vehicles: string;
                    versionControl: string;
                    weather: string;
                };
            };
        };
        delete_item_title: string;
        delete_page_text: (itemName: string) => string;
        delete_folder_text: (itemName: string) => string;
    };
    editor: {
        table_of_contents: string;
        toggle_toolbar: string;
        toolbar: {
            undo: string;
            redo: string;
            bold: string;
            italic: string;
            underline: string;
            strikethrough: string;
            inline_code: string;
            superscript: string;
            subscript: string;
            link: string;
            align_left: string;
            align_right: string;
            align_center: string;
            align_justified: string;
            image: string;
            paragraph: string;
            blockquote: string;
            heading: string;
            heading_level: string;
            horizontal_rule: string;
            bullet_list: string;
            ordered_list: string;
            check_list: string;
            code_block: string;
            codeBlockMenu: {
                all_languages: string;
                recently_used: string;
            };
            table: string;
            tableMenu: {
                create_table: string;
                add_column_before: string;
                add_column_after: string;
                delete_column: string;
                add_row_before: string;
                add_row_after: string;
                delete_row: string;
                merge_cells: string;
                split_cell: string;
                toggle_header_col: string;
                toggle_header_row: string;
                toggle_header_cell: string;
                delete_table: string;
            };
            math_block: string;
            clear_formatting: string;
            text_color: string;
            default_font: string;
            highlight: string;
            reset_text_color: string;
            reset_highlight: string;
        };
        imageModal: {
            dropzone_title: string;
            dropzone_desc: string;
            tip_title: string;
            tip_text: string;
            cancel: string;
            add_image: string;
            replace_image: string;
        };
        mathModal: {
            edit_math: string;
            insert_math: string;
            visual_editor: string;
            manual_editor: string;
            about: string;
            aboutMenu: {
                title: string;
                text: string;
                mathlive_link: string;
                katex_link: string;
            };
            cancel: string;
            edit: string;
            insert: string;
        };
        linkModal: {
            cancel: string;
            create_link: string;
            url: string;
        };
    };
};

export const supportedLocales = ["en_US"] as const;
export type SupportedLocales = (typeof supportedLocales)[number];

export const locales: Record<SupportedLocales, Locale> = {
    en_US: {
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
            language: "Language",
            contribute_language:
                "Contribute your own translation by opening a pull request on GitHub",
            theme: "Theme",
            titlebar_style: "Titlebar Style",
            setting_requires_restart: "Changing this setting requires a restart to take effect.",
            use_typography_extension: "Use Typography extension in the Editor",
            use_typography_description: 'This enables turning things like "(c)" into "©".',
            open_pdf_on_export: "Automatically open PDF after exporting",
            show_page_saved_notification:
                "Show 'Page saved' notification when switching between pages",
            general: "General",
            editor: "Editor",
            save_folder: "Save Folder",
            editor_width: "Editor Width",
            editor_border: "Editor Border",
            editor_spellcheck: "Editor Spellcheck",
            save_folder_location: "Save Folder Location",
            save_folder_alert_title:
                "Changing this setting will immediately restart the application.",
            save_folder_alert_desc:
                "Changing locations will not overwrite or copy old data to the new location. You have to copy the 'save.json' and 'notes' folder to the new location.",
            change_save_folder_location: "Change Save Folder Location",
            reset_save_folder_location: "Reset to Default Location",
            themes: {
                light: "Light",
                dark: "Dark"
            },
            languages: {
                en_US: "English (United States)"
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
                "Open links in your notes by holding Control (or Cmd) and clicking on it"
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
                        filled: "Filled",
                        food: "Food",
                        gestures: "Gestures",
                        health: "Health",
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
                        weather: "Weather"
                    }
                }
            },
            delete_item_title: "Delete Item",
            delete_page_text: (itemName: string) =>
                `Are you sure you want to delete "${itemName}"?`,
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
            }
        }
    }
};
