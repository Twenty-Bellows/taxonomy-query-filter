# Taxonomy Query Filter

A WordPress block that adds interactive taxonomy filtering capabilities to Query Loop blocks. This plugin allows visitors to filter posts displayed in a Query Loop by categories, tags, or custom taxonomies without page reloads.

## Features

- **Interactive Filtering**: Add dropdown filters for any taxonomy (categories, tags, custom taxonomies)
- **No Page Reloads**: Uses WordPress Interactivity API for smooth, instant filtering
- **Block Editor Integration**: Seamlessly integrates with the WordPress Query Loop block
- **Responsive**: Works on all devices and screen sizes
- **Developer Friendly**: Clean, extendable code with hooks and filters

## Requirements

- WordPress 6.6 or higher
- PHP 7.2 or higher
- A theme that supports the WordPress Block Editor

## Installation

### From WordPress Plugin Directory

1. Go to **Plugins → Add New** in your WordPress admin
2. Search for "Taxonomy Query Filter"
3. Click **Install Now** and then **Activate**

### Manual Installation

1. Download the plugin zip file
2. Go to **Plugins → Add New** in your WordPress admin
3. Click **Upload Plugin** and select the zip file
4. Click **Install Now** and then **Activate**

### For Development

1. Clone the repository to your `wp-content/plugins` directory
2. Install dependencies: `npm install`
3. Build the plugin: `npm run build`
4. Activate the plugin in WordPress admin

#### Development Commands

- `npm run start` - Start WordPress development environment with xDebug
- `npm run stop` - Stop WordPress development environment
- `npm run build` - Build production assets
- `npm run watch` - Watch files for changes during development
- `npm run test:unit` - Run unit tests
- `npm run plugin-zip` - Create plugin zip file for distribution

**Note**: The development environment includes xDebug support and VSCode launch configuration for PHP debugging.

## Usage

### Basic Setup

1. **Add a Query Loop Block**: Start by adding a Query Loop block to your page or post
2. **Insert the Taxonomy Query Filter**: Inside the Query Loop block, add the Taxonomy Query Filter block
3. **Configure the Filter**: In the block settings, select which taxonomy you want to filter by (categories, tags, or custom taxonomies)
4. **Publish**: Save and publish your page - visitors can now filter the displayed posts

### Example Implementation

Here's a simple example that creates a filterable post list:

1. Create three posts, each assigned to a unique category
2. Create a new page
3. Add the following block markup (copy and paste directly into the editor):

```html
<!-- wp:query {"queryId":23,"query":{"perPage":10,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false,"taxQuery":{"category":[],"post_tag":[]},"parents":[],"format":[]}} -->
	<div class="wp-block-query">
		<!-- wp:twentybellows/taxonomy-query-filter /-->
		<!-- wp:post-template -->
		<!-- wp:post-title /-->
		<!-- /wp:post-template -->
	</div>
<!-- /wp:query -->
```

### Advanced Usage

#### Custom Taxonomies

The filter works with any registered taxonomy. Simply select your custom taxonomy from the block settings.

#### Multiple Filters

You can add multiple Taxonomy Query Filter blocks within the same Query Loop to filter by different taxonomies simultaneously.

#### Styling

The filter uses standard WordPress classes and can be styled with CSS. The main wrapper has the class `.wp-block-twentybellows-taxonomy-query-filter`.

### Plugin Testing

To test the plugin in a quick environment with the Plugin Checker:

```bash
npm install
npm run build
npm run plugin-zip
npm run plugin-test
```

This will:
- Build the plugin assets
- Create `taxonomy-query-filter.zip`
- Extract to `/release/taxonomy-query-filter/`
- Launch a WordPress Playground instance for testing

**Note**: No Docker required - only Node.js is needed for the test environment.

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow WordPress Coding Standards
- Write unit tests for new features
- Update documentation as needed
- Test in multiple browsers

## Support

- **Documentation**: [GitHub Wiki](https://github.com/Twenty-Bellows/taxonomy-query-filter/wiki)
- **Issues**: [GitHub Issues](https://github.com/Twenty-Bellows/taxonomy-query-filter/issues)
- **Support Forum**: [WordPress.org Support](https://wordpress.org/support/plugin/taxonomy-query-filter/)

## License

This plugin is licensed under the GPL v2 or later.

```
This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.
```

## Credits

Developed by [Twenty Bellows](https://twentybellows.com)
