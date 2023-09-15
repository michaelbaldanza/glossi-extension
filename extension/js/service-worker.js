/*
  Adapted from Google Chrome's Dictionary Side panel example.
  https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/functional-samples/sample.sidepanel-dictionary/service-worker.js
*/

function setupContextMenu() {
  chrome.contextMenus.create({
    id: 'glossi-lookup',
    title: 'Search Glossi for "%s"',
    contexts: ['selection'],
  });
}

chrome.runtime.onInstalled.addListener(() => {
  setupContextMenu();
});

chrome.contextMenus.onClicked.addListener((data) => {
  chrome.runtime.sendMessage({
    name:'glossi-define',
    data: { value: data.selectionText },
  });
});