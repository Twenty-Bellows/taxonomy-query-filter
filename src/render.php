<?php
global $wp;

// If the array key queryId is not set, return the pre_render
if (!array_key_exists('queryId', $block->context)) {
    return;
}
$query_id = $block->context['queryId'];
$current_url = add_query_arg( $_SERVER['QUERY_STRING'], '', home_url( $wp->request ) );
$taxonomy_slug = $block->attributes['taxonomy'];
$element = $block->attributes['element'];
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

if ($element == 'select') {


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

<?php } elseif ($element == 'radio') { 
	$field_id_base = "query-filter-" . $query_id . "-" . $filter_slug;
	$data_attributes = join(' ',array(
		'data-wp-interactive="twentybellows/query-filter"',
		'data-query-filter-slug="'. $filter_slug .'"',
		'data-query-filter-id="' . $query_id .'"',
		'data-query-filter-base-url="'. $base_url .'"',
		'data-wp-on--change="actions.execute"'
	))
	?>
<div
	<?php echo get_block_wrapper_attributes(); ?>
>
	<label for="<?php echo $field_id_base ?>-all">
		<input
			<?php echo $data_attributes ?>
		  id="<?php echo $field_id_base ?>-all" name="<?php echo $field_id_base ?>" type="radio" value="" />
		<?php echo $taxonomy->labels->all_items ?>
	</label>

	<?php
		foreach ($terms as $term) {
			$field_id = $field_id_base . "-" . $term->slug;
			$checked = $term->slug === $selected_taxonomy_slug ? 'checked="checked"' : '';
			?>
			<label for="<?php echo $field_id ?>">
				<input
					<?php echo $data_attributes ?>
					id="<?php echo $field_id ?>"
					name="<?php echo $field_id_base ?>"
					type="radio"
					<?php echo $checked ?>
					value="<?php echo $term->slug ?>" />
				<?php echo $term->name ?>
			</label>

	<?php
		}
	?>
	</div>

<?php } ?>