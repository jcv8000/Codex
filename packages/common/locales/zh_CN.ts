import { Locale } from ".";

export const zh_CN: Locale = {
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
        contribute_language: "Contribute your own translation by opening a pull request on GitHub",
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
            return parentName == undefined ? "创建新的文件夹" : `在 ${parentName} 创建新的文件夹`;
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
                    extensions: "文件扩展名",
                    food: "食物",
                    games: "游戏",
                    gestures: "手势",
                    health: "健康",
                    laundry: "洗衣店",
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
                    weather: "天气",
                    zodiac: "十二生肖"
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
};
