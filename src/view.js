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

store('twentybellows/query-filter', {
  actions: {
    execute: function* ( e ){

      // store scroll position for later
      sessionStorage.setItem('queryFilterScrollPosition', window.scrollY);

      const { ref } = getElement();
      
      const baseUrl = ref.getAttribute('data-query-filter-base-url');
      const queryId = ref.getAttribute('data-query-filter-id');
      const filterSlug = ref.getAttribute('data-query-filter-slug');

      // if a query variable is empty, don't include it in the URL
      const queryIdString = queryId ? `filter_query_id=${queryId}` : '';
      const slugString = ref.value ? `${filterSlug}=${ref.value}` : '';

      const url = buildURL(baseUrl, queryIdString, slugString);

      // store the selected value for after we navigate
      const selectedValue = ref.value;
      
      // navigate
      const { actions } = yield import ('@wordpress/interactivity-router')
      yield actions.navigate(url);

      // reinstate selected element after navigation
      ref.value = selectedValue;
      scrollWindow()
       
    }
  }
})

// not sure if this is still needed?
window.addEventListener('load', function() {
  scrollWindow()
});
