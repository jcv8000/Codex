import { useContext } from "react";
import { CodexContext } from "./CodexStore";

export function useCodexContext() {
    return useContext(CodexContext);
}
