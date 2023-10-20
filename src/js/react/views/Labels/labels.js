/* eslint-disable no-unused-vars */
import React, { useState, Suspense, useEffect } from 'react';
import { useForm, Controller, useWatch, useFormState } from 'react-hook-form';
import classNames from 'classnames';
import { useAsyncResource } from 'use-async-resource';
import { __, sprintf } from '@wordpress/i18n';
import BeatLoader from 'react-spinners/BeatLoader';

import {
	TextControl,
} from '@wordpress/components';
import { AlertCircle } from 'lucide-react';
import ErrorBoundary from '../../components/ErrorBoundary';
import SendCommand from '../../utils/SendCommand';
import Notice from '../../components/Notice';
import SaveResetButtons from '../../components/SaveResetButtons';

const retrieveLabelOptions = () => {
	return SendCommand( 'wpac_get_labels_options', {
		nonce: wpacAdminLabels.getNonce,
	} );
};

const LabelsScreen = ( props ) => {
	const [ defaults, getDefaults ] = useAsyncResource(
		retrieveLabelOptions,
		[],
	);
	return (
		<ErrorBoundary
			fallback={
				<p>
					{ __( 'Could not load labels options.', 'highlight-and-share' ) }
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
			textPosted: data.textPosted,
			textPostedUnapproved: data.textPostedUnapproved,
			textReloadPage: data.textReloadPage,
			textPostComment: data.textPostComment,
			textRefreshComments: data.textRefreshComments,
			textUnknownError: data.textUnknownError,
			textErrorTypeComment: data.textErrorTypeComment,
			textErrorCommentsClosed: data.textErrorCommentsClosed,
			textErrorMustBeLoggedIn: data.textErrorMustBeLoggedIn,
			textErrorFillRequiredFields: data.textErrorFillRequiredFields,
			textErrorInvalidEmailAddress: data.textErrorInvalidEmailAddress,
			textErrorPostTooQuickly: data.textErrorPostTooQuickly,
			textErrorDuplicateComment: data.textErrorDuplicateComment,
			saveNonce: wpacAdminLabels.saveNonce,
			resetNonce: wpacAdminLabels.resetNonce,
			caller: 'labels',
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
				<h2>
					{ __( 'Labels', 'wp-ajaxify-comments' ) }
				</h2>
				<p className="description">
					{ __(
						'Adjust the labels that are shown to the user.',
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
					<table className="form-table form-table-row-sections">
						<tbody>
							<tr>
								<th scope="row">{ __( 'Labels', 'wp-ajaxify-comments' ) }</th>
								<td>
									<div className="ajaxify-admin__control-row">
										<Controller
											name="textPosted"
											control={ control }
											rules={ { required: true } }
											render={ ( { field: { onChange, value } } ) => (
												<>
													<TextControl
														label={ __( 'Comment posted', 'wp-ajaxify-comments' ) }
														type="text"
														className={ classNames( 'ajaxify-admin__text-control', {
															'has-error': 'required' === errors.textPosted?.type || 'pattern' === errors.textPosted?.type,
															'is-required': true,
														} ) }
														help={ __( 'The text shown when a comment has been posted.', 'wp-ajaxify-comments' ) }
														aria-required="true"
														value={ value }
														onChange={ onChange }
													/>
													{ 'required' === errors.textPosted?.type && (
														<Notice
															message={ __(
																'This is a required field.',
																'wp-ajaxify-comments',
															) }
															status="error"
															politeness="assertive"
															inline={ false }
															icon={ () => ( <AlertCircle /> ) }
														/>
													) }
												</>
											) }
										/>
									</div>
									<div className="ajaxify-admin__control-row">
										<Controller
											name="textPostedUnapproved"
											control={ control }
											rules={ { required: true } }
											render={ ( { field: { onChange, value } } ) => (
												<>
													<TextControl
														label={ __( 'Comment posted (unapproved)', 'wp-ajaxify-comments' ) }
														type="text"
														className={ classNames( 'ajaxify-admin__text-control', {
															'has-error': 'required' === errors.textPostedUnapproved?.type || 'pattern' === errors.textPostedUnapproved?.type,
															'is-required': true,
														} ) }
														help={ __( 'The text shown when a comment has been posted but is unapproved.', 'wp-ajaxify-comments' ) }
														aria-required="true"
														value={ value }
														onChange={ onChange }
													/>
													{ 'required' === errors.textPostedUnapproved?.type && (
														<Notice
															message={ __(
																'This is a required field.',
																'wp-ajaxify-comments',
															) }
															status="error"
															politeness="assertive"
															inline={ false }
															icon={ () => ( <AlertCircle /> ) }
														/>
													) }
												</>
											) }
										/>
									</div>
									<div className="ajaxify-admin__control-row">
										<Controller
											name="textReloadPage"
											control={ control }
											rules={ { required: true } }
											render={ ( { field: { onChange, value } } ) => (
												<>
													<TextControl
														label={ __( 'Reload page', 'wp-ajaxify-comments' ) }
														type="text"
														className={ classNames( 'ajaxify-admin__text-control', {
															'has-error': 'required' === errors.textReloadPage?.type || 'pattern' === errors.textReloadPage?.type,
															'is-required': true,
														} ) }
														help={ __( 'The text shown when the page needs to be reloaded.', 'wp-ajaxify-comments' ) }
														aria-required="true"
														value={ value }
														onChange={ onChange }
													/>
													{ 'required' === errors.textReloadPage?.type && (
														<Notice
															message={ __(
																'This is a required field.',
																'wp-ajaxify-comments',
															) }
															status="error"
															politeness="assertive"
															inline={ false }
															icon={ () => ( <AlertCircle /> ) }
														/>
													) }
												</>
											) }
										/>
									</div>
									<div className="ajaxify-admin__control-row">
										<Controller
											name="textPostComment"
											control={ control }
											rules={ { required: true } }
											render={ ( { field: { onChange, value } } ) => (
												<>
													<TextControl
														label={ __( 'Post Comment Notification', 'wp-ajaxify-comments' ) }
														type="text"
														className={ classNames( 'ajaxify-admin__text-control', {
															'has-error': 'required' === errors.textPostComment?.type || 'pattern' === errors.textPostComment?.type,
															'is-required': true,
														} ) }
														help={ __( 'The text shown when a comment is successfully posted.', 'wp-ajaxify-comments' ) }
														aria-required="true"
														value={ value }
														onChange={ onChange }
													/>
													{ 'required' === errors.textPostComment?.type && (
														<Notice
															message={ __(
																'This is a required field.',
																'wp-ajaxify-comments',
															) }
															status="error"
															politeness="assertive"
															inline={ false }
															icon={ () => ( <AlertCircle /> ) }
														/>
													) }
												</>
											) }
										/>
									</div>
									<div className="ajaxify-admin__control-row">
										<Controller
											name="textRefreshComments"
											control={ control }
											rules={ { required: true } }
											render={ ( { field: { onChange, value } } ) => (
												<>
													<TextControl
														label={ __( 'Refresh Comments Status Label', 'wp-ajaxify-comments' ) }
														type="text"
														className={ classNames( 'ajaxify-admin__text-control', {
															'has-error': 'required' === errors.textRefreshComments?.type || 'pattern' === errors.textRefreshComments?.type,
															'is-required': true,
														} ) }
														help={ __( 'The text shown when the comments are refreshing.', 'wp-ajaxify-comments' ) }
														aria-required="true"
														value={ value }
														onChange={ onChange }
													/>
													{ 'required' === errors.textRefreshComments?.type && (
														<Notice
															message={ __(
																'This is a required field.',
																'wp-ajaxify-comments',
															) }
															status="error"
															politeness="assertive"
															inline={ false }
															icon={ () => ( <AlertCircle /> ) }
														/>
													) }
												</>
											) }
										/>
									</div>
									<div className="ajaxify-admin__control-row ajaxify-admin__control-row--last">
										<Controller
											name="textUnknownError"
											control={ control }
											rules={ { required: true } }
											render={ ( { field: { onChange, value } } ) => (
												<>
													<TextControl
														label={ __( 'Unknown Error', 'wp-ajaxify-comments' ) }
														type="text"
														className={ classNames( 'ajaxify-admin__text-control', {
															'has-error': 'required' === errors.textUnknownError?.type || 'pattern' === errors.textUnknownError?.type,
															'is-required': true,
														} ) }
														help={ __( 'The text shown when an unknown error occurs.', 'wp-ajaxify-comments' ) }
														aria-required="true"
														value={ value }
														onChange={ onChange }
													/>
													{ 'required' === errors.textUnknownError?.type && (
														<Notice
															message={ __(
																'This is a required field.',
																'wp-ajaxify-comments',
															) }
															status="error"
															politeness="assertive"
															inline={ false }
															icon={ () => ( <AlertCircle /> ) }
														/>
													) }
												</>
											) }
										/>
									</div>
									<div className="ajaxify-admin__control-row ajaxify-admin__control-row--last">
										<Controller
											name="textErrorTypeComment"
											control={ control }
											rules={ { required: true } }
											render={ ( { field: { onChange, value } } ) => (
												<>
													<TextControl
														label={
															__( 'Error \'Please type a comment\':', 'wp-ajaxify-comments' )
														}
														type="text"
														className={ classNames( 'ajaxify-admin__text-control', {
															'has-error': 'required' === errors.textErrorTypeComment?.type || 'pattern' === errors.textErrorTypeComment?.type,
															'is-required': true,
														} ) }
														help={ __( 'The text shown when the user has not typed a comment.', 'wp-ajaxify-comments' ) }
														aria-required="true"
														value={ value }
														onChange={ onChange }
													/>
													{ 'required' === errors.textErrorTypeComment?.type && (
														<Notice
															message={ __(
																'This is a required field.',
																'wp-ajaxify-comments',
															) }
															status="error"
															politeness="assertive"
															inline={ false }
															icon={ () => ( <AlertCircle /> ) }
														/>
													) }
												</>
											) }
										/>
									</div>
									<div className="ajaxify-admin__control-row ajaxify-admin__control-row--last">
										<Controller
											name="textErrorCommentsClosed"
											control={ control }
											rules={ { required: true } }
											render={ ( { field: { onChange, value } } ) => (
												<>
													<TextControl
														label={
															__( 'Error \'Comments closed\':', 'wp-ajaxify-comments' )
														}
														type="text"
														className={ classNames( 'ajaxify-admin__text-control', {
															'has-error': 'required' === errors.textErrorCommentsClosed?.type || 'pattern' === errors.textErrorCommentsClosed?.type,
															'is-required': true,
														} ) }
														help={ __( 'The text shown when comments are closed.', 'wp-ajaxify-comments' ) }
														aria-required="true"
														value={ value }
														onChange={ onChange }
													/>
													{ 'required' === errors.textErrorCommentsClosed?.type && (
														<Notice
															message={ __(
																'This is a required field.',
																'wp-ajaxify-comments',
															) }
															status="error"
															politeness="assertive"
															inline={ false }
															icon={ () => ( <AlertCircle /> ) }
														/>
													) }
												</>
											) }
										/>
									</div>
									<div className="ajaxify-admin__control-row ajaxify-admin__control-row--last">
										<Controller
											name="textErrorMustBeLoggedIn"
											control={ control }
											rules={ { required: true } }
											render={ ( { field: { onChange, value } } ) => (
												<>
													<TextControl
														label={
															__( 'Error \'Must be logged in\':', 'wp-ajaxify-comments' )
														}
														type="text"
														className={ classNames( 'ajaxify-admin__text-control', {
															'has-error': 'required' === errors.textErrorMustBeLoggedIn?.type || 'pattern' === errors.textErrorMustBeLoggedIn?.type,
															'is-required': true,
														} ) }
														help={ __( 'The text shown when the user must be logged in to post a comment.', 'wp-ajaxify-comments' ) }
														aria-required="true"
														value={ value }
														onChange={ onChange }
													/>
													{ 'required' === errors.textErrorMustBeLoggedIn?.type && (
														<Notice
															message={ __(
																'This is a required field.',
																'wp-ajaxify-comments',
															) }
															status="error"
															politeness="assertive"
															icon={ () => ( <AlertCircle /> ) }
														/>
													) }
												</>
											) }
										/>
									</div>
									<div className="ajaxify-admin__control-row ajaxify-admin__control-row--last">
										<Controller
											name="textErrorFillRequiredFields"
											control={ control }
											rules={ { required: true } }
											render={ ( { field: { onChange, value } } ) => (
												<>
													<TextControl
														label={
															__( 'Error \'Fill in required fields\':', 'wp-ajaxify-comments' )
														}
														type="text"
														className={ classNames( 'ajaxify-admin__text-control', {
															'has-error': 'required' === errors.textErrorFillRequiredFields?.type || 'pattern' === errors.textErrorFillRequiredFields?.type,
															'is-required': true,
														} ) }
														help={ __( 'The text shown when the user has not filled in all required fields.', 'wp-ajaxify-comments' ) }
														aria-required="true"
														value={ value }
														onChange={ onChange }
													/>
													{ 'required' === errors.textErrorFillRequiredFields?.type && (
														<Notice
															message={ __(
																'This is a required field.',
																'wp-ajaxify-comments',
															) }
															status="error"
															politeness="assertive"
															icon={ () => ( <AlertCircle /> ) }
														/>
													) }
												</>
											) }
										/>
									</div>
									<div className="ajaxify-admin__control-row ajaxify-admin__control-row--last">
										<Controller
											name="textErrorInvalidEmailAddress"
											control={ control }
											rules={ { required: true } }
											render={ ( { field: { onChange, value } } ) => (
												<>
													<TextControl
														className={ classNames( 'ajaxify-admin__text-control', {
															'has-error': 'required' === errors.textErrorInvalidEmailAddress?.type || 'pattern' === errors.textErrorInvalidEmailAddress?.type,
															'is-required': true,
														} ) }
														label={
															__( 'Error \'Invalid email address\':', 'wp-ajaxify-comments' )
														}
														type="text"
														help={ __( 'The text shown when the user has not entered a valid email address.', 'wp-ajaxify-comments' ) }
														aria-required="true"
														value={ value }
														onChange={ onChange }
													/>
													{ 'required' === errors.textErrorInvalidEmailAddress?.type && (
														<Notice
															message={ __(
																'This is a required field.',
																'wp-ajaxify-comments',
															) }
															status="error"
															politeness="assertive"
															icon={ () => ( <AlertCircle /> ) }
														/>
													) }
												</>
											) }
										/>
									</div>
									<div className="ajaxify-admin__control-row ajaxify-admin__control-row--last">
										<Controller
											name="textErrorPostTooQuickly"
											control={ control }
											rules={ { required: true } }
											render={ ( { field: { onChange, value } } ) => (
												<>
													<TextControl

														label={
															__( 'Error \'Post too quickly\':', 'wp-ajaxify-comments' )
														}
														type="text"
														className={ classNames( 'ajaxify-admin__text-control', {
															'has-error': 'required' === errors.textErrorPostTooQuickly?.type || 'pattern' === errors.textErrorPostTooQuickly?.type,
															'is-required': true,
														} ) }
														help={ __( 'The text shown when the user is posting comments too quickly.', 'wp-ajaxify-comments' ) }
														aria-required="true"
														value={ value }
														onChange={ onChange }
													/>
													{ 'required' === errors.textErrorPostTooQuickly?.type && (
														<Notice
															message={ __(
																'This is a required field.',
																'wp-ajaxify-comments',
															) }
															status="error"
															politeness="assertive"
															icon={ () => ( <AlertCircle /> ) }
														/>
													) }
												</>
											) }
										/>
									</div>
									<div className="ajaxify-admin__control-row ajaxify-admin__control-row--last">
										<Controller
											name="textErrorDuplicateComment"
											control={ control }
											rules={ { required: true } }
											render={ ( { field: { onChange, value } } ) => (
												<>
													<TextControl
														label={
															__( 'Error \'Duplicate comment\':', 'wp-ajaxify-comments' )
														}
														type="text"
														className={ classNames( 'ajaxify-admin__text-control', {
															'has-error': 'required' === errors.textErrorDuplicateComment?.type || 'pattern' === errors.textErrorDuplicateComment?.type,
															'is-required': true,
														} ) }
														help={ __( 'The text shown when the user has posted a duplicate comment.', 'wp-ajaxify-comments' ) }
														aria-required="true"
														value={ value }
														onChange={ onChange }
													/>
													{ 'required' === errors.textErrorDuplicateComment?.type && (
														<Notice
															message={ __(
																'This is a required field.',
																'wp-ajaxify-comments',
															) }
															status="error"
															politeness="assertive"
															icon={ () => ( <AlertCircle /> ) }
														/>
													) }
												</>
											) }
										/>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
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
export default LabelsScreen;
