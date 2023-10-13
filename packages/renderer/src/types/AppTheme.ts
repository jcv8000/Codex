import { MantineThemeOverride } from "@mantine/core";
import { createPaletteFromColor } from "palettey";
import { Prefs } from "common/Prefs";
import { hexToRgb } from "common/Utils";

export function AppTheme(options: {
    prefs: Prefs;
    titlebarStyle: "custom" | "native";
}): MantineThemeOverride {
    const { prefs, titlebarStyle } = options;
    const accentPalette: string[] = [];

    Object.entries(
        createPaletteFromColor("accent", prefs.general.accentColor.substring(1, 7), {
            useLightness: false
        })["accent"]
    ).forEach((entry) => {
        /*eslint no-unused-vars: ["warn", { "varsIgnorePattern": "^_" }] @typescript-eslint/no-unused-vars: ["warn", { "varsIgnorePattern": "^_" }] */
        const [_step, color] = entry;
        accentPalette.push(color);
    });

    let accentTextColor = "white";
    const accentColorRgb = hexToRgb(prefs.general.accentColor);
    if (accentColorRgb.r * 0.299 + accentColorRgb.g * 0.587 + accentColorRgb.b * 0.114 > 186) {
        accentTextColor = "black";
    }

    // Set editor table colors for light/dark mode
    // if (prefs.general.theme == "light") {
    //     document.documentElement.style.setProperty("--table-border-color", "#d0d7de");
    //     document.documentElement.style.setProperty("--table-bg-color", "#f6f8fa");
    // } else {
    //     document.documentElement.style.setProperty("--table-border-color", "#373A40");
    //     document.documentElement.style.setProperty("--table-bg-color", "#25262b");
    // }

    return {
        fontSizes: { md: "13px" },
        colorScheme: prefs.general.theme,
        colors: {
            accent: [
                accentPalette[0],
                accentPalette[1],
                accentPalette[2],
                accentPalette[3],
                accentPalette[4],
                accentPalette[5],
                accentPalette[6],
                accentPalette[7],
                accentPalette[8],
                accentPalette[9]
            ],
            accentText: [
                accentTextColor,
                accentTextColor,
                accentTextColor,
                accentTextColor,
                accentTextColor,
                accentTextColor,
                accentTextColor,
                accentTextColor,
                accentTextColor,
                accentTextColor
            ]
        },
        primaryColor: "accent",
        primaryShade: 5,
        cursorType: "pointer",
        globalStyles: (theme) => ({
            body: {
                backgroundColor: "white !important"
            },
            code: {
                fontFamily:
                    "ui-monospace, Consolas, 'Cascadia Code', 'Source Code Pro', Menlo, 'DejaVu Sans Mono', monospace"
            },
            ".hljs": {
                borderRadius: theme.radius.sm,
                border: theme.colorScheme == "light" ? "1px solid #00000015" : "1px solid #FFFFFF30"
            },
            ".caret": {
                display: "inline-block",
                marginLeft: "3px",
                content: '""',
                borderTop: "0.3em solid",
                borderRight: "0.3em solid transparent",
                borderBottom: "0",
                borderLeft: "0.3em solid transparent",
                verticalAlign: "2px"
            },
            "math-field": {
                display: "block",
                fontSize: "32px",
                border: `1px solid ${
                    theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[4]
                }`,
                borderRadius: theme.radius.sm,
                padding: theme.spacing.sm
            },
            "math-field:focus-within": {
                border: `1px solid ${theme.fn.primaryColor()}`,
                outline: "none"
            },
            ".ML__keyboard": {
                "z-index": "9999 !important"
            },
            "#mathlive-suggestion-popover": {
                "z-index": "9999 !important"
            },
            mark: {
                color: accentTextColor,
                backgroundColor: theme.fn.primaryColor()
            },
            ".container-after-titlebar": {
                inset: "initial !important"
            },
            ".menubar-menu-container": {
                backgroundColor: "#1e2225 !important",
                borderBottomLeftRadius: "6px",
                borderBottomRightRadius: "6px"
            },
            ".menubar-menu-container .menu-item-icon": { width: "0px !important" },
            ".menubar .menubar-menu-button:not(.disabled).open": {
                backgroundColor: "#1e2225 !important"
            },
            ".menubar .menubar-menu-button:not(.disabled):hover": {
                backgroundColor: "#1e2225 !important"
            },
            "a.action-menu-item": {
                textDecoration: "none",
                cursor: "pointer",
                backgroundColor: "#1e2225 !important"
            },
            "a.action-menu-item:hover": { backgroundColor: "#343a40 !important" }
        }),
        components: {
            AppShell: {
                styles: {
                    main: {
                        height: titlebarStyle == "custom" ? "calc(100vh - 30px)" : "100vh",
                        overflow: "auto",
                        minHeight: "0px",
                        scrollPadding: "124px"
                    },
                    root: {
                        height: titlebarStyle == "custom" ? "calc(100vh - 30px)" : "100vh",
                        marginTop: titlebarStyle == "custom" ? "30px" : "0px",
                        position: "relative",
                        backgroundColor: prefs.general.theme === "dark" ? "#1A1B1E" : "#FFFFFF"
                    },
                    body: {
                        height: titlebarStyle == "custom" ? "calc(100vh - 30px)" : "100vh"
                    }
                }
            },
            Navbar: {
                styles: {
                    root: {
                        height: titlebarStyle == "custom" ? "calc(100vh - 30px)" : "100vh"
                    }
                }
            },
            Select: {
                styles: {
                    label: {
                        marginBottom: "4px"
                    },
                    item: {
                        "&[data-selected]": {
                            color: accentTextColor
                        }
                    }
                }
            },
            TextInput: {
                styles: {
                    label: {
                        marginBottom: "4px"
                    }
                }
            },
            Title: {
                defaultProps: {
                    weight: 600
                }
            },
            Checkbox: {
                styles: {
                    icon: {
                        color: accentTextColor + " !important"
                    }
                }
            },
            Modal: {
                defaultProps: {
                    centered: "true",
                    transitionProps: {
                        exitDuration: 200
                    },
                    overlayProps: {
                        blur: 1,
                        opacity: 0.5
                    },
                    shadow: "md"
                }
            },
            Button: {
                styles: (theme, params, { variant }) => ({
                    label: {
                        color: variant == "filled" ? accentTextColor : undefined
                    }
                })
            },
            ActionIcon: {
                styles: (theme, params, { variant }) => ({
                    root: {
                        color: variant == "filled" ? accentTextColor : undefined
                    }
                })
            }
        }
    };
}
