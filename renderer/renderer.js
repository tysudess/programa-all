const descriptions = {
  monitor: 'Monitoramento de notícias e vídeos, termos, demandas, histórico e rotinas automáticas.',
  videoDownload: 'Área de download do Extrator de Vídeos, preservando o motor atual e suas fontes suportadas.',
  videoEditor: 'Editor de vídeo e Timeline, apresentado como módulo separado dentro do Programa All.',
  noticias: 'Extração de matérias com proxy, acesso de assinante, histórico, edição e revisão PT-BR.',
  planilhas: 'Automação de planilhas e integração do fluxo já existente no aplicativo original.',
  pdf: 'Editor de PDF com ferramentas visuais, capa, zoom, desfazer e recursos do projeto original.',
  capas: 'Principais Capas com coleta, OCR, exportação PDF e demais recursos do aplicativo original.'
};

let modules = [];
let selected = null;

const nav = document.getElementById('nav');
const grid = document.getElementById('moduleGrid');
const title = document.getElementById('pageTitle');
const description = document.getElementById('pageDescription');
const moduleTitle = document.getElementById('moduleTitle');
const moduleText = document.getElementById('moduleText');
const launchBtn = document.getElementById('launchBtn');
const folderBtn = document.getElementById('folderBtn');
const statusPill = document.getElementById('statusPill');
const message = document.getElementById('message');

function showMessage(text) {
  message.textContent = text;
  message.classList.toggle('hidden', !text);
}

function selectModule(id) {
  selected = modules.find(m => m.id === id);
  if (!selected) return;
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.toggle('active', el.dataset.id === id));
  document.querySelectorAll('.card').forEach(el => el.classList.toggle('active', el.dataset.id === id));
  title.textContent = selected.title;
  description.textContent = selected.available ? 'Módulo pronto para uso.' : 'Módulo não foi encontrado no pacote atual.';
  moduleTitle.textContent = selected.title;
  moduleText.textContent = descriptions[id] || '';
  launchBtn.disabled = !selected.available;
  folderBtn.disabled = !selected.available;
  statusPill.textContent = selected.available ? 'Disponível' : 'Indisponível';
  showMessage('');
}

async function loadModules() {
  modules = await window.programaAll.listModules();
  nav.innerHTML = '';
  grid.innerHTML = '';
  for (const item of modules) {
    const button = document.createElement('button');
    button.className = 'nav-btn';
    button.dataset.id = item.id;
    button.textContent = item.title;
    button.onclick = () => selectModule(item.id);
    nav.appendChild(button);

    const card = document.createElement('article');
    card.className = 'card';
    card.dataset.id = item.id;
    card.innerHTML = `<h3><span class="dot ${item.available ? 'ok' : ''}"></span>${item.title}</h3><p>${descriptions[item.id] || ''}</p>`;
    card.onclick = () => selectModule(item.id);
    grid.appendChild(card);
  }
  const ready = modules.filter(m => m.available).length;
  statusPill.textContent = `${ready}/${modules.length} módulos disponíveis`;
  if (modules.length) selectModule(modules[0].id);
}

launchBtn.addEventListener('click', async () => {
  if (!selected) return;
  showMessage('');
  launchBtn.disabled = true;
  const result = await window.programaAll.launchModule(selected.id);
  launchBtn.disabled = !selected.available;
  if (!result.ok) showMessage(result.error || 'Não foi possível abrir o módulo.');
});

folderBtn.addEventListener('click', async () => {
  if (selected) await window.programaAll.openModuleFolder(selected.id);
});

loadModules().catch(err => showMessage(`Falha ao carregar os módulos: ${err.message}`));
