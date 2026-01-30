import { store, getElement } from '@wordpress/interactivity';
import { getQueryUrl } from './util';

function* navigate( url, enhancedPagination ) {
	if ( enhancedPagination ) {
		const { actions } = yield import( '@wordpress/interactivity-router' );
		yield actions.navigate( url );
	} else {
		//store the scroll position
		sessionStorage.setItem( 'queryFilterScrollPosition', window.scrollY );
		window.document.location.href = url;
	}
}

const queryFilterStore = store( 'twentybellows/taxonomy-query-filter', {
	actions: {
		filterByTerm: function* () {
			const { ref } = getElement();
			const enhancedPagination = ref.hasAttribute(
				'data-query-filter-enhanced-pagination'
			);

			yield* navigate( getQueryUrl( ref ), enhancedPagination );
		},
		prefetch: function* ( url ) {
			const { actions } = yield import(
				'@wordpress/interactivity-router'
			);
			actions.prefetch( url );
		},
	},
	callbacks: {
		init: function () {
			const { ref } = getElement();
			const prefetch = ref.hasAttribute( 'data-query-filter-prefetch' );

			// Ensure select dropdowns reflect the current URL parameter
			if ( ref.tagName === 'SELECT' ) {
				const queryId = ref.getAttribute( 'data-query-filter-query-id' );
				const taxonomy = ref.getAttribute( 'data-query-filter-taxonomy' );
				const urlParams = new URLSearchParams( window.location.search );
				const filterParam = urlParams.get( 'query-filter-' + queryId );

				if ( filterParam ) {
					// Extract term slug from "taxonomy.term" format
					const parts = filterParam.split( '.' );
					if ( parts.length === 2 && parts[ 0 ] === taxonomy ) {
						ref.value = parts[ 1 ];
					}
				} else {
					// No filter set, select "all"
					ref.value = 'all';
				}
			}

			if ( prefetch ) {
				if ( ref.options ) {
					for ( const option of ref.options ) {
						queryFilterStore.actions.prefetch(
							getQueryUrl( ref, option.value )
						);
					}
				} else {
					queryFilterStore.actions.prefetch( getQueryUrl( ref ) );
				}
			}
		},
	},
} );

// If we aren't using enhanced pagination, scroll to the last scroll position
window.addEventListener( 'load', function () {
	const savedScrollPosition = sessionStorage.getItem(
		'queryFilterScrollPosition'
	);

	if ( savedScrollPosition !== null ) {
		window.scrollTo( 0, parseInt( savedScrollPosition, 10 ) );
		sessionStorage.removeItem( 'queryFilterScrollPosition' );
	}
} );
