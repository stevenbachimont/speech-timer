const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

// Garder une référence globale de l'objet window
let mainWindow;

function createWindow() {
  // Créer la fenêtre du navigateur
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    },
    icon: path.join(__dirname, 'icon.png'), // Ajoutez une icône si vous en avez une
    titleBarStyle: 'default',
    show: false // Ne pas afficher jusqu'à ce que la page soit prête
  });

  // Charger le fichier HTML
  mainWindow.loadFile('index.html');

  // Afficher la fenêtre quand elle est prête
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Ouvrir les DevTools en développement
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Gérer la fermeture de la fenêtre
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Cette méthode sera appelée quand Electron aura fini de s'initialiser
app.whenReady().then(() => {
  createWindow();

  // Sur macOS, il est courant de recréer une fenêtre quand l'icône du dock est cliquée
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  // Créer le menu de l'application
  createMenu();
});

// Quitter quand toutes les fenêtres sont fermées
app.on('window-all-closed', () => {
  // Sur macOS, il est courant pour les applications et leur barre de menu
  // de rester actives jusqu'à ce que l'utilisateur quitte explicitement avec Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Créer le menu de l'application
function createMenu() {
  const template = [
    {
      label: 'Fichier',
      submenu: [
        {
          label: 'Nouveau Timer',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.executeJavaScript('timerManager.showAddTimerModal();');
          }
        },
        {
          label: 'Exporter Tous',
          accelerator: 'CmdOrCtrl+E',
          click: () => {
            mainWindow.webContents.executeJavaScript('timerManager.exportTimers();');
          }
        },
        {
          label: 'Importer',
          accelerator: 'CmdOrCtrl+I',
          click: () => {
            mainWindow.webContents.executeJavaScript('document.getElementById("importBtn").click();');
          }
        },
        { type: 'separator' },
        {
          label: 'Quitter',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Timer',
      submenu: [
        {
          label: 'Démarrer/Pause',
          accelerator: 'Space',
          click: () => {
            mainWindow.webContents.executeJavaScript(`
              if (window.timerManager && window.timerManager.activeTimerId) {
                window.timerManager.toggleTimer(window.timerManager.activeTimerId);
              }
            `);
          }
        },
        {
          label: 'Reset Timer Actif',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow.webContents.executeJavaScript(`
              if (window.timerManager && window.timerManager.activeTimerId) {
                window.timerManager.resetTimer(window.timerManager.activeTimerId);
              }
            `);
          }
        }
      ]
    },
    {
      label: 'Affichage',
      submenu: [
        {
          label: 'Plein écran',
          accelerator: 'F11',
          click: () => {
            mainWindow.setFullScreen(!mainWindow.isFullScreen());
          }
        },
        {
          label: 'Zoom Avant',
          accelerator: 'CmdOrCtrl+Plus',
          click: () => {
            const currentZoom = mainWindow.webContents.getZoomLevel();
            mainWindow.webContents.setZoomLevel(currentZoom + 0.5);
          }
        },
        {
          label: 'Zoom Arrière',
          accelerator: 'CmdOrCtrl+-',
          click: () => {
            const currentZoom = mainWindow.webContents.getZoomLevel();
            mainWindow.webContents.setZoomLevel(currentZoom - 0.5);
          }
        },
        {
          label: 'Zoom Normal',
          accelerator: 'CmdOrCtrl+0',
          click: () => {
            mainWindow.webContents.setZoomLevel(0);
          }
        }
      ]
    },
    {
      label: 'Aide',
      submenu: [
        {
          label: 'À propos',
          click: () => {
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'À propos de Speech Timer',
              message: 'Speech Timer v1.0.0',
              detail: 'Application de timer pour discours avec gestion des participants.\n\nDéveloppé avec Electron.'
            });
          }
        }
      ]
    }
  ];

  // Sur macOS, ajouter le menu de l'application
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        {
          label: 'À propos ' + app.getName(),
          role: 'about'
        },
        { type: 'separator' },
        {
          label: 'Services',
          role: 'services',
          submenu: []
        },
        { type: 'separator' },
        {
          label: 'Masquer ' + app.getName(),
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: 'Masquer les autres',
          accelerator: 'Command+Shift+H',
          role: 'hideothers'
        },
        {
          label: 'Afficher tout',
          role: 'unhide'
        },
        { type: 'separator' },
        {
          label: 'Quitter',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
