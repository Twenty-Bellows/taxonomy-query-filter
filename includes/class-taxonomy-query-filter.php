<?php

if (!class_exists('Twenty_Bellows_Query_Filter')) {

	/**
	 * Render the query filter block
	 *
	 * @package TwentyBellows
	 */
	class Twenty_Bellows_Query_Filter
	{
		public function __construct()
		{
			add_filter('pre_render_block', array($this, 'pre_render_query_block'), 0, 2);
		}

		public function render_content($block)
		{
			$query_id = $block->context['queryId'];
			$element = $block->attributes['element'];
			$taxonomy_slug = $block->attributes['taxonomy'];
			$enhanced_pagination    = $block->context['enhancedPagination'];
			$taxonomy = get_taxonomy($taxonomy_slug);
			$terms = get_terms(array(
				'taxonomy'   => $taxonomy->name,
				'hide_empty' => true,
			));

			if (is_wp_error($terms)) {
				return '';
			}

			$data_attributes = [
				'data-wp-interactive' => 'twentybellows/taxonomy-query-filter',
				'data-wp-on--change' => 'actions.filterByTerm',
				'data-wp-init--taxonomy-query-filter' => 'callbacks.init',
				'data-query-filter-taxonomy' => esc_attr($taxonomy_slug),
				'data-query-filter-prefetch' => true,
				'data-query-filter-query-id' => esc_attr($query_id),
				'data-query-filter-enhanced-pagination' => $enhanced_pagination,
			];


			if ($element === 'radio') {
				$content = self::get_query_filter_buttons($query_id, $taxonomy, $terms, $data_attributes);
			} else if ($element === 'select') {
				$content = self::get_query_filter_select($query_id, $taxonomy, $terms, $data_attributes);
			}

			$block_wrapper_attributes = get_block_wrapper_attributes();
			return sprintf(
				'<div %1$s>%2$s</div>',
				$block_wrapper_attributes,
				$content,
			);
		}

		private function get_query_filter_select($query_id, $taxonomy, $terms, $data_attributes)
		{
			$selected_term = null;
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			if (isset($_GET['query-filter-' . $query_id])) {
				$selected_term = $_GET['query-filter-' . $query_id]; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			}

			// All Items Option
			$option = new WP_HTML_Tag_Processor('<option>' . $taxonomy->labels->all_items . '</option>');
			$option->next_tag();
			$option->set_attribute('value', 'all');

			$options = '';

			if ( null === $selected_term ) {
				$option->set_attribute('selected', true);
			}
			$options .= $option->get_updated_html();

			// Term Options
			foreach ($terms as $term) {
				$option = new WP_HTML_Tag_Processor('<option>' . $term->name . '</option>');
				$option->next_tag();
				$option->set_attribute('value', $term->slug);
				if ($selected_term === $term->slug) {
					$option->set_attribute('selected', true);
				}
				$options .= $option->get_updated_html();
			}


			$select = new WP_HTML_Tag_Processor('<select>' . $options . '</select>');
			$select->next_tag();

			// apply all of the data attributes
			foreach ($data_attributes as $key => $value) {
				$select->set_attribute($key, $value);
			}

			return $select->get_updated_html();
		}

		private function get_query_filter_buttons($query_id, $taxonomy, $terms, $data_attributes)
		{
			$content = self::get_query_filter_button($taxonomy->labels->all_items, 'all', $taxonomy->name, $query_id, $data_attributes);

			foreach ($terms as $term) {
				$content .= self::get_query_filter_button($term->name, $term->slug, $taxonomy->name, $query_id, $data_attributes);
			}

			return $content;
		}

		private function get_query_filter_button($name, $slug, $taxonomy_slug, $query_id, $data_attributes)
		{
			$item_id = "query-filter-$query_id-$slug";

			$input = new WP_HTML_Tag_Processor('<input />');
			$input->next_tag();
			$input->set_attribute('id', $item_id);
			$input->set_attribute('type', 'radio');
			$input->set_attribute('name', 'filter_query_sector');
			$input->set_attribute('value', $slug);

			// apply all of the data attributes
			foreach ($data_attributes as $key => $value) {
				$input->set_attribute($key, $value);
			}

			$selected_term = null;
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			if (isset($_GET['query-filter-' . $query_id])) {
				$selected_term = $_GET['query-filter-' . $query_id]; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			}

			// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			if ( $selected_term === $slug) {
				$input->set_attribute('checked', true);
			}

			// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			if ( null === $selected_term && $slug === 'all') {
				$input->set_attribute('checked', true);
			}

			$label = new WP_HTML_Tag_Processor('<label>' . $name . '</label>');
			$label->next_tag();
			$label->set_attribute('for', $item_id);

			$is_checked = $selected_term
				? $selected_term === $taxonomy_slug . '.' . $slug
				: $slug === 'all';

			if ($is_checked) {
				$label->set_attribute('class', 'selected');
			}

			return $input->get_updated_html() . $label->get_updated_html();
		}

		private static function find_inner_block($inner_blocks, $block_name)
		{
			foreach ($inner_blocks as $block) {
				if ($block['blockName'] === $block_name) {
					return $block;
				}

				if (!empty($block['innerBlocks'])) {
					$result = self::find_inner_block($block['innerBlocks'], $block_name);
					if ($result) {
						return $result;
					}
				}
			}

			return null;
		}

		public static function pre_render_query_block($pre_render, $parsed_block)
		{
			if ('core/query' !== $parsed_block['blockName']) {
				return $pre_render;
			}

			if (!isset($parsed_block['attrs']['queryId'])) {
				return $pre_render;
			}

			// if one of the inner blocks is a query filter, we need to modify the query args
			$query_filter_block = self::find_inner_block($parsed_block['innerBlocks'], 'twentybellows/taxonomy-query-filter');

			if (! $query_filter_block) {
				return $pre_render;
			}

			$query_id = $parsed_block['attrs']['queryId'];
			$taxonomy_slug = $query_filter_block['attrs']['taxonomy'] ?? null;
			$term_slug = $_GET['query-filter-' . $query_id] ?? null; // phpcs:ignore WordPress.Security.NonceVerification.Recommended

			add_filter('query_loop_block_query_vars', function ($query) use ($term_slug, $taxonomy_slug) {

				if ($term_slug === 'all' || $term_slug === null) {
					$query['tax_query'] =[[
						'taxonomy' => $taxonomy_slug,
						'operator' => 'EXISTS',
					]];
				}
				else {
					$query['tax_query'] = [[
						'taxonomy' => $taxonomy_slug,
						'field'    => 'slug',
						'terms'    => $term_slug,
					]];
				}
				return $query;
			});

			return $pre_render;
		}
	}
}
