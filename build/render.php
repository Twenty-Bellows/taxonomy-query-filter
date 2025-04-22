<?php
/**
 * Render the query filter block
 *
 * @package TwentyBellows
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

if (!array_key_exists('queryId', $block->context)) {
	return;
}

$query_filter = new Twenty_Bellows_Query_Filter();
echo $query_filter->render_content($block); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
