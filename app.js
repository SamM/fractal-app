const {app, BrowserWindow, Menu, ipcMain} = require('electron')

let treeWin = null, appWin = null;

function createAppWindow(){
	appWin = new BrowserWindow({width: 1000, height: 1050})
	appWin.loadFile('./app.html')
	appWin.on('closed', () => {
		appWin = null
	})
}

//var right_click_template = require('./right-click-menu-template');

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function(){
    createAppWindow();
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
	if (appWin === null) {
		createAppWindow()
	}else{
		appWin.focus();
	}
});
