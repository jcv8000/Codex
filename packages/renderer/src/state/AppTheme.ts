import { ActionIcon, Button, Modal, createTheme, rem } from "@mantine/core";
import { createPaletteFromColor } from "palettey";
import { hexToRgb } from "common/Utils";

export function setTemportaryFakeAccentColor(accentColor: string) {
    const palete = getAccentColorPalette(accentColor);
    setCSSProperty("--mantine-color-accent-0", palete[0]);
    setCSSProperty("--mantine-color-accent-1", palete[1]);
    setCSSProperty("--mantine-color-accent-2", palete[2]);
    setCSSProperty("--mantine-color-accent-3", palete[3]);
    setCSSProperty("--mantine-color-accent-4", palete[4]);
    setCSSProperty("--mantine-color-accent-5", palete[5]);
    setCSSProperty("--mantine-color-accent-6", palete[6]);
    setCSSProperty("--mantine-color-accent-7", palete[7]);
    setCSSProperty("--mantine-color-accent-8", palete[8]);
    setCSSProperty("--mantine-color-accent-9", palete[9]);

    setCSSProperty("--accent-color", palete[5]);
    setCSSProperty("--accent-color-light", palete[4]);
    setCSSProperty("--accent-color-dark", palete[6]);
    setCSSProperty("--accent-text-color", getAccentTextColor(accentColor));
}

export function AppTheme(accentColor: string, codeWordWrap: boolean) {
    const accentColors = getAccentColorPalette(accentColor);

    setCSSProperty("--accent-color", "var(--mantine-primary-color-filled)");
    setCSSProperty("--accent-color-light", accentColors[4]);
    setCSSProperty("--accent-color-dark", accentColors[6]);
    setCSSProperty("--accent-text-color", getAccentTextColor(accentColor));

    setCSSProperty(
        "--code-block-word-wrap",
        codeWordWrap ? "pre-wrap !important" : "pre !important"
    );
    setCSSProperty("--code-block-word-break", codeWordWrap ? "break-all !important" : "inherit");

    return createTheme({
        focusRing: "auto",
        cursorType: "pointer",
        colors: {
            accent: accentColors
        },
        primaryColor: "accent",
        primaryShade: 5,
        components: {
            Modal: Modal.extend({
                defaultProps: {
                    centered: true,
                    transitionProps: {
                        exitDuration: 200
                    },
                    overlayProps: {
                        blur: 1,
                        opacity: 0.5
                    },
                    shadow: "md"
                }
            }),
            Button: Button.extend({
                defaultProps: {
                    variant: "filled"
                },
                styles: (theme, props) => ({
                    root: {
                        color: props.variant == "filled" ? "var(--accent-text-color)" : undefined
                    },
                    label: {
                        fontSize: rem(13)
                    }
                })
            }),
            ActionIcon: ActionIcon.extend({
                styles: (theme, props) => ({
                    root: {
                        color: props.variant == "filled" ? "var(--accent-text-color)" : undefined
                    }
                })
            })
        },
        fontSizes: {
            // xs: rem(10),
            // sm: rem(11),
            // md: rem(13),
            // lg: rem(16),
            // xl: rem(20)
        },
        headings: {
            fontWeight: "600"
        }
    });
}

const setCSSProperty = (name: string, value: string) =>
    document.documentElement.style.setProperty(name, value);

function getAccentColorPalette(
    accentColor: string
): [string, string, string, string, string, string, string, string, string, string] {
    const palette: string[] = [];
    Object.entries(
        createPaletteFromColor("accent", accentColor, {
            useLightness: false
        })["accent"]
    ).forEach((entry) => {
        const [_step, color] = entry;
        palette.push(color);
    });
    return [
        palette[0],
        palette[1],
        palette[2],
        palette[3],
        palette[4],
        palette[5],
        palette[6],
        palette[7],
        palette[8],
        palette[9]
    ];
}

function getAccentTextColor(accentColor: string) {
    let textColor = "white";
    const rgb = hexToRgb(accentColor);
    if (rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114 > 186) {
        textColor = "black";
    }
    return textColor;
}