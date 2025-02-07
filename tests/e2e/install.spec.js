import { test, expect } from './utils/testUtils';

test.describe( 'Installed plugin', async () => {
	test( 'listed in plugins page and active', async ( {
		page,
		admin,
		requestUtils,
	} ) => {
		await requestUtils.activatePlugin( 'query-filter' );

		await admin.visitAdminPage( 'plugins.php' );

		const pluginElement = page.locator( 'tr[data-slug="query-filter"]' );
		await expect( pluginElement ).toBeVisible();
		await expect( pluginElement ).toContainText( 'Deactivate' );
	} );
} );
