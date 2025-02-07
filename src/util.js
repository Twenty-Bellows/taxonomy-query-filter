
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

	// strip out page number from URL
	base = base.replace( /\??\&?query-\d+-page=\d+/, '' );

	// make sure we have a query string
	if ( base.indexOf( '?' ) < 0 ) {
		base = base + '?';
	}

  return [base, queryId, filterSlug]
    .filter(i => i) // weed out blanks
    .join('&');
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
  return { baseUrl, queryId, filterSlug, inPlace };
}



export function getQueryUrl(ref){

      const { baseUrl, queryId, filterSlug, inPlace } = getBaseAttributes(ref);

      // if a query variable is empty, don't include it in the URL
      const queryIdString = queryId ? `filter_query_id=${queryId}` : '';
      const slugString = ref.value ? `${filterSlug}=${ref.value}` : '';

      const url = buildURL(baseUrl, queryIdString, slugString);
			return url;
}
