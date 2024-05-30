import { View, codexStore } from ".";

export async function setView(v: View) {
    // If the current view is a page WITH unsaved changes, save it
    if (codexStore.view.value == "editor" && window.unsavedChanges === true) {
        const p = codexStore.view.page;
        if (window.editor != null) {
            const content = JSON.stringify(window.editor.getJSON());
            await window.ipc.invoke("write-page", p.fileName, content);
            window.unsavedChanges = false;
        }
    }

    // If the new view is a page, load it
    if (v.value == "editor") {
        const p = v.page;

        const text = await window.ipc.invoke("load-page", p.fileName);
        if (text == null) {
            console.error("Unable to load page data from '" + p.fileName + "'");
            // TODO show error notification
        } else {
            codexStore.view = { value: "editor", page: p, initialContentString: text };
        }
    } else {
        codexStore.view = v;
    }
}
