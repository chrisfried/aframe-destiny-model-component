## aframe-destiny-model-component

[![Version](http://img.shields.io/npm/v/aframe-destiny-model-component.svg?style=flat-square)](https://npmjs.org/package/aframe-destiny-model-component)
[![License](http://img.shields.io/npm/l/aframe-destiny-model-component.svg?style=flat-square)](https://npmjs.org/package/aframe-destiny-model-component)

Load Destiny game models from the Bungie API.

For [A-Frame](https://aframe.io).

### API

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
|          |             |               |

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.6.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-destiny-model-component/dist/aframe-destiny-model-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity destiny-model="foo: bar"></a-entity>
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
