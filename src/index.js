import { registerBlockType, registerBlockVariation } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Edit from './edit';
import metadata from './block.json';

registerBlockType( metadata.name, {
	edit: Edit,
} );

registerBlockVariation( 'twentybellows/taxonomy-query-filter', {
	name: 'taxonomy-query-filter-radio',
	title: 'Taxonomy Query Filter - Radio',
	description: 'Query filter using radio as the input',
	isDefault: false,
	attributes: {
		element: 'radio',
	},
	isActive: ( blockAttributes, variationAttributes ) =>
		blockAttributes.element === variationAttributes.element,
} );
