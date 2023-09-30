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
 * Lazy_Load for WPAC.
 */
class Lazy_Load {




	/**
	 * Class runner.
	 */
	public function run() {
		add_action( 'wp_footer', array( $this, 'output_spinner_html' ) );
	}

	/**
	 * Output the spinner HTML.
	 */
	public function output_spinner_html() {
		$options = Options::get_options();

		// Get spinner arguments.
		$spinner      = $options['lazyLoadInlineSpinner'];
		$spinner_slug = preg_replace_callback(
			'/([A-Z0-9])/',
			function ( $matches ) {
				return '-' . strtolower( $matches[1] );
			},
			lcfirst( $spinner )
		);

		// Get spinner filename.
		$spinner_filename = $spinner_slug . '.svg';
		$spinner_url      = Functions::get_plugin_url( 'assets/svgs/' . $spinner_filename );
		$spinner_dir      = Functions::get_plugin_dir( 'assets/svgs/' . $spinner_filename );

		// Get label arguments.
		$label         = $options['lazyLoadInlineSpinnerLabel'];
		$label_enabled = (bool) $options['lazyLoadInlineSpinnerLabelEnabled'];

		// Check to see if spinner exists.
		$has_spinner = false;
		
		// Get icon SVG markup.
		$icon_svg = wp_cache_get( 'ajaxify_comments_spinner_svg', 'ajaxify_comments' );
		if ( false === $icon_svg ) {
			if ( file_exists( $spinner_dir ) ) {
				$icon_svg = wp_kses(
					file_get_contents( $spinner_dir ),
					Functions::get_kses_allowed_html( true )
				);
				if ( ! empty( $icon_svg ) && ! is_wp_error( $icon_svg) ) {
					$has_spinner = true;
					wp_cache_set( 'ajaxify_comments_spinner_svg', $icon_svg, 'ajaxify_comments' );
				}
			}
		}

		// Get spinner speed (ensure float).
		$spinner_speed = (float) $options['lazyLoadInlineSpinnerSpeed'];

		/**
		 * Filter the spinner URL.
		 *
		 * @param string $spinner_url The URL of the spinner.
		 */
		$spinner_url = apply_filters( 'dlxplugins/ajaxify/comments/lazyload/spinner/url', $spinner_url );
		ob_start();
		?>
		<!-- Added by Ajaxify Comments -->
		<div class="ajaxify-comments-spinner__wrapper ajaxify-layout-left" aria-hidden="true">
			<style>
				:root {
					--ajaxify-comments-spinner-container-background-color: #333;
					--ajaxify-comments-spinner-label-font-size: 32px;
					--ajaxify-comments-spinner-icon-color: #FFFFFF;
					--ajaxify-comments-spinner-icon-size: 72px;
					--ajaxify-comments-spinner-label-color: #FFFFFF;
					--ajaxify-comments-spinner-icon-margin-right: 20px;
					--ajaxify-comments-spinner-icon-animation-speed: <?php echo esc_html( $spinner_speed ); ?>s;
					--ajaxify-comments-spinner-container-padding: 30px;
				}
			</style>
			<div class="ajaxify-comments-spinner__inner">
			<?php
			if ( ! empty( $icon_svg ) && $has_spinner ) {
				?>
					<div class="ajaxify-comments-spinner__icon">
						<?php
						echo wp_kses( $icon_svg, Functions::get_kses_allowed_html( true ) );
						?>
					</div>
					<?php
			}
			if ( ! empty( $label ) && $label_enabled ) {
				?>
					<div class="ajaxify-comments-spinner__label" aria-hidden="true">
					<?php echo esc_html( $label ); ?>
					</div>
					<?php
			}
			?>
			</div><!-- .ajaxify-comments-spinner__inner -->
		</div><!-- .ajaxify-comments-spinner__wrapper -->
		<?php
		$html = ob_get_clean();
		echo $html;
	}
}
