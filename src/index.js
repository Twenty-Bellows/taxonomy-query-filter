import { registerBlockType, registerBlockVariation } from '@wordpress/blocks';
import './style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import metadata from './block.json';

registerBlockType( metadata.name, {
	edit: Edit,
} );

registerBlockVariation( 'twentybellows/query-filter', {
	name: 'query-filter-radio',
	title: 'Query Filter - Radio',
	description: 'Query filter using radio as the input',
	isDefault: false,
	attributes: {
		element: 'radio',
	},
	isActive: ( blockAttributes, variationAttributes ) =>
		blockAttributes.element === variationAttributes.element,
} );
