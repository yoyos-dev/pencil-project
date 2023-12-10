import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import fs from 'fs';

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }

  const dealersFilePath = path.join(app.getPath('userData'), 'dealers.json');
  const gamesFilePath = path.join(app.getPath('userData'), 'games.json');
  if (!fs.existsSync(dealersFilePath)) {
    fs.writeFileSync(dealersFilePath, JSON.stringify({}));
  }
  if (!fs.existsSync(gamesFilePath)) {
    fs.writeFileSync(gamesFilePath, JSON.stringify({}));
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)

declare global {
  interface Window {
      api: {
          send: (event: string, data: any) => void;
          on: (channel: string, func: (...args: any[]) => void) => void;
          request: (channel: string) => void;
          remove: (channel: string, func: (...args: any[]) => void) => void;
      };
  }
}

ipcMain.on('writeDealer', (event, dealerData) => {
  const filePath = path.join(app.getPath('userData'), 'dealers.json');
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading file', err);
    } else {
      let json: { [key: string]: any } = {};
      if (data) {
        try {
          json = JSON.parse(data);
        } catch (err) {
          console.error('Error parsing JSON', err);
        }
      }

      json[dealerData.badgeNum] = dealerData;

      fs.writeFile(filePath, JSON.stringify(json), (err) => {
        if (err) {
            console.error('Error writing file', err);
        } else {
          event.reply('dealerAdded');
        }
      });
    }
  });
});

ipcMain.on('writeGames', (event, gamesList) => {
  const filePath = path.join(app.getPath('userData'), 'games.json');
  fs.writeFile(filePath, JSON.stringify(gamesList), (err) => {
      if (err) {
          console.error('Error writing file', err);
      } else {
        event.reply('gamesSaved', gamesList);
      }
  });
});

ipcMain.on('readGames', (event) => {
  const filePath = path.join(app.getPath('userData'), 'games.json');
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading file', err);
    } 
    try {
      event.reply('gamesList', JSON.parse(data));
    } catch (err) {
      console.error('Error parsing JSON', err);
    }
  });
});

ipcMain.on('updateDealersGames', (_event, gamesList) => {
  const filePath = path.join(app.getPath('userData'), 'dealers.json');
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading file', err);
    } else {
      let dealers: { [key: string]: { games: { [key: string]: any } } } = {};
      try {
        dealers = JSON.parse(data);
        for (let dealerKey in dealers) {
          let dealer = dealers[dealerKey];
          for (let game of gamesList) {
            if (!(game in dealer.games)) {
              dealer.games[game] = false;
            }
          }
          for (let game in dealer.games) {
            if (!gamesList.includes(game)) {
              delete dealer.games[game];
            }
          }
        }
      } catch (err) {
        console.error('Error parsing JSON', err);
      }
      fs.writeFile(filePath, JSON.stringify(dealers), (err) => {
        if (err) {
          console.error('Error writing file', err);
        }
      });
    }
  });
});

ipcMain.on('readDealers', (event) => {
  const filePath = path.join(app.getPath('userData'), 'dealers.json');
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading file', err);
    }  
    try {
      event.reply('dealersList', JSON.parse(data));
    } catch (err) {
      console.error('Error parsing JSON', err);
    }
  });
});

ipcMain.on('deleteDealer', (event, dealerKey) => {
  const filePath = path.join(app.getPath('userData'), 'dealers.json');
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading file', err);
    } else {
      let dealers: { [key: string]: any } = {};
      try {
        dealers = JSON.parse(data);
      } catch (err) {
        console.error('Error parsing JSON', err);
      }
      delete dealers[dealerKey];
      fs.writeFile(filePath, JSON.stringify(dealers), (err) => {
        if (err) {
          console.error('Error writing file', err);
        } else {
          event.reply('dealerDeleted', JSON.parse(data));
        }
      });
    }
  });
});

ipcMain.on('updateDealer', (event, {oldBadge, dealerData}) => {
  const filePath = path.join(app.getPath('userData'), 'dealers.json');
  fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
          console.error('Error reading file', err);
      } else {
          let dealers = JSON.parse(data);
          delete dealers[oldBadge]
          dealers[dealerData.badgeNum] = dealerData;

          fs.writeFile(filePath, JSON.stringify(dealers), (err) => {
              if (err) {
                  console.error('Error writing file', err);
              } else {
                  event.reply('dealerUpdated', dealerData);
              }
          });
      }
  });
});