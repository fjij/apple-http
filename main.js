var electron = require('electron')
var path = require('path')
var url = require('url')

var window = null

electron.app.once('ready', function () {
  window = new electron.BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: "#D6D8DC",
    show: false
  })

  window.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  window.once('ready-to-show', function () {
    window.show()
  })

  win.on('closed', () => {
    win = null
  })
})

electron.app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
