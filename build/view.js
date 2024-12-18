import * as __WEBPACK_EXTERNAL_MODULE__wordpress_interactivity_8e89b257__ from "@wordpress/interactivity";
/******/ var __webpack_modules__ = ({

/***/ "@wordpress/interactivity-router":
/*!**************************************************!*\
  !*** external "@wordpress/interactivity-router" ***!
  \**************************************************/
/***/ ((module) => {

module.exports = import("@wordpress/interactivity-router");;

/***/ }),

/***/ "@wordpress/interactivity":
/*!*******************************************!*\
  !*** external "@wordpress/interactivity" ***!
  \*******************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__wordpress_interactivity_8e89b257__;

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/view.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/interactivity */ "@wordpress/interactivity");


/**
 * Scrolls the window to the position saved in session storage
 * Possibly needs to be deprecated?
 */
function scrollWindow() {
  // not entirely sure it's necessary to keep using session storage if we're doing
  // in-place navigation instead of reloading the whole page, but it was easier
  // to use the existing code for the moment.
  const savedScrollPosition = sessionStorage.getItem('queryFilterScrollPosition');
  if (savedScrollPosition !== null) {
    window.scrollTo(0, parseInt(savedScrollPosition, 10));
    sessionStorage.removeItem('queryFilterScrollPosition');
  }
}

/**
 * Returns a full URL to send to the interactivity router for navigation
 * @param {string} baseUrl -The rest of the URL that isn't specific to this 
 *           query-filter element
 * @param {string|number} queryId 
 * @param {string} filterSlug 
 * @return {string}
 */
function buildURL(baseUrl, queryId, filterSlug) {
  let base = baseUrl;
  // make sure we have a query string
  if (base.indexOf('?') < 0) {
    base = base + '?';
  }
  return [base, queryId, filterSlug].filter(i => i) // weed out blanks
  .join('&');
}

/**
 * Invokes the interactivity router and navigates the router region to the given URL
 * @param {string} url 
 * @param {string} inPlace - either 1 or empty string
 */
function* navigate(url, inPlace) {
  // store scroll position for later
  sessionStorage.setItem('queryFilterScrollPosition', window.scrollY);
  if (!inPlace) {
    window.document.location.href = url;
    return;
  }
  const {
    actions
  } = yield Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! @wordpress/interactivity-router */ "@wordpress/interactivity-router"));
  // navigate
  yield actions.navigate(url);
  scrollWindow();
}

/**
 * Given a reference to the root element of the query-filter block, returns the baseUrl, 
 * queryId, and filterSlug to be used for URL building.
 * @param {HTMLElement} ref - reference to the root HTML element of the query-filter block
 * @returns {
 *  {string} baseUrl
 *  {string} queryId
 *  {string} filterSlug
 * }
 */
function getBaseAttributes(ref) {
  const baseUrl = ref.getAttribute('data-query-filter-base-url');
  const queryId = ref.getAttribute('data-query-filter-id');
  const filterSlug = ref.getAttribute('data-query-filter-slug');
  const inPlace = ref.getAttribute('data-query-in-place');
  return {
    baseUrl,
    queryId,
    filterSlug,
    inPlace
  };
}
(0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('twentybellows/query-filter', {
  actions: {
    execute: function* (_e) {
      const {
        ref
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();
      const {
        baseUrl,
        queryId,
        filterSlug,
        inPlace
      } = getBaseAttributes(ref);
      console.log({
        baseUrl,
        queryId,
        filterSlug,
        inPlace
      });

      // if a query variable is empty, don't include it in the URL
      const queryIdString = queryId ? `filter_query_id=${queryId}` : '';
      const slugString = ref.value ? `${filterSlug}=${ref.value}` : '';
      const url = buildURL(baseUrl, queryIdString, slugString);
      const selectedValue = ref.value;
      yield* navigate(url, inPlace);
      if (ref.tagName === 'SELECT') {
        ref.value = selectedValue;
      } else if (ref.tagName === 'INPUT' && ref.getAttribute('type') === 'radio') {
        ref.checked = true;
      }
    }
  }
});

// not sure if this is still needed?
window.addEventListener('load', function () {
  scrollWindow();
});
})();


//# sourceMappingURL=view.js.map