'use strict';

const { remote, shell, ipcRenderer } = require('electron');
const fs = require('fs');
const customTitlebar = require('custom-electron-titlebar');
const defaultDataDir = remote.app.getPath("userData");
const { EditorState } = require("prosemirror-state");
const { EditorView } = require("prosemirror-view");
//const { exampleSetup } = require("prosemirror-example-setup");
const { exampleSetup } = require("./prosemirror/setup");
const { Schema } = require('prosemirror-model');
const { schema } = require('./prosemirror/schema');
const { tableNodes } = require('prosemirror-tables');
const { addListNodes } = require('prosemirror-schema-list');
const contextMenu = require('electron-context-menu');
const { customMarkdownSerializer } = require('./prosemirror/md-serializer');
const validator = require('validator');

let tableSchema = new Schema({
    nodes: schema.spec.nodes.append(tableNodes({
        tableGroup: "block",
        cellContent: "paragraph+",
        cellAttributes: {
            background: {
                default: null,
                getFromDOM(dom) { return dom.style.backgroundColor || null },
                setDOMAttr(value, attrs) { if (value) attrs.style = (attrs.style || "") + `background-color: ${value};` }
            }
        }
    })),
    marks: schema.spec.marks
});

var mySchema = new Schema({
    nodes: addListNodes(tableSchema.spec.nodes, "paragraph block*", "block"),
    marks: tableSchema.spec.marks
});

tableSchema = null;

alert = function (msg, det = null) {
    var options = {
        type: 'error',
        buttons: ["Ok"],
        defaultId: 0,
        cancelId: 0,
        detail: (det != null) ? det : 'Please report this error to support@codexnotes.com',
        message: msg
    }
    remote.dialog.showMessageBox(remote.getCurrentWindow(), options);
}

function popup(title, mes, det) {
    var options = {
        type: 'info',
        buttons: ["Ok"],
        defaultId: 0,
        cancelId: 0,
        detail: det,
        title: title,
        message: mes
    }
    remote.dialog.showMessageBox(remote.getCurrentWindow(), options);
}

class UserPrefs {
    theme = "0";
    codeStyle = "atom-one-dark";
    accentColor = "#FF7A27";
    defaultZoom = 1.0;
    defaultMaximized = false;
    dataDir = defaultDataDir;
    pdfBreakOnH1 = false;
    pdfDarkMode = false;
    openPDFonExport = true;
    openedNotebooks = [];
    tabSize = 4;
    sidebarWidth = 275;
    showCodeOverlay = true;
    codeWordWrap = false;
    firstUse = true;
    showMenuBar = true;
}

class Save {
    nextPageIndex = 0;
    notebooks = [];
}

class Notebook {
    name;
    color;
    icon = "book";
    pages = [];
    constructor(name, color) {
        this.name = name;
        this.color = color;
        this.pages = [];
    }
}

class Page {
    title;
    fileName;
    favorite = false;
    constructor(title) {
        this.title = title;
        this.fileName = "";
    }
}

window.onbeforeunload = (e) => {


    //cache which notebooks are opened
    prefs.openedNotebooks = [];


    if (destroyOpenedNotebooks == false) {
        for (let i = 0; i < save.notebooks.length; i++) {

            let nbList = document.getElementById(`nb-${i}-list`);
            if (nbList.classList.contains('show')) {
                prefs.openedNotebooks[prefs.openedNotebooks.length] = i;
            }
        }
    }


    saveData();
    savePrefs();
}

var darkStyleLink;

var save;
var prefs;
var selectedPage;
var selectedPageContent;

var rightClickedNotebookIndex;
// PAGE INDEX IS LOCAL TO THE NOTEBOOK
var rightClickedPageIndex;

var expandedNotebooks = [];
var activePage;

var draggedNotebookIndex;
var draggedPageIndex;
var draggedPagesNotebookIndex;
var draggingNotebook = false;
var draggingPage = false;

var fadeInSaveIndicator;

var canSaveData = false;
var canSavePrefs = false;
var zoomLevel = 1.000;
var titlebar;
var normalMenu;
var editingMenu;

var sidebarWidth = 275;

var favoritePages = [];

var destroyOpenedNotebooks = false;


var lightThemes = [ "a11y-light", "arduino-light", "ascetic", "atelier-cave-light", "atelier-dune-light", "atelier-estuary-light", "atelier-forest-light", "atelier-heath-light", "atelier-lakeside-light", "atelier-plateau-light", "atelier-savanna-light", "atelier-seaside-light", "atelier-sulphurpool-light", "atom-one-light", "color-brewer", "default", "docco", "foundation", "github-gist", "github", "font-weight: bold;", "googlecode", "grayscale", "gruvbox-light", "idea", "isbl-editor-light", "kimbie.light", "lightfair", "magula", "mono-blue", "nnfx", "paraiso-light", "purebasic", "qtcreator_light", "routeros", "solarized-light", "tomorrow", "vs", "xcode" ];
var darkThemes = [ "a11y-dark", "agate", "androidstudio", "an-old-hope", "arta", "atelier-cave-dark", "atelier-dune-dark", "atelier-estuary-dark", "atelier-forest-dark", "atelier-heath-dark", "atelier-lakeside-dark", "atelier-plateau-dark", "atelier-savanna-dark", "atelier-seaside-dark", "atelier-sulphurpool-dark", "atom-one-dark-reasonable", "atom-one-dark", "font-weight: bold;", "codepen-embed", "darcula", "dark", "dracula", "far", "gml", "gradient-dark", "gruvbox-dark", "hopscotch", "hybrid", "ir-black", "isbl-editor-dark", "kimbie.dark", "lioshi", "monokai-sublime", "monokai", "night-owl", "nnfx-dark", "nord", "ocean", "obsidian", "paraiso-dark", "pojoaque", "qtcreator_dark", "railscasts", "rainbow", "shades-of-purple", "solarized-dark", "srcery", "sunburst", "tomorrow-night-blue", "tomorrow-night-bright", "tomorrow-night-eighties", "tomorrow-night", "vs2015", "xt256", "zenburn" ];

var exportNotebookLocation = "";

/**
 * Run this function at start.
 */
function init() {

    window.addEventListener("auxclick", (event) => {
        if (event.button === 1) {
            event.preventDefault();
        }
    });
    window.addEventListener("click", (event) => {
        if (event.ctrlKey) {
            event.preventDefault();
        }
    })

    contextMenu({
        showSearchWithGoogle: false,
        showLookUpSelection: false
    });

    if (remote.process.platform === 'win32') {
        titlebar = new customTitlebar.Titlebar({
            backgroundColor: customTitlebar.Color.fromHex('#343A40'),
            unfocusEffect: true,
            icon: './icons/icon.ico'
        });


        document.getElementById('editorRibbon').style.marginTop = "40px";
    }

    normalMenu = new remote.Menu();
    normalMenu.append(new remote.MenuItem({
        label: 'File',
        submenu: [
            {
                label: 'New Notebook',
                accelerator: 'CmdOrCtrl+N',
                click: () => $('#newNotebookModal').modal('show')
            },
            {
                type: 'separator'
            },
            {
                label: 'Exit',
                click: () => remote.app.exit()
            }
        ]
    }));

    normalMenu.append(new remote.MenuItem({
        label: 'View',
        submenu: [
            {
                label: 'Toggle Sidebar',
                accelerator: 'CmdOrCtrl+D',
                click: () => toggleSidebar(null)
            },
            {
                label: 'Reset Sidebar Width',
                click: () => resizeSidebar(275)
            },
            {
                type: 'separator'
            },
            {
                label: 'Toggle Developer Tools',
                accelerator: 'CmdOrCtrl+Shift+I',
                click: () => remote.getCurrentWebContents().toggleDevTools()
            }
        ]
    }));

    normalMenu.append(new remote.MenuItem({
        label: 'Help',
        submenu: [
            {
                label: 'Help',
                accelerator: 'F1',
                click: () => autoOpenHelpTab()
            },
            {
                label: 'Website',
                click: () => shell.openExternal('https://www.codexnotes.com/')
            },
            {
                label: 'Update notes',
                click: () => shell.openExternal('https://www.codexnotes.com/updates/')
            },
            {
                label: 'Give Feedback (Google Forms)',
                click: () => shell.openExternal('https://forms.gle/uDLJpqLbNLcEx1F8A')
            },
            {
                type: 'separator'
            },
            {
                label: 'About',
                click: () => openAboutPage()
            }
        ]
    }));


    editingMenu = new remote.Menu();
    editingMenu.append(new remote.MenuItem({
        label: 'File',
        submenu: [
            {
                label: 'New Notebook',
                accelerator: 'CmdOrCtrl+N',
                click: () => $('#newNotebookModal').modal('show')
            },
            {
                label: 'Save Page',
                accelerator: 'CmdOrCtrl+S',
                click: () => saveSelectedPage(true)
            },
            {
                type: 'separator'
            },
            {
                label: 'Export page to PDF...',
                accelerator: 'CmdOrCtrl+P',
                click: () => printCurrentPage()
            },
            {
                label: 'Export page to Markdown...',
                click: () => exportCurrentPageToMarkdown()
            },
            {
                type: 'separator'
            },
            {
                label: 'Exit',
                click: () => remote.app.exit()
            }
        ]
    }));

    editingMenu.append(new remote.MenuItem({
        label: 'Edit',
        submenu: [
            {
                label: 'Cut',
                accelerator: 'CmdOrCtrl+X',
                click: () => document.execCommand("cut")
            },
            {
                label: 'Copy',
                accelerator: 'CmdOrCtrl+C',
                click: () => document.execCommand("copy")
            },
            {
                label: 'Paste',
                accelerator: 'CmdOrCtrl+V',
                click: () => document.execCommand("paste")
            }
        ]
    }));

    editingMenu.append(new remote.MenuItem({
        label: 'View',
        submenu: [
            {
                label: 'Zoom In',
                accelerator: 'CmdOrCtrl+=',
                click: () => zoomIn()
            },
            {
                label: 'Zoom Out',
                accelerator: 'CmdOrCtrl+-',
                click: () => zoomOut()
            },
            {
                label: 'Restore Default Zoom',
                accelerator: 'CmdOrCtrl+R',
                click: () => defaultZoom()
            },
            {
                type: 'separator'
            },
            {
                label: 'Toggle Sidebar',
                accelerator: 'CmdOrCtrl+D',
                click: () => toggleSidebar(null)
            },
            {
                label: 'Reset Sidebar Width',
                click: () => resizeSidebar(275)
            },
            {
                label: 'Toggle Editor Toolbar',
                accelerator: 'CmdOrCtrl+T',
                click: () => toggleEditorRibbon()
            },
            {
                type: 'separator'
            },
            {
                label: 'Toggle Developer Tools',
                accelerator: 'CmdOrCtrl+Shift+I',
                click: () => remote.getCurrentWebContents().toggleDevTools()
            }
        ]
    }));

    editingMenu.append(new remote.MenuItem({
        label: 'Help',
        submenu: [
            {
                label: 'Help',
                accelerator: 'F1',
                click: () => autoOpenHelpTab()
            },
            {
                label: 'Website',
                click: () => shell.openExternal('https://www.codexnotes.com/')
            },
            {
                label: 'Update notes',
                click: () => shell.openExternal('https://www.codexnotes.com/updates/')
            },
            {
                label: 'Give Feedback (Google Forms)',
                click: () => shell.openExternal('https://forms.gle/uDLJpqLbNLcEx1F8A')
            },
            {
                type: 'separator'
            },
            {
                label: 'About',
                click: () => openAboutPage()
            }
        ]
    }));


    if (remote.process.platform === 'linux') {
        normalMenu.items[1].submenu.append(new remote.MenuItem({
            label: 'Toggle Menu Bar',
            click: () => {
                let current = remote.getCurrentWindow().isMenuBarVisible();
                remote.getCurrentWindow().setMenuBarVisibility(!current);
                prefs.showMenuBar = !current;
            },
            accelerator: "Ctrl+M"
        }))
        editingMenu.items[2].submenu.append(new remote.MenuItem({
            label: 'Toggle Menu Bar',
            click: () => {
                let current = remote.getCurrentWindow().isMenuBarVisible();
                remote.getCurrentWindow().setMenuBarVisibility(!current);
                prefs.showMenuBar = !current;
            },
            accelerator: "Ctrl+M"
        }))
    }

    remote.Menu.setApplicationMenu(normalMenu);
    if (remote.process.platform === 'win32') {
        titlebar.updateMenu(normalMenu);
    }


    document.getElementById('exampleCode').innerHTML = "//EXAMPLE CODE BLOCK\n#include &lt;iostream&gt;\n\nint main(int argc, char *argv[]) {\n\tfor (auto i = 0; i &lt; 0xFFFF; i++)\n\t\tcout &lt;&lt; \"Hello, World!\" &lt;&lt; endl;\n\treturn -2e3 + 12l;\n}";

    //HIGHLIGHT THE EXAMPLE CODE IN THE SETTINGS PAGE
    let hljs = require("highlight.js/lib/core");  // require only the core library
    // separately require languages
    hljs.registerLanguage('cpp', require('highlight.js/lib/languages/cpp'));

    document.getElementById('exampleCode').innerHTML = hljs.highlight('cpp', document.getElementById('exampleCode').innerText).value;

    hljs = null;


    //get user preferences
    if (fs.existsSync(defaultDataDir + "/prefs.json")) {
        let worked = false;
        try {
            let json = fs.readFileSync(defaultDataDir + "/prefs.json", 'utf8');
            prefs = JSON.parse(json);
            worked = true;
        }
        catch (err) {
            alert('Your preferences file could not be parsed correctly.', 'Please make sure your prefs.json JSON file is intact');
        }

        if (worked === true) {
            fixPrefs();
            applyPrefsFromFile();
            canSavePrefs = true;
        }
    }
    else {
        prefs = new UserPrefs();
        canSavePrefs = true;
        savePrefs();
        applyPrefsFromFile();
    }

    //get notebooks save file
    if (fs.existsSync(prefs.dataDir + "/save.json")) {
        try {
            let json = fs.readFileSync(prefs.dataDir + "/save.json", 'utf8');
            save = JSON.parse(json);

            // Add missing icon property
            for (let i = 0; i < save.notebooks.length; i++) {
                if (typeof save.notebooks[i].icon === 'undefined') {
                    save.notebooks[i].icon = "book";
                }
            }

            canSaveData = true;
        }
        catch (err) {
            canSaveData = false;
            alert('Your save file could not be parsed correctly.', 'Please make sure your save.json JSON file is intact');
        }
    }
    else {
        save = new Save();
        save.notebooks = [];
        save.nextPageIndex = 0;
        canSaveData = true;
        saveData();
    }

    if (fs.existsSync(prefs.dataDir + "/notes/") == false) {
        fs.mkdirSync(prefs.dataDir + "/notes/");
    }

    addSidebarLinkEvents();

    /*if (remote.process.platform === 'win32') {
        document.getElementById('mainContainer').style.height = `${document.body.clientHeight - 30}px`;
    }
    else {
        document.getElementById('mainContainer').style.height = `${document.body.clientHeight}px`;
    }*/

    if (remote.process.platform !== 'win32') {
        document.documentElement.style.setProperty("--titlebar-height", "0px");
    }


    window.addEventListener('resize', () => {

        document.getElementById('notebook-context-menu').style.display = "none";
        document.getElementById('page-context-menu').style.display = "none";

        /*if (remote.process.platform === 'win32') {
            document.getElementById('mainContainer').style.height = `${document.body.clientHeight - 30}px`;
        }
        else {
            document.getElementById('mainContainer').style.height = `${document.body.clientHeight}px`;
        }*/

        // Sidebar behavior
        if (document.body.clientWidth <= (sidebarWidth + 810)) {
            document.getElementById('mainContainer').style.marginLeft = "0px";
            document.getElementById('editorRibbon').style.left = "0px";
            toggleSidebar(false);
            //document.getElementById('sidebarMenu').classList.add("shadow-lg");
        }
        else {
            document.getElementById('mainContainer').style.marginLeft = 'var(--sidebar-width)';
            document.getElementById('editorRibbon').style.left = 'var(--sidebar-width)';
            toggleSidebar(true);
            //document.getElementById('sidebarMenu').classList.remove("shadow-lg");
        }

    });

    applyModalEventHandlers();

    displayNotebooks();

    // open the notebooks which were open before
    for (let i = 0; i < prefs.openedNotebooks.length; i++) {
        try {
            let nbList = document.getElementById(`nb-${prefs.openedNotebooks[i]}-list`);
            nbList.classList.add('show');
            document.getElementById(`nb-${prefs.openedNotebooks[i]}`).setAttribute('aria-expanded', "true");
        }
        catch (error) {
            console.error(error);
        }
    }

    feather.replace();



    // TOOLTIPS

    document.getElementById('revertToDefaultDataDirBtnTooltip').title = "Revert to" + defaultDataDir;
    $('#revertToDefaultDataDirBtnTooltip').tooltip({
        trigger: 'hover'
    });
    $('#dataDirButton').tooltip({
        trigger: 'hover'
    });

    $('#newNotebookBtn').tooltip({
        boundary: 'window',
        container: 'body',
        placement: 'right',
        trigger: 'hover'
    });

    $('#newNotebookColorPicker').tooltip({
        trigger: 'hover',
        placement: 'bottom'
    });

    $('#accentColorPicker').tooltip({
        trigger: 'hover',
        placement: 'bottom'
    });

    $('#editNotebookColorPicker').tooltip({
        trigger: 'hover',
        placement: 'bottom'
    });

    $('#newNotebookIconHelp').tooltip({
        trigger: 'hover',
        placement: 'right'
    });

    $('#editNotebookIconHelp').tooltip({
        trigger: 'hover',
        placement: 'right'
    });

    // TOOLTIPS


    document.execCommand("enableObjectResizing", false, false)
    document.execCommand("enableInlineTableEditing", false, false)


    // first time use popup
    if (prefs.firstUse == true) {
        //probably first use
        setTimeout(() => { $("#firstUseModal").modal('show') }, 500);
    }


    // Sidebar resizer events
    const sidebarResizer = document.getElementById('sidebarResizer');
    sidebarResizer.addEventListener('mousedown', (e) => {
        window.addEventListener('mousemove', handleSidebarResizerDrag, false);
        window.addEventListener('mouseup', () => {
            window.removeEventListener('mousemove', handleSidebarResizerDrag, false);
        }, false);
    });

    // Set up Icon Selectors for notebook modals
    let newNotebookIconSelect = document.getElementById('newNotebookIconSelect');

    Object.keys(feather.icons).forEach(element => {
        let op = document.createElement('option');
        op.text = element;
        op.value = element;
        newNotebookIconSelect.appendChild(op);
    });

    newNotebookIconSelect.value = "book";

    newNotebookIconSelect.addEventListener('change', () => {
        document.getElementById('newNotebookIconPreview').setAttribute('data-feather', document.getElementById('newNotebookIconSelect').value);
        feather.replace();
    });

    document.getElementById('newNotebookColorPicker').addEventListener('change', () => {
        document.getElementById('newNotebookIconPreview').style.color = document.getElementById('newNotebookColorPicker').value;
    });

    let editNotebookIconSelect = document.getElementById('editNotebookIconSelect');

    Object.keys(feather.icons).forEach(element => {
        let op = document.createElement('option');
        op.text = element;
        op.value = element;
        editNotebookIconSelect.appendChild(op);
    });

    editNotebookIconSelect.addEventListener('change', () => {
        document.getElementById('editNotebookIconPreview').setAttribute('data-feather', document.getElementById('editNotebookIconSelect').value);
        feather.replace();
    });

    document.getElementById('editNotebookColorPicker').addEventListener('change', () => {
        document.getElementById('editNotebookIconPreview').style.color = document.getElementById('editNotebookColorPicker').value;
    });

}

init();

function handleSidebarResizerDrag(event) {
    resizeSidebar(event.clientX);
}

/**
 * Saves the 'save' file which contains the notebooks and stuff.
 */
function saveData() {
    if (canSaveData) {
        try {
            fs.writeFileSync(prefs.dataDir + "/save.json", JSON.stringify(save, null, 2), 'utf8');
            saveSelectedPage();
        }
        catch (err) {
            alert(err.toString());
        }
    }
}

/**
 * Saves the content of the 'selected page' to that page's individual TXT file.
 */
function saveSelectedPage(showIndicator = false) {
    if (selectedPage != null && canSaveData) {

        try {
            let cont = JSON.stringify(window.view.state.doc.toJSON());

            fs.writeFileSync(prefs.dataDir + "/notes/" + selectedPage.fileName, cont, 'utf8');

            let title = selectedPage.title;
            if (title.length > 40) {
                title = title.substring(0, 40) + "...";
            }

            if (showIndicator) {
                clearTimeout(fadeInSaveIndicator);

                document.getElementById('saveIndicatorTitle').textContent = `"${title}" saved!`
                document.getElementById('saveIndicator').style.opacity = 1;

                fadeInSaveIndicator = setTimeout(() => {
                    document.getElementById('saveIndicator').style.opacity = 0;
                }, 3000);
            }
        }
        catch (err) {
            alert(err.toString());
        }
    }
}

function fixPrefs() {
    if (typeof prefs.theme === "undefined")
        prefs.theme = "0";
    if (typeof prefs.codeStyle === "undefined")
        prefs.codeStyle = "atom-one-dark";
    if (typeof prefs.accentColor === "undefined")
        prefs.accentColor = "#FF7A27";
    if (typeof prefs.defaultZoom === "undefined")
        prefs.defaultZoom = 1.0;
    if (typeof prefs.defaultMaximized === "undefined")
        prefs.defaultMaximized = false;
    if (typeof prefs.dataDir === "undefined")
        prefs.dataDir = defaultDataDir;
    if (typeof prefs.pdfBreakOnH1 === "undefined")
        prefs.pdfBreakOnH1 = false;
    if (typeof prefs.pdfDarkMode === "undefined")
        prefs.pdfDarkMode = false;
    if (typeof prefs.openPDFonExport === "undefined")
        prefs.openPDFonExport = true;
    if (typeof prefs.openedNotebooks === "undefined")
        prefs.openedNotebooks = [];
    if (typeof prefs.tabSize === "undefined")
        prefs.tabSize = 4;
    if (typeof prefs.sidebarWidth === "undefined") {
        prefs.sidebarWidth = 275;
    }
    if (typeof prefs.showCodeOverlay === "undefined") {
        prefs.showCodeOverlay = true;
    }
    if (typeof prefs.codeWordWrap === "undefined") {
        prefs.codeWordWrap = false;
    }
    if (typeof prefs.firstUse === "undefined") {
        prefs.firstUse = true;
    }
    if (typeof prefs.showMenuBar === "undefined") {
        prefs.showMenuBar = true;
    }
}

/**
 * Save's the user prefs to the prefs JSON file.
 */
function savePrefs() {
    if (canSavePrefs) {
        prefs.defaultMaximized = remote.getCurrentWindow().isMaximized();

        if (destroyOpenedNotebooks) {
            prefs.openedNotebooks = [];
        }

        try {
            fs.writeFileSync(defaultDataDir + "/prefs.json", JSON.stringify(prefs, null, 2), 'utf8');
        }
        catch (err) {
            alert(err.toString());
        }
    }
}

/**
 * This function is run at the start and applies all prefs found in the prefs JSON file.
 */
function applyPrefsFromFile() {
    document.getElementById('themeSelect').value = prefs.theme;
    let header = document.getElementsByTagName('head')[0];
    if (prefs.theme == 1) {
        darkStyleLink = document.createElement('link');
        darkStyleLink.rel = 'stylesheet';
        darkStyleLink.type = 'text/css';
        darkStyleLink.href = 'css/dark.css';
        darkStyleLink.media = 'all';
        header.appendChild(darkStyleLink);
        remote.nativeTheme.themeSource = "dark";
    }
    else if (prefs.theme == 0) {
        remote.nativeTheme.themeSource = "light";
        if (darkStyleLink != null) {
            header.removeChild(darkStyleLink);
            darkStyleLink = null;
        }
    }
    else if (prefs.theme == 2) {
        remote.nativeTheme.themeSource = "system";
        if (remote.nativeTheme.shouldUseDarkColors) {
            darkStyleLink = document.createElement('link');
            darkStyleLink.rel = 'stylesheet';
            darkStyleLink.type = 'text/css';
            darkStyleLink.href = 'css/dark.css';
            darkStyleLink.media = 'all';
            header.appendChild(darkStyleLink);
        }
    }
    else {
        prefs.theme = 0;
        remote.nativeTheme.themeSource = "light";
    }

    document.getElementById('codeStyleSelect').value = prefs.codeStyle;
    //document.getElementById('codeStyleLink').href = `hljs_styles/${prefs.codeStyle}.css`;
    document.getElementById('codeStyleLink').href = `./node_modules/highlight.js/styles/${prefs.codeStyle}.css`;

    if (lightThemes.includes(prefs.codeStyle)) {
        document.documentElement.style.setProperty('--code-overlay-bg-brightness', '0.95');
        document.documentElement.style.setProperty('--code-scrollbar-color', '0');
        document.documentElement.style.setProperty('--code-scrollbar-opacity', '0.07');
    }
    else {
        document.documentElement.style.setProperty('--code-overlay-bg-brightness', '1.25');
        document.documentElement.style.setProperty('--code-scrollbar-color', '255');
        document.documentElement.style.setProperty('--code-scrollbar-opacity', '0.3');
    }

    document.getElementById('accentColorPicker').value = prefs.accentColor;
    document.documentElement.style.setProperty('--accent-color', prefs.accentColor);

    document.getElementById('tabSizeSelect').value = prefs.tabSize;

    if (prefs.defaultMaximized) {
        remote.getCurrentWindow().maximize();
    }

    zoomLevel = prefs.defaultZoom;
    updateZoom();

    $('#exportBreakPageOnH1Check').prop("checked", prefs.pdfBreakOnH1);
    $('#darkmodePDFCheck').prop("checked", prefs.pdfDarkMode);
    $('#openPDFonExportCheck').prop("checked", prefs.openPDFonExport);

    if (fs.existsSync(prefs.dataDir)) {
        document.getElementById('dataDirInput').innerText = prefs.dataDir;

        if (prefs.dataDir == defaultDataDir) {
            document.getElementById('revertToDefaultDataDirBtn').disabled = true;
            document.getElementById('revertToDefaultDataDirBtn').style.pointerEvents = "none";
            document.getElementById('revertToDefaultDataDirBtnTooltip').title = "You're already in the default location.";
            $('#revertToDefaultDataDirBtnTooltip').tooltip('dispose');
            $('#revertToDefaultDataDirBtnTooltip').tooltip();
        }
        else {
            document.getElementById('revertToDefaultDataDirBtn').disabled = false;
            document.getElementById('revertToDefaultDataDirBtn').style.pointerEvents = "auto";
            document.getElementById('revertToDefaultDataDirBtnTooltip').title = "Revert to " + defaultDataDir;
            $('#revertToDefaultDataDirBtnTooltip').tooltip('dispose');
            $('#revertToDefaultDataDirBtnTooltip').tooltip();
        }
    }
    else {
        alert("Your Save location (" + prefs.dataDir + ") could not be accessed. Reverting to the default (" + defaultDataDir + ")");
        prefs.dataDir = defaultDataDir;
        document.getElementById('dataDirInput').innerText = prefs.dataDir;
    }

    resizeSidebar(prefs.sidebarWidth);

    $('#showLanguageOverlayCheck').prop("checked", prefs.showCodeOverlay);
    if (prefs.showCodeOverlay === true) {
        document.getElementById('codeOverlayLink').href = "css/codeoverlay.css";
    }

    $('#codeWordWrapCheck').prop("checked", prefs.codeWordWrap);
    if (prefs.codeWordWrap === true) {
        document.documentElement.style.setProperty('--code-white-space', 'pre-wrap');
    }
    else {
        document.documentElement.style.setProperty('--code-white-space', 'pre');
    }

    remote.getCurrentWindow().setMenuBarVisibility(prefs.showMenuBar);
}

/**
 * Called during runtime to apply any prefs changes the user has made, and saves to the JSON file.
 */
function applyPrefsRuntime(needsRestart = false) {

    prefs.codeStyle = document.getElementById('codeStyleSelect').value;
    //document.getElementById('codeStyleLink').href = `hljs_styles/${prefs.codeStyle}.css`;
    document.getElementById('codeStyleLink').href = `./node_modules/highlight.js/styles/${prefs.codeStyle}.css`;

    if (lightThemes.includes(prefs.codeStyle)) {
        document.documentElement.style.setProperty('--code-overlay-bg-brightness', '0.95');
        document.documentElement.style.setProperty('--code-scrollbar-color', '0');
        document.documentElement.style.setProperty('--code-scrollbar-opacity', '0.07');
    }
    else {
        document.documentElement.style.setProperty('--code-overlay-bg-brightness', '1.25');
        document.documentElement.style.setProperty('--code-scrollbar-color', '255');
        document.documentElement.style.setProperty('--code-scrollbar-opacity', '0.3');
    }

    prefs.theme = document.getElementById('themeSelect').value;
    let header = document.getElementsByTagName('head')[0];
    if (prefs.theme == 1) {
        if (darkStyleLink == null) {
            darkStyleLink = document.createElement('link');
            darkStyleLink.rel = 'stylesheet';
            darkStyleLink.type = 'text/css';
            darkStyleLink.href = 'css/dark.css';
            darkStyleLink.media = 'all';
            header.appendChild(darkStyleLink);
            remote.nativeTheme.themeSource = "dark";
        }
    }
    else if (prefs.theme == 0) {
        remote.nativeTheme.themeSource = "light";
        if (darkStyleLink != null) {
            header.removeChild(darkStyleLink);
            darkStyleLink = null;
        }
    }
    else if (prefs.theme == 2) {
        remote.nativeTheme.themeSource = "system";
        if (remote.nativeTheme.shouldUseDarkColors) {
            darkStyleLink = document.createElement('link');
            darkStyleLink.rel = 'stylesheet';
            darkStyleLink.type = 'text/css';
            darkStyleLink.href = 'css/dark.css';
            darkStyleLink.media = 'all';
            header.appendChild(darkStyleLink);
        }
        else {
            if (darkStyleLink != null) {
                header.removeChild(darkStyleLink);
                darkStyleLink = null;
            }
        }
    }
    else {
        prefs.theme = 0;
    }

    prefs.accentColor = document.getElementById('accentColorPicker').value;
    document.documentElement.style.setProperty('--accent-color', prefs.accentColor);

    prefs.tabSize = parseInt(document.getElementById('tabSizeSelect').value);

    prefs.pdfBreakOnH1 = $('#exportBreakPageOnH1Check').is(':checked');
    prefs.pdfDarkMode = $('#darkmodePDFCheck').is(':checked');
    prefs.openPDFonExport = $('#openPDFonExportCheck').is(':checked');

    //check to make sure this path is valid
    prefs.dataDir = document.getElementById('dataDirInput').innerText;

    if (fs.existsSync(prefs.dataDir)) {
        document.getElementById('dataDirInput').innerText = prefs.dataDir;

        if (prefs.dataDir == defaultDataDir) {
            document.getElementById('revertToDefaultDataDirBtn').disabled = true;
            document.getElementById('revertToDefaultDataDirBtn').style.pointerEvents = "none";
            document.getElementById('revertToDefaultDataDirBtnTooltip').title = "You're already in the default location.";
            $('#revertToDefaultDataDirBtnTooltip').tooltip('dispose');
            $('#revertToDefaultDataDirBtnTooltip').tooltip();
        }
        else {
            document.getElementById('revertToDefaultDataDirBtn').disabled = false;
            document.getElementById('revertToDefaultDataDirBtn').style.pointerEvents = "auto";
            document.getElementById('revertToDefaultDataDirBtnTooltip').title = "Revert to " + defaultDataDir;
            $('#revertToDefaultDataDirBtnTooltip').tooltip('dispose');
            $('#revertToDefaultDataDirBtnTooltip').tooltip();
        }
    }
    else {
        prefs.dataDir = defaultDataDir;
        document.getElementById('dataDirInput').innerText = prefs.dataDir;
        alert("The specified save directory could not be accessed. Reverting to default.");
    }

    savePrefs();

    if (needsRestart) {
        remote.app.relaunch();
        remote.app.exit();
    }

    prefs.sidebarWidth = sidebarWidth;

    prefs.showCodeOverlay = $('#showLanguageOverlayCheck').is(':checked');
    if (prefs.showCodeOverlay === true) {
        document.getElementById('codeOverlayLink').href = "css/codeoverlay.css";
    }
    else {
        document.getElementById('codeOverlayLink').href = "";
    }

    prefs.codeWordWrap = $('#codeWordWrapCheck').is(':checked');
    if (prefs.codeWordWrap === true) {
        document.documentElement.style.setProperty('--code-white-space', 'pre-wrap');
    }
    else {
        document.documentElement.style.setProperty('--code-white-space', 'pre');
    }
}

/**
 * Adds events to the modals for when the user submits the respective HTML form such as creating or editing a notebook.
 */
function applyModalEventHandlers() {

    /* NEW NOTEBOOK MODAL */
    document.getElementById('newNotebookForm').addEventListener('submit', (e) => {
        e.preventDefault();
        let name = document.getElementById('newNotebookNameInput').value;
        let color = document.getElementById('newNotebookColorPicker').value;
        let icon = document.getElementById('newNotebookIconSelect').value;
        if (name !== "") {

            getExpandedNotebookData();

            let nb = new Notebook(name, color);
            nb.icon = icon;
            let index = save.notebooks.length;
            save.notebooks.push(nb);

            //addNotebookToList(index);
            $('#newNotebookModal').modal('hide');
            //showHomePage();
            //displayNotebooks();
            saveData();
            displayNotebooks();
            document.getElementById('newNotebookNameInput').classList.remove("is-invalid");
            document.getElementById('newNotebookNameInput').value = "";
            document.getElementById('newNotebookColorPicker').value = "000000";
            document.getElementById('newNotebookIconSelect').value = "book";
            document.getElementById('newNotebookIconPreview').setAttribute('data-feather', 'book');
            feather.replace();
            document.getElementById('newNotebookIconPreview').style.color = "black";
        }
        else {
            document.getElementById('newNotebookNameInput').classList.add("is-invalid");
        }
    });

    $('#newNotebookModal').on('shown.bs.modal', (e) => {
        document.getElementById('newNotebookNameInput').focus();
    });

    $('#newNotebookModal').on('hidden.bs.modal', (e) => {
        document.getElementById('newNotebookNameInput').classList.remove('is-invalid');
    });


    /* EDIT NOTEBOOK MODAL */
    document.getElementById('editNotebookForm').addEventListener('submit', (e) => {
        e.preventDefault();
        let newName = document.getElementById('editNotebookNameInput').value;
        let newColor = document.getElementById('editNotebookColorPicker').value;
        let newIcon = document.getElementById('editNotebookIconSelect').value;

        if (newName !== "") {
            $('#editNotebookModal').modal('hide');

            getExpandedNotebookData();

            save.notebooks[rightClickedNotebookIndex].name = newName;
            save.notebooks[rightClickedNotebookIndex].color = newColor;
            save.notebooks[rightClickedNotebookIndex].icon = newIcon;
            saveData();

            displayNotebooks();

            //displayNotebooks();
            //document.getElementById(`nb-${rightClickedNotebookIndex}-icon`).style.color = newColor;

            //document.getElementById(`nb-${rightClickedNotebookIndex}`).children[0].style.color = newColor;
            //document.getElementById(`nb-${rightClickedNotebookIndex}`).children[1].innerText = ` ${newName} `;
            //document.getElementById(`nb-${rightClickedNotebookIndex}`).children[1].title = `${newName}`;

            //document.getElementById(`nb-${rightClickedNotebookIndex}-name`).innerText = ` ${newName} `;
        }
        else {
            document.getElementById('editNotebookNameInput').classList.add("is-invalid");
        }
    });

    $('#editNotebookModal').on('shown.bs.modal', (e) => {
        document.getElementById('editNotebookNameInput').focus();
        //document.getElementById('editNotebookNameInput').select();
    });

    $('#editNotebookModal').on('hidden.bs.modal', (e) => {
        document.getElementById('editNotebookNameInput').classList.remove('is-invalid');
    });


    /* NEW PAGE MODAL */
    document.getElementById('newPageForm').addEventListener('submit', (e) => {
        e.preventDefault();
        let name = document.getElementById('newPageNameInput').value;

        if (name !== "") {
            $('#newPageModal').modal('hide');

            getExpandedNotebookData();

            let p = new Page(name);
            p.fileName = save.nextPageIndex.toString() + ".json";
            save.nextPageIndex++;

            let index = save.notebooks[rightClickedNotebookIndex].pages.length;
            save.notebooks[rightClickedNotebookIndex].pages.push(p);

            fs.writeFileSync(prefs.dataDir + "/notes/" + p.fileName, '{"type":"doc","content":[{"type":"paragraph"}]}', 'utf8');
            //showHomePage();
            //displayNotebooks();
            saveData();

            displayNotebooks();
            //addPageToAList(rightClickedNotebookIndex, index);

            document.getElementById('newPageNameInput').value = "";
        }
        else {
            document.getElementById('newPageNameInput').classList.add("is-invalid");
        }
    });

    $('#newPageModal').on('shown.bs.modal', (e) => {
        document.getElementById('newPageNameInput').focus();
    });

    $('#newPageModal').on('hidden.bs.modal', (e) => {
        document.getElementById('newPageNameInput').classList.remove('is-invalid');
    });


    /* EDIT PAGE MODAL */
    document.getElementById('editPageForm').addEventListener('submit', (e) => {
        e.preventDefault();
        let newName = document.getElementById('editPageNameInput').value;

        if (newName !== "") {
            $('#editPageModal').modal('hide');

            getExpandedNotebookData();

            save.notebooks[rightClickedNotebookIndex].pages[rightClickedPageIndex].title = newName;
            saveData();
            displayNotebooks();

            //displayNotebooks();
            //document.getElementById(`page-ref-${rightClickedPageIndex}-name`).innerText = ` ${newName} `;

            //document.querySelector(`[notebook-index='${rightClickedNotebookIndex}'][page-index='${rightClickedPageIndex}']`).children[1].innerText = ` ${newName} `;
            //document.querySelector(`[notebook-index='${rightClickedNotebookIndex}'][page-index='${rightClickedPageIndex}']`).children[1].title = `${newName}`;
        }
        else {
            document.getElementById('editPageNameInput').classList.add("is-invalid");
        }
    });

    $('#editPageModal').on('shown.bs.modal', (e) => {
        document.getElementById('editPageNameInput').focus();
        //document.getElementById('editPageNameInput').select();
    });

    $('#editPageModal').on('hidden.bs.modal', (e) => {
        document.getElementById('editPageNameInput').classList.remove('is-invalid');
    });
}

/**
 * Clears sidebar, and loads all notebooks/pages into the sidebar using the instance of Save.
 */
function displayNotebooks() {

    //clear the list
    document.getElementById("notebookList").innerHTML = '';
    favoritePages = [];

    for (let i = 0; i < save.notebooks.length; i++) {

        addNotebookToList(i);

        if (expandedNotebooks.includes(save.notebooks[i])) {
            document.getElementById(`nb-${i}-list`).classList.add('show');
            document.getElementById(`nb-${i}`).setAttribute('aria-expanded', "true");
        }

        //populate the notebook with its pages
        for (let e = 0; e < save.notebooks[i].pages.length; e++) {

            addPageToAList(i, e);

            if (save.notebooks[i].pages[e] == activePage) {
                let pageA = document.querySelector(`a[notebook-index="${i}"][page-index="${e}"]`);
                pageA.classList.add('active');
            }

            if (save.notebooks[i].pages[e].favorite) {
                favoritePages.push(save.notebooks[i].pages[e]);
            }

        }
    }

    updateFavoritesSection();
}

/**
 * Call this BEFORE making any changes to the save structure (moving notebooks up/down or sorting them) and then call displayNotebooks()
 */
function getExpandedNotebookData() {
    expandedNotebooks = [];
    activePage = null;
    for (let i = 0; i < save.notebooks.length; i++) {

        let nbList = document.getElementById(`nb-${i}-list`);
        if (nbList.classList.contains('show')) {
            expandedNotebooks.push(save.notebooks[i]);
        }

        //populate the notebook with its pages
        for (let e = 0; e < save.notebooks[i].pages.length; e++) {

            let pageA = document.querySelector(`a[notebook-index="${i}"][page-index="${e}"]`);
            if (pageA.classList.contains('active')) {
                activePage = save.notebooks[i].pages[e];
            }
        }
    }
}

function addNotebookToList(index) {
    let notebook = save.notebooks[index];

    let el = document.createElement("li");
    el.classList.add("nav-item");
    el.classList.add("my-sidebar-item");
    el.draggable = true;
    el.style.transition = "box-shadow 0.2s ease";

    let a = document.createElement("a");
    a.id = `nb-${index}`;
    a.title = notebook.name;
    a.setAttribute('notebook-index', index);
    a.classList.add('nav-link', /*'dropdown-toggle', */'notebook', 'unselectable');
    a.href = `#nb-${index}-list`;
    a.setAttribute('data-toggle', 'collapse');
    a.setAttribute('aria-expanded', 'false');
    /*a.innerHTML = `
  <span data-feather="book" style="color: ${notebook.color}"></span><span class="notebook-title"> ${notebook.name} </span><span class="caret"></span>
  `;*/

    a.innerHTML = `
        <div class="row">
            <div class="col-auto pr-0">
                <span data-feather="${validator.escape(notebook.icon)}" style="color: ${notebook.color}"></span>
            </div>
            <div class="col pr-1" style="padding-left: 5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${validator.escape(notebook.name)}</div>
            <div class="col-auto" style="padding-right: 20px">
                <span class="caret"></span>
            </div>
        </div>
    `;
    el.appendChild(a);

    let ul = document.createElement("ul");
    ul.classList.add('nav', 'collapse');
    ul.id = `nb-${index}-list`;
    el.appendChild(ul);

    if (notebook.pages.length == 0) {
        let emptyIndicator = document.createElement("li");
        emptyIndicator.classList.add('nav-item', 'emptyIndicator');
        emptyIndicator.innerHTML = '<i class="nav-link indent font-weight-light unselectable">Nothing here yet...</i>';
        ul.appendChild(emptyIndicator);
    }

    document.getElementById("notebookList").appendChild(el);
    feather.replace();

    //Add necessary event listeners
    a.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        document.getElementById('page-context-menu').style.display = "none";
        let cm = document.getElementById('notebook-context-menu');
        cm.style.display = "block";
        cm.style.left = `${e.clientX}px`;

        // Put the menu above the cursor if it's going to go off screen
        if (window.innerHeight - e.clientY < cm.clientHeight) {
            cm.style.top = `${e.clientY - cm.clientHeight}px`;
        }
        else {
            cm.style.top = `${e.clientY}px`;
        }
        rightClickedNotebookIndex = parseInt(this.getAttribute("notebook-index"));
    });



    //DRAG SORTING
    el.addEventListener('dragstart', function (e) {
        draggedNotebookIndex = parseInt(this.children[0].getAttribute('notebook-index'));
        draggingNotebook = true;
        e.dataTransfer.dropEffect = "move";
        let img = new Image();
        e.dataTransfer.setDragImage(img, 0, 0);
    });
    el.addEventListener('dragover', function (e) {
        e.preventDefault();

        if (draggingNotebook) {

            let otherIndex = draggedNotebookIndex;
            let thisIndex = parseInt(this.children[0].getAttribute('notebook-index'));

            if (otherIndex != thisIndex) {
                e.dataTransfer.dropEffect = "move";
                let relativeY = e.clientY - this.getBoundingClientRect().top;
                if (relativeY > 18) {
                    //PLACE THE OTHER NOTEBOOK BELOW THIS ONE
                    this.style.boxShadow = "0px -2px 0px orange inset";
                }
                else if (relativeY <= 18) {
                    //PLACE THE OTHER NOTEBOOK ABOVE THIS ONE
                    this.style.boxShadow = "0px 2px 0px orange inset";
                }
            }
            else {
                e.dataTransfer.dropEffect = "none";
                return false;
            }
        }
        else if (draggingPage) {
            this.style.boxShadow = "0px -2px 0px pink inset";
        }
        else {
            e.dataTransfer.dropEffect = "none";
            return false;
        }

    });
    el.addEventListener('dragleave', function (e) {
        this.style.boxShadow = "none";
    });
    el.addEventListener('drop', function (e) {
        e.preventDefault();
        //this is called on the element that is being dropped on
        this.style.boxShadow = "none";

        if (draggingNotebook) {
            let myIndex = parseInt(this.children[0].getAttribute('notebook-index'));
            let draggedIndex = draggedNotebookIndex;

            if (myIndex != draggedIndex) {
                let relativeY = e.clientY - this.getBoundingClientRect().top;

                getExpandedNotebookData();
                if (relativeY > 18) {
                    //PLACE MY NOTEBOOK BELOW THE LANDED ONE

                    let nb = save.notebooks[draggedIndex];
                    let fillerNB = new Notebook("empty", "000000");
                    save.notebooks[draggedIndex] = fillerNB;
                    save.notebooks.splice(myIndex + 1, 0, nb);
                    save.notebooks.splice(save.notebooks.indexOf(fillerNB), 1);
                }
                else if (relativeY <= 18) {
                    //PLACE MY NOTEBOOK ABOVE THE LANDED ONE

                    let nb = save.notebooks[draggedIndex];
                    let fillerNB = new Notebook("empty", "000000");
                    save.notebooks[draggedIndex] = fillerNB;
                    save.notebooks.splice(myIndex, 0, nb);
                    save.notebooks.splice(save.notebooks.indexOf(fillerNB), 1);
                }

                saveData();
                displayNotebooks();
            }
        }
        else if (draggingPage) {
            let myNotebookIndex = parseInt(this.children[0].getAttribute('notebook-index'));

            if (myNotebookIndex != draggedPagesNotebookIndex) {
                getExpandedNotebookData();

                let pg = save.notebooks[draggedPagesNotebookIndex].pages[draggedPageIndex];
                save.notebooks[myNotebookIndex].pages.push(pg);
                save.notebooks[draggedPagesNotebookIndex].pages.splice(draggedPageIndex, 1);

                saveData();
                displayNotebooks();
            }
        }
    });
    el.addEventListener('dragend', function (e) {
        draggingNotebook = false;
    })
}

function addPageToAList(notebookIndex, index) {

    let page = save.notebooks[notebookIndex].pages[index];

    let el = document.createElement("li");
    el.classList.add('nav-item');
    el.classList.add('my-sidebar-item');
    el.draggable = true;
    el.style.transition = "box-shadow 0.2s ease";

    let a = document.createElement("a");
    a.id = `page-${index}`;
    a.title = `${page.title}`;
    a.href = "#";
    a.classList.add('nav-link', 'my-sidebar-link', /*'page',*/ 'indent', 'unselectable');
    /*a.innerHTML = `
  <span data-feather="file-text"></span><span class="page-title"> ${page.title} </span>
  `;*/

    if (page.favorite) {
        //a.innerHTML += '<span data-feather="star" style="width: 14px; height: 14px; color: orange"></span>'
        a.innerHTML = `
        <div class="row">
            <div class="col-auto pr-0">
                <span data-feather="file-text"></span>
            </div>
            <div class="col pr-1" style="padding-left: 5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${validator.escape(page.title)}</div>
            <div class="col-auto" style="padding-right: 13px">
                <span data-feather="star" style="width: 14px; height: 14px; color: orange; vertical-align: -2px"></span>
            </div>
        </div>
        `;
    }
    else {
        a.innerHTML = `
        <div class="row">
            <div class="col-auto pr-0">
                <span data-feather="file-text"></span>
            </div>
            <div class="col pr-4" style="padding-left: 5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${validator.escape(page.title)}</div>
        </div>
        `;
    }

    a.setAttribute('notebook-index', `${notebookIndex}`);
    a.setAttribute('page-index', `${index}`);
    el.appendChild(a);

    let nbList = document.getElementById(`nb-${notebookIndex}-list`);

    //Delete empty indicator if it's there
    nbList.querySelectorAll('.emptyIndicator').forEach((indicator) => {
        indicator.parentNode.removeChild(indicator);
    });

    nbList.appendChild(el);
    feather.replace();

    a.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        document.getElementById('notebook-context-menu').style.display = "none";
        let cm = document.getElementById('page-context-menu');
        cm.style.display = "block";
        cm.style.left = `${e.clientX}px`;

        // Put the menu above the cursor if it's going to go off screen
        if (window.innerHeight - e.clientY < cm.clientHeight) {
            cm.style.top = `${e.clientY - cm.clientHeight}px`;
        }
        else {
            cm.style.top = `${e.clientY}px`;
        }

        rightClickedNotebookIndex = parseInt(this.getAttribute("notebook-index"));
        rightClickedPageIndex = parseInt(this.getAttribute("page-index"));

        if (save.notebooks[rightClickedNotebookIndex].pages[rightClickedPageIndex].favorite) {
            document.getElementById('FavoritePageLink').innerText = "Unfavorite page";
        }
        else {
            document.getElementById('FavoritePageLink').innerText = "Favorite page";
        }
    });
    a.addEventListener('click', function () {
        showEditorPage();
        loadPage(parseInt(this.getAttribute("notebook-index")), parseInt(this.getAttribute("page-index")));

        //change selected sidebar item

        document.querySelectorAll('.my-sidebar-link').forEach((item) => {
            item.classList.toggle('active', false);
        });

        this.classList.toggle('active', true);

    });

    el.addEventListener('dragstart', function (e) {
        e.stopPropagation();
        draggedPagesNotebookIndex = parseInt(this.children[0].getAttribute('notebook-index'));
        draggedPageIndex = parseInt(this.children[0].getAttribute('page-index'));
        draggingPage = true;
        let img = new Image();
        e.dataTransfer.setDragImage(img, 0, 0);
        e.dataTransfer.dropEffect = "move";
    });
    el.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (draggingPage) {

            let otherPageIndex = draggedPageIndex;
            let thisPageIndex = parseInt(this.children[0].getAttribute('page-index'));
            let otherNotebookIndex = draggedPagesNotebookIndex;
            let thisNotebookIndex = parseInt(this.children[0].getAttribute('notebook-index'));

            if (save.notebooks[thisNotebookIndex].pages[thisPageIndex] != save.notebooks[otherNotebookIndex].pages[otherPageIndex]) {
                e.dataTransfer.dropEffect = "move";
                let relativeY = e.clientY - this.getBoundingClientRect().top;
                if (relativeY > 18) {
                    //PLACE THE OTHER NOTEBOOK BELOW THIS ONE
                    this.style.boxShadow = "0px -2px 0px blue inset";
                }
                else if (relativeY <= 18) {
                    //PLACE THE OTHER NOTEBOOK ABOVE THIS ONE
                    this.style.boxShadow = "0px 2px 0px blue inset";
                }
            }
            else {
                e.dataTransfer.dropEffect = "none";
                return false;
            }
        }
        else {
            e.dataTransfer.dropEffect = "none";
            return false;
        }

    });
    el.addEventListener('dragleave', function (e) {
        e.stopPropagation();
        this.style.boxShadow = "none";
    });
    el.addEventListener('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();
        //this is called on the element that is being dropped on
        this.style.boxShadow = "none";

        let otherPageIndex = draggedPageIndex;
        let thisPageIndex = parseInt(this.children[0].getAttribute('page-index'));
        let otherNotebookIndex = draggedPagesNotebookIndex;
        let thisNotebookIndex = parseInt(this.children[0].getAttribute('notebook-index'));

        if (save.notebooks[thisNotebookIndex].pages[thisPageIndex] != save.notebooks[otherNotebookIndex].pages[otherPageIndex]) {

            if (thisNotebookIndex == otherNotebookIndex) {
                //MOVING PAGE IN THE SAME NOTEBOOK
                let relativeY = e.clientY - this.getBoundingClientRect().top;

                getExpandedNotebookData();
                if (relativeY > 18) {
                    //PLACE DRAGGED PAGE BELOW THE LANDED ONE

                    let pg = save.notebooks[otherNotebookIndex].pages[otherPageIndex];
                    let fillerPG = new Page("empty");
                    save.notebooks[otherNotebookIndex].pages[otherPageIndex] = fillerPG;
                    save.notebooks[otherNotebookIndex].pages.splice(thisPageIndex + 1, 0, pg);
                    save.notebooks[otherNotebookIndex].pages.splice(save.notebooks[otherNotebookIndex].pages.indexOf(fillerPG), 1);
                }
                else if (relativeY <= 18) {
                    //PLACE DRAGGED PAGE ABOVE THE LANDED ONE

                    let pg = save.notebooks[otherNotebookIndex].pages[otherPageIndex];
                    let fillerPG = new Page("empty");
                    save.notebooks[otherNotebookIndex].pages[otherPageIndex] = fillerPG;
                    save.notebooks[otherNotebookIndex].pages.splice(thisPageIndex, 0, pg);
                    save.notebooks[otherNotebookIndex].pages.splice(save.notebooks[otherNotebookIndex].pages.indexOf(fillerPG), 1);
                }

                saveData();
                displayNotebooks();
            }
            else {
                //MOVING PAGE INTO ANOTHER NOTEBOOK

                let relativeY = e.clientY - this.getBoundingClientRect().top;

                getExpandedNotebookData();
                if (relativeY > 18) {
                    //PLACE DRAGGED PAGE BELOW THE LANDED ONE

                    let pg = save.notebooks[otherNotebookIndex].pages[otherPageIndex];
                    let fillerPG = new Page("empty");
                    save.notebooks[otherNotebookIndex].pages[otherPageIndex] = fillerPG;
                    save.notebooks[thisNotebookIndex].pages.splice(thisPageIndex + 1, 0, pg);
                    save.notebooks[otherNotebookIndex].pages.splice(save.notebooks[otherNotebookIndex].pages.indexOf(fillerPG), 1);
                }
                else if (relativeY <= 18) {
                    //PLACE DRAGGED PAGE ABOVE THE LANDED ONE

                    let pg = save.notebooks[otherNotebookIndex].pages[otherPageIndex];
                    let fillerPG = new Page("empty");
                    save.notebooks[otherNotebookIndex].pages[otherPageIndex] = fillerPG;
                    save.notebooks[thisNotebookIndex].pages.splice(thisPageIndex, 0, pg);
                    save.notebooks[otherNotebookIndex].pages.splice(save.notebooks[otherNotebookIndex].pages.indexOf(fillerPG), 1);
                }

                saveData();
                displayNotebooks();
            }

        }
    });
    el.addEventListener('dragend', function (e) {
        e.stopPropagation();
        draggingPage = false;
    });
}

/**
 * Iterates through sidebar links and tells them to become 'active' and load their content on click, and other events like onContextMenu.
 */
function addSidebarLinkEvents() {
    document.querySelectorAll('.my-sidebar-link').forEach(function (item) {
        item.addEventListener('click', () => {
            //change selected sidebar item

            document.querySelectorAll('.my-sidebar-link').forEach(function (item) {
                item.classList.toggle('active', false);
            });

            item.classList.toggle('active', true);

        })
    });

    document.addEventListener('click', (e) => {
        if (e.target != document.getElementById('notebook-context-menu') && e.target != document.getElementById('page-context-menu')) {
            document.getElementById('notebook-context-menu').style.display = "none";
            document.getElementById('page-context-menu').style.display = "none";
        }
    });
}

/**
 * Shows the Home page and makes that sidebar link active.
 */
function showHomePage() {
    saveSelectedPage();
    document.getElementById('editorPage').style.display = "none";
    document.getElementById('settingsPage').style.display = "none";
    document.getElementById('homePage').style.display = "block";
    document.getElementById('helpPage').style.display = "none";
    //titlebar.updateTitle('Codex');
    selectedPage = null;

    remote.Menu.setApplicationMenu(normalMenu);
    if (remote.process.platform === 'win32') {
        titlebar.updateMenu(normalMenu);
    }
}

/**
 * Shows the Settings page and makes that sidebar link active.
 */
function showSettingsPage() {
    saveSelectedPage();
    document.getElementById('editorPage').style.display = "none";
    document.getElementById('homePage').style.display = "none";
    document.getElementById('settingsPage').style.display = "block";
    document.getElementById('helpPage').style.display = "none";
    //titlebar.updateTitle('Codex');
    selectedPage = null;

    remote.Menu.setApplicationMenu(normalMenu);
    if (remote.process.platform === 'win32') {
        titlebar.updateMenu(normalMenu);
    }

    document.getElementById("mainContainer").scrollTo(0, 0);
}

/**
 * Shows the Editor page. A page's content must be loaded to the editor afterwards.
 */
function showEditorPage() {
    document.getElementById('settingsPage').style.display = "none";
    document.getElementById('homePage').style.display = "none";
    document.getElementById('editorPage').style.display = "block";
    document.getElementById('helpPage').style.display = "none";

    remote.Menu.setApplicationMenu(editingMenu);
    if (remote.process.platform === 'win32') {
        titlebar.updateMenu(editingMenu);
    }

    document.getElementById("mainContainer").scrollTo(0, 0);
}

function showHelpPage() {
    saveSelectedPage();
    document.getElementById('settingsPage').style.display = "none";
    document.getElementById('homePage').style.display = "none";
    document.getElementById('editorPage').style.display = "none";
    document.getElementById('helpPage').style.display = "block";

    remote.Menu.setApplicationMenu(normalMenu);
    if (remote.process.platform === 'win32') {
        titlebar.updateMenu(normalMenu);
    }

    document.getElementById("mainContainer").scrollTo(0, 0);
}

function loadHelpPage(title) {
    document.getElementById('helpContent').innerHTML = fs.readFileSync(__dirname + "/docs/" + title + "/index.html", 'utf8');
    feather.replace();
}

/**
 * Shows modal used for editing a notebook, and updates the input controls with that notebook's data. THIS FUNCTION DOES NOT ACTUALLY EDIT THE DATA.
 * @see applyModalEventHandlers()
 */
function editSelectedNotebook() {
    $('#editNotebookModal').modal('show');
    document.getElementById('editNotebookNameInput').value = save.notebooks[rightClickedNotebookIndex].name;
    document.getElementById('editNotebookColorPicker').value = save.notebooks[rightClickedNotebookIndex].color;
    document.getElementById('editNotebookIconSelect').value = save.notebooks[rightClickedNotebookIndex].icon;
    document.getElementById('editNotebookIconPreview').setAttribute('data-feather', save.notebooks[rightClickedNotebookIndex].icon);
    document.getElementById('editNotebookIconPreview').style.color = save.notebooks[rightClickedNotebookIndex].color;
    feather.replace();
}

/**
 * Deletes the right-clicked notebook from the Save.
 */
function deleteSelectedNotebook() {
    getExpandedNotebookData();
    save.notebooks.splice(rightClickedNotebookIndex, 1);
    saveData();
    displayNotebooks();
    showHomePage();

    document.querySelectorAll('.my-sidebar-link').forEach(function (item) {
        item.classList.toggle('active', false);
    });
    document.getElementById('homeTab').classList.toggle('active', true);

    // let nbLI = document.getElementById(`nb-${rightClickedNotebookIndex}`).parentNode;
    // while (nbLI.firstChild) {
    //   nbLI.removeChild(nbLI.lastChild);
    // }
    // nbLI.parentNode.removeChild(nbLI);
}

function editSelectedPage() {
    $('#editPageModal').modal('show');
    document.getElementById('editPageNameInput').value = save.notebooks[rightClickedNotebookIndex].pages[rightClickedPageIndex].title;
}

function deleteSelectedPage() {
    getExpandedNotebookData();
    save.notebooks[rightClickedNotebookIndex].pages.splice(rightClickedPageIndex, 1);
    saveData();
    displayNotebooks();

    showHomePage();

    document.querySelectorAll('.my-sidebar-link').forEach(function (item) {
        item.classList.toggle('active', false);
    });
    document.getElementById('homeTab').classList.toggle('active', true);

    //delete the page's list element
    // let pgLI = document.querySelector(`[notebook-index="${rightClickedNotebookIndex}"][page-index="${rightClickedPageIndex}]"`).parentNode;
    // while (pgLI.firstChild) {
    //   pgLI.removeChild(pgLI.lastChild);
    // }
    // pgLI.parentNode.removeChild(pgLI);
}

/**
 * Loads the specified page's contents into the Editor.
 */
function loadPage(notebookIndex, pageIndex) {
    saveSelectedPage();
    selectedPageContent = "";
    selectedPage = save.notebooks[notebookIndex].pages[pageIndex];
    selectedPageContent = fs.readFileSync(prefs.dataDir + "/notes/" + selectedPage.fileName, 'utf8');

    if (window.view) {
        window.view.destroy();
    }
    window.view = new EditorView(document.getElementById('editor'), {
        state: EditorState.create({
            doc: mySchema.nodeFromJSON(JSON.parse(selectedPageContent)),
            plugins: exampleSetup({ schema: mySchema, tabSize: prefs.tabSize })
        })
    })

    document.getElementById("mainContainer").scrollTo(0, 0);
    //window.view.focus();
}

/**
 * Increases the zoom level and calls updateZoom().
 * @see updateZoom()
 */
function zoomIn() {
    if (selectedPage != null) {
        if (zoomLevel < 4.000) {
            zoomLevel += 0.100;
            updateZoom();
        }
    }
}

/**
 * Decreases the zoom level and calls updateZoom().
 * @see updateZoom()
 */
function zoomOut() {
    if (selectedPage != null) {
        if (zoomLevel > 0.700) {
            zoomLevel -= 0.100;
            updateZoom();
        }
    }
}

/**
 * Sets the zoom level to 1.0 calls updateZoom().
 * @see updateZoom()
 */
function defaultZoom() {
    if (selectedPage != null) {
        zoomLevel = 1.000;
        updateZoom();
    }
}

/**
 * Applies the zoom level to the transform scale of the editor.
 */
function updateZoom() {
    prefs.defaultZoom = zoomLevel;

    let ec = document.getElementById('editorContent');
    let mainContainer = document.getElementById("mainContainer");

    let oldScrollTop = mainContainer.scrollTop;
    let oldScrollHeight = mainContainer.scrollHeight;

    ec.style.zoom = `${zoomLevel}`;

    mainContainer.scrollTop = (oldScrollTop / oldScrollHeight) * mainContainer.scrollHeight;
}

/**
 * Toggles the editor ribbon
 */
function toggleEditorRibbon() {
    let ribbon = document.getElementById('editorRibbon');

    if (ribbon.style.display == "none") {
        ribbon.style.display = "flex";
    }
    else {
        ribbon.style.display = "none";
    }
}

function toggleSidebar(value) {

    if (value != null) {
        if (value == true) {
            document.documentElement.style.setProperty('--sidebar-width', `${sidebarWidth}px`);
            document.getElementById('sidebarToggler').setAttribute("flipped", "false");
            document.getElementById('sidebarResizer').style.display = "block";
            return;
        }
        else {
            document.documentElement.style.setProperty('--sidebar-width', `0px`);
            document.getElementById('sidebarToggler').setAttribute("flipped", "true");
            document.getElementById('sidebarResizer').style.display = "none";
            return;
        }
    }

    if (document.documentElement.style.getPropertyValue('--sidebar-width') == "0px") {
        document.documentElement.style.setProperty('--sidebar-width', `${sidebarWidth}px`);
        document.getElementById('sidebarToggler').setAttribute("flipped", "false");
        document.getElementById('sidebarResizer').style.display = "block";
        return;
    }
    else {
        document.documentElement.style.setProperty('--sidebar-width', `0px`);
        document.getElementById('sidebarToggler').setAttribute("flipped", "true");
        document.getElementById('sidebarResizer').style.display = "none";
        return;
    }
}

function resizeSidebar(width) {
    if (width >= 200 && width <= 600) {
        sidebarWidth = width;
        prefs.sidebarWidth = sidebarWidth;

        if (document.documentElement.style.getPropertyValue('--sidebar-width') != "0px") {
            document.documentElement.style.setProperty('--sidebar-width', `${sidebarWidth}px`);   
        }
    }
}

function DataDirDialog() {
    remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
        properties: ['openDirectory']
    }).then((result) => {

        if (result.canceled == false) {
            document.getElementById('dataDirInput').innerText = result.filePaths[0];

            destroyOpenedNotebooks = true;
            saveData();

            canSaveData = false;
            applyPrefsRuntime(true);
        }

    });
}

function revertToDefaultDataDir() {
    document.getElementById('dataDirInput').innerText = defaultDataDir;

    destroyOpenedNotebooks = true;
    saveData();

    canSaveData = false;
    applyPrefsRuntime(true);
}

function openAboutPage() {
    let about = new remote.BrowserWindow({
        width: 480,
        height: 360,
        resizable: false,
        icon: __dirname + '/icons/icon.ico',
        title: "About Codex",
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: false,
            worldSafeExecuteJavaScript: true,
            contextIsolation: false
        },
        parent: remote.getCurrentWindow(),
        modal: true,
        show: false
    });
    about.once('ready-to-show', () => {
        about.show()
    })
    about.setMenu(null);
    about.loadFile('about.html');
}

function toggleFavoritePage() {
    let page = save.notebooks[rightClickedNotebookIndex].pages[rightClickedPageIndex];

    page.favorite = !page.favorite;
    getExpandedNotebookData();
    saveData();
    displayNotebooks();
}

function updateFavoritesSection() {
    const container = document.getElementById('favoritesContainer');
    container.innerHTML = '';

    if (favoritePages.length == 0) {
            let div1 = document.createElement('div');
            div1.className = "fakeFavoriteBlock";

            div1.innerHTML = `
                <i class="mx-auto" style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden; font-weight: 400; vertical-align: middle; line-height: 34px;">Nothing here yet...</i>
            `;

            container.appendChild(div1);


            let div2 = document.createElement('div');
            div2.className = "fakeFavoriteBlock";

            container.appendChild(div2);

            let div3 = document.createElement('div');
            div3.className = "fakeFavoriteBlock";

            container.appendChild(div3);
    }

    for (let i = 0; i < favoritePages.length; i++) {
        let page = favoritePages[i];

        let a = document.createElement('a');
        a.className = "favoriteBlock shadow-sm";
        a.title = page.title;

        let nbIndex = null;
        let pgIndex = null;
        for (let n = 0; n < save.notebooks.length; n++) {
            for (let p = 0; p < save.notebooks[n].pages.length; p++) {
                if (save.notebooks[n].pages[p] == page) {
                    nbIndex = n;
                    pgIndex = p;
                }
            }
        }

        let parent = save.notebooks[nbIndex];

        a.innerHTML = `        
        <div class="row" style="width: 100%">
            <div class="col-auto">
                <span data-feather="${validator.escape(parent.icon)}" style="width: 32px; height: 32px; color: ${parent.color}"></span>
            </div>
            <div class="col" style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden; font-weight: 500; vertical-align: middle; line-height: 34px;">${validator.escape(page.title)}</div>
            <div class="col-auto" style="width: 32px">
                <span data-feather="star" style="width: 24px; height: 24px; color: orange; vertical-align: -12px"></span>
            </div>
        </div>
        `;

        container.appendChild(a);

        a.addEventListener('click', (e) => {
            let tab = document.getElementById(`nb-${nbIndex}`);
            if (tab.getAttribute('aria-expanded') != "true") {
                $(`#nb-${nbIndex}`).click();
            }

            document.querySelectorAll('.my-sidebar-link').forEach(function (item) {
                item.classList.toggle('active', false);
            });
            let page = document.querySelector(`[notebook-index='${nbIndex}'][page-index='${pgIndex}']`)
            page.classList.toggle('active', true);

            showEditorPage();
            loadPage(nbIndex, pgIndex);
        });

        a.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            document.getElementById('notebook-context-menu').style.display = "none";
            let cm = document.getElementById('page-context-menu');
            cm.style.display = "block";
            cm.style.left = `${e.clientX}px`;

            // Put the menu above the cursor if it's going to go off screen
            if (window.innerHeight - e.clientY < cm.clientHeight) {
                cm.style.top = `${e.clientY - cm.clientHeight}px`;
            }
            else {
                cm.style.top = `${e.clientY}px`;
            }

            rightClickedNotebookIndex = nbIndex;
            rightClickedPageIndex = pgIndex;

            if (save.notebooks[rightClickedNotebookIndex].pages[rightClickedPageIndex].favorite) {
                document.getElementById('FavoritePageLink').innerText = "Unfavorite page";
            }
            else {
                document.getElementById('FavoritePageLink').innerText = "Favorite page";
            }
        })
    }

    feather.replace();
}

function _loadCloudSyncPage() {
    let tab = document.getElementById('helpTab');
    if (tab.getAttribute('aria-expanded') != "true") {
        $('#helpTab').click();
    }

    document.querySelectorAll('.my-sidebar-link').forEach(function (item) {
        item.classList.toggle('active', false);
    });
    let page = document.getElementById('cloudSyncPage');
    page.classList.toggle('active', true);

    showHelpPage();
    loadHelpPage('cloudsyncing');
}

function openDataDir() {
    remote.shell.openPath(prefs.dataDir);
}

ipcRenderer.on('updateAvailable', function (e, newVer) {

    setTimeout(() => {
        $('#updateBlockLI').fadeIn();
        //document.getElementById('welcomeBlock').style.marginTop = "20px";
        //feather.replace();

        /*if (document.getElementById('homePage').style.display == "none") {
            popup('Update', 'A new version of Codex is available!', 'Please visit www.codexnotes.com/download to update.');
        }*/
    }, 0);
})

function printCurrentPage() {
    remote.dialog.showSaveDialog(remote.getCurrentWindow(), {
        filters: [{ name: "PDF Document", extensions: ["pdf"] }],
        title: "Export page to PDF",
        defaultPath: "*/" + sanitizeStringForFiles(selectedPage.title) + ".pdf"
    }).then((result) => {

        if (result.canceled == false) {
            
            printPage(window.view.dom.innerHTML, result.filePath);

        }

    });
}

function printRightClickedPage() {

    let page = save.notebooks[rightClickedNotebookIndex].pages[rightClickedPageIndex];

    remote.dialog.showSaveDialog(remote.getCurrentWindow(), {
        filters: [{ name: "PDF Document", extensions: ["pdf"] }],
        title: "Export page to PDF",
        defaultPath: "*/" + sanitizeStringForFiles(page.title) + ".pdf"
    }).then((result) => {

        if (result.canceled == false) {
            
            let editorView = null;
            try {
                let json = fs.readFileSync(prefs.dataDir + "/notes/" + page.fileName, 'utf8');

                editorView = new EditorView(null, {
                    state: EditorState.create({
                        doc: mySchema.nodeFromJSON(JSON.parse(json)),
                        plugins: exampleSetup({ schema: mySchema, tabSize: prefs.tabSize })
                    })
                });

                let html = editorView.dom.innerHTML;

                printPage(html, result.filePath);
            }
            catch (exception) {
                console.error(exception);
                alert("An error occurred while exporting the page. Check the developer console (Ctrl-Shift-I) for more information.");
            }
            finally {
                editorView.destroy();
            }

        }

    });
}

async function printPage(content, path, disableOpening = false) {

    content = content.replace(/\\n/g, "CODEX_PRINT_NEWLINE_CHAR_DONT_EVER_TYPE_THIS");

    let workerWindow = new remote.BrowserWindow({
        parent: remote.getCurrentWindow(),
        show: false,
        backgroundColor: '#414950'
    });
    workerWindow.loadFile('pdf.html');
    await workerWindow.webContents.executeJavaScript(`document.body.innerHTML = \`${content}\``);
    //await workerWindow.webContents.executeJavaScript(`document.getElementById('codeStyleLink').href = 'hljs_styles/${prefs.codeStyle}.css';`);
    await workerWindow.webContents.executeJavaScript(`document.getElementById('codeStyleLink').href = './node_modules/highlight.js/styles/${prefs.codeStyle}.css';`);


    /*if (prefs.pdfDarkMode == true) {
        await workerWindow.webContents.executeJavaScript(`document.getElementById('darkStyleLink').href = 'css/dark.css';`);
    }*/

    if (prefs.pdfBreakOnH1 == true) {
        await workerWindow.webContents.executeJavaScript('enableBreaksOnH1()');
    }

    await workerWindow.webContents.executeJavaScript('fixNewLines()')

    // !!! This is here to give the new page time to render KaTeX equations !!!
    await sleep(400);

    var data = await workerWindow.webContents.printToPDF({ pageSize: 'A4', printBackground: true, scaleFactor: 100, marginsType: 0 });

    fs.writeFileSync(path, data, (err) => {
        console.log(err.message);
        workerWindow.destroy();
        return;
    });

    if (prefs.openPDFonExport == true && disableOpening == false)
        shell.openExternal('file:///' + path);

    workerWindow.destroy();

}

function exportCurrentPageToMarkdown() {

    remote.dialog.showSaveDialog(remote.getCurrentWindow(), {
        filters: [{ name: "Markdown file", extensions: ["md"] }],
        title: "Export page to Markdown",
        defaultPath: "*/" + sanitizeStringForFiles(selectedPage.title) + ".md"
    }).then((result) => {

        if (result.canceled == false) {
            exportPageToMarkdown(window.view.state.doc, result.filePath);
        }

    });
}

function exportRightClickedPageToMarkdown() {
    let page = save.notebooks[rightClickedNotebookIndex].pages[rightClickedPageIndex];

    remote.dialog.showSaveDialog(remote.getCurrentWindow(), {
        filters: [{ name: "Markdown file", extensions: ["md"] }],
        title: "Export page to Markdown",
        defaultPath: "*/" + sanitizeStringForFiles(page.title) + ".md"
    }).then((result) => {

        if (result.canceled == false) {
            
            let editorView = null;
            try {
                let json = fs.readFileSync(prefs.dataDir + "/notes/" + page.fileName, 'utf8');

                editorView = new EditorView(null, {
                    state: EditorState.create({
                        doc: mySchema.nodeFromJSON(JSON.parse(json)),
                        plugins: exampleSetup({ schema: mySchema, tabSize: prefs.tabSize })
                    })
                });

                exportPageToMarkdown(editorView.state.doc, result.filePath);
            }
            catch (exception) {
                console.error(exception);
                alert("An error occurred while exporting the page. Check the developer console (Ctrl-Shift-I) for more information.");
            }
            finally {
                editorView.destroy();
            }

        }

    });
}

function exportPageToMarkdown(doc, path, disableOpening = false) {
    let data = customMarkdownSerializer.serialize(doc);

    fs.writeFileSync(path, data, (err) => {
        console.log(err.message);
        return;
    });

    if (prefs.openPDFonExport == true && disableOpening == false)
        shell.openExternal('file:///' + path);
}

function sanitizeStringForFiles(x) {
    return x.replace(/[\/\\:$*"<>|]+/g, " ");
}

function revertAccentColor() {
    prefs.accentColor = "#FF7A27";
    document.getElementById('accentColorPicker').value = "#FF7A27";
    document.documentElement.style.setProperty('--accent-color', prefs.accentColor);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function autoOpenHelpTab() {
    let tab = document.getElementById('helpTab');
    if (tab.getAttribute('aria-expanded') != "true") {
        $('#helpTab').click();
    }

    document.querySelectorAll('.my-sidebar-link').forEach(function (item) {
        item.classList.toggle('active', false);
    });
    let page = document.getElementById('firstHelpPage');
    page.classList.toggle('active', true);

    showHelpPage();
    loadHelpPage('gettingstarted');
}

function openExportNotebookModal() {

    if (save.notebooks[rightClickedNotebookIndex].pages.length > 0) {

        $('#exportNotebookModal').modal({backdrop: 'static', keyboard: false})

        document.getElementById('exportNotebookModalIcon').setAttribute('data-feather', save.notebooks[rightClickedNotebookIndex].icon);
        document.getElementById('exportNotebookModalIcon').style.color = save.notebooks[rightClickedNotebookIndex].color;

        let text = save.notebooks[rightClickedNotebookIndex].name;
        if (text.length > 26) {
            text = text.substring(0, 26) + "...";
        }

        document.getElementById('exportNotebookModalTitle').textContent = text;
        document.getElementById('exportNotebookModalPageCount').textContent = " - " + save.notebooks[rightClickedNotebookIndex].pages.length + " pages"
    }
    else {
        let name = save.notebooks[rightClickedNotebookIndex].name;
        if (name.length > 16) {
            name = name.substring(0, 16) + "...";
        }
        popup("Info", "Unable to export this Notebook", "This notebook (" + name + ") doesn't have any pages in it.");
    }
}

function exportNotebookDirDialog() {
    remote.dialog.showOpenDialog(remote.getCurrentWindow(), { properties: ['openDirectory'] }).then((result) => {
        if (result.canceled == false) {
            document.getElementById('exportNodebookLocation').innerText = result.filePaths[0];

            exportNotebookLocation = result.filePaths[0];

            document.getElementById('exportNotebookButton').disabled = false;
        }
    });
}

async function exportNotebookPages() {

    document.getElementById('exportNotebookButton').disabled = true;
    document.getElementById('exportNotebookProgressSection').style.display = "block";

    let notebook = save.notebooks[rightClickedNotebookIndex];

    let editorView = null;

    document.getElementById('exportNotebookProgressText').textContent = `Exporting... (0/${notebook.pages.length})`;

    let extra = 1;

    let type = document.getElementById('exportNotebookFileTypeSelect').value;

    try {
        for (let i = 0; i < notebook.pages.length; i++) {

            let page = notebook.pages[i];
            let title = page.title;

            //check and make sure pages don't have the same name
            for (let e = 0; e < notebook.pages.length; e++) {
                //don't check yourself
                if (i != e) {
                    if (page.title == notebook.pages[e].title) {
                        title += " " + extra;
                        extra++;
                        break;
                    }
                }
            }

            let json = fs.readFileSync(prefs.dataDir + "/notes/" + page.fileName, 'utf8');

            editorView = new EditorView(null, {
                state: EditorState.create({
                    doc: mySchema.nodeFromJSON(JSON.parse(json)),
                    plugins: exampleSetup({ schema: mySchema, tabSize: prefs.tabSize })
                })
            });


            if (type == "PDF") {
                let html = editorView.dom.innerHTML;

                await printPage(html, exportNotebookLocation + "/" + sanitizeStringForFiles(title) + ".pdf", true);
            }
            else if (type == "MD") {
                exportPageToMarkdown(editorView.state.doc, exportNotebookLocation + "/" + sanitizeStringForFiles(title) + ".md", true);
            }

            editorView.destroy();

            let percent = ((i+1) / notebook.pages.length) * 100;
            document.getElementById('exportNotebookProgressBar').style.width = `${percent}%`;
            document.getElementById('exportNotebookProgressText').textContent = `Exporting... (${i+1}/${notebook.pages.length})`;
        }
        document.getElementById('exportNotebookProgressText').textContent = "Done.";

        document.getElementById('exportNotebookCancelButton').style.display = "none";
        document.getElementById('exportNotebookButton').style.display = "none";
        document.getElementById('exportNotebookCloseButton').style.display = "block";
    }
    catch (exception) {
        console.error(exception);
        alert("An error occurred while exporting the pages. Check the developer console (Ctrl-Shift-I) for more information.");
        closeExportNotebookModal();
    }
    finally {
        if (editorView != null) {
            editorView.destroy();
        }
    }
}

function closeExportNotebookModal() {
    $('#exportNotebookModal').modal('hide');

    document.getElementById('exportNotebookCancelButton').style.display = "block";
    document.getElementById('exportNotebookButton').style.display = "block";
    document.getElementById('exportNotebookCloseButton').style.display = "none";
    document.getElementById('exportNotebookProgressSection').style.display = "none";
    document.getElementById('exportNodebookLocation').innerText = "No location set";
    exportNotebookLocation = "";

    document.getElementById('exportNotebookCancelButton').disabled = false;
    document.getElementById('exportNotebookButton').disabled = false;

    document.getElementById('exportNotebookProgressBar').style.width = "0%";

}

function deleteOldPages() {
    let activeFiles = [];

    for (let n = 0; n < save.notebooks.length; n++) {
        let notebook = save.notebooks[n];
        for (let p = 0; p < notebook.pages.length; p++) {
            let page = notebook.pages[p];

            activeFiles.push(page.fileName);
        }
    }

    let allFiles = fs.readdirSync(prefs.dataDir + "/notes/");

    let unusedFiles = allFiles.filter(function(obj) { return activeFiles.indexOf(obj) == -1; });

    if (allFiles.length > activeFiles.length && unusedFiles.length > 0) {
        try {

            unusedFiles.forEach((file) => {
                fs.rmSync(prefs.dataDir + "/notes/" + file);
            })
    
            popup("Codex", "Unused files deleted", "Any files in your /notes/ folder that you deleted in Codex have been removed.");
    
        }
        catch(exception) {
            alert(exception);
            console.error(exception);
        }
    }
    else {
        popup("Codex", "Info", "No unused files found.");
    }
}