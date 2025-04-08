# Taxonomy Query Filter

A WordPress Block to filter query results.

### Getting Started

install dependencies: `npm install`

start/stop WordPress environment: `npm run start` / `npm run stop`
See documentation for wp-env for more details.

build code: `npm run build`
watch code for changes: `npm run start`

NOTE: The environment run with xDebug enabled and VSCode launch configuration to start a debugging session.  With a plugin like `PHP Debug` installed you can set breakpoints, etc in the PHP code.

### To Test

* Create Three Posts, each assigned to a unique category.
* Create a Page and add to it the following Block Markup which creates a simple query loop with the Query Filter block filtering by category. (Just copy and paste it directly onto the page.)

```html
<!-- wp:query {"queryId":23,"query":{"perPage":10,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false,"taxQuery":{"category":[],"post_tag":[]},"parents":[],"format":[]}} -->
	<div class="wp-blse ock-query">
		<!-- wp:twentybellows/taxonomy-query-filter /-->
		<!-- wp:post-template -->
		<!-- wp:post-title /-->
		<!-- /wp:post-template -->
	</div>
<!-- /wp:query -->
```
