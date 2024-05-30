import { en_US } from "./en_US";
import { zh_CN } from "./zh_CN";

export const supportedLocales = ["en_US", "zh_CN"] as const;
export type SupportedLocales = (typeof supportedLocales)[number];

export const locales: Record<SupportedLocales, Locale> = {
    en_US: en_US,
    zh_CN: zh_CN
};

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
                    extensions: string;
                    food: string;
                    games: string;
                    gestures: string;
                    health: string;
                    laundry: string;
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
                    zodiac: string;
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
