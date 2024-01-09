import { Button, Modal, createTheme, rem } from "@mantine/core";
import { generateColors } from "@mantine/colors-generator";
import { Prefs } from "common/Prefs";

export const AppTheme = (prefs: Prefs) =>
    createTheme({
        autoContrast: true,
        luminanceThreshold: 0.48,
        focusRing: "auto",
        cursorType: "pointer",
        colors: {
            accent: generateColors(prefs.general.accentColor.substring(1, 7))
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
                styles: () => ({
                    label: {
                        fontSize: rem(13)
                    }
                })
            })
        },
        fontSizes: {
            xs: rem(10),
            sm: rem(11),
            md: rem(13),
            lg: rem(16),
            xl: rem(20)
        },
        headings: {
            fontWeight: "600"
        }
    });
