import { MainFloat } from "components/Floats";

export function Toolbar() {
    return (
        <MainFloat pos={{ top: 16, left: 64, right: 64 }}>
            <div style={{ width: "100%", height: "30px", backgroundColor: "red" }} />
        </MainFloat>
    );
}
