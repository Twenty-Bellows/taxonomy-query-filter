<?php
global $wp;

// If the array key queryId is not set, return the pre_render
if (!array_key_exists('queryId', $block->context)) {
    return;
}
$query_id = $block->context['queryId'];
$current_url = add_query_arg( $_SERVER['QUERY_STRING'], '', home_url( $wp->request ) );
$taxonomy_slug = $block->attributes['taxonomy'];
$filter_slug = 'filter_query_' . $taxonomy_slug;
$labels = get_taxonomy($taxonomy_slug)->labels;
$taxonomy = get_taxonomy($taxonomy_slug);
$selected_taxonomy_slug = isset($_GET[$filter_slug]) ? sanitize_text_field($_GET[$filter_slug]) : '';
$terms = get_terms(array(
	'taxonomy' => $taxonomy_slug,
	'hide_empty' => true,
));

// Get the base url so the front end can build a proper url for navigation
$base_url = remove_query_arg($filter_slug,$current_url);
$base_url = remove_query_arg('filter_query_id',$base_url);

// if there is only one term dont' render anything
if (count($terms) <= 1) {
	return;
}

?>
<select 
	data-wp-interactive="twentybellows/query-filter"
	data-wp-on--change="actions.execute"
	data-query-filter-slug="<?php echo $filter_slug ?>"
	data-query-filter-id="<?php echo $query_id ?>"
	data-query-filter-base-url="<?php echo $base_url ?>"
	<?php echo get_block_wrapper_attributes(); ?>
		
		>
	<?php

	echo '<option value="">' . $taxonomy->labels->all_items . '</option>';

	foreach ($terms as $term) {
		$selected = $term->slug === $selected_taxonomy_slug ? 'selected' : '';
		echo '<option ' . $selected . ' value="' . $term->slug . '">' . $term->name . '</option>';
	}
	?>
</select>
