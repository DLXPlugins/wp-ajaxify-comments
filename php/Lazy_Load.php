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
		add_action( 'wp_footer', array( $this, 'output_skeleton_html' ) );
		add_action( 'wp_footer', array( $this, 'output_shortcode_html' ) );
		add_action( 'wp_footer', array( $this, 'output_loading_button_html' ) );
	}

	/**
	 * Output loading button HTML.
	 */
	public function output_loading_button_html() {
		$options = Options::get_options();

		// If lazy loading is not enabled, bail.
		if ( ! Functions::is_lazy_loading_enabled( false, true ) ) {
			return;
		}

		// If inline is not selected or shortcode isn't the type, bail.
		if ( 'inline' !== $options['lazyLoadDisplay'] || 'button' !== $options['lazyLoadInlineLoadingType'] ) {
			return;
		}

		// Get button classes.
		$button_classes = array(
			'ajaxify-comments-loading-button',
		);
		if ( (bool) $options['lazyLoadInlineButtonUseThemeStyles'] ) {
			$button_classes[] = 'ajaxify-has-no-styles';
		} else {
			$button_classes[] = 'ajaxify-btn-reset';

			if ( 'transparent' === $options['lazyLoadInlineButtonAppearance'] ) {
				$button_classes[] = 'ajaxify-is-transparent';
			} elseif ( 'solid' === $options['lazyLoadInlineButtonAppearance'] ) {
				$button_classes[] = 'ajaxify-is-solid';
			}
		}
		?>
		<div id="wpac-lazy-load-content" aria-hidden="true">
			<style>
				.ajaxify-comments-loading-button:not(.ajaxify-has-no-styles)  {
					--ajaxify-comments-loading-button-background-color: <?php echo esc_html( $options['lazyLoadInlineButtonBackgroundColor'] ); ?>;
					--ajaxify-comments-loading-button-background-color-hover: <?php echo esc_html( $options['lazyLoadInlineButtonBackgroundColorHover'] ); ?>;
					--ajaxify-comments-loading-button-text-color: <?php echo esc_html( $options['lazyLoadInlineButtonTextColor'] ); ?>;
					--ajaxify-comments-loading-button-text-color-hover: <?php echo esc_html( $options['lazyLoadInlineButtonTextColorHover'] ); ?>;
					--ajaxify-comments-loading-button-border-color: <?php echo esc_html( $options['lazyLoadInlineButtonBorderColor'] ); ?>;
					--ajaxify-comments-loading-button-border-color-hover: <?php echo esc_html( $options['lazyLoadInlineButtonBorderColorHover'] ); ?>;
					--ajaxify-comments-loading-button-border-width: <?php echo esc_html( $options['lazyLoadInlineButtonBorderWidth'] ); ?>px;
					--ajaxify-comments-loading-button-border-radius: <?php echo esc_html( $options['lazyLoadInlineButtonBorderRadius'] ); ?>px;
					--ajaxify-comments-loading-button-padding-top: <?php echo esc_html( $options['lazyLoadInlineButtonPaddingTop'] ); ?>px;
					--ajaxify-comments-loading-button-padding-right: <?php echo esc_html( $options['lazyLoadInlineButtonPaddingRight'] ); ?>px;
					--ajaxify-comments-loading-button-padding-bottom: <?php echo esc_html( $options['lazyLoadInlineButtonPaddingBottom'] ); ?>px;
					--ajaxify-comments-loading-button-padding-left: <?php echo esc_html( $options['lazyLoadInlineButtonPaddingLeft'] ); ?>px;
					--ajaxify-comments-loading-button-font-size: <?php echo esc_html( $options['lazyLoadInlineButtonFontSize'] ); ?>px;
					--ajaxify-comments-loading-button-line-height: <?php echo esc_html( $options['lazyLoadInlineButtonLineHeight'] ); ?>;
					--ajaxify-comments-loading-button-font-weight: <?php echo esc_html( $options['lazyLoadInlineButtonFontWeight'] ); ?>;
					--ajaxify-comments-loading-button-font-family: <?php echo esc_html( $options['lazyLoadInlineButtonFontFamily'] ); ?>;
					--ajaxify-comments-loading-button-align: <?php echo esc_html( $options['lazyLoadInlineButtonAlign'] ); ?>;
				}
			</style>
			<?php
			$wrapper_classes = array(
				'ajaxify-comments-loading-button-wrapper',
				'ajaxify-align-' . $options['lazyLoadInlineButtonAlign'],
			);
			?>
			<div class="<?php echo esc_attr( implode( ' ', $wrapper_classes ) ); ?>">
				<?php
				$button_text = sanitize_text_field( $options['lazyLoadInlineButtonLabel'] );
				if ( ! empty( $button_text ) ) :
					?>
					<button class="<?php echo esc_attr( implode( ' ', $button_classes ) ); ?>">
						<?php echo esc_html( $button_text ); ?>
					</button>
					<?php
				endif;
				?>
			</div>
		</div>
		<?php
	}

	/**
	 * Add safe CSS.
	 *
	 * @param array $styles The styles.
	 */
	public function add_safe_css( $styles ) {
		$styles[] = 'fill';
		$styles[] = 'opacity';
		$styles[] = 'stroke';
		$styles[] = 'color';
		return $styles;
	}

	/**
	 * Output shortcode HTML.
	 */
	public function output_shortcode_html() {
		$options = Options::get_options();

		// If lazy loading is not enabled, bail.
		if ( ! Functions::is_lazy_loading_enabled( false, true ) ) {
			return;
		}

		// If inline is not selected or shortcode isn't the type, bail.
		if ( 'inline' !== $options['lazyLoadDisplay'] || 'shortcode' !== $options['lazyLoadInlineLoadingType'] ) {
			return;
		}

		// Get shortcode arguments.
		$shortcode         = sanitize_text_field( $options['lazyLoadInlineShortcode'] );
		$shortcode_content = do_shortcode( $shortcode );

		// Echo out shortcode content.
		echo '<div id="wpac-lazy-load-content" style="visibility: hidden; opacity: 0;" aria-hidden="true">';
		echo wp_kses_post( $shortcode_content );
		echo '</div>';
	}

	/**
	 * Output skeleton HTML.
	 */
	public function output_skeleton_html() {
		$options = Options::get_options();

		// If lazy loading is not enabled, bail.
		if ( ! Functions::is_lazy_loading_enabled( false, true ) ) {
			return;
		}

		// If inline is not selected or spinner isn't the type, bail.
		if ( 'inline' !== $options['lazyLoadDisplay'] || 'skeleton' !== $options['lazyLoadInlineLoadingType'] ) {
			return;
		}
		/*
		--ajaxify-skeleton-loader-background-color: #EEEEEE;
    --ajaxify-skeleton-loader-highlight-color: #dededede;
	--ajaxify-skeleton-loader-heading-color: #333;
	--ajaxify-skeleton-loader-heading-font-size: 24px;
	--ajaxify-skeleton-loader-heading-line-height: 1.45;
	--ajaxify-skeleton-gradient: linear-gradient(90deg, var(--ajaxify-skeleton-loader-background-color) 25%, var(--ajaxify-skeleton-loader-highlight-color) 50%, var(--ajaxify-skeleton-loader-background-color) 75%);
}
	'lazyLoadInlineSkeletonBackgroundColor'        => '#EEEEEE',
			'lazyLoadInlineSkeletonHighlightColor'         => '#dedede',
			'lazyLoadInlineSkeletonHeadingColor'           => '#333333',
			'lazyLoadInlineSkeletonHeadingFontSize'        => 24,
			'lazyLoadInlineSkeletonHeadingLineHeight'      => 1.5,
	*/
		?>
		<div id="wpac-lazy-load-content" aria-hidden="true">
		<style>
				.ajaxify-comments-loading-skeleton-wrapper  {
					--ajaxify-skeleton-loader-background-color: <?php echo esc_html( $options['lazyLoadInlineSkeletonBackgroundColor'] ); ?>;
					--ajaxify-skeleton-loader-highlight-color: <?php echo esc_html( $options['lazyLoadInlineSkeletonHighlightColor'] ); ?>;
					--ajaxify-skeleton-loader-heading-color: <?php echo esc_html( $options['lazyLoadInlineSkeletonHeadingColor'] ); ?>;
					--ajaxify-skeleton-loader-heading-font-size: <?php echo esc_html( $options['lazyLoadInlineSkeletonHeadingFontSize'] ); ?>px;
					--ajaxify-skeleton-loader-heading-line-height: <?php echo esc_html( $options['lazyLoadInlineSkeletonHeadingLineHeight'] ); ?>;
					--ajaxify-skeleton-gradient: linear-gradient(90deg, var(--ajaxify-skeleton-loader-background-color) 25%, var(--ajaxify-skeleton-loader-highlight-color) 50%, var(--ajaxify-skeleton-loader-background-color) 75%);
				}
			</style>
			<div class="ajaxify-comments-loading-skeleton-wrapper">
				<?php
				$can_show_heading = (bool) $options['lazyLoadInlineSkeletonLoadingLabelEnabled'];
				$skeleton_heading = sanitize_text_field( $options['lazyLoadInlineSkeletonLoadingLabel'] );
				if ( $can_show_heading && ! empty( $skeleton_heading ) ) :
					?>
					<h2 class="ajaxify-skeleton-heading"><?php echo esc_html( $skeleton_heading ); ?></h2>
					<?php
				endif;
				// Get how many rows to show.
				$number_of_rows = (int) $options['lazyLoadInlineSkeletonItemsShow'];
				for ( $i = 0; $i < $number_of_rows; $i++ ) :
					?>
					<div class="ajaxify-loading-skeleton">
						<div class="ajaxify-skeleton-comment-header">
							<div class="ajaxify-skeleton-avatar"></div>
							<div class="ajaxify-skeleton-comment-meta"></div>
						</div>
						<div class="ajaxify-skeleton-comment-body"></div>
					</div>
					<?php
				endfor;
				?>
			</div>
		</div>
		<?php
	}

	/**
	 * Output the spinner HTML.
	 */
	public function output_spinner_html() {
		$options = Options::get_options();

		// If lazy loading is not enabled, bail.
		if ( ! Functions::is_lazy_loading_enabled( false, true ) ) {
			return;
		}

		// If inline is not selected or spinner isn't the type, bail.
		if ( 'inline' !== $options['lazyLoadDisplay'] || 'spinner' !== $options['lazyLoadInlineLoadingType'] ) {
			return;
		}

		// Placeholder for styles.
		$styles = '';

		// Remove footer filter if comments section is selected.
		if ( 'comments' === $options['lazyLoadInlineDisplayLocation'] ) {
			remove_action( 'wp_footer', array( $this, 'output_spinner_html' ) );
		} else {
			$styles = ''; // 'visibility: hidden; opacity: 0;';
		}

		// Get spinner arguments.
		$spinner      = $options['lazyLoadInlineSpinner'];
		$spinner_slug = preg_replace_callback(
			'/([A-Z0-9]+)/',
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
		add_filter( 'safe_style_css', array( $this, 'add_safe_css' ) );
		if ( false === $icon_svg ) {
			if ( file_exists( $spinner_dir ) ) {

				$icon_svg = wp_kses(
					file_get_contents( $spinner_dir ),
					Functions::get_kses_allowed_html( true )
				);
				if ( ! empty( $icon_svg ) && ! is_wp_error( $icon_svg ) ) {
					$has_spinner = true;
					wp_cache_set( 'ajaxify_comments_spinner_svg', $icon_svg, 'ajaxify_comments' );
				}
			}
		}

		// Build CSS classes for wrapper.
		$spinner_wrapper_classes = array(
			'ajaxify-comments-spinner__wrapper-frontend',
			'ajaxify-comments-spinner__wrapper',
			'ajaxify-comments-spinner__layout--' . $options['lazyLoadInlineSpinnerLayoutType'],
			'ajaxify-comments-spinner__alignment--' . $options['lazyLoadInlineSpinnerLayoutAlignment'],
		);
		if ( (bool) $options['lazyLoadInlineSpinnerLayoutRTL'] ) {
			$spinner_wrapper_classes[] = 'ajaxify-comments-spinner__rtl';
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
		<div id="wpac-lazy-load-content" class="<?php echo esc_attr( implode( ' ', $spinner_wrapper_classes ) ); ?>" style="<?php echo esc_attr( $styles ); ?>" aria-hidden="true">
			<style>
				:root {
					--ajaxify-comments-spinner-container-background-color: <?php echo esc_html( $options['lazyLoadInlineSpinnerContainerBackgroundColor'] ); ?>;
					--ajaxify-comments-spinner-container-font-size: <?php echo esc_html( $options['lazyLoadInlineSpinnerLabelFontSizeDesktop'] ); ?>px;
					--ajaxify-comments-spinner-icon-color: <?php echo esc_html( $options['lazyLoadInlineSpinnerIconColor'] ); ?>;
					--ajaxify-comments-spinner-icon-size: <?php echo esc_html( $options['lazyLoadInlineSpinnerSizeDesktop'] ); ?>px;
					--ajaxify-comments-spinner-container-line-height: <?php echo esc_html( $options['lazyLoadInlineSpinnerLabelLineHeightDesktop'] ); ?>px;
					--ajaxify-comments-spinner-label-color: <?php echo esc_html( $options['lazyLoadInlineSpinnerLabelColor'] ); ?>;
					--ajaxify-comments-spinner-icon-gap: <?php echo esc_html( $options['lazyLoadInlineSpinnerGapDesktop'] ); ?>px;
					--ajaxify-comments-spinner-icon-animation-speed: <?php echo esc_html( $options['lazyLoadInlineSpinnerSpeed'] ); ?>s;
					--ajaxify-comments-spinner-container-padding:  <?php echo esc_html( $options['lazyLoadInlineSpinnerContainerPaddingDesktop'] ); ?>px;
				}
				@media (max-width: 768px) {
					:root {
						--ajaxify-comments-spinner-container-font-size: <?php echo esc_html( $options['lazyLoadInlineSpinnerLabelFontSizeTablet'] ); ?>px;
						--ajaxify-comments-spinner-icon-size: <?php echo esc_html( $options['lazyLoadInlineSpinnerSizeTablet'] ); ?>px;
						--ajaxify-comments-spinner-container-line-height: <?php echo esc_html( $options['lazyLoadInlineSpinnerLabelLineHeightTablet'] ); ?>px;
						--ajaxify-comments-spinner-icon-gap: <?php echo esc_html( $options['lazyLoadInlineSpinnerGapTablet'] ); ?>px;
						--ajaxify-comments-spinner-container-padding:  <?php echo esc_html( $options['lazyLoadInlineSpinnerContainerPaddingTablet'] ); ?>px;
					}
				}
				@media (max-width: 480px) {
					:root {
						--ajaxify-comments-spinner-container-font-size: <?php echo esc_html( $options['lazyLoadInlineSpinnerLabelFontSizeMobile'] ); ?>px;
						--ajaxify-comments-spinner-icon-size: <?php echo esc_html( $options['lazyLoadInlineSpinnerSizeMobile'] ); ?>px;
						--ajaxify-comments-spinner-container-line-height: <?php echo esc_html( $options['lazyLoadInlineSpinnerLabelLineHeightMobile'] ); ?>px;
						--ajaxify-comments-spinner-icon-gap: <?php echo esc_html( $options['lazyLoadInlineSpinnerGapMobile'] ); ?>px;
						--ajaxify-comments-spinner-container-padding:  <?php echo esc_html( $options['lazyLoadInlineSpinnerContainerPaddingMobile'] ); ?>px;
					}
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
		remove_filter( 'safe_style_css', array( $this, 'add_safe_css' ) );
		echo $html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
