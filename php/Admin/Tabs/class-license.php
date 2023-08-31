<?php
/**
 * Output licenses tab.
 *
 * @package CommentEditPro
 */

namespace CommentEditPro\Includes\Admin_Tabs;

if ( ! defined( 'ABSPATH' ) ) {
	die( 'No direct access.' );
}

use CommentEditPro\Includes\Plugin_License as License_Helper;
use CommentEditPro\Includes\Functions as Functions;
use CommentEditPro\Includes\Options as Options;

/**
 * Output the main tab and content.
 */
class License {
	/**
	 * Constructor.
	 */
	public function __construct() {
		add_filter( 'comment_edit_pro_admin_tabs', array( $this, 'add_main_tab' ), 1, 9 );
		add_filter( 'comment_edit_pro_admin_sub_tabs', array( $this, 'add_main_main_sub_tab' ), 1, 3 );
		add_filter( 'comment_edit_pro_output_license', array( $this, 'output_main_content' ), 1, 3 );
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
			'get'    => 'license',
			'action' => 'comment_edit_pro_output_license',
			'url'    => Functions::get_settings_url( 'license' ),
			'label'  => _x( 'License', 'Tab label as License', 'ultimate-auto-updates' ),
			'icon'   => 'file-certificate',
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
		if ( 'license' === $tab ) {
			if ( empty( $sub_tab ) || 'license' === $sub_tab ) {

				wp_enqueue_script(
					'sce-admin-license',
					Functions::get_plugin_url( '/dist/sce-license.js' ),
					array(),
					Functions::get_plugin_version(),
					true
				);
				wp_localize_script(
					'sce-admin-license',
					'sceAdminLicense',
					array(
						'ajaxurl'     => admin_url( 'admin-ajax.php' ),
						'save_nonce'  => wp_create_nonce( 'sce-save-license-options' ),
						'get_nonce'   => wp_create_nonce( 'sce-retrieve-license-options' ),
						'reset_nonce' => wp_create_nonce( 'sce-reset-license-options' ),
					)
				);
				?>
				<div id="sce-tab-license"><?php echo wp_kses( Functions::get_loading_svg(), Functions::get_kses_allowed_html( true ) ); ?></div>
				<?php
			}
		}
	}
}
