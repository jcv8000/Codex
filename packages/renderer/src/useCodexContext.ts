import { useContext } from "react";
import { CodexContext } from "./state/CodexStore";

export function useCodexContext() {
    return useContext(CodexContext);
}
