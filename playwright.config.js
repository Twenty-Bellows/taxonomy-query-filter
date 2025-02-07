import { defineConfig } from '@playwright/test';
import config from '@wordpress/scripts/config/playwright.config';

const PORT = 8299; // Test site port
process.env.WP_BASE_URL = `http://localhost:${ PORT }`;

export default defineConfig( {
	...config,
	testDir: 'tests/e2e',
	testMatch: [ '**/*.spec.js' ],
	timeout: 15000,
	use: {
		...config.use,
		baseURL: process.env.WP_BASE_URL || `http://localhost:${ PORT }`,
	},
	webServer: {
		command: 'npm run start',
		url: process.env.WP_BASE_URL || `http://localhost:${ PORT }`,
		reuseExistingServer: true,
		timeout: 15000,
	},
} );
