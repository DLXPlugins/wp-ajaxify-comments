/* eslint-disable no-unused-vars */
import React, { useState, Suspense, useEffect } from 'react';
import { useForm, Controller, useWatch, useFormState } from 'react-hook-form';
import classNames from 'classnames';
import { useAsyncResource } from 'use-async-resource';
import { __, sprintf } from '@wordpress/i18n';
import BeatLoader from 'react-spinners/BeatLoader';

import {
	TextControl,
	Button,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import { AlertCircle, Loader2, ClipboardCheck } from 'lucide-react';
import ErrorBoundary from '../../components/ErrorBoundary';
import SendCommand from '../../utils/SendCommand';
import Notice from '../../components/Notice';
import SaveResetButtons from '../../components/SaveResetButtons';

const retrieveAdvancedOptions = () => {
	return SendCommand( 'wpac_get_advanced_options', {
		nonce: wpacAdminAdvanced.getNonce,
	} );
};

const AdvancedScreen = ( props ) => {
	const [ defaults, getDefaults ] = useAsyncResource( retrieveAdvancedOptions, [] );
	return (
		<ErrorBoundary
			fallback={
				<p>
					{ __( 'Could not load callback options.', 'highlight-and-share' ) }
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
			commentPagesUrlRegex: data.commentPagesUrlRegex,
			asyncCommentsThreshold: data.asyncCommentsThreshold,
			asyncLoadTrigger: data.asyncLoadTrigger,
			disableUrlUpdate: data.disableUrlUpdate,
			disableScrollToAnchor: data.disableScrollToAnchor,
			useUncompressedScripts: data.useUncompressedScripts,
			placeScriptsInFooter: data.placeScriptsInFooter,
			optimizeAjaxResponse: data.optimizeAjaxResponse,
			baseUrl: data.baseUrl,
			disableCache: data.disableCache,
			enableByQuery: data.enableByQuery,
			saveNonce: wpacAdminAdvanced.saveNonce,
			resetNonce: wpacAdminAdvanced.resetNonce,
			caller: 'advanced',
		},
	} );
	const formValues = useWatch( { control } );
	const { errors, isDirty, dirtyFields, touchedFields } = useFormState( {
		control,
	} );

	const hasErrors = () => {
		return Object.keys( errors ).length > 0;
	};

	const onSubmit = ( formData ) => {
	};

	const getCommentEditingHeader = () => {
		return (
			<>
				<h2>{ __( 'Advanced', 'wp-ajaxify-comments' ) }</h2>
				<p className="description">
					{ __(
						'These are advanced options for the plugin. These can alter the behavior of the plugin.',
						'wp-ajaxify-comments',
					) }
				</p>
			</>
		);
	};

	return (
		<>
			<div className="ajaxify-admin-panel-area">
				{ getCommentEditingHeader() }
				<form onSubmit={ handleSubmit( onSubmit ) }>
					<div className="ajaxify-admin-panel-content">
						<div className="ajaxify-admin__control-row">
							<Controller
								name="commentPagesUrlRegex"
								control={ control }
								render={ ( { field: { onChange, value } } ) => (
									<>
										<TextControl
											label={ __(
												'Comment Pages URL Regex',
												'wp-ajaxify-comments',
											) }
											type="text"
											className={ classNames( 'ajaxify-admin__text-control', {
												'has-error':
													'required' === errors.commentPagesUrlRegex?.type,
												'has-error':
													'pattern' === errors.commentPagesUrlRegex?.type,
												'is-required': true,
											} ) }
											help={ __(
												'Regular expression that matches URLs of all pages that support comments; leave empty to use WordPress defaults to automatically detect pages where comments are allowed. Please note: The expression is evaluated against the full page URL including schema, hostname, port number (if none default ports are used), (full) path and query string.',
												'wp-ajaxify-comments',
											) }
											aria-required="true"
											value={ value }
											onChange={ onChange }
										/>
									</>
								) }
							/>
						</div>
						<div className="ajaxify-admin__control-row">
							<Controller
								name="asyncCommentsThreshold"
								control={ control }
								rules={ { pattern: /^[0-9]+$/ } }
								render={ ( { field: { onChange, value } } ) => (
									<>
										<TextControl
											label={ __(
												'Load Comments Async Threshold',
												'wp-ajaxify-comments',
											) }
											type="number"
											className={ classNames( 'ajaxify-admin__text-control', {
												'has-error':
													'required' === errors.asyncCommentsThreshold?.type,
												'has-error':
													'pattern' === errors.asyncCommentsThreshold?.type,
												'is-required': true,
											} ) }
											help={ __(
												'Load comments asynchronously with secondary AJAX request if more than the specified number of comments exist (0 for always load comments asynchronously). Leave empty to disable this feature.',
												'wp-ajaxify-comments',
											) }
											aria-required="true"
											value={ value }
											onChange={ onChange }
										/>
										{ 'pattern' === errors.asyncCommentsThreshold?.type && (
											<Notice
												message={ __(
													'Please enter a valid number.',
													'wp-ajaxify-comments',
												) }
												status="error"
												politeness="assertive"
												inline={ false }
												icon={ () => <AlertCircle /> }
											/>
										) }
									</>
								) }
							/>
						</div>
						<div className="ajaxify-admin__control-row">
							<Controller
								name="asyncLoadTrigger"
								control={ control }
								render={ ( { field: { onChange, value } } ) => (
									<>
										<SelectControl
											label={ __(
												'Async Comments Load Trigger',
												'wp-ajaxify-comments',
											) }
											value={ value }
											onChange={ onChange }
											options={ [
												{
													label: __( 'DomReady', 'wp-ajaxify-comments' ),
													value: 'DomReady',
												},
												{
													label: __( 'Viewport', 'wp-ajaxify-comments' ),
													value: 'Viewport',
												},
												{
													label: __( 'None', 'wp-ajaxify-comments' ),
													value: 'None',
												},
											] }
											help={ __(
												"Trigger to load comments asynchronously ('DomReady': Load comments immediately, 'Viewport': Load comments when comments container is in viewport, 'None': Comment loading is triggered manually).",
												'wp-ajaxify-comments',
											) }
										/>
									</>
								) }
							/>
						</div>
						<div className="ajaxify-admin__control-row ajaxify-admin__control-row--last">
							<Controller
								name="disableUrlUpdate"
								control={ control }
								render={ ( { field: { onChange, value } } ) => (
									<ToggleControl
										label={ __( 'Disable URL Updating', 'wp-ajaxify-comments' ) }
										checked={ value }
										onChange={ ( boolValue ) => {
											onChange( boolValue );
										} }
										help={ __(
											'URLs update as comments are posted and comments are paginated. Disable this if you want to prevent any URL re-writing.',
											'wp-ajaxify-comments',
										) }
									/>
								) }
							/>
						</div>
						<div className="ajaxify-admin__control-row ajaxify-admin__control-row--last">
							<Controller
								name="disableScrollToAnchor"
								control={ control }
								render={ ( { field: { onChange, value } } ) => (
									<ToggleControl
										label={ __(
											'Disable Scroll to Anchor',
											'wp-ajaxify-comments',
										) }
										checked={ value }
										onChange={ ( boolValue ) => {
											onChange( boolValue );
										} }
										help={ __(
											'By default, Ajaxify Comments will perform an easing scroll to the anchor in the URL location bar. Disable this if you want to prevent any scrolling.',
											'wp-ajaxify-comments',
										) }
									/>
								) }
							/>
						</div>
						<div className="ajaxify-admin__control-row ajaxify-admin__control-row--last">
							<Controller
								name="useUncompressedScripts"
								control={ control }
								render={ ( { field: { onChange, value } } ) => (
									<ToggleControl
										label={ __(
											'Use Uncompressed Scripts',
											'wp-ajaxify-comments',
										) }
										checked={ value }
										onChange={ ( boolValue ) => {
											onChange( boolValue );
										} }
										help={ __(
											'By default a compressed (and merged) JavaScript file is used, check to use uncompressed JavaScript files. Please note: If debug mode is enabled, uncompressed JavaScript files are used.',
											'wp-ajaxify-comments',
										) }
									/>
								) }
							/>
						</div>
						<div className="ajaxify-admin__control-row ajaxify-admin__control-row--last">
							<Controller
								name="alwaysIncludeScripts"
								control={ control }
								render={ ( { field: { onChange, value } } ) => (
									<>
										<ToggleControl
											label={ __(
												'Always Include Scripts',
												'wp-ajaxify-comments',
											) }
											checked={ value }
											onChange={ ( boolValue ) => {
												onChange( boolValue );
											} }
											help={ __(
												'By default JavaScript files are only included on pages where comments are enabled, check to include JavaScript files on every page. Please note: If debug mode is enabled, JavaScript files are included on every pages.',
												'wp-ajaxify-comments',
											) }
										/>
										{ data.debug && (
											<Notice
												message={ __(
													'Debug mode is enabled. Scripts will be loaded automatically when debug mode is on.',
													'wp-ajaxify-comments',
												) }
												status="info"
												politeness="assertive"
												inline={ false }
											/>
										) }
									</>
								) }
							/>
						</div>
						<div className="ajaxify-admin__control-row ajaxify-admin__control-row--last">
							<Controller
								name="placeScriptsInFooter"
								control={ control }
								render={ ( { field: { onChange, value } } ) => (
									<>
										<ToggleControl
											label={ __(
												'Place Scripts in Footer',
												'wp-ajaxify-comments',
											) }
											checked={ value }
											onChange={ ( boolValue ) => {
												onChange( boolValue );
											} }
											help={ __(
												'Load JavaScript files in the footer to improve performance. Please note: If debug mode is enabled, JavaScript files are loaded in the footer.',
												'wp-ajaxify-comments',
											) }
										/>
										{ data.debug && (
											<Notice
												message={ __(
													'Debug mode is enabled. Scripts will be loaded in the footer when debug mode is on.',
													'wp-ajaxify-comments',
												) }
												status="info"
												politeness="assertive"
												inline={ false }
											/>
										) }
									</>
								) }
							/>
						</div>
						<div className="ajaxify-admin__control-row ajaxify-admin__control-row--last">
							<Controller
								name="optimizeAjaxResponse"
								control={ control }
								render={ ( { field: { onChange, value } } ) => (
									<>
										<ToggleControl
											label={ __(
												'Optimize AJAX Response',
												'wp-ajaxify-comments',
											) }
											checked={ value }
											onChange={ ( boolValue ) => {
												onChange( boolValue );
											} }
											help={ __(
												'Check to remove unnecessary HTML content from AJAX responses to save bandwidth.',
												'wp-ajaxify-comments',
											) }
										/>
									</>
								) }
							/>
						</div>
						<div className="ajaxify-admin__control-row ajaxify-admin__control-row--last">
							<Controller
								name="baseUrl"
								control={ control }
								render={ ( { field: { onChange, value } } ) => (
									<>
										<TextControl
											label={ __( 'Base URL', 'wp-ajaxify-comments' ) }
											type="text"
											className={ classNames( 'ajaxify-admin__text-control', {
												'has-error': 'required' === errors.baseUrl?.type,
												'has-error': 'pattern' === errors.baseUrl?.type,
												'is-required': true,
											} ) }
											help={ __(
												'If you are running your Wordpress site behind a reverse proxy, set the this option to be the FQDN that the site will be accessed on (e.g. http://www.your-site.com).',
												'wp-ajaxify-comments',
											) }
											value={ value }
											onChange={ onChange }
										/>
									</>
								) }
							/>
						</div>
						<div className="ajaxify-admin__control-row ajaxify-admin__control-row--last">
							<Controller
								name="disableCache"
								control={ control }
								render={ ( { field: { onChange, value } } ) => (
									<>
										<ToggleControl
											label={ __( 'Disable Cache', 'wp-ajaxify-comments' ) }
											checked={ value }
											onChange={ ( boolValue ) => {
												onChange( boolValue );
											} }
											help={ __(
												'Check to disable client-side caching when updating comments.',
												'wp-ajaxify-comments',
											) }
										/>
									</>
								) }
							/>
						</div>
						<div className="ajaxify-admin__control-row ajaxify-admin__control-row--last">
							<Controller
								name="enableByQuery"
								control={ control }
								render={ ( { field: { onChange, value } } ) => (
									<>
										<ToggleControl
											label={ __( 'Enable by Query', 'wp-ajaxify-comments' ) }
											checked={ value }
											onChange={ ( boolValue ) => {
												onChange( boolValue );
											} }
											help={ sprintf(
												/* Translators: %s is the secret query string */
												__(
													'Check to enable the plugin by passing the (secret) query string (WPACEnable=%s)',
													'wp-ajaxify-comments',
												),
												wpacAdminAdvanced.secret,
											) }
										/>
									</>
								) }
							/>
						</div>
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
export default AdvancedScreen;
