import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import SendCommand from '../../utils/SendCommand';
import { DownloadCloud, Loader, ShieldCheck } from 'lucide-react';
import classnames from 'classnames';
import SnackPop from '../../components/SnackPop';

const Plugin = ( props ) => {
	const {
		icon,
		pluginName,
		path,
		orgUrl,
		description,
		nonce,
		installNonce,
		activateNonce,
	} = props;

	const [ loading, setLoading ] = useState( true );
	const [ installed, setInstalled ] = useState( false );
	const [ activated, setActivated ] = useState( false );
	const [ installing, setInstalling ] = useState( false );
	const [ activating, setActivating ] = useState( false );
	const [ instanceRef, setInstanceRef ] = useState( null );

	useEffect( () => {
		if ( null !== instanceRef ) {
			SendCommand( 'wpac_get_plugin_status', {
				path,
				nonce: wpacAdminIntegrations.getNonce,
			} ).then( ( response ) => {
				const { data, success } = response.data;
				if ( success ) {
					setInstalled( data.installed );
					setActivated( data.activated );
				}
			} ).then( () => {
				setLoading( false );
			} );
		}
	}
	, [ instanceRef ] );

	/**
	 * Get a button label for a plugin card.
	 * @return {string} The button label.
	 */
	const getButtonLabel = () => {
		if ( loading ) {
			return __( 'Loading…', 'wp-ajaxify-comments' );
		}
		if ( installing ) {
			return __( 'Installing…', 'wp-ajaxify-comments' );
		}
		if ( activating ) {
			return __( 'Activating…', 'wp-ajaxify-comments' );
		}
		if ( ! installed ) {
			return __( 'Install', 'wp-ajaxify-comments' );
		}
		if ( ! activated ) {
			return __( 'Activate', 'wp-ajaxify-comments' );
		}
		return __( 'Active', 'wp-ajaxify-comments' );
	};

	/**
	 * Get a button label for a plugin card.
	 * @return {string} The button label.
	 */
	const getStatusLabel = () => {
		if ( loading ) {
			return '';
		}
		if ( ! installed ) {
			return __( 'Status: Not installed', 'wp-ajaxify-comments' );
		}
		if ( ! activated ) {
			return __( 'Status: Inactive', 'wp-ajaxify-comments' );
		}
		return __( 'Status: Installed and Active', 'wp-ajaxify-comments' );
	};

	/**
	 * Get the right icon for the button's state.
	 * @return {JSX.Element} icon.
	 */
	const getButtonIcon = () => {
		if ( loading || installing || activating ) {
			return () => <Loader />;
		}
		if ( ! installed ) {
			return () => <DownloadCloud />;
		}
		if ( ! activated ) {
			return () => <ShieldCheck />;
		}
		return null;
	};

	return (
		<div key={ path } className="ajaxify-plugin-integration">
			<div className="ajaxify-plugin-integration-info">
				<div className="ajaxify-plugin-integration-icon">
					<img src={ icon } alt={ pluginName } />
				</div>
				<div className="ajaxify-plugin-integration-meta">
					<h3>
						<a href={ orgUrl }>{ pluginName }</a></h3>
					<p className="description">
						{ description }
					</p>
				</div>
			</div>
			<div className="ajaxify-plugin-integration-actions">
				<div className="ajaxify-plugin-integration-status">
					{ ! loading && (
						<>
							{ getStatusLabel() }
						</>
					) }
				</div>
				{ ( ! activated || ! installed ) && (
					<>
						<div className="ajaxify-plugin-integration-button">
							<Button
								ref={ setInstanceRef }
								onClick={ ( e ) => {
									e.preventDefault();
									if ( ! installed ) {
										setInstalling( true );
										SendCommand( 'wpac_install_plugin', {
											path,
											nonce: installNonce,
										}, ajaxurl, 'text' ).then( ( response ) => {
											// Response is a mixture of HTML and JSON, let's extract json.
											const jsonRegex = /({[^}]+}})/;
											const responseData = response.data;
											const matches = responseData.match( jsonRegex );
											if ( matches ) {
												const { data, success } = JSON.parse( matches[ 0 ] );
												if ( success ) {
													setInstalled( true );
												}
											}
											
										} ).catch( ( e ) => { console.log( e ) } ).then( () => {
											setInstalling( false );
										} );
									} else if ( ! activated ) {
										setActivating( true );
										SendCommand( 'wpac_activate_plugin', {
											path,
											nonce: activateNonce,
										} ).then( ( response ) => {
											const { data, success } = response.data;
											if ( success ) {
												setActivated( true );
											}
										} ).catch( ( e ) => { console.log( e ) } ).then( () => {
											setActivating( false );
										} );
									}
									
								} }
								className={ classnames( 'ajaxify-button ajaxify__btn-secondary', {
									'is-loading': loading || installing || activating,
								} ) }
								disabled={ loading || installing || activating }
								icon={ getButtonIcon() }
							>
								{ getButtonLabel() }
							</Button>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default Plugin;
