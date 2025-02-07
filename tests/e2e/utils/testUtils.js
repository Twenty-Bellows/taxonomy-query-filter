import {
	test as baseTest,
	expect,
	Admin,
	PageUtils,
	RequestUtils,
	Editor,
} from '@wordpress/e2e-test-utils-playwright';

const test = baseTest.extend( {
	async pageUtils( { page }, use ) {
		const pageUtils = new PageUtils( { page } );
		await use( pageUtils );
	},
	async admin( { page, pageUtils, editor }, use ) {
		const admin = new Admin( { page, pageUtils, editor } );
		await use( admin );
	},
	async editor( { page }, use ) {
		await use( new Editor( { page } ) );
	},
	async requestUtils( {}, use ) {
		// We want to make all REST API calls as authenticated users.
		const requestUtils = await RequestUtils.setup( {
			baseURL: process.env.WP_BASE_URL,
			storageStatePath: process.env.STORAGE_STATE_PATH,
			user: {
				username: process.env.WP_USERNAME || 'admin',
				password: process.env.WP_PASSWORD || 'password',
			},
		} );

		await use( requestUtils );
	},
} );

export { test, expect };
