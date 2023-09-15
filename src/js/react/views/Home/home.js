/* eslint-disable no-unused-vars */
import React, { useState, Suspense, useEffect } from 'react';
import { useForm, Controller, useWatch, useFormState } from 'react-hook-form';
import classNames from 'classnames';
import { useAsyncResource } from 'use-async-resource';
import { __, sprintf } from '@wordpress/i18n';
import BeatLoader from 'react-spinners/BeatLoader';
import SaveResetButtons from '../../components/SaveResetButtons';

import {
	TextControl,
	Button,
	ToggleControl,
	SelectControl,
	RadioControl,
} from '@wordpress/components';
import { AlertCircle, Info, FileCode2 } from 'lucide-react';
import ErrorBoundary from '../../components/ErrorBoundary';
import SendCommand from '../../utils/SendCommand';
import Notice from '../../components/Notice';

const retrieveHomeOptions = () => {
	return SendCommand( 'wpac_get_home_options', {
		nonce: wpacAdminHome.getNonce,
	} );
};

const HomeScreen = ( props ) => {
	const [ defaults, getDefaults ] = useAsyncResource(
		retrieveHomeOptions,
		[],
	);
	return (
		<ErrorBoundary
			fallback={
				<p>
					{ __( 'Could not load Home options.', 'highlight-and-share' ) }
					<br />
					<a
						href="https://dlxplugins.com/support/"
						target="_blank"
						rel="noopener noreferrer"
					>
						DLX Plugins Support
					</a>
				</p>
			}
		>
			<Suspense
				fallback={
					<>
						<h2>{ __( 'Loading Options', 'wp-ajaxify-comments' ) }</h2>
						<BeatLoader
							color={ '#873F49' }
							loading={ true }
							cssOverride={ true }
							size={ 25 }
							speedMultiplier={ 0.65 }
						/>
					</>
				}
			>
				<Interface defaults={ defaults } { ...props } />
			</Suspense>
		</ErrorBoundary>
	);
};

const Interface = ( props ) => {
	const { defaults } = props;
	const response = defaults();
	const { data, success } = response.data;
	const [ saving, setSaving ] = useState( false );
	const [ isSaved, setIsSaved ] = useState( false );
	const [ resetting, setResetting ] = useState( false );
	const [ isReset, setIsReset ] = useState( false );

	const {
		register,
		control,
		handleSubmit,
		setValue,
		getValues,
		reset,
		setError,
		clearErrors,
		trigger,
	} = useForm( {
		defaultValues: {
			enable: data.enable,
			debug: data.debug,
			menuHelper: data.menuHelper,
			scrollSpeed: data.scrollSpeed,
			autoUpdateIdleTime: data.autoUpdateIdleTime,
			saveNonce: wpacAdminHome.saveNonce,
			resetNonce: wpacAdminHome.resetNonce,
			caller: 'home',
		},
	} );
	const formValues = useWatch( { control } );
	const { errors, isDirty, dirtyFields, touchedFields } = useFormState( {
		control,
	} );

	const getCommentEditingHeader = () => {
		return (
			<>
				<h2>
					{ __( 'Ajaxify Settings Home', 'wp-ajaxify-comments' ) }
				</h2>
				<p className="description">
					{ __(
						'Enable or disable Ajaxify comments, or place into debug mode.',
						'wp-ajaxify-comments',
					) }
				</p>
			</>
		);
	};

	const onSubmit = ( formData ) => {
	};

	const getFirstTimeInstallNotification = () => {
		// See if first time install by checking `first_time_install` query var.
		// Get URL.
		const url = new URL( window.location.href );
		// Get query vars.
		const queryVars = new URLSearchParams( url.search );
		// Get first time install query var.
		const firstTimeInstall = queryVars.get( 'first_time_install' );
		// If first time install, show notification.
		if ( ! firstTimeInstall ) {
			return null;
		}
		return (
			<div className="ajaxify-admin-panel-area">
				<h2>
					{ __( 'Welcome to Ajaxify Comments', 'wp-ajaxify-comments' ) }
				</h2>
				<p className="description">
					{ __(
						'Let\'s help you get started.',
						'wp-ajaxify-comments',
					) }
				</p>
				<Notice
					message={ __(
						'When first activated, Ajaxify Comments is not enabled by default. This is so you can set up any necessary selectors and set the appearance before enabling the Ajax functionality. To get started, please start with setting the selectors.', 'wp-ajaxify-comments' ) }
					status="info"
					politeness="assertive"
					inline={ false }
					icon={ () => <Info /> }
				>
					<div className="ajaxify-admin-component-row ajaxify-admin-component-row-button" style={ { marginTop: '15px' } }>
						<Button
							href={ wpacAdminHome.selectorsUrl }
							className="ajaxify-button ajaxify__btn-secondary"
							icon={ <FileCode2 style={ { color: 'currentColor' } } /> }
						>
							{ __( 'Set Selectors', 'wp-ajaxify-comments' ) }
						</Button>
					</div>

				</Notice>
			</div>
		);
	};

	return (
		<>
			{ getFirstTimeInstallNotification() }
			<div className="ajaxify-admin-panel-area">
				{ getCommentEditingHeader() }
				<form onSubmit={ handleSubmit( onSubmit ) }>
					<div className="ajaxify-panel-row">
						<table className="form-table form-table-row-sections">
							<tbody>
								<tr>
									<th scope="row">{ __( 'Ajaxify Status', 'wp-ajaxify-comments' ) }</th>
									<td>
										<Controller
											name="enable"
											control={ control }
											render={ ( { field: { onChange, value } } ) => (
												<ToggleControl
													label={ __( 'Enable Ajaxify Comments', 'wp-ajaxify-comments' ) }
													checked={ value }
													onChange={ ( boolValue ) => {
														onChange( boolValue );
													} }
													help={ __(
														'Configure whether to enable or disable Ajaxify Comments.',
														'wp-ajaxify-comments',
													) }
												/>
											) }
										/>
										{
											getValues( 'enable' ) && (
												<>
													<Controller
														name="debug"
														control={ control }
														render={ ( { field: { onChange, value } } ) => (
															<ToggleControl
																label={ __( 'Enable Debug Mode', 'wp-ajaxify-comments' ) }
																checked={ value }
																onChange={ ( boolValue ) => {
																	onChange( boolValue );
																} }
																help={ __(
																	'Debug mode will show you the Ajaxify Comments debug log in the browser console.',
																	'wp-ajaxify-comments',
																) }
															/>
														) }
													/>
												</>
											)
										}
									</td>
								</tr>
								<tr>
									<th scope="row">{ __( 'Menu Helper', 'wp-ajaxify-comments' ) }</th>
									<td>
										<Controller
											name="menuHelper"
											control={ control }
											render={ ( { field: { onChange, value } } ) => (
												<ToggleControl
													label={ __( 'Enable Menu Helper', 'wp-ajaxify-comments' ) }
													checked={ value }
													onChange={ ( boolValue ) => {
														onChange( boolValue );
													} }
													help={ __(
														'Turn on some menu shortcuts when viewing a post with comments. You can force Ajaxify comments to load, and check the page for selectors.',
														'wp-ajaxify-comments',
													) }
												/>
											) }
										/>
									</td>
								</tr>
								<tr>
									<th scope="row">{ __( 'Miscellaneous', 'wp-ajaxify-comments' ) }</th>
									<td>
										<Controller
											name="scrollSpeed"
											control={ control }
											rules={ { required: true, pattern: '\d+' } }
											render={ ( { field: { onChange, value } } ) => (
												<TextControl
													label={ __( 'Scroll speed (ms)', 'wp-ajaxify-comments' ) }
													type="number"
													className={ classNames( 'ajaxify-admin__text-control', {
														'has-error': 'required' === errors.scrollSpeed?.type,
														'is-required': true,
													} ) }
													help={ __(
														'The scroll speed is the time it takes to scroll to the comment after successful submission.',
														'wp-ajaxify-comments',
													) }
													aria-required="true"
													value={ value }
													onChange={ onChange }
												/>
											) }
										/>
										{ errors.scrollSpeed && (
											<Notice
												message={ __(
													'The value for the scroll speed is invalid.',
													'wp-ajaxify-comments',
												) }
												status="error"
												politeness="assertive"
												inline={ false }
												icon={ () => <AlertCircle /> }
											/>
										) }
										<Controller
											name="autoUpdateIdleTime"
											control={ control }
											rules={ { required: true, pattern: '\d+' } }
											render={ ( { field: { onChange, value } } ) => (
												<TextControl
													label={ __( 'Auto update idle time (ms)', 'wp-ajaxify-comments' ) }
													type="number"
													className={ classNames( 'ajaxify-admin__text-control', {
														'has-error': 'required' === errors.autoUpdateIdleTime?.type,
														'is-required': true,
													} ) }
													help={ __(
														'Leave empty or set to 0 to disable the auto update feature.',
														'wp-ajaxify-comments',
													) }
													aria-required="true"
													value={ value }
													onChange={ onChange }
												/>
											) }
										/>
										{ errors.autoUpdateIdleTime && (
											<Notice
												message={ __(
													'The value for the idle time is invalid.',
													'wp-ajaxify-comments',
												) }
												status="error"
												politeness="assertive"
												inline={ false }
												icon={ () => <AlertCircle /> }
											/>
										) }
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<SaveResetButtons
						formValues={ formValues }
						setError={ setError }
						reset={ reset }
						errors={ errors }
						isDirty={ isDirty }
						dirtyFields={ dirtyFields }
						trigger={ trigger }
					/>
				</form>
			</div>

		</>
	);
};
export default HomeScreen;
