import { Tooltip, ActionIcon, useMantineTheme } from "@mantine/core";
import { locales } from "common/Locales";
import { Icon } from "components/Icon";
import { useContext } from "react";
import { AppContext } from "types/AppStore";

type Props = {
    onClick: () => void;
};

export function ToolbarToggler({ onClick }: Props) {
    const appContext = useContext(AppContext);
    const texts = locales[appContext.prefs.general.locale].editor;
    const theme = useMantineTheme();

    return (
        <Tooltip withArrow label={texts.toggle_toolbar} position="left">
            <ActionIcon
                onClick={onClick}
                style={{
                    color: theme.colors.gray[6],
                    position: "absolute",
                    top: "24px",
                    right: "32px"
                }}
            >
                <Icon icon="tools" />
            </ActionIcon>
        </Tooltip>
    );
}
