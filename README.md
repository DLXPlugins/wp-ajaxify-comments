# 👋 Welcome to Ajaxify Comments

> Spin up [a test site of the plugin](https://app.instawp.io/launch?t=ajaxify-comments&d=v2).

Ajaxify Comments allows you to post comments without a page reload. As a bonus, error messages that normally require a page reload for the user are also inline.

![ajaxify-comment](https://github.com/DLXPlugins/wp-ajaxify-comments/assets/636521/e011deba-3c3c-447f-8c04-4a2c350f694f)

## 🔗 Quick Links

* <a href="https://wordpress.org/plugins/wp-ajaxify-comments/">WordPress.org plugin page</a>
* <a href="https://dlxplugins.com/plugins/ajaxify-comments/">Ajaxify Comments Landing/Marketing Page</a>
* <a href="https://docs.dlxplugins.com/v/ajaxify-comments/">Documentation</a>

## Support

* <a href="https://wordpress.org/support/plugin/wp-ajaxify-comments/">WordPress.org support</a>
* <a href="https://dlxplugins.com/support/">DLX Plugins support</a>

## Developers

* <a href="https://docs.dlxplugins.com/v/ajaxify-comments/developers/actions-and-filters">Actions and Filters</a>
* <a href="https://docs.dlxplugins.com/v/ajaxify-comments/developers/script-debugging">Script Debugging</a>

### JavaScript events

Ajaxify Comments dispatches lifecycle events on `document`. These events do not require the corresponding callback setting to be configured.

Use `wpacAfterUpdateComments` to initialize functionality after the comments and comment form have been replaced. It runs after comment submission, pagination, lazy loading, and automatic or manual refreshes.

```js
document.addEventListener( 'wpacAfterUpdateComments', function( event ) {
	const { commentUrl, newDom } = event.detail;
	// Initialize functionality for the updated comments.
} );
```

Use `wpacAfterPostComment` when the server has accepted a submitted comment but before the comments are replaced. Its event detail contains `commentUrl` and the `unapproved` moderation status.

Both events can also be handled through jQuery. Access their details through `event.originalEvent.detail`:

```js
jQuery( document ).on( 'wpacAfterUpdateComments', function( event ) {
	const { commentUrl, newDom } = event.originalEvent.detail;
} );
```
