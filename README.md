## aframe-destiny-model-component

[![Version](http://img.shields.io/npm/v/aframe-destiny-model-component.svg?style=flat-square)](https://npmjs.org/package/aframe-destiny-model-component)
[![License](http://img.shields.io/npm/l/aframe-destiny-model-component.svg?style=flat-square)](https://npmjs.org/package/aframe-destiny-model-component)

Load Destiny game models from the Bungie API.

Currently handles a few global variables very bluntly. Feel free to drop an Issue or a Pull Request if you've a better idea for how to handle them.

For [A-Frame](https://aframe.io).

### API

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
| itemHash | itemHash of the item you would like to load. | |
| shaderHash | itemHash of the shader you would like to apply. `0` applies default shader. | `0` |
| game | Accepts `destiny` or `destiny2` | `destiny2` |
| platform | Accepts `web` or `mobile`. Web seems to only work for Destiny 1 assets. Mobile requires you host manifest proxies. See the [TGXLoader documentation](https://github.com/DestinyDevs/BungieNetPlatform/tree/master/three-tgx-loader#loading-mobile-assets) for more info. | `mobile` |
| apiKey | The [Bungie API Key](https://www.bungie.net/en/Application) for your app | `window.DESTINYMODELCONFIG.apiKey` |
| d1Manifest | Destiny Manifest proxy URL | `window.DESTINYMODELCONFIG.d1Manifest` |
| d2Manifest | Destiny 2 Manifest proxy URL | `window.DESTINYMODELCONFIG.d2Manifest` |


### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.6.0/aframe.min.js"></script>
  <script>
    window.DESTINYMODELCONFIG = {
      apiKey: 'BUNGIE-API-KEY',
      d1Manifest: 'DESTINY-MANIFEST-URL',
      d2Manifest: 'DESTINY-2-MANIFEST-URL'
    }
  </script>
  <script src="https://unpkg.com/aframe-destiny-model-component/dist/aframe-destiny-model-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity destiny-model="itemHash: 3854359821; game: destiny2; shader: 1422712818; platform: mobile;"></a-entity>
  </a-scene>
</body>
```

#### npm

Install via npm:

```bash
npm install aframe-destiny-model-component
```

Then require and use.

```js
require('aframe');
require('aframe-destiny-model-component');
```
