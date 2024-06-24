<?php
/*
Plugin Name: Ajaxify Comments - Ajax and Lazy Loading Comments
Plugin URI: https://dlxplugins.com/plugins/ajaxify-comments/
Description: Ajaxify Comments hooks into your current theme and adds AJAX functionality to the comment form. It also supports lazy loading of the comments section.
Author: DLX Plugins
Author URI: https://dlxplugins.com/plugins/ajaxify-comments/
Version: 3.0.2
License: GPLv2
Text Domain: wp-ajaxify-comments
*/

namespace DLXPlugins\WPAC;

define( 'WPAC_VERSION', '3.0.2' );
define( 'WPAC_PLUGIN_NAME', 'WP Ajaxify Comments' );
define( 'WPAC_SETTINGS_URL', 'admin.php?page=wp-ajaxify-comments' );
define( 'WPAC_DOMAIN', 'wpac' );
define( 'WPAC_OPTION_PREFIX', WPAC_DOMAIN . '_' ); // used to save options in version <=0.8.0
define( 'WPAC_OPTION_KEY', WPAC_DOMAIN ); // used to save options in version >= 0.9.0
define( 'WPAC_FILE', __FILE__ );

/**
 * The next group of constants are used for matching strings and should not be changed.
 */
if ( function_exists( 'is_wp_version_compatible' ) && is_wp_version_compatible( '5.5' ) ) {
	define( 'WPAC_WP_ERROR_PLEASE_TYPE_COMMENT', '<strong>Error:</strong> Please type your comment text.' );
} else {
	define( 'WPAC_WP_ERROR_PLEASE_TYPE_COMMENT', '<strong>Error:</strong> Please type a comment.' );
}
define( 'WPAC_WP_ERROR_COMMENTS_CLOSED', 'Sorry, comments are closed for this item.' );
define( 'WPAC_WP_ERROR_MUST_BE_LOGGED_IN', 'Sorry, you must be logged in to post a comment.' );
define( 'WPAC_WP_ERROR_FILL_REQUIRED_FIELDS', '<strong>Error:</strong> Please fill the required fields (name, email).' );
define( 'WPAC_WP_ERROR_INVALID_EMAIL_ADDRESS', '<strong>Error:</strong> Please enter a valid email address.' );
define( 'WPAC_WP_ERROR_POST_TOO_QUICKLY', 'You are posting comments too quickly. Slow down.' );
define( 'WPAC_WP_ERROR_DUPLICATE_COMMENT', 'Duplicate comment detected; it looks as though you&#8217;ve already said that!' );

// Support for site-level autoloading.
if ( file_exists( __DIR__ . '/lib/autoload.php' ) ) {
	require_once __DIR__ . '/lib/autoload.php';
}

require_once Functions::get_plugin_dir( 'functions.php' );

/**
 * Run when the plugin is loaded.
 */
function plugins_loaded() {

	if ( is_admin() ) {
		$admin = new Admin\Init();
		$admin->init();
	}

	// Init menu helper.
	$menu_helper = new Menu_Helper();
	$menu_helper->run();

	// Init lazy load.
	$lazy_load = new Lazy_Load();
	$lazy_load->run();

	// Load die handler. This should only affect if `HTTP_X_WPAC_REQUEST` server var is set.
	add_filter( 'wp_die_handler', 'wpac_wp_die_handler' );

	// For checking when a theme has changed.
	add_action( 'switch_theme', __NAMESPACE__ . '\wpac_has_switched_theme' );
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\plugins_loaded' );

/**
 * Run when the theme has been switched.
 *
 * We'll use this to alert the user to re-save settings.
 */
function wpac_has_switched_theme() {
	update_option( 'wpac_theme_has_changed', true );
}

/**
 * Run when WP has finished loading in.
 *
 * Queries should be initialized by now, so we can check for post variables.
 */
function wp() {
	/**
	 * Fires before the main WPAC actions/filters. Useful for hooking in early.
	 */
	do_action( 'dlxplugins/ajaxify/comments/wp' );
	
	// If Ajaxify enabled, run the plugin.
	if ( Functions::is_ajaxify_enabled() ) {
		add_filter( 'the_comments', 'wpac_comments_template_query_args_filter' );
		add_action( 'wp_enqueue_scripts', 'wpac_initialize', 9 );
		add_action( 'wp_enqueue_scripts', 'wpac_enqueue_scripts' );
		add_filter( 'option_page_comments', 'wpac_option_page_comments' );
		add_filter( 'option_comments_per_page', 'wpac_option_comments_per_page' );

		// For Genesis compatibility.
		add_filter( 'genesis_before_comments', 'wpac_genesis_before_comments' );
	}
}
add_action( 'wp', __NAMESPACE__ . '\wp' );

/**
 * Fires before a comment is posted.
 *
 * @param int $comment_post_id The post ID the comment will be posted to.
 */
global $wpac_global_comment_post_id;
function pre_comment_on_post( $comment_post_id ) {
	global $wpac_global_comment_post_id;
	$wpac_global_comment_post_id = $comment_post_id;
	add_filter( 'gettext', 'wpac_filter_gettext', 20, 3 ); // todo - need to run earlier.
}
add_action( 'pre_comment_on_post', __NAMESPACE__ . '\pre_comment_on_post' );

/* Setup plugin activation and redirection */
register_activation_hook( __FILE__, __NAMESPACE__ . '\on_plugin_activation' );
add_action( 'admin_init', __NAMESPACE__ . '\activate_redirect' );

/**
 * Determine if a user can be redirected or not.
 *
 * @return true if the user can be redirected. false if not.
 */
function can_redirect_on_activation() {
	/**
	 * Filter whether to redirect on plugin activation.
	 *
	 * @param bool $can_redirect Whether to redirect on plugin activation. Pass `false` to prevent redirect.
	 */
	$can_redirect = apply_filters( 'dlxplugins/ajaxify/comments/activation/can_redirect', true );
	if ( false === $can_redirect ) {
		return false;
	}

	// If plugin is activated in network admin options, skip redirect.
	if ( is_network_admin() ) {
		return false;
	}

	// Skip redirect if WP_DEBUG is enabled.
	if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
		return false;
	}

	// Check for dev mode.
	if ( function_exists( 'wp_get_development_mode' ) ) {
		if ( ! empty( wp_get_development_mode() ) ) {
			return false;
		}
	}

	// Determine if multi-activation is enabled.
	$maybe_multi = filter_input( INPUT_GET, 'activate-multi', FILTER_VALIDATE_BOOLEAN );
	if ( $maybe_multi ) {
		return false;
	}

	// All is well. Can redirect.
	return true;
}

/**
 * Callback when the plugin is activated.
 */
function on_plugin_activation() {
	if ( can_redirect_on_activation() ) {
		// Add option for whether to redirect.
		add_option( 'wpac_do_activation_redirect', sanitize_text_field( __FILE__ ) );
	}
}

/**
 * Redirect in the admin upon plugin activation.
 */
function activate_redirect() {
	if ( can_redirect_on_activation() && is_admin() ) {
		if ( __FILE__ === get_option( 'wpac_do_activation_redirect' ) ) {
			delete_option( 'wpac_do_activation_redirect' );
			wp_safe_redirect( esc_url_raw( add_query_arg( array( 'first_time_install' => true ), Functions::get_settings_url() ) ) );
			exit;
		}
	}
}
