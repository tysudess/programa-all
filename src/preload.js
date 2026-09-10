const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('programaAll', {
  listModules: () => ipcRenderer.invoke('module:list'),
  launchModule: (id) => ipcRenderer.invoke('module:launch', id),
  openModuleFolder: (id) => ipcRenderer.invoke('module:open-folder', id)
});
