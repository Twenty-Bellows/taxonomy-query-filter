import { getQueryUrl } from '../../src/util.js';
import { expect } from '@jest/globals';

describe( 'Query Filter Url Builder', () => {
	it( 'should build a url based on attributes on an element', async () => {
		const ref = document.createElement( 'select' );
		ref.setAttribute( 'data-query-filter-id', 'query-1' );
		ref.setAttribute( 'data-query-filter-slug', 'category' );
		ref.value = 'technology';

		expect( getQueryUrl( ref ) ).toBe(
			'http://localhost/?query_filter_id=query-1&filter_slug=category'
		);
	} );
} );
