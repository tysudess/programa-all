const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const modulesRoot = () => app.isPackaged
  ? path.join(process.resourcesPath, 'modules')
  : path.join(__dirname, '..', 'staging', 'modules');

const registry = {
  monitor: { title: 'Monitor de Notícias', dir: 'monitor', match: /monitor.*not[ií]cias.*\.exe$/i },
  videoDownload: { title: 'Extrator de Vídeos — Download', dir: 'video', match: /^ExtratorVideos\.exe$/i, args: ['--programa-all-mode=download'] },
  videoEditor: { title: 'Extrator de Vídeos — Editor / Timeline', dir: 'video', match: /^ExtratorVideos\.exe$/i, args: ['--programa-all-mode=editor'] },
  noticias: { title: 'Extrator de Notícias', dir: 'noticias', match: /ExtratorMateriasPortable.*\.exe$/i },
  planilhas: { title: 'Automação de Planilhas', dir: 'planilhas', match: /AutomacaoPlanilhas.*\.exe$/i },
  pdf: { title: 'Editor de PDF', dir: 'pdf', match: /^Editor-de-PDF\.exe$/i },
  capas: { title: 'Principais Capas', dir: 'capas', match: /^PrincipaisCapas\.exe$/i }
};

function findExe(base, regex) {
  if (!fs.existsSync(base)) return null;
  const stack = [base];
  while (stack.length) {
    const dir = stack.pop();
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (regex.test(entry.name)) return full;
    }
  }
  return null;
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1080,
    minHeight: 700,
    backgroundColor: '#08111f',
    title: 'Programa All',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.removeMenu();
  win.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));
}

ipcMain.handle('module:list', async () => Object.entries(registry).map(([id, item]) => {
  const exe = findExe(path.join(modulesRoot(), item.dir), item.match);
  return { id, title: item.title, available: !!exe };
}));

ipcMain.handle('module:launch', async (_event, id) => {
  const item = registry[id];
  if (!item) return { ok: false, error: 'Módulo desconhecido.' };
  const exe = findExe(path.join(modulesRoot(), item.dir), item.match);
  if (!exe) return { ok: false, error: `Executável de ${item.title} não encontrado no pacote.` };

  try {
    const child = spawn(exe, item.args || [], {
      cwd: path.dirname(exe),
      detached: true,
      stdio: 'ignore',
      windowsHide: false,
      env: { ...process.env, PROGRAMA_ALL: '1', PROGRAMA_ALL_MODULE: id }
    });
    child.unref();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message };
  }
});

ipcMain.handle('module:open-folder', async (_event, id) => {
  const item = registry[id];
  if (!item) return false;
  const dir = path.join(modulesRoot(), item.dir);
  if (!fs.existsSync(dir)) return false;
  await shell.openPath(dir);
  return true;
});

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
