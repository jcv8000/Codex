import { px } from "common/Utils";
import classes from "./Icon.module.css";
import clsx from "clsx";
import { CodexIconSVGPaths } from "./CodexIconSVGPaths";

/*
    Tabler webfont icons use fontSize and color,
    custom Codex svg uses width/height and fill
*/

type Props = {
    icon: string;
    color?: string;
    vAlign?: string;
    size?: number;
};

export function Icon({ icon, color = "inherit", vAlign = "middle", size = 18 }: Props) {
    if (icon == "codex") {
        return <CodexIcon color={color} vAlign={vAlign} size={size} />;
    }

    let styles: React.CSSProperties = { fontSize: px(size) };
    if (color != "rainbow") styles = { ...styles, color: color };

    return (
        <i
            className={clsx(`ti ti-${icon}`, classes.icon, color == "rainbow" && classes.rainbow)}
            style={styles}
        ></i>
    );
}

function CodexIcon({ color, vAlign, size }: Required<Omit<Props, "icon">>) {
    let styles: React.CSSProperties = { width: px(size), height: px(size), verticalAlign: vAlign };
    if (color != "rainbow") styles = { ...styles, fill: color };

    return (
        <svg
            viewBox="0 0 24 24"
            className={clsx(classes.icon, color == "rainbow" && classes.rainbow)}
            style={styles}
        >
            <CodexIconSVGPaths />
        </svg>
    );
}
