import { test, expect } from './utils/testUtils';
import { createCategories, deleteAllCategories } from './utils/categoryUtils';

test.describe( 'Query Filter block', async () => {
	test.beforeEach( async ( { requestUtils } ) => {
		// Delete any default posts
		await requestUtils.deleteAllPosts();

		// Create categories
		const categories = await createCategories( {
			categories: [ 'Technology', 'Travel', 'Food' ],
			requestUtils,
		} );

		// Posts fixture data
		const posts = [
			{
				title: 'Sample Technology Post',
				category: 'Technology',
				date: '2025-01-03 00:00:00',
			},
			{
				title: 'Sample Travel Post',
				category: 'Travel',
				date: '2025-01-02 00:00:00',
			},
			{
				title: 'Sample Food Post',
				category: 'Food',
				date: '2025-01-01 00:00:00',
			},
		];

		// Create posts
		for ( const { title, category, date } of posts ) {
			await requestUtils.createPost( {
				title,
				content: `This is a ${ title.toLowerCase() } related post.`,
				categories: [
					categories.find( ( c ) => c.name === category ).id,
				],
				date,
				status: 'publish',
			} );
		}
	} );

	test.afterEach( async ( { requestUtils } ) => {
		await requestUtils.deleteAllPosts();
		await requestUtils.deleteAllPages();
		await deleteAllCategories( { requestUtils } );
	} );

	test.describe( 'on page WITHOUT a Query Filter', async () => {
		test.beforeEach( async ( { admin, editor } ) => {
			// Create a new page
			await admin.createNewPost( {
				postType: 'page',
				title: 'Test Query Filter',
			} );

			// Insert fixture blocks
			await editor.insertBlock( blocksWithoutQueryFilter );
		} );

		test( 'can be added with the editor', async ( { editor, page } ) => {
			// Find the query block
			const queryBlock = editor.canvas.locator(
				"[data-type='core/query']"
			);
			expect( queryBlock ).not.toBeNull();

			// Get client id from data-block attribute of the query block
			const clientId = await queryBlock.getAttribute( 'data-block' );

			// Add query filter block inside of the query block
			await editor.insertBlock(
				{
					name: 'twentybellows/query-filter',
					attributes: {
						taxonomy: 'category',
						element: 'select',
					},
				},
				{ clientId }
			);

			// Check if the query filter block is inside of the query block
			const queryFilterBlock = editor.canvas.locator(
				"[data-type='core/query'] [data-type='twentybellows/query-filter']"
			);
			await expect( queryFilterBlock ).toBeVisible();

			// Save post
			const postId = await editor.publishPost();

			// Go to the new page
			await page.goto( `/?page_id=${ postId }` );

			// Check if the query filter block is visible
			const select = page.locator( 'select' );
			await expect( select ).toBeVisible();
		} );
	} );

	test.describe( 'on page WITH a Query Filter', async () => {
		test.beforeEach( async ( { admin, editor } ) => {
			// Create a new page
			await admin.createNewPost( {
				postType: 'page',
				title: 'Test Query Filter',
			} );

			// Insert fixture blocks
			await editor.insertBlock( blocksWithQueryFilter );
		} );

		test( 'can filter posts by category', async ( { editor, page } ) => {
			// Publish the post to get a post id
			const postId = await editor.publishPost();

			// Navigate to the new page
			await page.goto( `/?page_id=${ postId }` );

			// Check if the technology post is visible before filtering
			await expect(
				page.locator( '.wp-block-query h2', {
					hasText: 'Sample Technology Post',
				} )
			).toBeVisible();

			// Check if the food post is not visible before filtering
			await expect(
				page.locator( '.wp-block-query h2', {
					hasText: 'Sample Food Post',
				} )
			).not.toBeVisible();

			// Filter by Food category
			const select = page.locator( 'select' );
			await select.selectOption( { label: 'Food' } );

			// Check if the food post is visible after filtering
			await expect( page.locator( '.wp-block-query h2' ) ).toHaveText(
				'Sample Food Post'
			);

			// Check if the technology post is not visible after filtering
			await expect(
				page.locator( '.wp-block-query h2', {
					hasText: 'Sample Technology Post',
				} )
			).not.toBeVisible();

			// Check if the pagination is not visible
			const pagination = page.locator( '.wp-block-query-pagination' );
			await expect( pagination ).not.toBeVisible();
		} );

		test( 'can reset pagination when filtering', async ( {
			editor,
			page,
		} ) => {
			// Publish the post to get a post id
			const postId = await editor.publishPost();

			// Navigate to the new page
			await page.goto( `/?page_id=${ postId }` );

			// Get the select element and pagination element
			const select = page.locator( 'select' );
			const pagination = page.locator( '.wp-block-query-pagination' );

			// Check if the pagination is visible
			await expect( pagination ).toBeVisible();

			// Click on the next page button
			const nextButton = pagination.locator(
				'.wp-block-query-pagination-next'
			);
			await expect( nextButton ).toBeVisible();
			await nextButton.click();

			// Check if Technology post is not visible on the second page
			await expect(
				page.locator( '.wp-block-query h2', {
					hasText: 'Sample Technology Post',
				} )
			).not.toBeVisible();

			// Filter by Technology category
			await select.selectOption( { label: 'Technology' } );
			await expect( page.locator( '.wp-block-query h2' ) ).toHaveText(
				'Sample Technology Post'
			);

			// Check if the pagination is not visible
			await expect( pagination ).not.toBeVisible();
		} );
	} );
} );

const blocksWithoutQueryFilter = {
	name: 'core/query',
	attributes: {
		queryId: 1,
		query: {
			perPage: 2,
			enhancedPagination: true,
			postType: 'post',
		},
	},
	innerBlocks: [
		{
			name: 'core/post-template',
			innerBlocks: [
				{
					name: 'core/post-title',
				},
			],
		},
		{
			name: 'core/query-pagination',
		},
	],
};

const blocksWithQueryFilter = {
	...blocksWithoutQueryFilter,
	innerBlocks: [
		{
			name: 'twentybellows/query-filter',
			attributes: {
				taxonomy: 'category',
			},
		},
		...blocksWithoutQueryFilter.innerBlocks,
	],
};
