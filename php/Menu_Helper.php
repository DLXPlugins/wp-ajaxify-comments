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
 * Menu_Helper for WPAC.
 */
class Menu_Helper {




	/**
	 * Class runner.
	 */
	public function run() {
		// Determine if menu helper is enabled.
		$options             = Options::get_options();
		$menu_helper_enabled = (bool) $options['menuHelper'];
		if ( ! $menu_helper_enabled ) {
			return;
		}

		// Add ajax action for checking if comments are open and there are comments.
		add_action( 'wp_ajax_wpac_check_comment_status', array( $this, 'ajax_check_comment_status' ) );

		// Add ajax action for saving the selectors.
		add_action( 'wp_ajax_wpac_save_selectors', array( $this, 'ajax_save_selectors' ) );

		// Add Ajax action for opening comments.
		add_action( 'wp_ajax_wpac_shortcut_open_comments', array( $this, 'ajax_open_comments' ) );

		// Add Ajax action for closing comments.
		add_action( 'wp_ajax_wpac_shortcut_close_comments', array( $this, 'ajax_close_comments' ) );

		// Bail if not on frontend.
		if ( is_admin() ) {
			return;
		}

		add_action( 'admin_bar_menu', array( $this, 'admin_bar_menu' ), 99 );

		// Add callback when Ajaxify scripts should be loaded.
		add_action( 'dlxplugins/ajaxify/comments/wp', array( $this, 'before_ajaxify_load' ) );
	}

	/**
	 * Open comments for a post ID.
	 */
	public function ajax_open_comments() {
		// Check nonce.
		$nonce   = sanitize_text_field( filter_input( INPUT_POST, 'nonce', FILTER_DEFAULT ) );
		$post_id = absint( filter_input( INPUT_POST, 'post_id', FILTER_VALIDATE_INT ) );
		if ( ! wp_verify_nonce( $nonce, 'wpac_shortcut_open_comments_' . $post_id ) || ! $post_id || ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error(
				array(
					'title'   => __( 'Error', 'wp-ajaxify-comments' ),
					'message' => __( 'Could not verify nonce or permissions.', 'wp-ajaxify-comments' ),
				)
			);
		}

		// Open comments for the post.
		$post = get_post( $post_id );
		if ( ! $post ) {
			wp_send_json_error(
				array(
					'title'   => __( 'Error', 'wp-ajaxify-comments' ),
					'message' => __( 'Could not find a post to open comments for.', 'wp-ajaxify-comments' ),
				)
			);
		}
		$post->comment_status = 'open';
		wp_update_post( $post );

		wp_send_json_success(
			array(
				'title'   => __( 'Success!', 'wp-ajaxify-comments' ),
				'message' => __( 'Comments have been opened. Refreshing post...', 'wp-ajaxify-comments' ),
			)
		);
		exit;
	}

	/**
	 * Close comments for a post ID.
	 */
	public function ajax_close_comments() {
		// Check nonce.
		$nonce   = sanitize_text_field( filter_input( INPUT_POST, 'nonce', FILTER_DEFAULT ) );
		$post_id = absint( filter_input( INPUT_POST, 'post_id', FILTER_VALIDATE_INT ) );
		if ( ! wp_verify_nonce( $nonce, 'wpac_shortcut_close_comments_' . $post_id ) || ! $post_id || ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error(
				array(
					'title'   => __( 'Error', 'wp-ajaxify-comments' ),
					'message' => __( 'Could not verify nonce or permissions.', 'wp-ajaxify-comments' ),
				)
			);
		}

		// Open comments for the post.
		$post = get_post( $post_id );
		if ( ! $post ) {
			wp_send_json_error(
				array(
					'title'   => __( 'Error', 'wp-ajaxify-comments' ),
					'message' => __( 'Could not find a post to close comments for.', 'wp-ajaxify-comments' ),
				)
			);
		}
		$post->comment_status = 'closed';
		wp_update_post( $post );

		wp_send_json_success(
			array(
				'title'   => __( 'Success!', 'wp-ajaxify-comments' ),
				'message' => __( 'Comments have been closed. Refreshing post...', 'wp-ajaxify-comments' ),
			)
		);
		exit;
	}

	/**
	 * Run before Ajaxify loads.
	 */
	public function before_ajaxify_load() {
		if ( ( ! is_singular() && ! is_page() ) || is_admin() ) {
			return;
		}

		// Check for admin permissions.
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		// Get options.
		$options             = Options::get_options();
		$menu_helper_enabled = (bool) $options['menuHelper'];

		// Enqueue menu helper.
		if ( $menu_helper_enabled ) {
			add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_menu_helper_scripts_styles' ) );
		}

		// Let's check if we should load scripts.
		$ajaxify_enabled = (bool) filter_input( INPUT_GET, 'ajaxifyEnable', FILTER_VALIDATE_BOOLEAN );

		// Validate nonce.
		$nonce = sanitize_text_field( filter_input( INPUT_GET, 'nonce', FILTER_DEFAULT ) );
		if ( $ajaxify_enabled ) {
			if ( ! wp_verify_nonce( $nonce, 'wpac_enable_ajaxify_' . get_the_ID() ) ) {
				return;
			}
		} elseif ( wp_verify_nonce( $nonce, 'wpac_disable_ajaxify_' . get_the_ID() ) ) {
				add_filter( 'dlxplugins/ajaxify/comments/force_load', '__return_false', 100 );
				add_filter( 'dlxplugins/ajaxify/comments/can_load', '__return_false', 100 );

				// Add back to post admin bar menu item.
				add_action( 'admin_bar_menu', array( $this, 'admin_bar_menu_back_to_post' ), 100 );
				return;
		} else {
			return;
		}

		// We've made it this far, let's set the filter for force loading.
		add_filter( 'dlxplugins/ajaxify/comments/force_load', '__return_true', 100 ); // Priority of 100, to prevent overrides.overridden.

		// Attempt to override any other plugins that may be trying to disable Ajaxify.
		add_filter( 'dlxplugins/ajaxify/comments/can_load', '__return_true', 100 ); // Priority of 100, to prevent overrides.

		// Add preview menu types.
		add_action( 'admin_bar_menu', array( $this, 'admin_bar_menu_preview_overlay' ), 100 );

		// Add back to post admin bar menu item.
		add_action( 'admin_bar_menu', array( $this, 'admin_bar_menu_back_to_post' ), 100 );
	}

	/**
	 * Ajax callback for checking if comments are open and there are comments.
	 */
	public function ajax_check_comment_status() {
		// Get nonce.
		$nonce = sanitize_text_field( filter_input( INPUT_POST, 'nonce', FILTER_DEFAULT ) );

		// Get the post ID.
		$post_id = filter_input( INPUT_POST, 'postId', FILTER_VALIDATE_INT );

		// Security.
		if ( ! wp_verify_nonce( $nonce, 'wpac_open_selector_helper_' . $post_id ) || ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error(
				array(
					'title'   => __( 'Error', 'wp-ajaxify-comments' ),
					'message' => __( 'Could not verify nonce or permissions.', 'wp-ajaxify-comments' ),
				)
			);
		}

		// Check if Jetpack comments is enabled. If so, send compatibility error.
		if ( class_exists( 'Jetpack' ) ) {
			$is_jetpack_comments_enabled = \Jetpack::is_module_active( 'comments' );
			if ( $is_jetpack_comments_enabled ) {
				wp_send_json_error(
					array(
						'title'   => __( 'Incompatible Plugin Found', 'wp-ajaxify-comments' ),
						'message' => __( 'Jetpack Comments is enabled. Jetpack loads their comment form in an iframe. This prevents a lot of third-party comment integrations from working, including this plugin.', 'wp-ajaxify-comments' ),
					)
				);
			}
		}

		// Check that comments are open for the post.
		$post = get_post( $post_id );
		if ( ! $post || ! comments_open( $post_id ) ) {
			wp_send_json_error(
				array(
					'title'   => __( 'Error: Comments are closed', 'wp-ajaxify-comments' ),
					'message' => __( 'Comments are not open for this post. Please enable comments for this post and try Selector Helper again.', 'wp-ajaxify-comments' ),
				)
			);
		}

		// Check that there are at least one visible (approved) comment on the post.
		$comments = get_comments(
			array(
				'post_id' => $post_id,
				'status'  => 'approve',
			)
		);
		if ( empty( $comments ) ) {
			wp_send_json_error(
				array(
					'title'   => __( 'Error: No comments found', 'wp-ajaxify-comments' ),
					'message' => __( 'No comments were found for this post. Please add a comment and try Selector Helper again.', 'wp-ajaxify-comments' ),
				)
			);
		}

		wp_send_json_success(
			array(
				'title'   => __( 'Comment Tests Passed', 'wp-ajaxify-comments' ),
				'message' => __( 'Your comment section looks good. Let\'s try to grab the selectors.', 'wp-ajaxify-comments' ),
			)
		);
	}

	/**
	 * Save the Ajax selectors.
	 */
	public function ajax_save_selectors() {
		// Get nonce.
		$nonce = sanitize_text_field( filter_input( INPUT_POST, 'nonce', FILTER_DEFAULT ) );

		// Security.
		if ( ! wp_verify_nonce( $nonce, 'wpac_save_selector_helper' ) || ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error(
				array(
					'title'   => __( 'Error', 'wp-ajaxify-comments' ),
					'message' => __( 'Could not verify nonce or permissions.', 'wp-ajaxify-comments' ),
				)
			);
		}

		// Get the selectors. Input is stringified object.
		$comment_selectors = filter_input( INPUT_POST, 'selectors', FILTER_DEFAULT );
		$comment_selectors = json_decode( $comment_selectors, true );

		// Make sure we have selectors.
		if ( empty( $comment_selectors ) ) {
			wp_send_json_error(
				array(
					'title'   => __( 'Error', 'wp-ajaxify-comments' ),
					'message' => __( 'No selectors were found. Please try again.', 'wp-ajaxify-comments' ),
				)
			);
		}

		// Get existing options.
		$options          = Options::get_options();
		$options_to_merge = array();

		// Loop through comment selectors.
		foreach ( $comment_selectors as $index => $selector_arr ) {
			$options_to_merge[ sanitize_text_field( $selector_arr['selectorOptionName'] ) ] = sanitize_text_field( $selector_arr['selector'] );
		}

		// Merge and update the options.
		$options = wp_parse_args( $options_to_merge, $options );
		Options::update_options( $options );

		wp_send_json_success(
			array(
				'title'   => __( 'Selectors Have Been Saved', 'wp-ajaxify-comments' ),
				'message' => __( 'You should be all set. Make sure Ajaxify Comments is enabled and leave a few test comments to be sure.', 'wp-ajaxify-comments' ),
			)
		);
	}

	/**
	 * Enqueue the menu helper scripts and styles.
	 */
	public function enqueue_menu_helper_scripts_styles() {
		wp_enqueue_script(
			'wpac-menu-helper-js',
			Functions::get_plugin_url( 'dist/wpac-frontend-menu-helper.js' ),
			array(),
			Functions::get_plugin_version(),
			true
		);
		wp_localize_script(
			'wpac-menu-helper-js',
			'wpacMenuHelper',
			array(
				'ajaxUrl'   => esc_url( admin_url( 'admin-ajax.php' ) ),
				'nonce'     => wp_create_nonce( 'wpac_open_selector_helper_' . get_the_ID() ),
				'saveNonce' => wp_create_nonce( 'wpac_save_selector_helper' ),
			)
		);
		wp_set_script_translations( 'wpac-menu-helper-js', 'wp-ajaxify-comments' );
		wp_enqueue_style(
			'wpac-menu-helper-css',
			Functions::get_plugin_url( 'dist/wpac-frontend-menu-helper.css' ),
			array(),
			Functions::get_plugin_version(),
			'all'
		);
	}

	/**
	 * Add the admin bar menu.
	 *
	 * @param WP_Admin_Bar $admin_bar Admin bar reference.
	 */
	public function admin_bar_menu( $admin_bar ) {
		// Only load on singular and page types.
		if ( ! is_singular() && ! is_page() ) {
			return;
		}

		// If user doesn't have capabilities, don't show the menu.
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$ajaxify_svg = '<span class="ajaxify-menu-svg" style="display: inline-block; top: 6px; position: relative; padding-right: 8px; line-height: 1;"><svg height="21px" viewBox="0 0 157 219" version="1.1"><g transform="matrix(0.436364,0,0,0.436364,0,0)"><g transform="matrix(2.97913,0,0,2.96218,-458.713,-598.51)"><g transform="matrix(0.564054,0,0,0.564054,71.0921,138.917)"><path d="M306.835,169.825C309.509,187.079 297.69,203.232 280.438,205.906C263.185,208.581 247.03,196.762 244.356,179.509C241.682,162.256 253.501,146.102 270.754,143.428C288.007,140.754 304.16,152.572 306.835,169.825Z" style="fill:currentColor;fill-rule:nonzero;"/></g><g transform="matrix(0.564054,0,0,0.564054,71.0921,138.917)"><path d="M223.515,202.017C225.744,216.399 215.892,229.865 201.51,232.094C187.128,234.323 173.662,224.471 171.433,210.089C169.204,195.707 179.056,182.241 193.438,180.012C207.82,177.783 221.286,187.635 223.515,202.017Z" style="fill:currentColor;fill-rule:nonzero;"/></g><g transform="matrix(0.564054,0,0,0.564054,71.0921,138.917)"><path d="M203.489,272.704C205.556,286.037 196.422,298.521 183.089,300.588C169.755,302.654 157.271,293.521 155.205,280.188C153.138,266.854 162.272,254.37 175.605,252.303C188.938,250.237 201.422,259.371 203.489,272.704Z" style="fill:currentColor;fill-rule:nonzero;"/></g><g transform="matrix(0.564054,0,0,0.564054,71.0921,138.917)"><path d="M299.182,357.099C300.865,367.964 293.423,378.137 282.557,379.821C271.691,381.505 261.519,374.062 259.834,363.197C258.15,352.332 265.594,342.158 276.459,340.475C287.324,338.791 297.497,346.233 299.182,357.099Z" style="fill:currentColor;fill-rule:nonzero;"/></g><g transform="matrix(0.564054,0,0,0.564054,71.0921,138.917)"><path d="M239.775,334.523C241.646,346.599 233.375,357.904 221.3,359.776C209.225,361.647 197.919,353.376 196.047,341.301C194.176,329.226 202.447,317.92 214.522,316.048C226.597,314.177 237.903,322.448 239.775,334.523Z" style="fill:currentColor;fill-rule:nonzero;"/></g><g transform="matrix(0.564054,0,0,0.564054,71.0921,138.917)"><path d="M351.777,328.614C353.478,339.58 345.966,349.848 335,351.547C324.034,353.247 313.767,345.735 312.066,334.769C310.367,323.803 317.879,313.536 328.845,311.836C339.811,310.136 350.078,317.648 351.777,328.614Z" style="fill:currentColor;fill-rule:nonzero;"/></g><g transform="matrix(0.564054,0,0,0.564054,71.0921,138.917)"><path d="M350.105,274.702C351.707,285.04 344.626,294.719 334.288,296.321C323.95,297.924 314.271,290.842 312.668,280.504C311.065,270.166 318.147,260.487 328.485,258.886C338.823,257.283 348.503,264.364 350.105,274.702Z" style="fill:currentColor;fill-rule:nonzero;"/></g><g transform="matrix(0.564054,0,0,0.564054,71.0921,138.917)"><path d="M280.033,295.837C281.029,301.478 277.264,306.858 271.623,307.854C265.982,308.849 260.603,305.084 259.605,299.443C258.611,293.803 262.376,288.423 268.017,287.427C273.657,286.431 279.037,290.197 280.033,295.837Z" style="fill:currentColor;fill-rule:nonzero;"/></g><g transform="matrix(0.564054,0,0,0.564054,71.0921,138.917)"><path d="M312.28,246.379C313.556,254.609 307.919,262.315 299.688,263.59C291.459,264.866 283.753,259.229 282.478,250.999C281.202,242.769 286.84,235.063 295.069,233.788C303.299,232.512 311.005,238.149 312.28,246.379Z" style="fill:currentColor;fill-rule:nonzero;"/></g><g transform="matrix(0.564054,0,0,0.564054,71.0921,138.917)"><path d="M271.497,262.163C272.694,269.892 267.4,277.128 259.672,278.326C251.943,279.524 244.707,274.229 243.509,266.501C242.312,258.772 247.605,251.536 255.334,250.338C263.063,249.141 270.299,254.435 271.497,262.163Z" style="fill:currentColor;fill-rule:nonzero;"/></g></g></g></svg></span>';

		$post_id   = get_the_ID();
		$post      = get_post( $post_id );
		$permalink = get_permalink( $post_id );
		$options   = Options::get_options();

		// Begin admin menu.
		$admin_bar->add_menu(
			array(
				'id'    => 'wpac-menu-helper',
				'title' => $ajaxify_svg . __( 'Ajaxify', 'wp-ajaxify-comments' ),
				'href'  => '#',
				'meta'  => array(
					'class' => 'wpac-menu-helper',
					'title' => __( 'WP Ajaxify Comments', 'wp-ajaxify-comments' ),
				),
			)
		);
		$ajaxify_get_enabled = filter_input( INPUT_GET, 'ajaxifyEnable', FILTER_VALIDATE_BOOLEAN );
		$ajaxify_enabled     = (bool) $options['enable'] || $ajaxify_get_enabled; // Can be true if enabled in settings or if enabled via query arg.

		// If get enabled is false, simulate Ajaxify disabled.
		if ( null !== $ajaxify_get_enabled && ! $ajaxify_get_enabled ) {
			$ajaxify_enabled = false;
		}

		// Get debug mode.
		$ajaxify_debug_mode = (bool) $options['debug'];

		if ( $ajaxify_enabled || $ajaxify_debug_mode ) {
			$disable_ajaxify_url = add_query_arg(
				array(
					'ajaxifyEnable' => '0',
					'nonce'         => wp_create_nonce( 'wpac_disable_ajaxify_' . $post_id ),
					'post_id'       => $post_id,
				),
				$permalink
			);

			// Use permalink if enabled via get variable. // Strips query vars.
			if ( $ajaxify_get_enabled ) {
				$disable_ajaxify_url = get_permalink( $post_id );
			}
			$admin_bar->add_node(
				array(
					'id'     => 'wpac-ajaxify-disable',
					'parent' => 'wpac-menu-helper',
					'title'  => __( 'Simulate Ajaxify Disabled', 'wp-ajaxify-comments' ),
					'href'   => esc_url( $disable_ajaxify_url ),
				)
			);
		} else {
			// Enable Ajaxify Temporarily with a link.
			$enable_ajaxify_url = add_query_arg(
				array(
					'ajaxifyEnable' => '1',
					'nonce'         => wp_create_nonce( 'wpac_enable_ajaxify_' . $post_id ),
					'post_id'       => $post_id,
				),
				$permalink
			);

			// If `ajaxifyEnable` is in the URL, assume it's disabled via query var.
			if ( null !== $ajaxify_get_enabled ) {
				$enable_ajaxify_url = get_permalink( $post_id );
			}
			$admin_bar->add_node(
				array(
					'id'     => 'wpac-ajaxify-enable',
					'parent' => 'wpac-menu-helper',
					'title'  => __( 'Simulate Ajaxify Enabled', 'wp-ajaxify-comments' ),
					'href'   => esc_url( $enable_ajaxify_url ),
				)
			);
		}

		$admin_bar->add_node(
			array(
				'id'     => 'wpac-open-selector-helper',
				'parent' => 'wpac-menu-helper',
				'title'  => __( 'Launch Selector Helper', 'wp-ajaxify-comments' ),
				'href'   => esc_url(
					add_query_arg(
						array(
							'wpacOpenSelectorHelper' => '1',
							'post_id'                => $post_id,
						),
						$permalink
					)
				),
			)
		);

		// Set var for skipping ajaxify enabled status.
		$check_ajaxify_enabled                 = true;
		$dont_check_ajaxify_lazy_load_get_vars = true;
		$check_ajaxify_lazy_load_get_vars      = false;

		// Check if lazy loading is enabled.
		$is_lazy_loading_enabled = Functions::is_lazy_loading_enabled(
			$check_ajaxify_enabled,
			$check_ajaxify_lazy_load_get_vars,
			$post_id
		);

		if ( $is_lazy_loading_enabled ) {
			$disable_lazy_loading_url = add_query_arg(
				array(
					'ajaxifyLazyLoadEnable' => '0',
					'nonce'                 => wp_create_nonce( 'wpac_disable_ajaxify_lazy_loading_' . $post_id ),
					'post_id'               => $post_id,
				),
				$permalink
			);

			// Check if lazy loading is being initiated by get variable.
			$lazy_loading_enabled = Functions::is_lazy_loading_enabled(
				false,
				true,
				$post_id
			);
			if ( ! $lazy_loading_enabled ) {
				$disable_lazy_loading_url = get_permalink( $post_id );
			}

			// Show the menu item only if Query var isn't null.
			if ( Functions::is_ajaxify_enabled( true ) && $lazy_loading_enabled ) {
				$admin_bar->add_node(
					array(
						'id'     => 'wpac-ajaxify-lazy-loading-disable',
						'parent' => 'wpac-menu-helper',
						'title'  => __( 'Simulate Lazy Load Disabled', 'wp-ajaxify-comments' ),
						'href'   => esc_url( $disable_lazy_loading_url ),
					)
				);
			}
		} else {
			// Get whether lazy loading is disabled via query var.
			$lazy_loading_enabled = Functions::is_lazy_loading_enabled(
				false,
				true,
				$post_id
			);

			// Enable Ajaxify Temporarily with a link.
			$enable_lazy_loading_url = add_query_arg(
				array(
					'ajaxifyLazyLoadEnable' => '1',
					'nonce'                 => wp_create_nonce( 'wpac_enable_ajaxify_lazy_loading_' . $post_id ),
					'post_id'               => $post_id,
				),
				$permalink
			);

			// If lazy loading is enabled via query var.
			if ( $lazy_loading_enabled ) {
				$enable_lazy_loading_url = get_permalink( $post_id );
			}

			// Add node to admin bar.
			if ( Functions::is_ajaxify_enabled( true ) ) {
				$admin_bar->add_node(
					array(
						'id'     => 'wpac-ajaxify-lazy-loading-enable',
						'parent' => 'wpac-menu-helper',
						'title'  => __( 'Simulate Lazy Load Enabled', 'wp-ajaxify-comments' ),
						'href'   => esc_url( $enable_lazy_loading_url ),
					)
				);
			}
		}

		// If comments are open, add close. If closed, add open.
		if ( comments_open() ) {

			// Get URL endpoint for closing comments.
			$close_comments_url = add_query_arg(
				array(
					'action'  => 'wpac_shortcut_close_comments',
					'nonce'   => wp_create_nonce( 'wpac_shortcut_close_comments_' . $post_id ),
					'post_id' => $post_id,
				),
				admin_url( 'admin-ajax.php' )
			);

			$admin_bar->add_node(
				array(
					'id'     => 'wpac-close-comments',
					'parent' => 'wpac-menu-helper',
					'title'  => __( 'Close Comments', 'wp-ajaxify-comments' ),
					'href'   => esc_url( $close_comments_url ),
				)
			);
		} else {
			// Get URL endpoint for opening comments.
			$open_comments_url = add_query_arg(
				array(
					'action'  => 'wpac_shortcut_open_comments',
					'nonce'   => wp_create_nonce( 'wpac_shortcut_open_comments_' . $post_id ),
					'post_id' => $post_id,
				),
				admin_url( 'admin-ajax.php' )
			);
			$admin_bar->add_node(
				array(
					'id'     => 'wpac-open-comments',
					'parent' => 'wpac-menu-helper',
					'title'  => __( 'Open Comments', 'wp-ajaxify-comments' ),
					'href'   => esc_url( $open_comments_url ),
				)
			);
		}

		// Add shortcut to Ajaxify settings.
		$admin_bar->add_node(
			array(
				'id'     => 'wpac-admin-settings',
				'parent' => 'wpac-menu-helper',
				'title'  => __( 'Visit Admin Settings', 'wp-ajaxify-comments' ),
				'href'   => esc_url( Functions::get_settings_url() ),
			)
		);
		$admin_bar->add_node(
			array(
				'id'     => 'wpac-admin-selector-settings',
				'parent' => 'wpac-menu-helper',
				'title'  => __( 'Visit Selector Settings', 'wp-ajaxify-comments' ),
				'href'   => esc_url( Functions::get_settings_url( 'selectors' ) ),
			)
		);
	}

	/**
	 * Add a back to post option in the admin bar.
	 *
	 * @param WP_Admin_Bar $admin_bar Admin bar reference.
	 */
	public function admin_bar_menu_back_to_post( $admin_bar ) {
		// Only load on singular and page types.
		if ( ! is_singular() && ! is_page() ) {
			return;
		}

		// If user doesn't have capabilities, don't show the menu.
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$post_id   = get_the_ID();
		$permalink = get_permalink( $post_id );

		// Begin admin menu.
		$admin_bar->add_node(
			array(
				'id'    => 'wpac-menu-helper-back-to-post',
				'title' => __( 'Back to Post', 'wp-ajaxify-comments' ),
				'href'  => esc_url( $permalink ),
			)
		);
	}

	/**
	 * Add option group for preview overlays.
	 *
	 * @param WP_Admin_Bar $admin_bar Admin bar reference.
	 */
	public function admin_bar_menu_preview_overlay( $admin_bar ) {
		// Only load on singular and page types.
		if ( ! is_singular() && ! is_page() ) {
			return;
		}

		// If user doesn't have capabilities, don't show the menu.
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$post_id   = get_the_ID();
		$permalink = get_permalink( $post_id );

		// Begin admin menu.
		$admin_bar->add_group(
			array(
				'id'     => 'wpac-menu-helper-preview-overlay',
				'parent' => 'wpac-menu-helper',
			)
		);

		$admin_bar->add_node(
			array(
				'id'     => 'wpac-menu-helper-preview-overlay-label',
				'parent' => 'wpac-menu-helper',
				'title'  => '<span style="font-weight: 900;">' . __( 'Overlay Preview', 'comment-edit-pro' ) . '</span>',
				'href'   => false,
			)
		);

		// Add the preview loading overlay link.
		$admin_bar->add_node(
			array(
				'id'     => 'wpac-menu-helper-preview-overlay-loading',
				'parent' => 'wpac-menu-helper-preview-overlay',
				'title'  => __( 'Preview Loading', 'wp-ajaxify-comments' ),
				'href'   => esc_url( $permalink ),
			)
		);

		// Add the preview success overlay link.
		$admin_bar->add_node(
			array(
				'id'     => 'wpac-menu-helper-preview-overlay-success',
				'parent' => 'wpac-menu-helper-preview-overlay',
				'title'  => __( 'Preview Success', 'wp-ajaxify-comments' ),
				'href'   => esc_url( $permalink ),
			)
		);

		// Add the preview success overlay link.
		$admin_bar->add_node(
			array(
				'id'     => 'wpac-menu-helper-preview-overlay-error',
				'parent' => 'wpac-menu-helper-preview-overlay',
				'title'  => __( 'Preview Error', 'wp-ajaxify-comments' ),
				'href'   => esc_url( $permalink ),
			)
		);
	}

	/**
	 * Ajax callback for opening comments from the frontend admin bar menu.
	 *
	 * Performs wp_safe_redirect back to the post it was on.
	 */
	public function ajax_shortcut_open_comments() {
		// Check nonce.
		$nonce   = filter_input( INPUT_GET, 'nonce', FILTER_DEFAULT );
		$post_id = filter_input( INPUT_GET, 'post_id', FILTER_VALIDATE_INT );
		if ( ! wp_verify_nonce( $nonce, 'sce_shortcut_open_comments' . $post_id ) || ! $post_id ) {
			wp_die( esc_html__( 'Invalid nonce.', 'sce-comment-shortcuts' ) );
		}

		// Open comments for the post.
		$post = get_post( $post_id );
		if ( ! $post ) {
			wp_die( esc_html__( 'Invalid post.', 'sce-comment-shortcuts' ) );
		}
		$post->comment_status = 'open';
		wp_update_post( $post );

		// Redirect back to the post.
		wp_safe_redirect( get_permalink( $post_id ) );
		exit;
	}

	/**
	 * Ajax callback for closing comments from the frontend admin bar menu.
	 *
	 * Performs wp_safe_redirect back to the post it was on.
	 */
	public function ajax_shortcut_close_comments() {
		// Check nonce.
		$nonce   = filter_input( INPUT_GET, 'nonce', FILTER_DEFAULT );
		$post_id = filter_input( INPUT_GET, 'post_id', FILTER_VALIDATE_INT );
		if ( ! wp_verify_nonce( $nonce, 'sce_shortcut_close_comments' . $post_id ) || ! $post_id ) {
			wp_die( esc_html__( 'Invalid nonce.', 'sce-comment-shortcuts' ) );
		}

		// Close comments for the post.
		$post = get_post( $post_id );
		if ( ! $post ) {
			wp_die( esc_html__( 'Invalid post.', 'sce-comment-shortcuts' ) );
		}
		$post->comment_status = 'closed';
		wp_update_post( $post );

		// Redirect back to the post.
		wp_safe_redirect( get_permalink( $post_id ) );
		exit;
	}
}
