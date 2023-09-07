<?php
/*
Plugin Name: Ajaxify Comments
Plugin URI: https://dlxplugins.com/plugins/ajaxify-comments/
Description: Ajaxify Comments hooks into your current theme and adds AJAX functionality to the comment form.
Author: DLX Plugins
Author URI: https://dlxplugins.com
Version: 1.7.5
License: GPLv2
Text Domain: wpac
*/

namespace DLXPlugins\WPAC;

define( 'WPAC_VERSION', '1.7.5' );
define( 'WPAC_PLUGIN_NAME', 'WP Ajaxify Comments' );
define( 'WPAC_SETTINGS_URL', 'admin.php?page=wp-ajaxify-comments' );
define( 'WPAC_DOMAIN', 'wpac' );
define( 'WPAC_OPTION_PREFIX', WPAC_DOMAIN . '_' ); // used to save options in version <=0.8.0
define( 'WPAC_OPTION_KEY', WPAC_DOMAIN ); // used to save options in version >= 0.9.0
define( 'WPAC_FILE', __FILE__ );

if ( function_exists( 'is_wp_version_compatible' ) && is_wp_version_compatible( '5.5' ) ) {
	define( 'WPAC_WP_ERROR_PLEASE_TYPE_COMMENT', '<strong>Error</strong>: Please type your comment text.' );
} else {
	define( 'WPAC_WP_ERROR_PLEASE_TYPE_COMMENT', '<strong>Error</strong>: Please type a comment.' );
}
define( 'WPAC_WP_ERROR_COMMENTS_CLOSED', 'Sorry, comments are closed for this item.' );
define( 'WPAC_WP_ERROR_MUST_BE_LOGGED_IN', 'Sorry, you must be logged in to post a comment.' );
define( 'WPAC_WP_ERROR_FILL_REQUIRED_FIELDS', '<strong>Error</strong>: Please fill the required fields (name, email).' );
define( 'WPAC_WP_ERROR_INVALID_EMAIL_ADDRESS', '<strong>Error</strong>: Please enter a valid email address.' );
define( 'WPAC_WP_ERROR_POST_TOO_QUICKLY', 'You are posting comments too quickly. Slow down.' );
define( 'WPAC_WP_ERROR_DUPLICATE_COMMENT', 'Duplicate comment detected; it looks as though you&#8217;ve already said that!' );

// Support for site-level autoloading.
if ( file_exists( __DIR__ . '/lib/autoload.php' ) ) {
	require_once __DIR__ . '/lib/autoload.php';
}

require_once 'functions.php';

function plugins_loaded() {
	if ( is_admin() ) {
		$admin = new Admin\Init();
		$admin->init();
	}
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\plugins_loaded' );
