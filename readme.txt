=== Ajaxify Comments - Lazy Load and No Reload Comments ===
Contributors: ronalfy
Tags: AJAX, comments, lazy load, errors, refresh
Requires at least: 5.0
Tested up to: 6.4
Stable tag: 2.1.0
Requires PHP: 7.2
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Donate link: https://github.com/sponsors/DLXPlugins

Ajaxify Comments hooks into WordPress comments and allows comment posting without reloading the page. It supports lazy loading, and allows comments to load in the background. This can help speed up your page load time.

== Description ==

Skip page reloads and separate error screens when posting comments. Ajaxify Comments hooks into your native WordPress comment system and allows comment posting without a page reload. Lazy loading is also supported, which can help speed up your page load time.

=== TLDR ===

<a href="https://docs.dlxplugins.com/v/ajaxify-comments/first-time-users/getting-started">Getting Started Guide</a> | <a href="https://github.com/sponsors/DLXPlugins">Sponsor us on GitHub</a> | <a href="https://dlxplugins.com/plugins/ajaxify-comments">Ajaxify Home</a>

Ajaxify Comments hooks into your theme and improves the usability of the comment form by validating and adding comments without the need of page reloads. Users can remain on the page and interact with new comments as they're posted. This plugin also supports lazy loading of comments, which can help speed up your page load time.


=== Introduction ===

When submitting the comment form, WordPress by default reloads the entire page. This can be a disorienting experience for the user. In the case of errors in the comment (invalid email, duplicate comment, empty comment), these often require a separate error screen and the user has to use the back button to edit their comment. This can be a frustrating experience for the user. Adding to that, comments can be resource intensive, and can slow down your page load time.

With Ajaxify Comments, comments are posted without a page reload. If there are errors, the error message is shown immediately, so the user can correct their comment.

Ajaxify Comments also comes with lazy loading of the comments section. For a page with a lot of comments, this can speed things up considerably. You can load comments when the DOM is ready or when the comment section is scrolled into view.

Moreover this plugin includes an option to automatically refresh the comments on the current page while the user stays on your page without requiring a page reload. This can be helpful in busy comment sections where reply response time is important.

=== Quick Resource Links ===

Here are some helpful links to help you get started with Ajaxify Comments:

1. <a href="https://docs.dlxplugins.com/v/ajaxify-comments/first-time-users/getting-started">Getting Started Guide</a>
2. <a href="https://docs.dlxplugins.com/v/ajaxify-comments/advanced-topics/lazy-loading-comments">Lazy Loading Comments</a>
3. <a href="https://docs.dlxplugins.com/v/ajaxify-comments/first-time-users/menu-helper">Menu Helper and Selectors</a>
4. <a href="https://docs.dlxplugins.com/v/ajaxify-comments/advanced-topics/wpml-and-translations">Translating Using WPML</a>

=== Requirements and Compatibility ===

Please use the native WordPress comment system with Ajaxify Comments.

The plugin has integrations with:

1. <a href="https://docs.dlxplugins.com/v/ajaxify-comments/plugin-integrations/confetti">Confetti</a> - Show confetti when a comment is posted.
2. <a href="https://docs.dlxplugins.com/v/ajaxify-comments/plugin-integrations/comment-edit-core">Comment Edit Core</a> - Allow users to edit their comments.

The following themes are supported out of the box:

1. <a href="https://wordpress.org/themes/astra/">Astra</a>
2. Genesis
3. <a href="https://wordpress.org/themes/ollie/">Ollie</a>
4. Twenty Ten - Twenty Twenty Three

Ajaxify Comments should be compatible with most block themes. If <a href="https://docs.dlxplugins.com/v/ajaxify-comments/first-time-users/menu-helper">Menu Helper</a> can't find the selectors, please leave a support request.

=== Technical Note ===

Since the plugin hooks into the theme on client-side to intercept the comment form submit process, and to add new comments without reloading the page, the plugin needs to access the DOM nodes using jQuery selectors. The plugin comes with default values for these selectors that were successfully tested with WordPress' default themes "Twenty Ten", "Twenty Eleven", "Twenty Twelve", "Twenty Thirteen", "Twenty Fourteen", "Twenty Fifteen", "Twenty Sixteen". If required, the selectors can be customized to match your theme in the plugin's settings.

> <a href="https://docs.dlxplugins.com/v/ajaxify-comments/first-time-users/menu-helper">Menu Helper</a> is available to help you find the theme's selectors.

=== Features ===

Ajaxify Comments is community supported. If you would like to add or change anything about the plugin, please consider assisting with the development on <a href="https://github.com/DLXPlugins/wp-ajaxify-comments">GitHub</a>.

* Post comments without a page reload.
* Show error messages without a page reload.
* Lazy load comments.
* Automatically refresh comments.
* Comment form validation.
* Support for pages with multiple comment forms.
* Support for threaded and moderated comments.
* Compatible with most spam plugins.
* Menu Helper to help you find the right selectors for your theme.
* Appearance preview to see how the plugin will look on your site.
* Simulate Ajaxify Comments enabled or disabled for testing and to compare the difference.
* Translate and customize the default WordPress comment messages.

=== Questions/Help? ===

Please use the <a href="https://wordpress.org/support/plugin/wp-ajaxify-comments">support forum</a> to ask questions or to report issues.

> Most questions can be resolved by checking out our docs site. <a href="https://docs.dlxplugins.com/v/ajaxify-comments">https://docs.dlxplugins.com/v/ajaxify-comments</a> - the Search is AI, so it should be able to find what you're looking for.

=== Credits ===

This plugin was initially developed by Jan Jonas starting in 2012. Company <a href="https://weweave.net/">weweave</a> maintained the plugin from 2014-2022.

== Installation ==

See: <a href="https://docs.dlxplugins.com/v/ajaxify-comments/first-time-users/installing-the-plugin">Plugin Installation</a>.

If you have activated the plugin and are just getting started, please see our <a href="https://docs.dlxplugins.com/v/ajaxify-comments/first-time-users/getting-started">Getting Started</a> guide.

== Screenshots ==

1. Ajaxify Comments demonstration with inline error messages displayed
2. Info overlay after the comment has successfully been posted
3. Error overlay with error message when posting a comment failed
4. Settings page (for customizing the plugin)

== Frequently Asked Questions ==

= I'm using WPML. How do I translate this plugin? =

WPML is an advanced topic, but we've put together a guide to help you <a href="https://docs.dlxplugins.com/v/ajaxify-comments/advanced-topics/wpml-and-translations">translate Ajaxify Comments using WPML</a>.

= Ajaxify Comments isn't working when I install it. What's wrong? =

More than likely you need to set up your selectors. <a href="https://docs.dlxplugins.com/v/ajaxify-comments/advanced-topics/selectors">Selectors</a> are an advanced topic, which is why we've created Menu Helper. Menu Helper will help you find the right selectors for your theme. Please see our <a href="https://docs.dlxplugins.com/v/ajaxify-comments/first-time-users/menu-helper">Menu Helper guide</a> for more information.

= How do I enable lazy loading? =

Lazy Loading is an advanced topic, but we've put together <a href="https://docs.dlxplugins.com/v/ajaxify-comments/advanced-topics/lazy-loading-comments">a guide to help you understand how to enable lazy loading</a>.

== Changelog ==

= 2.0.15 =
* Released 2023-10-24
* Fixing undefined callback error with OnAfterPostComment callback.

= 2.0.14 =
* Released 2023-10-20
* Resolving Ajax compatibility issue with Ninja Forms.
* Successfully tested with WP 6.4.

= 2.0.11 =
* Released 2023-10-06
* Added WPML support to the plugin (<a href="https://docs.dlxplugins.com/v/ajaxify-comments/advanced-topics/wpml-and-translations">docs on how to set this up</a>).
* Added duplicate comment label setting.
* Added support for the Ollie theme.
* Updated Menu Helper to better support block-enabled themes.

= 2.0.9 =
* Released 2023-10-03
* Added CSS class to overlay for easier styling.
* Added WPML config for translatable string options.

= 2.0.7 =
* Released 2023-09-30
* Placed `gettext` call only on comment posting, improving performance.
* Resolved improper `functions.php` inclusion.
* New filter for changing options before they are output as JSON.

= 2.0.5 =
* Released 2023-09-28
* Refactoring lazy loading. It should be much more reliable now. It has been tested with Astra, Twenty Twenty-Three, and Genesis themes.
* Updating Menu Helper to simulate lazy loading on or off.

= 2.0.1 =
* Released 2023-09-27
* Lazy loading was referencing the wrong variable. This has been fixed.

= 2.0.0 =
* Released 2023-09-24
* Renamed WP Ajaxify Comments to Ajaxify Comments in the admin. Updated branding.
* Completely refreshed admin interface. The admin is now organized into tabs with quick saving and reset options.
* Appearance tab allows for a real-time preview of the plugin's appearance.
* Appearance tab is a lot more user friendly, allowing for easy customization of the plugin's appearance.
* Added Support tab with helpful links to documentation and support.
* Removed admin notice on plugins screen.
* Replaced admin notice with contextual plugin row notice. This will display whenever debug mode is on, or if the plugin is disabled.
* Added first-time-installation notice for new users who are new to setting up the plugin.
* Added synthetic callback events for the available callbacks. This allows developers to hook into the plugin's events without having to modify the plugin's code.
* Callbacks have a slightly more secure implementation and execution.
* Added a tool called Selector Helper, which will help users find the right selectors for their theme.
* Please <a href="https://dlxplugins.com/announcements/ajaxify-comments-2-0-is-released/">read the announcement post</a> for more information.

= 1.7.5 =
* Released 2023-08-30
* Ensuring compatibility with WordPress 6.3.

== Upgrade Notice ==

= 2.0.15 =
Resolving JS error involving the OnAfterPostComment callback.