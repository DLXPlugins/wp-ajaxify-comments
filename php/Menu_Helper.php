<?php
/**
 * Register the menu helper and settings.
 *
 * @package WPAC
 */

namespace DLXPlugins\WPAC;

if ( ! defined( 'ABSPATH' ) ) {
	die( 'No direct access.' );
}

/**
 * Menu_Helper for WPAC.
 */
class Menu_Helper {

	/**
	 * Class runner.
	 */
	public function run() {
		// Bail if not on frontend.
		if ( is_admin() ) {
			return;
		}

		add_action( 'admin_bar_menu', array( $this, 'admin_bar_menu' ), 99 );
	}

	/**
	 * Add the admin bar menu.
	 *
	 * @param WP_Admin_Bar $admin_bar Admin bar reference.
	 */
	public function admin_bar_menu( $admin_bar ) {
		$admin_bar->add_menu(
			array(
				'id'    => 'wpac-menu-helper',
				'title' => __( 'Ajaxify', 'wp-ajaxify-comments' ),
				'href'  => '#',
				'meta'  => array(
					'class' => 'wpac-menu-helper',
					'title' => __( 'WP Ajaxify Comments', 'wp-ajaxify-comments' ),
				),
			)
		);
	}
}
