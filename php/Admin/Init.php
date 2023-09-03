<?php
/**
 * Register the admin menu and settings.
 *
 * @package WPAC
 */

namespace DLXPlugins\WPAC\Admin;

if ( ! defined( 'ABSPATH' ) ) {
	die( 'No direct access.' );
}

use DLXPlugins\WPAC\Functions as Functions;

/**
 * Init admin class for WPAC.
 */
class Init {

	/**
	 * Holds the slug to the admin panel page
	 *
	 * @since 5.0.0
	 * @static
	 * @var string $slug
	 */
	private static $slug = 'wp-ajaxify-comments';

	/**
	 * Holds the URL to the admin panel page
	 *
	 * @since 1.0.0
	 * @static
	 * @var string $url
	 */
	private static $url = '';

	/**
	 * Main constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'init' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_scripts' ) );

		// Init tabs.
		new Tabs\Main();
		new Tabs\Selectors();
	}

	/**
	 * Output admin scripts/styles.
	 */
	public function admin_scripts() {
		$screen = get_current_screen();
		if ( isset( $screen->base ) && 'settings_page_ajaxify-comments' === $screen->base ) {
			wp_enqueue_style(
				'wpac-styles-admin',
				Functions::get_plugin_url( 'dist/wpac-admin-css.css' ),
				array(),
				Functions::get_plugin_version(),
				'all'
			);

			// Get current tab and trigger action.
			$current_tab = Functions::get_admin_tab();
			if ( empty( $current_tab ) ) {
				$current_tab = 'home';
			}
			do_action( 'wpac_admin_enqueue_scripts_' . $current_tab );
		}
	}

	/**
	 * Initializes admin menus, plugin settings links, tables, etc.
	 *
	 * @since 1.0.0
	 * @access public
	 * @see __construct
	 */
	public function init() {

		// Add settings link.
		$prefix = Functions::is_multisite() ? 'network_admin_' : '';
		add_action( $prefix . 'plugin_action_links_' . plugin_basename( WPAC_FILE ), array( $this, 'plugin_settings_link' ) );
		// Init admin menu.
		if ( Functions::is_multisite() ) {
			add_action( 'network_admin_menu', array( $this, 'register_sub_menu' ) );
		} else {
			add_action( 'admin_menu', array( $this, 'register_sub_menu' ) );
		}
	}

	/**
	 * Initializes admin menus
	 *
	 * @since 1.0.0
	 * @access public
	 * @see init
	 */
	public function register_sub_menu() {
		$hook = '';
		if ( Functions::is_multisite() ) {
			$hook = add_submenu_page(
				'settings.php',
				__( 'Ajaxify Comments', 'wp-ajaxify-comments' ),
				__( 'Ajaxify Comments', 'wp-ajaxify-comments' ),
				'manage_network',
				'ajaxify-comments',
				array( '\DLXPlugins\WPAC\Admin\Settings', 'settings_page' )
			);
		} else {
			$hook = add_submenu_page(
				'options-general.php',
				__( 'Ajaxify Comments', 'wp-ajaxify-comments' ),
				__( 'Ajaxify Comments', 'wp-ajaxify-comments' ),
				'manage_options',
				'ajaxify-comments',
				array( '\DLXPlugins\WPAC\Admin\Settings', 'settings_page' )
			);
		}
		add_action( 'in_admin_header', array( '\DLXPlugins\WPAC\Admin\Settings', 'get_admin_header' ) );
	}

	/**
	 * Adds plugin settings page link to plugin links in WordPress Dashboard Plugins Page
	 *
	 * @since 1.0.0
	 * @access public
	 * @see __construct
	 * @param array $settings Uses $prefix . "plugin_action_links_$plugin_file" action.
	 * @return array Array of settings
	 */
	public function plugin_settings_link( $settings ) {
		$admin_anchor = sprintf( '<a href="%s">%s</a>', esc_url( $this->get_url() ), esc_html__( 'Settings', 'wp-ajaxify-comments' ) );
		if ( ! is_array( $settings ) ) {
			return array( $admin_anchor );
		} else {
			return array_merge( array( $admin_anchor ), $settings );
		}
	}

	/**
	 * Return the URL to the admin panel page.
	 *
	 * Return the URL to the admin panel page.
	 *
	 * @since 5.0.0
	 * @access static
	 *
	 * @return string URL to the admin panel page.
	 */
	public static function get_url() {
		return Functions::get_settings_url();
	}
}
