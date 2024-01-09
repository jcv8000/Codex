import { View } from "../CodexStore";

export function useSetView(setView: React.Dispatch<React.SetStateAction<View>>) {
    return (v: View) => {
        if (v.value == "editor") {
            // saving functionality
        }
        console.log("hook used");
        setView(v);
    };
}
