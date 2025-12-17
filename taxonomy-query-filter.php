<?php

/**
 * Plugin Name:       Taxonomy Query Filter
 * Plugin URI: 	      https://github.com/Twenty-Bellows/taxonomy-query-filter
 * Description:       Add user controlled taxonomy filters for Query Loop
 * Requires at least: 6.6
 * Requires PHP:      7.2
 * Version:           1.0.1
 * Author:            Twenty Bellows
 * Author URI:        https://twentybellows.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       taxonomy-query-filter
 */

if (! defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

require_once __DIR__ . '/includes/class-taxonomy-query-filter.php';

add_action('init', function () {
	register_block_type(__DIR__ . '/build');
});

add_filter('pre_render_block', ['Twenty_Bellows_Query_Filter', 'pre_render_query_block'], 0, 2);
