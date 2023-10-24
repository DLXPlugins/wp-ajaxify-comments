<<<<<<< HEAD
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@wordpress/hooks/build-module/createAddHook.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@wordpress/hooks/build-module/createAddHook.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validateNamespace_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validateNamespace.js */ "./node_modules/@wordpress/hooks/build-module/validateNamespace.js");
/* harmony import */ var _validateHookName_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./validateHookName.js */ "./node_modules/@wordpress/hooks/build-module/validateHookName.js");
/**
 * Internal dependencies
 */



/**
 * @callback AddHook
 *
 * Adds the hook to the appropriate hooks container.
 *
 * @param {string}               hookName      Name of hook to add
 * @param {string}               namespace     The unique namespace identifying the callback in the form `vendor/plugin/function`.
 * @param {import('.').Callback} callback      Function to call when the hook is run
 * @param {number}               [priority=10] Priority of this hook
 */

/**
 * Returns a function which, when invoked, will add a hook.
 *
 * @param {import('.').Hooks}    hooks    Hooks instance.
 * @param {import('.').StoreKey} storeKey
 *
 * @return {AddHook} Function that adds a new hook.
 */
function createAddHook(hooks, storeKey) {
  return function addHook(hookName, namespace, callback, priority = 10) {
    const hooksStore = hooks[storeKey];
    if (!(0,_validateHookName_js__WEBPACK_IMPORTED_MODULE_1__["default"])(hookName)) {
      return;
    }
    if (!(0,_validateNamespace_js__WEBPACK_IMPORTED_MODULE_0__["default"])(namespace)) {
      return;
    }
    if ('function' !== typeof callback) {
      // eslint-disable-next-line no-console
      console.error('The hook callback must be a function.');
      return;
    }

    // Validate numeric priority
    if ('number' !== typeof priority) {
      // eslint-disable-next-line no-console
      console.error('If specified, the hook priority must be a number.');
      return;
    }
    const handler = {
      callback,
      priority,
      namespace
    };
    if (hooksStore[hookName]) {
      // Find the correct insert index of the new hook.
      const handlers = hooksStore[hookName].handlers;

      /** @type {number} */
      let i;
      for (i = handlers.length; i > 0; i--) {
        if (priority >= handlers[i - 1].priority) {
          break;
        }
      }
      if (i === handlers.length) {
        // If append, operate via direct assignment.
        handlers[i] = handler;
      } else {
        // Otherwise, insert before index via splice.
        handlers.splice(i, 0, handler);
      }

      // We may also be currently executing this hook.  If the callback
      // we're adding would come after the current callback, there's no
      // problem; otherwise we need to increase the execution index of
      // any other runs by 1 to account for the added element.
      hooksStore.__current.forEach(hookInfo => {
        if (hookInfo.name === hookName && hookInfo.currentIndex >= i) {
          hookInfo.currentIndex++;
        }
      });
    } else {
      // This is the first hook of its type.
      hooksStore[hookName] = {
        handlers: [handler],
        runs: 0
      };
    }
    if (hookName !== 'hookAdded') {
      hooks.doAction('hookAdded', hookName, namespace, callback, priority);
    }
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createAddHook);
//# sourceMappingURL=createAddHook.js.map

/***/ }),

/***/ "./node_modules/@wordpress/hooks/build-module/createCurrentHook.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@wordpress/hooks/build-module/createCurrentHook.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Returns a function which, when invoked, will return the name of the
 * currently running hook, or `null` if no hook of the given type is currently
 * running.
 *
 * @param {import('.').Hooks}    hooks    Hooks instance.
 * @param {import('.').StoreKey} storeKey
 *
 * @return {() => string | null} Function that returns the current hook name or null.
 */
function createCurrentHook(hooks, storeKey) {
  return function currentHook() {
    var _hooksStore$__current;
    const hooksStore = hooks[storeKey];
    return (_hooksStore$__current = hooksStore.__current[hooksStore.__current.length - 1]?.name) !== null && _hooksStore$__current !== void 0 ? _hooksStore$__current : null;
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createCurrentHook);
//# sourceMappingURL=createCurrentHook.js.map

/***/ }),

/***/ "./node_modules/@wordpress/hooks/build-module/createDidHook.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@wordpress/hooks/build-module/createDidHook.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validateHookName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validateHookName.js */ "./node_modules/@wordpress/hooks/build-module/validateHookName.js");
/**
 * Internal dependencies
 */


/**
 * @callback DidHook
 *
 * Returns the number of times an action has been fired.
 *
 * @param {string} hookName The hook name to check.
 *
 * @return {number | undefined} The number of times the hook has run.
 */

/**
 * Returns a function which, when invoked, will return the number of times a
 * hook has been called.
 *
 * @param {import('.').Hooks}    hooks    Hooks instance.
 * @param {import('.').StoreKey} storeKey
 *
 * @return {DidHook} Function that returns a hook's call count.
 */
function createDidHook(hooks, storeKey) {
  return function didHook(hookName) {
    const hooksStore = hooks[storeKey];
    if (!(0,_validateHookName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(hookName)) {
      return;
    }
    return hooksStore[hookName] && hooksStore[hookName].runs ? hooksStore[hookName].runs : 0;
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createDidHook);
//# sourceMappingURL=createDidHook.js.map

/***/ }),

/***/ "./node_modules/@wordpress/hooks/build-module/createDoingHook.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@wordpress/hooks/build-module/createDoingHook.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * @callback DoingHook
 * Returns whether a hook is currently being executed.
 *
 * @param {string} [hookName] The name of the hook to check for.  If
 *                            omitted, will check for any hook being executed.
 *
 * @return {boolean} Whether the hook is being executed.
 */

/**
 * Returns a function which, when invoked, will return whether a hook is
 * currently being executed.
 *
 * @param {import('.').Hooks}    hooks    Hooks instance.
 * @param {import('.').StoreKey} storeKey
 *
 * @return {DoingHook} Function that returns whether a hook is currently
 *                     being executed.
 */
function createDoingHook(hooks, storeKey) {
  return function doingHook(hookName) {
    const hooksStore = hooks[storeKey];

    // If the hookName was not passed, check for any current hook.
    if ('undefined' === typeof hookName) {
      return 'undefined' !== typeof hooksStore.__current[0];
    }

    // Return the __current hook.
    return hooksStore.__current[0] ? hookName === hooksStore.__current[0].name : false;
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createDoingHook);
//# sourceMappingURL=createDoingHook.js.map

/***/ }),

/***/ "./node_modules/@wordpress/hooks/build-module/createHasHook.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@wordpress/hooks/build-module/createHasHook.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * @callback HasHook
 *
 * Returns whether any handlers are attached for the given hookName and optional namespace.
 *
 * @param {string} hookName    The name of the hook to check for.
 * @param {string} [namespace] Optional. The unique namespace identifying the callback
 *                             in the form `vendor/plugin/function`.
 *
 * @return {boolean} Whether there are handlers that are attached to the given hook.
 */
/**
 * Returns a function which, when invoked, will return whether any handlers are
 * attached to a particular hook.
 *
 * @param {import('.').Hooks}    hooks    Hooks instance.
 * @param {import('.').StoreKey} storeKey
 *
 * @return {HasHook} Function that returns whether any handlers are
 *                   attached to a particular hook and optional namespace.
 */
function createHasHook(hooks, storeKey) {
  return function hasHook(hookName, namespace) {
    const hooksStore = hooks[storeKey];

    // Use the namespace if provided.
    if ('undefined' !== typeof namespace) {
      return hookName in hooksStore && hooksStore[hookName].handlers.some(hook => hook.namespace === namespace);
    }
    return hookName in hooksStore;
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createHasHook);
//# sourceMappingURL=createHasHook.js.map

/***/ }),

/***/ "./node_modules/@wordpress/hooks/build-module/createHooks.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@wordpress/hooks/build-module/createHooks.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _Hooks: () => (/* binding */ _Hooks),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _createAddHook__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createAddHook */ "./node_modules/@wordpress/hooks/build-module/createAddHook.js");
/* harmony import */ var _createRemoveHook__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./createRemoveHook */ "./node_modules/@wordpress/hooks/build-module/createRemoveHook.js");
/* harmony import */ var _createHasHook__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./createHasHook */ "./node_modules/@wordpress/hooks/build-module/createHasHook.js");
/* harmony import */ var _createRunHook__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./createRunHook */ "./node_modules/@wordpress/hooks/build-module/createRunHook.js");
/* harmony import */ var _createCurrentHook__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./createCurrentHook */ "./node_modules/@wordpress/hooks/build-module/createCurrentHook.js");
/* harmony import */ var _createDoingHook__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./createDoingHook */ "./node_modules/@wordpress/hooks/build-module/createDoingHook.js");
/* harmony import */ var _createDidHook__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./createDidHook */ "./node_modules/@wordpress/hooks/build-module/createDidHook.js");
/**
 * Internal dependencies
 */








/**
 * Internal class for constructing hooks. Use `createHooks()` function
 *
 * Note, it is necessary to expose this class to make its type public.
 *
 * @private
 */
class _Hooks {
  constructor() {
    /** @type {import('.').Store} actions */
    this.actions = Object.create(null);
    this.actions.__current = [];

    /** @type {import('.').Store} filters */
    this.filters = Object.create(null);
    this.filters.__current = [];
    this.addAction = (0,_createAddHook__WEBPACK_IMPORTED_MODULE_0__["default"])(this, 'actions');
    this.addFilter = (0,_createAddHook__WEBPACK_IMPORTED_MODULE_0__["default"])(this, 'filters');
    this.removeAction = (0,_createRemoveHook__WEBPACK_IMPORTED_MODULE_1__["default"])(this, 'actions');
    this.removeFilter = (0,_createRemoveHook__WEBPACK_IMPORTED_MODULE_1__["default"])(this, 'filters');
    this.hasAction = (0,_createHasHook__WEBPACK_IMPORTED_MODULE_2__["default"])(this, 'actions');
    this.hasFilter = (0,_createHasHook__WEBPACK_IMPORTED_MODULE_2__["default"])(this, 'filters');
    this.removeAllActions = (0,_createRemoveHook__WEBPACK_IMPORTED_MODULE_1__["default"])(this, 'actions', true);
    this.removeAllFilters = (0,_createRemoveHook__WEBPACK_IMPORTED_MODULE_1__["default"])(this, 'filters', true);
    this.doAction = (0,_createRunHook__WEBPACK_IMPORTED_MODULE_3__["default"])(this, 'actions');
    this.applyFilters = (0,_createRunHook__WEBPACK_IMPORTED_MODULE_3__["default"])(this, 'filters', true);
    this.currentAction = (0,_createCurrentHook__WEBPACK_IMPORTED_MODULE_4__["default"])(this, 'actions');
    this.currentFilter = (0,_createCurrentHook__WEBPACK_IMPORTED_MODULE_4__["default"])(this, 'filters');
    this.doingAction = (0,_createDoingHook__WEBPACK_IMPORTED_MODULE_5__["default"])(this, 'actions');
    this.doingFilter = (0,_createDoingHook__WEBPACK_IMPORTED_MODULE_5__["default"])(this, 'filters');
    this.didAction = (0,_createDidHook__WEBPACK_IMPORTED_MODULE_6__["default"])(this, 'actions');
    this.didFilter = (0,_createDidHook__WEBPACK_IMPORTED_MODULE_6__["default"])(this, 'filters');
  }
}

/** @typedef {_Hooks} Hooks */

/**
 * Returns an instance of the hooks object.
 *
 * @return {Hooks} A Hooks instance.
 */
function createHooks() {
  return new _Hooks();
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createHooks);
//# sourceMappingURL=createHooks.js.map

/***/ }),

/***/ "./node_modules/@wordpress/hooks/build-module/createRemoveHook.js":
/*!************************************************************************!*\
  !*** ./node_modules/@wordpress/hooks/build-module/createRemoveHook.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validateNamespace_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validateNamespace.js */ "./node_modules/@wordpress/hooks/build-module/validateNamespace.js");
/* harmony import */ var _validateHookName_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./validateHookName.js */ "./node_modules/@wordpress/hooks/build-module/validateHookName.js");
/**
 * Internal dependencies
 */



/**
 * @callback RemoveHook
 * Removes the specified callback (or all callbacks) from the hook with a given hookName
 * and namespace.
 *
 * @param {string} hookName  The name of the hook to modify.
 * @param {string} namespace The unique namespace identifying the callback in the
 *                           form `vendor/plugin/function`.
 *
 * @return {number | undefined} The number of callbacks removed.
 */

/**
 * Returns a function which, when invoked, will remove a specified hook or all
 * hooks by the given name.
 *
 * @param {import('.').Hooks}    hooks             Hooks instance.
 * @param {import('.').StoreKey} storeKey
 * @param {boolean}              [removeAll=false] Whether to remove all callbacks for a hookName,
 *                                                 without regard to namespace. Used to create
 *                                                 `removeAll*` functions.
 *
 * @return {RemoveHook} Function that removes hooks.
 */
function createRemoveHook(hooks, storeKey, removeAll = false) {
  return function removeHook(hookName, namespace) {
    const hooksStore = hooks[storeKey];
    if (!(0,_validateHookName_js__WEBPACK_IMPORTED_MODULE_1__["default"])(hookName)) {
      return;
    }
    if (!removeAll && !(0,_validateNamespace_js__WEBPACK_IMPORTED_MODULE_0__["default"])(namespace)) {
      return;
    }

    // Bail if no hooks exist by this name.
    if (!hooksStore[hookName]) {
      return 0;
    }
    let handlersRemoved = 0;
    if (removeAll) {
      handlersRemoved = hooksStore[hookName].handlers.length;
      hooksStore[hookName] = {
        runs: hooksStore[hookName].runs,
        handlers: []
      };
    } else {
      // Try to find the specified callback to remove.
      const handlers = hooksStore[hookName].handlers;
      for (let i = handlers.length - 1; i >= 0; i--) {
        if (handlers[i].namespace === namespace) {
          handlers.splice(i, 1);
          handlersRemoved++;
          // This callback may also be part of a hook that is
          // currently executing.  If the callback we're removing
          // comes after the current callback, there's no problem;
          // otherwise we need to decrease the execution index of any
          // other runs by 1 to account for the removed element.
          hooksStore.__current.forEach(hookInfo => {
            if (hookInfo.name === hookName && hookInfo.currentIndex >= i) {
              hookInfo.currentIndex--;
            }
          });
        }
      }
    }
    if (hookName !== 'hookRemoved') {
      hooks.doAction('hookRemoved', hookName, namespace);
    }
    return handlersRemoved;
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createRemoveHook);
//# sourceMappingURL=createRemoveHook.js.map

/***/ }),

/***/ "./node_modules/@wordpress/hooks/build-module/createRunHook.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@wordpress/hooks/build-module/createRunHook.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Returns a function which, when invoked, will execute all callbacks
 * registered to a hook of the specified type, optionally returning the final
 * value of the call chain.
 *
 * @param {import('.').Hooks}    hooks                  Hooks instance.
 * @param {import('.').StoreKey} storeKey
 * @param {boolean}              [returnFirstArg=false] Whether each hook callback is expected to
 *                                                      return its first argument.
 *
 * @return {(hookName:string, ...args: unknown[]) => undefined|unknown} Function that runs hook callbacks.
 */
function createRunHook(hooks, storeKey, returnFirstArg = false) {
  return function runHooks(hookName, ...args) {
    const hooksStore = hooks[storeKey];
    if (!hooksStore[hookName]) {
      hooksStore[hookName] = {
        handlers: [],
        runs: 0
      };
    }
    hooksStore[hookName].runs++;
    const handlers = hooksStore[hookName].handlers;

    // The following code is stripped from production builds.
    if (true) {
      // Handle any 'all' hooks registered.
      if ('hookAdded' !== hookName && hooksStore.all) {
        handlers.push(...hooksStore.all.handlers);
      }
    }
    if (!handlers || !handlers.length) {
      return returnFirstArg ? args[0] : undefined;
    }
    const hookInfo = {
      name: hookName,
      currentIndex: 0
    };
    hooksStore.__current.push(hookInfo);
    while (hookInfo.currentIndex < handlers.length) {
      const handler = handlers[hookInfo.currentIndex];
      const result = handler.callback.apply(null, args);
      if (returnFirstArg) {
        args[0] = result;
      }
      hookInfo.currentIndex++;
    }
    hooksStore.__current.pop();
    if (returnFirstArg) {
      return args[0];
    }
    return undefined;
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createRunHook);
//# sourceMappingURL=createRunHook.js.map

/***/ }),

/***/ "./node_modules/@wordpress/hooks/build-module/index.js":
/*!*************************************************************!*\
  !*** ./node_modules/@wordpress/hooks/build-module/index.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   actions: () => (/* binding */ actions),
/* harmony export */   addAction: () => (/* binding */ addAction),
/* harmony export */   addFilter: () => (/* binding */ addFilter),
/* harmony export */   applyFilters: () => (/* binding */ applyFilters),
/* harmony export */   createHooks: () => (/* reexport safe */ _createHooks__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   currentAction: () => (/* binding */ currentAction),
/* harmony export */   currentFilter: () => (/* binding */ currentFilter),
/* harmony export */   defaultHooks: () => (/* binding */ defaultHooks),
/* harmony export */   didAction: () => (/* binding */ didAction),
/* harmony export */   didFilter: () => (/* binding */ didFilter),
/* harmony export */   doAction: () => (/* binding */ doAction),
/* harmony export */   doingAction: () => (/* binding */ doingAction),
/* harmony export */   doingFilter: () => (/* binding */ doingFilter),
/* harmony export */   filters: () => (/* binding */ filters),
/* harmony export */   hasAction: () => (/* binding */ hasAction),
/* harmony export */   hasFilter: () => (/* binding */ hasFilter),
/* harmony export */   removeAction: () => (/* binding */ removeAction),
/* harmony export */   removeAllActions: () => (/* binding */ removeAllActions),
/* harmony export */   removeAllFilters: () => (/* binding */ removeAllFilters),
/* harmony export */   removeFilter: () => (/* binding */ removeFilter)
/* harmony export */ });
/* harmony import */ var _createHooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createHooks */ "./node_modules/@wordpress/hooks/build-module/createHooks.js");
/**
 * Internal dependencies
 */


/** @typedef {(...args: any[])=>any} Callback */

/**
 * @typedef Handler
 * @property {Callback} callback  The callback
 * @property {string}   namespace The namespace
 * @property {number}   priority  The namespace
 */

/**
 * @typedef Hook
 * @property {Handler[]} handlers Array of handlers
 * @property {number}    runs     Run counter
 */

/**
 * @typedef Current
 * @property {string} name         Hook name
 * @property {number} currentIndex The index
 */

/**
 * @typedef {Record<string, Hook> & {__current: Current[]}} Store
 */

/**
 * @typedef {'actions' | 'filters'} StoreKey
 */

/**
 * @typedef {import('./createHooks').Hooks} Hooks
 */

const defaultHooks = (0,_createHooks__WEBPACK_IMPORTED_MODULE_0__["default"])();
const {
  addAction,
  addFilter,
  removeAction,
  removeFilter,
  hasAction,
  hasFilter,
  removeAllActions,
  removeAllFilters,
  doAction,
  applyFilters,
  currentAction,
  currentFilter,
  doingAction,
  doingFilter,
  didAction,
  didFilter,
  actions,
  filters
} = defaultHooks;

//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/hooks/build-module/validateHookName.js":
/*!************************************************************************!*\
  !*** ./node_modules/@wordpress/hooks/build-module/validateHookName.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Validate a hookName string.
 *
 * @param {string} hookName The hook name to validate. Should be a non empty string containing
 *                          only numbers, letters, dashes, periods and underscores. Also,
 *                          the hook name cannot begin with `__`.
 *
 * @return {boolean} Whether the hook name is valid.
 */
function validateHookName(hookName) {
  if ('string' !== typeof hookName || '' === hookName) {
    // eslint-disable-next-line no-console
    console.error('The hook name must be a non-empty string.');
    return false;
  }
  if (/^__/.test(hookName)) {
    // eslint-disable-next-line no-console
    console.error('The hook name cannot begin with `__`.');
    return false;
  }
  if (!/^[a-zA-Z][a-zA-Z0-9_.-]*$/.test(hookName)) {
    // eslint-disable-next-line no-console
    console.error('The hook name can only contain numbers, letters, dashes, periods and underscores.');
    return false;
  }
  return true;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validateHookName);
//# sourceMappingURL=validateHookName.js.map

/***/ }),

/***/ "./node_modules/@wordpress/hooks/build-module/validateNamespace.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@wordpress/hooks/build-module/validateNamespace.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Validate a namespace string.
 *
 * @param {string} namespace The namespace to validate - should take the form
 *                           `vendor/plugin/function`.
 *
 * @return {boolean} Whether the namespace is valid.
 */
function validateNamespace(namespace) {
  if ('string' !== typeof namespace || '' === namespace) {
    // eslint-disable-next-line no-console
    console.error('The namespace must be a non-empty string.');
    return false;
  }
  if (!/^[a-zA-Z][a-zA-Z0-9_.\-\/]*$/.test(namespace)) {
    // eslint-disable-next-line no-console
    console.error('The namespace can only contain numbers, letters, dashes, periods, underscores and slashes.');
    return false;
  }
  return true;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validateNamespace);
//# sourceMappingURL=validateNamespace.js.map

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!************************************************!*\
  !*** ./src/js/frontend/wp-ajaxify-comments.js ***!
  \************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/hooks */ "./node_modules/@wordpress/hooks/build-module/index.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }

var wpacHooks = (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__.createHooks)();
WPAC._Options = WPAC._Options || {};
WPAC._BodyRegex = new RegExp('<body[^>]*>((.|\n|\r)*)</body>', 'i');
WPAC._ExtractBody = function (html) {
  try {
    return jQuery('<div>' + WPAC._BodyRegex.exec(html)[1] + '</div>');
  } catch (e) {
    return false;
  }
};
WPAC._TitleRegex = new RegExp('<title[^>]*>(.*?)<\\/title>', 'im');
WPAC._ExtractTitle = function (html) {
  try {
    return WPAC._TitleRegex.exec(html)[1];
  } catch (e) {
    return false;
  }
};
WPAC._ShowMessage = function (message, type) {
  // Determine how to display the loading message.
  var lazyLoadDisplay = WPAC._Options.lazyLoadDisplay;
  var lazyLoadEnabled = WPAC._Options.lazyLoadEnabled;

  // Check if lazy load enabled or not.
  if (lazyLoadEnabled && 'overlay' !== lazyLoadDisplay) {
    return;
  }
  var top = WPAC._Options.popupMarginTop + (jQuery('#wpadminbar').outerHeight() || 0);
  var backgroundColor = WPAC._Options.popupBackgroundColorLoading;
  var textColor = WPAC._Options.popupTextColorLoading;
  if (type == 'error') {
    backgroundColor = WPAC._Options.popupBackgroundColorError;
    textColor = WPAC._Options.popupTextColorError;
  } else if (type == 'success') {
    backgroundColor = WPAC._Options.popupBackgroundColorSuccess;
    textColor = WPAC._Options.popupTextColorSuccess;
  }
  jQuery.blockUI({
    blockMsgClass: "wpac-overlay",
    message: message,
    fadeIn: WPAC._Options.popupFadeIn,
    fadeOut: WPAC._Options.popupFadeOut,
    timeout: type == "loading" ? 0 : WPAC._Options.popupTimeout,
    centerY: false,
    centerX: true,
    showOverlay: type == 'loading' || type == 'loadingPreview',
    css: {
      width: WPAC._Options.popupWidth + '%',
      left: (100 - WPAC._Options.popupWidth) / 2 + '%',
      top: top + 'px',
      border: 'none',
      padding: WPAC._Options.popupPadding + 'px',
      backgroundColor: backgroundColor,
      '-webkit-border-radius': WPAC._Options.popupCornerRadius + 'px',
      '-moz-border-radius': WPAC._Options.popupCornerRadius + 'px',
      'border-radius': WPAC._Options.popupCornerRadius + 'px',
      opacity: WPAC._Options.popupOpacity / 100,
      color: textColor,
      textAlign: WPAC._Options.popupTextAlign,
      cursor: type == 'loading' || type == 'loadingPreview' ? 'wait' : 'default',
      'font-size': WPAC._Options.popupTextFontSize
    },
    overlayCSS: {
      backgroundColor: '#000',
      opacity: 0
    },
    baseZ: WPAC._Options.popupZindex
  });
};
WPAC._DebugErrorShown = false;
WPAC._Debug = function (level, message) {
  if (!WPAC._Options.debug) {
    return;
  }

  // Fix console.log.apply for IE9
  // see http://stackoverflow.com/a/5539378/516472
  if (Function.prototype.call && Function.prototype.call.bind && typeof window.console !== 'undefined' && console && _typeof(console.log) === 'object' && typeof window.console[level].apply === 'undefined') {
    console[level] = Function.prototype.call.bind(console[level], console);
  }
  if (typeof window.console === 'undefined' || typeof window.console[level] === 'undefined' || typeof window.console[level].apply === 'undefined') {
    if (!WPAC._DebugErrorShown) {
      alert('Unfortunately the console object is undefined or is not supported in your browser, debugging WP Ajaxify Comments is disabled! Please use Firebug, Google Chrome or Internet Explorer 9 or above with enabled Developer Tools (F12) for debugging WP Ajaxify Comments.');
    }
    WPAC._DebugErrorShown = true;
    return;
  }
  var args = jQuery.merge(['[WP Ajaxify Comments] ' + message], jQuery.makeArray(arguments).slice(2));
  console[level].apply(console, args);
};
WPAC._DebugSelector = function (elementType, selector, optional) {
  if (!WPAC._Options.debug) {
    return;
  }
  var element = jQuery(selector);
  if (!element.length) {
    WPAC._Debug(optional ? 'info' : 'error', "Search %s (selector: '%s')... Not found", elementType, selector);
  } else {
    WPAC._Debug('info', "Search %s (selector: '%s')... Found: %o", elementType, selector, element);
  }
};
WPAC._AddQueryParamStringToUrl = function (url, param, value) {
  // Get URL object.
  var urlObject = new URL(url);

  // Get query params.
  var queryParams = urlObject.searchParams;

  // Set query param.
  queryParams.set(param, value);

  // Set query params.
  urlObject.search = queryParams.toString();

  // Return URL.
  return urlObject.toString();
};
WPAC._LoadFallbackUrl = function (fallbackUrl) {
  WPAC._ShowMessage(WPAC._Options.textReloadPage, 'loading');
  var url = WPAC._AddQueryParamStringToUrl(fallbackUrl, 'WPACRandom', new Date().getTime());
  WPAC._Debug('info', "Something went wrong. Reloading page (URL: '%s')...", url);
  var reload = function reload() {
    location.href = url;
  };
  if (!WPAC._Options.debug) {
    reload();
  } else {
    WPAC._Debug('info', 'Sleep for 5s to enable analyzing debug messages...');
    window.setTimeout(reload, 5000);
  }
};
WPAC._ScrollToAnchor = function (anchor, updateHash, scrollComplete) {
  scrollComplete = scrollComplete || function () {};
  var anchorElement = jQuery(anchor);
  if (anchorElement.length) {
    WPAC._Debug('info', 'Scroll to anchor element %o (scroll speed: %s ms)...', anchorElement, WPAC._Options.scrollSpeed);
    var animateComplete = function animateComplete() {
      if (updateHash) {
        window.location.hash = anchor;
      }
      scrollComplete();
    };
    var scrollTargetTopOffset = anchorElement.offset().top;
    if (jQuery(window).scrollTop() == scrollTargetTopOffset) {
      animateComplete();
    } else {
      jQuery('html,body').animate({
        scrollTop: scrollTargetTopOffset
      }, {
        duration: WPAC._Options.scrollSpeed,
        complete: animateComplete
      });
    }
    return true;
  }
  WPAC._Debug('error', "Anchor element not found (selector: '%s')", anchor);
  return false;
};
WPAC._UpdateUrl = function (url) {
  if (url.split('#')[0] == window.location.href.split('#')[0]) {
    return;
  }
  if (window.history.replaceState) {
    window.history.replaceState({}, window.document.title, url);
  } else {
    WPAC._Debug('info', 'Browser does not support window.history.replaceState() to update the URL without reloading the page', anchor);
  }
};
WPAC._ReplaceComments = function (data, commentUrl, useFallbackUrl, formData, formFocus, selectorCommentsContainer, selectorCommentForm, selectorRespondContainer, beforeSelectElements, beforeUpdateComments, afterUpdateComments) {
  // Remove any lazy loading messages.
  jQuery('#wpac-lazy-load-content-clone').remove();
  var fallbackUrl = useFallbackUrl ? WPAC._AddQueryParamStringToUrl(commentUrl, 'WPACFallback', '1') : commentUrl;
  var oldCommentsContainer = jQuery(selectorCommentsContainer);
  if (WPAC._Options.lazyLoadIntoElement && 'comments' !== WPAC._Options.lazyLoadInlineDisplayLocation) {
    oldCommentsContainer = jQuery(WPAC._Options.lazyLoadInlineDisplayElement);
  }
  if (!oldCommentsContainer.length) {
    WPAC._Debug('error', "Comment container on current page not found (selector: '%s')", selectorCommentsContainer);
    WPAC._LoadFallbackUrl(fallbackUrl);
    return false;
  }
  // If length is greater than one, there may be greedy selectors.
  if (oldCommentsContainer.length > 1) {
    WPAC._Debug('error', "Comment form on requested page found multiple times (selector: '%s')", oldCommentsContainer);
    oldCommentsContainer = oldCommentsContainer.filter(function () {
      return jQuery(this).children().length > 0 && !jQuery(this).is(':header');
    });
  }
  var extractedBody = WPAC._ExtractBody(data);
  if (extractedBody === false) {
    WPAC._Debug('error', "Unsupported server response, unable to extract body (data: '%s')", data);
    WPAC._LoadFallbackUrl(fallbackUrl);
    return false;
  }

  // Call before select elements.
  if (beforeSelectElements !== '') {
    var beforeSelect = new Function('extractedBody', beforeSelectElements);
    beforeSelect(extractedBody);

    // Set up custom event.
    var beforeSelectEvent = new CustomEvent('wpacBeforeSelectElements', {
      detail: {
        extractedBody: extractedBody
      }
    });
    document.dispatchEvent(beforeSelectEvent);
  }
  var newCommentsContainer = extractedBody.find(selectorCommentsContainer);
  if (!newCommentsContainer.length) {
    WPAC._Debug('error', "Comment container on requested page not found (selector: '%s')", selectorCommentsContainer);
    WPAC._LoadFallbackUrl(fallbackUrl);
    return false;
  }
  if (newCommentsContainer.length > 1) {
    WPAC._Debug('error', "Comment form on requested page found multiple times (selector: '%s')", newCommentsContainer);

    // Find the first comment container that has children and is not a heading.
    newCommentsContainer = newCommentsContainer.filter(function () {
      return jQuery(this).children().length > 0 && !jQuery(this).is(':header');
    });

    // Find respond selector and remove.
    var respondContainer = newCommentsContainer.find(selectorRespondContainer);
    if (respondContainer.length) {
      respondContainer.remove();
    }
  }

  // Call before update comments.
  if ('' !== beforeUpdateComments) {
    var beforeComments = new Function('extractedBody', 'commentUrl', beforeUpdateComments);
    beforeComments(extractedBody, commentUrl);

    // Set up native event handler.
    var beforeCommentsEvent = new CustomEvent('wpacBeforeUpdateComments', {
      detail: {
        newDom: extractedBody,
        commentUrl: commentUrl
      }
    });
    document.dispatchEvent(beforeCommentsEvent);
  }

  // Update title
  var extractedTitle = WPAC._ExtractTitle(data);
  if (extractedBody !== false) {
    // Decode HTML entities (see http://stackoverflow.com/a/5796744)
    document.title = jQuery('<textarea />').html(extractedTitle).text();
  }

  // Empty old container, replace with innards of new container.
  oldCommentsContainer.empty();
  oldCommentsContainer.append(newCommentsContainer.children());
  if (WPAC._Options.commentsEnabled) {
    var form = jQuery(selectorCommentForm);
    if (form.length) {
      // Replace comment form (for spam protection plugin compatibility) if comment form is not nested in comments container
      // If comment form is nested in comments container comment form has already been replaced
      if (!form.parents(selectorCommentsContainer).length) {
        WPAC._Debug('info', 'Replace comment form...');
        var newCommentForm = extractedBody.find(selectorCommentForm);
        if (newCommentForm.length == 0) {
          WPAC._Debug('error', "Comment form on requested page not found (selector: '%s')", selectorCommentForm);
          WPAC._LoadFallbackUrl(fallbackUrl);
          return false;
        }
        form.replaceWith(newCommentForm);
      }
    } else {
      WPAC._Debug('info', 'Try to re-inject comment form...');

      // "Re-inject" comment form, if comment form was removed by updating the comments container; could happen
      // if theme support threaded/nested comments and form tag is not nested in comments container
      // -> Replace WordPress placeholder <div> (#wp-temp-form-div) with respond <div>
      var wpTempFormDiv = jQuery('#wp-temp-form-div');
      if (!wpTempFormDiv.length) {
        WPAC._Debug('error', "WordPress' #wp-temp-form-div container not found", selectorRespondContainer);
        WPAC._LoadFallbackUrl(fallbackUrl);
        return false;
      }
      var newRespondContainer = extractedBody.find(selectorRespondContainer);
      if (!newRespondContainer.length) {
        WPAC._Debug('error', "Respond container on requested page not found (selector: '%s')", selectorRespondContainer);
        WPAC._LoadFallbackUrl(fallbackUrl);
        return false;
      }
      wpTempFormDiv.replaceWith(newRespondContainer);
    }
    if (formData) {
      // Re-inject saved form data
      jQuery.each(formData, function (key, value) {
        var formElement = jQuery("[name='" + value.name + "']", selectorCommentForm);
        if (formElement.length != 1 || formElement.val()) {
          return;
        }
        formElement.val(value.value);
      });
    }
    if (formFocus) {
      // Reset focus
      var formElement = jQuery("[name='" + formFocus + "']", selectorCommentForm);
      if (formElement) {
        formElement.focus();
      }
    }
  }

  // Call after update comments.
  if ('' !== afterUpdateComments) {
    var updateComments = new Function('extractedBody', 'commentUrl', afterUpdateComments);
    updateComments(extractedBody, commentUrl);

    // Set up native event handler.
    var updateCommentsEvent = new CustomEvent('wpacAfterUpdateComments', {
      detail: {
        newDom: extractedBody,
        commentUrl: commentUrl
      }
    });
    document.dispatchEvent(updateCommentsEvent);
  }
  return true;
};
WPAC._TestCrossDomainScripting = function (url) {
  if (url.indexOf('http') != 0) {
    return false;
  }
  var domain = window.location.protocol + '//' + window.location.host;
  return url.indexOf(domain) != 0;
};
WPAC._TestFallbackUrl = function (url) {
  // Get URL object.
  var urlObject = new URL(url);

  // Get query params.
  var queryParams = urlObject.searchParams;
  var fallbackParam = queryParams.get('WPACFallback');
  var randomParam = queryParams.get('WPACRandom');
  return fallbackParam && randomParam;
};
WPAC.AttachForm = function (options) {
  // Set default options
  options = jQuery.extend({
    selectorCommentForm: WPAC._Options.selectorCommentForm,
    selectorCommentPagingLinks: WPAC._Options.selectorCommentPagingLinks,
    beforeSelectElements: WPACCallbacks.beforeSelectElements,
    beforeSubmitComment: WPACCallbacks.beforeSubmitComment,
    afterPostComment: WPACCallbacks.afterPostComment,
    selectorCommentsContainer: WPAC._Options.selectorCommentsContainer,
    selectorRespondContainer: WPAC._Options.selectorRespondContainer,
    beforeUpdateComments: WPACCallbacks.beforeUpdateComments,
    afterUpdateComments: WPACCallbacks.afterUpdateComments,
    scrollToAnchor: !WPAC._Options.disableScrollToAnchor,
    updateUrl: !WPAC._Options.disableUrlUpdate,
    selectorCommentLinks: WPAC._Options.selectorCommentLinks
  }, options || {});

  /**
   * Filter the options for Ajaxify Comments.
   *
   * @param { Object } options Options for Ajaxify Comments.
   * @param { string } url     The URL to load.
   * @param { string } caller  What function called the filter.
   */
  options = wpacHooks.applyFilters('wpacJSOptions', options, '', 'AttachForm');
  if (WPAC._Options.debug && WPAC._Options.commentsEnabled) {
    WPAC._Debug('info', 'Attach form...');
    WPAC._DebugSelector('comment form', options.selectorCommentForm);
    WPAC._DebugSelector('comments container', options.selectorCommentsContainer);
    WPAC._DebugSelector('respond container', options.selectorRespondContainer);
    WPAC._DebugSelector('comment paging links', options.selectorCommentPagingLinks, true);
    WPAC._DebugSelector('comment links', options.selectorCommentLinks, true);
  }

  // Try before submit comment. Using new function is not ideal here, but safer than exec.
  if ('' !== WPACCallbacks.beforeSelectElements) {
    var beforeSelect = new Function('dom', WPACCallbacks.beforeSelectElements);
    beforeSelect(jQuery(document));

    // Set up native event handler.
    var beforeSelectEvent = new CustomEvent('wpacBeforeSelectElements', {
      detail: {
        dom: jQuery(document)
      }
    });
    document.dispatchEvent(beforeSelectEvent);
  }

  // Get addHandler method
  if (jQuery(document).on) {
    // jQuery 1.7+
    var addHandler = function addHandler(event, selector, handler) {
      jQuery(document).on(event, selector, handler);
    };
  } else if (jQuery(document).delegate) {
    // jQuery 1.4.3+
    var addHandler = function addHandler(event, selector, handler) {
      jQuery(document).delegate(selector, event, handler);
    };
  } else {
    // jQuery 1.3+
    var addHandler = function addHandler(event, selector, handler) {
      jQuery(selector).live(event, handler);
    };
  }

  // Handle paging link clicks
  var pagingClickHandler = function pagingClickHandler(event) {
    var href = jQuery(this).attr('href');
    if (href) {
      event.preventDefault();
      WPAC.LoadComments(href, {
        selectorCommentForm: options.selectorCommentForm,
        selectorCommentsContainer: options.selectorCommentsContainer,
        selectorRespondContainer: options.selectorRespondContainer,
        beforeSelectElements: options.beforeSelectElements,
        beforeUpdateComments: options.beforeUpdateComments,
        afterUpdateComments: options.afterUpdateComments
      });
    }
  };
  addHandler('click', options.selectorCommentPagingLinks, pagingClickHandler);

  // Handle comment link clicks
  var linkClickHandler = function linkClickHandler(event) {
    var element = jQuery(this);
    if (element.is(options.selectorCommentPagingLinks)) {
      return;
    } // skip if paging link was clicked
    var href = element.attr('href');
    // To use new URL.
    var anchor = new URL(href).hash;
    if (jQuery(anchor).length > 0) {
      if (options.updateUrl) {
        WPAC._UpdateUrl(href);
      }
      WPAC._ScrollToAnchor(anchor, options.updateUrl);
      event.preventDefault();
    }
  };
  addHandler('click', options.selectorCommentLinks, linkClickHandler);
  if (!WPAC._Options.commentsEnabled) {
    return;
  }

  // Handle form submit
  var formSubmitHandler = function formSubmitHandler(event) {
    var form = jQuery(this);

    // Try before submit comment. Using new function is not ideal here, but safer than exec.
    if (WPACCallbacks.beforeSubmitComment !== '') {
      var beforeSubmit = new Function('dom', WPACCallbacks.beforeSubmitComment);
      beforeSubmit(jQuery(document));

      // Set up native event handler.
      var beforeSubmitEvent = new CustomEvent('wpacBeforeSubmitComment', {
        detail: {
          dom: jQuery(document)
        }
      });
      document.dispatchEvent(beforeSubmitEvent);
    }
    var submitUrl = form.attr('action');

    // Cancel AJAX request if cross-domain scripting is detected
    if (WPAC._TestCrossDomainScripting(submitUrl)) {
      if (WPAC._Options.debug && !form.data('submitCrossDomain')) {
        WPAC._Debug('error', "Cross-domain scripting detected (submit url: '%s'), cancel AJAX request", submitUrl);
        WPAC._Debug('info', 'Sleep for 5s to enable analyzing debug messages...');
        event.preventDefault();
        form.data('submitCrossDomain', true);
        window.setTimeout(function () {
          jQuery('#submit', form).remove();
          form.submit();
        }, 5000);
      }
      return;
    }

    // Stop default event handling
    event.preventDefault();

    // Test if form is already submitting
    if (form.data('WPAC_SUBMITTING')) {
      WPAC._Debug('info', 'Cancel submit, form is already submitting (Form: %o)', form);
      return;
    }
    form.data('WPAC_SUBMITTING', true);

    // Show loading info
    WPAC._ShowMessage(WPAC._Options.textPostComment, 'loading');
    var handleErrorResponse = function handleErrorResponse(data) {
      WPAC._Debug('info', 'Comment has not been posted');
      WPAC._Debug('info', "Try to extract error message (selector: '%s')...", WPAC._Options.selectorErrorContainer);

      // Extract error message
      var extractedBody = WPAC._ExtractBody(data);
      if (extractedBody !== false) {
        var errorMessage = extractedBody.find(WPAC._Options.selectorErrorContainer);
        if (errorMessage.length) {
          errorMessage = errorMessage.html();
          WPAC._Debug('info', "Error message '%s' successfully extracted", errorMessage);
          WPAC._ShowMessage(errorMessage, 'error');
          return;
        }
      }
      WPAC._Debug('error', "Error message could not be extracted, use error message '%s'.", WPAC._Options.textUnknownError);
      WPAC._ShowMessage(WPAC._Options.textUnknownError, 'error');
    };
    var request = jQuery.ajax({
      url: submitUrl,
      type: 'POST',
      data: form.serialize(),
      beforeSend: function beforeSend(xhr) {
        xhr.setRequestHeader('X-WPAC-REQUEST', '1');
      },
      complete: function complete(xhr, textStatus) {
        form.removeData('WPAC_SUBMITTING', true);
      },
      success: function success(data) {
        // Test error state (WordPress >=4.1 does not return 500 status code if posting comment failed)
        if (request.getResponseHeader('X-WPAC-ERROR')) {
          WPAC._Debug('info', 'Found error state X-WPAC-ERROR header.', commentUrl);
          handleErrorResponse(data);
          return;
        }
        WPAC._Debug('info', 'Comment has been posted');

        // Get info from response header
        var commentUrl = request.getResponseHeader('X-WPAC-URL');
        WPAC._Debug('info', "Found comment URL '%s' in X-WPAC-URL header.", commentUrl);
        var unapproved = request.getResponseHeader('X-WPAC-UNAPPROVED');
        WPAC._Debug('info', "Found unapproved state '%s' in X-WPAC-UNAPPROVED", unapproved);

        // Try afterPostComment submit comment. Using new function is not ideal here, but safer than exec.
        if (WPACCallbacks.afterPostComment !== '') {
          var afterComment = new Function('commentUrl', 'unapproved', afterPostComment);
          afterComment(commentUrl, unapproved == '1');

          // Set up native event handler.
          var afterCommentEvent = new CustomEvent('wpacAfterPostComment', {
            detail: {
              commentUrl: commentUrl,
              unapproved: unapproved == '1'
            }
          });
          document.dispatchEvent(afterCommentEvent);
        }

        // Show success message
        WPAC._ShowMessage(unapproved == '1' ? WPAC._Options.textPostedUnapproved : WPAC._Options.textPosted, 'success');

        /**
         * Sunshine Confetti Plugin integration.
         *
         * @since 3.0.0
         *
         * @see https://wordpress.org/plugins/confetti/
         */
        if (typeof window.wps_launch_confetti_cannon !== 'undefined') {
          window.wps_launch_confetti_cannon();
        }

        // Replace comments (and return if replacing failed)
        if (!WPAC._ReplaceComments(data, commentUrl, false, {}, '', options.selectorCommentsContainer, options.selectorCommentForm, options.selectorRespondContainer, options.beforeSelectElements, options.beforeUpdateComments, options.afterUpdateComments)) {
          return;
        }

        // Smooth scroll to comment url and update browser url
        if (commentUrl) {
          if (options.updateUrl) {
            WPAC._UpdateUrl(commentUrl);
          }
          if (options.scrollToAnchor) {
            var _anchor = commentUrl.indexOf('#') >= 0 ? commentUrl.substr(commentUrl.indexOf('#')) : null;
            if (_anchor) {
              WPAC._Debug('info', "Anchor '%s' extracted from comment URL '%s'", _anchor, commentUrl);
              WPAC._ScrollToAnchor(_anchor, options.updateUrl);
            }
          }
        }
      },
      error: function error(jqXhr, textStatus, errorThrown) {
        // Test if loading comment url failed (due to cross site scripting error)
        if (jqXhr.status === 0 && jqXhr.responseText === '') {
          WPAC._Debug('error', 'Comment seems to be posted, but loading comment update failed.');
          WPAC._LoadFallbackUrl(WPAC._AddQueryParamStringToUrl(window.location.href, 'WPACFallback', '1'));
          return;
        }
        handleErrorResponse(jqXhr.responseText);
      }
    });
  };
  addHandler('submit', options.selectorCommentForm, formSubmitHandler);
};
WPAC._Initialized = false;
WPAC.Init = function () {
  // Test if plugin already has been initialized
  if (WPAC._Initialized) {
    WPAC._Debug('info', 'Abort initialization (plugin already initialized)');
    return false;
  }
  WPAC._Initialized = true;

  // Assert that environment is set up correctly
  if (!WPAC._Options || !WPACCallbacks) {
    WPAC._Debug('error', 'Something unexpected happened, initialization failed. Please try to reinstall the plugin.');
    return false;
  }

  // Debug infos
  WPAC._Debug('info', 'Initializing version %s', WPAC._Options.version);

  // Debug infos
  if (WPAC._Options.debug) {
    if (!jQuery || !jQuery.fn || !jQuery.fn.jquery) {
      WPAC._Debug('error', 'jQuery not found, abort initialization. Please try to reinstall the plugin.');
      return false;
    }
    WPAC._Debug('info', 'Found jQuery %s', jQuery.fn.jquery);
    if (!jQuery.blockUI || !jQuery.blockUI.version) {
      WPAC._Debug('error', 'jQuery blockUI not found, abort initialization. Please try to reinstall the plugin.');
      return false;
    }
    WPAC._Debug('info', 'Found jQuery blockUI %s', jQuery.blockUI.version);
    if (!jQuery.idleTimer) {
      WPAC._Debug('error', 'jQuery Idle Timer plugin not found, abort initialization. Please try to reinstall the plugin.');
      return false;
    }
    WPAC._Debug('info', 'Found jQuery Idle Timer plugin');
  }
  if (WPAC._Options.selectorPostContainer) {
    WPAC._Debug('info', "Multiple comment form support enabled (selector: '%s')", WPAC._Options.selectorPostContainer);
    jQuery(WPAC._Options.selectorPostContainer).each(function (i, e) {
      var id = jQuery(e).attr('id');
      if (!id) {
        WPAC._Debug('info', 'Skip post container element %o (ID not defined)', e);
        return;
      }
      WPAC.AttachForm({
        selectorCommentForm: '#' + id + ' ' + WPAC._Options.selectorCommentForm,
        selectorCommentPagingLinks: '#' + id + ' ' + WPAC._Options.selectorCommentPagingLinks,
        selectorCommentsContainer: '#' + id + ' ' + WPAC._Options.selectorCommentsContainer,
        selectorRespondContainer: '#' + id + ' ' + WPAC._Options.selectorRespondContainer
      });
    });
  } else {
    WPAC.AttachForm();
  }

  // Set up loading preview handlers.
  jQuery('#wp-admin-bar-wpac-menu-helper-preview-overlay-loading a').on('click', function (e) {
    e.preventDefault();
    WPAC._ShowMessage('This is the loading preview...', 'loadingPreview');
  });

  // Set up success preview handlers.
  jQuery('#wp-admin-bar-wpac-menu-helper-preview-overlay-success a').on('click', function (e) {
    e.preventDefault();
    WPAC._ShowMessage('This is a success message', 'success');
  });

  // Set up error preview handlers.
  jQuery('#wp-admin-bar-wpac-menu-helper-preview-overlay-error a').on('click', function (e) {
    e.preventDefault();
    WPAC._ShowMessage('This is an error message', 'error');
  });

  // Set up idle timer
  if (WPAC._Options.commentsEnabled && WPAC._Options.autoUpdateIdleTime > 0) {
    WPAC._Debug('info', 'Auto updating comments enabled (idle time: %s)', WPAC._Options.autoUpdateIdleTime);
    WPAC._InitIdleTimer();
  }
  WPAC._Debug('info', 'Initialization completed');
  return true;
};
WPAC._OnIdle = function () {
  WPAC.RefreshComments({
    success: WPAC._InitIdleTimer,
    scrollToAnchor: false
  });
};
WPAC._InitIdleTimer = function () {
  if (WPAC._TestFallbackUrl(location.href)) {
    WPAC._Debug('error', "Fallback URL was detected (url: '%s'), cancel init idle timer", location.href);
    return;
  }
  jQuery(document).idleTimer('destroy');
  jQuery(document).idleTimer(WPAC._Options.autoUpdateIdleTime);
  jQuery(document).on('idle.idleTimer', WPAC._OnIdle);
};

/**
 * Refresh the comments by Ajaxify Comments.
 * @param { Object } options Optiosn for Ajaxify Comments.
 * @return comments.
 */
WPAC.RefreshComments = function (options) {
  var url = location.href;
  if (WPAC._TestFallbackUrl(location.href)) {
    WPAC._Debug('error', "Fallback URL was detected (url: '%s'), cancel AJAX request", url);
    return false;
  }

  /**
   * Filter the options for Ajaxify Comments.
   *
   * @param { Object } options Options for Ajaxify Comments.
   * @param { string } url     The URL to load.
   * @param { string } caller  What function called the filter.
   */
  options = wpacHooks.applyFilters('wpacJSOptions', options, url, 'RefreshComments');

  // Users can pass options as first parameter to override selectors.
  return WPAC.LoadComments(url, options);
};
WPAC.LoadComments = function (url, options) {
  // Cancel AJAX request if cross-domain scripting is detected
  if (WPAC._TestCrossDomainScripting(url)) {
    WPAC._Debug('error', "Cross-domain scripting detected (url: '%s'), cancel AJAX request", url);
    return false;
  }

  // Convert boolean parameter (used in version <0.14.0)
  if (typeof options === 'boolean') {
    options = {
      scrollToAnchor: options
    };
  }

  // Set default options
  options = jQuery.extend({
    scrollToAnchor: !WPAC._Options.disableScrollToAnchor,
    showLoadingInfo: true,
    updateUrl: !WPAC._Options.disableUrlUpdate,
    success: function success() {},
    selectorCommentForm: WPAC._Options.selectorCommentForm,
    selectorCommentsContainer: WPAC._Options.selectorCommentsContainer,
    selectorRespondContainer: WPAC._Options.selectorRespondContainer,
    disableCache: WPAC._Options.disableCache,
    beforeSelectElements: WPACCallbacks.beforeSelectElements,
    beforeUpdateComments: WPACCallbacks.beforeUpdateComments,
    afterUpdateComments: WPACCallbacks.afterUpdateComments
  }, options || {});

  /**
   * Filter the options for Ajaxify Comments.
   *
   * @param { Object } options Options for Ajaxify Comments.
   * @param { string } url     The URL to load.
   * @param { string } caller  What function called the filter.
   */
  options = wpacHooks.applyFilters('wpacJSOptions', options, url, 'LoadComments');

  // Save form data and focus
  var formData = jQuery(options.selectorCommentForm).serializeArray();
  var formFocus = document.activeElement ? jQuery("[name='" + document.activeElement.name + "']", options.selectorCommentForm).attr('name') : '';

  // Get query strings form URL (ajaxifyLazyLoadEnable, nonce, post_id).
  var urlObject = new URL(url);
  var queryParams = urlObject.searchParams;
  var ajaxifyLazyLoadEnable = queryParams.get('ajaxifyLazyLoadEnable');
  var nonce = queryParams.get('nonce');
  var postId = queryParams.get('post_id');

  // Add to URL.
  url = WPAC._AddQueryParamStringToUrl(url, 'ajaxifyLazyLoadEnable', ajaxifyLazyLoadEnable);
  url = WPAC._AddQueryParamStringToUrl(url, 'nonce', nonce);
  url = WPAC._AddQueryParamStringToUrl(url, 'post_id', postId);
  if (options.disableCache) {
    url = WPAC._AddQueryParamStringToUrl(url, 'WPACRandom', new Date().getTime());
  }
  var request = jQuery.ajax({
    url: url,
    type: 'GET',
    beforeSend: function beforeSend(xhr) {
      xhr.setRequestHeader('X-WPAC-REQUEST', '1');
    },
    success: function success(data) {
      try {
        console.log(data);
        if (!WPAC._ReplaceComments(data, url, true, formData, formFocus, options.selectorCommentsContainer, options.selectorCommentForm, options.selectorRespondContainer, options.beforeSelectElements, options.beforeUpdateComments, options.afterUpdateComments)) {
          return;
        }
        if (options.updateUrl) {
          WPAC._UpdateUrl(url);
        }

        // Scroll to anchor
        var waitForScrollToAnchor = false;
        if (options.scrollToAnchor) {
          var _anchor2 = url.indexOf('#') >= 0 ? url.substr(url.indexOf('#')) : null;
          if (_anchor2) {
            WPAC._Debug('info', "Anchor '%s' extracted from url", _anchor2);
            if (WPAC._ScrollToAnchor(_anchor2, options.updateUrl, function () {
              options.success();
            })) {
              waitForScrollToAnchor = true;
            }
          }
        }
      } catch (e) {
        WPAC._Debug('error', 'Something went wrong while refreshing comments: %s', e);
      }

      // Unblock UI
      jQuery.unblockUI();
      if (!waitForScrollToAnchor) {
        options.success();
      }
    },
    error: function error() {
      WPAC._LoadFallbackUrl(WPAC._AddQueryParamStringToUrl(window.location.href, 'WPACFallback', '1'));
    }
  });
  return true;
};
jQuery(function () {
  var initSuccesful = WPAC.Init();
  if (true === WPAC._Options.lazyLoadEnabled) {
    if (!initSuccesful) {
      WPAC._LoadFallbackUrl(WPAC._AddQueryParamStringToUrl(window.location.href, 'WPACFallback', '1'));
      return;
    }
    var triggerType = WPAC._Options.lazyLoadTrigger;
    var lazyLoadTrigger = WPAC._Options.lazyLoadTrigger;
    var lazyLoadScrollOffset = parseInt(WPAC._Options.lazyLoadTriggerScrollOffset);
    var lazyLoadElement = WPAC._Options.lazyLoadTriggerElement;
    var lazyLoadInlineType = WPAC._Options.lazyLoadInlineLoadingType;
    var lazyLoadOffset = parseInt(WPAC._Options.lazyLoadTriggerOffset);
    if (lazyLoadOffset === 0) {
      lazyLoadOffset = '100%';
    }

    // Determine where to load the lazy loading message (if not overlay).
    var isLazyLoadInline = 'inline' === WPAC._Options.lazyLoadDisplay;
    var lazyloadInlineDisplayLocation = WPAC._Options.lazyLoadInlineDisplayLocation; /* can be comments, element */

    // If inline, let's move the loader.
    if (WPAC._Options.lazyLoadIntoElement) {
      var lazyloadInlineDisplayElement = WPAC._Options.lazyLoadInlineDisplayElement;
      if ('comments' === lazyloadInlineDisplayLocation) {
        lazyloadInlineDisplayElement = WPAC._Options.selectorCommentsContainer;
      }
      var lazyLoadContent = document.querySelector('#wpac-lazy-load-content'); // hardcoded selector.
      if (null !== lazyLoadContent) {
        // Clone it without ref.
        var lazyLoadContentClone = jQuery.clone(lazyLoadContent);
        lazyLoadContentClone.id = 'wpac-lazy-load-content-clone';

        // Add display block and opacity 1.
        lazyLoadContentClone.style.display = 'block';
        lazyLoadContentClone.style.opacity = '1';
        lazyLoadContentClone.style.visibility = 'visible';

        // Determine trigger if button.
        if ('button' === lazyLoadInlineType) {
          // This will make it so that a button must be clicked to load comments.
          lazyLoadTrigger = 'external';
        }

        // Display the loader.
        if ('comments' === lazyloadInlineDisplayLocation) {
          var commentsContainer = jQuery(lazyloadInlineDisplayElement);
          if (commentsContainer) {
            commentsContainer.prepend(lazyLoadContentClone);
          } else {
            WPAC._Debug('error', 'Comments container not found for lazy loading when reaching the comments section.');
          }
        } else if ('element' === lazyloadInlineDisplayLocation) {
          var domElement = jQuery(lazyloadInlineDisplayElement);
          if (domElement) {
            // add to top of comments element.
            jQuery(domElement).prepend(lazyLoadContentClone);

            // Remove style attribute.
            jQuery(domElement).removeAttr('style');
          } else {
            WPAC._Debug('error', 'Element not found for lazy loading when reaching the element.');
          }
        }

        // Init lazy loading button (if any).
        var lazyLoadButton = document.querySelector('.ajaxify-comments-loading-button-wrapper button');
        if (null !== lazyLoadButton) {
          lazyLoadButton.addEventListener('click', function (e) {
            e.preventDefault();
            lazyLoadButton.innerHTML = WPAC._Options.lazyLoadInlineLoadingButtonLabelLoading;
            WPAC.RefreshComments();
          });
        }
      }
    }

    /**
     * Filter the offset for lazy loading.
     *
     * @see: http://imakewebthings.com/waypoints/api/offset-option/
     *
     * @param { string } lazyLoadOffset       Offset for lazy loading.
     * @param { string } lazyLoadTrigger      The trigger type for lazy loading.
     * @param { number } lazyLoadScrollOffset The scroll offset for lazy loading.
     * @param { string } lazyLoadElement      The element for lazy loading.
     */
    lazyLoadOffset = wpacHooks.applyFilters('wpacLazyLoadOffset', lazyLoadOffset, lazyLoadTrigger, lazyLoadScrollOffset, lazyLoadElement);
    WPAC._Debug('info', "Loading comments asynchronously with secondary AJAX request (trigger: '%s')", lazyLoadTrigger);
    if (window.location.hash) {
      var regex = /^#comment-[0-9]+$/;
      if (regex.test(window.location.hash)) {
        WPAC._Debug('info', "Comment anchor in URL detected, force loading comments on DomReady (hash: '%s')", window.location.hash);
        lazyLoadTrigger = 'domready';
      }
    }
    switch (lazyLoadTrigger) {
      case 'external':
        WPAC._Debug('info', 'Lazy loading: Waiting on external trigger for lazy loading comments.', window.location.hash);
        break;
      case 'comments':
        var _commentsContainer = document.querySelector(WPAC._Options.selectorCommentsContainer);
        if (null !== _commentsContainer) {
          WPAC._Debug('info', 'Lazy loading: Waiting on comments to scroll into view for lazy loading.', window.location.hash);
          jQuery(_commentsContainer).waypoint(function (direction) {
            this.destroy();
            WPAC._ShowMessage(WPAC._Options.textRefreshComments, 'loading');
            WPAC.RefreshComments();
          }, {
            offset: lazyLoadScrollOffset ? lazyLoadScrollOffset : '100%'
          });
        } else {
          WPAC._Debug('error', 'Comments container not found for lazy loading when reaching the comments section.');
        }
        break;
      case 'element':
        var _domElement = document.querySelector(lazyLoadElement);
        if (null !== _domElement) {
          WPAC._Debug('info', 'Lazy loading: Waiting on element to scroll into view for lazy loading.', window.location.hash);
          jQuery(_domElement).waypoint(function (direction) {
            this.destroy();
            WPAC._ShowMessage(WPAC._Options.textRefreshComments, 'loading');
            WPAC.RefreshComments();
          }, {
            offset: lazyLoadScrollOffset ? lazyLoadScrollOffset : '100%'
          });
        } else {
          WPAC._Debug('error', 'Element not found for lazy loading when reaching the element.');
        }
        break;
      case 'domready':
        WPAC._Debug('info', 'Lazy loading: Waiting on Dom to be ready for lazy loading.', window.location.hash);
        WPAC.RefreshComments({
          scrollToAnchor: true
        }); // force scroll to anchor.
        break;
      case 'scroll':
        WPAC._Debug('info', 'Lazy loading: Waiting on Scroll Into View.', window.location.hash);

        // Get the body tag and calculate offset.
        var body = document.querySelector('body');
        jQuery(body).waypoint(function (direction) {
          this.destroy();
          WPAC._ShowMessage(WPAC._Options.textRefreshComments, 'loading');
          WPAC.RefreshComments();
        }, {
          offset: lazyLoadScrollOffset * -1
        });
    }
  }
});
function wpac_init() {
  WPAC._Debug('info', 'wpac_init() is deprecated, please use WPAC.Init()');
  WPAC.Init();
}
})();

/******/ })()
;
//# sourceMappingURL=wpac-frontend-wp-ajaxify-comments.js.map
=======
(()=>{function e(o){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},e(o)}WPAC._Options=WPAC._Options||{},WPAC._BodyRegex=new RegExp("<body[^>]*>((.|\n|\r)*)</body>","i"),WPAC._ExtractBody=function(e){try{return jQuery("<div>"+WPAC._BodyRegex.exec(e)[1]+"</div>")}catch(e){return!1}},WPAC._TitleRegex=new RegExp("<title[^>]*>(.*?)<\\/title>","im"),WPAC._ExtractTitle=function(e){try{return WPAC._TitleRegex.exec(e)[1]}catch(e){return!1}},WPAC._ShowMessage=function(e,o){var t=WPAC._Options.popupMarginTop+(jQuery("#wpadminbar").outerHeight()||0),n=WPAC._Options.popupBackgroundColorLoading,r=WPAC._Options.popupTextColorLoading;"error"==o?(n=WPAC._Options.popupBackgroundColorError,r=WPAC._Options.popupTextColorError):"success"==o&&(n=WPAC._Options.popupBackgroundColorSuccess,r=WPAC._Options.popupTextColorSuccess),jQuery.blockUI({blockMsgClass:"wpac-overlay",message:e,fadeIn:WPAC._Options.popupFadeIn,fadeOut:WPAC._Options.popupFadeOut,timeout:"loading"==o?0:WPAC._Options.popupTimeout,centerY:!1,centerX:!0,showOverlay:"loading"==o||"loadingPreview"==o,css:{width:WPAC._Options.popupWidth+"%",left:(100-WPAC._Options.popupWidth)/2+"%",top:t+"px",border:"none",padding:WPAC._Options.popupPadding+"px",backgroundColor:n,"-webkit-border-radius":WPAC._Options.popupCornerRadius+"px","-moz-border-radius":WPAC._Options.popupCornerRadius+"px","border-radius":WPAC._Options.popupCornerRadius+"px",opacity:WPAC._Options.popupOpacity/100,color:r,textAlign:WPAC._Options.popupTextAlign,cursor:"loading"==o||"loadingPreview"==o?"wait":"default","font-size":WPAC._Options.popupTextFontSize},overlayCSS:{backgroundColor:"#000",opacity:0},baseZ:WPAC._Options.popupZindex})},WPAC._DebugErrorShown=!1,WPAC._Debug=function(o,t){if(WPAC._Options.debug){if(Function.prototype.call&&Function.prototype.call.bind&&void 0!==window.console&&console&&"object"==e(console.log)&&void 0===window.console[o].apply&&(console[o]=Function.prototype.call.bind(console[o],console)),void 0===window.console||void 0===window.console[o]||void 0===window.console[o].apply)return WPAC._DebugErrorShown||alert("Unfortunately the console object is undefined or is not supported in your browser, debugging WP Ajaxify Comments is disabled! Please use Firebug, Google Chrome or Internet Explorer 9 or above with enabled Developer Tools (F12) for debugging WP Ajaxify Comments."),void(WPAC._DebugErrorShown=!0);var n=jQuery.merge(["[WP Ajaxify Comments] "+t],jQuery.makeArray(arguments).slice(2));console[o].apply(console,n)}},WPAC._DebugSelector=function(e,o,t){if(WPAC._Options.debug){var n=jQuery(o);n.length?WPAC._Debug("info","Search %s (selector: '%s')... Found: %o",e,o,n):WPAC._Debug(t?"info":"error","Search %s (selector: '%s')... Not found",e,o)}},WPAC._AddQueryParamStringToUrl=function(e,o,t){var n=new URL(e),r=n.searchParams;return r.set(o,t),n.search=r.toString(),n.toString()},WPAC._LoadFallbackUrl=function(e){WPAC._ShowMessage(WPAC._Options.textReloadPage,"loading");var o=WPAC._AddQueryParamStringToUrl(e,"WPACRandom",(new Date).getTime());WPAC._Debug("info","Something went wrong. Reloading page (URL: '%s')...",o);var t=function(){location.href=o};WPAC._Options.debug?(WPAC._Debug("info","Sleep for 5s to enable analyzing debug messages..."),window.setTimeout(t,5e3)):t()},WPAC._ScrollToAnchor=function(e,o,t){t=t||function(){};var n=jQuery(e);if(n.length){WPAC._Debug("info","Scroll to anchor element %o (scroll speed: %s ms)...",n,WPAC._Options.scrollSpeed);var r=function(){o&&(window.location.hash=e),t()},i=n.offset().top;return jQuery(window).scrollTop()==i?r():jQuery("html,body").animate({scrollTop:i},{duration:WPAC._Options.scrollSpeed,complete:r}),!0}return WPAC._Debug("error","Anchor element not found (selector: '%s')",e),!1},WPAC._UpdateUrl=function(e){e.split("#")[0]!=window.location.href.split("#")[0]&&(window.history.replaceState?window.history.replaceState({},window.document.title,e):WPAC._Debug("info","Browser does not support window.history.replaceState() to update the URL without reloading the page",anchor))},WPAC._ReplaceComments=function(e,o,t,n,r,i,a,s,l,c,u){var m=t?WPAC._AddQueryParamStringToUrl(o,"WPACFallback","1"):o,C=jQuery(i);if(!C.length)return WPAC._Debug("error","Comment container on current page not found (selector: '%s')",i),WPAC._LoadFallbackUrl(m),!1;C.length>1&&(WPAC._Debug("error","Comment form on requested page found multiple times (selector: '%s')",C),C=C.filter((function(){return jQuery(this).children().length>0&&!jQuery(this).is(":header")})));var d=WPAC._ExtractBody(e);if(!1===d)return WPAC._Debug("error","Unsupported server response, unable to extract body (data: '%s')",e),WPAC._LoadFallbackUrl(m),!1;if(""!==l){new Function("extractedBody",l)(d);var p=new CustomEvent("wpacBeforeSelectElements",{detail:{extractedBody:d}});document.dispatchEvent(p)}var A=d.find(i);if(!A.length)return WPAC._Debug("error","Comment container on requested page not found (selector: '%s')",i),WPAC._LoadFallbackUrl(m),!1;if(A.length>1&&(WPAC._Debug("error","Comment form on requested page found multiple times (selector: '%s')",A),A=A.filter((function(){return jQuery(this).children().length>0&&!jQuery(this).is(":header")}))),""!==c){new Function("extractedBody","commentUrl",c)(d,o);var P=new CustomEvent("wpacBeforeUpdateComments",{detail:{newDom:d,commentUrl:o}});document.dispatchEvent(P)}var f=WPAC._ExtractTitle(e);if(!1!==d&&(document.title=jQuery("<textarea />").html(f).text()),C.replaceWith(A),WPAC._Options.commentsEnabled){var W=jQuery(a);if(W.length){if(!W.parents(i).length){WPAC._Debug("info","Replace comment form...");var g=d.find(a);if(0==g.length)return WPAC._Debug("error","Comment form on requested page not found (selector: '%s')",a),WPAC._LoadFallbackUrl(m),!1;W.replaceWith(g)}}else{WPAC._Debug("info","Try to re-inject comment form...");var b=jQuery("#wp-temp-form-div");if(!b.length)return WPAC._Debug("error","WordPress' #wp-temp-form-div container not found",s),WPAC._LoadFallbackUrl(m),!1;var _=d.find(s);if(!_.length)return WPAC._Debug("error","Respond container on requested page not found (selector: '%s')",s),WPAC._LoadFallbackUrl(m),!1;b.replaceWith(_)}if(n&&jQuery.each(n,(function(e,o){var t=jQuery("[name='"+o.name+"']",a);1!=t.length||t.val()||t.val(o.value)})),r){var h=jQuery("[name='"+r+"']",a);h&&h.focus()}}if(""!==u){new Function("extractedBody","commentUrl",u)(d,o);var y=new CustomEvent("wpacAfterUpdateComments",{detail:{newDom:d,commentUrl:o}});document.dispatchEvent(y)}return!0},WPAC._TestCrossDomainScripting=function(e){if(0!=e.indexOf("http"))return!1;var o=window.location.protocol+"//"+window.location.host;return 0!=e.indexOf(o)},WPAC._TestFallbackUrl=function(e){var o=new URL(e).searchParams,t=o.get("WPACFallback"),n=o.get("WPACRandom");return t&&n},WPAC.AttachForm=function(e){if(e=jQuery.extend({selectorCommentForm:WPAC._Options.selectorCommentForm,selectorCommentPagingLinks:WPAC._Options.selectorCommentPagingLinks,beforeSelectElements:WPACCallbacks.beforeSelectElements,beforeSubmitComment:WPACCallbacks.beforeSubmitComment,afterPostComment:WPACCallbacks.afterPostComment,selectorCommentsContainer:WPAC._Options.selectorCommentsContainer,selectorRespondContainer:WPAC._Options.selectorRespondContainer,beforeUpdateComments:WPACCallbacks.beforeUpdateComments,afterUpdateComments:WPACCallbacks.afterUpdateComments,scrollToAnchor:!WPAC._Options.disableScrollToAnchor,updateUrl:!WPAC._Options.disableUrlUpdate,selectorCommentLinks:WPAC._Options.selectorCommentLinks},e||{}),WPAC._Options.debug&&WPAC._Options.commentsEnabled&&(WPAC._Debug("info","Attach form..."),WPAC._DebugSelector("comment form",e.selectorCommentForm),WPAC._DebugSelector("comments container",e.selectorCommentsContainer),WPAC._DebugSelector("respond container",e.selectorRespondContainer),WPAC._DebugSelector("comment paging links",e.selectorCommentPagingLinks,!0),WPAC._DebugSelector("comment links",e.selectorCommentLinks,!0)),""!==WPACCallbacks.beforeSelectElements){new Function("dom",WPACCallbacks.beforeSelectElements)(jQuery(document));var o=new CustomEvent("wpacBeforeSelectElements",{detail:{dom:jQuery(document)}});document.dispatchEvent(o)}if(jQuery(document).on)var t=function(e,o,t){jQuery(document).on(e,o,t)};else t=jQuery(document).delegate?function(e,o,t){jQuery(document).delegate(o,e,t)}:function(e,o,t){jQuery(o).live(e,t)};t("click",e.selectorCommentPagingLinks,(function(o){var t=jQuery(this).attr("href");t&&(o.preventDefault(),WPAC.LoadComments(t,{selectorCommentForm:e.selectorCommentForm,selectorCommentsContainer:e.selectorCommentsContainer,selectorRespondContainer:e.selectorRespondContainer,beforeSelectElements:e.beforeSelectElements,beforeUpdateComments:e.beforeUpdateComments,afterUpdateComments:e.afterUpdateComments}))})),t("click",e.selectorCommentLinks,(function(o){var t=jQuery(this);if(!t.is(e.selectorCommentPagingLinks)){var n=t.attr("href"),r="#"+new Uri(n).anchor();jQuery(r).length>0&&(e.updateUrl&&WPAC._UpdateUrl(n),WPAC._ScrollToAnchor(r,e.updateUrl),o.preventDefault())}})),WPAC._Options.commentsEnabled&&t("submit",e.selectorCommentForm,(function(o){var t=jQuery(this);if(""!==WPACCallbacks.beforeSubmitComment){new Function("dom",WPACCallbacks.beforeSubmitComment)(jQuery(document));var n=new CustomEvent("wpacBeforeSubmitComment",{detail:{dom:jQuery(document)}});document.dispatchEvent(n)}var r=t.attr("action");if(WPAC._TestCrossDomainScripting(r))WPAC._Options.debug&&!t.data("submitCrossDomain")&&(WPAC._Debug("error","Cross-domain scripting detected (submit url: '%s'), cancel AJAX request",r),WPAC._Debug("info","Sleep for 5s to enable analyzing debug messages..."),o.preventDefault(),t.data("submitCrossDomain",!0),window.setTimeout((function(){jQuery("#submit",t).remove(),t.submit()}),5e3));else if(o.preventDefault(),t.data("WPAC_SUBMITTING"))WPAC._Debug("info","Cancel submit, form is already submitting (Form: %o)",t);else{t.data("WPAC_SUBMITTING",!0),WPAC._ShowMessage(WPAC._Options.textPostComment,"loading");var i=function(e){WPAC._Debug("info","Comment has not been posted"),WPAC._Debug("info","Try to extract error message (selector: '%s')...",WPAC._Options.selectorErrorContainer);var o=WPAC._ExtractBody(e);if(!1!==o){var t=o.find(WPAC._Options.selectorErrorContainer);if(t.length)return t=t.html(),WPAC._Debug("info","Error message '%s' successfully extracted",t),void WPAC._ShowMessage(t,"error")}WPAC._Debug("error","Error message could not be extracted, use error message '%s'.",WPAC._Options.textUnknownError),WPAC._ShowMessage(WPAC._Options.textUnknownError,"error")},a=jQuery.ajax({url:r,type:"POST",data:t.serialize(),beforeSend:function(e){e.setRequestHeader("X-WPAC-REQUEST","1")},complete:function(e,o){t.removeData("WPAC_SUBMITTING",!0)},success:function(o){if(a.getResponseHeader("X-WPAC-ERROR"))return WPAC._Debug("info","Found error state X-WPAC-ERROR header.",t),void i(o);WPAC._Debug("info","Comment has been posted");var t=a.getResponseHeader("X-WPAC-URL");WPAC._Debug("info","Found comment URL '%s' in X-WPAC-URL header.",t);var n=a.getResponseHeader("X-WPAC-UNAPPROVED");if(WPAC._Debug("info","Found unapproved state '%s' in X-WPAC-UNAPPROVED",n),""!==WPACCallbacks.afterPostComment){new Function("commentUrl","unapproved",e.afterPostComment)(t,"1"==n);var r=new CustomEvent("wpacAfterPostComment",{detail:{commentUrl:t,unapproved:"1"==n}});document.dispatchEvent(r)}if(WPAC._ShowMessage("1"==n?WPAC._Options.textPostedUnapproved:WPAC._Options.textPosted,"success"),void 0!==window.wps_launch_confetti_cannon&&window.wps_launch_confetti_cannon(),WPAC._ReplaceComments(o,t,!1,{},"",e.selectorCommentsContainer,e.selectorCommentForm,e.selectorRespondContainer,e.beforeSelectElements,e.beforeUpdateComments,e.afterUpdateComments)&&t&&(e.updateUrl&&WPAC._UpdateUrl(t),e.scrollToAnchor)){var s=t.indexOf("#")>=0?t.substr(t.indexOf("#")):null;s&&(WPAC._Debug("info","Anchor '%s' extracted from comment URL '%s'",s,t),WPAC._ScrollToAnchor(s,e.updateUrl))}},error:function(e,o,t){if(0===e.status&&""===e.responseText)return WPAC._Debug("error","Comment seems to be posted, but loading comment update failed."),void WPAC._LoadFallbackUrl(WPAC._AddQueryParamStringToUrl(window.location.href,"WPACFallback","1"));i(e.responseText)}})}}))},WPAC._Initialized=!1,WPAC.Init=function(){if(WPAC._Initialized)return WPAC._Debug("info","Abort initialization (plugin already initialized)"),!1;if(WPAC._Initialized=!0,!WPAC._Options||!WPACCallbacks)return WPAC._Debug("error","Something unexpected happened, initialization failed. Please try to reinstall the plugin."),!1;if(WPAC._Debug("info","Initializing version %s",WPAC._Options.version),WPAC._Options.debug){if(!jQuery||!jQuery.fn||!jQuery.fn.jquery)return WPAC._Debug("error","jQuery not found, abort initialization. Please try to reinstall the plugin."),!1;if(WPAC._Debug("info","Found jQuery %s",jQuery.fn.jquery),!jQuery.blockUI||!jQuery.blockUI.version)return WPAC._Debug("error","jQuery blockUI not found, abort initialization. Please try to reinstall the plugin."),!1;if(WPAC._Debug("info","Found jQuery blockUI %s",jQuery.blockUI.version),!jQuery.idleTimer)return WPAC._Debug("error","jQuery Idle Timer plugin not found, abort initialization. Please try to reinstall the plugin."),!1;WPAC._Debug("info","Found jQuery Idle Timer plugin")}return WPAC._Options.selectorPostContainer?(WPAC._Debug("info","Multiple comment form support enabled (selector: '%s')",WPAC._Options.selectorPostContainer),jQuery(WPAC._Options.selectorPostContainer).each((function(e,o){var t=jQuery(o).attr("id");t?WPAC.AttachForm({selectorCommentForm:"#"+t+" "+WPAC._Options.selectorCommentForm,selectorCommentPagingLinks:"#"+t+" "+WPAC._Options.selectorCommentPagingLinks,selectorCommentsContainer:"#"+t+" "+WPAC._Options.selectorCommentsContainer,selectorRespondContainer:"#"+t+" "+WPAC._Options.selectorRespondContainer}):WPAC._Debug("info","Skip post container element %o (ID not defined)",o)}))):WPAC.AttachForm(),jQuery("#wp-admin-bar-wpac-menu-helper-preview-overlay-loading a").on("click",(function(e){e.preventDefault(),WPAC._ShowMessage("This is the loading preview...","loadingPreview")})),jQuery("#wp-admin-bar-wpac-menu-helper-preview-overlay-success a").on("click",(function(e){e.preventDefault(),WPAC._ShowMessage("This is a success message","success")})),jQuery("#wp-admin-bar-wpac-menu-helper-preview-overlay-error a").on("click",(function(e){e.preventDefault(),WPAC._ShowMessage("This is an error message","error")})),WPAC._Options.commentsEnabled&&WPAC._Options.autoUpdateIdleTime>0&&(WPAC._Debug("info","Auto updating comments enabled (idle time: %s)",WPAC._Options.autoUpdateIdleTime),WPAC._InitIdleTimer()),WPAC._Debug("info","Initialization completed"),!0},WPAC._OnIdle=function(){WPAC.RefreshComments({success:WPAC._InitIdleTimer,scrollToAnchor:!1})},WPAC._InitIdleTimer=function(){WPAC._TestFallbackUrl(location.href)?WPAC._Debug("error","Fallback URL was detected (url: '%s'), cancel init idle timer",location.href):(jQuery(document).idleTimer("destroy"),jQuery(document).idleTimer(WPAC._Options.autoUpdateIdleTime),jQuery(document).on("idle.idleTimer",WPAC._OnIdle))},WPAC.RefreshComments=function(e){var o=location.href;return WPAC._TestFallbackUrl(location.href)?(WPAC._Debug("error","Fallback URL was detected (url: '%s'), cancel AJAX request",o),!1):WPAC.LoadComments(o,e)},WPAC.LoadComments=function(e,o){if(WPAC._TestCrossDomainScripting(e))return WPAC._Debug("error","Cross-domain scripting detected (url: '%s'), cancel AJAX request",e),!1;"boolean"==typeof o&&(o={scrollToAnchor:o}),o=jQuery.extend({scrollToAnchor:!WPAC._Options.disableScrollToAnchor,showLoadingInfo:!0,updateUrl:!WPAC._Options.disableUrlUpdate,success:function(){},selectorCommentForm:WPAC._Options.selectorCommentForm,selectorCommentsContainer:WPAC._Options.selectorCommentsContainer,selectorRespondContainer:WPAC._Options.selectorRespondContainer,disableCache:WPAC._Options.disableCache,beforeSelectElements:WPACCallbacks.beforeSelectElements,beforeUpdateComments:WPACCallbacks.beforeUpdateComments,afterUpdateComments:WPACCallbacks.afterUpdateComments},o||{});var t=jQuery(o.selectorCommentForm).serializeArray(),n=document.activeElement?jQuery("[name='"+document.activeElement.name+"']",o.selectorCommentForm).attr("name"):"",r=new URL(e).searchParams,i=r.get("ajaxifyLazyLoadEnable"),a=r.get("nonce"),s=r.get("post_id");return e=WPAC._AddQueryParamStringToUrl(e,"ajaxifyLazyLoadEnable",i),e=WPAC._AddQueryParamStringToUrl(e,"nonce",a),e=WPAC._AddQueryParamStringToUrl(e,"post_id",s),o.showLoadingInfo&&WPAC._ShowMessage(WPAC._Options.textRefreshComments,"loading"),o.disableCache&&(e=WPAC._AddQueryParamStringToUrl(e,"WPACRandom",(new Date).getTime())),jQuery.ajax({url:e,type:"GET",beforeSend:function(e){e.setRequestHeader("X-WPAC-REQUEST","1")},success:function(r){try{if(!WPAC._ReplaceComments(r,e,!0,t,n,o.selectorCommentsContainer,o.selectorCommentForm,o.selectorRespondContainer,o.beforeSelectElements,o.beforeUpdateComments,o.afterUpdateComments))return;o.updateUrl&&WPAC._UpdateUrl(e);var i=!1;if(o.scrollToAnchor){var a=e.indexOf("#")>=0?e.substr(e.indexOf("#")):null;a&&(WPAC._Debug("info","Anchor '%s' extracted from url",a),WPAC._ScrollToAnchor(a,o.updateUrl,(function(){o.success()}))&&(i=!0))}}catch(e){WPAC._Debug("error","Something went wrong while refreshing comments: %s",e)}jQuery.unblockUI(),i||o.success()},error:function(){WPAC._LoadFallbackUrl(WPAC._AddQueryParamStringToUrl(window.location.href,"WPACFallback","1"))}}),!0},jQuery((function(){var e=WPAC.Init();if(!0===WPAC._Options.lazyLoadEnabled){if(!e)return void WPAC._LoadFallbackUrl(WPAC._AddQueryParamStringToUrl(window.location.href,"WPACFallback","1"));var o=WPAC._Options.asyncLoadTrigger;WPAC._Debug("info","Loading comments asynchronously with secondary AJAX request (trigger: '%s')",o),window.location.hash&&/^#comment-[0-9]+$/.test(window.location.hash)&&(WPAC._Debug("info","Comment anchor in URL detected, force loading comments on DomReady (hash: '%s')",window.location.hash),o="DomReady"),"Viewport"==o?jQuery(WPAC._Options.selectorCommentsContainer).waypoint((function(e){this.destroy(),WPAC.RefreshComments()}),{offset:"100%"}):"DomReady"==o&&WPAC.RefreshComments({scrollToAnchor:!0})}}))})();
>>>>>>> main
