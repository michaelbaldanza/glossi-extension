# Devlog of Glossi's Chrome extension

## September 11, 2023

### Accessing `chrome.storage` for logging in the user
Spent a few days trying to figure out how to get the React and Chrome app to share information.

I believed that the React app, as a [content script](https://developer.chrome.com/docs/extensions/mv3/content_scripts/), wouldn't be able to access `chrome` APIs such as storage. Since trying to use any `chrome` API returned an error `cannot find name 'chrome'`, I took this for granted, and wasted a lot of time looking into [message passing](https://developer.chrome.com/docs/extensions/mv3/messaging/)

The first step toward solving the issue was the realization that TypeScript needed `chrome` to be installed as a dependency.

    npm install --save-dev @types/chrome

Now I could access `chrome.storage` in the React app, but I still had trouble passing information between it and the extension. For a while, I tried [dispatching](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent) a [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent), but here I had a problem with the order in which the scripts executed. I was including the scripts in `popup.html` like this:

    <script defer src="./js/bootstrap.min.js"></script>
    <script defer src="./js/background.js"></script>
    <script defer src="./js/content/content.js"></script>

(The React app was passed in through `content.js`, and I tried to get the extension to communicate with it through `background.js`.)

The `background` script ran before the React app; it would access `chrome.storage` and dispatch an event, but no listener stood to receive it. When I swapped the script tags' order in `popup.html`, the React app could receive the event dispatched by `background`, but I couldn't get `background` to receive the event dispatched by `content`. In any case, I thought it was a kludgy solution of my immediate problem (making sure that the React app UI recognized the logged in user if a token was found in `chrome.storage`).

Flailing, guessing that the issue was somehow caused by injecting the scripts in script tags, I tried instead to register   `background` as a [`service-worker`](https://developer.chrome.com/docs/extensions/mv3/getstarted/tut-quick-reference/) and `content` as a proper [`content script`](https://developer.chrome.com/docs/extensions/mv3/content_scripts/). This done, I then tried to [pass messages](https://developer.chrome.com/docs/extensions/mv3/messaging/) between the two. It didn't work. On one end or the other, I saw this error:

    Could not establish connection. Receiving end does not exist.

For a while now I had suspected that, possibly, I wasn't dealing with a *real* content script. The docs told me that the content script couldn't access directly the extension `DOM`, but wasn't I doing just that by dispatching the event on the `document` interface? Wasn't the whole app appended to the body element of `popup.html`? Against the guidance of the docs, I decided to try accessing `chrome.storage` in React. I imported React's `useEffect` hook in `App.tsx`, and tried to access the user in storage.

    useEffect(() => {
      chrome.storage.local.get(['user']).then((result) => {
        if (result.hasOwnProperty('user')) {
          console.log(result.user);
        }
      });
    }, [])

Sure enough, this logged the `user` document.

The resources I found discussed content scripts that were doing something in *webpages*, but `content.js` is *part of the extension DOM itself*. Thus `content.js` can access the extension DOM interface and `chrome` APIs without a mediating background script or service worker. It isn't even a true content script. It belongs to the extension only, and doesn't interact with the larger browser environment.

## September 12, 2023

### Icons
Created icons for Glossi in the sizes suggested by the [docs](https://developer.chrome.com/docs/extensions/mv3/manifest/icons/). Copied the `svg` from the Glossi app, and converted to the `png` format using [cloudconvert](https://cloudconvert.com/svg-to-png). Changed the `svg` contents from

    <svg width="140" height="140" xmlns="http://www.w3.org/2000/svg">
        <style>
            text {
                font-family:Helvetica;
            }
        </style>
    <g>
      <title>Layer 1</title>
      <text transform="matrix(4.20085 0 0 5.23268 -1263.98 -970.633)" stroke="#000" xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="24" id="svg_1" y="205.84219" x="301.10068" stroke-width="0" fill="#81cdc6" fill-opacity="90%">G</text>
    </g>
    </svg>

to

    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
        <style>
            text {
                font-family:Helvetica;
            }
        </style>
    <g>
      <text x="50%" y="59%" dominant-baseline="middle" text-anchor="middle" padding="0" margin="0" stroke="#000" xml:space="preserve" font-size="16" id="svg_1" stroke-width="0" fill="#81cdc6" fill-opacity="90%">G</text>
    </g>
    </svg>

I leveraged the `dominant-baseline` and `text-anchor` attributes as suggested by [this post](https://stackoverflow.com/questions/5546346/how-to-place-and-center-text-in-an-svg-rectangle/31522006#31522006).

The "G" seems to have some space at the bottom (maybe `padding`?) that causes it to be shifted up when `y` is set to `50%`. I toyed around with values up to `60%` and found that `59%` does the best to make the "G" appear in the center.

## [Internationalize the extension](https://developer.chrome.com/docs/webstore/i18n/)

Added `"default_locale": "en"` to the `manifest.` Added a `_locales` directory to `extension` with a subdirectory `en` and `messages.json`. Replaced values of `"name"` and `"description"` in `manifest` with `MSG` defaults.

## Change from [popup](https://developer.chrome.com/docs/extensions/reference/browserAction/#popup) to [side panel](https://developer.chrome.com/docs/extensions/reference/sidePanel/)

Add `"side_panel": { "default_path": "Click to open panel" }` to and `sidePanel` to `"permissions"` in the `manifest`.

## Inject selection from webpage to app

Recreate `extension/js/serviceworker.js` and add `"background": { "service-worker": "js/service-worker.js" }`to the `manfest`.

Google Chrome offers some [sample extensions](https://github.com/GoogleChrome/chrome-extensions-samples). The [`sidepanel-dictionary`](https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/functional-samples/sample.sidepanel-dictionary) is bare bones, but offers a way to get a text selection to the extension script. Copy the functions from the [`service-worker`](https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/functional-samples/sample.sidepanel-dictionary/service-worker.js), changing the `id`/`name` and `title` values as necessary. This [answer](https://stackoverflow.com/a/4379141) suggests adding `%s` to get the selected text in the option title.

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

The React app is my extension's analogue to [`sidepanel.js`](https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/functional-samples/sample.sidepanel-dictionary/sidepanel.js) in the Chrome extension. I'll follow suit and, in my `react-chrome-app/src/App.tsx`, set up an event listener on `chrome.runtime.onMessage` to receive the message sent from the last statement in `service-worker.js`. If it passes a message where the `name` key has the value `glossi-define`, I'll set the `lookup` state to `data.value`

    chrome.runtime.onMessage.addListener(({ name, data }) => {
      if (name === 'glossi-define') {
        setLookup(data.value);
      }
    });