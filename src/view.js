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

			const selectedValue = ref.value;

			yield* navigate( getQueryUrl( ref ), enhancedPagination );

			if ( enhancedPagination ) {
				ref.value = selectedValue;
				ref.checked = true;
			}
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
