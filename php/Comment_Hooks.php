<?php
/**
 * Per-comment hidden form fields for Ajaxify Comments.
 *
 * @package WPAC
 */

namespace DLXPlugins\WPAC;

if ( ! defined( 'ABSPATH' ) ) {
	die( 'No direct access.' );
}

/**
 * Perform comment hooks for WPAC.
 */
class Comment_Hooks {

	/**
	 * Class runner.
	 */
	public function run() {
		add_filter( 'wp_list_comments_args', array( $this, 'filter_wp_list_comments_args' ) );
		add_filter( 'render_block', array( $this, 'filter_render_block' ), 10, 3 );
	}

	/**
	 * Whether hidden fields should be output in the current request.
	 *
	 * @return bool
	 */
	public static function should_render() {
		if ( is_admin() || is_feed() ) {
			return false;
		}

		return true;
	}

	/**
	 * Render hidden form fields for a comment.
	 *
	 * @param int|\WP_Comment $comment Comment object or ID.
	 * @return string HTML markup, or empty string if comment is invalid.
	 */
	public static function render( $comment ) {
		if ( ! self::should_render() ) {
			return '';
		}

		$comment = get_comment( $comment );
		if ( ! $comment ) {
			return '';
		}

		$post_id    = (int) $comment->comment_post_ID;
		$comment_id = (int) $comment->comment_ID;

		ob_start();
		?>
		<form class="wpac-comment-hidden-fields" hidden aria-hidden="true">
			<input type="hidden" name="ajax_comment_id" value="<?php echo esc_attr( (string) $comment_id ); ?>" />
			<input type="hidden" name="ajax_page_id" value="<?php echo esc_attr( (string) $post_id ); ?>" />
		</form>
		<?php
		$html = ob_get_clean();

		/**
		 * Filter the hidden fields HTML for a comment.
		 *
		 * @param string     $html    Hidden fields markup.
		 * @param \WP_Comment $comment Comment object.
		 */
		return apply_filters( 'dlxplugins/ajaxify/comments/comment_hidden_fields_html', $html, $comment );
	}

	/**
	 * Swap in custom walker when safe to do so.
	 *
	 * @param array $args wp_list_comments() arguments.
	 * @return array
	 */
	public function filter_wp_list_comments_args( $args ) {
		if ( ! self::should_render() ) {
			return $args;
		}

		if ( ! empty( $args['callback'] ) ) {
			return $args;
		}

		if ( ! empty( $args['walker'] ) ) {
			if ( ! $args['walker'] instanceof \Walker_Comment ) {
				return $args;
			}

			$walker_class = get_class( $args['walker'] );
			if (
				'Walker_Comment' !== $walker_class
				&& Walker_Comment_Hidden_Fields::class !== $walker_class
			) {
				return $args;
			}
		}

		$args['walker'] = new Walker_Comment_Hidden_Fields();

		return $args;
	}

	/**
	 * Prepend hidden fields to the first rendered block for each comment in block themes.
	 *
	 * Block themes pass commentId via WP_Block context (see core/comment-template.php),
	 * not block attributes. The third render_block parameter is required.
	 *
	 * @param string        $block_content  Block HTML.
	 * @param array         $block          Parsed block array.
	 * @param \WP_Block|null $block_instance Block instance with context.
	 * @return string
	 */
	public function filter_render_block( $block_content, $block, $block_instance = null ) {
		if ( ! self::should_render() ) {
			return $block_content;
		}

		if ( ! $block_instance instanceof \WP_Block ) {
			return $block_content;
		}

		if ( empty( $block_instance->context['commentId'] ) ) {
			return $block_content;
		}

		$comment_id = (int) $block_instance->context['commentId'];
		if ( ! $comment_id ) {
			return $block_content;
		}

		static $injected_comment_ids = array();
		if ( isset( $injected_comment_ids[ $comment_id ] ) ) {
			return $block_content;
		}

		$hidden_fields = self::render( $comment_id );
		if ( '' === $hidden_fields ) {
			return $block_content;
		}

		$injected_comment_ids[ $comment_id ] = true;

		return $hidden_fields . $block_content;
	}
}
