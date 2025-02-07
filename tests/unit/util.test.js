import { getQueryUrl } from '../../src/util.js';
import { expect } from '@jest/globals';

describe( 'Query Filter Url Builder', () => {

	it( 'should build a url with existing values, a query id and a selected category', async () => {

		const ref = document.createElement( 'select' );
		ref.setAttribute( 'data-query-filter-base-url', '/?page_id=123' );
		ref.setAttribute( 'data-query-filter-id', 'query-1' );
		ref.setAttribute( 'data-query-filter-slug', 'category' );
		ref.value = 'technology';

		expect( getQueryUrl( ref ) ).toBe( '/?page_id=123&filter_query_id=query-1' );
	} );

} );
