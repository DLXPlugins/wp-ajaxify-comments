=== WP Ajaxify Comments ===
Contributors: ronalfy
Tags: AJAX, comments, comment, themes, theme
Requires at least: 5.0
Tested up to: 6.3.1
Stable tag: 2.0.0
License: GPLv2
License URI: http://www.gnu.org/licenses/gpl-2.0.html

WP Ajaxify Comments hooks into your comment form and adds AJAX functionality - no page reloads required when validating, posting or updating comments

== Description ==

**Introduction**

When submitting the comment form, WordPress by default reloads the entire page. In the case of an error (e.g. an invalid email address or an empty comment field) the error message is shown on top of a new (blank) screen and the user has to use the browser's back button to correct his inputs before posting the comment again.

The <a href="https://dlxplugins.com/plugins/ajaxify-comments">WP Ajaxify Comments WordPress plugin</a> hooks into any WordPress theme and adds AJAX functionality to the comment form: When the user submits his comment, the plugin sends the data to the WordPress backend without reloading the entire page. In the case of an error, the plugin shows an overlay containing the error message so that the user can correct his comment without navigating back. If the comment has been posted successfully, the plugin adds the (new) comment to the list of existing comments without leaving the page and shows an information overlay.

Moreover this plugin includes an option to automatically refresh the comments on the current page while the user stays on your page without requiring a page reload.

**tl;dr**

WP Ajaxify Comments hooks into your theme and improves the usability of the comment form by validating and adding comments without the need of page reloads.

**Technical note**

Since the plugin hooks into the theme on client-side to intercept the comment form submit process, and to add new comments without reloading the page, the plugin needs to access the DOM nodes using jQuery selectors. The plugin comes with default values for these selectors that were successfully tested with WordPress' default themes "Twenty Ten", "Twenty Eleven", "Twenty Twelve", "Twenty Thirteen", "Twenty Fourteen", "Twenty Fifteen", "Twenty Sixteen". If required, the selectors can be customized to match your theme in the plugin's settings.

**Important**

If the plugin does not work out of the box with your theme, custom selectors could be defined in the plugin's settings. The plugin is highly customizable and *We're aware of only a few conflicts with any themes or other plugins that cannot be resolved* (see "Known incompatibilities" in the FAQ section).

**Some features of the plugin**

* Actively developed and supported
* Validating and adding comments without page reloads
* Seamless integration with almost every theme (default options should work with most themes)
* i18n support (included localizations for ar, ca, da-DK, de-DE, es-ES, fa-IR, fr-FR, he-IL, hu-HU, nl-NL, pl-PL, pt-BR, ru-RU, sk-SK, tr-TR, uk, vi-VN, zh-CN)
* Support for customizing (default) WordPress messages
* Support for threaded comments
* Support for comments that await moderation
* Support for pages with multiple comment forms
* Compatibility with comment spam protection plugins and other plugins that extend/manipulate the comment form
* Admin frontend to customize the look and feel
* (Automatic) fallback mode uses complete page reloads if the plugin is not configured properly or any incompatibility is detected
* Client-side JavaScript API (see FAQ for more details)
* Automatically updating comments while user stays on page
* Option to load comments asynchronously with secondary AJAX request if page contains more than a specified number of comments
* Option to save bandwidth for AJAX responses
* Debug mode to support troubleshooting


== Screenshots ==

1. Info overlay after the comment has successfully been posted
2. Error overlay with error message when posting a comment failed
3. Settings page (for customizing the plugin)


== Installation ==

1. Upload wp-ajaxify-comments.zip to your WordPress plugins directory, usually `wp-content/plugins/` and unzip the file. It will create a `wp-content/plugins/wp-ajaxify-comments/` directory.
1. Activate the plugin through the "Plugins" menu in WordPress.
1. Enable the plugin on the plugin's settings page (Settings > WP Ajaxify Comments)


== Changelog ==

= 1.7.5 =
* Released 2023-08-30
* Ensuring compatibility with WordPress 6.3.

= 1.7.4 =
* Fixed HTML5 validation warning for script tag

= 1.7.3 =
* Updated default value for "Comments container selector" to work with default theme "Twenty Twenty" without breaking compatibility to older (default) themes

= 1.7.2 =
* Added compatibility to older WordPress versions (< 5.2.0) and to WordPress 5.6

= 1.7.1 =
* Added compatibility to latest WordPress versions >= 5.5.0
* Updated Waypoints library to 4.0.1
* Updated jQuery blockUI plugin to 2.70.0
* Updated Idle Timer to 1.1.1
* Updated jsUri to 1.3.1

= 1.7.0 =
* Preserve focus element when reloading comments
* Fixed deprecated error in PHP 7.4

= 1.6.2 =
* Added compatibility to latest WordPress versions

= 1.6.1 =
* Optimized JavaScript injection

= 1.6.0 =
* Removed dependency to PHP session

= 1.5.1 =
* Fixed "Undefined variable: wpac_options"

= 1.5.0 =
* Added JavaScript callback "OnAfterPostComment"

= 1.4.1 =
* Prevent the comment form from being submitted multiple times in parallel
* Fixed PHP notice "Undefined index: pagenow" (thanks to ravipatel)

= 1.4.0 =
* Added (expert) option "Enable by query"

= 1.3.0 =
* Added request parameters "WPACAll", "WPACSkip" and" WPACTake" to query comments

= 1.2.0 =
* Added (expert) option "Disable cache"
* Use GET request when updating comments

= 1.1.1 =
* Fixed link to settings page in admin frontend

= 1.1.0 =
* Fixed compatibility to WordPress 4.1
* Changed plugin name from "WP-Ajaxify-Comments" to "WP Ajaxify Comments"

= 1.0.0 =
* Changed plugin owner to weweave an added professional support
* Added (expert) option "Base URL" to support reverse proxy configuration
* Fixed page title update for titles containing UTF-8 characters
* Typo fix in default localization

= 0.25.0 =
* Loading comments now updates page title (thanks to Jincheng Shan)
* OnBeforeSubmitComment callback is now called before submitUrl is extracted

= 0.24.1 =
* Updated localization for zh-CN (thanks to Jincheng Shan)
* Added CDATA tag for inline JavaScript (thanks to Jincheng Shan)

= 0.24.0 =
* Added parameter commentUrl to callbacks OnBeforeUpdateComments and OnAfterUpdateComments

= 0.23.1 =
* Changed order of links in plugin overview
* Make sure WPAC._Options is always initialized
* Bugfix for comment paging links

= 0.23.0 =
* Added (expert) option "Place scripts in footer"
* Added option "Comment links selector" to prevent (complete) page loads for comment links on pages if "Break comments into pages [...]" is enabled
* Bugfix for "Users must be registered and logged in to comment"
* Fixed PHP Notice for PHP < 5.4.0

= 0.22.0 =
* Minor optimizations
* Added (expert) option "Optimize AJAX response" to save bandwidth
* Fixed JavaScript includes for HTTPS

= 0.21.0 =
* Added option "Disable scroll to anchor"
* Fixed paging support and async comment loading for pages where comments are closed
* Fixed compressed JavaScript file
* Fixed support for URLs with comments anchor if async comment loading is enabled

= 0.20.0 =
* Added option "Post container" to support for multiple comment forms per page
* Added option "Comment pages URL regex" to support none default WordPress comment pages

= 0.19.0 =
* Added parameter newDom to callbacks OnBeforeUpdateComments and OnAfterUpdateComments
* Fixed JavaScript error "TypeError: WPAC._Options is undefined" (thanks to Suzanne Ahjira)
* Fixed JavaScript error in Internet Explorer (thanks to timhengeveld)

= 0.18.1 =
* Fixed double slashes in JavaScript include (thanks to Mr Press)

= 0.18.0 =
* Added option to define when to load comments asynchronously with secondary AJAX request
* Optimized JavaScript includes (use compressed/merged JavaScript file and only include files if they are needed)

= 0.17.3 =
* Fixed "Undefined index" PHP notice (thanks to fergomez)

= 0.17.2 =
* Fixed compatibility to wpMandrill (thanks to paddywagon)

= 0.17.1 =
* "OnAfterUpdateComments" callback is now called after form data has been reset

= 0.17.0 =
* Added options to customize (default) WordPress messages
* Disabled (auto) scrolling when comments are updated by "Auto update idle time"
* Fixed compatibility to jQuery "no conflict mode"

= 0.16.1 =
* Bugfix for cross-domain scripting detection

= 0.16.0 =
* Added option "Auto update idle time" to automatically update comments if user is "idle"
* Updated jQuery blockUI to 2.64

= 0.15.0 =
* Added option to disable URL updating

= 0.14.3 =
* Fixed some PHP strict warnings

= 0.14.2 =
* Fixed compatibility to PHP < 5.4.0

= 0.14.1 =
* Fixed compatibility to jQuery "no conflict mode"

= 0.14.0 =
* Added options to customize texts
* WPAC.RefreshComments() and WPAC.LoadComments() now accept option object (and added option "showLoadingInfo" to suppress loading overlay)
* Updated jQuery blockUI to 2.61
* Added jsuri 1.1.1 to avoid query strings with duplicated WPAC fallback parameters

= 0.13.1 =
* Comment paging now updates browser URL
* Added localization for da-DK (thanks to Bjarne Maschoreck)
* Bugfix for themes where comment form is not nested in comment container
* Bugfix for clearing all settings (thanks to HarroH)

= 0.13.0 =
* Ajaxified comment paging
* Improved debug support for cross-domain scripting problems

= 0.12.1 =
* Hotfix for environments where PHP is not installed as an Apache module

= 0.12.0 =
* Bug-fix: Options are no longer saved if validation fails
* Refactored and extended client-side JavaScript API
* Updated localization for de-DE
* Added option to load comments asynchronously with secondary AJAX request

= 0.11.0 =
* Added localization for hu-HU (thanks to Patrik Bagi)
* Added option to customize the overlay's width
* Added option to customize the overlay's padding

= 0.10.0 =
* Added localization for he-LI (thanks to Siman-Tov Yechiel (<a href="http://www.wpstore.co.il" target="_blank">www.wpstore.co.il</a>))
* Added JavaScript callback ("Before submit comment")
* Updated jQuery blockUI to 2.57

= 0.9.0 =
* Added JavaScript method wpac_init() to enable manual client side initialization
* Optimized SQL queries (thanks to Geleosan)
* Added validation for "scrollSpeed" option
* Fixed debug alert message in IE 9
* Added localization for sk-SK (thanks to Branco, Slovak translation (<a href="http://webhostinggeeks.com/user-reviews/" target="_blank">WebHostingGeeks.com</a>))

= 0.8.0 =
* Added option to customize the font size
* Added i18n support for admin frontend

= 0.7.0 =
* Added JavaScript callback ("Before select elements")

= 0.6.3 =
* Added localization for ar (thanks to sha3ira)

= 0.6.2 =
* Fixed some PHP warnings (thanks to petersb)
* Fixed HTTPS check for ISAPI under IIS
* Added support for non-standard HTTP port
* Fixed handling of unexpected/unsupported server responses

= 0.6.1 =
* Added localization for ru-RU and uk (thanks to Валерий Сиволап)

= 0.6.0 =
* Added JavaScript callbacks ("Before update comments" and "After update comments")

= 0.5.4 =
* jQuery 1.7+ compatibility: Use on() or delegate() if available instead of deprecated live() (thanks to tzdk)

= 0.5.3 =
* Added localization for tr-TR (thanks to Erdinç Aladağ)
* Added localization for pt-BR (thanks to Leandro Martins Guimarães)

= 0.5.2 =
* Added localization for fa-IR (thanks to rezach4)

= 0.5.1 =
* Updated localization for zh-CN (thanks to Liberty Pi)
* Updated jQuery blockUI to 2.42 (thanks to Mexalim)

= 0.5.0 =
* Success overlay now supports comments that are awaiting moderation
* Add "?" when commentUrl has no query string to reload page in case of partial page update fails
* More detailed debug messages and debug support for Internet Explorer 9
* Added localization for ca (thanks to guzmanfg)

= 0.4.1 =
* Added localization for nl-NL (thanks to Daniël Tulp)

= 0.4.0 =
* Success and error overlays now show default cursor instead of loading cursor
* Fixed problems for translations containing double quotes
* Cancel AJAX request if cross-domain scripting is detected
* Added options to customize the look and feel
* Added localization for vi-VN (thanks to Nguyễn Hà Duy Phương)
* Added localization for es-ES (thanks to guzmanfg)
* Updated localization for de-DE

= 0.3.4 =
* Added localization for pl-PL (thanks to Jacek Tomaszewski)

= 0.3.3 =
* Bugfix for Internet Explorer

= 0.3.2 =
* Added localization for fr-FR (thanks to saymonz)

= 0.3.1 =
* Added localization for zh-CN (thanks to Liberty Pi)

= 0.3.0 =
* Added i18n support
* Added localization for de-DE

= 0.2.1 =
* Fallback mode reloads page with comment anchor
* Bug-fix for themes where comment form is nested in comments container (thanks to saymonz)

= 0.2.0 =
* Added Option "Error Container Selector" to customize the error message extraction
* Added compatibility with comment spam protection plugins like "NoSpamNX" (thanks to Liberty Pi)
* Removed timeout for loading overlay (thanks to saymonz)

= 0.1.2 =
* Fixed compatibility with setting pages of other plugins (thanks to saymonz)
* Reactivated warning and info notices on admin page "Plugins"

= 0.1.1 =
* Fixed updating of browser address bar

= 0.1.0 =
* Support for themes with threaded comments where form tag is not nested in comment container
* (Smooth) scrolling to new comment after new comment has been posted
* Update browser address bar to show comment URL after new comment has been posted
* Abort plugin initialization on pages and posts where comments are not enabled
* Info overlay when complete page reload is performed in fallback mode

= 0.0.2 =
* Fixed error with warning and info notices on admin page "Plugins"

= 0.0.1 =
* Initial release

== Upgrade Notice ==

= 1.7.4 =
* Fixed HTML5 validation warning for script tag

= 1.7.3 =
* Updated default value for "Comments container selector"

= 1.7.2 =
* Added compatibility to older WordPress versions (< 5.2.0) and to WordPress 5.6

= 1.7.1 =
* Added compatibility to latest WordPress versions >= 5.5.0 and updated external libraries

= 1.7.0 =
* Preserve focus element when reloading comments and fixed deprecated error in PHP 7.4

= 1.6.2 =
* Added compatibility to latest WordPress versions

= 1.6.1 =
* Optimized JavaScript injection

= 1.6.0 =
* Removed dependency to PHP session

= 1.5.1 =
* "Undefined variable: wpac_options"

= 1.5.0 =
* Added JavaScript callback "OnAfterPostComment"

= 1.4.1 =
* Prevent the comment form from being submitted multiple times in parallel, fixed PHP notice "Undefined index: pagenow"

= 1.4.0 =
* Added (expert) option "Enable by query"

= 1.3.0 =
* Added request parameters "WPACAll", "WPACSkip" and "WPACTake"

= 1.2.0 =
* Added (expert) option "Disable cache", use GET request when updating comments

= 1.1.1 =
* Fixed link to settings page in admin frontend

= 1.1.0 =
* Fixed compatibility to WordPress 4.1

= 1.0.0 =
* Added (expert) option "Base URL" to support reverse proxy configuration, fixed page title update for titles containing UTF-8 characters, typo fix

= 0.25.0 =
* Loading comments now updates page title, OnBeforeSubmitComment callback is now called before submitUrl is extracted

= 0.24.1 =
* Updated localization for zh-CN

= 0.24.0 =
* Added parameter commentUrl to callbacks OnBeforeUpdateComments and OnAfterUpdateComments

= 0.23.1 =
* Changed order of links in plugin overview, Make sure WPAC._Options is always initialized, Bugfix for comment paging links

= 0.23.0 =
* Added (expert) option "Place scripts in footer", Bugfix for "Users must be registered and logged in to comment", Added option "Comment links selector", Fixed PHP Notice for PHP < 5.4.0

= 0.22.0 =
* Minor optimizations, Added (expert) option "Optimize AJAX response", Bugfix for HTTPS

= 0.21.0 =
* Added option "Disable scroll to anchor", Bugfixes for pages where comments are closed and/or async comment loading is enabled, Fixed compressed JavaScript file

= 0.20.0 =
* Added support for multiple comment forms per page and support for none default WordPress comment pages

= 0.19.0 =
* Added parameter newDom to callbacks OnBeforeUpdateComments and OnAfterUpdateComments, Fixed JavaScript errors

= 0.18.1 =
* Fixed double slashes in JavaScript include

= 0.18.0 =
* Optimized JavaScript includes, Added option to customize trigger for asynchronous comment loading

= 0.17.3 =
* Fixed "Undefined index" PHP notice

= 0.17.2 =
* Fixed compatibility to wpMandrill

= 0.17.1 =
"OnAfterUpdateComments" callback is now called after form data has been reset

= 0.17.0 =
Options to customize (default) WordPress messages, Disabled (auto) scrolling when comments are updated by "Auto update idle time", Fixed compatibility to jQuery "no conflict mode"

= 0.16.1 =
Bugfix for cross-domain scripting detection

= 0.16.0 =
Added option to automatically update comments if user is "idle", Updated jQuery blockUI to 2.64

= 0.15.0 =
Added option to disable URL updating

= 0.14.3 =
Fixed some PHP strict warnings

= 0.14.2 =
Fixed compatibility to PHP < 5.4.0

= 0.14.1 =
Fixed compatibility to jQuery "no conflict mode"

= 0.14.0 =
Added options to customize texts, Updated jQuery blockUI to 2.61, Improved client-side API, Added jsuri 1.1.1 to optimize query string sin fallback URLs

= 0.13.1 =
Bug-fixes, improved URL updating, added localization for da-DK

= 0.13.0 =
Ajaxified comment paging, added localization for da-DK

= 0.12.1 =
Hotfix for environments where PHP is not installed as an Apache module

= 0.12.0 =
Bug-fixes, refactored and extended client-side JavaScript API

= 0.11.0 =
Added localization for hu-HU, added more options to customize the overlays

= 0.10.0 =
Added localization for he-LI, added JavaScript callback ("Before submit comment"), updated jQuery blockUI to 2.57

= 0.9.0 =
Added JavaScript method wpac_init(), optimzed SQL queries, fixed debug alert in IE 9, added localization for sk-SK

= 0.8.0 =
Added option to customize the font size, i18n support for admin frontend

= 0.7.0 =
Added JavaScript callback ("Before select elements")

= 0.6.3 =
Added localization for ar

= 0.6.2 =
Some bug-fixes

= 0.6.1 =
Added localization for ru-RU and uk

= 0.6.0 =
Added JavaScript callbacks

= 0.5.4 =
jQuery 1.7+ compatibility

= 0.5.3 =
Added localization for tr-TR and pt-BR

= 0.5.2 =
Added localization for fa-IR

= 0.5.1 =
Updated localization for zh-CN, Updated jQuery blockUI to 2.42

= 0.5.0 =
Bug-fix, support for comments that are awaiting moderation, more detailed debug messages & debug support for IE 9, added localization for ca

= 0.4.1 =
Added localization for nl-NL

= 0.4.0 =
Bug-fix, added options to customize the look and feel, added localizations (vi-VN and en-ES), updated localization for de-DE

= 0.3.4 =
Added localization for pl-PL

= 0.3.3 =
Bug-fix

= 0.3.2 =
Added localization for fr-FR

= 0.3.1 =
Added localization for zh-CN

= 0.3.0 =
Added i18n support

= 0.2.1 =
Bug-fix & minor improvements

= 0.2.0 =
Added compatibility with comment spam protection plugins

= 0.1.2 =
Bug-fix

= 0.1.1 =
Bug-fix

= 0.1.0 =
Better theme support (for threaded comments) and new features

= 0.0.2 =
Bug-fix

== Upgrade Notice ==

= 1.7.5 =
Ajaxify Comments is under new ownership. Making sure plugin works with WP 6.3+.