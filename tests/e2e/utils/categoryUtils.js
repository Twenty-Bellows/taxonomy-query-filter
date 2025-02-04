export async function createCategories( { categories, requestUtils } ) {
	const response = await requestUtils.batchRest(
		categories.map( ( category ) => ( {
			path: '/wp/v2/categories',
			method: 'POST',
			body: { name: category },
		} ) )
	);

	return response.map( ( category ) => category.body );
}

export async function deleteAllCategories( { requestUtils } ) {
	const categories = await requestUtils.rest( {
		path: '/wp/v2/categories',
		method: 'GET',
	} );

	for ( const category of categories ) {
		if ( category.id !== 1 ) {
			await requestUtils.rest( {
				path: `/wp/v2/categories/${ category.id }`,
				method: 'DELETE',
				params: {
					force: true,
				},
			} );
		}
	}
}
