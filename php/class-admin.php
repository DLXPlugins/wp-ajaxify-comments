<?php
/**
 * Register the admin menu and settings.
 *
 * @package CommentEditPro
 */

namespace CommentEditPro\Includes;

if ( ! defined( 'ABSPATH' ) ) {
	die( 'No direct access.' );
}

use CommentEditPro\Includes\Options as Options;
use CommentEditPro\Includes\Functions as Functions;
use CommentEditPro\Includes\Admin_Menu_Output as Admin_Menu_Output;

/**
 * Admin class for SCE Options.
 */
class Admin {

	/**
	 * Holds the slug to the admin panel page
	 *
	 * @since 5.0.0
	 * @static
	 * @var string $slug
	 */
	private static $slug = 'sce';

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
	}

	/**
	 * Output admin scripts/styles.
	 */
	public function admin_scripts() {
		$screen = get_current_screen();
		if ( isset( $screen->base ) && 'settings_page_comment-edit-pro' === $screen->base ) {
			wp_enqueue_style( 'sce-fancybox', Functions::get_plugin_url( 'dist/sce-fancybox-css.css' ), array(), COMMENTEDITPRO_VERSION, 'all' );
			wp_enqueue_style( 'sce-styles', Functions::get_plugin_url( 'dist/themes.css' ), array(), COMMENTEDITPRO_VERSION, 'all' );
			wp_enqueue_style( 'sce-styles-admin', Functions::get_plugin_url( 'dist/admin.css' ), array( 'sce-styles' ), COMMENTEDITPRO_VERSION, 'all' );

			wp_enqueue_script( 'fancybox', plugins_url( '/fancybox/jquery.fancybox.min.js', dirname( __FILE__ ) ), array( 'jquery' ), COMMENTEDITPRO_VERSION, true );
			wp_enqueue_style( 'fancybox', plugins_url( '/fancybox/jquery.fancybox.min.css', dirname( __FILE__ ) ), array(), COMMENTEDITPRO_VERSION, 'all' );
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
		add_action( $prefix . 'plugin_action_links_' . COMMENTEDITPRO_SLUG, array( $this, 'plugin_settings_link' ) );
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
				__( 'Comment Edit Pro', 'comment-edit-pro' ),
				__( 'Comment Edit Pro', 'comment-edit-pro' ),
				'manage_network',
				'comment-edit-pro',
				array( '\CommentEditPro\Includes\Admin_Settings', 'settings_page' )
			);
		} else {
			$hook = add_submenu_page(
				'options-general.php',
				__( 'Comment Edit Pro', 'comment-edit-pro' ),
				__( 'Comment Edit Pro', 'comment-edit-pro' ),
				'manage_options',
				'comment-edit-pro',
				array( '\CommentEditPro\Includes\Admin_Settings', 'settings_page' )
			);
		}
		add_action( 'in_admin_header', array( '\CommentEditPro\Includes\Admin_Settings', 'get_admin_header' ) );
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
		$admin_anchor = sprintf( '<a href="%s">%s</a>', esc_url( $this->get_url() ), esc_html__( 'Settings', 'comment-edit-pro' ) );
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
