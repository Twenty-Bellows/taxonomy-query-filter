<?php
/**
 * Render the query filter block
 *
 * @package TwentyBellows
 */

if (!array_key_exists('queryId', $block->context)) {
	return;
}

require_once plugin_dir_path( __DIR__ ) . 'includes/class-taxonomy-query-filter.php';
$query_filter = new Twenty_Bellows_Query_Filter();
echo $query_filter->render_content($block);
