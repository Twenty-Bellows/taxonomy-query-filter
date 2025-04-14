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

### Plugin Test & Evaluation

In order to test the released assets in a quick environment with the Plugin Checker plugin you can do the following:

```bash
npm install
npm run build
npm run plugin-zip
npm run plugin-test
```

A `wp-now` environment will quickly spin up and open and you can test the plugin. Note that for this environment Docker is not needed. (Node is the only requirement.)

`build` created assets in /build
`plugin-zip` will package the necessary assets into `taxonomy-query-filter.zip`
`plugin-test` will extract the contents of that file into `/release/taxonomy-query-filter/` and run a playground instance from that folder.
