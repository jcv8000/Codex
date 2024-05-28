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
        code_block_word_wrap: string;
        code_block_tab_size: {
            label: string;
            desc: string;
            four_spaces: string;
            two_spaces: string;
        };
        language: string;
        contribute_language: string;
        theme: string;
        titlebar_style: string;
        setting_requires_restart: string;
        use_typography_extension: string;
        use_typography_description: string;
        open_pdf_on_export: string;
        saving_section: string;
        autosave_page_on_switch: string;
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
        code_block_collapse: string;
    };
    unsavedChangesDialog: {
        title: (name: string) => string;
        cancel: string;
        forget: string;
        save: string;
    };
};

export const supportedLocales = ["en_US", "zh_CN", "ru_RU"] as const;
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
            code_block_word_wrap: "Word Wrap in Code Blocks",
            code_block_tab_size: {
                label: "Code Block Tab Size",
                desc: "Affects how many spaces to add/remove when pressing Tab/Shift-Tab in code",
                four_spaces: "4 Spaces (Default)",
                two_spaces: "2 Spaces"
            },
            language: "Language",
            contribute_language:
                "Contribute your own translation by opening a pull request on GitHub",
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
                en_US: "English (United States)",
                zh_CN: "简体中文",
                ru_RU: "Русский (Российская Федерация)"
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
            },
            code_block_collapse: "Collapse"
        },
        unsavedChangesDialog: {
            title: (name: string) => `You have unsaved changes to "${name}"`,
            cancel: "Cancel",
            forget: "Discard Changes",
            save: "Save Changes"
        }
    },
    zh_CN: {
        name: "简体中文",
        notifications: {
            saved: "已保存",
            exported: "已导出",
            exported_all_pages_in: "导出所有页面到",
            update_available: "新版本发布",
            running_under_arm_translation_title: "Running under arm64 translator",
            running_under_arm_translation_desc: "从Github下载arm版本"
        },
        sidebar: {
            homeTab: "主页",
            settings: "设置",
            moreTab: "更多",
            more_help: "帮助/文档",
            more_website: "网站",
            more_changelogs: "更新日志",
            more_github_repo: "GitHub仓库",
            more_issues: "报告问题",
            more_give_feedback: "反馈 (Google Forms)",
            search_bar_text: "搜索页面",
            search_contains: "包含",
            new_folder: "新建文件夹",
            nothing_here: "这里还没有内容..."
        },
        settings: {
            accent_color: "主题色",
            code_block_theme: "代码块主题",
            code_block_word_wrap: "Word Wrap in Code Blocks",
            code_block_tab_size: {
                label: "代码块Tab宽度",
                desc: "影响在代码编辑中按下Tab/Shift-Tab时添加或删除的空格数量",
                four_spaces: "4 Spaces (Default)",
                two_spaces: "2 Spaces"
            },
            language: "语言",
            contribute_language:
                "Contribute your own translation by opening a pull request on GitHub",
            theme: "主题",
            titlebar_style: "标题栏风格",
            setting_requires_restart: "更改此项设置需要重启才能生效",
            use_typography_extension: "Use Typography extension in the Editor",
            use_typography_description: '这将会把类似 "(c)" 的符号更改为 "©".',
            open_pdf_on_export: "完成导出后自动打开PDF文件",
            saving_section: "保存页面",
            autosave_page_on_switch: "页面切换/退出编辑器时自动保存当前页面",
            general: "基础设置",
            editor: "编辑器",
            save_folder: "保存文件夹",
            editor_width: "编辑器宽度",
            editor_border: "编辑器边框",
            editor_spellcheck: "拼写检查",
            save_folder_location: "保存位置",
            save_folder_alert_title: "更改此项设置将会立即重启应用",
            save_folder_alert_desc:
                "更改保存位置将不会覆盖或复制旧的数据到新的文件夹。你需要将 'save.json' 和 'note' 文件夹复制到新的位置",
            change_save_folder_location: "更改保存位置",
            reset_save_folder_location: "重设至默认位置",
            themes: {
                light: "Light",
                dark: "Dark"
            },
            languages: {
                en_US: "English (United States)",
                zh_CN: "简体中文",
                ru_RU: "Русский (Российская Федерация)"
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
            restartToApply: "重启以应用设置"
        },
        contextMenu: {
            new_page: "新建页面",
            new_folder: "新建文件夹",
            edit_item: "编辑该项",
            favorite_page: (favorited) => (favorited ? "取消收藏该页" : "收藏该页"),
            delete_item: "删除该项",
            export_page_pdf: "导出为PDF",
            export_page_md: "导出为Markdown",
            export_all_pages_pdf: "导出所有页面为PDF",
            export_all_pages_md: "导出所有页面为Markdown"
        },
        home: {
            version: "版本号",
            whats_new: "更新内容",
            tip: "小贴士",
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
            favorites: "收藏"
        },
        menus: {
            save_current_page: "保存当前页面",
            export_page_to_pdf: "将当前页面导出为PDF",
            zoom_in_editor: "放大",
            zoom_out_editor: "缩小",
            reset_editor_zoom: "重设缩放",
            toggle_sidebar: "隐藏侧边栏",
            reset_sidebar_width: "重设侧边栏宽度",
            toggle_editor_toolbar: "隐藏工具栏",
            help_docs: "帮助/文档",
            website: "网站",
            changelogs: "更新日志",
            about: "关于"
        },
        shellDialogs: {
            open_external_link: {
                title: "你确定要打开这个链接吗?",
                yes: "确认",
                cancel: "取消",
                trust_domain: "始终信任该域名"
            }
        },
        mutateModals: {
            edit_modal_title: (itemName: string) => `编辑 ${itemName}`,
            new_page_modal_title: (parentName) => `在 ${parentName} 创建新的页面`,
            new_folder_modal_title: (parentName) => {
                return parentName == undefined
                    ? "创建新的文件夹"
                    : `在 ${parentName} 创建新的文件夹`;
            },
            item_icon: "图标",
            item_name: "项名称",
            enter_a_name: "输入名称",
            cancel: "取消",
            save: "保存",
            create: "创建",
            delete: "删除",
            iconSelector: {
                tooltip: "单击以更改图标",
                reset_color_from_rainbow: "Reset color from rainbow",
                modal: {
                    title: "选择图标",
                    searh_bar_placeholder: "搜索图标...",
                    category: "类别",
                    results: "结果",
                    categories: {
                        animals: "动物",
                        arrows: "箭头",
                        brand: "商标",
                        buildings: "建筑",
                        charts: "图表",
                        communication: "社交",
                        computers: "计算机",
                        currencies: "货币",
                        database: "数据库",
                        design: "设计",
                        devices: "设备",
                        document: "文档",
                        ecommerce: "电商",
                        electrical: "电路",
                        filled: "填充的",
                        food: "食物",
                        gestures: "手势",
                        health: "健康",
                        letters: "字母",
                        logic: "逻辑电路",
                        map: "地图",
                        math: "数学",
                        media: "多媒体",
                        mood: "心情",
                        nature: "自然",
                        numbers: "数字",
                        photography: "摄影",
                        shapes: "图案",
                        sport: "运动",
                        symbols: "符号",
                        system: "系统",
                        text: "文本编辑",
                        vehicles: "交通",
                        versionControl: "版本控制",
                        weather: "天气"
                    }
                }
            },
            delete_item_title: "删除项",
            delete_page_text: (itemName: string) => `你确定要删除 "${itemName}" 吗?`,
            delete_folder_text: (itemName: string) => `你确定要删除 "${itemName}" 及其所有子项吗?`
        },
        editor: {
            table_of_contents: "Table of Contents",
            toggle_toolbar: "收起工具栏",
            toolbar: {
                undo: "撤销",
                redo: "恢复",
                bold: "粗体",
                italic: "斜体",
                underline: "下划线",
                strikethrough: "Strikethrough",
                inline_code: "内联代码块",
                superscript: "Superscript",
                subscript: "Subscript",
                link: "超链接",
                align_left: "左对齐",
                align_right: "右对齐",
                align_center: "居中对齐",
                align_justified: "两端对齐",
                image: "插入/替换图片",
                paragraph: "设置为段落",
                blockquote: "设置为块引用",
                heading: "标题",
                heading_level: "标题级别",
                horizontal_rule: "Insert Horizontal Rule",
                bullet_list: "无序号列表",
                ordered_list: "有序号列表",
                check_list: "清单",
                code_block: "代码块",
                codeBlockMenu: {
                    all_languages: "所有语言",
                    recently_used: "最近使用"
                },
                table: "创建表格",
                tableMenu: {
                    create_table: "创建表格",
                    add_column_before: "在前方插入列",
                    add_column_after: "在后方插入列",
                    delete_column: "删除选中的各列",
                    add_row_before: "在上方插入行",
                    add_row_after: "在下方插入行",
                    delete_row: "删除选中的各行",
                    merge_cells: "合并单元格",
                    split_cell: "拆分单元格",
                    toggle_header_col: "切换为标题栏",
                    toggle_header_row: "切换为标题列",
                    toggle_header_cell: "切换为标题单元格",
                    delete_table: "删除表格"
                },
                math_block: "数学公式",
                clear_formatting: "Clear Formatting",
                text_color: "文字颜色",
                default_font: "默认字体",
                highlight: "高亮",
                reset_text_color: "重设文字颜色",
                reset_highlight: "移除高亮"
            },
            imageModal: {
                dropzone_title: "拖拽图片到此处或选择图片",
                dropzone_desc: "最多一张图片",
                tip_title: "小贴士",
                tip_text: "如果你要从网络或剪切板添加图片，只需要直接复制粘贴到编辑器内",
                cancel: "取消",
                add_image: "添加图片",
                replace_image: "替换图片"
            },
            mathModal: {
                edit_math: "编辑数学表达式",
                insert_math: "插入数学表达式",
                visual_editor: "Visual Editor",
                manual_editor: "Manual KaTeX",
                about: "关于",
                aboutMenu: {
                    title: "Math/TeX/KaTeX 支持",
                    text: "The Visual Math Editor uses an open-source math editor called MathLive. The actual Codex editor/document, that you use to write your notes, uses KaTeX to render the math in your notes. MathLive and KaTeX both support most of the same functions/commands/formulas, but they are not 100% compatible. This means that certain specific/complicated KaTeX expressions won't appear correctly in the Visual Math Editor, but you should still be able to see them in your notes by entering the KaTeX manually with the Manual KaTeX button. For example you could copy a complicated KaTeX formula from the internet, select the Manual KaTeX button, and paste the formula into the text box.",
                    mathlive_link: "MathLive Supported Functions",
                    katex_link: "KaTeX Supported Functions"
                },
                cancel: "取消",
                edit: "编辑",
                insert: "插入"
            },
            linkModal: {
                cancel: "取消",
                create_link: "创建超链接",
                url: "URL"
            },
            code_block_collapse: "折叠"
        },
        unsavedChangesDialog: {
            title: (name: string) => `您对 "${name}" 有未保存的更改`,
            cancel: "取消",
            forget: "放弃更改",
            save: "保存更改"
        }
    },
    ru_RU: {
        name: "Русский (Российская Федерация)",
        notifications: {
            saved: "Сохранено",
            exported: "Экспортировано",
            exported_all_pages_in: "Все страницы экспортированы в",
            update_available: "Доступна новая версия",
            running_under_arm_translation_desc: "Запущенно из транслятора под arm64",
            running_under_arm_translation_title: "Скачать версию для ARM с GitHub",
        },
        sidebar: {
            homeTab: "Домашняя страница",
            settings: "Настройки",
            moreTab: "Больше вкладок",
            more_help: "Помощь / Документация",
            more_website: "Сайт",
            more_changelogs: "Список изменений",
            more_github_repo: "Репозиторий GitHub",
            more_issues: "Вопросы / баг-репорты",
            more_give_feedback: "Оставьте отзыв (Google Forms)",
            search_bar_text: "Поиск по страницам",
            search_contains: "Включает",
            new_folder: "Новая папка",
            nothing_here: "Здесь ничего пока нет..."
        },
        settings: {
            accent_color: "Главный цвет",
            code_block_theme:  "Тема блока кода",
            code_block_word_wrap: "Перенос текста в блоках кода",
            code_block_tab_size: {
                label: "Размер отступа в блоке кода",
                desc: "Влияет на количество пробелов к удалению/добавлению когда нижимаются Tab/Shift-Tab в блоке кода",
                four_spaces: "4 пробела (по умолчанию)",
                two_spaces: "2 пробела"
            },
            language: "Язык",
            contribute_language: "Добавьте свой язык, открыв pull request на GitHub",
            theme: "Тема",
            titlebar_style: "Стиль панели заголовка",
            setting_requires_restart: "Чтобы увидеть изменения потребуется перезагрузка",
            use_typography_extension: "Использовать расширение Typography в редакторе",
            use_typography_description: 'Это превращает вещи типа "(c)" в "©".',
            open_pdf_on_export: "Автоматически открыть PDF после экспортирования",
            saving_section: "Сохранение страниц",
            autosave_page_on_switch:
                "Автоматически сохранять текущую страницу при переключении между страницами или выходе из редактора",
            general: "Главная",
            editor: "Редактор",
            save_folder: "Сохранить папку",
            editor_width: "Ширина редактора",
            editor_border: "Граница редактора",
            editor_spellcheck: "Проверка орфографии в редакторе",
            save_folder_location: "Место сохранения папок",
            save_folder_alert_title:
                "Изменение этого параметра приведет к немедленному перезапуску приложения.",
            save_folder_alert_desc:
                "Смена местоположения не приведет к перезаписи или копированию старых данных в новое место. Если вам нужно сохранить данные, то скопируйте файл save.json и папку notes в новое место.",
            change_save_folder_location: "Изменить местоположение папки",
            reset_save_folder_location: "Сброс на место по умолчанию",
            themes: {
                light: "Светлая",
                dark: "Тёмная"
            },
            languages: {
                en_US: "English (United States)",
                zh_CN: "简体中文",
                ru_RU: "Русский (Российская Федерация)"
            },
            titlebarStyles: {
                custom: "Кастомная",
                native: "Системная"
            },
            editorWidths: {
                md: "Средний (по умолчанию)",
                lg: "Большой",
                xl: "Очень большой"
            },
            restartToApply: "Перезагрузить для применеия"
        },
        contextMenu: {
            new_page: "Новая страница",
            new_folder: "Новая папка",
            edit_item: "Изменить",
            favorite_page: (favorited) => (favorited ? "Обычная страница" : "Избранная страница"),
            delete_item: "Удалить",
            export_page_pdf: "Экспорт страницы в PDF",
            export_page_md: "Экспорт страницы в MD",
            export_all_pages_pdf: "Экспорт всех страниц в PDF",
            export_all_pages_md: "Экспорт всех страниц в MD"
        },
        home: {
            version: "Версия",
            whats_new: "Что нового",
            tip: "Заметка",
            tips: [
                "Если вы пытаетесь добавить изображение из Интернета или из буфера обмена, вы можете просто скопировать + вставить изображение прямо в редактор",
                "Регулярно создавайте резервные копии заметок (файл save.json и папка Notes)",
                "Вы можете вложить папки внутрь папок",
                "Вы можете сделать страницу верхнего уровня, перетащив ее в пустую часть боковой панели.",
                'Отредактируйте файл save.json и попробуйте установить свойство «color» страницы на «rainbow».',
                "Внесите свой собственный язык в Codex в репозиторий GitHub (см. CONTRIBUTING.md).",
                "Открывайте ссылки в заметках, удерживая Control (или Cmd) и нажимая на них.",
                "Вы можете щелкнуть папку Alt+Click, чтобы рекурсивно закрыть все вложенные в нее папки."
            ],
            favorites: "Избранные"
        },
        menus: {
            save_current_page: "Сохранить текущую страницу",
            export_page_to_pdf: "Экспорт текущей страницы в PDF",
            zoom_in_editor: "Увеличить редактор",
            zoom_out_editor: "Уменьшить редактор",
            reset_editor_zoom: "Сбросить размер редактора",
            toggle_sidebar: "Переключить боковую панель",
            reset_sidebar_width: "Сбросить размер боковой панели",
            toggle_editor_toolbar: "Переключение панели инструментов редактора",
            help_docs: "Помощь/Документация",
            website: "Сайт",
            changelogs: "Изменения",
            about: "О программе"
        },
        shellDialogs: {
            open_external_link: {
                title: "Вы уверены, что хотите открыть эту ссылку?",
                yes: "Да",
                cancel: "Отмена",
                trust_domain: "Всегда доверять этому домену"
            }
        },
        mutateModals: {
            edit_modal_title: (itemName: string) => `Изменить ${itemName}`,
            new_page_modal_title: (parentName) => `Новая страница в ${parentName}`,
            new_folder_modal_title: (parentName) => {
                return parentName == undefined ? "Новая папка" : `Новая папка в ${parentName}`;
            },
            item_icon: "Значок",
            item_name: "Имя",
            enter_a_name: "Введите имя",
            cancel: "Отмена",
            save: "Сохранить",
            create: "Создать",
            delete: "Удалить",
            iconSelector: {
                tooltip: "Нажмите, чтобы изменить значок",
                reset_color_from_rainbow: "Сбросить цвет с радуги",
                modal: {
                    title: "Выберите значок",
                    searh_bar_placeholder: "Поиск значков...",
                    category: "Категория",
                    results: "Результаты",
                    categories: {
                        animals: "Животные",
                        arrows: "Стрелки",
                        brand: "Марка",
                        buildings: "Здания",
                        charts: "Графики",
                        communication: "Общение",
                        computers: "Компьютеры",
                        currencies: "Валюты",
                        database: "Базы данных",
                        design: "Дизайн",
                        devices: "Устройства",
                        document: "Документ",
                        ecommerce: "Электронная коммерция",
                        electrical: "Электрика",
                        filled: "Заполненный",
                        food: "Еда",
                        gestures: "Жесты",
                        health: "Здоровья",
                        letters: "Буквы",
                        logic: "Логика",
                        map: "Карта",
                        math: "Математика",
                        media: "СМИ",
                        mood: "Настроение",
                        nature: "Природа",
                        numbers: "Числа",
                        photography: "Фотография",
                        shapes: "Формы",
                        sport: "Спорт",
                        symbols: "Символы",
                        system: "Система",
                        text: "Текст",
                        vehicles: "Машины",
                        versionControl: "Контроль версий",
                        weather: "Погода"
                    }
                }
            },
            delete_item_title: "Удалить элемент",
            delete_page_text: (itemName: string) =>
                `Вы уверены, что хотите удалить "${itemName}"?`,
            delete_folder_text: (itemName: string) =>
                `Вы уверены, что хотите удалить "${itemName}" вместе со всеми его дочерними элементами?`
        },
        editor: {
            table_of_contents: "Оглавление",
            toggle_toolbar: "Переключение панели инструментов",
            toolbar: {
                undo: "Назад",
                redo: "Вперёд",
                bold: "Полужирный",
                italic: "Курсив",
                underline: "Подчёркнутый",
                strikethrough: "Зачёркнутый",
                inline_code: "Встроить код",
                superscript: "Надстрочный индекс",
                subscript: "Нижний индекс",
                link: "Ссылка",
                align_left: "Выровнять по левому краю",
                align_right: "Выровнять по правому краю",
                align_center: "Выровнять по центру",
                align_justified: "Выравнивание по ширине",
                image: "Вставить/заменить изображение",
                paragraph: "Установить на абзац",
                blockquote: "Установить на блок цитаты",
                heading: "Заголовок",
                heading_level: "Уровень",
                horizontal_rule: "Вставить горизонтальную линейку",
                bullet_list: "Маркированный список",
                ordered_list: "Упорядоченный список",
                check_list: "Контрольный список",
                code_block: "Блок кода",
                codeBlockMenu: {
                    all_languages: "Все языки",
                    recently_used: "Недавно использованные"
                },
                table: "Создать таблицу",
                tableMenu: {
                    create_table: "Создать таблицу",
                    add_column_before: "Создать таблицу до",
                    add_column_after: "Создать таблицу после",
                    delete_column: "Удалить колонку",
                    add_row_before: "Вставить строку до",
                    add_row_after: "Вставить строку после",
                    delete_row: "Удалить строку",
                    merge_cells: "Объединить выделенные ячейки",
                    split_cell: "Разделить выделенную ячейку",
                    toggle_header_col: "Переключение колонки заголовка",
                    toggle_header_row: "Переключить строку заголовка",
                    toggle_header_cell: "Переключение ячеек заголовка",
                    delete_table: "Удалить таблицу"
                },
                math_block: "Математический блок",
                clear_formatting: "Удалить форматирование",
                text_color: "Цвет текста",
                default_font: "По умолчанию (шрифт)",
                highlight: "Выделение",
                reset_text_color: "Сбросить цвет текста",
                reset_highlight: "Сбросить выделение"
            },
            imageModal: {
                dropzone_title: "Перетащите изображение сюда или нажмите, чтобы выбрать файл",
                dropzone_desc: "Предел - 1 файл изображения",
                tip_title: "Заметка",
                tip_text:
                    "Если вы пытаетесь добавить изображение из Интернета или скриншот/изображение из буфера обмена, вы можете просто скопировать + вставить изображение прямо в редактор.",
                cancel: "Отмена",
                add_image: "Добавить изображение",
                replace_image: "Заменить изображение"
            },
            mathModal: {
                edit_math: "Редактировать математическое выражение",
                insert_math: "Вставить математическое выражение",
                visual_editor: "Визуальный редактор",
                manual_editor: "Ручной ввод KaTeX",
                about: "Подробнее",
                aboutMenu: {
                    title: "Поддержка Math/TeX/KaTeX",
                    text: "Визуальный редактор математики использует математический редактор с открытым исходным кодом под названием MathLive. Фактический редактор/документ Codex, который вы используете для написания своих заметок, использует KaTeX для отображения математики в ваших заметках. MathLive и KaTeX поддерживают большинство одних и тех же функций/команд/формул, но они не совместимы на 100%. Это означает, что некоторые специфические/сложные выражения KaTeX не будут корректно отображаться в редакторе Visual Math Editor, но вы все равно сможете увидеть их в своих заметках, введя KaTeX вручную с помощью кнопки Manual KaTeX. Например, вы можете скопировать сложную формулу KaTeX из интернета, выбрать кнопку Manual KaTeX и вставить формулу в текстовое поле.",
                    mathlive_link: "Поддерживаемые функции MathLive",
                    katex_link: "Поддерживаемые функции KaTeX"
                },
                cancel: "Отмена",
                edit: "Редактировать",
                insert: "Вставить"
            },
            linkModal: {
                cancel: "Отмена",
                create_link: "Создать ссылку",
                url: "URL"
            },
            code_block_collapse: "Свернуть"
        },
        unsavedChangesDialog: {
            title: (name: string) => `Вы имеете несохранённые изменения в "${name}"`,
            cancel: "Отмена",
            forget: "Не сохранять изменения",
            save: "Сохранить изменения"
        }
    }
};
