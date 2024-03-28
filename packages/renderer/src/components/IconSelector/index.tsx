import {
    ActionIcon,
    Button,
    Center,
    ColorPicker,
    Divider,
    Flex,
    Grid,
    Input,
    Modal,
    Select,
    Space,
    Text,
    TextInput,
    Tooltip
} from "@mantine/core";
import { Icon } from "components/Icon";
import { useMemo, useRef, useState } from "react";
import Fuse from "fuse.js";
import { useDebouncedState } from "@mantine/hooks";
import { codexStore, useLocale } from "src/state";
import { Locale } from "common/Locales";

import classes from "./IconSelector.module.css";
import tablerJSON from "../../../../../node_modules/@tabler/icons/icons.json";

type Props = {
    icon: string;
    onChangeIcon: (value: string) => void;
    color: string;
    onChangeColor: (value: string) => void;

    label?: string;
};

type Icon = {
    name: string;
    category: string;
    tags: string[];
};

export function IconSelector(props: Props) {
    const locale = useLocale();
    const texts = locale.mutateModals.iconSelector;

    const tablerIcons = useMemo(() => {
        const list = new Array<Icon>();
        Object.values(tablerJSON).forEach((icon: any) => {
            list.push({
                name: icon.name,
                category: icon.category,
                tags: icon.tags.length ? (icon.tags as string[]) : []
            });

            // Add filled variants of icons
            if (icon.styles.filled !== undefined) {
                list.push({
                    name: icon.name + "-filled",
                    category: icon.category,
                    tags: icon.tags.length ? (icon.tags as string[]) : []
                });
            }
        });

        // Insert custom Codex icon in-order
        for (let i = 0; i < list.length; i++) {
            if (list[i].name > "codex") {
                list.splice(i, 0, {
                    name: "codex",
                    category: "Brand",
                    tags: ["brand", "codex", "software", "icon"]
                });
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
        setShowPickerModal(true);
    };

    const close = () => {
        if (filterInputRef.current) filterInputRef.current.value = "";
        setFilter("");
        setCategory(null);

        setShowPickerModal(false);
    };

    const iconList = useMemo(() => {
        if (scrollRectRef.current) scrollRectRef.current.scrollTop = 0;

        let temp = [...tablerIcons];

        if (category != null) {
            temp = temp.filter((icon) => icon.category == category);
        }

        if (filter != "") {
            const fuse = new Fuse(temp, {
                keys: [{ name: "name", weight: 3 }, "category", { name: "tags", weight: 2 }],
                ignoreLocation: true,
                threshold: 0.2,
                minMatchCharLength: 2
            });
            const results = fuse.search(filter);
            temp = results.map((result) => result.item);
        }

        return temp;
    }, [category, filter, tablerIcons]);

    return (
        <>
            <Input.Wrapper label={props.label}>
                <Grid mb="xl">
                    <Grid.Col span="auto">
                        <Center h="100%">
                            <div>
                                <Tooltip label={texts.tooltip} withArrow withinPortal>
                                    <ActionIcon size={96} variant="default" onClick={open}>
                                        <Icon icon={props.icon} color={props.color} size={64} />
                                    </ActionIcon>
                                </Tooltip>

                                <Space h={4} />

                                <Text ta="center" fz="sm">
                                    {props.icon}
                                </Text>
                            </div>
                        </Center>
                    </Grid.Col>
                    <Grid.Col span="auto">
                        <Center>
                            {props.color == "rainbow" ? (
                                <Center h="230px">
                                    <Button
                                        variant="default"
                                        onClick={() => props.onChangeColor("#999999")}
                                    >
                                        {texts.reset_color_from_rainbow}
                                    </Button>
                                </Center>
                            ) : (
                                <ColorPicker
                                    value={props.color}
                                    onChangeEnd={(value) => props.onChangeColor(value)}
                                    swatchesPerRow={7}
                                    swatches={colorSwatches}
                                />
                            )}
                        </Center>
                    </Grid.Col>
                </Grid>
            </Input.Wrapper>

            <Modal
                opened={showPickerModal}
                onClose={close}
                size="xl"
                zIndex={300}
                overlayProps={{ opacity: 0, blur: 0 }}
                title={texts.modal.title}
            >
                <Grid mb="xs">
                    <Grid.Col span={9}>
                        <TextInput
                            ref={filterInputRef}
                            onChange={(e) => setFilter(e.currentTarget.value)}
                            data-autofocus
                            placeholder={texts.modal.searh_bar_placeholder}
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
                            placeholder={texts.modal.category}
                            value={category}
                            onChange={(value) => setCategory(value)}
                            data={categories(locale)}
                        />
                    </Grid.Col>
                </Grid>

                <Divider
                    my="xs"
                    label={
                        <span>
                            {iconList.length.toLocaleString()} {texts.modal.results}
                        </span>
                    }
                    labelPosition="center"
                />

                <div className={classes.scrollRect} key={category} ref={scrollRectRef}>
                    <Flex gap={8} justify="center" align="center" direction="row" wrap="wrap">
                        {iconList.map((icon) => (
                            <div
                                key={icon.name}
                                title={`"${icon.name}"\n\nCategory: ${icon.category}\nTags: ${icon.tags.join(", ")}`}
                                className={classes.iconButton}
                                onClick={() => {
                                    props.onChangeIcon(icon.name);
                                    close();
                                }}
                            >
                                <Icon
                                    icon={icon.name}
                                    size={22}
                                    color={
                                        codexStore.prefs.general.theme == "light"
                                            ? "black"
                                            : "white"
                                    }
                                />
                            </div>
                        ))}
                    </Flex>
                </div>
            </Modal>
        </>
    );
}

const colorSwatches = [
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
];

function categories(locale: Locale) {
    const categories = locale.mutateModals.iconSelector.modal.categories;
    return [
        {
            value: "Animals",
            label: categories.animals
        },
        {
            value: "Arrows",
            label: categories.arrows
        },
        {
            value: "Brand",
            label: categories.brand
        },
        {
            value: "Buildings",
            label: categories.buildings
        },
        {
            value: "Charts",
            label: categories.charts
        },
        {
            value: "Communication",
            label: categories.communication
        },
        {
            value: "Computers",
            label: categories.computers
        },
        {
            value: "Currencies",
            label: categories.currencies
        },
        {
            value: "Database",
            label: categories.database
        },
        {
            value: "Design",
            label: categories.design
        },
        {
            value: "Devices",
            label: categories.devices
        },
        {
            value: "Document",
            label: categories.document
        },
        {
            value: "E-commerce",
            label: categories.ecommerce
        },
        {
            value: "Electrical",
            label: categories.electrical
        },
        {
            value: "Extensions",
            label: categories.extensions
        },
        {
            value: "Food",
            label: categories.food
        },
        {
            value: "Games",
            label: categories.games
        },
        {
            value: "Gestures",
            label: categories.gestures
        },
        {
            value: "Health",
            label: categories.health
        },
        {
            value: "Laundry",
            label: categories.laundry
        },
        {
            value: "Letters",
            label: categories.letters
        },
        {
            value: "Logic",
            label: categories.logic
        },
        {
            value: "Map",
            label: categories.map
        },
        {
            value: "Math",
            label: categories.math
        },
        {
            value: "Media",
            label: categories.media
        },
        {
            value: "Mood",
            label: categories.mood
        },
        {
            value: "Nature",
            label: categories.nature
        },
        {
            value: "Numbers",
            label: categories.numbers
        },
        {
            value: "Photography",
            label: categories.photography
        },
        {
            value: "Shapes",
            label: categories.shapes
        },
        {
            value: "Sport",
            label: categories.sport
        },
        {
            value: "Symbols",
            label: categories.symbols
        },
        {
            value: "System",
            label: categories.system
        },
        {
            value: "Text",
            label: categories.text
        },
        {
            value: "Vehicles",
            label: categories.vehicles
        },
        {
            value: "Version control",
            label: categories.versionControl
        },
        {
            value: "Weather",
            label: categories.weather
        },
        {
            value: "Zodiac",
            label: categories.zodiac
        }
    ];
}
