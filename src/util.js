export function getQueryUrl( ref ) {

	const queryId = ref.getAttribute( 'data-query-filter-query-id' ) || '';
	const term = ref.value;
	const taxonomy = ref.getAttribute( 'data-query-filter-taxonomy' ) || '';
	const currentUrl = new URL(window.location.href);

	currentUrl.searchParams.set('query-filter-' + queryId, taxonomy + '_' + term);
	currentUrl.searchParams.delete('query-' + queryId + '-page');

	return currentUrl.href;
}
