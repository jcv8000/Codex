# Codex Changelog

## Recent Feature Updates

### ✨ Features & Enhancements

-   **Revision Notes System**

    -   Added the ability to mark specific text selections as "Revision Notes" using the `CTRL+SHIFT+R` (`Cmd+Shift+R` on Mac) shortcut.
    -   A new "Revision Notes" panel has been added to the editor's sidebar (accessible via a dedicated icon).
    -   Clicking on a note in the sidebar will automatically scroll the editor and focus on the exact position of the revision.
    -   The visual style of these notes (background color, borders, etc.) can now be dynamically configured via the `Prefs.ts` file under `revisionNoteStyle`.

-   **Section & Paragraph Reordering**

    -   You can now seamlessly reorganize your document's structure without breaking formatting.
    -   Hovering over any heading (`H1`, `H2`, `H3`) will reveal discrete "Up" and "Down" arrows on the left side.
    -   Clicking these arrows will instantly move the entire section (the heading along with all of its inner paragraphs and content) up or down, automatically swapping places with adjacent sections.

-   **Text Finder (Search in Page)**

    -   Added a fully functional "Find in Document" overlay accessible via `CTRL+F` / `CMD+F`.
    -   Integrated a custom Tiptap Search extension leveraging ProseMirror Decorations to highlight text seamlessly without hijacking the DOM string selection or the user's cursor focus.
    -   Added auto-scroll to the current match using smooth browser native transitions.
    -   Supported Keyboard Shortcuts within the Finder input box (`Enter` for next, `Shift+Enter` for previous, `Escape` to close).
    -   Safely escaped all RegEx characters to support searching for wildcards and punctuation marks without performance bottlenecks.

-   **Image Cropper Modal**

    -   Integrated a robust Image Cropping sub-routine directly into the Editor.
    -   When selecting an image inside the editor, a new "Crop" button dynamically appears in the toolbar.
    -   The modal supports freeform cropping using an HTML5 Canvas interface and elegantly replaces the old image with the newly cropped Base64 preview.

-   **Dynamic 'Word-Style' Text Styling**

    -   Transitioned from hardcoded tags to a fully dynamic Custom Styles configuration powered by JSON (`Prefs.ts`).
    -   Users can now define entirely customized text and heading rules globally mapped within Codex.
    -   The Editor Toolbar dropdown automatically reads and maps these styles into selectable headings and paragraphs seamlessly.

-   **Auto-Save System**

    -   Implemented an internal interval-based tracker managing the background saving operations of the active note.
    -   Introduced fully granular controls under Settings to disable Auto-Save or configure its intervals (ranging from 1 to 30 minutes).

-   **Settings Menu Redesign & Organization**

    -   Overhauled `SettingsView.tsx` utilizing Mantine's modern Tab-based interface.
    -   Split configurations into three accessible macro-categories: **General**, **Editor**, and **Saving**.
    -   Added a brand new scaling preference (`toolbarSize`) that dynamically alters the size of the Editor Toolbar for accessibility and better clicks.

-   **Table of Contents (TOC) UI Uplift**

    -   Redesigned the TOC container to be scrollable and properly constrained inside the view window, resolving overlap issues for documents spanning many headings.

-   **Localization Coverage**
    -   Added and integrated all strings relating to Auto-Save, Cropper, Editor Width/Border, Text Finder, and Toolbar sizing across all language dictionaries (English `en_US`, Russian `ru_RU`, Simplified Chinese `zh_CN`).

-   **Batch File Operations**
    -   Enabled multi-select in the sidebar allowing users to select multiple pages/folders at once.
    -   Added the ability to batch export all selected pages to PDF or Markdown directly from the Context Menu.
    -   Introduced an advanced "Delete from disk" option when deleting files. Checking this box recursively and permanently removes the underlying files from the host machine's physical storage.

-   **Code Block Enhancements**
    -   The "Code Block" button in the toolbar now intelligently defaults to `plaintext` when inserted without selecting a specific language.
    -   Completely revamped Syntax Highlighting integration (`LowlightPlugin`) to properly utilize all generated `highlight.js` CSS classes. This resolves widespread syntax coloring omissions across almost all languages (e.g., PowerShell keywords are now colored vividly and correctly).

### 🐛 Bug Fixes

-   Prevented `CTRL+F` from causing duplicate component mounts if the finder was already active.
-   Resolved Z-Index overlapping conflicts between the floating Text Finder and the sticky Editor Toolbar.
-   Fixed an issue where the generic Auto-Save feature could crash if trigged while switching components globally.
-   Resolved a critical syntax error in the internal `ResizableImage` component that broke Editor Copy/Paste functionality. Users can now copy and paste text, formatting, images, and GIFs seamlessly both inside the app and to external editors like MS Word.
