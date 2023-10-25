<?php // phpcs:ignore
/**
 * Register Ajaxify options.
 *
 * @package WPAC
 */

namespace DLXPlugins\WPAC;

use DLXPlugins\WPAC\Functions;

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
	 * @param bool  $merge_options Whether to merge options with old options or not.
	 * @return array $options.
	 */
	public static function update_options( $options, $merge_options = true ) {
		$force           = true;
		$current_options = $merge_options ? self::get_options( $force, true ) : array();
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
				case 'lazyLoadEnabled':
				case 'lazyLoadPaginationEnabled':
				case 'lazyLoadUseThemePagination':
				case 'lazyLoadingPaginationScrollToTop':
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
	public static function get_options( $force = false, $skip_migrate = false ) {
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

		$defaults = self::get_defaults();
		$options  = wp_parse_args( $options, $defaults );
		// Port over lazy loading options.
		if ( isset( $options['asyncCommentsThreshold'] ) && ! $skip_migrate ) {
			// Get lazy loading/async threshold. Async threshold is misleading here. If it's `0`, it means lazy loading is enabled. Otherwise, any other value, it's disabled.
			$async_threshold = $options['asyncCommentsThreshold'];

			// Get the async trigger.
			$async_trigger = $options['asyncLoadTrigger']; /* can be DomReady, none, Viewport */

			// $async_threshold can be a string or a `0` value.
			// If it's not an empty string, we need to convert to int.
			// While taking account that `0` is a positive option, whereas empty string is not.
			if ( strlen( $async_threshold ) > 0 ) {
				$async_threshold = absint( $async_threshold );
			} else {
				$async_threshold = null;
			}

			// If not `0`, lazy loading is not enabled.
			if ( 0 !== $async_threshold || 'none' === $async_trigger ) {
				$options['lazyLoadEnabled'] = false;
			}

			// Set the new lazy loading trigger.
			$options['lazyLoadTrigger'] = strtolower( $async_trigger );

			// Set lazy loading flag.
			if ( 0 === $async_threshold && 'none' !== $async_trigger ) {
				$options['lazyLoadEnabled'] = true;
			}

			// Unset old vars.
			unset( $options['asyncCommentsThreshold'] );
			unset( $options['asyncLoadTrigger'] );

			// Update options.
			self::update_options( $options, false );
		}
		self::$options = $options;

		// Get WPML to translate the options. This only seems to work on the frontend.
		$label_keys_to_translate = self::get_string_label_keys();
		foreach ( $label_keys_to_translate as $label_key ) {
			$label_value = $options[ $label_key ];

			$translated_string = apply_filters(
				'wpml_translate_string',
				$label_value,
				$label_key,
				array(
					'kind'  => 'Ajaxify',
					'name'  => 'ajaxify-comments-labels',
					'title' => 'Ajaxify Comment Labels',
				)
			);

			$options[ $label_key ] = $translated_string;

		}

		/**
		 * Filter the options before they are returned.
		 * Technically you can do this with a get_option filter, but this parses in any new defaults and translations.
		 *
		 * @param array  $options The options to be output.
		 */
		$options       = apply_filters(
			'dlxplugins/ajaxify/comments/options/parsed',
			$options,
		);
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
			'selectorCommentForm'            => '#commentform,.ast-commentform,.comment-form',
			'selectorCommentsContainer'      => '#comments,.comments-wrapper,.comments-area,.wp-block-comments',
			'selectorCommentList'            => '.comment-list,.ast-comment-list,.wp-block-comment-template',
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
			'disableUrlUpdate'               => false,
			'disableScrollToAnchor'          => false,
			'useUncompressedScripts'         => false,
			'placeScriptsInFooter'           => true,
			'optimizeAjaxResponse'           => false,
			'baseUrl'                        => '',
			'disableCache'                   => false,
			'enableByQuery'                  => false,
			'lazyLoadEnabled'                => false,
			'lazyLoadDisplay'                => 'overlay', /* can be overlay, inline, none */
			'lazyLoadTrigger'                => 'domready', /* can be external, comments, domready, scroll, element */
			'lazyLoadTriggerElement'         => '',
			'lazyLoadInlineDisplayElement'   => '#comments',
		);
		return $defaults;
	}

	/**
	 * Get a list of the string label keys.
	 *
	 * @return array Array of string label keys.
	 */
	public static function get_string_label_keys() {
		return array(
			'textPosted',
			'textPostedUnapproved',
			'textReloadPage',
			'textPostComment',
			'textRefreshComments',
			'textUnknownError',
			'textErrorTypeComment',
			'textErrorCommentsClosed',
			'textErrorMustBeLoggedIn',
			'textErrorFillRequiredFields',
			'textErrorInvalidEmailAddress',
			'textErrorPostTooQuickly',
			'textErrorDuplicateComment',
		);
	}
}
