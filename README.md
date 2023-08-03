# ATTACK Simulator Events

This library helps our clients collect events from their custom landing pages and send them to our API.

## Instalation

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
<script src="https://cdn.jsdelivr.net/npm/@attacksimulator/events@1.2.0/dist/bundle.min.js"></script>
```

## Usage

Before running the plugin, make sure you get an api key from our support team.

```html
<script>
const ev = new ATSEvents({ "apiKey": "YOUR_API_KEY"});
ev.listen();
</script>
```

## Options

| Name                 | Type       | Description                                                                                                               |
|----------------------|------------|---------------------------------------------------------------------------------------------------------------------------|
| **apiKey**           | `string`   | The key required to access our api. You can get it by contacting our support team.                                        |
| **events**           | `string[]` | Set the events to watch. Leave empty to watch all available events. The default value is `[]`.                            |
| **debug**            | `boolean`  | Set debugging `true` of `false`. The default value is `false`.                                                            |
| **shouldRedirect**   | `boolean`  | Specify whether the page should redirect after `click` or `submit` events. The default value is `true`.                   |
| **redirectUrl**      | `string`   | Set the redirect url after affecting events have been triggered. The default value is `https://tips.attacksimulator.com`. |
| **source**           | `string`   | Set the source of the events. Supported values are `LP` or `LP_EDU`. The default value is `LP`.                           |

## Available events

| Name                    | Type            | Description                                                                                                                                                |
|-------------------------|-----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **attachment_opened**   | internal        | The event gets triggered automatically when an attachment is opened. This requires the url of the host page to have a `file_type=attachment` query string. |
| **click**               | user+redirect   | The event gets triggered when a user clicks on a link that does not point to a file. After this event is sent, the webpage will redirect to `redirectUrl`. |
| **download_file_event** | user            | The event gets triggered when a user clicks on a link that does point to a file.                                                                           |
| **file_opened**         | internal        | The event gets triggered automatically when an attachment is opened. This requires the url of the host page to have a `file_type=download` query string.   |
| **input_filled**        | user            | The event gets triggered whenever a user types something in a input field.                                                                                 |
| **page_loaded**         | internal        | The events triggers automatically whenever the page is loaded.                                                                                             |
| **page_read**           | internal        | THe event gets triggered automatically whenever a user stays on the page for at least 3 minutes. This event is useful for educational pages.               |
| **form_submitted**      | user + redirect | The events is triggered when a user submits a form.  After this event is sent, the webpage will redirect to `redirectUrl`.                                 |



