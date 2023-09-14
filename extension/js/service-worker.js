/*
  Adapted from Google Chrome's Dictionary Side panel example.
  https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/functional-samples/sample.sidepanel-dictionary/service-worker.js
*/

function setupContextMenu() {
  console.log('set up context menu');
  chrome.contextMenus.create({
    id: 'glossi-lookup',
    title: 'Search Glossi for "%s"',
    contexts: ['selection'],
  });
}

chrome.runtime.onInstalled.addListener(() => {
  console.log('add runtime.onInstalled listener');
  setupContextMenu();
});

chrome.contextMenus.onClicked.addListener((data) => {
  console.log(`going to send message with ${data}`);
  chrome.runtime.sendMessage({
    name:'glossi-define',
    data: { value: data.selectionText },
  });
});