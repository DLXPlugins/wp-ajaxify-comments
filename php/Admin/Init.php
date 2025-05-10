<?php
/**
 * Register the admin menu and settings.
 *
 * @package WPAC
 */

namespace DLXPlugins\WPAC\Admin;

if ( ! defined( 'ABSPATH' ) ) {
	die( 'No direct access.' );
}

use DLXPlugins\WPAC\Functions;
use DLXPlugins\WPAC\Options;

/**
 * Init admin class for WPAC.
 */
class Init {

	/**
	 * Holds the slug to the admin panel page
	 *
	 * @since 5.0.0
	 * @static
	 * @var string $slug
	 */
	private static $slug = 'wp-ajaxify-comments';

	/**
	 * Holds the URL to the admin panel page
	 *
	 * @since 1.0.0
	 * @static
	 * @var string $url
	 */
	private static $url = '';

	/**
	 * Main constructor.
	 */
	public function __construct() {
		add_action( 'admin_init', array( $this, 'init' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_scripts' ) );

		// Ajax option for saving options.
		add_action( 'wp_ajax_wpac_save_options', array( $this, 'ajax_save_options' ) );

		// Ajax option for resetting options.
		add_action( 'wp_ajax_wpac_reset_options', array( $this, 'ajax_reset_options' ) );

		// Ajax option for installing a plugin.
		add_action( 'wp_ajax_wpac_install_plugin', array( $this, 'ajax_install_plugin' ) );

		// Ajax option for activating a plugin.
		add_action( 'wp_ajax_wpac_activate_plugin', array( $this, 'ajax_activate_plugin' ) );

		// Get plugin status.
		add_action( 'wp_ajax_wpac_get_plugin_status', array( $this, 'ajax_get_plugin_status' ) );

		// Init tabs.
		new Tabs\Main();
		new Tabs\Advanced();
		new Tabs\Appearance();
		new Tabs\Callbacks();
		new Tabs\Integrations();
		new Tabs\Labels();
		new Tabs\Lazy_Load();
		//new Tabs\Pagination();
		new Tabs\Selectors();
		new Tabs\Support();
	}

	public function ajax_get_plugin_status() {
		$nonce = sanitize_text_field( filter_input( INPUT_POST, 'nonce', FILTER_DEFAULT ) );
		$path  = sanitize_text_field( urldecode( filter_input( INPUT_POST, 'path', FILTER_DEFAULT ) ) );

		if ( ! wp_verify_nonce( $nonce, 'wpac-admin-integrations-retrieve-options' ) || ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error(
				array(
					'message'     => __( 'Nonce or permission verification failed.', 'wp-ajaxify-comments' ),
					'type'        => 'error',
					'dismissable' => true,
				)
			);
		}

		// Check if plugin is installed.
		$is_installed = false;
		if ( Functions::is_installed( $path ) ) {
			$is_installed = true;
		}

		// Check if plugin is active (if so, it is installed).
		$is_active = false;
		if ( Functions::is_activated( $path ) ) {
			$is_active    = true;
			$is_installed = true;
		}

		// Send response.
		wp_send_json_success(
			array(
				'installed' => $is_installed,
				'activated' => $is_active,
			)
		);
	}

	/**
	 * Install a plugin based on a slug.
	 */
	public function ajax_install_plugin() {
		// Let's get the nonce.
		$nonce = sanitize_text_field( filter_input( INPUT_POST, 'nonce', FILTER_DEFAULT ) );
		$path  = sanitize_text_field( urldecode( filter_input( INPUT_POST, 'path', FILTER_DEFAULT ) ) );
		$slug  = dirname( $path );
		if ( ! wp_verify_nonce( $nonce, 'install-plugin_' . $slug ) || ! current_user_can( 'install_plugins' ) ) {
			wp_send_json_error(
				array(
					'message'     => __( 'Nonce or permission verification failed.', 'wp-ajaxify-comments' ),
					'type'        => 'error',
					'dismissable' => true,
				)
			);
		}

		// Include plugin installation dependencies.
		require_once ABSPATH . 'wp-admin/includes/plugin-install.php';
		require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
		require_once ABSPATH . 'wp-admin/includes/class-plugin-upgrader.php';
		require_once ABSPATH . 'wp-admin/includes/plugin.php';

		// Ping Plugin API for slug.
		$api = plugins_api(
			'plugin_information',
			array(
				'slug'   => $slug,
				'fields' => array(
					'sections' => false,
				),
			)
		);

		if ( is_wp_error( $api ) ) {
			wp_send_json_error(
				array(
					'message'     => __( 'Could not find plugin to install.', 'wp-ajaxify-comments' ),
					'type'        => 'error',
					'dismissable' => true,
				)
			);
		}

		// Build title and match variables.
		$title  = 'Installing ' . $api->name . '...';
		$url    = 'update.php?action=install-plugin&plugin=' . rawurlencode( $slug );
		$plugin = $slug;

		// Build the installer.
		$upgrader        = new \Plugin_Upgrader( new \Plugin_Installer_Skin( compact( 'title', 'url', 'nonce', 'plugin', 'api' ) ) );
		$install_results = $upgrader->install( esc_url_raw( $api->download_link ) );

		if ( is_wp_error( $install_results ) ) {
			wp_send_json_error(
				array(
					'message'     => __( 'Could not install plugin.', 'wp-ajaxify-comments' ),
					'type'        => 'error',
					'dismissable' => true,
				)
			);
		}

		// A mix of HTML and JSON are output here. There's not a way to buffer from what I can tell. JSON is extracted out via RegEx in the JS.

		wp_send_json_success(
			array(
				'message'     => __( 'Plugin installed.', 'wp-ajaxify-comments' ),
				'type'        => 'success',
				'dismissable' => true,
			)
		);
	}

	/**
	 * Activate a plugin based on a slug.
	 */
	public function ajax_activate_plugin() {
		// Let's get the nonce.
		$nonce = sanitize_text_field( filter_input( INPUT_POST, 'nonce', FILTER_DEFAULT ) );
		$path  = sanitize_text_field( urldecode( filter_input( INPUT_POST, 'path', FILTER_DEFAULT ) ) );
		$slug  = dirname( $path );
		if ( ! wp_verify_nonce( $nonce, 'activate-plugin_' . $slug ) || ! current_user_can( 'install_plugins' ) ) {
			wp_send_json_error(
				array(
					'message'     => __( 'Nonce or permission verification failed.', 'wp-ajaxify-comments' ),
					'type'        => 'error',
					'dismissable' => true,
				)
			);
		}

		$result = activate_plugin( $path, '', false, true ); // null is successful.
		if ( is_wp_error( $result ) ) {
			wp_send_json_error(
				array(
					'message'     => __( 'Could not activate plugin.', 'wp-ajaxify-comments' ),
					'type'        => 'error',
					'dismissable' => true,
				)
			);
		}

		wp_send_json_success(
			array(
				'message'     => __( 'Plugin activated.', 'wp-ajaxify-comments' ),
				'type'        => 'success',
				'dismissable' => true,
			)
		);
	}

	/**
	 * Save the WPAC options via Ajax.
	 */
	public function ajax_save_options() {
		// Get form data.
		$form_data = filter_input( INPUT_POST, 'ajaxifyFormData', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY );

		// Verify nonce.
		$nonce        = $form_data['saveNonce'];
		$nonce_action = sprintf(
			'wpac-admin-%s-save-options',
			$form_data['caller']
		);
		if ( ! wp_verify_nonce( $nonce, $nonce_action ) || ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error(
				array(
					'message'     => __( 'Nonce or permission verification failed.', 'wp-ajaxify-comments' ),
					'type'        => 'error',
					'dismissable' => true,
				)
			);
		}

		// Sanitize form data.
		$form_data = Functions::sanitize_array_recursive( $form_data );

		// Gather existing options.
		$options = Options::get_options();

		// Loop through form data and update options. Keys must exist in $options.
		foreach ( $form_data as $key => $option_value ) {
			if ( ! isset( $options[ $key ] ) ) {
				continue;
			}
			$options[ $key ] = $option_value;
		}

		$label_keys_to_translate = Options::get_string_label_keys();

		foreach ( $label_keys_to_translate as $label_key ) {
			$label_value = $options[ $label_key ];
			do_action(
				'wpml_register_string',
				$label_value,
				$label_key,
				array(
					'kind'  => 'Ajaxify',
					'name'  => 'ajaxify-comments-labels',
					'title' => 'Ajaxify Comment Labels',
				),
				$label_key,
				'line'
			);

		}

		// Update options.
		Options::update_options( $options );

		wp_send_json_success(
			array(
				'message'     => __( 'Your options have been saved.', 'wp-ajaxify-comments' ),
				'type'        => 'success',
				'dismissable' => true,
			)
		);
	}

	public function ajax_reset_options() {
		// Get form data.
		$form_data = filter_input( INPUT_POST, 'ajaxifyFormData', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY );

		// Verify nonce.
		$nonce        = $form_data['resetNonce'];
		$nonce_action = sprintf(
			'wpac-admin-%s-reset-options',
			$form_data['caller']
		);
		if ( ! wp_verify_nonce( $nonce, $nonce_action ) || ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error(
				array(
					'message'     => __( 'Nonce or permission verification failed.', 'wp-ajaxify-comments' ),
					'type'        => 'error',
					'dismissable' => true,
				)
			);
		}

		// Get defaults.
		$options_defaults = Options::get_defaults();

		// Loop through form data, replace with defaults.
		foreach ( $form_data as $key => $option_value ) {
			if ( ! isset( $options_defaults[ $key ] ) ) {
				$form_data[ $key ] = $option_value;
			} else {
				$form_data[ $key ] = $options_defaults[ $key ];
			}
		}

		// Gather existing options.
		$options = Options::get_options();

		// Loop through form data and update options. Keys must exist in $options.
		foreach ( $form_data as $key => $option_value ) {
			if ( ! isset( $options[ $key ] ) ) {
				continue;
			}
			$options[ $key ] = $option_value;
		}

		// Update options.
		Options::update_options( $options );

		wp_send_json_success(
			array(
				'message'     => __( 'Your options have been reset.', 'wp-ajaxify-comments' ),
				'type'        => 'success',
				'dismissable' => true,
				'formData'    => $form_data,
			)
		);
	}

	/**
	 * Output admin scripts/styles.
	 */
	public function admin_scripts() {
		$screen = get_current_screen();
		if ( isset( $screen->base ) && 'settings_page_ajaxify-comments' === $screen->base ) {
			wp_enqueue_style(
				'wpac-styles-admin',
				Functions::get_plugin_url( 'dist/wpac-admin-css.css' ),
				array(),
				Functions::get_plugin_version(),
				'all'
			);

			// Get current tab and trigger action.
			$current_tab = Functions::get_admin_tab();
			if ( empty( $current_tab ) ) {
				$current_tab = 'home';
			}
			do_action( 'wpac_admin_enqueue_scripts_' . $current_tab );
		}
	}

	/**
	 * Initializes admin menus, plugin settings links, tables, etc.
	 *
	 * @since 1.0.0
	 * @access public
	 * @see __construct
	 */
	public function init() {

		// Add settings link.
		$prefix = Functions::is_multisite() ? 'network_admin_' : '';
		add_action( $prefix . 'plugin_action_links_' . plugin_basename( WPAC_FILE ), array( $this, 'plugin_settings_link' ) );
		// Init admin menu.
		if ( Functions::is_multisite() ) {
			add_action( 'network_admin_menu', array( $this, 'register_sub_menu' ) );
		} else {
			add_action( 'admin_menu', array( $this, 'register_sub_menu' ) );
		}

		$options    = Options::get_options();
		$is_debug   = (bool) $options['debug'];
		$is_enabled = (bool) $options['enable'];
		if ( $is_debug || ! $is_enabled ) {
			add_action( 'after_plugin_row_' . plugin_basename( WPAC_FILE ), array( $this, 'after_plugin_row_notice' ), 10, 3 );
		}
	}

	/**
	 * Adds a notice to the plugin row in the plugins page.
	 *
	 * @access public
	 * @see init
	 * @param string $plugin_file Path to the plugin file.
	 * @param array  $plugin_data An array of plugin data.
	 * @param string $status      Status of the plugin.
	 */
	public function after_plugin_row_notice( $plugin_file, $plugin_data, $status ) {
		$options    = Options::get_options();
		$is_debug   = (bool) $options['debug'];
		$is_enabled = (bool) $options['enable'];
		if ( $is_debug ) {
			$message = __( 'Ajaxify Comments is in debug mode. Please visit the settings to disable debug mode.', 'wp-ajaxify-comments' );
		} else {
			$message = __( 'Ajaxify Comments is disabled. Please visit the settings to enable Ajaxify Comments.', 'wp-ajaxify-comments' );
		}
		?>
		<tr class="plugin-update-tr active">
			<td colspan="4" class="plugin-update colspanchange">
				<div class="notice inline notice-warning notice-alt">
					<p>
						<?php echo esc_html( $message ); ?>
					</p>
				</div>
			</td>
		</tr>
		<?php
	}

	/**
	 * Initializes admin menus
	 *
	 * @since 1.0.0
	 * @access public
	 * @see init
	 */
	public function register_sub_menu() {
		$hook = '';
		if ( Functions::is_multisite() ) {
			$hook = add_submenu_page(
				'settings.php',
				__( 'Ajaxify Comments', 'wp-ajaxify-comments' ),
				__( 'Ajaxify Comments', 'wp-ajaxify-comments' ),
				'manage_network',
				'ajaxify-comments',
				array( '\DLXPlugins\WPAC\Admin\Settings', 'settings_page' )
			);
		} else {
			$hook = add_submenu_page(
				'options-general.php',
				__( 'Ajaxify Comments', 'wp-ajaxify-comments' ),
				__( 'Ajaxify Comments', 'wp-ajaxify-comments' ),
				'manage_options',
				'ajaxify-comments',
				array( '\DLXPlugins\WPAC\Admin\Settings', 'settings_page' )
			);
		}
		add_action( 'in_admin_header', array( '\DLXPlugins\WPAC\Admin\Settings', 'get_admin_header' ) );
	}

	/**
	 * Adds plugin settings page link to plugin links in WordPress Dashboard Plugins Page
	 *
	 * @since 1.0.0
	 * @access public
	 * @see __construct
	 * @param array $settings Uses $prefix . "plugin_action_links_$plugin_file" action.
	 * @return array Array of settings
	 */
	public function plugin_settings_link( $settings ) {
		$setting_links = array(
			'settings' => sprintf( '<a href="%s">%s</a>', esc_url( $this->get_url() ), esc_html__( 'Settings', 'wp-ajaxify-comments' ) ),
			'docs'     => sprintf( '<a href="%s">%s</a>', esc_url( 'https://docs.dlxplugins.com/v/ajaxify-comments/' ), esc_html__( 'Docs', 'wp-ajaxify-comments' ) ),
			'site'     => sprintf( '<a href="%s" style="color: #f60098;">%s</a>', esc_url( 'https://dlxplugins.com/plugins/ajaxify-comments/' ), esc_html__( 'Visit Site', 'wp-ajaxify-comments' ) ),
		);
		if ( ! is_array( $settings ) ) {
			return $setting_links;
		} else {
			return array_merge( $setting_links, $settings );
		}
	}

	/**
	 * Return the URL to the admin panel page.
	 *
	 * Return the URL to the admin panel page.
	 *
	 * @since 5.0.0
	 * @access static
	 *
	 * @return string URL to the admin panel page.
	 */
	public static function get_url() {
		return Functions::get_settings_url();
	}
}
