/* eslint-disable no-unused-vars */
import React, { useState, Suspense, useEffect } from 'react';
import { useForm, Controller, useWatch, useFormState } from 'react-hook-form';
import classNames from 'classnames';
import { useAsyncResource } from 'use-async-resource';
import { __, sprintf } from '@wordpress/i18n';
import BeatLoader from 'react-spinners/BeatLoader';

import {
	TextareaControl,
	Button,
} from '@wordpress/components';
import { AlertCircle, Loader2, ClipboardCheck } from 'lucide-react';
import ErrorBoundary from '../../components/ErrorBoundary';
import SendCommand from '../../utils/SendCommand';
import Notice from '../../components/Notice';
import SaveResetButtons from '../../components/SaveResetButtons';

const retrieveCallbackOptions = () => {
	return SendCommand( 'wpac_get_callbacks_options', {
		nonce: wpacAdminCallbacks.getNonce,
	} );
};

const CallbacksScreen = ( props ) => {
	const [ defaults, getDefaults ] = useAsyncResource(
		retrieveCallbackOptions,
		[],
	);
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
			callbackOnBeforeSelectElements: data.callbackOnBeforeSelectElements,
			callbackOnBeforeSubmitComment: data.callbackOnBeforeSubmitComment,
			callbackOnAfterPostComment: data.callbackOnAfterPostComment,
			callbackOnBeforeUpdateComments: data.callbackOnBeforeUpdateComments,
			callbackOnAfterUpdateComments: data.callbackOnAfterUpdateComments,
			saveNonce: wpacAdminCallbacks.saveNonce,
			resetNonce: wpacAdminCallbacks.resetNonce,
			caller: 'callbacks',
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
		onSave( formData, setError );
	};

	const getCommentEditingHeader = () => {
		return (
			<>
				<h2>
					{ __( 'Callbacks', 'wp-ajaxify-comments' ) }
				</h2>
				<p className="description">
					{ __(
						'Callbacks allow you to run custom JavaScript code (including calling your own functions) at various points in the comment posting process.',
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
								name="callbackOnBeforeSelectElements"
								control={ control }
								render={ ( { field: { onChange, value } } ) => (
									<>
										<TextareaControl
											label={ __( 'OnBeforeSelectElements Callback', 'wp-ajaxify-comments' ) }
											type="text"
											className={ classNames( 'ajaxify-admin__textarea-control ajaxify-admin__js-label', {
												'has-error': 'required' === errors.callbackOnBeforeSelectElements?.type,
												'has-error': 'pattern' === errors.callbackOnBeforeSelectElements?.type,
												'is-required': true,
											} ) }
											help={ __( 'Parameter: dom (jQuery DOM element)', 'wp-ajaxify-comments' ) }
											value={ value }
											onChange={ onChange }
											style={ { whiteSpace: 'pre-line' } }
										/>
									</>
								) }
							/>
						</div>
						<div className="ajaxify-admin__control-row">
							<Controller
								name="callbackOnBeforeSubmitComment"
								control={ control }
								render={ ( { field: { onChange, value } } ) => (
									<>
										<TextareaControl
											label={ __( 'OnBeforeSubmitComment Callback', 'wp-ajaxify-comments' ) }
											type="text"
											className={ classNames( 'ajaxify-admin__textarea-control ajaxify-admin__js-label', {
												'has-error': 'required' === errors.callbackOnBeforeSubmitComment?.type,
												'has-error': 'pattern' === errors.callbackOnBeforeSubmitComment?.type,
												'is-required': true,
											} ) }
											help={ __( 'Callback before a commment is submitted.', 'wp-ajaxify-comments' ) }
											value={ value }
											onChange={ onChange }
											style={ { whiteSpace: 'pre-line' } }
										/>
									</>
								) }
							/>
						</div>
						<div className="ajaxify-admin__control-row">
							<Controller
								name="callbackOnAfterPostComment"
								control={ control }
								render={ ( { field: { onChange, value } } ) => (
									<>
										<TextareaControl
											label={ __( 'OnAfterPostComment Callback', 'wp-ajaxify-comments' ) }
											type="text"
											className={ classNames( 'ajaxify-admin__textarea-control ajaxify-admin__js-label', {
												'has-error': 'required' === errors.callbackOnAfterPostComment?.type,
												'has-error': 'pattern' === errors.callbackOnAfterPostComment?.type,
												'is-required': true,
											} ) }
											help={ __( 'Parameter: commentUrl (string), unapproved (boolean)', 'wp-ajaxify-comments' ) }
											value={ value }
											onChange={ onChange }
											style={ { whiteSpace: 'pre-line' } }
										/>
									</>
								) }
							/>
						</div>
						<div className="ajaxify-admin__control-row">
							<Controller
								name="callbackOnBeforeUpdateComments"
								control={ control }
								render={ ( { field: { onChange, value } } ) => (
									<>
										<TextareaControl
											label={ __( 'OnBeforeUpdateComments Callback', 'wp-ajaxify-comments' ) }
											type="text"
											className={ classNames( 'ajaxify-admin__textarea-control ajaxify-admin__js-label', {
												'has-error': 'required' === errors.callbackOnBeforeUpdateComments?.type,
												'has-error': 'pattern' === errors.callbackOnBeforeUpdateComments?.type,
												'is-required': true,
											} ) }
											help={ __( 'Parameters: newDom (jQuery DOM element), commentUrl (string)', 'wp-ajaxify-comments' ) }
											value={ value }
											onChange={ onChange }
											style={ { whiteSpace: 'pre-line' } }
										/>
									</>
								) }
							/>
						</div>
						<div className="ajaxify-admin__control-row">
							<Controller
								name="callbackOnAfterUpdateComments"
								control={ control }
								render={ ( { field: { onChange, value } } ) => (
									<>
										<TextareaControl
											label={ __( 'OnAfterUpdateComments Callback', 'wp-ajaxify-comments' ) }
											type="text"
											className={ classNames( 'ajaxify-admin__textarea-control ajaxify-admin__js-label', {
												'has-error': 'required' === errors.callbackOnAfterUpdateComments?.type,
												'has-error': 'pattern' === errors.callbackOnAfterUpdateComments?.type,
												'is-required': true,
											} ) }
											help={ __( 'Parameters: newDom (jQuery DOM element), commentUrl (string)', 'wp-ajaxify-comments' ) }
											value={ value }
											onChange={ onChange }
											style={ { whiteSpace: 'pre-line' } }
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
export default CallbacksScreen;
