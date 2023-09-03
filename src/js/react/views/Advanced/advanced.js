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
} from '@wordpress/components';
import { AlertCircle, Loader2, ClipboardCheck } from 'lucide-react';
import ErrorBoundary from '../../components/ErrorBoundary';
import SendCommand from '../../utils/SendCommand';
import Notice from '../../components/Notice';
import ColorPickerControl from '../../components/ColorPicker';
import AlignmentGroup from '../../components/alignment';

const retrieveAdvancedOptions = () => {
	return SendCommand('wpac_get_advanced_options', {
		nonce: wpacAdminAdvanced.getNonce,
	});
};


const AdvancedScreen = (props) => {
	const [defaults, getDefaults] = useAsyncResource(
		retrieveAdvancedOptions,
		[]
	);
	return (
		<ErrorBoundary
			fallback={
				<p>
					{__('Could not load callback options.', 'highlight-and-share')}
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
						<h2>{__('Loading Options', 'wp-ajaxify-comments')}</h2>
						<BeatLoader
							color={'#873F49'}
							loading={true}
							cssOverride={true}
							size={25}
							speedMultiplier={0.65}
						/>
					</>
				}
			>
				<Interface defaults={defaults} {...props} />
			</Suspense>
		</ErrorBoundary>
	);
};

const Interface = (props) => {
	const { defaults } = props;
	const response = defaults();
	const { data, success } = response.data;
	const [saving, setSaving] = useState(false);
	const [isSaved, setIsSaved] = useState(false);
	const [resetting, setResetting] = useState(false);
	const [isReset, setIsReset] = useState(false);

	const {
		register,
		control,
		handleSubmit,
		setValue,
		getValues,
		reset,
		setError,
		clearErrors,
	} = useForm({
		defaultValues: {
			commentPagesUrlRegex: data.commentPagesUrlRegex,
			asyncCommentsThreshold: data.asyncCommentsThreshold,
			callbackOnAfterPostComment: data.callbackOnAfterPostComment,
			callbackOnBeforeUpdateComments: data.callbackOnBeforeUpdateComments,
			callbackOnAfterUpdateComments: data.callbackOnAfterUpdateComments,
		},
	});
	console.log(data);
	const formValues = useWatch({ control });
	const { errors, isDirty, dirtyFields, touchedFields } = useFormState({
		control,
	});

	const hasErrors = () => {
		return Object.keys(errors).length > 0;
	};

	const onSubmit = (formData) => {
		setSaving(true);
		SendCommand('sce_save_comment_editing_options', {
			nonce: sceCommentEditing.save_nonce,
			...formData,
		})
			.then((ajaxResponse) => {
				const ajaxSuccess = ajaxResponse.data.success;
				if (ajaxSuccess) {
					setIsSaved(true);
					setTimeout(() => {
						setIsSaved(false);
					}, 3000);
				} else {
				}
			})
			.catch((ajaxResponse) => { })
			.then((ajaxResponse) => {
				setSaving(false);
			});
	};

	const handleReset = () => {
		setResetting(true);
		SendCommand('sce_reset_comment_editing_options', {
			nonce: sceCommentEditing.reset_nonce,
		})
			.then((ajaxResponse) => {
				const ajaxData = ajaxResponse.data.data;
				const ajaxSuccess = ajaxResponse.data.success;
				if (ajaxSuccess) {
					setIsReset(true);
					reset(ajaxData);
					setTimeout(() => {
						setIsReset(false);
					}, 3000);
				}
			})
			.catch((ajaxResponse) => { })
			.then((ajaxResponse) => {
				setResetting(false);
			});
	};

	const getSaveIcon = () => {
		if (saving) {
			return () => (<Loader2 />);
		}
		if (isSaved) {
			return () => (<ClipboardCheck />);
		}
		return false;
	};

	const getSaveText = () => {
		if (saving) {
			return __('Saving…', 'wp-ajaxify-comments');
		}
		if (isSaved) {
			return __('Saved', 'wp-ajaxify-comments');
		}
		return __('Save Options', 'wp-ajaxify-comments');
	};

	const getResetText = () => {
		if (resetting) {
			return __('Restoring Defaults…', 'wp-ajaxify-comments');
		}
		if (isReset) {
			return __('Defaults Restored', 'wp-ajaxify-comments');
		}
		return __('Restore Defaults', 'wp-ajaxify-comments');
	};

	const getCommentEditingHeader = () => {
		return (
			<>
				<h2>
					{__('Advanced', 'wp-ajaxify-comments')}
				</h2>
				<p className="description">
					{__(
						'These are advanced options for the plugin. These can alter the behavior of the plugin.',
						'wp-ajaxify-comments'
					)}
				</p>
			</>
		);
	};

	return (
		<>
			<div className="ajaxify-admin-panel-area">
				{getCommentEditingHeader()}
				<form onSubmit={handleSubmit(onSubmit)}>
				<table className="form-table form-table-row-sections">
						<tbody>
							<tr>
								<th scope="row">{__('Labels', 'wp-ajaxify-comments')}</th>
								<td>
									<div className="ajaxify-admin__control-row">
										<Controller
											name="commentPagesUrlRegex"
											control={control}
											render={({ field: { onChange, value } }) => (
												<>
													<TextControl
														label={__('Comment Pages URL Regex', 'wp-ajaxify-comments')}
														type="text"
														className={classNames('ajaxify-admin__text-control', {
															'has-error': 'required' === errors.commentPagesUrlRegex?.type,
															'has-error': 'pattern' === errors.commentPagesUrlRegex?.type,
															'is-required': true,
														})}
														help={__('Regular expression that matches URLs of all pages that support comments; leave empty to use WordPress defaults to automatically detect pages where comments are allowed. Please note: The expression is evaluated against the full page URL including schema, hostname, port number (if none default ports are used), (full) path and query string.', 'wp-ajaxify-comments')}
														aria-required="true"
														value={value}
														onChange={onChange}
													/>
												</>
											)}
										/>
									</div>
									<div className="ajaxify-admin__control-row">
										<Controller
											name="asyncCommentsThreshold"
											control={control}
											rules={{ pattern: /^[0-9]+$/ }}
											render={({ field: { onChange, value } }) => (
												<>
													<TextControl
														label={__('Load Comments Async Threshold', 'wp-ajaxify-comments')}
														type="number"
														className={classNames('ajaxify-admin__text-control', {
															'has-error': 'required' === errors.asyncCommentsThreshold?.type,
															'has-error': 'pattern' === errors.asyncCommentsThreshold?.type,
															'is-required': true,
														})}
														help={__('Load comments asynchronously with secondary AJAX request if more than the specified number of comments exist (0 for always load comments asynchronously). Leave empty to disable this feature.', 'wp-ajaxify-comments')}
														aria-required="true"
														value={value}
														onChange={onChange}
													/>
													{'pattern' === errors.asyncCommentsThreshold?.type && (
														<Notice
															message={__(
																'Please enter a valid number.',
																'wp-ajaxify-comments'
															)}
															status="error"
															politeness="assertive"
															inline={false}
															icon={() => (<AlertCircle />)}
														/>
													)}
												</>
											)}
										/>
									</div>
									<div className="ajaxify-admin__control-row">
										<Controller
											name="textReloadPage"
											control={control}
											rules={{ required: true }}
											render={({ field: { onChange, value } }) => (
												<>
													<TextControl
														label={__('Reload page', 'wp-ajaxify-comments')}
														type="text"
														className={classNames('ajaxify-admin__text-control', {
															'has-error': 'required' === errors.textReloadPage?.type,
															'has-error': 'pattern' === errors.textReloadPage?.type,
															'is-required': true,
														})}
														help={__('The text shown when the page needs to be reloaded.', 'wp-ajaxify-comments')}
														aria-required="true"
														value={value}
														onChange={onChange}
													/>
													{'required' === errors.textReloadPage?.type && (
														<Notice
															message={__(
																'This is a required field.',
																'wp-ajaxify-comments'
															)}
															status="error"
															politeness="assertive"
															inline={false}
															icon={() => (<AlertCircle />)}
														/>
													)}
												</>
											)}
										/>
									</div>
									<div className="ajaxify-admin__control-row">
										<Controller
											name="textPostComment"
											control={control}
											rules={{ required: true }}
											render={({ field: { onChange, value } }) => (
												<>
													<TextControl
														label={__('Post Comment Notification', 'wp-ajaxify-comments')}
														type="text"
														className={classNames('ajaxify-admin__text-control', {
															'has-error': 'required' === errors.textPostComment?.type,
															'has-error': 'pattern' === errors.textPostComment?.type,
															'is-required': true,
														})}
														help={__('The text shown when a comment is successfully posted.', 'wp-ajaxify-comments')}
														aria-required="true"
														value={value}
														onChange={onChange}
													/>
													{'required' === errors.textPostComment?.type && (
														<Notice
															message={__(
																'This is a required field.',
																'wp-ajaxify-comments'
															)}
															status="error"
															politeness="assertive"
															inline={false}
															icon={() => (<AlertCircle />)}
														/>
													)}
												</>
											)}
										/>
									</div>
									<div className="ajaxify-admin__control-row">
										<Controller
											name="textRefreshComments"
											control={control}
											rules={{ required: true }}
											render={({ field: { onChange, value } }) => (
												<>
													<TextControl
														label={__('Refresh Comments Status Label', 'wp-ajaxify-comments')}
														type="text"
														className={classNames('ajaxify-admin__text-control', {
															'has-error': 'required' === errors.textRefreshComments?.type,
															'has-error': 'pattern' === errors.textRefreshComments?.type,
															'is-required': true,
														})}
														help={__('The text shown when the comments are refreshing.', 'wp-ajaxify-comments')}
														aria-required="true"
														value={value}
														onChange={onChange}
													/>
													{'required' === errors.textRefreshComments?.type && (
														<Notice
															message={__(
																'This is a required field.',
																'wp-ajaxify-comments'
															)}
															status="error"
															politeness="assertive"
															inline={false}
															icon={() => (<AlertCircle />)}
														/>
													)}
												</>
											)}
										/>
									</div>
									<div className="ajaxify-admin__control-row ajaxify-admin__control-row--last">
										<Controller
											name="textUnknownError"
											control={control}
											rules={{ required: true }}
											render={({ field: { onChange, value } }) => (
												<>
													<TextControl
														label={__('Unknown Error', 'wp-ajaxify-comments')}
														type="text"
														className={classNames('ajaxify-admin__text-control', {
															'has-error': 'required' === errors.textUnknownError?.type,
															'has-error': 'pattern' === errors.textUnknownError?.type,
															'is-required': true,
														})}
														help={__('The text shown when an unknown error occurs.', 'wp-ajaxify-comments')}
														aria-required="true"
														value={value}
														onChange={onChange}
													/>
													{'required' === errors.textUnknownError?.type && (
														<Notice
															message={__(
																'This is a required field.',
																'wp-ajaxify-comments'
															)}
															status="error"
															politeness="assertive"
															inline={false}
															icon={() => (<AlertCircle />)}
														/>
													)}
												</>
											)}
										/>
									</div>
									<div className="ajaxify-admin__control-row ajaxify-admin__control-row--last">
										<Controller
											name="textErrorTypeComment"
											control={control}
											rules={{ required: true }}
											render={({ field: { onChange, value } }) => (
												<>
													<TextControl
														label={
															__('Error \'Please type a comment\':', 'wp-ajaxify-comments')
														}
														type="text"
														className={classNames('ajaxify-admin__text-control', {
															'has-error': 'required' === errors.textErrorTypeComment?.type,
															'has-error': 'pattern' === errors.textErrorTypeComment?.type,
															'is-required': true,
														})}
														help={__('The text shown when the user has not typed a comment.', 'wp-ajaxify-comments')}
														aria-required="true"
														value={value}
														onChange={onChange}
													/>
													{'required' === errors.textErrorTypeComment?.type && (
														<Notice
															message={__(
																'This is a required field.',
																'wp-ajaxify-comments'
															)}
															status="error"
															politeness="assertive"
															inline={false}
														/>
													)}
												</>
											)}
										/>
									</div>
									<div className="ajaxify-admin__control-row ajaxify-admin__control-row--last">
										<Controller
											name="textErrorCommentsClosed"
											control={control}
											rules={{ required: true }}
											render={({ field: { onChange, value } }) => (
												<>
													<TextControl
														label={
															__('Error \'Comments closed\':', 'wp-ajaxify-comments')
														}
														type="text"
														className={classNames('ajaxify-admin__text-control', {
															'has-error': 'required' === errors.textErrorCommentsClosed?.type,
															'has-error': 'pattern' === errors.textErrorCommentsClosed?.type,
															'is-required': true,
														})}
														help={__('The text shown when comments are closed.', 'wp-ajaxify-comments')}
														aria-required="true"
														value={value}
														onChange={onChange}
													/>
													{'required' === errors.textErrorCommentsClosed?.type && (
														<Notice
															message={__(
																'This is a required field.',
																'wp-ajaxify-comments'
															)}
															status="error"
															politeness="assertive"
															inline={false}
														/>
													)}
												</>
											)}
										/>
									</div>
									<div className="ajaxify-admin__control-row ajaxify-admin__control-row--last">
										<Controller
											name="textErrorMustBeLoggedIn"
											control={control}
											rules={{ required: true }}
											render={({ field: { onChange, value } }) => (
												<>
													<TextControl
														label={
															__('Error \'Must be logged in\':', 'wp-ajaxify-comments')
														}
														type="text"
														className={classNames('ajaxify-admin__text-control', {
															'has-error': 'required' === errors.textErrorMustBeLoggedIn?.type,
															'has-error': 'pattern' === errors.textErrorMustBeLoggedIn?.type,
															'is-required': true,
														})}
														help={__('The text shown when the user must be logged in to post a comment.', 'wp-ajaxify-comments')}
														aria-required="true"
														value={value}
														onChange={onChange}
													/>
													{'required' === errors.textErrorMustBeLoggedIn?.type && (
														<Notice
															message={__(
																'This is a required field.',
																'wp-ajaxify-comments'
															)}
															status="error"
														/>
													)}
												</>
											)}
										/>
									</div>
									<div className="ajaxify-admin__control-row ajaxify-admin__control-row--last">
										<Controller
											name="textErrorFillRequiredFields"
											control={control}
											rules={{ required: true }}
											render={({ field: { onChange, value } }) => (
												<>
													<TextControl
														label={
															__('Error \'Fill in required fields\':', 'wp-ajaxify-comments')
														}
														type="text"
														className={classNames('ajaxify-admin__text-control', {
															'has-error': 'required' === errors.textErrorFillRequiredFields?.type,
															'has-error': 'pattern' === errors.textErrorFillRequiredFields?.type,
															'is-required': true,
														})}
														help={__('The text shown when the user has not filled in all required fields.', 'wp-ajaxify-comments')}
														aria-required="true"
														value={value}
														onChange={onChange}
													/>
													{'required' === errors.textErrorFillRequiredFields?.type && (
														<Notice
															message={__(
																'This is a required field.',
																'wp-ajaxify-comments'
															)}
														/>
													)}
												</>
											)}
										/>
									</div>
									<div className="ajaxify-admin__control-row ajaxify-admin__control-row--last">
										<Controller
											name="textErrorInvalidEmailAddress"
											control={control}
											rules={{ required: true }}
											render={({ field: { onChange, value } }) => (
												<>
													<TextControl
														className={classNames('ajaxify-admin__text-control', {
															'has-error': 'required' === errors.textErrorInvalidEmailAddress?.type,
															'has-error': 'pattern' === errors.textErrorInvalidEmailAddress?.type,
															'is-required': true,
														})}
														label={
															__('Error \'Invalid email address\':', 'wp-ajaxify-comments')
														}
														type="text"
														help={__('The text shown when the user has not entered a valid email address.', 'wp-ajaxify-comments')}
														aria-required="true"
														value={value}
														onChange={onChange}
													/>
													{'required' === errors.textErrorInvalidEmailAddress?.type && (
														<Notice
															message={__(
																'This is a required field.',
																'wp-ajaxify-comments'
															)}
														/>
													)}
												</>
											)}
										/>
									</div>
									<div className="ajaxify-admin__control-row ajaxify-admin__control-row--last">
										<Controller
											name="textErrorPostTooQuickly"
											control={control}
											rules={{ required: true }}
											render={({ field: { onChange, value } }) => (
												<>
													<TextControl
													
														label={
															__('Error \'Post too quickly\':', 'wp-ajaxify-comments')
														}
														type="text"
														className={classNames('ajaxify-admin__text-control', {
															'has-error': 'required' === errors.textErrorPostTooQuickly?.type,
															'has-error': 'pattern' === errors.textErrorPostTooQuickly?.type,
															'is-required': true,
														})}
														help={__('The text shown when the user is posting comments too quickly.', 'wp-ajaxify-comments')}
														aria-required="true"
														value={value}
														onChange={onChange}
													/>
													{'required' === errors.textErrorPostTooQuickly?.type && (
														<Notice
															message={__(
																'This is a required field.',
																'wp-ajaxify-comments'
															)}
														/>
													)}
												</>
											)}
										/>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
					<div className="ajaxify-admin-buttons">
						<Button
							className={classNames(
								'ajaxify__btn ajaxify__btn-primary ajaxify__btn--icon-right',
								{ 'has-error': hasErrors() },
								{ 'has-icon': saving || isSaved },
								{ 'is-saving': saving && !isSaved },
								{ 'is-saved': isSaved }
							)}
							type="submit"
							text={getSaveText()}
							icon={getSaveIcon()}
							iconSize="18"
							iconPosition="right"
							disabled={saving}
						/>
						<Button
							className={classNames(
								'ajaxify__btn ajaxify__btn-danger ajaxify__btn--icon-right',
								{ 'has-icon': resetting },
								{ 'is-resetting': { resetting } }
							)}
							type="button"
							text={getResetText()}
							icon={resetting ? Spinner : false}
							iconSize="18"
							iconPosition="right"
							disabled={saving || resetting}
							onClick={(e) => {
								setResetting(true);
								handleReset(e);
							}}
						/>
					</div>
					{hasErrors() && (
						<Notice
							message={__(
								'There are form validation errors. Please correct them above.',
								'wp-ajaxify-comments'
							)}
							status="error"
							politeness="polite"
						/>
					)}
					{isSaved && (
						<Notice
							message={__('Your settings have been saved.', 'wp-ajaxify-comments')}
							status="success"
							politeness="assertive"
						/>
					)}
					{isReset && (
						<Notice
							message={__('Your settings have been reset.', 'wp-ajaxify-comments')}
							status="success"
							politeness="assertive"
						/>
					)}
				</form>
			</div>

		</>
	);
};
export default AdvancedScreen;
