<?php
/**
 * Output Tools SCE Tab.
 *
 * @package CommentEditPro
 */

namespace CommentEditPro\Includes\Admin_Tabs;

if ( ! defined( 'ABSPATH' ) ) {
	die( 'No direct access.' );
}

use CommentEditPro\Includes\Options as Options;
use CommentEditPro\Includes\Functions as Functions;

/**
 * Output the tools tab and content.
 */
class Tools {
	/**
	 * Constructor.
	 */
	public function __construct() {
		add_filter( 'comment_edit_pro_admin_tabs', array( $this, 'add_main_tab' ), 1, 1 );
		add_filter( 'comment_edit_pro_admin_sub_tabs', array( $this, 'add_main_main_sub_tab' ), 1, 3 );
		add_filter( 'comment_edit_pro_output_tools', array( $this, 'output_main_content' ), 1, 3 );
	}

	/**
	 * Add the tools tab and callback actions.
	 *
	 * @param array $tabs Array of tabs.
	 *
	 * @return array of tabs.
	 */
	public function add_main_tab( $tabs ) {
		$tabs[] = array(
			'get'    => 'tools',
			'action' => 'comment_edit_pro_output_tools',
			'url'    => Functions::get_settings_url( 'tools' ),
			'label'  => _x( 'Tools', 'Tab label as Tools', 'ultimate-auto-updates' ),
			'icon'   => 'tools',
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
		if ( ( ! empty( $current_tab ) || ! empty( $sub_tab ) ) && 'tools' === $current_tab ) {
			$tabs[] = array(
				'get'    => 'comment-tools',
				'action' => 'comment_edit_pro_output_tools_subtab',
				'url'    => Functions::get_settings_url( 'tools' ),
				'label'  => _x( 'Tools', 'Tab label as Tools', 'ultimate-auto-updates' ),
			);
			$tabs[] = array(
				'get'    => 'comment-activity',
				'action' => 'comment_edit_pro_output_tools_comment_activity',
				'url'    => Functions::get_settings_url( 'tools', 'comment-activity' ),
				'label'  => _x( 'Post Expiration', 'Tab label as Tools', 'ultimate-auto-updates' ),
			);
			$tabs[] = array(
				'get'    => 'comment-shortcuts',
				'action' => 'comment_edit_pro_output_tools_comment_shortcuts',
				'url'    => Functions::get_settings_url( 'tools', 'comment-shortcuts' ),
				'label'  => _x( 'Comment Shortcuts', 'Tab label as Tools', 'ultimate-auto-updates' ),
			);
			$tabs[] = array(
				'get'    => 'post-types',
				'action' => 'comment_edit_pro_output_tools_post_types',
				'url'    => Functions::get_settings_url( 'tools', 'post-types' ),
				'label'  => _x( 'Post Types', 'Tab label as Tools', 'ultimate-auto-updates' ),
			);
			// $tabs[] = array(
			// 	'get'    => 'bulk',
			// 	'action' => 'comment_edit_pro_output_tools_post_types',
			// 	'url'    => Functions::get_settings_url( 'tools', 'post-types' ),
			// 	'label'  => _x( 'Bulk', 'Tab label as Bulk', 'ultimate-auto-updates' ),
			// );
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
		if ( 'tools' === $tab ) {
			if ( empty( $sub_tab ) || 'comment-tools' === $sub_tab ) {
				?>
				<div class="sce-admin-panel-area">
					<div class="sce-panel-row">
						<h2><?php esc_html_e( 'Comment Edit Pro Tools', 'comment-edit-pro' ); ?></h2>
						<p><?php esc_html_e( 'Tools are where you can find comment helpers, overrides, set post comment expiration, and blanket enable or disable comments..', 'comment-edit-pro' ); ?></p>
					</div>
				</div>
				<div class="sce-admin-panel-cards">
					<div class="sce-admin-panel-card">
						<div class="sce-admin-panel-card-header">
							<a href="<?php echo esc_url( Functions::get_settings_url( 'tools', 'comment-activity' ) ); ?>"><img src="<?php echo esc_url( Functions::get_plugin_url( 'images/admin/hour-glass.jpg' ) ); ?>" alt="<?php esc_html_e( 'Photo of a clock and hourglass.', 'comment-edit-pro' ); ?>" /></a>
						</div>
						<div class="sce-admin-panel-card-body">
							<h3><?php esc_html_e( 'Post Activity Expiration', 'comment-edit-pro' ); ?></h3>
							<p><?php esc_html_e( 'Instead of setting your content to expire after a set amount of days, close comments instead by how long any activity has taken place.', 'comment-edit-pro' ); ?></p>
						</div>
						<div class="sce-admin-panel-card-footer">
							<a href="<?php echo esc_url( Functions::get_settings_url( 'tools', 'comment-activity' ) ); ?>"><?php esc_html_e( 'View Expiration Settings', 'comment-edit-pro' ); ?></a>
						</div>
					</div>
					<div class="sce-admin-panel-card">
						<div class="sce-admin-panel-card-header">
							<a href="<?php echo esc_url( Functions::get_settings_url( 'tools', 'comment-shortcuts' ) ); ?>"><img src="<?php echo esc_url( Functions::get_plugin_url( 'images/admin/shortcuts.jpg' ) ); ?>" alt="<?php esc_html_e( 'A man taking a shortcut into a portal.', 'comment-edit-pro' ); ?>" /></a>
						</div>
						<div class="sce-admin-panel-card-body">
							<h3><?php esc_html_e( 'Comment Shortcuts', 'comment-edit-pro' ); ?></h3>
							<p><?php esc_html_e( 'Please some shortcuts in Comments menu, and add shortcuts to the top admin bar menu too.', 'comment-edit-pro' ); ?></p>
						</div>
						<div class="sce-admin-panel-card-footer">
							<a href="<?php echo esc_url( Functions::get_settings_url( 'tools', 'comment-shortcuts' ) ); ?>"><?php esc_html_e( 'View Shortcuts Settings', 'comment-edit-pro' ); ?></a>
						</div>
					</div>
					<div class="sce-admin-panel-card">
						<div class="sce-admin-panel-card-header">
						<a href="<?php echo esc_url( Functions::get_settings_url( 'tools', 'post-types' ) ); ?>"><img src="<?php echo esc_url( Functions::get_plugin_url( 'images/admin/comment-bubble.jpg' ) ); ?>" alt="<?php esc_html_e( 'Screenshot of Speech bubbles', 'comment-edit-pro' ); ?>" /></a>
						</div>
						<div class="sce-admin-panel-card-body">
							<h3><?php esc_html_e( 'Post Type Settings', 'comment-edit-pro' ); ?></h3>
							<p><?php esc_html_e( 'Blanket enable or disable comments for your various post types.', 'comment-edit-pro' ); ?></p>
						</div>
						<div class="sce-admin-panel-card-footer">
							<a href="<?php echo esc_url( Functions::get_settings_url( 'tools', 'post-types' ) ); ?>"><?php esc_html_e( 'View Post Type Settings', 'comment-edit-pro' ); ?></a>
						</div>
					</div>
				</div>
				<?php
			}
		}
		if ( 'tools' === $tab ) {
			if ( empty( $sub_tab ) || 'comment-activity' === $sub_tab ) {
				?>
				<div class="sce-admin-panel-area">
					<div class="sce-panel-row">
						<div id="sce-tab-tools-comment-activity"><?php echo wp_kses( Functions::get_loading_svg(), Functions::get_kses_allowed_html( true ) ); ?></div>
					</div>
				</div>
				<?php
			}
		}
		if ( 'tools' === $tab ) {
			if ( empty( $sub_tab ) || 'comment-shortcuts' === $sub_tab ) {
				?>
				<div class="sce-admin-panel-area">
					<div class="sce-panel-row">
						<div id="sce-tab-tools-comment-shortcuts"><?php echo wp_kses( Functions::get_loading_svg(), Functions::get_kses_allowed_html( true ) ); ?></div>
					</div>
				</div>
				<?php
			}
		}
		if ( 'tools' === $tab ) {
			if ( empty( $sub_tab ) || 'post-types' === $sub_tab ) {
				?>
				<div class="sce-admin-panel-area">
					<div class="sce-panel-row">
						<div id="sce-tab-tools-post-type-comment-settings"><?php echo wp_kses( Functions::get_loading_svg(), Functions::get_kses_allowed_html( true ) ); ?></div>
					</div>
				</div>
				<?php
			}
		}
		if ( 'tools' === $tab ) {
			if ( empty( $sub_tab ) || 'bulk' === $sub_tab ) {
				?>
				<div class="sce-admin-panel-area">
					<div class="sce-panel-row">
						<div id="sce-tab-tools-bulk"><?php echo wp_kses( Functions::get_loading_svg(), Functions::get_kses_allowed_html( true ) ); ?></div>
					</div>
				</div>
				<?php
			}
		}
	}
}
