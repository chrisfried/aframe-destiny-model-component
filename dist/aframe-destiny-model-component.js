/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	var fetchScript = __webpack_require__(1)();

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

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	/**
	 * Source: https://github.com/Adobe-Marketing-Cloud/fetch-script
	 */

	function getScriptId() {
	  return 'script_' + Date.now() + '_' + Math.ceil(Math.random() * 100000);
	}

	function createScript(url, id) {
	  var script = document.createElement('script');
	  script.type = 'text/javascript';
	  script.async = true;
	  script.id = id;
	  script.src = url;

	  return script;
	}

	function removeScript(id) {
	  const script = document.getElementById(id);
	  const parent = script.parentNode;

	  try {
	    parent && parent.removeChild(script);
	  } catch (e) {
	    // ignore
	  }
	}

	function appendScript(script) {
	  const firstScript = document.getElementsByTagName('script')[0];
	  firstScript.parentNode.insertBefore(script, firstScript);
	}

	function fetchScriptInternal(url, options, Promise) {
	  return new Promise(function(resolve, reject) {
	    const timeout = options.timeout || 5000;
	    const scriptId = getScriptId();
	    const script = createScript(url, scriptId);

	    const timeoutId = setTimeout(function() {
	      reject(new Error('Script request to ' + url + ' timed out'));

	      removeScript(scriptId);
	    }, timeout);

	    const disableTimeout = function(timeoutId) { clearTimeout(timeoutId); };

	    script.addEventListener('load', function(e) {
	      resolve({ok: true});

	      disableTimeout(timeoutId);
	      removeScript(scriptId);
	    });

	    script.addEventListener('error', function(e) {
	      reject(new Error('Script request to ' + url + ' failed ' + e));

	      disableTimeout(timeoutId);
	      removeScript(scriptId);
	    });

	    appendScript(script);
	  });
	}

	function fetchScript(settings) {
	  settings = settings || {};
	  return function (url, options) {
	    options = options || {};
	    return fetchScriptInternal(url, options, settings.Promise || Promise);
	  };
	}

	module.exports = fetchScript;


/***/ })
/******/ ]);