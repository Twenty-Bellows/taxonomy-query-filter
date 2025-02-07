<?php
require_once dirname(__FILE__) . '/wp-load.php';

// Create categories
$categories = [
  'Technology' => 'Posts about tech',
  'Travel' => 'Posts about travel',
  'Food' => 'Posts about food'
];

foreach ($categories as $name => $description) {
  wp_insert_term($name, 'category', array('description' => $description));
}

// Create posts with different categories
$posts = [
  [
    'title' => 'Sample Tech Post',
    'content' => 'This is a technology related post.',
    'category' => 'Technology'
  ],
  [
    'title' => 'Sample Travel Post',
    'content' => 'This is a travel related post.',
    'category' => 'Travel'
  ],
  [
    'title' => 'Sample Food Post',
    'content' => 'This is a food related post.',
    'category' => 'Food'
  ]
];

foreach ($posts as $post) {
  $category = get_term_by('name', $post['category'], 'category');
  wp_insert_post(array(
    'post_title' => $post['title'],
    'post_content' => $post['content'],
    'post_status' => 'publish',
    'post_category' => array($category->term_id)
  ));
}

$seed_pattern = <<<EOT
<!-- wp:query {"queryId":1,"query":{"perPage":2,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false,"taxQuery":null,"parents":[],"format":[]}} -->
<div class="wp-block-query"><!-- wp:twentybellows/query-filter /-->

<!-- wp:post-template -->
<!-- wp:post-title /-->

<!-- wp:post-date /-->
<!-- /wp:post-template -->

<!-- wp:query-pagination -->
<!-- wp:query-pagination-previous /-->

<!-- wp:query-pagination-numbers /-->

<!-- wp:query-pagination-next /-->
<!-- /wp:query-pagination -->

<!-- wp:query-no-results -->
<!-- wp:paragraph -->
<p>Sorry there are no posts here.</p>
<!-- /wp:paragraph -->
<!-- /wp:query-no-results --></div>
<!-- /wp:query -->
EOT;

// Insert test page with core/query-loop
$page = array(
  'post_title' => 'Query Filter Test Page',
  'post_content' => $seed_pattern,
  'post_status' => 'publish',
  'post_type' => 'page'
);
wp_insert_post($page);