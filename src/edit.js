import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function Edit({ context, attributes, setAttributes }) {

	const postType = context.query.postType;
	const [taxonomies, setTaxonomies] = useState([]);
	const { taxonomy } = attributes;

	useEffect(() => {
		apiFetch({ path: `/wp/v2/taxonomies?type=${postType}` })
			.then((taxonomies) => {
				const taxonomyOptions = Object.values(taxonomies).map((taxonomy) => ({
					label: taxonomy.name,
					value: taxonomy.slug,
				}));
				setTaxonomies(taxonomyOptions);
			})
			.catch((error) => {
				console.error('Error fetching taxonomies:', error);
			});
	}, []);

	const handleTaxonomyChange = (selectedTaxonomy) => {
		setAttributes({ taxonomy: selectedTaxonomy });
	};

	return (
		<>
			<SelectControl
				value={taxonomy}
				options={taxonomies}
				onChange={(taxonomy) => handleTaxonomyChange(taxonomy)}
			/>
			<InspectorControls>
				<PanelBody title={'Taxonomy to Filter'}>
					<SelectControl
						label="Select Taxonomy"
						value={taxonomy}
						options={taxonomies}
						onChange={(taxonomy) => handleTaxonomyChange(taxonomy)}
					/>
				</PanelBody>
			</InspectorControls>
		</>

	);
}
