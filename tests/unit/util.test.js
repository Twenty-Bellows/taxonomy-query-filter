import { getQueryUrl } from '../../src/util.js';
import { expect } from '@jest/globals';

describe( 'Query Filter Url Builder', () => {
	it( 'should build a url based on attributes on an element', async () => {
		const ref = document.createElement( 'select' );
		ref.setAttribute( 'data-query-filter-query-id', '1' );
		ref.setAttribute( 'data-query-filter-taxonomy', 'category' );
		ref.innerHTML += `
			<option value="technology">Technology</option>
			<option value="another_value">Another Option</option>
		`;

		expect( getQueryUrl( ref ) ).toBe(
			'http://localhost/?query-filter-1=category_technology'
		);
	} );
} );
