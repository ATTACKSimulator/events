# ATTACK Simulator Events

This library helps our clients collect events from their custom landing pages and send them to our API.

## Installation

Events was designed to work both in the browser and in Node.js.

### Node.js

To get started with Events in your Node.js project, simply add the dependency with NPM.

```console
npm i @attacksimulator/events --save
```

### Browser

Include the `bundle.min.js` file in your project.

```html
<script src="path/to/events/bundle.min.js"></script>
```

#### CDN

The events package can be included by way of a CDN provider like cdnjs.com, unpkg and jsDelivr ...

```html
<script src="https://cdn.jsdelivr.net/npm/@attacksimulator/events@1.3.0/dist/bundle.min.js"></script>
```

## Usage

Before running the plugin, make sure you get an api key from our support team.

```html
<script>
  const ev = new ATSEvents({ apiKey: "YOUR_API_KEY" });
  ev.listen();
</script>
```

## Options

| Name                | Type       | Description                                                                                                               |
|---------------------| ---------- |---------------------------------------------------------------------------------------------------------------------------|
| **apiKey**          | `string`   | The key required to access our api. You can get it by contacting our support team.                                        |
| **eventsToInclude** | `string[]` | Set the events to watch. Leave empty to watch all available events. The default value is `[]`.                            |
| **eventsToExclude** | `string[]` | Set the events to not watch. Leave empty to watch all available events. The default value is `[]`.                        |
| **debug**           | `boolean`  | Set debugging `true` of `false`. The default value is `false`.                                                            |
| **shouldRedirect**  | `boolean`  | Specify whether the page should redirect after `click` or `submit` events. The default value is `true`.                   |
| **redirectUrl**     | `string`   | Set the redirect url after affecting events have been triggered. The default value is `https://tips.attacksimulator.com`. |
| **source**          | `string`   | Set the source of the events. Supported values are `LP` or `LP_EDU`. The default value is `LP`.                           |
| **url**             | `string`   | The destination url that the events should be sent at                                                                     |
| **extraPayload**    | `object`   | An object with extra data to be sent with the events.                                                                     |
| **tutorial**        | `boolean`  | Show the educational tutorial instead of redirecting straight away. The default value is `false`.                        |
| **tutorialSkippable** | `boolean` | Show a "skip" link in the tutorial. The default value is `true`.                                                          |
| **locale**          | `string`   | Force the tutorial language. Leave unset to detect it automatically.                                                      |

## Tutorial

When a user falls for a simulated phishing page the library normally redirects
them to the oops page. Set `tutorial: true` and it instead opens an overlay that
inspects the page, shows the warning signs the user walked past, and performs the
same redirect once they finish or skip it.

```html
<script>
  const ev = new ATSEvents({
    apiKey: "YOUR_API_KEY",
    tutorial: true,
  });
  ev.listen();
</script>
```

It runs on the events that would otherwise redirect: `button_clicked`,
`form_submitted`, the permission events and the download/attachment events.
Nothing changes when `tutorial` is left off.

### What it explains

The page is scanned at the moment the event fires and every dangerous item found
becomes its own step, with the element highlighted on the page:

* **The address** — why *this* URL should have raised suspicion: a raw IP, a
  lookalike built from special characters, a brand parked in a subdomain, a
  throwaway TLD, or an address long enough to push the real name out of sight.
  The part that actually decides ownership is highlighted in the readout.
* **Credential and card forms** — including forms with no `<form>` element and
  password fields typed as `text`, which cloned kits use to dodge password
  managers.
* **Downloads** — links and buttons that would have delivered a file.
* **Links that lie** — where the visible text and the real destination differ.
* **Pressure tactics** — the deadline or account-suspension threat is quoted
  back verbatim.
* **Brand impersonation** — when the page presents itself as an organisation the
  address does not belong to.

The overlay lives in a closed shadow root, so it cannot be styled or reached by
the host page, and its own clicks never re-trigger event collection.

### Languages

Ten locales ship with the library: `en-US`, `ro-RO`, `es-ES`, `ca-ES`,
`es-419` (also accepted as `es-LATAM`), `pt-BR`, `pt-PT`, `fr-FR`, `de-DE` and
`el-GR`. The language is picked from the `locale` option, then the campaign
token, then the browser, falling back to `en-US`.

### Naming the brand

The tutorial works out which organisation a page imitates on its own. If your
campaign already knows, send it as `ats_brand` in the campaign token and that
value is used instead of any guess.

## Available events

| Name                      | Type              | Description                                                                                                                                                                         |
| ------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **attachment_opened**     | internal          | The event gets triggered automatically when an attachment is opened. This requires the url of the host page to have a `file_type=attachment` query string.                          |
| **button_clicked**        | user+redirect     | The event gets triggered when a user clicks on a link that does not point to a file. After this event is sent, the webpage will redirect to `redirectUrl`.                          |
| **download_file_event**   | user              | The event gets triggered when a user clicks on a link that does point to a file.                                                                                                    |
| **file_opened**           | internal          | The event gets triggered automatically when an attachment is opened. This requires the url of the host page to have a `file_type=download` query string.                            |
| **input_filled**          | user              | The event gets triggered once per input field when a user enters a non-empty value. Later changes to the same field are ignored.                                                     |
| **page_loaded**           | internal          | The events triggers automatically whenever the page is loaded.                                                                                                                      |
| **page_read**             | internal          | The event gets triggered automatically whenever a user stays on the page for at least 30 seconds. This event is useful for educational pages.                                       |
| **form_submitted**        | user + redirect   | The events is triggered when a user submits a form. After this event is sent, the webpage will redirect to `redirectUrl`.                                                           |
| **mic_accepted**          | manual + redirect | The events is triggered manually and should be run after a user accepts the microphone permissions prompt. After this event is sent, the webpage will redirect to `redirectUrl`.    |
| **webcam_accepted**       | manual + redirect | The events is triggered manually and should be run after a user accepts the webcam permissions prompt. After this event is sent, the webpage will redirect to `redirectUrl`.        |
| **location_accepted**     | manual + redirect | The events is triggered manually and should be run after a user accepts the location permissions prompt. After this event is sent, the webpage will redirect to `redirectUrl`.      |
| **notification_accepted** | manual + redirect | The events is triggered manually and should be run after a user accepts the notifications permissions prompt. After this event is sent, the webpage will redirect to `redirectUrl`. |
| **clipboard_accepted**    | manual + redirect | The events is triggered manually and should be run after a user accepts the clipboard permissions prompt. After this event is sent, the webpage will redirect to `redirectUrl`.     |
