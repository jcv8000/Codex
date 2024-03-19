import {
    ActionIcon,
    Button,
    Center,
    ColorInput,
    ColorSwatch,
    Container,
    Grid,
    Group,
    Paper,
    Space,
    Stack,
    Text,
    TextInput,
    Title
} from "@mantine/core";
import { px } from "common/Utils";
import { Tag } from "common/schemas/v2";
import { Icon } from "components/Icon";
import { useState } from "react";
import { codexStore, deproxy, writeSave } from "src/state";
import { useSnapshot } from "valtio";
import { v4 as uuid } from "@lukeed/uuid";

export function TagsView() {
    const { save } = useSnapshot(codexStore);
    return (
        <>
            <Container size="xs">
                <Center>
                    <Title order={2}>Tags</Title>
                </Center>

                <Space h="lg" />

                <Stack>
                    {save.tags.map((t) => (
                        <TagComponent key={t.name} tag={t} />
                    ))}
                </Stack>

                <Space h="lg" />

                <Center>
                    <Button
                        variant="default"
                        leftSection={<Icon icon="plus" />}
                        onClick={() => {
                            codexStore.save.tags.push({
                                id: uuid(),
                                name: "New Tag",
                                color: "#FF0000"
                            });
                            writeSave();
                        }}
                    >
                        New Tag
                    </Button>
                </Center>
            </Container>
        </>
    );
}

function TagComponent({ tag }: { tag: Tag }) {
    const [hovered, setHovered] = useState(false);
    const [editing, setEditing] = useState(false);

    const [newName, setNewName] = useState(tag.name);
    const [newColor, setNewColor] = useState(tag.color);
    return (
        <Paper
            withBorder
            p="xs"
            radius="md"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {editing ? (
                <Group>
                    <ColorInput
                        label="Tag Color"
                        w={130}
                        value={newColor}
                        onChange={(v) => setNewColor(v)}
                    />

                    <TextInput
                        label="Tag Name"
                        value={newName}
                        onChange={(e) => setNewName(e.currentTarget.value)}
                    />

                    <ActionIcon
                        style={{ marginLeft: "auto" }}
                        onClick={() => {
                            const real = codexStore.save.tags.find((v) => v.id == tag.id);
                            if (real == undefined) return;

                            real.name = newName;
                            real.color = newColor;
                            writeSave();
                            setEditing(false);
                        }}
                    >
                        <Icon icon="check" />
                    </ActionIcon>
                </Group>
            ) : (
                <Group>
                    <ColorSwatch color={tag.color} size={18} />
                    <Text fz="sm" truncate>
                        {tag.name}
                    </Text>

                    <div
                        style={{
                            marginLeft: "auto",
                            opacity: hovered ? 1 : 0,
                            transition: "opacity 0.1s ease"
                        }}
                    >
                        <ActionIcon variant="subtle" color="dark" onClick={() => setEditing(true)}>
                            <Icon icon="pencil" />
                        </ActionIcon>
                        <ActionIcon
                            variant="subtle"
                            color="dark"
                            onClick={() => {
                                const real = codexStore.save.tags.find((v) => v.id == tag.id);
                                if (real == undefined) return;
                                const index = codexStore.save.tags.indexOf(real);
                                if (index == -1) return;

                                codexStore.save.tags.splice(index, 1);
                                writeSave();
                            }}
                        >
                            <Icon icon="x" />
                        </ActionIcon>
                    </div>
                </Group>
            )}
        </Paper>
    );
}
