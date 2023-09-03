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
	 * @return void
	 */
	public static function update_options( $options ) {
		$force           = true;
		$current_options = self::get_options( $force );
		foreach ( $options as $key => &$option ) {
			switch ( $key ) {
				case 'timer':
					$timer = absint( $options[ $key ] );
					if ( 0 === $timer ) {
						$timer = 5;
					}
					$option = $timer;
					break;
				case 'min_comment_length':
				case 'avatar_size':
				case 'max_comment_length':
					$option = absint( $options[ $key ] );
					break;
				case 'require_comment_length':
				case 'require_comment_length_max':
				case 'allow_delete_confirmation':
				case 'allow_delete':
				case 'delete_only':
				case 'show_timer':
				case 'allow_edit_notification':
				case 'show_icons':
				case 'show_stop_timer':
				case 'allow_unlimited_editing':
				case 'allow_front_end_character_limit':
				case 'allow_front_end_editing':
				case 'allow_front_end_moderation_menu':
				case 'enable_avatars':
				case 'enable_avatars_logged_in':
				case 'enable_avatars_anonymous':
				case 'enable_mailchimp':
				case 'akismet_enabled':
				case 'akismet_edit_comments_enabled':
				case 'akismet_api_valid':
				case 'akismet_active':
				case 'akismet_logged_in_users_enabled':
				case 'mentions_emails_enabled':
				case 'mentions_checkbox_enabled':
				case 'enable_gravatar_protection':
				case 'slack_enabled':
				case 'slack_moderation_enabled':
				case 'slack_edit_comments_enabled':
				case 'license_activated':
				case 'turnstile_enabled':
				case 'turnstile_logged_in_users_enabled':
				case 'enable_comment_editing':
				case 'enable_avatar_gravatar_fallback':
				case 'enable_convertkit':
				case 'convertkit_api_valid':
				case 'enable_avatars_anonymous_remember':
				case 'akismet_skip_pingbacks':
				case 'akismet_skip_has_gravatar':
				case 'disable_all_comments':
				case 'disable_all_spam_protection':
				case 'hide_comment_section':
					$option = filter_var( $options[ $key ], FILTER_VALIDATE_BOOLEAN );
					break;
				case 'mentions_enabled':
					$option = filter_var( $options[ $key ], FILTER_VALIDATE_BOOLEAN );
					if ( true === $option ) {
						Table_Mentions::create_table();
					} else {
						Table_Mentions::drop();
					}
					break;
				case 'allow_comment_logging':
					$option = filter_var( $options[ $key ], FILTER_VALIDATE_BOOLEAN );
					if ( true === $option ) {
						Table::create_table();
					} else {
						Table::drop();
					}
					break;
				case 'slack_webhook_url':
					$option = esc_url( $option );
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
			'enable'             => false,
			'debug' => false,
			'menuHelper' => false,
			'selectorCommentForm' => '#commentform',
			'selectorCommentsContainer' => '#comments,.comments-wrapper,.wp-block-comment-template,.ast-comment-list',
			'selectorCommentList' => '.comment-list',
			'selectorCommentPagingLinks' => '#comments [class^=\'nav-\'] a',
			'selectorCommentLinks' => '#comments a[href*="/comment-page-"]',
			'selectorRespondContainer' => '#respond',
			'selectorErrorContainer' => 'p:parent',
			'selectorSubmitButton' => '#submit',
			'selectorTextarea' => '#comment',
			'selectorPostContainer' => '',
			'scrollSpeed' => 500,
			'autoUpdateIdleTime' => 0,
		);
		return $defaults;
	}

}
