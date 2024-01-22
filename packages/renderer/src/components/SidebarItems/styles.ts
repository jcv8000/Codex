import { FlexProps, rem } from "@mantine/core";

export function getLeftPadding(depth: number) {
    return rem((depth + 1) * 12);
}

export const flexProps: FlexProps = { h: 34, gap: "sm", pr: "sm", align: "center" };
export const textSize = "sm";
