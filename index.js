var fetchScript = require('./lib/fetch-script')();

var LOADER_SRC = 'https://rawgit.com/chrisfried/BungieNetPlatform/master/three-tgx-loader/three.tgxloader.js';

/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Destiny Model component for A-Frame.
 */
AFRAME.registerComponent('destiny-model', {
  schema: {
    itemHash: { type: 'number' },
    apiKey: { type: 'string' },
    game: { type: 'string', default: 'd2' },
    platform: { type: 'string', default: 'web' }
  },

  /**
   * Set if component needs multiple instancing.
   */
  multiple: false,

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: function () { 
    this.model = null;
    this.loader = null;
    this.loaderPromise = loadLoader().then(function () {
      this.loader = new THREE.TGXLoader();
    }.bind(this));
  },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function () {
    var self = this;
    var el = this.el;
    var itemHash = this.data.itemHash;
    var apiKey = this.data.apiKey;
    var game = this.data.game;
    var platform = this.data.platform;

    if (!itemHash || !apiKey) { return; }

    this.remove();

    this.loaderPromise.then(function () {
      THREE.TGXLoader.APIKey = apiKey;
      THREE.TGXLoader.Platform = platform;
      if (game === 'd2') {
        THREE.TGXLoader.APIBasepath = 'https://www.bungie.net/Platform/Destiny2';
      } else {
        THREE.TGXLoader.APIBasepath = 'https://www.bungie.net/d1/Platform/Destiny';
      }
      this.loader.load(itemHash, function tgxLoaded (geometry, materials) {
        var mesh = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
        mesh.rotation.x = -90 * Math.PI / 180;
        // mesh.scale.set(500, 500, 500);

        self.model = mesh;
        // self.model.animations = gltfModel.animations;
        el.setObject3D('mesh', self.model);
        el.emit('model-loaded', {format: 'gltf', model: self.model});
      });
    }.bind(this));
  },

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function () {
    if (!this.model) { return; }
    this.el.removeObject3D('mesh');
  },

  /**
   * Called on each scene tick.
   */
  // tick: function (t) { },

  /**
   * Called when entity pauses.
   * Use to stop or remove any dynamic or background behavior such as events.
   */
  pause: function () { },

  /**
   * Called when entity resumes.
   * Use to continue or add any dynamic or background behavior such as events.
   */
  play: function () { }
});

var loadLoader = (function () {
  var promise;
  return function () {
    promise = promise || fetchScript(LOADER_SRC);
    return promise;
  };
}());