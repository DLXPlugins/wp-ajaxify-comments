<?php
/**
 * Walker that prepends hidden form fields to each comment.
 *
 * @package WPAC
 */

namespace DLXPlugins\WPAC;

if ( ! defined( 'ABSPATH' ) ) {
	die( 'No direct access.' );
}

/**
 * Walker_Comment_Hidden_Fields for WPAC.
 */
class Walker_Comment_Hidden_Fields extends \Walker_Comment {

	/**
	 * HTML5 comment output with hidden fields prepended.
	 *
	 * @param \WP_Comment $comment Comment object.
	 * @param int         $depth   Depth of the current comment.
	 * @param array       $args    Arguments passed to wp_list_comments().
	 */
	protected function html5_comment( $comment, $depth, $args ) {
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped in Comment_Hidden_Fields::render().
		echo wp_kses( Comment_Hidden_Fields::render( $comment ), Functions::get_kses_allowed_html() );
		parent::html5_comment( $comment, $depth, $args );
	}

	/**
	 * Legacy comment output with hidden fields prepended.
	 *
	 * @param \WP_Comment $comment Comment object.
	 * @param int         $depth   Depth of the current comment.
	 * @param array       $args    Arguments passed to wp_list_comments().
	 */
	protected function comment( $comment, $depth, $args ) {
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped in Comment_Hidden_Fields::render().
		echo wp_kses( Comment_Hooks::render( $comment ), Functions::get_kses_allowed_html() );
		parent::comment( $comment, $depth, $args );
	}
}
