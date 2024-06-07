<?php

/**
 * Output main WPAC tab.
 *
 * @package WPAC
 */

namespace DLXPlugins\WPAC\Admin\Tabs;

if ( ! defined( 'ABSPATH' ) ) {
	die( 'No direct access.' );
}

if ( ! defined( 'ABSPATH' ) ) {
	die( 'No direct access.' );
}

use DLXPlugins\WPAC\Functions;
use DLXPlugins\WPAC\Options;

/**
 * Output the main tab and content.
 */
class Main {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_filter( 'ajaxify_comments_admin_tabs', array( $this, 'add_main_tab' ), 1, 1 );
		add_filter( 'ajaxify_comments_admin_sub_tabs', array( $this, 'add_main_main_sub_tab' ), 1, 3 );
		add_filter( 'ajaxify_comments_output_home', array( $this, 'output_main_content' ), 1, 3 );
		add_action( 'wpac_admin_enqueue_scripts_home', array( $this, 'admin_scripts' ) );
		add_action( 'wp_ajax_wpac_get_home_options', array( $this, 'ajax_get_options' ) );
	}

	/**
	 * Include admin scripts for the home screen.
	 */
	public function admin_scripts() {
		$deps = require_once Functions::get_plugin_dir( 'dist/wpac-admin-home-js.asset.php' );
		wp_enqueue_script(
			'wpac-admin-home',
			Functions::get_plugin_url( 'dist/wpac-admin-home-js.js' ),
			$deps['dependencies'],
			$deps['version'],
			true
		);
		wp_localize_script(
			'wpac-admin-home',
			'wpacAdminHome',
			array(
				'getNonce'     => wp_create_nonce( 'wpac-admin-home-retrieve-options' ),
				'saveNonce'    => wp_create_nonce( 'wpac-admin-home-save-options' ),
				'resetNonce'   => wp_create_nonce( 'wpac-admin-home-reset-options' ),
				'selectorsUrl' => esc_url( add_query_arg( array( 'first_time_install' => '1' ), Functions::get_settings_url( 'selectors' ) ) ),
				'hasThemeChanged' => (bool) get_option( 'wpac_theme_has_changed', false ),
			)
		);
	}

	/**
	 * Retrieve options via Ajax for the home options.
	 */
	public function ajax_get_options() {
		$nonce = sanitize_text_field( filter_input( INPUT_POST, 'nonce', FILTER_DEFAULT ) );
		// Security.
		if ( ! wp_verify_nonce( $nonce, 'wpac-admin-home-retrieve-options' ) || ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'Could not verify nonce.', 'wp-ajaxify-comments' ),
				)
			);
		}

		$options = Options::get_options();
		$options = Functions::sanitize_array_recursive( $options );

		// Remove has theme changed option as we don't want to show it twice.
		delete_option( 'wpac_theme_has_changed' );

		// Send response.
		wp_send_json_success( $options );
	}

	/**
	 * Add the main tab and callback actions.
	 *
	 * @param array $tabs Array of tabs.
	 *
	 * @return array of tabs.
	 */
	public function add_main_tab( $tabs ) {
		$tabs[] = array(
			'get'    => 'home',
			'action' => 'ajaxify_comments_output_home',
			'url'    => Functions::get_settings_url( 'home' ),
			'label'  => _x( 'Home', 'Tab label as Main', 'wp-ajaxify-comments' ),
			'icon'   => 'home-heart',
		);
		return $tabs;
	}

	/**
	 * Add the main main tab and callback actions.
	 *
	 * @param array  $tabs        Array of tabs.
	 * @param string $current_tab The current tab selected.
	 * @param string $sub_tab     The current sub-tab selected.
	 *
	 * @return array of tabs.
	 */
	public function add_main_main_sub_tab( $tabs, $current_tab, $sub_tab ) {
		if ( ( ! empty( $current_tab ) || ! empty( $sub_tab ) ) && 'main' !== $current_tab ) {
			return $tabs;
		}
		return $tabs;
	}

	/**
	 * Begin Main routing for the various outputs.
	 *
	 * @param string $tab     Main tab.
	 * @param string $sub_tab Sub tab.
	 */
	public function output_main_content( $tab, $sub_tab = '' ) {
		if ( 'home' === $tab ) {
			if ( empty( $sub_tab ) || 'home' === $sub_tab ) {
				?>
				<div id="wpac-tab-home"></div>
				<?php
			}
		}
	}
}
