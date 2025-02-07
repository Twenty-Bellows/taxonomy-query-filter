import { store, getElement, getContext } from '@wordpress/interactivity';
import { getQueryUrl } from './utils';

/**
 * Scrolls the window to the position saved in session storage
 * Possibly needs to be deprecated?
 */
function scrollWindow() {
	// not entirely sure it's necessary to keep using session storage if we're doing
	// in-place navigation instead of reloading the whole page, but it was easier
	// to use the existing code for the moment.
	const savedScrollPosition = sessionStorage.getItem(
		'queryFilterScrollPosition'
	);
	if ( savedScrollPosition !== null ) {
		window.scrollTo( 0, parseInt( savedScrollPosition, 10 ) );
		sessionStorage.removeItem( 'queryFilterScrollPosition' );
	}
}

/**
 * Invokes the interactivity router and navigates the router region to the given URL
 * @param {string} url
 * @param {string} inPlace - either 1 or empty string
 */
function* navigate( url, inPlace ) {
	// store scroll position for later
	sessionStorage.setItem( 'queryFilterScrollPosition', window.scrollY );

	if ( ! inPlace ) {
		window.document.location.href = url;
		return;
	}

	const { actions } = yield import( '@wordpress/interactivity-router' );
	// navigate
	yield actions.navigate( url );
	scrollWindow();
}

store( 'twentybellows/query-filter', {
	actions: {
		execute: function* ( _e ) {
			const { ref } = getElement();
			const url = getQueryUrl( ref );

			yield* navigate( url, inPlace );

			const selectedValue = ref.value;
			if ( ref.tagName === 'SELECT' ) {
				ref.value = selectedValue;
			} else if (
				ref.tagName === 'INPUT' &&
				ref.getAttribute( 'type' ) === 'radio'
			) {
				ref.checked = true;
			}
		},
	},
} );

// not sure if this is still needed?
window.addEventListener( 'load', function () {
	scrollWindow();
} );
