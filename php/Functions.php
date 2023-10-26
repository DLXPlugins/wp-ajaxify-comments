<?php
/**
 * Helper fuctions.
 *
 * @package WPAC
 */

namespace DLXPlugins\WPAC;

/**
 * Class functions
 */
class Functions {

	/**
	 * Checks if the plugin is on a multisite install.
	 *
	 * @since 1.0.0
	 *
	 * @param bool $network_admin Check if in network admin.
	 *
	 * @return true if multisite, false if not.
	 */
	public static function is_multisite( $network_admin = false ) {
		if ( ! function_exists( 'is_plugin_active_for_network' ) ) {
			require_once ABSPATH . '/wp-admin/includes/plugin.php';
		}
		$is_network_admin = false;
		if ( $network_admin ) {
			if ( is_network_admin() ) {
				if ( is_multisite() && is_plugin_active_for_network( self::get_plugin_slug() ) ) {
					return true;
				}
			} else {
				return false;
			}
		}
		if ( is_multisite() && is_plugin_active_for_network( self::get_plugin_slug() ) ) {
			return true;
		}
		return false;
	}


	/**
	 * Return the URL to the admin screen
	 *
	 * @param string $tab     Tab path to load.
	 * @param string $sub_tab Subtab path to load.
	 *
	 * @return string URL to admin screen. Output is not escaped.
	 */
	public static function get_settings_url( $tab = '', $sub_tab = '' ) {
		if ( self::is_multisite() ) {
			$options_url = network_admin_url( 'settings.php?page=ajaxify-comments' );
		} else {
			$options_url = admin_url( 'options-general.php?page=ajaxify-comments' );
		}
		if ( ! empty( $tab ) ) {
			$options_url = add_query_arg( array( 'tab' => sanitize_title( $tab ) ), $options_url );
			if ( ! empty( $sub_tab ) ) {
				$options_url = add_query_arg( array( 'subtab' => sanitize_title( $sub_tab ) ), $options_url );
			}
		}
		return $options_url;
	}

	/**
	 * Get the current admin tab.
	 *
	 * @return null|string Current admin tab.
	 */
	public static function get_admin_tab() {
		$tab = filter_input( INPUT_GET, 'tab', FILTER_DEFAULT );
		if ( $tab && is_string( $tab ) ) {
			return sanitize_text_field( sanitize_title( $tab ) );
		}
		return null;
	}

	/**
	 * Array data that must be sanitized.
	 *
	 * @param array $data Data to be sanitized.
	 *
	 * @return array Sanitized data.
	 */
	public static function sanitize_array_recursive( array $data ) {
		$sanitized_data = array();
		foreach ( $data as $key => $value ) {
			if ( '0' === $value ) {
				$value = 0;
			}
			if ( 'true' === $value ) {
				$value = true;
			} elseif ( 'false' === $value ) {
				$value = false;
			}
			if ( is_array( $value ) ) {
				$value                  = self::sanitize_array_recursive( $value );
				$sanitized_data[ $key ] = $value;
				continue;
			}
			if ( is_bool( $value ) ) {
				$sanitized_data[ $key ] = (bool) $value;
				continue;
			}
			if ( is_int( $value ) ) {
				$sanitized_data[ $key ] = (int) $value;
				continue;
			}
			if ( is_numeric( $value ) ) {
				$sanitized_data[ $key ] = (float) $value;
				continue;
			}
			if ( is_string( $value ) ) {
				$sanitized_data[ $key ] = sanitize_text_field( $value );
				continue;
			}
		}
		return $sanitized_data;
	}

	/**
	 * Get the current admin sub-tab.
	 *
	 * @return null|string Current admin sub-tab.
	 */
	public static function get_admin_sub_tab() {
		$tab = filter_input( INPUT_GET, 'tab', FILTER_DEFAULT );
		if ( $tab && is_string( $tab ) ) {
			$subtab = filter_input( INPUT_GET, 'subtab', FILTER_DEFAULT );
			if ( $subtab && is_string( $subtab ) ) {
				return sanitize_text_field( sanitize_title( $subtab ) );
			}
		}
		return null;
	}

	/**
	 * Checks to see if a plugin is activated or not.
	 *
	 * @since 1.0.0
	 *
	 * @param string $path Path to the asset.
	 * @param string $type Type to check if it is activated or not.
	 *
	 * @return bool true if activated, false if not.
	 */
	public static function is_activated( $path ) {

		// Gets all active plugins on the current site.
		$active_plugins = self::is_multisite() ? get_site_option( 'active_sitewide_plugins' ) : get_option( 'active_plugins', array() );
		if ( in_array( $path, $active_plugins, true ) ) {
			return true;
		}
		return false;
	}

	/**
	 * Checks to see if a plugin is installed or not.
	 *
	 * @since 1.0.0
	 *
	 * @param string $path Path to the asset.
	 * @param string $type Type to check if it is installed or not.
	 *
	 * @return bool true if installed, false if not.
	 */
	public static function is_installed( $path ) {

		// Get all plugins for current site.
		require_once ABSPATH . 'wp-admin/includes/plugin.php';
		$all_plugins = get_plugins();

		if ( array_key_exists( $path, $all_plugins ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Return if Ajaxify Comments "can" be marked as enabled. This is a pre-check.
	 *
	 * @param bool $skip_get_check Whether to skip the GET check or not.
	 *
	 * @return bool true if Ajaxify Comments can be marked as enabled, false (default) if not.
	 */
	public static function is_ajaxify_enabled( $skip_get_check = false ) {
		$options             = Options::get_options();
		$ajaxify_get_enabled = filter_input( INPUT_GET, 'ajaxifyEnable', FILTER_VALIDATE_BOOLEAN );
		$ajaxify_enabled     = (bool) $options['enable'];

		// If get enabled is false, simulate Ajaxify disabled.
		if ( null !== $ajaxify_get_enabled && ! $ajaxify_get_enabled && ! $skip_get_check ) {
			$ajaxify_enabled = false;
		}

		// Get debug mode.
		$ajaxify_debug_mode = (bool) $options['debug'];

		/**
		 * Filter whether to load the plugin.
		 *
		 * @since 2.0.0
		 *
		 * @param bool $can_force_enable Whether to load the plugin's scripts. Pass `true` to force scripts to load.
		 */
		$can_force_load = apply_filters( 'dlxplugins/ajaxify/comments/force_load', false );

		/**
		 * Filter whether to load the plugin's scripts.
		 *
		 * @since 2.0.0
		 *
		 * @param bool $can_load Whether to load the plugin. Pass `false` to prevent the plugin from loading.
		 */
		$can_load = apply_filters( 'dlxplugins/ajaxify/comments/can_load', true );

		// If Script override, Ajaxify is enabled if allowed to load.
		if ( ( $can_force_load && ! is_admin() && ! wpac_is_login_page() ) ) {
			return $can_load;
		}

		// Check if enabled by query var.
		$wpac_enable = sanitize_text_field( filter_input( INPUT_GET, 'wpac_enable', FILTER_DEFAULT ) );

		if ( ! is_admin() && ! wpac_is_login_page() && $can_load ) {
			if ( (bool) $options['enable'] || ( $options['enableByQuery'] && wpac_get_secret() === $wpac_enable ) ) {

				// We've made it here. Ajaxify is enabled, and lazy loading is enabled.
				$ajaxify_enabled = true;
			}
		}

		// Return if Ajaxify can be marked as enabled.
		return $ajaxify_enabled;
	}

	/**
	 * Check if lazy loading is enabled.
	 *
	 * @param bool $skip_ajaxify_enabled_check Whether to skip the Ajaxify Comments is enabled or not.
	 * @param bool $skip_get_check             Whether to skip the GET check or not.
	 * @param int  $post_id                    Post ID to check if lazy loading is enabled for (optional). If not passed, get the global post ID via get_the_ID().
	 *
	 * @uses self::is_ajaxify_enabled()
	 *
	 * @return bool true if lazy loading is enabled, false if not.
	 */
	public static function is_lazy_loading_enabled( $skip_ajaxify_enabled_check = false, $skip_get_check = true, $post_id = null ) {

		// If ajaxify is disabled, so is lazy loading. Skip this check via $skip_ajaxify_enabled_check.
		if ( ! $skip_ajaxify_enabled_check && ! self::is_ajaxify_enabled() ) {
			return false;
		}

		// Check GET variables to see if lazy loading is enabled via query var.
		if ( ! $skip_get_check && self::is_ajaxify_enabled( $skip_get_check ) ) {
			$ajaxify_lazy_loading_get_enabled = filter_input( INPUT_GET, 'ajaxifyLazyLoadEnable', FILTER_VALIDATE_BOOLEAN );
			if ( null !== $ajaxify_lazy_loading_get_enabled ) {
				// Query var is set, let's get post ID.
				$post_id = filter_input( INPUT_GET, 'post_id', FILTER_VALIDATE_INT );

				// Let's get nonce.
				$nonce = filter_input( INPUT_GET, 'nonce', FILTER_DEFAULT );

				// Let's verify the nonce.
				if ( null !== $post_id && null !== $nonce ) {
					$action = '';
					if ( $ajaxify_lazy_loading_get_enabled ) {
						$action = 'wpac_enable_ajaxify_lazy_loading_' . $post_id;
					} else {
						$action = 'wpac_disable_ajaxify_lazy_loading_' . $post_id;
					}

					// If nonce passes, we can force enable or disable.
					if ( wp_verify_nonce( $nonce, $action ) ) {
						return $ajaxify_lazy_loading_get_enabled;
					}
				}
			}
		}

		// Retrieve options.
		$options = Options::get_options();

		// Get lazy loading/async threshold. Async threshold is misleading here. If it's `0`, it means lazy loading is enabled. Otherwise, any other value, it's disabled.
		$lazy_load_enabled = (bool) $options['lazyLoadEnabled'];

		// If lazy load isn't enabled by option, bail.
		if ( false === $lazy_load_enabled ) {
			return false;
		}

		// Get the lazy load trigger.
		$lazy_load_trigger = $options['lazyLoadTrigger']; /* can be external, comments, domready, scroll, element */

		// If 'none', lazy loading is not enabled.
		// Old behavior here was to not show any comments, which makes no sense.
		// New behavior is to show comments normally.
		if ( 'none' === $lazy_load_trigger ) {
			return false;
		}

		// Get the approved comment count.
		$comments_count = (int) wp_count_comments( $post_id ?? get_the_ID() )->approved;

		// If no approved comments, lazy loading is not enabled.
		if ( 0 === $comments_count ) {
			return false;
		}

		// We've made it this far. All good to say lazy loading is enabled.
		return true;
	}

	/**
	 * Return a default color palette for the theme.
	 *
	 * @param array $palette_to_merge {.
	 *    @type string $name Primary color name.
	 *    @type string $slug Primary color slug.
	 *    @type string $color Primary color hex or var.
	 * }
	 *
	 * @return array Default color palette.
	 */
	public static function get_theme_color_palette( $palette_to_merge = array() ) {
		$color_palette = array();
		$settings      = \WP_Theme_JSON_Resolver::get_theme_data()->get_settings();
		if ( isset( $settings['color']['palette']['theme'] ) ) {
			$color_palette = $settings['color']['palette']['theme'];
		}

		// Merge with theme color palette if available.
		if ( ! empty( $palette_to_merge ) ) {
			$color_palette = array_merge( $color_palette, $palette_to_merge );
		}
		/**
		 * Filter the color palette.
		 *
		 * @param array $color_palette Color palette {
		 *   @type string $name Primary color name.
		 *   @type string $slug Primary color slug.
		 *   @type string $color Primary color hex or var.
		 * }
		 */
		return apply_filters( 'ajaxify/comments/theme_color_palette', $color_palette );
	}

	/**
	 * Take a _ separated field and convert to camelcase.
	 *
	 * @param string $field Field to convert to camelcase.
	 *
	 * @return string camelCased field.
	 */
	public static function to_camelcase( string $field ) {
		return str_replace( '_', '', lcfirst( ucwords( $field, '_' ) ) );
	}

	/**
	 * Take a camelcase field and converts it to underline case.
	 *
	 * @param string $field Field to convert to camelcase.
	 *
	 * @return string $field Field name in camelCase..
	 */
	public static function to_underlines( string $field ) {
		$field = strtolower( preg_replace( '/([a-z])([A-Z])/', '$1_$2', $field ) );
		return $field;
	}

	/**
	 * Return the plugin slug.
	 *
	 * @return string plugin slug.
	 */
	public static function get_plugin_slug() {
		return dirname( plugin_basename( WPAC_FILE ) );
	}

	/**
	 * Return the plugin path.
	 *
	 * @return string plugin path.
	 */
	public static function get_plugin_path() {
		return plugin_basename( WPAC_FILE );
	}

	/**
	 * Return the basefile for the plugin.
	 *
	 * @return string base file for the plugin.
	 */
	public static function get_plugin_file() {
		return plugin_basename( WPAC_FILE );
	}

	/**
	 * Return the version for the plugin.
	 *
	 * @return float version for the plugin.
	 */
	public static function get_plugin_version() {
		return WPAC_VERSION;
	}


	/**
	 * Returns appropriate html for KSES.
	 *
	 * @param bool $svg Whether to add SVG data to KSES.
	 */
	public static function get_kses_allowed_html( $svg = true ) {
		$allowed_tags = wp_kses_allowed_html();

		$allowed_tags['nav']        = array(
			'class' => array(),
		);
		$allowed_tags['a']['class'] = array();

		// Add div tag.
		$allowed_tags['div'] = array(
			'class'                => array(),
			'id'                   => array(),
			'data-selected-rating' => array(), /* for WooCommerce */
		);

		$allowed_tags['span'] = array(
			'class' => array(),
			'id'    => array(),
		);

		$allowed_tags['select'] = array(
			'class'    => array(),
			'id'       => array(),
			'required' => array(),
			'style'    => array(),
		);
		$allowed_tags['option'] = array(
			'class'    => array(),
			'id'       => array(),
			'value'    => array(),
			'selected' => array(),
		);

		if ( ! $svg ) {
			return $allowed_tags;
		}
		$allowed_tags['svg'] = array(
			'xmlns'       => array(),
			'fill'        => array(),
			'viewbox'     => array(),
			'role'        => array(),
			'aria-hidden' => array(),
			'focusable'   => array(),
			'class'       => array(),
			'width'       => array(),
			'height'      => array(),
			'style'       => array(),
		);

		$allowed_tags['path'] = array(
			'd'       => array(),
			'fill'    => array(),
			'opacity' => array(),
			'style'   => array(),
		);

		$allowed_tags['g'] = array(
			'fill'    => array(),
			'opacity' => array(),
			'style'   => array(),
		);

		$allowed_tags['circle'] = array(
			'cx'     => array(),
			'cy'     => array(),
			'r'      => array(),
			'fill'   => array(),
			'stroke' => array(),
		);

		$allowed_tags['use'] = array(
			'xlink:href' => array(),
		);

		$allowed_tags['symbol'] = array(
			'aria-hidden' => array(),
			'viewBox'     => array(),
			'id'          => array(),
			'xmls'        => array(),
		);

		$allowed_tags['ul'] = array(
			'class' => array(),
		);
		$allowed_tags['li'] = array(
			'class' => array(),
		);

		return $allowed_tags;
	}

	/**
	 * Get the plugin directory for a path.
	 *
	 * @param string $path The path to the file.
	 *
	 * @return string The new path.
	 */
	public static function get_plugin_dir( $path = '' ) {
		$dir = rtrim( plugin_dir_path( WPAC_FILE ), '/' );
		if ( ! empty( $path ) && is_string( $path ) ) {
			$dir .= '/' . ltrim( $path, '/' );
		}
		return $dir;
	}

	/**
	 * Return a plugin URL path.
	 *
	 * @param string $path Path to the file.
	 *
	 * @return string URL to to the file.
	 */
	public static function get_plugin_url( $path = '' ) {
		$dir = rtrim( plugin_dir_url( WPAC_FILE ), '/' );
		if ( ! empty( $path ) && is_string( $path ) ) {
			$dir .= '/' . ltrim( $path, '/' );
		}
		return $dir;
	}

	/**
	 * Gets the highest priority for a filter.
	 *
	 * @param int $subtract The amount to subtract from the high priority.
	 *
	 * @return int priority.
	 */
	public static function get_highest_priority( $subtract = 0 ) {
		$highest_priority = PHP_INT_MAX;
		$subtract         = absint( $subtract );
		if ( 0 === $subtract ) {
			--$highest_priority;
		} else {
			$highest_priority = absint( $highest_priority - $subtract );
		}
		return $highest_priority;
	}
}
