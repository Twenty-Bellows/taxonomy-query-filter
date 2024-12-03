<?php

/**
 * Plugin Name:       Query Filter
 * Description:       Add taxonomy filters for Query Loop
 * Requires at least: 6.6
 * Requires PHP:      7.2
 * Version:           1.0.0
 * Author:            pbking
 * Author URI:        https://pbking.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       query-filter
 */

if (! defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

add_action('init', function () {
	register_block_type(__DIR__ . '/build');
});

add_filter('pre_render_block', function ($pre_render, $parsed_block) {

	if ('core/query' !== $parsed_block['blockName']) {
		return $pre_render;
	}
	$filter_query_id = isset($_GET['filter_query_id']) ? sanitize_text_field($_GET['filter_query_id']) : '';

	if (! $filter_query_id || intval($filter_query_id) !== $parsed_block['attrs']['queryId']) {
		return $pre_render;
	}

	add_filter('query_loop_block_query_vars', function ($query) {

		// get all of the query variables that begin with 'filter_query_'
		$filter_query_vars = array_filter(array_keys($_GET), function ($key) {
			return strpos($key, 'filter_query_') === 0 && $key !== 'filter_query_id';
		});

		$tax_query = array();

		foreach ($filter_query_vars as $filter_query_var) {
			$taxonomy_slug = str_replace('filter_query_', '', $filter_query_var);
			$term_slug = isset($_GET[$filter_query_var]) ? sanitize_text_field($_GET[$filter_query_var]) : '';

			if ($term_slug) {
				$tax_query[] = array(
					'taxonomy' => $taxonomy_slug,
					'field'    => 'slug',
					'terms'    => $term_slug,
				);
			}
		}

		$query['tax_query'] = $tax_query;
		return $query;
	});

	return $pre_render;
}, 10, 2);
