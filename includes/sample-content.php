<?php

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

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
$cat_breakfast = wp_create_category('Breakfast');
$cat_lunch = wp_create_category('Lunch');
$cat_dinner = wp_create_category('Dinner');
$cat_dessert = wp_create_category('Dessert');

// Create posts - Breakfast
wp_insert_post([
	'post_title' => 'Fluffy Pancakes',
	'post_content' => 'A classic breakfast favorite with maple syrup.',
	'post_status' => 'publish',
	'post_category' => [$cat_breakfast]
]);

wp_insert_post([
	'post_title' => 'Avocado Toast',
	'post_content' => 'Healthy and delicious smashed avocado on sourdough.',
	'post_status' => 'publish',
	'post_category' => [$cat_breakfast]
]);

// Create posts - Lunch
wp_insert_post([
	'post_title' => 'Caesar Salad',
	'post_content' => 'Fresh romaine with homemade Caesar dressing.',
	'post_status' => 'publish',
	'post_category' => [$cat_lunch]
]);

wp_insert_post([
	'post_title' => 'Chicken Sandwich',
	'post_content' => 'Grilled chicken with fresh vegetables on ciabatta.',
	'post_status' => 'publish',
	'post_category' => [$cat_lunch]
]);

// Create posts - Dinner
wp_insert_post([
	'post_title' => 'Spaghetti Carbonara',
	'post_content' => 'Classic Italian pasta with creamy egg sauce.',
	'post_status' => 'publish',
	'post_category' => [$cat_dinner]
]);

wp_insert_post([
	'post_title' => 'Grilled Salmon',
	'post_content' => 'Fresh Atlantic salmon with lemon and herbs.',
	'post_status' => 'publish',
	'post_category' => [$cat_dinner]
]);

// Create posts - Dessert
wp_insert_post([
	'post_title' => 'Chocolate Chip Cookies',
	'post_content' => 'Warm, gooey cookies loaded with chocolate chips.',
	'post_status' => 'publish',
	'post_category' => [$cat_dessert]
]);

wp_insert_post([
	'post_title' => 'New York Cheesecake',
	'post_content' => 'Rich and creamy classic cheesecake.',
	'post_status' => 'publish',
	'post_category' => [$cat_dessert]
]);

// Create page with block markup
$page_markup = '<!-- wp:query {"queryId":23,"query":{"perPage":10,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false,"taxQuery":{"category":[],"post_tag":[]},"parents":[],"format":[],"enhancedPagination":true},"enhancedPagination":true} -->
<div class="wp-block-query">
  <!-- wp:twentybellows/taxonomy-query-filter /-->
  <!-- wp:post-template -->
  <!-- wp:post-title {"isLink":true} /-->
  <!-- /wp:post-template -->
</div>
<!-- /wp:query -->';

wp_insert_post([
	'post_title' => 'Recipe Collection',
	'post_content' => $page_markup,
	'post_status' => 'publish',
	'post_type' => 'page'
]);
