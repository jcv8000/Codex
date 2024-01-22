import { rem } from "@mantine/core";

export function getLeftPadding(depth: number) {
    return rem((depth + 1) * 12);
}
