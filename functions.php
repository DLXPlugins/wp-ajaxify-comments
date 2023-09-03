<?php
/**
 * Global Functions and Variables.
 *
 * @package wpac
 */

/**
 * Exit and prevent direct access.
 */
if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct acces not allowed!' );
}

use DLXPlugins\WPAC\Functions as Functions;
use DLXPlugins\WPAC\Options as Options;

function wpac_get_config() {

	return array(
		array(
			'section' => __('General', WPAC_DOMAIN),
			'options' => array(
				'enable' => array(
					'type' => 'boolean',
					'default' => '0',
					'label' => __('Enable plugin', WPAC_DOMAIN),
					'specialOption' => true,
				),
				'debug' => array(
					'type' => 'boolean',
					'default' => '0',
					'label' => __('Debug mode', WPAC_DOMAIN),
				),
			),
		),
		array(
			'section' => __('Selectors', WPAC_DOMAIN),
			'options' => array(
				'selectorCommentForm' => array(
					'type' => 'string',
					'default' => '#commentform',
					'label' => __('Comment form selector', WPAC_DOMAIN),
				),
				'selectorCommentsContainer' => array(
					'type' => 'string',
					'default' => '#comments,.comments-wrapper',
					'label' => __('Comments container selector', WPAC_DOMAIN),
				),
				'selectorCommentPagingLinks' => array(
						'type' => 'string',
						'default' => '#comments [class^=\'nav-\'] a',
						'label' => __('Comment paging links selector', WPAC_DOMAIN),
				),
				'selectorCommentLinks' => array(
						'type' => 'string',
						'default' => '#comments a[href*="/comment-page-"]',
						'label' => __('Comment links selector', WPAC_DOMAIN),
				),
				'selectorRespondContainer' => array(
					'type' => 'string',
					'default' => '#respond',
					'label' => __('Respond container selector', WPAC_DOMAIN),
				),
				'selectorErrorContainer' => array(
					'type' => 'string',
					'default' => 'p:parent',
					'label' => __('Error container selector', WPAC_DOMAIN),
				),
			),
		),
		array(
			'section' => __('Popup overlay', WPAC_DOMAIN),
			'options' => array(
				'popupCornerRadius' => array(
					'type' => 'int',
					'default' => '5',
					'label' => __('Corner radius (px)', WPAC_DOMAIN),
					'pattern' => '/^[0-9]*$/',
				),
				'popupMarginTop' => array(
					'type' => 'int',
					'default' => '10',
					'label' => __('Margin top (px)', WPAC_DOMAIN),
					'pattern' => '/^[0-9]*$/',
				),
				'popupWidth' => array(
					'type' => 'int',
					'default' => '30',
					'label' => __('Width (%)', WPAC_DOMAIN),
					'pattern' => '/^(100|[1-9][0-9]|[1-9])$/',
				),
				'popupPadding' => array(
					'type' => 'int',
					'default' => '5',
					'label' => __('Padding (px)', WPAC_DOMAIN),
					'pattern' => '/^[0-9]*$/',
				),
				'popupFadeIn' => array(
					'type' => 'int',
					'default' => '400',
					'label' => __('Fade in time (ms)', WPAC_DOMAIN),
					'pattern' => '/^[0-9]*$/',
				),
				'popupFadeOut' => array(
					'type' => 'int',
					'default' => '400',
					'label' => __('Fade out time (ms)', WPAC_DOMAIN),
					'pattern' => '/^[0-9]*$/',
				),
				'popupTimeout' => array(
					'type' => 'int',
					'default' => '3000',
					'label' => __('Timeout (ms)', WPAC_DOMAIN),
					'pattern' => '/^[0-9]*$/',
				),
				'popupBackgroundColorLoading' => array(
					'type' => 'string',
					'default' => '#000',
					'label' => __('Loading background color', WPAC_DOMAIN),
				),
				'popupTextColorLoading' => array(
					'type' => 'string',
					'default' => '#fff',
					'label' => __('Loading text color', WPAC_DOMAIN),
				),
				'popupBackgroundColorSuccess' => array(
					'type' => 'string',
					'default' => '#008000',
					'label' => __('Success background color', WPAC_DOMAIN),
				),
				'popupTextColorSuccess' => array(
					'type' => 'string',
					'default' => '#fff',
					'label' => __('Success text color', WPAC_DOMAIN),
				),			
				'popupBackgroundColorError' => array(
					'type' => 'string',
					'default' => '#f00',
					'label' => __('Error background color', WPAC_DOMAIN),
				),
				'popupTextColorError' => array(
					'type' => 'string',
					'default' => '#fff',
					'label' => __('Error text color', WPAC_DOMAIN),
				),			
				'popupOpacity' => array(
					'type' => 'int',
					'default' => '70',
					'label' => __('Opacity (%)', WPAC_DOMAIN),
					'pattern' => '/^(100|[1-9][0-9]|[1-9])$/',
				),
				'popupTextAlign' => array(
					'type' => 'string',
					'default' => 'center',
					'label' => __('Text align (left|center|right)', WPAC_DOMAIN),
					'pattern' => '/^(left|center|right)$/',
				),
				'popupTextFontSize' => array(
					'type' => 'string',
					'default' => __('Default font size', WPAC_DOMAIN),
					'label' => __('Font size (e.g. "14px", "1.1em", &hellip;)', WPAC_DOMAIN),
				),			
				'popupZindex' => array(
					'type' => 'int',
					'default' => '1000',
					'label' => __('Z-Index', WPAC_DOMAIN),
					'pattern' => '/^[0-9]*$/',
				),
			),
		),
		array(
			'section' => __('Miscellaneous', WPAC_DOMAIN),
			'options' => array(
				'scrollSpeed' => array(
					'type' => 'int',
					'default' => '500',
					'label' => __('Scroll speed (ms)', WPAC_DOMAIN),
					'pattern' => '/^[0-9]*$/',
				),
				'autoUpdateIdleTime' => array(
					'type' => 'int',
					'default' => '0',
					'label' => __('Auto update idle time (ms)', WPAC_DOMAIN),
					'description' => __('Leave empty or set to 0 to disable the auto update feature.', WPAC_DOMAIN),
				),
			),
		),
		array(
			'section' => __('Texts', WPAC_DOMAIN),
			'options' => array(
				'textPosted' => array(
						'type' => 'string',
						'default' => __('Your comment has been posted. Thank you!', WPAC_DOMAIN),
						'label' => __('Comment posted', WPAC_DOMAIN),
				),
				'textPostedUnapproved' => array(
						'type' => 'string',
						'default' => __('Your comment has been posted and is awaiting moderation. Thank you!', WPAC_DOMAIN),
						'label' => __('Comment posted unapproved', WPAC_DOMAIN),
				),
				'textReloadPage' => array(
						'type' => 'string',
						'default' => __('Reloading page. Please wait&hellip;', WPAC_DOMAIN),
						'label' => __('Reloading page', WPAC_DOMAIN),
				),
				'textPostComment' => array(
						'type' => 'string',
						'default' => __('Posting your comment. Please wait&hellip;', WPAC_DOMAIN),
						'label' => __('Post comment', WPAC_DOMAIN),
				),
				'textRefreshComments' => array(
						'type' => 'string',
						'default' => __('Loading comments. Please wait&hellip;', WPAC_DOMAIN),
						'label' => __('Refresh comments', WPAC_DOMAIN),
				),
				'textUnknownError' => array(
						'type' => 'string',
						'default' => __('Something went wrong, your comment has not been posted.', WPAC_DOMAIN),
						'label' => __('Unknown error occured', WPAC_DOMAIN),
				),
				'textErrorTypeComment' => array(
						'type' => 'string',
						'default' => str_replace(array('<', '>'), array('&lt;', '&gt;'), __(WPAC_WP_ERROR_PLEASE_TYPE_COMMENT)),
						'label' => __("Error 'Please type a comment'", WPAC_DOMAIN),
						'specialOption' => true,
				),
				'textErrorCommentsClosed' => array(
						'type' => 'string',
						'default' => str_replace(array('<', '>'), array('&lt;', '&gt;'), __(WPAC_WP_ERROR_COMMENTS_CLOSED)),
						'label' => __("Error 'Comments closed'", WPAC_DOMAIN),
						'specialOption' => true,
				),
				'textErrorMustBeLoggedIn' => array(
						'type' => 'string',
						'default' => str_replace(array('<', '>'), array('&lt;', '&gt;'), __(WPAC_WP_ERROR_MUST_BE_LOGGED_IN)),
						'label' => __("Error 'Must be logged in'", WPAC_DOMAIN),
						'specialOption' => true,
				),
				'textErrorFillRequiredFields' => array(
						'type' => 'string',
						'default' => str_replace(array('<', '>'), array('&lt;', '&gt;'), __(WPAC_WP_ERROR_FILL_REQUIRED_FIELDS)),
						'label' => __("Error 'Fill in required fields'", WPAC_DOMAIN),
						'specialOption' => true,
				),
				'textErrorInvalidEmailAddress' => array(
						'type' => 'string',
						'default' => str_replace(array('<', '>'), array('&lt;', '&gt;'), __(WPAC_WP_ERROR_INVALID_EMAIL_ADDRESS)),
						'label' => __("Error 'Invalid email address'", WPAC_DOMAIN),
						'specialOption' => true,
				),
				'textErrorPostTooQuickly' => array(
						'type' => 'string',
						'default' => str_replace(array('<', '>'), array('&lt;', '&gt;'), __(WPAC_WP_ERROR_POST_TOO_QUICKLY)),
						'label' => __("Error 'Post too quickly'", WPAC_DOMAIN),
						'specialOption' => true,
				),
				'textErrorDuplicateComment' => array(
						'type' => 'string',
						'default' => str_replace(array('<', '>'), array('&lt;', '&gt;'), __(WPAC_WP_ERROR_DUPLICATE_COMMENT)),
						'label' => __("Error 'Duplicate comment'", WPAC_DOMAIN),
						'specialOption' => true,
				),
			),
		),
		array(
			'section' => __('Expert settings', WPAC_DOMAIN),
			'options' => array(
				'selectorPostContainer' => array(
						'type' => 'string',
						'default' => '',
						'label' => __('Post container selector', WPAC_DOMAIN),
						'description' => __('Selector that matches post containers to enable support for multiple comment forms per page; leave empty to disable multiple comment form per page support. Please note: Each post container needs to have the ID attribute defined. If this option is set, all other selectors cannot select the elements by ID, but have to select the elements inside the post container for example by element and/or class.', WPAC_DOMAIN),
				),
				'commentPagesUrlRegex' => array(
						'type' => 'regex',
						'default' => '',
						'label' => __('Comment pages URL regex', WPAC_DOMAIN),
						'description' => __('Regular expression that matches URLs of all pages that support comments; leave empty to use WordPress defaults to automatically detect pages where comments are allowed. Please note: The expression is evaluated against the full page URL including schema, hostname, port number (if none default ports are used), (full) path and query string.', WPAC_DOMAIN),
				),
				'callbackOnBeforeSelectElements' => array(
					'type' => 'multiline',
					'default' => '',
					'label' => sprintf(__("'%s' callback", WPAC_DOMAIN), 'OnBeforeSelectElements'),
					'specialOption' => true,
					'description' => __('Parameter: dom (jQuery DOM element)', WPAC_DOMAIN)
				),
				'callbackOnBeforeSubmitComment' => array(
					'type' => 'multiline',
					'default' => '',
					'label' => sprintf(__("'%s' callback", WPAC_DOMAIN), 'OnBeforeSubmitComment'),
					'specialOption' => true,
				),
				'callbackOnAfterPostComment' => array(
					'type' => 'multiline',
					'default' => '',
					'label' => sprintf(__("'%s' callback", WPAC_DOMAIN), 'OnAfterPostComment'),
					'specialOption' => true,
					'description' => __('Parameter: commentUrl (string), unapproved (boolean)', WPAC_DOMAIN)
				),
				'callbackOnBeforeUpdateComments' => array(
					'type' => 'multiline',
					'default' => '',
					'label' => sprintf(__("'%s' callback", WPAC_DOMAIN), 'OnBeforeUpdateComments'),
					'specialOption' => true,
					'description' => __('Parameters: newDom (jQuery DOM element), commentUrl (string)', WPAC_DOMAIN)
				),
				'callbackOnAfterUpdateComments' => array(
					'type' => 'multiline',
					'default' => '',
					'label' => sprintf(__("'%s' callback", WPAC_DOMAIN), 'OnAfterUpdateComments'),
					'specialOption' => true,
					'description' => __('Parameters: newDom (jQuery DOM element), commentUrl (string)', WPAC_DOMAIN)
				),
				'asyncCommentsThreshold' => array(
					'type' => 'int',
					'label' => __('Load comments async threshold', WPAC_DOMAIN),
					'pattern' => '/^[0-9]*$/',
					'description' => __('Load comments asynchronously with secondary AJAX request if more than the specified number of comments exist (0 for always load comments asynchronously). Leave empty to disable this feature.', WPAC_DOMAIN),
					'specialOption' => true,
				),
				'asyncLoadTrigger' => array(
					'type' => 'select',
					'label' => __('Trigger to load comments async', WPAC_DOMAIN),
					'default' => 'DomReady',
					'pattern' => 'Viewport|None',
					'description' => __("Trigger to load comments asynchronously ('DomReady': Load comments immediately, 'Viewport': Load comments when comments container is in viewport, 'None': Comment loading is triggered manually).", WPAC_DOMAIN),
				),
				'disableUrlUpdate' => array(
					'type' => 'boolean',
					'default' => '0',
					'label' => __('Disable URL updating', WPAC_DOMAIN),
				),
				'disableScrollToAnchor' => array(
					'type' => 'boolean',
					'default' => '0',
					'label' => __('Disable scroll to anchor', WPAC_DOMAIN),
				),
				'useUncompressedScripts' => array(
					'type' => 'boolean',
					'default' => '0',
					'label' => __('Use uncompressed scripts', WPAC_DOMAIN),
					'description' => __('By default a compressed (and merged) JavaScript file is used, check to use uncompressed JavaScript files. Please note: If debug mode is enabled, uncompressed JavaScript files are used.', WPAC_DOMAIN),
					'specialOption' => true,
				),
				'alwaysIncludeScripts' => array(
					'type' => 'boolean',
					'default' => '0',
					'label' => __('Always include scripts', WPAC_DOMAIN),
					'description' => __('By default JavaScript files are only included on pages where comments are enabled, check to include JavaScript files on every page. Please note: If debug mode is enabled, JavaScript files are included on every pages.', WPAC_DOMAIN),
					'specialOption' => true,
				),
				'placeScriptsInFooter' => array(
					'type' => 'boolean',
					'default' => '0',
					'label' => __('Place scripts in footer', WPAC_DOMAIN),
					'description' => __('Enable to place JavaScript files before the </body> tag.', WPAC_DOMAIN),
					'specialOption' => true,
				),
				'optimizeAjaxResponse' => array(
					'type' => 'boolean',
					'default' => '0',
					'label' => __('Optimize AJAX response', WPAC_DOMAIN),
					'description' => __('Check to remove unnecessary HTML content from AJAX responses to save bandwidth.', WPAC_DOMAIN),
					'specialOption' => true,
				),
				'baseUrl' => array(
					'type' => 'string',
					'default' => '',
					'label' => __('Base URL', WPAC_DOMAIN),
					'description' => __('If you are running your Wordpress site behind a reverse proxy, set the this option to be the FQDN that the site will be accessed on (e.g. http://www.your-site.com).', WPAC_DOMAIN),
					'specialOption' => true,
				),
				'disableCache' => array(
					'type' => 'boolean',
					'default' => '0',
					'label' => __('Disable cache', WPAC_DOMAIN),
					'description' => __('Check to disable client-side caching when updating comments.', WPAC_DOMAIN),
				),
				'enableByQuery' => array(
					'type' => 'boolean',
					'default' => '0',
					'label' => __('Enable by query', WPAC_DOMAIN),
					'description' => sprintf(__("Check to enable the plugin by passing the (secret) query string (WPACEnable=%s)", WPAC_DOMAIN), wpac_get_secret()), 
				),
			)
		)
	);
}

function wpac_get_secret() {
	return substr(md5(NONCE_SALT.AUTH_KEY.LOGGED_IN_KEY.NONCE_KEY.AUTH_SALT.SECURE_AUTH_SALT.LOGGED_IN_SALT.NONCE_SALT),0 , 10);
}

function wpac_return_optimized_ajax_response() {
	return (wpac_get_option("optimizeAjaxResponse") && wpac_is_ajax_request());
}

function wpac_inject_scripts() {
	if (wpac_is_ajax_request()) return false;
	if (wpac_get_option('alwaysIncludeScripts')) return true;
	if (wpac_get_option('debug')) return true;
	if (wpac_comments_enabled()) return true;
	if (is_page() || is_single()) {
		global $post;
		if (get_comments_number($post->ID) > 0) return true;
		if (wpac_load_comments_async()) return true;
	}
	return false;
}
	
function wpac_enqueue_scripts() {

	// Skip if scripts should not be injected
	if (!wpac_inject_scripts()) return;

	$version = Functions::get_plugin_version();
	$jsPath = plugins_url('js/', __FILE__);
	$inFooter = wpac_get_option("placeScriptsInFooter");
	
	if (wpac_get_option('debug') || wpac_get_option('useUncompressedScripts')) {
		wp_enqueue_script('jsuri', $jsPath.'jsuri.js', array(), $version, $inFooter);
		wp_enqueue_script('jQueryBlockUi', $jsPath.'jquery.blockUI.js', array('jquery'), $version, $inFooter);
		wp_enqueue_script('jQueryIdleTimer', $jsPath.'idle-timer.js', array('jquery'), $version, $inFooter);
		wp_enqueue_script('waypoints', $jsPath.'jquery.waypoints.js', array('jquery'), $version, $inFooter);
		wp_enqueue_script('wpAjaxifyComments', $jsPath.'wp-ajaxify-comments.js', array('jquery', 'jQueryBlockUi', 'jsuri', 'jQueryIdleTimer', 'waypoints'), $version, $inFooter);
	} else {
		wp_enqueue_script('wpAjaxifyComments', $jsPath.'wp-ajaxify-comments.min.js', array('jquery'), $version, $inFooter);
	}
}

function wpac_get_version() {
	return Functions::get_plugin_version();
}

function wpac_plugins_loaded() {
	$dir = dirname(plugin_basename(__FILE__)).DIRECTORY_SEPARATOR.'languages'.DIRECTORY_SEPARATOR;
	load_plugin_textdomain( 'wp-ajaxify-comments', false, $dir);
}
add_action('plugins_loaded', 'wpac_plugins_loaded');

function wpac_js_escape($s) {
	return str_replace('"',"\\\"", $s);
}

$wpac_options = null;
function wpac_load_options() {

	global $wpac_options;
	
	// Test if options have already been loaded
	if ($wpac_options !== null) return;

	$wpac_options = get_option(WPAC_OPTION_KEY);
	if (is_array($wpac_options)) return;
	
	// Upgrade options from <= 0.8.0 and delete old options after migration
	$wpac_config = wpac_get_config();
	$wpac_options = array();
	foreach($wpac_config as $config) {
		foreach($config['options'] as $optionName => $option) {
			$value = get_option(WPAC_OPTION_PREFIX.$optionName, null);
			if ($value !== null) $wpac_options[$optionName] = $value;
		}
	}
	update_option(WPAC_OPTION_KEY, $wpac_options);
	foreach($wpac_config as $config) {
		foreach($config['options'] as $optionName => $option) {
			delete_option(WPAC_OPTION_PREFIX.$optionName);
		}
	}
}

function wpac_get_option($option) {
	global $wpac_options;
	wpac_load_options();
	return (isset($wpac_options[$option])) ? $wpac_options[$option] : null;
}

function wpac_update_option($option, $value) {
	global $wpac_options;
	wpac_load_options();
	$wpac_options[$option] = $value;
}

function wpac_delete_option($option) {
	global $wpac_options;
	wpac_load_options();
	unset($wpac_options[$option]);
}

function wpac_save_options() {
	global $wpac_options;
	wpac_load_options();
	update_option(WPAC_OPTION_KEY, $wpac_options);
}

function wpac_get_page_url()
{
	// Test if base url is defined
	$baseUrl = wpac_get_option('baseUrl');
	if ($baseUrl) {
		return rtrim($baseUrl, '/').'/'.ltrim($_SERVER['REQUEST_URI'], '/');
	}
	
	// Create page url from $_SERVER variables
	$ssl = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') ? true:false;
	$sp = strtolower($_SERVER['SERVER_PROTOCOL']);
	$protocol = substr($sp, 0, strpos($sp, '/')) . (($ssl) ? 's' : '');
	$port = $_SERVER['SERVER_PORT'];
	$port = ((!$ssl && $port=='80') || ($ssl && $port=='443')) ? '' : ':'.$port;
	$host = isset($_SERVER['HTTP_X_FORWARDED_HOST']) ? $_SERVER['HTTP_X_FORWARDED_HOST'] : (isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : $_SERVER['SERVER_NAME']);
	return $protocol.'://'.$host.$port.$_SERVER['REQUEST_URI'];
}

function wpac_comments_enabled() {
	$commentPagesUrlRegex = wpac_get_option('commentPagesUrlRegex');
	if ($commentPagesUrlRegex) {
		return preg_match($commentPagesUrlRegex, wpac_get_page_url()) > 0;
	} else {
		global $post;
		return (is_page() || is_single()) && comments_open($post->ID) && (!get_option('comment_registration') || is_user_logged_in());
	}
}

function wpac_load_comments_async() {
	$asyncCommentsThreshold = wpac_get_option('asyncCommentsThreshold');
	if (strlen($asyncCommentsThreshold) == 0) return false;
	
	global $post;
	$commentsCount = $post ? (int)get_comments_number($post->ID) : 0;
	return (
		$commentsCount > 0 &&
		$asyncCommentsThreshold <= $commentsCount
	);
}

function wpac_theme_has_html5_support() {
	$html5Support = get_theme_support('html5');
	return $html5Support && in_array('script', $html5Support[0]);
}

function wpac_initialize() {

	// Skip if scripts should not be injected
	if (!wpac_inject_scripts()) return;

	echo '<script'.(wpac_theme_has_html5_support() ? '' : ' type="text/javascript"').'>/* <![CDATA[ */';

	echo 'if(!window["WPAC"])var WPAC={};';
	
	// Options
	echo 'WPAC._Options={';
	$wpac_config = wpac_get_config();
	foreach($wpac_config as $config) {
		foreach($config['options'] as $optionName => $option) {
			if (isset($option['specialOption']) && $option['specialOption']) continue;
			$value = trim(wpac_get_option($optionName));
			if (strlen($value) == 0) $value = $option['default'];
			echo $optionName.':';
			switch ($option['type']) {
				case 'int': echo $value.','; break;
				case 'boolean': echo $value ? 'true,' : 'false,'; break;
				default: echo '"'.wpac_js_escape($value).'",';
			}
		}
	}
	echo 'commentsEnabled:'.(wpac_comments_enabled() ? 'true' : 'false').',';
	echo 'version:"'.wpac_get_version().'"};';

	// Callbacks
	echo 'WPAC._Callbacks={';
	echo '"beforeSelectElements":function(dom){'.wpac_get_option('callbackOnBeforeSelectElements').'},';
	echo '"beforeUpdateComments":function(newDom,commentUrl){'.wpac_get_option('callbackOnBeforeUpdateComments').'},';
	echo '"afterUpdateComments":function(newDom,commentUrl){'.wpac_get_option('callbackOnAfterUpdateComments').'},';
	echo '"beforeSubmitComment":function(){'.wpac_get_option('callbackOnBeforeSubmitComment').'},';
	echo '"afterPostComment":function(commentUrl,unapproved){'.wpac_get_option('callbackOnAfterPostComment').'}';
	echo '};';
	
	echo '/* ]]> */</script>';	
}

function wpac_is_login_page() {
    return isset($GLOBALS['pagenow']) && in_array($GLOBALS['pagenow'], array('wp-login.php', 'wp-register.php'));
}

function wpac_add_settings_link($links, $file) {
	static $this_plugin;
	if (!$this_plugin) $this_plugin = plugin_basename(__FILE__);
	if ($file == $this_plugin){
		$settings_link = '<a href="'.WPAC_SETTINGS_URL.'">Settings</a>';
		$links[] = $settings_link;
	}
	return $links;
}
add_filter('plugin_action_links', 'wpac_add_settings_link', 10, 2);

function wpac_admin_notice() {
	if (basename($_SERVER['PHP_SELF']) == 'plugins.php') {
		if (!wpac_get_option('enable')) {
			// Show error if plugin is not enabled
			echo '<div class="error"><p><strong>'.sprintf(__('%s is not enabled!', WPAC_DOMAIN), WPAC_PLUGIN_NAME).'</strong> <a href="'.WPAC_SETTINGS_URL.'">'.__('Click here to configure the plugin.', WPAC_DOMAIN).'</a></p></div>';
		} else if (wpac_get_option('debug')) {
			// Show info if plugin is running in debug mode
			echo '<div class="updated"><p><strong>'.sprintf(__('%s is running in debug mode!', WPAC_DOMAIN), WPAC_PLUGIN_NAME).'</strong> <a href="'.WPAC_SETTINGS_URL.'">'.__('Click here to configure the plugin.', WPAC_DOMAIN).'</a></p></div>';
		}
	}
}
add_action('admin_notices', 'wpac_admin_notice');

function wpac_init()
{
	if (isset($_GET['WPACUnapproved'])) {
		header('X-WPAC-UNAPPROVED: '.$_GET['WPACUnapproved']);
	}
	if (isset($_GET['WPACUrl'])) {
		header('X-WPAC-URL: '.$_GET['WPACUrl']);
	}
}
add_action('init', 'wpac_init');

function wpac_unparse_url($urlParts) {
	$scheme = isset($urlParts['scheme']) ? $urlParts['scheme'].'://' : '';
	$host = isset($urlParts['host']) ? $urlParts['host'] : '';
	$port = isset($urlParts['port']) ? ':'.$urlParts['port'] : '';
	$user = isset($urlParts['user']) ? $urlParts['user'] : '';
	$pass = isset($urlParts['pass']) ? ':'.$urlParts['pass']  : '';
	$pass = ($user || $pass) ? "$pass@" : '';
	$path = isset($urlParts['path']) ? $urlParts['path'] : '';
	$query = isset($urlParts['query']) ? '?'.$urlParts['query'] : '';
	$fragment = isset($urlParts['fragment']) ? '#'.$urlParts['fragment'] : '';
	return "$scheme$user$pass$host$port$path$query$fragment";
} 

function wpac_comment_post_redirect($location)
{
	global $comment;

	// If base url is defined, replace Wordpress site url by base url
	$url = $location;
	$baseUrl = wpac_get_option('baseUrl');
	if ($baseUrl) {
		$siteUrl = rtrim(get_site_url(), '/');
		if (strpos(strtolower($url), strtolower($siteUrl)) === 0) {
			$url = preg_replace('/'.preg_quote($siteUrl, '/').'/', rtrim($baseUrl, '/'), $url, 1);
		}
	}
	
	// Add "disable cache" query parameter
	if (wpac_get_option('disableCache')) {
		$urlParts = parse_url($url);
		$queryParam = 'WPACRandom='.time();
		$urlParts['query'] = isset($urlParts['query']) ? $urlParts['query'].'&'.$queryParam : $queryParam;
		$url = wpac_unparse_url($urlParts);
	}

	// Add query parameter (WPACUnapproved and WPACUrl)
	$urlParts = parse_url($url);
	$queryParam = 'WPACUnapproved='.(($comment && $comment->comment_approved == '0') ? '1' : '0').'&WPACUrl='.urlencode($url);
	$urlParts['query'] = isset($urlParts['query']) ? $urlParts['query'].'&'.$queryParam : $queryParam;
	$url = wpac_unparse_url($urlParts);

	return $url;
}
add_action('comment_post_redirect', 'wpac_comment_post_redirect');

function wpac_allowed_redirect_hosts($content){
	$baseUrl = wpac_get_option('baseUrl');
	if ($baseUrl) {
		$baseUrlHost = parse_url($baseUrl, PHP_URL_HOST);
		if ($baseUrlHost !== false) $content[] = $baseUrlHost;
	}
	return $content;
}
add_filter('allowed_redirect_hosts' , 'wpac_allowed_redirect_hosts');

function wpac_the_content($content) {
	return wpac_return_optimized_ajax_response() ? "" : $content;
}
add_filter('the_content', 'wpac_the_content', PHP_INT_MAX);

function wpac_option_page() {
	if (!current_user_can('manage_options'))  {
		wp_die('You do not have sufficient permissions to access this page.');
	} 

	$wpac_config = wpac_get_config();
	
	$errors = array();
	
	if (!empty($_POST) && isset($_POST['wpac']) && check_admin_referer('wpac_update_settings','wpac_nonce_field'))
	{
		foreach($_POST['wpac'] as $section => $options) {
		
			foreach ($options as $optionName => $value) {

				if (!isset($wpac_config[$section])) continue;
				if (!isset($wpac_config[$section]['options'][$optionName])) continue;
			
				$value = trim(stripslashes($value));
				$pattern = isset($wpac_config[$section]['options'][$optionName]['pattern']) ? $wpac_config[$section]['options'][$optionName]['pattern'] : null;
				$type = $wpac_config[$section]['options'][$optionName]['type'];
				
				if (strlen($value) > 0) {
					$error = false;
					if ($type == 'regex') {
						$error = (@preg_match($value, null) === false);
					} else if ($pattern) {
						$error = ($type == 'select') ? 
							!in_array($value, explode('|', $pattern)) 
							: (preg_match($pattern, $value) !== 1);
					}
					if ($error) {
						$errors[] = $optionName;
					} else {
						if ($type == 'int') $value = intval($value);
						wpac_update_option($optionName, $value);
					}
				} else {
					wpac_delete_option($optionName);
				}
			
			}
		
		}
		
		if (count($errors) == 0) {
			wpac_save_options();
			echo '<div class="updated"><p><strong>'.__('Settings saved successfully.', WPAC_DOMAIN).'</strong></p></div>';
		} else {
			echo '<div class="error"><p><strong>'.__('Settings not saved! Please correct the red marked input fields.', WPAC_DOMAIN).'</strong></p></div>';
		}
	}
  
  ?>
	<div class="wrap">
		<h2><?php printf(__('Plugin Settings: %s', WPAC_DOMAIN), WPAC_PLUGIN_NAME.' '.wpac_get_version()); ?></h2>
	
		<div class="postbox-container" style="width: 100%;" >
	
			<form name="wp-ajaxify-comments-settings-update" method="post" action="">
				<?php if (function_exists('wp_nonce_field') === true) wp_nonce_field('wpac_update_settings','wpac_nonce_field'); ?>	 
	
				<div id="poststuff">
					<div class="postbox">
				
						<h3 id="plugin-settings"><?php _e('Plugin Settings', WPAC_DOMAIN); ?></h3>
						<div class="inside">
	
							<table class="form-table">
	
		<?php
		
			$section = 0;
			foreach($wpac_config as $config) {
				echo '<tr><th colspan="2" style="white-space: nowrap;"><h4>'.$config['section'].'</h4></th></tr>';
				foreach($config['options'] as $optionName => $option) {
	
					$color = in_array($optionName, $errors) ? 'red' : '';
	
					echo '<tr><th scope="row" style="white-space: nowrap;"><label for="'.$optionName.'" style="color: '.$color.'">'.$option['label'].'</label></th><td>';
					
					$value = (isset($_POST['wpac']) && $_POST['wpac'][$section][$optionName]) ? stripslashes($_POST['wpac'][$section][$optionName]) : wpac_get_option($optionName);
					$name = 'wpac['.$section.']['.$optionName.']';
					
					if ($option['type'] == 'boolean') {
						echo '<input type="hidden" name="'.$name.'" value="">';
						echo '<input type="checkbox" name="'.$name.'" id="'.$optionName.'" '.($value ? 'checked="checked"' : '').' value="1"/>';
					} else if ($option['type'] == 'select') {
						echo '<select name="'.$name.'">';
						echo '<option '.($value == $option['default'] ? 'selected="selected"' : '').' value="">'.$option['default'].'</option>';
						foreach (explode('|', $option['pattern']) as $select) {
							echo '<option '.($value == $select ? 'selected="selected"' : '').' value="'.$select.'">'.$select.'</option>';
						}
						echo '</select>';
					} else {
						$flags = defined('ENT_HTML401') ? ENT_COMPAT | ENT_HTML401 : ENT_COMPAT; // ENT_HTML401 was added in PHP 5.4.0
						$escapedValue = htmlentities($value, $flags, 'UTF-8');
						if ($option['type'] == 'multiline') {
							echo '<textarea name="'.$name.'" id="'.$optionName.'" rows="5" cols="40" style="width: 300px; color: '.$color.'">'.$escapedValue.'</textarea>';
						} else {
							echo '<input type="text" name="'.$name.'" id="'.$optionName.'" value="'.$escapedValue.'" style="width: 300px; color: '.$color.'"/>';
						} 
						if (isset($option['default']) && $option['default']) echo '<br/>'.sprintf(__('Leave empty for default value %s', WPAC_DOMAIN), '<em>'.$option['default'].'</em>');
					}
					if (isset($option['description']) && $option['description']) echo '<br/><em style="width:300px; display: inline-block">'.htmlspecialchars($option['description']).'</em>';
					echo '</td></tr>';
				}
				$section++;
			}
		
		?>
		
							</table>
							<p class="submit">
							  <input type="hidden" name="action" value="wpac_update_settings"/>
							  <input type="submit" name="wpac_update_settings" class="button-primary" value="<?php _e('Save Changes', WPAC_DOMAIN); ?>"/>
							</p>
						</div>
					</div>
				</div>
	
			</form>	
		
		</div>
	
		<div class="postbox-container" style="width: 100%;" >
	
			<form action="https://www.paypal.com/cgi-bin/webscr" method="post">
				
				<input type="hidden" name="cmd" value="_s-xclick">
				<input type="hidden" name="hosted_button_id" value="MLKQ3VNZUBEQQ">
				<img alt="" border="0" src="https://www.paypalobjects.com/de_DE/i/scr/pixel.gif" width="1" height="1">
	
				<div id="poststuff">
					<div class="postbox">
						<h3 id="plugin-settings"><?php _e('Contact & Support', WPAC_DOMAIN); ?></h3>
						<div class="inside">	
							<p>Thanks for using <?php echo WPAC_PLUGIN_NAME; ?>. Do you have any issues with WP Ajaxify Comments? Not sure if your theme supports the plugin? Need assistance with getting your DOM selectors right? We provide professional support!
							<br/><br/>
							<a target="_blank" href="TBA">Submit a support ticket.</a>
							<br/><br/>
							Before submitting a support ticket, you should first check out our <a target="_blank" href="TBA">FAQ</a>.</p>
							<p>If you found a bug or you like to leave us a message, please do not hesitate to <a target="_blank" href="TBA">contact us</a>.</p>
						</div>
					</div>
				</div>
			</form>		
		</div>
	</div>
<?php }

function wpac_is_ajax_request() {
	return isset($_SERVER['HTTP_X_WPAC_REQUEST']) && $_SERVER['HTTP_X_WPAC_REQUEST']; 
}

function wpac_admin_menu() {
	add_options_page(WPAC_PLUGIN_NAME, WPAC_PLUGIN_NAME, 'manage_options', 'wp-ajaxify-comments', 'wpac_option_page');
}

function wpac_comments_query_filter($query) {

	// No comment filtering if request is a fallback or WPAC-AJAX request  
	if ((isset($_REQUEST['WPACFallback']) && $_REQUEST['WPACFallback'])) return $query;
	
	if (wpac_is_ajax_request()) {

		$skip = ((isset($_REQUEST['WPACSkip']) && is_numeric($_REQUEST['WPACSkip']) && $_REQUEST['WPACSkip'] > 0)) ? $_REQUEST['WPACSkip'] : 0;
		$take = ((isset($_REQUEST['WPACTake']) && is_numeric($_REQUEST['WPACTake']) && $_REQUEST['WPACTake'] > 0)) ? $_REQUEST['WPACTake'] : count($query);
		
		if (get_option('comment_order') === 'desc') {
			return array_slice($query, -$skip-$take, $take); // Comment order: Newest at the top
		} else {
			return array_slice($query, $skip, $take); // Comment order:Oldest on the top
		}
		
	} else {
		// Test asyncCommentsThreshold 
		$asyncCommentsThreshold = wpac_get_option('asyncCommentsThreshold');
		$commentsCount = count($query);
		if (strlen($asyncCommentsThreshold) == 0 || $commentsCount == 0 || $asyncCommentsThreshold > $commentsCount) return $query;
		
		// Filter/remove comments and set options to load comments with secondary AJAX request 
		echo '<script'.(wpac_theme_has_html5_support() ? '' : ' type="text/javascript"').'>WPAC._Options["loadCommentsAsync"]=true;</script>';
		return array();
	}
}

function wpac_filter_gettext($translation, $text, $domain) {
	if ($domain != 'default') return $translation;
	
	$customWordpressTexts = array(
		strtolower(WPAC_WP_ERROR_PLEASE_TYPE_COMMENT) => 'textErrorTypeComment',
		strtolower(WPAC_WP_ERROR_COMMENTS_CLOSED) => 'textErrorCommentsClosed',
		strtolower(WPAC_WP_ERROR_MUST_BE_LOGGED_IN) => 'textErrorMustBeLoggedIn',
		strtolower(WPAC_WP_ERROR_FILL_REQUIRED_FIELDS) => 'textErrorFillRequiredFields',
		strtolower(WPAC_WP_ERROR_INVALID_EMAIL_ADDRESS) => 'textErrorInvalidEmailAddress',
		strtolower(WPAC_WP_ERROR_POST_TOO_QUICKLY) => 'textErrorPostTooQuickly',
		strtolower(WPAC_WP_ERROR_DUPLICATE_COMMENT) => 'textErrorDuplicateComment',
	);

	$lowerText = strtolower($text);
 	if (array_key_exists($lowerText, $customWordpressTexts)) {
		$customText = wpac_get_option($customWordpressTexts[$lowerText]);
		if ($customText) return $customText;
	}
	return $translation;
}

function wpac_default_wp_die_handler( $message, $title = '', $args = array() ) {
	// Set X-WPAC-ERROR if script "dies" when posting comment
	if (wpac_is_ajax_request()) header('X-WPAC-ERROR: 1');
	return _default_wp_die_handler($message, $title, $args);
}

function wpac_wp_die_handler($handler) {
	if ($handler != "_default_wp_die_handler") return $handler;
	return "wpac_default_wp_die_handler";
}

function wpac_option_page_comments($page_comments) {
	return(wpac_is_ajax_request() && isset($_REQUEST['WPACAll']) && $_REQUEST['WPACAll']) ?
		false : $page_comments;
}

function wpac_option_comments_per_page($comments_per_page) {
	return(wpac_is_ajax_request() && isset($_REQUEST['WPACAll']) && $_REQUEST['WPACAll']) ?
		0 : $comments_per_page;
}

if (!is_admin() && !wpac_is_login_page()) {
	if (wpac_get_option('enable') || (wpac_get_option('enableByQuery') && $_REQUEST['WPACEnable'] === wpac_get_secret())) {
		add_filter('comments_array', 'wpac_comments_query_filter');
		add_action('wp_head', 'wpac_initialize');
		add_action('wp_enqueue_scripts', 'wpac_enqueue_scripts');
		add_filter('gettext', 'wpac_filter_gettext', 20, 3);
		add_filter('wp_die_handler', 'wpac_wp_die_handler');
		add_filter('option_page_comments', 'wpac_option_page_comments');
		add_filter('option_comments_per_page', 'wpac_option_comments_per_page');
	}
} else {
	add_action('admin_menu', 'wpac_admin_menu');
}