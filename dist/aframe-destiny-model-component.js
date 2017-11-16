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

	var LOADER_SRC = 'https://rawgit.com/lowlines/three-tgx-loader/master/three.tgxloader.js';

	/* global AFRAME */

	if (typeof AFRAME === 'undefined') {
	  throw new Error('Component attempted to register before AFRAME was available.');
	}

	var config = {};
	if (window.DESTINYMODELCONFIG) config = window.DESTINYMODELCONFIG;
	if (!config.apiKey) config.apiKey = '';

	/**
	 * Destiny Model component for A-Frame.
	 */
	AFRAME.registerComponent('destiny-model', {
	  schema: {
	    itemHash: { type: 'number' },
	    shaderHash: { type: 'number', default: 0 },
	    game: { type: 'string', default: 'destiny2' },
	    apiKey: { type: 'string', default: config.apiKey },
	    platform: { type: 'string', default: 'mobile' },
	    d1Manifest: { type: 'string', default: config.d1Manifest },
	    d2Manifest: { type: 'string', default: config.d2Manifest }
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
	    var shaderHash = this.data.shaderHash;
	    var apiKey = this.data.apiKey;
	    var d1Manifest = this.data.d1Manifest;
	    var d2Manifest = this.data.d2Manifest;
	    var game = this.data.game;
	    var platform = this.data.platform;

	    if (!itemHash || !apiKey || !game
	        || (game === 'destiny2' && platform === 'web')
	        || (game === 'destiny2' && !d2Manifest)
	        || (platform === 'mobile' && !d1Manifest)) { return; }

	    this.remove();

	    this.loaderPromise.then(function () {
	      THREE.TGXLoader.APIKey = apiKey;
	      THREE.TGXLoader.ManifestPath = d1Manifest;        
	      THREE.TGXLoader.ManifestPath2 = d2Manifest;
	      THREE.TGXLoader.Platform = platform;
	      this.loader.load({itemHashes: [itemHash], shaderHashes: [shaderHash], game: game}, function tgxLoaded (geometry, materials) {
	        var mesh = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
	        mesh.rotation.x = -90 * Math.PI / 180;
	  
	        self.model = mesh;
	        el.setObject3D('mesh', self.model);
	        el.emit('model-loaded', {format: 'destiny', model: self.model});
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