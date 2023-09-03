<?php
/**
 * Output Ajaxify Settings.
 *
 * @package WPAC
 */

namespace DLXPlugins\WPAC\Admin;

if ( ! defined( 'ABSPATH' ) ) {
	die( 'No direct access.' );
}

use DLXPlugins\WPAC\Functions as Functions;

/**
 * Class Settings
 */
class Settings {
	/**
	 * Registers and outputs placeholder for settings.
	 *
	 * @since 1.0.0
	 */
	public static function settings_page() {
		?>
		<?php
		self::get_settings_header();
		?>
		<div class="ajaxify-settings-tabs-wrapper">
			<div class="ajaxify-settings-tabs">
				<?php
				self::get_settings_tabs();
				?>
				<span aria-hidden="true"></span>
			</div>
		</div>
		<?php
		self::get_settings_footer();
		?>
		<?php
	}

	/**
	 * Output Generic Settings Place holder for React goodness.
	 */
	public static function get_settings_header() {
		$user      = wp_get_current_user();
		$user_id   = $user->ID;
		$firstname = get_user_meta( $user_id, 'first_name', true );
		$lastname  = get_user_meta( $user_id, 'last_name', true );
		$website   = home_url();

		$support_url = add_query_arg(
			array(
				'firstname' => $firstname,
				'lastname'  => $lastname,
				'site'      => $website,
				'email'     => $user->data->user_email,
				'license'   => '',
				'product'   => 'Ajaxify Comments',
				'subject'   => 'Ajaxify Comments support',
				'support'   => 'Yes',
			),
			'https://dlxplugins.com/support/'
		);
		?>
		<header id="ajaxify-admin-header">
			<div id="ajaxify-admin-header-content">
				<div class="ajaxify-admin-header-logo">
					<h1>
						<a href="<?php echo esc_url( Functions::get_settings_url() ); ?>" class="ajaxify-admin-logo"><img src="<?php echo esc_url( Functions::get_plugin_url( 'assets/img/ajaxify-logo-horizontal.png' ) ); ?>" alt="Ajaxify Comments" /></a>
					</h1>
					<p class="ajaxify-info-text"><?php esc_html_e( 'Ajaxify your comment section.', 'wp-ajaxify-comments' ); ?></p>
				</div>
				<div class="ajaxify-admin-header-links">
					<a href="#" target="_blank" class="ajaxify-admin-link" rel="noreferrer"><?php esc_html_e( 'Documentation', 'wp-ajaxify-comments' ); ?></a>
					<a href="<?php echo esc_url_raw( $support_url ); ?>" target="_blank" class="ajaxify-admin-link" rel="noreferrer"><?php esc_html_e( 'Support', 'wp-ajaxify-comments' ); ?></a>
				</div>
			</div>
		</header>
		<?php
	}

	/**
	 * Get the admin footer.
	 */
	public static function get_admin_header() {
		// Make sure we enqueue on the right admin screen.
		$screen = get_current_screen();
		if ( ! isset( $screen->id ) ) {
			return;
		}
		if ( isset( $screen->base ) && 'settings_page_ajaxify-comments' !== $screen->base ) {
			return;
		}
		?>
		<svg width="0" height="0" class="hidden">
			<symbol aria-hidden="true" data-prefix="fas" data-icon="home-heart" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" id="home-heart">
				<g class="fa-group"><path class="fa-secondary" fill="currentColor" d="M64.11 311.38V496a16.05 16.05 0 0 0 16 16h416a16.05 16.05 0 0 0 16-16V311.38c-6.7-5.5-44.7-38.31-224-196.4-180.11 158.9-217.6 191.09-224 196.4zm314.1-26.31a60.6 60.6 0 0 1 4.5 89.11L298 459.77a13.94 13.94 0 0 1-19.8 0l-84.7-85.59a60.66 60.66 0 0 1 4.3-89.11c24-20 59.7-16.39 81.6 5.81l8.6 8.69 8.6-8.69c22.01-22.2 57.71-25.81 81.61-5.81z" opacity="0.4"></path><path class="fa-primary" fill="currentColor" d="M378.21 285.07c-23.9-20-59.6-16.39-81.6 5.81l-8.6 8.69-8.6-8.69c-21.9-22.2-57.6-25.81-81.6-5.81a60.66 60.66 0 0 0-4.3 89.11l84.7 85.59a13.94 13.94 0 0 0 19.8 0l84.7-85.59a60.6 60.6 0 0 0-4.5-89.11zm192.6-48.8l-58.7-51.79V48a16 16 0 0 0-16-16h-64a16 16 0 0 0-16 16v51.7l-101.3-89.43a40 40 0 0 0-53.5 0l-256 226a16 16 0 0 0-1.2 22.61l21.4 23.8a16 16 0 0 0 22.6 1.2l229.4-202.2a16.12 16.12 0 0 1 21.2 0L528 284a16 16 0 0 0 22.6-1.21L572 259a16.11 16.11 0 0 0-1.19-22.73z"></path></g>
			</symbol>
			<symbol aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" id="file-code">
				<path fill="currentColor" class="fa-primary" d="M384 160L224 0V128c0 17.7 14.3 32 32 32H384zM153 289c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0L71 303c-9.4 9.4-9.4 24.6 0 33.9l48 48c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-31-31 31-31zM265 255c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l31 31-31 31c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l48-48c9.4-9.4 9.4-24.6 0-33.9l-48-48z"/><path fill="currentColor" class="fa-secondary" d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zM153 289c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0L71 303c-9.4 9.4-9.4 24.6 0 33.9l48 48c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-31-31 31-31zM265 255c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l31 31-31 31c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l48-48c9.4-9.4 9.4-24.6 0-33.9l-48-48z" opacity="0.4"/>
			</symbol>
			<symbol aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" id="brush">
				<path fill="currentColor" class="fa-primary" d="M0 288H384v32c0 35.3-28.7 64-64 64H256v64c0 35.3-28.7 64-64 64s-64-28.7-64-64V384H64c-35.3 0-64-28.7-64-64V288zM192 464a16 16 0 1 0 0-32 16 16 0 1 0 0 32z"/><path fill="currentColor" class="fa-secondary" d="M162.4 6c-1.5-3.6-5-6-8.9-6h-19c-3.9 0-7.5 2.4-8.9 6L104.9 57.7c-3.2 8-14.6 8-17.8 0L66.4 6c-1.5-3.6-5-6-8.9-6H48C21.5 0 0 21.5 0 48V256v22.4V288H9.6 374.4 384v-9.6V256 48c0-26.5-21.5-48-48-48H230.5c-3.9 0-7.5 2.4-8.9 6L200.9 57.7c-3.2 8-14.6 8-17.8 0L162.4 6z" opacity="0.4"/>
			</symbol>
		</svg>
		<?php do_action( 'comment_edit_pro_add_admin_header_content' ); ?>
		<?php
	}
	/**
	 * Output the top-level admin tabs.
	 */
	public static function get_settings_tabs() {
		

		$settings_url_base = Functions::get_settings_url( 'home' );

		$tabs = array();
		/**
		 * Filer the output of the tab output.
		 *
		 * Potentially modify or add your own tabs.
		 *
		 * @since 1.0.0
		 *
		 * @param array $tabs Associative array of tabs.
		 */
		$tabs       = apply_filters( 'ajaxify_comments_admin_tabs', $tabs );
		$tab_html   = '<nav class="ajaxify-admin-options">';
		$tabs_count = count( $tabs );
		if ( $tabs && ! empty( $tabs ) && is_array( $tabs ) ) {
			$active_tab = Functions::get_admin_tab();
			if ( null === $active_tab ) {
				$active_tab = 'home';
			}
			$is_tab_match = false;
			if ( 'home' === $active_tab ) {
				$active_tab = 'home';
			} else {
				foreach ( $tabs as $tab ) {
					$tab_get = isset( $tab['get'] ) ? $tab['get'] : '';
					if ( $active_tab === $tab_get ) {
						$is_tab_match = true;
					}
				}
				if ( ! $is_tab_match ) {
					$active_tab = 'home';
				}
			}
			$do_action = false;
			foreach ( $tabs as $tab ) {
				$classes = array();
				$tab_get = isset( $tab['get'] ) ? $tab['get'] : '';
				if ( $active_tab === $tab_get ) {
					$classes[] = 'nav-tab-active';
					$do_action = isset( $tab['action'] ) ? $tab['action'] : false;
				} elseif ( ! $is_tab_match && 'home' === $tab_get ) {
					$classes[] = 'nav-tab-active';
					$do_action = isset( $tab['action'] ) ? $tab['action'] : false;
				}
				$tab_url   = isset( $tab['url'] ) ? $tab['url'] : '';
				$tab_label = isset( $tab['label'] ) ? $tab['label'] : '';
				$tab_html .= sprintf(
					'<a href="%s" class="%s" id="eff-%s"><svg class="ajaxify-icon ajaxify-icon-tab">%s</svg><span>%s</span></a>',
					esc_url( $tab_url ),
					esc_attr( implode( ' ', $classes ) ),
					esc_attr( $tab_get ),
					sprintf( '<use xlink:href="#%s"></use>', esc_attr( $tab['icon'] ) ),
					esc_html( $tab['label'] )
				);
			}
			$tab_html .= '</nav>';
			if ( $tabs_count > 0 ) {
				echo wp_kses( $tab_html, Functions::get_kses_allowed_html() );
			}

			$current_tab     = Functions::get_admin_tab();
			$current_sub_tab = Functions::get_admin_sub_tab();

			/**
			 * Filer the output of the sub-tab output.
			 *
			 * Potentially modify or add your own sub-tabs.
			 *
			 * @since 1.0.0
			 *
			 * @param array Associative array of tabs.
			 * @param string Tab
			 * @param string Sub Tab
			 */
			$sub_tabs = apply_filters( 'ajaxify_comments_admin_sub_tabs', array(), $current_tab, $current_sub_tab );

			// Check to see if no tabs are available for this view.
			if ( null === $current_tab && null === $current_sub_tab ) {
				$current_tab = 'home';
			}
			ob_start();
			if ( $sub_tabs && ! empty( $sub_tabs ) && is_array( $sub_tabs ) ) {
				if ( null === $current_sub_tab ) {
					$current_sub_tab = '';
				}
				$is_tab_match      = false;
				$first_sub_tab     = current( $sub_tabs );
				$first_sub_tab_get = $first_sub_tab['get'];
				if ( $first_sub_tab_get === $current_sub_tab ) {
					$active_tab = $current_sub_tab;
				} else {
					$active_tab = $current_sub_tab;
					foreach ( $sub_tabs as $tab ) {
						$tab_get = isset( $tab['get'] ) ? $tab['get'] : '';
						if ( $active_tab === $tab_get ) {
							$is_tab_match = true;
						}
					}
					if ( ! $is_tab_match ) {
						$active_tab = $first_sub_tab_get;
					}
				}
				$sub_tab_html_array = array();
				$do_subtab_action   = false;
				$maybe_sub_tab      = '';
				foreach ( $sub_tabs as $sub_tab ) {
					$classes = array( 'ajaxify-sub-tab' );
					$tab_get = isset( $sub_tab['get'] ) ? $sub_tab['get'] : '';
					if ( $active_tab === $tab_get ) {
						$classes[]        = 'ajaxify-sub-tab-active';
						$do_subtab_action = true;
						$current_sub_tab  = $tab_get;
					} elseif ( ! $is_tab_match && $first_sub_tab_get === $tab_get ) {
						$classes[]        = 'ajaxify-sub-tab-active';
						$do_subtab_action = true;
						$current_sub_tab  = $first_sub_tab_get;
					}
					$tab_url   = isset( $sub_tab['url'] ) ? $sub_tab['url'] : '';
					$tab_label = isset( $sub_tab['label'] ) ? $sub_tab['label'] : '';
					if ( $current_sub_tab === $tab_get ) {
						$sub_tab_html_array[] = sprintf( '<span class="%s" id="ajaxify-tab-%s">%s</span>', esc_attr( implode( ' ', $classes ) ), esc_attr( $tab_get ), esc_html( $sub_tab['label'] ) );
					} else {
						$sub_tab_html_array[] = sprintf( '<a href="%s" class="%s" id="ajaxify-tab-%s">%s</a>', esc_url( $tab_url ), esc_attr( implode( ' ', $classes ) ), esc_attr( $tab_get ), esc_html( $sub_tab['label'] ) );
					}
				}
				if ( ! empty( $sub_tab_html_array ) ) {
					echo '<nav class="ajaxify-sub-links">' . wp_kses_post( rtrim( implode( ' | ', $sub_tab_html_array ), ' | ' ) ) . '</nav>';
				}
				if ( $do_subtab_action ) {
					/**
					 * Perform a sub tab action.
					 *
					 * Perform a sub tab action. Useful for loading scripts or inline styles as necessary.
					 *
					 * @since 1.0.0
					 *
					 * eff_admin_sub_tab_{current_tab}_{current_sub_tab}
					 * @param string Sub Tab
					 */
					do_action(
						sprintf( // phpcs:ignore
							'ajaxify_comments_admin_sub_tab_%s_%s',
							sanitize_title( $current_tab ),
							sanitize_title( $current_sub_tab )
						)
					);
				}
			}
			$subtab_content = ob_get_clean();

			if ( $do_action ) {
				echo '<div class="ajaxify-admin-tab-content">';
				if ( ! empty( $subtab_content ) ) {
					echo wp_kses( $subtab_content, Functions::get_kses_allowed_html() );
				}
				/**
				 * Perform a tab action.
				 *
				 * Perform a tab action.
				 *
				 * @since 1.0.0
				 *
				 * @param string $action Can be any action.
				 * @param string Tab
				 * @param string Sub Tab
				 */
				do_action( $do_action, $current_tab, $current_sub_tab );

				echo '</div>';
			}
		}
	}

	/**
	 * Run script and enqueue stylesheets and stuff like that.
	 */
	public static function get_settings_footer() {
		?>
		</div><!-- .wrap.ajaxify-admin-wrap -->
		<?php
	}
}
