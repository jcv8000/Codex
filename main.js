// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, dialog, nativeTheme } = require('electron')

app.commandLine.appendSwitch("disable-http-cache");

var mainWindow = null;

const currentVersion = "1.4.1";


const gotTheLock = app.requestSingleInstanceLock()

//FORCE SINGLE INSTANCE
if (!gotTheLock) {
    app.quit()
}
else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }
    })

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', createWindow)

    // Quit when all windows are closed.
    app.on('window-all-closed', function () {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })

    app.on('activate', function () {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
}


function createWindow() {
    // Create the browser window.

    let useFrame = true;
    let iconPath = "";

    if (process.platform === 'win32') {
        useFrame = false;
        iconPath = '/icons/icon.ico';
    }
    else if (process.platform === 'linux') {
        iconPath = '/icons/64x64.png';
    }
    else if (process.platform === 'darwin') {
        iconPath = '/icons/icon.icns';
    }


    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        frame: useFrame,
        minWidth: 920,
        minHeight: 500,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            worldSafeExecuteJavaScript: true,
            contextIsolation: false
        },
        icon: __dirname + iconPath,
        show: false,
        title: 'Codex'
    });

    mainWindow.webContents.once('dom-ready', () => {
        mainWindow.show();

        try {

            const { net } = require('electron');
            const request = net.request('https://jcv8000.github.io/codex/latestversion.txt')
            request.on('response', (response) => {
                response.on('data', (chunk) => {
                    if (chunk.toString() !== currentVersion) {
                        //popup('Update', 'A new version of Codex is available!', 'Please visit www.codexnotes.com/download to update.');
                        mainWindow.webContents.send('updateAvailable');
                    }

                })
                response.on('aborted', () => {
                    errorPoup('Net request aborted while trying to check for updates', '');
                })
                response.on('error', (error) => {
                    errorPoup('Failed to check for updates', error.toString());
                })
            })

            request.on('redirect', () => {
                request.abort();
            })

            request.end()

            request.on('error', (err) => {
                errorPoup('Failed to check for updates', err.toString());
            })

        }
        catch (err) {
            errorPoup('Failed to check for updates', err.toString());
        }

    })

    // and load the index.html of the app.
    mainWindow.loadFile('index.html')

    // Open the DevTools.
    //mainWindow.webContents.openDevTools()

    Menu.setApplicationMenu(new Menu());

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
    dialog.showMessageBox(mainWindow, options);
}

function errorPoup(mes, det) {
    var options = {
        type: 'error',
        buttons: ["Ok"],
        defaultId: 0,
        cancelId: 0,
        detail: det,
        title: 'Error',
        message: mes
    }
    dialog.showMessageBox(mainWindow, options);
}