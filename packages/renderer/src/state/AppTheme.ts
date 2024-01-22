import { ActionIcon, Button, Modal, createTheme, rem } from "@mantine/core";
import { generateColors } from "@mantine/colors-generator";
import { hexToRgb } from "common/Utils";

export function setCSSAccentColor(accentColor: string) {
    //setCSSProperty("--accent-color-light", accentColors[4]);
    setCSSProperty("--accent-color", accentColor);
    //setCSSProperty("--accent-color-dark", accentColors[6]);
    setCSSProperty("--accent-text-color", getAccentTextColor(accentColor));
}

export function AppTheme(accentColor: string, codeWordWrap: boolean) {
    const accentColors = generateColors(accentColor);
    const accentTextColor = getAccentTextColor(accentColor);

    setCSSAccentColor(accentColor);

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
                styles: (theme, props) => ({
                    label: {
                        fontSize: rem(13),
                        color: props.variant == "filled" ? accentTextColor : undefined
                    }
                })
            }),
            ActionIcon: ActionIcon.extend({
                styles: (theme, props) => ({
                    root: {
                        color: props.variant == "filled" ? accentTextColor : undefined
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

function getAccentTextColor(accentColor: string) {
    let textColor = "white";
    const rgb = hexToRgb(accentColor);
    if (rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114 > 186) {
        textColor = "black";
    }
    return textColor;
}
