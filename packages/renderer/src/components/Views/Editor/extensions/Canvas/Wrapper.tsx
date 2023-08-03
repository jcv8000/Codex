/* eslint-disable react/jsx-no-literals */
import React from "react";
import { ActionIcon, Button, ColorInput, Grid, Group, NumberInput } from "@mantine/core";
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { useRef, useState } from "react";
import { v4 as uuid } from "@lukeed/uuid";
import * as d3 from "d3";
import { Icon } from "components/Icon";
import { canvasStyles } from "./styles";

type Data = {
    path: any;
    points: any[];
    id: string;
};

export function CanvasWrapper({ editor, selected, node, updateAttributes }: NodeViewProps) {
    const [editing, setEditing] = useState(editor.isEditable && selected);

    if (editing && selected == false) {
        setEditing(false);
    }

    const [color, setColor] = useState("#000000");
    const [size, setSize] = useState(4);
    const [drawing, setDrawing] = useState(false);

    const svgRef = useRef(null);
    const data = useRef<Data>({
        path: null,
        points: [],
        id: uuid()
    });

    if (!selected) updateAttributes({ editing: false });

    const onStartDrawing = () => {
        if (editing) {
            setDrawing(true);
            data.current.points = [];
            const svg = d3.select(svgRef.current);
            const newPath = svg
                .append("path")
                .data([data.current.points])
                .attr("id", `id-${data.current.id}`)
                .attr("stroke", color)
                .attr("stroke-width", size);

            data.current.path = newPath;
        }
    };

    const onMove = (event: React.MouseEvent | React.TouchEvent) => {
        event.preventDefault();
        if (drawing) {
            data.current.points.push(d3.pointers(event)[0]);
            tick();
        }
    };

    const onEndDrawing = () => {
        const svg = d3.select(svgRef.current);
        svg.on("mousemove", null);
        svg.on("touchmove", null);

        if (!drawing) {
            return;
        }

        setDrawing(false);
        svg.select(`#id-${data.current.id}`).remove();
        data.current.id = uuid();
    };

    const tick = () => {
        requestAnimationFrame(() => {
            data.current.path.attr("d", (points: any) => {
                const newPath = d3.line().curve(d3.curveBasis)(points);
                const lines = node.attrs.lines.filter((item: any) => item.id !== data.current.id);

                updateAttributes({
                    lines: [
                        ...lines,
                        {
                            id: data.current.id,
                            color: color,
                            size: size,
                            path: newPath
                        }
                    ]
                });

                return newPath;
            });
        });
    };

    const clear = () => {
        updateAttributes({
            lines: []
        });
    };

    const { classes } = canvasStyles({ editing: editing });

    return (
        <NodeViewWrapper>
            <div className={classes.root}>
                {editing && (
                    <Grid m="xs" mb={0} align="end">
                        <Grid.Col span={8}>
                            <Group grow>
                                <ColorInput
                                    label="Color"
                                    value={color}
                                    onChange={setColor}
                                    disallowInput
                                    format="hex"
                                    swatches={[
                                        "#25262b",
                                        "#868e96",
                                        "#fa5252",
                                        "#e64980",
                                        "#be4bdb",
                                        "#7950f2",
                                        "#4c6ef5",
                                        "#228be6",
                                        "#15aabf",
                                        "#12b886",
                                        "#40c057",
                                        "#82c91e",
                                        "#fab005",
                                        "#fd7e14"
                                    ]}
                                />
                                <NumberInput
                                    label="Brush Size"
                                    icon={<Icon icon="point" />}
                                    min={1}
                                    max={20}
                                    value={size}
                                    onChange={(value) => (value == "" ? {} : setSize(value))}
                                />
                            </Group>
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <Group grow>
                                <Button variant="default" onClick={() => clear()}>
                                    Clear
                                </Button>
                                <Button onClick={() => setEditing(false)}>Done</Button>
                            </Group>
                        </Grid.Col>
                    </Grid>
                )}

                {!editing && (
                    <ActionIcon
                        className={classes.editIcon}
                        onClick={() => {
                            setEditing(true);
                        }}
                    >
                        <Icon icon="pencil" />
                    </ActionIcon>
                )}

                <svg
                    className={classes.svg}
                    viewBox="0 0 500 400"
                    ref={svgRef}
                    onDoubleClick={() => setEditing(true)}
                    onMouseDown={onStartDrawing}
                    onTouchStart={onStartDrawing}
                    onMouseMove={onMove}
                    onTouchMove={onMove}
                    onMouseUp={onEndDrawing}
                    onMouseLeave={onEndDrawing}
                    onTouchEnd={onEndDrawing}
                    onTouchCancel={onEndDrawing}
                >
                    {node.attrs.lines.map((item: any) => {
                        if (item.id !== data.current.id) {
                            return (
                                <path
                                    key={item.id}
                                    d={item.path}
                                    id={`id-${item.id}`}
                                    stroke={item.color}
                                    strokeWidth={item.size}
                                />
                            );
                        }
                    })}
                </svg>
            </div>
        </NodeViewWrapper>
    );
}
