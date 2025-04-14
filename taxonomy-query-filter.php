<?php

/**
 * Plugin Name:       Taxonomy Query Filter
 * Description:       Add user controlled taxonomy filters for Query Loop
 * Requires at least: 6.6
 * Requires PHP:      7.2
 * Version:           1.0.0
 * Author:            Twenty Bellows
 * Author URI:        https://twentybellows.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       taxonomy-query-filter
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

	if (!isset($parsed_block['attrs']['queryId'])) {
		return $pre_render;
	}

	$query_id = $parsed_block['attrs']['queryId'];
	$query_filters = array();

	// phpcs:ignore WordPress.Security.NonceVerification.Recommended
	foreach ( array_keys($_GET) as $key ) {
		if (strpos($key, 'query-filter-' . $query_id) === 0) {
			// add a sanitized key
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			if ( isset($_GET[$key]) ) {
				// phpcs:ignore WordPress.Security.NonceVerification.Recommended
				$query_filters[] = sanitize_text_field( wp_unslash ($_GET[$key]) );
			}
		}
	}

	if (empty($query_filters)) {
		return $pre_render;
	}

	$query_filter = array_values($query_filters)[0];

	add_filter('query_loop_block_query_vars', function ($query) use ($query_filter) {

		$filter_query_vars = explode('_', $query_filter);
		$taxonomy_slug = $filter_query_vars[0];
		$term_slug = $filter_query_vars[1];

		if ( $term_slug === 'all' ) {
			return $query;
		}

		$tax_query = array();
		$tax_query[] = array(
			'taxonomy' => $taxonomy_slug,
			'field'    => 'slug',
			'terms'    => $term_slug,
		);
		$query['tax_query'] = $tax_query;

		return $query;
	});

	return $pre_render;
}, 10, 2);
