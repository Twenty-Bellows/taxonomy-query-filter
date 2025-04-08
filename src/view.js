import { store, getElement } from '@wordpress/interactivity';
import { getQueryUrl } from './util';

function* navigate( url, enhancedPagination ) {
	if ( enhancedPagination ) {
		const { actions } = yield import( '@wordpress/interactivity-router' );
		yield actions.navigate( url );
	}
	else {
		//store the scroll position
		sessionStorage.setItem( 'queryFilterScrollPosition', window.scrollY );
		window.document.location.href = url;
	}
}

const queryFilterStore = store( 'twentybellows/taxonomy-query-filter', {
	actions: {
		filterByTerm: function* () {

			const { ref } = getElement();
			const enhancedPagination = ref.hasAttribute('data-query-filter-enhanced-pagination');

			yield* navigate( getQueryUrl( ref ), enhancedPagination );

		},
		prefetch: function* () {
			const { actions } = yield import('@wordpress/interactivity-router')
			const { ref } = getElement();
			actions.prefetch( getQueryUrl( ref ));
		},
	},
	callbacks: {
		init: function() {
			const { ref } = getElement();
			const prefetch = ref.hasAttribute('data-query-filter-prefetch');

			if ( prefetch ) {
				queryFilterStore.actions.prefetch();
			}
		}
	}
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
