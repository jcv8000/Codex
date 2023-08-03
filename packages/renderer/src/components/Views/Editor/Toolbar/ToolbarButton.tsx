import { Button, Tooltip } from "@mantine/core";
import { Icon } from "components/Icon";

type Props = {
    title: string;
    icon: string;
    onClick?: () => void;
    isActive?: () => boolean;
    disabled?: () => boolean;
};

export function ToolbarButton(props: Props) {
    const isActive = props.isActive == undefined ? () => false : props.isActive;
    const disabled = props.disabled == undefined ? () => false : props.disabled;

    return (
        <Tooltip withArrow label={props.title}>
            <span>
                <Button
                    size="xs"
                    style={{ color: "inherit" }}
                    px={6}
                    variant={isActive() ? "filled" : "default"}
                    onClick={props.onClick}
                    disabled={disabled()}
                >
                    <Icon icon={props.icon} size={18} />
                </Button>
            </span>
        </Tooltip>
    );
}
