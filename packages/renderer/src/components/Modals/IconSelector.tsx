import {
    ActionIcon,
    Button,
    Center,
    ColorPicker,
    Divider,
    Flex,
    Grid,
    Modal,
    Select,
    Text,
    TextInput,
    Tooltip,
    createStyles
} from "@mantine/core";
import { Icon } from "components/Icon";
import { useContext, useMemo, useRef, useState } from "react";
import Fuse from "fuse.js";
import tablerJSON from "../../../../../node_modules/@tabler/icons/tags.json";
import { useDebouncedState } from "@mantine/hooks";
import { locales } from "common/Locales";
import { AppContext } from "types/AppStore";

const styles = createStyles((theme) => ({
    scrollRect: {
        height: "400px",
        overflowY: "auto"
    },
    iconButton: {
        backgroundColor: theme.colorScheme == "light" ? theme.colors.gray[1] : theme.colors.dark[5],
        color: theme.colorScheme == "light" ? theme.black : theme.white,
        width: "48px",
        height: "48px",
        borderRadius: theme.radius.sm,
        margin: theme.spacing.sm,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",

        "&:hover": {
            backgroundColor:
                theme.colorScheme == "light" ? theme.colors.gray[2] : theme.colors.dark[4]
        }
    }
}));

type Props = {
    icon: string;
    onChangeIcon: (value: string) => void;
    color: string;
    onChangeColor: (value: string) => void;
};

export function IconSelector({ icon, onChangeIcon, color, onChangeColor }: Props) {
    const { classes } = styles();
    const appContext = useContext(AppContext);
    const locale = locales[appContext.prefs.general.locale];

    const tablerIcons = useMemo(() => {
        const list = Object.values(tablerJSON).map((icon) => ({
            name: icon.name,
            category: icon.category,
            tags: icon.tags
        }));

        // Insert custom Codex icon in-order
        for (let i = 0; i < list.length; i++) {
            if (list[i].name > "codex") {
                list.splice(i, 0, { name: "codex", category: "Brand", tags: [] });
                break;
            }
        }

        return list;
    }, []);

    const [showPickerModal, setShowPickerModal] = useState(false);
    const [category, setCategory] = useState<string | null>(null);
    const [filter, setFilter] = useDebouncedState("", 200);

    const scrollRectRef = useRef<HTMLDivElement>(null);
    const filterInputRef = useRef<HTMLInputElement>(null);

    const open = () => {
        if (filterInputRef.current) filterInputRef.current.value = "";
        setFilter("");
        setCategory(null);

        setShowPickerModal(true);
    };

    const close = () => {
        setShowPickerModal(false);
    };

    const iconList = useMemo(() => {
        if (scrollRectRef.current) scrollRectRef.current.scrollTop = 0;

        let temp = [...tablerIcons];

        if (category != null) {
            const newTemp: { name: string; category: string; tags: string[] }[] = [];
            temp.forEach((icon) => {
                if (icon.category == category) newTemp.push(icon);
            });
            temp = newTemp;
        }

        if (filter != "") {
            const fuse = new Fuse(temp, {
                keys: ["name", "category", "tags"],
                ignoreLocation: true,
                threshold: 0.2,
                minMatchCharLength: 2
            });
            const results = fuse.search(filter);
            temp = [];
            temp = results.map((result) => result.item);
        }

        return temp;
    }, [category, filter, tablerIcons]);

    return (
        <>
            <Grid mb="xl">
                <Grid.Col span="auto">
                    <Center h="100%">
                        <Tooltip
                            label={locale.mutateModals.iconSelector.tooltip}
                            withArrow
                            withinPortal
                        >
                            <ActionIcon size={96} variant="outline" onClick={open}>
                                <Icon icon={icon} color={color} size={64} />
                            </ActionIcon>
                        </Tooltip>
                    </Center>
                </Grid.Col>
                <Grid.Col span="auto">
                    <Center>
                        {color == "rainbow" ? (
                            <Center h="230px">
                                <Button variant="default" onClick={() => onChangeColor("#999999")}>
                                    {locale.mutateModals.iconSelector.reset_color_from_rainbow}
                                </Button>
                            </Center>
                        ) : (
                            <ColorPicker
                                value={color}
                                onChangeEnd={(value) => onChangeColor(value)}
                                swatchesPerRow={7}
                                swatches={[
                                    "#f03e3e",
                                    "#ff7926",
                                    "#fcc419",
                                    "#74b816",
                                    "#37b34e",
                                    "#0ca678",
                                    "#1098ad",
                                    "#1c7fd6",
                                    "#4263eb",
                                    "#7048e8",
                                    "#ae3ec9",
                                    "#f06595",
                                    "#999999",
                                    "#000000"
                                ]}
                            />
                        )}
                    </Center>
                </Grid.Col>
            </Grid>

            <Modal
                opened={showPickerModal}
                onClose={close}
                size="xl"
                zIndex={99999}
                overlayProps={{ opacity: 0, blur: 0 }}
                title={
                    <Text size={14} mb={4}>
                        {locale.mutateModals.iconSelector.modal.title}
                    </Text>
                }
            >
                <Grid mb="xs">
                    <Grid.Col span={9}>
                        <TextInput
                            ref={filterInputRef}
                            onChange={(e) => setFilter(e.currentTarget.value)}
                            data-autofocus
                            placeholder={
                                locale.mutateModals.iconSelector.modal.searh_bar_placeholder
                            }
                            rightSection={
                                filter != "" && (
                                    <ActionIcon
                                        onClick={() => {
                                            setFilter("");
                                            if (filterInputRef.current)
                                                filterInputRef.current.value = "";
                                        }}
                                    >
                                        <Icon icon="x" />
                                    </ActionIcon>
                                )
                            }
                        />
                    </Grid.Col>
                    <Grid.Col span={3}>
                        <Select
                            clearable
                            placeholder={locale.mutateModals.iconSelector.modal.category}
                            value={category}
                            onChange={(value) => setCategory(value)}
                            data={[
                                {
                                    value: "Animals",
                                    label: locale.mutateModals.iconSelector.modal.categories.animals
                                },
                                {
                                    value: "Arrows",
                                    label: locale.mutateModals.iconSelector.modal.categories.arrows
                                },
                                {
                                    value: "Brand",
                                    label: locale.mutateModals.iconSelector.modal.categories.brand
                                },
                                {
                                    value: "Buildings",
                                    label: locale.mutateModals.iconSelector.modal.categories
                                        .buildings
                                },
                                {
                                    value: "Charts",
                                    label: locale.mutateModals.iconSelector.modal.categories.charts
                                },
                                {
                                    value: "Communication",
                                    label: locale.mutateModals.iconSelector.modal.categories
                                        .communication
                                },
                                {
                                    value: "Computers",
                                    label: locale.mutateModals.iconSelector.modal.categories
                                        .computers
                                },
                                {
                                    value: "Currencies",
                                    label: locale.mutateModals.iconSelector.modal.categories
                                        .currencies
                                },
                                {
                                    value: "Database",
                                    label: locale.mutateModals.iconSelector.modal.categories
                                        .database
                                },
                                {
                                    value: "Design",
                                    label: locale.mutateModals.iconSelector.modal.categories.design
                                },
                                {
                                    value: "Devices",
                                    label: locale.mutateModals.iconSelector.modal.categories.devices
                                },
                                {
                                    value: "Document",
                                    label: locale.mutateModals.iconSelector.modal.categories
                                        .document
                                },
                                {
                                    value: "E-commerce",
                                    label: locale.mutateModals.iconSelector.modal.categories
                                        .ecommerce
                                },
                                {
                                    value: "Electrical",
                                    label: locale.mutateModals.iconSelector.modal.categories
                                        .electrical
                                },
                                {
                                    value: "Filled",
                                    label: locale.mutateModals.iconSelector.modal.categories.filled
                                },
                                {
                                    value: "Food",
                                    label: locale.mutateModals.iconSelector.modal.categories.food
                                },
                                {
                                    value: "Gestures",
                                    label: locale.mutateModals.iconSelector.modal.categories
                                        .gestures
                                },
                                {
                                    value: "Health",
                                    label: locale.mutateModals.iconSelector.modal.categories.health
                                },
                                {
                                    value: "Letters",
                                    label: locale.mutateModals.iconSelector.modal.categories.letters
                                },
                                {
                                    value: "Logic",
                                    label: locale.mutateModals.iconSelector.modal.categories.logic
                                },
                                {
                                    value: "Map",
                                    label: locale.mutateModals.iconSelector.modal.categories.map
                                },
                                {
                                    value: "Math",
                                    label: locale.mutateModals.iconSelector.modal.categories.math
                                },
                                {
                                    value: "Media",
                                    label: locale.mutateModals.iconSelector.modal.categories.media
                                },
                                {
                                    value: "Mood",
                                    label: locale.mutateModals.iconSelector.modal.categories.mood
                                },
                                {
                                    value: "Nature",
                                    label: locale.mutateModals.iconSelector.modal.categories.nature
                                },
                                {
                                    value: "Numbers",
                                    label: locale.mutateModals.iconSelector.modal.categories.numbers
                                },
                                {
                                    value: "Photography",
                                    label: locale.mutateModals.iconSelector.modal.categories
                                        .photography
                                },
                                {
                                    value: "Shapes",
                                    label: locale.mutateModals.iconSelector.modal.categories.shapes
                                },
                                {
                                    value: "Sport",
                                    label: locale.mutateModals.iconSelector.modal.categories.sport
                                },
                                {
                                    value: "Symbols",
                                    label: locale.mutateModals.iconSelector.modal.categories.symbols
                                },
                                {
                                    value: "System",
                                    label: locale.mutateModals.iconSelector.modal.categories.system
                                },
                                {
                                    value: "Text",
                                    label: locale.mutateModals.iconSelector.modal.categories.text
                                },
                                {
                                    value: "Vehicles",
                                    label: locale.mutateModals.iconSelector.modal.categories
                                        .vehicles
                                },
                                {
                                    value: "Version control",
                                    label: locale.mutateModals.iconSelector.modal.categories
                                        .versionControl
                                },
                                {
                                    value: "Weather",
                                    label: locale.mutateModals.iconSelector.modal.categories.weather
                                }
                            ]}
                        />
                    </Grid.Col>
                </Grid>

                <Divider
                    my="xs"
                    label={
                        <span>
                            {iconList.length.toLocaleString()}{" "}
                            {locale.mutateModals.iconSelector.modal.results}
                        </span>
                    }
                    labelPosition="center"
                />

                <div className={classes.scrollRect} key={category} ref={scrollRectRef}>
                    <Flex gap={8} justify="center" align="center" direction="row" wrap="wrap">
                        {iconList.map((icon) => (
                            <div
                                key={icon.name}
                                title={icon.name}
                                className={classes.iconButton}
                                onClick={() => {
                                    onChangeIcon(icon.name);
                                    close();
                                }}
                            >
                                <Icon icon={icon.name} size={22} />
                            </div>
                        ))}
                    </Flex>
                </div>
            </Modal>
        </>
    );
}
