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

## September 18, 2023

Stub up navigation systm and `Infobox` page/components.

`App.tsx` has a `turnPage` function that controls what JSX is rendered. `turnPage` has a constant `pages` with the signature`Record<Page, JSX Element>`. `Nav`'s `Anchor` components have an `onClick` handler that sets `currentPage` to the `Anchor`'s `page` prop. `turnPage` returns the `pages` value at the `currentPage` look up.

## September 19

### Loading state from API

I struggled for a bit with loading dictionary results. This required me to re-evaluate how I typed `Result`.

In this project, I've reused web Glossi's `dictionaries` module, with minor modifications. Discussing the module as a whole is outside the scope of this log entry; for my purposes, I just need its `collect` function, which sends sends `fetch` requests to the Wiktionary and Free Dictionary APIs, then returns their responses in a semi-standardized form.

Each bundle from `collect` is added to the `lookupHistory` state, which is an array of objects representing each lookup in a user's session. The `lookupHistory` objects have a `quarry` property, which holds the word the user has looked up, and a `result` property, which holds the API responses from `collect.` It's typed like this in `services/types.tsx`:

    interface Lookup {
     quarry: string;
     result: Result; 
    }
  

Initially I had typed `Result` like this:

    type Result = {} | {...} // complex object structure

I did this because, when loading the response from `collect` the new `lookup` spent a moment as an empty object, triggering an error. This solved my problems for the time, but when I tried to access one of the dictionary keys on a `lookup`'s result property, I got an error saying that the key didn't exist on `Result`.

It turned out what I needed was twofold:

1. Type `Result` so that an attempt can be made to access it with any string.

        interface Result {
          [key: string]: {...}
        }

1. `collect` is loaded from a vanilla JS module. It worked, but without type information, TypeScript didn't know how to handle the empty object in the `result` property while it waited for the promise to resolve. Instead of refactoring the `dictionaries` module, I opted for a targeted solution: adding a TypeScript declaration (`.d.ts`) file to describe the types for `collect`.

        touch src/services/collect.d.ts

        // in collect.d.ts
        import { Result } from './types';

        declare module './dictionaries' {
          export function collect(term: string): Promise<Result>;
        }

After that, adding new lookups works as expected.

## September 20

Slow work of writing types for the Wiktionary and Free Dictionary API responses. The most stuck I got was writing the `Dictionary` module, figuring out how to return JSX depending on the API, and then whether the response has an error.

I settled on writing interfaces to describe each level of the Free Dictionary and Wiktionary responses. Now the `DictInfo` interface has a `response` type that expects `Array<FDResponse>` or `WiktResponse`. The `books` object in `Dictionary` which stores the response-specific JSX in functions paired with a key equal to the API abbreviation has type guarding to keep from erroring out. `fd` checks calls the `isFdError` function, which checks if the response is an `FDError` instead of `DictInfo`. Then it has a function which checks whether the response `response` key value type is `Array<FDResponse>` or `WiktResponse`. Uses [`type predicates`](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates) for narrowing.

Seems redundant at the moment. I have an object look up that initiates the function which triggers two narrowing functions (error, FD vs Wikt response type).

### When you have to add a type annotation to a variable

Little bit of a block just now: messing around with getting this to work as a Chrome extension that can look up words on a webpage, rather than feeding it words in the state declaration as I've been doing for a few days. I had a problem assigning the `data.value` from `chrome.onMessage` to `result` in the `App` module `useEffect`. I had this error message:

    Type '{}' is not assignable to type 'Result'.
      Index signature for type 'string' is missing in type '{}'.

This confused me because `data.value` was a `string` when I checked it with `typeof`. In the end, TypeScript just needed assurance that I wasn't going to try to assign `result` an object (or maybe `data.value`, although it passes as a `string`, is read as an object with the signature `{ value: ${MY_VALUE} }`). I silenced the error by assigning `data.value` to a variable with [type annotation](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-annotations-on-variables).

    const lookup: string = data.value;

## September 21

### Split dictionary responses in props

Pass props programmatically in `Main.tsx` so that `Dictionary.tsx` doesn't require more complex type guards.

# September 23

### Yeah, there was an easier way
File of "things so simple I can't believe I didn't do it before". `Main.tsx` formerly returned a function that mapped an array of my abbreviation of the API names (`['wikt', 'fd']`), returning two `Dictionary` elements, regardless of which API is active. `Dictionary` was configured to return a lookup of an object with `keys` of the abbreviations. Each key had a function that conditionally returned info depending on whether the `resp` value had a type of `FdResponse`, `WiktResponse`, `FdError`, or `WiktError`. This requried, or possibly I didn't know enough to implement a more efficient configuration, conditionally rendering each of those four possibilities. To satisfy `TypeScript` that no outcome in which a function was called that returned nothing, I had added a default return at the end of each anonymous function value of a `TSX fragment` (`<>Something went wrong</>`). Since `Dictionary` was mapped from an array with two values, only one mapping of which would cause a prop to be passed, the text 'Something went wrong' displayed below response info from the active API.  I swept this problem under the rug by giving the inactive `dictionary` container in `Main` the style property `display: none;` (or, in Bootstrap, adding the class `.d-none`) when the mapped string didn't equal `activeDict`.

To make it so much easier: `Main` passes a look up of `activeDict` in `lookupHistory[lookupIdx]`; this way only one `Dictionary` component is ever returned. Then, instead of looking up `activeDict`, I have an `if ... else if` chain that [narrows](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#working-with-union-types) the `resp` prop, setting the value the variable `content` as the condition necessitates, closed by an `else` that sets it to the 'Something went wrong' fragment in case *something goes wrong*. There was also some inconsistency in the typing that caused `TypeScript` to error out when thrown an error response by either API. I fixed that. Now the error response renders onscreen.