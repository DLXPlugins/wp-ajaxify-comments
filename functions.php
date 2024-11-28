<?php

/**
 * Global Functions and Variables.
 *
 * @package wpac
 */

/**
 * Exit and prevent direct access.
 */
if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct acces not allowed!' );
}

use DLXPlugins\WPAC\Functions;
use DLXPlugins\WPAC\Options;

function wpac_get_secret() {
	return substr( md5( NONCE_SALT . AUTH_KEY . LOGGED_IN_KEY . NONCE_KEY . AUTH_SALT . SECURE_AUTH_SALT . LOGGED_IN_SALT . NONCE_SALT ), 0, 10 );
}

function wpac_return_optimized_ajax_response() {
	return ( wpac_get_option( 'optimizeAjaxResponse' ) && wpac_is_ajax_request() );
}

function wpac_inject_scripts() {
	if ( wpac_is_ajax_request() ) {
		return false;
	}
	if ( wpac_get_option( 'alwaysIncludeScripts' ) ) {
		return true;
	}
	if ( wpac_get_option( 'debug' ) ) {
		return true;
	}
	if ( wpac_comments_enabled() ) {
		return true;
	}
	if ( is_page() || is_single() ) {
		global $post;
		if ( get_comments_number( $post->ID ) > 0 ) {
			return true;
		}
		if ( wpac_load_comments_async() ) {
			return true;
		}
	}
	return false;
}

function wpac_enqueue_scripts() {

	// Skip if scripts should not be injected
	if ( ! wpac_inject_scripts() ) {
		return;
	}

	$version                 = Functions::get_plugin_version();
	$options                 = Options::get_options();
	$in_footer               = (bool) $options['placeScriptsInFooter'] || (bool) $options['debug'] || ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG );
	$is_debug                = (bool) $options['debug'];
	$force_scripts           = false;
	$is_lazy_loading_enabled = Functions::is_lazy_loading_enabled( true, false );
	$is_comments_enabled     = wpac_comments_enabled();

	// Determine if comments are present on the page.
	$has_comments = false;
	if ( is_page() || is_single() || is_a( get_queried_object(), 'WP_POST' ) ) {
		global $post;
		$has_comments = get_comments_number( $post->ID ) > 0;
	}

	/**
	 * Filter: Load scripts on all pages.
	 *
	 * @param bool Whether to force scripts on all pages.
	 *
	 * @since 2.1.1
	 */
	$force_scripts = apply_filters( 'dlxplugins/ajaxify/scripts/load', $force_scripts );

	if ( ( $is_debug || $is_comments_enabled || $force_scripts || ( $is_lazy_loading_enabled && $has_comments ) ) && (bool) $options['useUncompressedScripts'] ) {
		wp_enqueue_script(
			'jsuri',
			Functions::get_plugin_url( 'dist/wpac-frontend-jsuri.js' ),
			array(),
			$version,
			$in_footer
		);
		wp_enqueue_script(
			'jQueryBlockUi',
			Functions::get_plugin_url( 'dist/wpac-frontend-jquery-blockUI.js' ),
			array( 'jquery' ),
			$version,
			$in_footer
		);
		wp_enqueue_script(
			'jQueryIdleTimer',
			Functions::get_plugin_url( 'dist/wpac-frontend-idle-timer.js' ),
			array( 'jquery' ),
			$version,
			$in_footer
		);
		wp_enqueue_script(
			'waypoints',
			Functions::get_plugin_url( 'dist/wpac-frontend-jquery-waypoints.js' ),
			array( 'jquery' ),
			$version,
			$in_footer
		);
		wp_enqueue_script(
			'wpAjaxifyComments',
			Functions::get_plugin_url( 'dist/wpac-frontend-wp-ajaxify-comments.js' ),
			array(
				'jquery',
				'jQueryBlockUi',
				'jsuri',
				'jQueryIdleTimer',
				'waypoints',
			),
			$version,
			$in_footer
		);
	} elseif ( $is_debug || $is_comments_enabled || $force_scripts || ( $is_lazy_loading_enabled && $has_comments ) ) {
		$deps = require Functions::get_plugin_dir( 'dist/wpac-frontend-js.asset.php' );
		wp_enqueue_script(
			'wpAjaxifyComments',
			Functions::get_plugin_url( 'dist/wpac-frontend-js.js' ),
			$deps['dependencies'],
			$deps['version'],
			$in_footer
		);
	}

	// Add callbacks as local.
	wp_localize_script(
		'wpAjaxifyComments',
		'WPACCallbacks',
		array(
			'beforeSelectElements' => wpac_get_option( 'callbackOnBeforeSelectElements' ),
			'beforeUpdateComments' => wpac_get_option( 'callbackOnBeforeUpdateComments' ),
			'afterUpdateComments'  => wpac_get_option( 'callbackOnAfterUpdateComments' ),
			'beforeSubmitComment'  => wpac_get_option( 'callbackOnBeforeSubmitComment' ),
			'afterPostComment'     => wpac_get_option( 'callbackOnAfterPostComment' ),
		)
	);
	if ( $is_debug || $is_comments_enabled || $force_scripts || ( $is_lazy_loading_enabled && $has_comments ) ) {
		/**
		 * Add frontend CSS.
		 */
		wp_enqueue_style(
			'wpac-frontend',
			Functions::get_plugin_url( 'dist/wpac-frontend-css.css' ),
			array(),
			Functions::get_plugin_version(),
			'all'
		);
	}

	// Load lazy loading styles.
	if ( $is_lazy_loading_enabled && ( $has_comments || $is_comments_enabled ) ) {
		wp_enqueue_style(
			'wpac-admin-lazy-load',
			Functions::get_plugin_url( 'dist/wpac-lazy-load-css.css' ),
			array(),
			Functions::get_plugin_version(),
			'all'
		);
	}

	/**
	 * Sunshine Confetti Plugin integration.
	 *
	 * @since 3.0.0
	 *
	 * @see https://wordpress.org/plugins/confetti/
	 */
	if ( class_exists( 'WPSunshine_Confetti' ) ) {
		$wp_sunshine = \WPSunshine_Confetti::instance();
		$wp_sunshine->enqueue_scripts( false );
	}

	add_action( 'wp_print_styles', 'wpac_print_styles' );

	/**
	 * Do action after scripts are enqueued.
	 */
	do_action( 'dlxplugins/ajaxify/comments/enqueue_scripts', $version, $in_footer );
}

/**
 * Print inline styles for the frontend.
 */
function wpac_print_styles() {
	?>
	<style>
		:root {
			--wpac-popup-opacity: <?php echo esc_html( round( wpac_get_option( 'popupOpacity' ) / 100, 2 ) ); ?>;
			--wpac-popup-corner-radius: <?php echo esc_html( wpac_get_option( 'popupCornerRadius' ) ); ?>px;
			--wpac-popup-margin-top: <?php echo esc_html( wpac_get_option( 'popupMarginTop' ) ); ?>px;
			--wpac-popup-width: <?php echo esc_html( wpac_get_option( 'popupWidth' ) ); ?>%;
			--wpac-popup-padding: <?php echo esc_html( wpac_get_option( 'popupPadding' ) ); ?>px;
			--wpac-popup-font-size: <?php echo esc_html( wpac_get_option( 'popupTextFontSize' ) ); ?>;
			--wpac-popup-line-height: 1.2;
		}
		/* tablet styles */
		@media screen and (max-width: 1024px) {
			.wpac-overlay {
				--wpac-popup-opacity: <?php echo esc_html( round( wpac_get_option( 'popupOpacityTablet' ) / 100, 2 ) ); ?>;
				--wpac-popup-corner-radius: <?php echo esc_html( wpac_get_option( 'popupCornerRadiusTablet' ) ); ?>px;
				--wpac-popup-margin-top: <?php echo esc_html( wpac_get_option( 'popupMarginTopTablet' ) ); ?>px;
				--wpac-popup-width: <?php echo esc_html( wpac_get_option( 'popupWidthTablet' ) ); ?>%;
				--wpac-popup-padding: <?php echo esc_html( wpac_get_option( 'popupPaddingTablet' ) ); ?>px;
				--wpac-popup-font-size: <?php echo esc_html( wpac_get_option( 'popupTextFontSizeTablet' ) ); ?>;
			}
		}
		/* mobile styles */
		@media screen and (max-width: 768px) {
			.wpac-overlay {
				--wpac-popup-opacity: <?php echo esc_html( round( wpac_get_option( 'popupOpacityMobile' ) / 100, 2 ) ); ?>;
				--wpac-popup-corner-radius: <?php echo esc_html( wpac_get_option( 'popupCornerRadiusMobile' ) ); ?>px;
				--wpac-popup-margin-top: <?php echo esc_html( wpac_get_option( 'popupMarginTopMobile' ) ); ?>px;
				--wpac-popup-width: <?php echo esc_html( wpac_get_option( 'popupWidthMobile' ) ); ?>%;
				--wpac-popup-padding: <?php echo esc_html( wpac_get_option( 'popupPaddingMobile' ) ); ?>px;
				--wpac-popup-font-size: <?php echo esc_html( wpac_get_option( 'popupTextFontSizeMobile' ) ); ?>;
			}
		}
		.wpac-overlay {
			display: none;
			opacity: var(--wpac-popup-opacity);
			border-radius: var(--wpac-popup-corner-radius);
			margin-top: var(--wpac-popup-margin-top);
			padding: var(--wpac-popup-padding) !important;
			font-size: var(--wpac-popup-font-size) !important;
			line-height: var(--wpac-popup-line-height);
			margin: 0 auto;
		}
	</style>
	<?php
}

function wpac_get_version() {
	return Functions::get_plugin_version();
}

function wpac_plugins_loaded() {
	// do nothing for now.
}
add_action( 'plugins_loaded', 'wpac_plugins_loaded' );

function wpac_js_escape( $s ) {
	return str_replace( '"', '\\"', $s );
}

$wpac_options = null;
function wpac_load_options() {

	global $wpac_options;

	$wpac_options = Options::get_options();
	return $wpac_options;
}

function wpac_get_option( $option ) {
	global $wpac_options;
	wpac_load_options();
	return ( isset( $wpac_options[ $option ] ) ) ? $wpac_options[ $option ] : null;
}

function wpac_update_option( $option, $value ) {
	global $wpac_options;
	wpac_load_options();
	$wpac_options[ $option ] = $value;
}

function wpac_delete_option( $option ) {
	global $wpac_options;
	wpac_load_options();
	unset( $wpac_options[ $option ] );
}

function wpac_save_options() {
	global $wpac_options;
	wpac_load_options();
	update_option( WPAC_OPTION_KEY, $wpac_options );
}

function wpac_get_page_url() {
	// Test if base url is defined
	$baseUrl = wpac_get_option( 'baseUrl' );
	if ( $baseUrl ) {
		return rtrim( $baseUrl, '/' ) . '/' . ltrim( $_SERVER['REQUEST_URI'], '/' );
	}

	// Create page url from $_SERVER variables
	$ssl      = ( ! empty( $_SERVER['HTTPS'] ) && $_SERVER['HTTPS'] == 'on' ) ? true : false;
	$sp       = strtolower( $_SERVER['SERVER_PROTOCOL'] );
	$protocol = substr( $sp, 0, strpos( $sp, '/' ) ) . ( ( $ssl ) ? 's' : '' );
	$port     = $_SERVER['SERVER_PORT'];
	$port     = ( ( ! $ssl && $port == '80' ) || ( $ssl && $port == '443' ) ) ? '' : ':' . $port;
	$host     = isset( $_SERVER['HTTP_X_FORWARDED_HOST'] ) ? $_SERVER['HTTP_X_FORWARDED_HOST'] : ( isset( $_SERVER['HTTP_HOST'] ) ? $_SERVER['HTTP_HOST'] : $_SERVER['SERVER_NAME'] );
	return $protocol . '://' . $host . $port . $_SERVER['REQUEST_URI'];
}

function wpac_comments_enabled() {
	$commentPagesUrlRegex = wpac_get_option( 'commentPagesUrlRegex' );
	if ( $commentPagesUrlRegex ) {
		return preg_match( $commentPagesUrlRegex, wpac_get_page_url() ) > 0;
	} else {
		global $post;
		return ( is_page() || ( is_singular() || is_single() ) ) && comments_open( $post->ID ) && ( ! get_option( 'comment_registration' ) || is_user_logged_in() );
	}
}

function wpac_load_comments_async() {
	if ( Functions::is_lazy_loading_enabled( true, false ) ) {
		return true;
	}
	return false;
}

/**
 * If lazy loading is enabled on the frontend, output comments placeholder for Genesis themes.
 */
function wpac_genesis_before_comments() {
	if ( Functions::is_lazy_loading_enabled( true, false ) ) {
		echo '<div id="comments" class="comments-area"></div>';
	}
}

function wpac_theme_has_html5_support() {
	$html5Support = get_theme_support( 'html5' );
	return $html5Support && in_array( 'script', $html5Support[0] );
}

function wpac_initialize() {

	// Skip if scripts should not be injected
	if ( ! wpac_inject_scripts() ) {
		return;
	}

	echo '<script' . ( wpac_theme_has_html5_support() ? '' : ' type="text/javascript"' ) . '>';

	echo 'var WPAC={}; window.WPAC = WPAC; WPAC = WPAC;';

	// Options
	echo 'WPAC._Options={';
	$options                        = Options::get_options();
	$options['lazyLoadEnabled']     = Functions::is_lazy_loading_enabled( false, false );
	$options['lazyLoadIntoElement'] = false;

	// Determine where to load the lazy loading message (if not overlay).
	if ( Functions::is_lazy_loading_enabled( true, false ) ) {
		$is_lazy_load_inline = 'inline' === $options['lazyLoadDisplay'];
		if ( $is_lazy_load_inline ) {
			$options['lazyLoadIntoElement'] = $options['lazyLoadInlineDisplayElement'];
		}
	}

	/**
	 * Filter the options before they are output.
	 * This is useful for adding custom options or modifying labels.
	 *
	 * @param array  $options The options to be output.
	 * @param int    $post_id The post ID.
	 * @param string $post_type The post type.
	 */
	$options = apply_filters(
		'dlxplugins/ajaxify/comments/options/pre_output',
		$options,
		get_the_ID(),
		get_post_type( get_the_ID() )
	);

	foreach ( $options as $option_key => $option_value ) {

		switch ( $option_value ) {
			case '0':
			case '1':
			case is_bool( $option_value ):
				$option_value = (bool) $option_value;
				if ( $option_value ) {
					$option_value = 'true';
				} else {
					$option_value = 'false';
				}
				break;
			case is_int( $option_value ):
				$option_value = (int) $option_value;
				break;
			case is_numeric( $option_value ):
				$option_value = (float) $option_value;
				break;
			default:
				$option_value = '"' . wpac_js_escape( $option_value ) . '"';
		}
		echo $option_key . ':' . $option_value . ',';
	}
	echo 'commentsEnabled:' . ( wpac_comments_enabled() ? 'true' : 'false' ) . ',';
	echo 'version:"' . esc_js( wpac_get_version() ) . '"};';

	echo '</script>';
}

function wpac_is_login_page() {
	return isset( $GLOBALS['pagenow'] ) && in_array( $GLOBALS['pagenow'], array( 'wp-login.php', 'wp-register.php' ) );
}

function wpac_init() {
	if ( isset( $_GET['WPACUnapproved'] ) ) {
		header( 'X-WPAC-UNAPPROVED: ' . $_GET['WPACUnapproved'] );
	}
	if ( isset( $_GET['WPACUrl'] ) ) {
		header( 'X-WPAC-URL: ' . $_GET['WPACUrl'] );
	}
	$dir = dirname( plugin_basename( __FILE__ ) ) . DIRECTORY_SEPARATOR . 'languages' . DIRECTORY_SEPARATOR;
	load_plugin_textdomain( 'wp-ajaxify-comments', false, $dir );
}
add_action( 'init', 'wpac_init' );

function wpac_unparse_url( $urlParts ) {
	$scheme   = isset( $urlParts['scheme'] ) ? $urlParts['scheme'] . '://' : '';
	$host     = isset( $urlParts['host'] ) ? $urlParts['host'] : '';
	$port     = isset( $urlParts['port'] ) ? ':' . $urlParts['port'] : '';
	$user     = isset( $urlParts['user'] ) ? $urlParts['user'] : '';
	$pass     = isset( $urlParts['pass'] ) ? ':' . $urlParts['pass'] : '';
	$pass     = ( $user || $pass ) ? "$pass@" : '';
	$path     = isset( $urlParts['path'] ) ? $urlParts['path'] : '';
	$query    = isset( $urlParts['query'] ) ? '?' . $urlParts['query'] : '';
	$fragment = isset( $urlParts['fragment'] ) ? '#' . $urlParts['fragment'] : '';
	return "$scheme$user$pass$host$port$path$query$fragment";
}

function wpac_comment_post_redirect( $location ) {
	global $comment;

	// If base url is defined, replace WordPress site url by base url
	$url     = $location;
	$baseUrl = wpac_get_option( 'baseUrl' );
	if ( $baseUrl ) {
		$siteUrl = rtrim( get_site_url(), '/' );
		if ( strpos( strtolower( $url ), strtolower( $siteUrl ) ) === 0 ) {
			$url = preg_replace( '/' . preg_quote( $siteUrl, '/' ) . '/', rtrim( $baseUrl, '/' ), $url, 1 );
		}
	}

	// Add "disable cache" query parameter
	if ( wpac_get_option( 'disableCache' ) ) {
		$urlParts          = parse_url( $url );
		$queryParam        = 'WPACRandom=' . time();
		$urlParts['query'] = isset( $urlParts['query'] ) ? $urlParts['query'] . '&' . $queryParam : $queryParam;
		$url               = wpac_unparse_url( $urlParts );
	}

	// Add query parameter (WPACUnapproved and WPACUrl)
	$urlParts          = parse_url( $url );
	$queryParam        = 'WPACUnapproved=' . ( ( $comment && $comment->comment_approved == '0' ) ? '1' : '0' ) . '&WPACUrl=' . urlencode( $url );
	$urlParts['query'] = isset( $urlParts['query'] ) ? $urlParts['query'] . '&' . $queryParam : $queryParam;
	$url               = wpac_unparse_url( $urlParts );

	return $url;
}
add_action( 'comment_post_redirect', 'wpac_comment_post_redirect' );

function wpac_allowed_redirect_hosts( $content ) {
	$baseUrl = wpac_get_option( 'baseUrl' );
	if ( $baseUrl ) {
		$baseUrlHost = parse_url( $baseUrl, PHP_URL_HOST );
		if ( $baseUrlHost !== false ) {
			$content[] = $baseUrlHost;
		}
	}
	return $content;
}
add_filter( 'allowed_redirect_hosts', 'wpac_allowed_redirect_hosts' );

function wpac_the_content( $content ) {
	return wpac_return_optimized_ajax_response() ? '' : $content;
}
add_filter( 'the_content', 'wpac_the_content', PHP_INT_MAX );

function wpac_is_ajax_request() {
	return isset( $_SERVER['HTTP_X_WPAC_REQUEST'] ) && $_SERVER['HTTP_X_WPAC_REQUEST'];
}

function wpac_comments_template_query_args_filter( $comments ) {
	if ( is_admin() && ! wpac_is_ajax_request() ) {
		return $comments;
	}

	// No comment filtering if request is a fallback or WPAC-AJAX request
	if ( ( isset( $_REQUEST['WPACFallback'] ) && $_REQUEST['WPACFallback'] ) ) {
		return $comments;
	}

	// If X-WPAC-REQUEST header is set, return all comments
	if ( wpac_is_ajax_request() ) {
		remove_filter( 'the_comments', 'wpac_comments_template_query_args_filter' );
		return $comments;
	}

	//return $comments;

	// Check to see if we can async (lazy load) comments, and if so, return empty
	// comment array to prevent comments from being loaded on initial page load.
	if ( ! wpac_is_ajax_request() ) {
		if ( Functions::is_lazy_loading_enabled( false, false ) ) {
			return array();
		}
	} elseif ( wpac_is_ajax_request() && Functions::is_lazy_loading_enabled( true, false ) ) {
		return array();
	}

	// Nothing to change.
	return $comments;
}

function wpac_filter_gettext( $translation, $text, $domain ) {
	if ( $domain != 'default' ) {
		return $translation;
	}

	$customWordpressTexts = array(
		strtolower( WPAC_WP_ERROR_PLEASE_TYPE_COMMENT )   => 'textErrorTypeComment',
		strtolower( WPAC_WP_ERROR_COMMENTS_CLOSED )       => 'textErrorCommentsClosed',
		strtolower( WPAC_WP_ERROR_MUST_BE_LOGGED_IN )     => 'textErrorMustBeLoggedIn',
		strtolower( WPAC_WP_ERROR_FILL_REQUIRED_FIELDS )  => 'textErrorFillRequiredFields',
		strtolower( WPAC_WP_ERROR_INVALID_EMAIL_ADDRESS ) => 'textErrorInvalidEmailAddress',
		strtolower( WPAC_WP_ERROR_POST_TOO_QUICKLY )      => 'textErrorPostTooQuickly',
		strtolower( WPAC_WP_ERROR_DUPLICATE_COMMENT )     => 'textErrorDuplicateComment',
	);

	global $wpac_global_comment_post_id;
	$post_type = get_post_type( $wpac_global_comment_post_id );

	$options = apply_filters(
		'dlxplugins/ajaxify/comments/options/pre_output',
		Options::get_options(),
		$wpac_global_comment_post_id,
		$post_type
	);

	$lowerText = strtolower( $text );
	if ( array_key_exists( $lowerText, $customWordpressTexts ) ) {
		$customText = $options[ $customWordpressTexts[ $lowerText ] ];
		if ( $customText ) {
			return $customText;
		}
	}
	return $translation;
}

function wpac_default_wp_die_handler( $message, $title = '', $args = array() ) {
	// Set X-WPAC-ERROR if script "dies" when posting comment
	if ( wpac_is_ajax_request() ) {
		header( 'X-WPAC-ERROR: 1' );
	}
	return _default_wp_die_handler( $message, $title, $args );
}

function wpac_wp_die_handler( $handler ) {
	if ( $handler != '_default_wp_die_handler' ) {
		return $handler;
	}
	return 'wpac_default_wp_die_handler';
}

function wpac_option_page_comments( $page_comments ) {
	return ( wpac_is_ajax_request() && isset( $_REQUEST['WPACAll'] ) && $_REQUEST['WPACAll'] ) ?
		false : $page_comments;
}

function wpac_option_comments_per_page( $comments_per_page ) {
	return ( wpac_is_ajax_request() && isset( $_REQUEST['WPACAll'] ) && $_REQUEST['WPACAll'] ) ?
		0 : $comments_per_page;
}
