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

// if there is only one term dont' render anything
if (count($terms) <= 1) {
	return;
}

?>
<select <?php echo get_block_wrapper_attributes(); ?>onChange="sessionStorage.setItem('queryFilterScrollPosition', window.scrollY); window.document.location.href=this.options[this.selectedIndex].value;">
	<?php

	$url = remove_query_arg($filter_slug, $current_url);
	$url = remove_query_arg('filter_query_id', $url);
	echo '<option value="' . $url . '">' . $taxonomy->labels->all_items . '</option>';

	foreach ($terms as $term) {
		$selected = $term->slug === $selected_taxonomy_slug ? 'selected' : '';
		//get the current URL
		$url = remove_query_arg($filter_slug, $current_url);
		$url = add_query_arg($filter_slug, $term->slug, $url);
		$url = add_query_arg('filter_query_id', $query_id, $url);
		echo '<option ' . $selected . ' value="' . $url . '">' . $term->name . '</option>';
	}
	?>
</select>
