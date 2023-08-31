<?php
/**
 * Output main SCE tab.
 *
 * @package CommentEditPro
 */

namespace CommentEditPro\Includes\Admin_Tabs;

if ( ! defined( 'ABSPATH' ) ) {
	die( 'No direct access.' );
}

use CommentEditPro\Includes\Options as Options;
use CommentEditPro\Includes\Functions as Functions;
use CommentEditPro\Includes\Avatars as Avatars_Helper;

/**
 * Output the main tab and content.
 */
class Avatars {
	/**
	 * Constructor.
	 */
	public function __construct() {
		add_filter( 'comment_edit_pro_admin_tabs', array( $this, 'add_main_tab' ), 1, 1 );
		add_filter( 'comment_edit_pro_admin_sub_tabs', array( $this, 'add_main_main_sub_tab' ), 1, 3 );
		add_filter( 'comment_edit_pro_output_avatars', array( $this, 'output_main_content' ), 1, 3 );
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
			'get'    => 'avatars',
			'action' => 'comment_edit_pro_output_avatars',
			'url'    => Functions::get_settings_url( 'avatars' ),
			'label'  => _x( 'Avatars', 'Tab label as Main', 'ultimate-auto-updates' ),
			'icon'   => 'users',
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
		if ( 'avatars' === $tab ) {
			if ( empty( $sub_tab ) || 'avatars' === $sub_tab ) {
				?>
				<div id="sce-tab-avatars">
					<?php echo wp_kses( Functions::get_loading_svg(), Functions::get_kses_allowed_html( true ) ); ?>
				</div>	
				
				<!-- <div class="sce-admin-panel-area">
					<div class="sce-panel-row">
						<div id="sce-tab-avatar-protection"></div>
					</div>
				</div> -->
				<?php
			}
		}
	}
}
