import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { ActionIcon, createStyles } from "@mantine/core";
import { Icon } from "components/Icon";

const useStyles = createStyles((theme) => ({
    wrapper: {
        position: "relative",
        "&:hover .controls": {
            opacity: 1
        }
    },
    controls: {
        position: "absolute",
        left: "-30px",
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        opacity: 0,
        transition: "opacity 0.2s ease"
    },
    icon: {
        color: theme.colors.gray[5],
        "&:hover": {
            color: theme.colorScheme === "dark" ? theme.white : theme.black,
            backgroundColor: "transparent"
        }
    }
}));

export function HeadingNodeView(props: NodeViewProps) {
    const { classes } = useStyles();

    const toggleFold = () => {
        props.updateAttributes({
            collapsed: !props.node.attrs.collapsed
        });
    };

    const Tag = `h${props.node.attrs.level}` as keyof JSX.IntrinsicElements;

    return (
        <NodeViewWrapper className={classes.wrapper}>
            <div className={`controls ${classes.controls}`} contentEditable={false}>
                <ActionIcon size="xs" className={classes.icon} onClick={toggleFold} title={props.node.attrs.collapsed ? "Unfold" : "Fold"}>
                    <Icon icon={props.node.attrs.collapsed ? "chevron-right" : "chevron-down"} size={16} />
                </ActionIcon>
            </div>
            <Tag id={props.node.attrs.id}>
                <NodeViewContent />
            </Tag>
        </NodeViewWrapper>
    );
}
