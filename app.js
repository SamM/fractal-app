const {app, BrowserWindow, Menu, ipcMain} = require('electron')

let treeWin = null;

function createTreeFractalWindow () {
	// Create the browser window.
	treeWin = new BrowserWindow({width: 500, height: 500})

	// and load the index.html of the app.
	treeWin.loadFile('./tree-fractal.html')

	// Open the DevTools.
	//treeWin.webContents.openDevTools()

	// Emitted when the window is closed.
	treeWin.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		treeWin = null
	})
}

//var right_click_template = require('./right-click-menu-template');

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function(){
    createTreeFractalWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
});

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (treeWin === null) {
		createTreeFractalWindow()
	}else{
		treeWin.focus();
	}
});
