import { store, getElement } from '@wordpress/interactivity'

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
function buildURL( baseUrl, queryId, filterSlug ) {
  let base = baseUrl;
  // make sure we have a query string
  if (base.indexOf('?') < 0) {
    base = base + '?'
  }

  return [base, queryId, filterSlug]
    .filter(i => i) // weed out blanks
    .join('&');
}

/**
 * Invokes the interactivity router and navigates the router region to the given URL
 * @param {string} url 
 */
function* navigate(url) {
  // store scroll position for later
  sessionStorage.setItem('queryFilterScrollPosition', window.scrollY);

  // navigate
  const { actions } = yield import ('@wordpress/interactivity-router')
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
  return { baseUrl, queryId, filterSlug };
}

store('twentybellows/query-filter', {
  actions: {
    execute: function* ( _e ) {
      const { ref } = getElement();
      const { baseUrl, queryId, filterSlug } = getBaseAttributes(ref);

      // if a query variable is empty, don't include it in the URL
      const queryIdString = queryId ? `filter_query_id=${queryId}` : '';
      const slugString = ref.value ? `${filterSlug}=${ref.value}` : '';

      const url = buildURL(baseUrl, queryIdString, slugString);
      const selectedValue = ref.value;

      yield* navigate(url);

      if (ref.tagName === 'SELECT') {
        ref.value = selectedValue;
      } else if (ref.tagName === 'INPUT' && ref.getAttribute('type') === 'radio'){
        ref.checked = true
      }
    }
  }
})

// not sure if this is still needed?
window.addEventListener('load', function() {
  scrollWindow()
});
