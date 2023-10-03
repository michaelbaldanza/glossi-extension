/*
  Adapted from Google Chrome's Dictionary Side panel example.
  https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/functional-samples/sample.sidepanel-dictionary/service-worker.js
*/

let selection = '';
let isReady = false;

function sendSelection() {
  chrome.runtime.sendMessage({
    name: 'glossi-define',
    data: { value: selection}
  });
}

function setupIconAction() {
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
}

function setupContextMenu() {
  chrome.contextMenus.create({
    id: 'glossi-lookup',
    title: 'Search Glossi for "%s"',
    contexts: ['all', 'selection'],
  });
}

chrome.runtime.onInstalled.addListener(() => {
  setupIconAction();
  setupContextMenu();
});

chrome.contextMenus.onClicked.addListener((data, tab) => {
  if (data.menuItemId === 'glossi-lookup') {
    chrome.sidePanel.open({ windowId: tab.windowId });
  }
  selection = data.selectionText;
  if (isReady) sendSelection()
});

chrome.runtime.onMessage.addListener(({ reactIsReady }) => {
  if (isReady) return;
  if (reactIsReady) {
    isReady = true;
    sendSelection();
  }
});