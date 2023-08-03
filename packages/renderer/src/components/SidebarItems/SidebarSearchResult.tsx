import { Box, Flex, Text, useMantineTheme } from "@mantine/core";
import { Icon } from "components/Icon";
import React, { useContext } from "react";
import { Page } from "common/Save";
import { AppContext } from "types/AppStore";
import { sidebarItemStyles } from "./styles";
import { locales } from "common/Locales";
import { ModalContext } from "components/Modals";

type Props = {
    page: Page;
    nameMatch?: string;
    textMatch?: string;
};

export function SidebarSearchResult({ page, nameMatch, textMatch }: Props) {
    const theme = useMantineTheme();
    const appContext = useContext(AppContext);
    const modalContext = useContext(ModalContext);
    const locale = locales[appContext.prefs.general.locale];

    const onClick = () => {
        appContext.setView("editor", page);
    };

    const onContextMenu: React.MouseEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        modalContext.openContextMenu({ item: page, x: e.clientX, y: e.clientY });
    };

    const active = appContext.view == "editor" && appContext.activePage == page ? true : false;

    const renderedName = [];

    if (nameMatch !== undefined) {
        // Highlight the name match
        const startIndex = page.name.toLowerCase().indexOf(nameMatch.toLowerCase());
        const endIndex =
            page.name.toLowerCase().indexOf(nameMatch.toLowerCase()) + nameMatch.length;

        renderedName.push(<span key={page.id + "1"}>{page.name.substring(0, startIndex)}</span>);
        renderedName.push(
            <mark key={page.id + "2"} className="p-0">
                {page.name.substring(startIndex, endIndex)}
            </mark>
        );
        renderedName.push(
            <span key={page.id + "3"}>{page.name.substring(endIndex, page.name.length + 1)}</span>
        );
    } else {
        renderedName.push(<span key={page.id + "4"}>{page.name}</span>);
    }

    const { classes } = sidebarItemStyles({ active: active, depth: 0, open: false });

    return (
        <Box
            onClick={onClick}
            onContextMenu={onContextMenu}
            title={page.name}
            px="sm"
            className={classes.root}
        >
            <Flex h={34} align="center" gap="sm">
                <Icon
                    icon={page.icon}
                    color={active ? theme.colors["accentText"][0] : page.color}
                    vAlign="-3px"
                />
                <Text truncate>{renderedName}</Text>
            </Flex>
            {textMatch !== undefined && (
                <Flex h={34} align="center" gap="sm">
                    <i>
                        {locale.sidebar.search_contains} &quot;<mark>{textMatch}</mark>&quot;
                    </i>
                </Flex>
            )}
        </Box>
    );
}
