<?php // phpcs:ignore
/**
 * Register Ajaxify options.
 *
 * @package WPAC
 */

namespace DLXPlugins\WPAC;

use DLXPlugins\WPAC\Functions as Functions;

if ( ! defined( 'ABSPATH' ) ) {
	die( 'No direct access.' );
}

/**
 * Class that updates and stores the options.
 */
class Options {

	/**
	 * Array holding the options.
	 *
	 * @var [type]
	 */
	protected static $options = false;

	/**
	 * Update options via sanitization
	 *
	 * @since 1.0.0
	 * @access public
	 * @param array $options array of options to save.
	 * @return array $options.
	 */
	public static function update_options( $options ) {
		$force           = true;
		$current_options = self::get_options( $force );
		foreach ( $options as $key => &$option ) {
			switch ( $key ) {
				case 'enable':
				case 'debug':
				case 'menuHelper':
				case 'disableUrlUpdate':
				case 'disableScrollToAnchor':
				case 'useUncompressedScripts':
				case 'placeScriptsInFooter':
				case 'optimizeAjaxResponse':
				case 'disableCache':
				case 'enableByQuery':
					$option = filter_var( $options[ $key ], FILTER_VALIDATE_BOOLEAN );
					break;
				default:
					if ( is_array( $option ) ) {
						$option = Functions::sanitize_array_recursive( $option );
					} else {
						$option = sanitize_text_field( $options[ $key ] );
					}
					break;
			}
		}
		$options = wp_parse_args( $options, $current_options );
		if ( Functions::is_multisite() ) {
			update_site_option( WPAC_OPTION_KEY, $options );
		} else {
			update_option( WPAC_OPTION_KEY, $options );
		}
		self::$options = $options;
		return $options;
	}

	/**
	 * Return a list of options.
	 *
	 * @param bool $force Whether to get options from cache or not.
	 *
	 * @return array Array of options.
	 */
	public static function get_options( $force = false ) {
		if ( is_array( self::$options ) && ! $force ) {
			return self::$options;
		}
		if ( Functions::is_multisite() ) {
			$options = get_site_option( WPAC_OPTION_KEY, array() );
		} else {
			$options = get_option( WPAC_OPTION_KEY, array() );
		}

		// Set firsttimeinstall flag if options are empty.
		if ( empty( $options ) ) {
			$options['firstTimeInstall'] = true;
		} else {
			$options['firstTimeInstall'] = false;
		}

		$defaults      = self::get_defaults();
		$options       = wp_parse_args( $options, $defaults );
		self::$options = $options;
		return $options;
	}

	/**
	 * Get defaults for SCE options
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return array default options
	 */
	public static function get_defaults() {
		$defaults = array(
			'enable'                         => false,
			'debug'                          => false,
			'menuHelper'                     => false,
			'selectorCommentForm'            => '#commentform',
			'selectorCommentsContainer'      => '#comments,.comments-wrapper,.wp-block-comment-template,.ast-comment-list',
			'selectorCommentList'            => '.comment-list',
			'selectorCommentPagingLinks'     => '#comments [class^=\'nav-\'] a',
			'selectorCommentLinks'           => '#comments a[href*="/comment-page-"]',
			'selectorRespondContainer'       => '#respond',
			'selectorErrorContainer'         => 'p:parent',
			'selectorSubmitButton'           => '#submit',
			'selectorTextarea'               => '#comment',
			'selectorPostContainer'          => '',
			'scrollSpeed'                    => 500,
			'autoUpdateIdleTime'             => 0,
			'popupBackgroundColorLoading'    => '#000000',
			'popupTextColorLoading'          => '#ffffff',
			'popupBackgroundColorSuccess'    => '#008000',
			'popupTextColorSuccess'          => '#FFFFFF',
			'popupBackgroundColorError'      => '#FF0000',
			'popupTextColorError'            => '#FFFFFF',
			'popupOpacity'                   => 70,
			'popupCornerRadius'              => 5,
			'popupMarginTop'                 => 10,
			'popupWidth'                     => 30,
			'popupPadding'                   => 5,
			'popupFadeIn'                    => 400,
			'popupFadeOut'                   => 400,
			'popupTimeout'                   => 3000,
			'popupTextAlign'                 => 'center', /* can be left|center|right */
			'popupTextFontSize'              => '14px',
			'popupZindex'                    => 1000,
			'textPosted'                     => __( 'Your comment has been posted. Thank you!', 'wp-ajaxify-comments' ),
			'textPostedUnapproved'           => __( 'Your comment has been posted and is awaiting moderation. Thank you!', 'wp-ajaxify-comments' ),
			'textReloadPage'                 => __( 'Reloading page. Please wait.', 'wp-ajaxify-comments' ),
			'textPostComment'                => __( 'Posting your comment. Please wait.', 'wp-ajaxify-comments' ),
			'textRefreshComments'            => __( 'Loading comments. Please wait.', 'wp-ajaxify-comments' ),
			'textUnknownError'               => __( 'Something went wrong, your comment has not been posted.', 'wp-ajaxify-comments' ),
			'textErrorTypeComment'           => __( 'Please type your comment text.', 'wp-ajaxify-comments' ),
			'textErrorCommentsClosed'        => __( 'Sorry, comments are closed for this item.', 'wp-ajaxify-comments' ),
			'textErrorMustBeLoggedIn'        => __( 'Sorry, you must be logged in to post a comment.', 'wp-ajaxify-comments' ),
			'textErrorFillRequiredFields'    => __( 'Please fill the required fields (name, email).', 'wp-ajaxify-comments' ),
			'textErrorInvalidEmailAddress'   => __( 'Please enter a valid email address.', 'wp-ajaxify-comments' ),
			'textErrorPostTooQuickly'        => __( 'You are posting comments too quickly. Please wait a minute and resubmit your comment.', 'wp-ajaxify-comments' ),
			'textErrorDuplicateComment'      => __( 'Duplicate comment detected. It looks like you have already submitted this comment.', 'wp-ajaxify-comments' ),
			'callbackOnBeforeSelectElements' => '',
			'callbackOnBeforeSubmitComment'  => '',
			'callbackOnAfterPostComment'     => '',
			'callbackOnBeforeUpdateComments' => '',
			'callbackOnAfterUpdateComments'  => '',
			'commentPagesUrlRegex'           => '',
			'asyncCommentsThreshold'         => '',
			'asyncLoadTrigger'               => 'DomReady', /* can be DomReady, none, Viewport */
			'disableUrlUpdate'               => false,
			'disableScrollToAnchor'          => false,
			'useUncompressedScripts'         => false,
			'placeScriptsInFooter'           => true,
			'optimizeAjaxResponse'           => false,
			'baseUrl'                        => '',
			'disableCache'                   => false,
			'enableByQuery'                  => false,

		);
		return $defaults;
	}

}
