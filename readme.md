# Query Filter

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
* Pay special attention to the outer div. `data-wp-interactive` and `data-wp-router-region` need not have different values from one another, but they both need to be unique from any other elements on the page which have those attributes. So you couldn't have two elements which have `data-wp-router-region="foo"` for example.

```html
<div data-wp-interactive="some-unique-id-here" data-wp-router-region="some-unique-thing-here-too">
	<!-- wp:query {"queryId":23,"query":{"perPage":10,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false,"taxQuery":{"category":[],"post_tag":[]},"parents":[],"format":[]}} -->
		<div class="wp-block-query">
			<!-- wp:twentybellows/query-filter /-->
			<!-- wp:post-template -->
			<!-- wp:post-title /-->
			<!-- /wp:post-template -->
		</div>
	<!-- /wp:query -->
</div>
```
