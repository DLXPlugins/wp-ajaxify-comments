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
	ToggleControl,
	SelectControl,
	RadioControl,
} from '@wordpress/components';
import { AlertCircle, Loader2, ClipboardCheck } from 'lucide-react';
import ErrorBoundary from '../../components/ErrorBoundary';
import SendCommand from '../../utils/SendCommand';
import Notice from '../../components/Notice';

const retrieveSelectorOptions = () => {
	return SendCommand('wpac_get_selectors_options', {
		nonce: wpacAdminSelectors.getNonce,
	});
};

const cssRegex = /^(?:(?:\*|(?:[a-z0-9_-]+(?:\|[a-z0-9_-]+)?))|\[(?:[a-z0-9_-]+)(?:=[\'"]?(.*?)[\'"]?)?\]|#[a-z0-9_-]+|\.(?:[a-z0-9_-]+))+(?:\s*,\s*(?:(?:\*|(?:[a-z0-9_-]+(?:\|[a-z0-9_-]+)?))|\[(?:[a-z0-9_-]+)(?:=[\'"]?(.*?)[\'"]?)?\]|#[a-z0-9_-]+|\.(?:[a-z0-9_-]+))+)*/i;

const SelectorsScreen = (props) => {
	const [defaults, getDefaults] = useAsyncResource(
		retrieveSelectorOptions,
		[]
	);
	return (
		<ErrorBoundary
			fallback={
				<p>
					{__('Could not load Selector options.', 'highlight-and-share')}
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
			menuHelper: data.menuHelper,
			selectorCommentForm: data.selectorCommentForm,
			selectorCommentsContainer: data.selectorCommentsContainer,
			selectorCommentList: data.selectorCommentList,
			selectorCommentPagingLinks: data.selectorCommentPagingLinks,
			selectorCommentLinks: data.selectorCommentLinks,
			selectorRespondContainer: data.selectorRespondContainer,
			selectorErrorContainer: data.selectorErrorContainer,
			selectorSubmitButton: data.selectorSubmitButton,
			selectorTextarea: data.selectorTextarea,
			selectorPostContainer: data.selectorPostContainer,
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
					{__('JavaScript Selectors', 'wp-ajaxify-comments')}
				</h2>
				<p className="description">
					{__(
						'Ajaxify Comments needs some information about your comment section in order to work properly. Please enter the CSS selectors for the following elements.',
						'wp-ajaxify-comments'
					)}
				</p>
			</>
		);
	};

	console.log(errors.selectorCommentForm);

	return (
		<>
			<div className="ajaxify-admin-panel-area">
				{getCommentEditingHeader()}
				<form onSubmit={handleSubmit(onSubmit)}>
					<table className="form-table form-table-row-sections">
						<tbody>
							<tr>
								<th scope="row">{__('Menu Helper', 'wp-ajaxify-comments')}</th>
								<td>
									<Controller
										name="menuHelper"
										control={control}
										render={({ field: { onChange, value } }) => (
											<ToggleControl
												label={__('Enable Menu Helper', 'wp-ajaxify-comments')}
												checked={value}
												onChange={(boolValue) => {
													onChange(boolValue);
												}}
												help={__(
													'Enable menu helper to enable a helper in the admin menu in order to evaluate a comments page for the selectors needed.',
													'wp-ajaxify-comments'
												)}
											/>
										)}
									/>
								</td>
							</tr>
							<tr>
								<th scope="row">{__('Comment Section Selectors', 'wp-ajaxify-comments')}</th>
								<td>
									<div className="ajaxify-admin__control-row">
										<Controller
											name="selectorCommentsContainer"
											control={control}
											rules={{ required: true, pattern: cssRegex }}
											render={({ field: { onChange, value } }) => (
												<>
													<TextControl
														label={__('Comments Container', 'wp-ajaxify-comments')}
														type="text"
														className={classNames('ajaxify-admin__text-control', {
															'has-error': 'required' === errors.selectorCommentsContainer?.type,
															'has-error': 'pattern' === errors.selectorCommentsContainer?.type,
															'is-required': true,
														})}
														help={__('The CSS selector for Comments container.', 'wp-ajaxify-comments')}
														aria-required="true"
														value={value}
														onChange={onChange}
													/>
													{'pattern' === errors.selectorCommentsContainer?.type && (
														<Notice
															message={__(
																'Please use valid comma-separated CSS selectors.',
																'wp-ajaxify-comments'
															)}
															status="error"
															politeness="assertive"
															inline={false}
															icon={() => (<AlertCircle />)}
														/>
													)}
													{'required' === errors.selectorCommentsContainer?.type && (
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
											name="selectorCommentList"
											control={control}
											rules={{ required: true, pattern: cssRegex }}
											render={({ field: { onChange, value } }) => (
												<>
													<TextControl
														label={__('Comments List', 'wp-ajaxify-comments')}
														type="text"
														className={classNames('ajaxify-admin__text-control', {
															'has-error': 'required' === errors.selectorCommentList?.type,
															'has-error': 'pattern' === errors.selectorCommentList?.type,
															'is-required': true,
														})}
														help={__('The CSS selector for the comments list wrapper.', 'wp-ajaxify-comments')}
														aria-required="true"
														value={value}
														onChange={onChange}
													/>
													{'pattern' === errors.selectorCommentList?.type && (
														<Notice
															message={__(
																'Please use valid comma-separated CSS selectors.',
																'wp-ajaxify-comments'
															)}
															status="error"
															politeness="assertive"
															inline={false}
															icon={() => (<AlertCircle />)}
														/>
													)}
													{'required' === errors.selectorCommentList?.type && (
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
											name="selectorCommentForm"
											control={control}
											rules={{ required: true, pattern: cssRegex }}
											render={({ field: { onChange, value } }) => (
												<>
													<TextControl
														label={__('Comment Form', 'wp-ajaxify-comments')}
														type="text"
														className={classNames('ajaxify-admin__text-control', {
															'has-error': 'required' === errors.selectorCommentForm?.type,
															'has-error': 'pattern' === errors.selectorCommentForm?.type,
															'is-required': true,
														})}
														help={__('The CSS selector for the comment form. Can be comma separated.', 'wp-ajaxify-comments')}
														aria-required="true"
														value={value}
														onChange={onChange}
													/>
													{'pattern' === errors.selectorCommentForm?.type && (
														<Notice
															message={__(
																'Please use valid comma-separated CSS selectors.',
																'wp-ajaxify-comments'
															)}
															status="error"
															politeness="assertive"
															inline={false}
															icon={() => (<AlertCircle />)}
														/>
													)}
													{'required' === errors.selectorCommentForm?.type && (
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
											name="selectorRespondContainer"
											control={control}
											rules={{ required: true, pattern: cssRegex }}
											render={({ field: { onChange, value } }) => (
												<>
													<TextControl
														label={__('Respond Textarea Selector', 'wp-ajaxify-comments')}
														type="text"
														className={classNames('ajaxify-admin__text-control', {
															'has-error': 'required' === errors.selectorRespondContainer?.type,
															'has-error': 'pattern' === errors.selectorRespondContainer?.type,
															'is-required': true,
														})}
														help={__('The CSS selector for the Respond textarea.', 'wp-ajaxify-comments')}
														aria-required="true"
														value={value}
														onChange={onChange}
													/>
													{'pattern' === errors.selectorRespondContainer?.type && (
														<Notice
															message={__(
																'Please use valid comma-separated CSS selectors.',
																'wp-ajaxify-comments'
															)}
															status="error"
															politeness="assertive"
															inline={false}
															icon={() => (<AlertCircle />)}
														/>
													)}
													{'required' === errors.selectorRespondContainer?.type && (
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
											name="selectorTextarea"
											control={control}
											rules={{ required: true, pattern: cssRegex }}
											render={({ field: { onChange, value } }) => (
												<>
													<TextControl
														label={__('Comment Textarea Selector', 'wp-ajaxify-comments')}
														type="text"
														className={classNames('ajaxify-admin__text-control', {
															'has-error': 'required' === errors.selectorTextarea?.type,
															'has-error': 'pattern' === errors.selectorTextarea?.type,
															'is-required': true,
														})}
														help={__('The CSS selector for the main comment textarea.', 'wp-ajaxify-comments')}
														aria-required="true"
														value={value}
														onChange={onChange}
													/>
													{'pattern' === errors.selectorTextarea?.type && (
														<Notice
															message={__(
																'Please use valid comma-separated CSS selectors.',
																'wp-ajaxify-comments'
															)}
															status="error"
															politeness="assertive"
															inline={false}
															icon={() => (<AlertCircle />)}
														/>
													)}
													{'required' === errors.selectorTextarea?.type && (
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
											name="selectorSubmitButton"
											control={control}
											rules={{ required: true, pattern: cssRegex }}
											render={({ field: { onChange, value } }) => (
												<>
													<TextControl
														label={__('Comment Submit Button Selector', 'wp-ajaxify-comments')}
														type="text"
														className={classNames('ajaxify-admin__text-control', {
															'has-error': 'required' === errors.selectorSubmitButton?.type,
															'has-error': 'pattern' === errors.selectorSubmitButton?.type,
															'is-required': true,
														})}
														help={__('The CSS selector for the comment submit button.', 'wp-ajaxify-comments')}
														aria-required="true"
														value={value}
														onChange={onChange}
													/>
													{'pattern' === errors.selectorSubmitButton?.type && (
														<Notice
															message={__(
																'Please use valid comma-separated CSS selectors.',
																'wp-ajaxify-comments'
															)}
															status="error"
															politeness="assertive"
															inline={false}
															icon={() => (<AlertCircle />)}
														/>
													)}
													{'required' === errors.selectorSubmitButton?.type && (
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
								</td>
							</tr>
							<tr>
								<th scope="row">{__('Advanced Selectors', 'wp-ajaxify-comments')}</th>
								<td>
									<div className="ajaxify-admin__control-row">
										<Controller
											name="selectorCommentPagingLinks"
											control={control}
											rules={{ required: true }}
											render={({ field: { onChange, value } }) => (
												<>
													<TextControl
														label={__('Paging Links Selector', 'wp-ajaxify-comments')}
														type="text"
														className={classNames('ajaxify-admin__text-control', {
															'has-error': 'required' === errors.selectorCommentPagingLinks?.type,
															'has-error': 'pattern' === errors.selectorCommentPagingLinks?.type,
															'is-required': true,
														})}
														help={__('Comment paging links selector for Ajax pagination.', 'wp-ajaxify-comments')}
														aria-required="true"
														value={value}
														onChange={onChange}
													/>
													{'required' === errors.selectorCommentPagingLinks?.type && (
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
											name="selectorCommentLinks"
											control={control}
											rules={{ required: true }}
											render={({ field: { onChange, value } }) => (
												<>
													<TextControl
														label={__('Comment Links Selector', 'wp-ajaxify-comments')}
														type="text"
														className={classNames('ajaxify-admin__text-control', {
															'has-error': 'required' === errors.selectorCommentLinks?.type,
															'has-error': 'pattern' === errors.selectorCommentLinks?.type,
															'is-required': true,
														})}
														help={__('Selector for the comment links.', 'wp-ajaxify-comments')}
														aria-required="true"
														value={value}
														onChange={onChange}
													/>
													{'required' === errors.selectorCommentLinks?.type && (
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
											name="selectorErrorContainer"
											control={control}
											rules={{ required: true }}
											render={({ field: { onChange, value } }) => (
												<>
													<TextControl
														label={__('Error Container Selector', 'wp-ajaxify-comments')}
														type="text"
														className={classNames('ajaxify-admin__text-control', {
															'has-error': 'required' === errors.selectorErrorContainer?.type,
															'has-error': 'pattern' === errors.selectorErrorContainer?.type,
															'is-required': true,
														})}
														help={__('This is where any error messages will be shown.', 'wp-ajaxify-comments')}
														aria-required="true"
														value={value}
														onChange={onChange}
													/>
													{'required' === errors.selectorErrorContainer?.type && (
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
											name="selectorPostContainer"
											control={control}
											rules={{ required: true }}
											render={({ field: { onChange, value } }) => (
												<>
													<TextControl
														label={__('Post Container Selector', 'wp-ajaxify-comments')}
														type="text"
														className={classNames('ajaxify-admin__text-control', {
															'has-error': 'required' === errors.selectorPostContainer?.type,
															'has-error': 'pattern' === errors.selectorPostContainer?.type,
															'is-required': true,
														})}
														help={__('Selector that matches post containers to enable support for multiple comment forms per page; leave empty to disable multiple comment form per page support. Please note: Each post container needs to have the ID attribute defined. If this option is set, all other selectors cannot select the elements by ID, but have to select the elements inside the post container for example by element and/or class.', 'wp-ajaxify-comments')}
														aria-required="true"
														value={value}
														onChange={onChange}
													/>
													{'required' === errors.selectorPostContainer?.type && (
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
export default SelectorsScreen;
