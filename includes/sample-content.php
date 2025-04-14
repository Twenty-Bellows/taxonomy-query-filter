<?php

require_once( ABSPATH . '/wp-admin/includes/taxonomy.php');

//remove all posts
$posts = get_posts(['numberposts' => -1]);
foreach ($posts as $post) {
	wp_delete_post($post->ID, true);
}

//remove all pages
$pages = get_pages();
foreach ($pages as $page) {
	wp_delete_post($page->ID, true);
}

//remove all categories
$categories = get_categories(['hide_empty' => false]);
foreach ($categories as $category) {
	wp_delete_category($category->term_id);
}

// Create categories
$cat_alpha = wp_create_category('Alpha');
$cat_beta = wp_create_category('Beta');
$cat_gamma = wp_create_category('Gamma');

// Create posts
wp_insert_post([
	'post_title' => 'First Post',
	'post_content' => 'This is the first post.',
	'post_status' => 'publish',
	'post_category' => [$cat_alpha]
]);

wp_insert_post([
	'post_title' => 'Second Post',
	'post_content' => 'This is the second post.',
	'post_status' => 'publish',
	'post_category' => [$cat_beta]
]);

wp_insert_post([
	'post_title' => 'Third Post',
	'post_content' => 'This is the third post.',
	'post_status' => 'publish',
	'post_category' => [$cat_gamma]
]);

// Create page with block markup
$page_markup = <<<MARKUP
<!-- wp:query {"queryId":23,"query":{"perPage":10,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false,"taxQuery":{"category":[],"post_tag":[]},"parents":[],"format":[],"enhancedPagination":true},"enhancedPagination":true} -->
<div class="wp-block-query">
  <!-- wp:twentybellows/taxonomy-query-filter /-->
  <!-- wp:post-template -->
  <!-- wp:post-title {"isLink":true} /-->
  <!-- /wp:post-template -->
</div>
<!-- /wp:query -->
MARKUP;

wp_insert_post([
	'post_title' => 'Query Filter Page',
	'post_content' => $page_markup,
	'post_status' => 'publish',
	'post_type' => 'page'
]);
