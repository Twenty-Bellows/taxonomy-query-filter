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

			// Capture before yielding — ref may be stale after DOM patching
			const isRadio = ref.type === 'radio';
			const isSelect = ref.tagName === 'SELECT';
			const queryId = ref.getAttribute( 'data-query-filter-query-id' );
			const selectedValue = ref.value;

			yield* navigate( getQueryUrl( ref ), enhancedPagination );

			// After navigation the router may have patched checked onto the new
			// radio without removing it from the old one, leaving multiple radios
			// checked. Force the correct state on all radios in this group.
			if ( isRadio ) {
				document
					.querySelectorAll(
						`input[type="radio"][data-query-filter-query-id="${ queryId }"]`
					)
					.forEach( ( input ) => {
						input.checked = input.value === selectedValue;
						const label = input.nextElementSibling;
						if ( label?.tagName === 'LABEL' ) {
							label.classList.toggle(
								'selected',
								input.value === selectedValue
							);
						}
					} );
			}

			if ( isSelect ) {
				requestAnimationFrame( () => {
					document
						.querySelectorAll(
							`select[data-query-filter-query-id="${ queryId }"]`
						)
						.forEach( ( select ) => {
							select.value = selectedValue;
						} );
				} );
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

			// Ensure select dropdowns reflect the current URL parameter
			if ( ref.tagName === 'SELECT' ) {
				const queryId = ref.getAttribute( 'data-query-filter-query-id' );
				const urlParams = new URLSearchParams( window.location.search );
				const filterParam = urlParams.get( 'query-filter-' + queryId );
				ref.value = filterParam || 'all';
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
