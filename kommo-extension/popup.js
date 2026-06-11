// Popup da extensão — sincroniza settings com a aba do Kommo

async function getTab() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs[0]);
    });
  });
}

async function getSettings() {
  const tab = await getTab();
  if (!tab) return null;
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tab.id, { type: 'GET_SETTINGS' }, (res) => {
      resolve(res?.settings || null);
    });
  });
}

async function setSettings(settings) {
  const tab = await getTab();
  if (!tab) return;
  chrome.tabs.sendMessage(tab.id, { type: 'SET_SETTINGS', settings });
}

async function init() {
  const settings = await getSettings();
  if (!settings) {
    // Fallback: ler do storage direto
    chrome.storage.local.get('kcp_settings', (data) => {
      const s = data['kcp_settings'] || { focusMode: true, shortcuts: true };
      applyToUI(s);
    });
    return;
  }
  applyToUI(settings);
}

function applyToUI(settings) {
  document.getElementById('toggle-focus').checked = !!settings.focusMode;
  document.getElementById('toggle-shortcuts').checked = !!settings.shortcuts;
}

document.getElementById('toggle-focus').addEventListener('change', (e) => {
  setSettings({ focusMode: e.target.checked });
});

document.getElementById('toggle-shortcuts').addEventListener('change', (e) => {
  setSettings({ shortcuts: e.target.checked });
});

init();
