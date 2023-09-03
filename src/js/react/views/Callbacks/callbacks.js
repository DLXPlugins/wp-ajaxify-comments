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
import ColorPickerControl from '../../components/ColorPicker';
import AlignmentGroup from '../../components/alignment';

const retrieveCallbackOptions = () => {
	return SendCommand('wpac_get_callbacks_options', {
		nonce: wpacAdminCallbacks.getNonce,
	});
};


const CallbacksScreen = (props) => {
	const [defaults, getDefaults] = useAsyncResource(
		retrieveCallbackOptions,
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
			callbackOnBeforeSelectElements: data.callbackOnBeforeSelectElements,
			callbackOnBeforeSubmitComment: data.callbackOnBeforeSubmitComment,
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
					{__('Callbacks', 'wp-ajaxify-comments')}
				</h2>
				<p className="description">
					{__(
						'Callbacks allow you to run custom JavaScript code (including calling your own functions) at various points in the comment posting process.',
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
					<div className="ajaxify-admin-panel-content">
						<div className="ajaxify-admin__control-row">
							<Controller
								name="callbackOnBeforeSelectElements"
								control={control}
								render={({ field: { onChange, value } }) => (
									<>
										<TextareaControl
											label={__('OnBeforeSelectElements Callback', 'wp-ajaxify-comments')}
											type="text"
											className={classNames('ajaxify-admin__textarea-control ajaxify-admin__js-label', {
												'has-error': 'required' === errors.callbackOnBeforeSelectElements?.type,
												'has-error': 'pattern' === errors.callbackOnBeforeSelectElements?.type,
												'is-required': true,
											})}
											help={__('Parameter: dom (jQuery DOM element)', 'wp-ajaxify-comments')}
											value={value}
											onChange={onChange}
											style={ { whiteSpace: 'pre-line' } }
										/>
									</>
								)}
							/>
						</div>
						<div className="ajaxify-admin__control-row">
							<Controller
								name="callbackOnBeforeSubmitComment"
								control={control}
								render={({ field: { onChange, value } }) => (
									<>
										<TextareaControl
											label={__('OnBeforeSubmitComment Callback', 'wp-ajaxify-comments')}
											type="text"
											className={classNames('ajaxify-admin__textarea-control ajaxify-admin__js-label', {
												'has-error': 'required' === errors.callbackOnBeforeSubmitComment?.type,
												'has-error': 'pattern' === errors.callbackOnBeforeSubmitComment?.type,
												'is-required': true,
											})}
											help={__('Callback before a commment is submitted.', 'wp-ajaxify-comments')}
											value={value}
											onChange={onChange}
											style={ { whiteSpace: 'pre-line' } }
										/>
									</>
								)}
							/>
						</div>
						<div className="ajaxify-admin__control-row">
							<Controller
								name="callbackOnAfterPostComment"
								control={control}
								render={({ field: { onChange, value } }) => (
									<>
										<TextareaControl
											label={__('OnAfterPostComment Callback', 'wp-ajaxify-comments')}
											type="text"
											className={classNames('ajaxify-admin__textarea-control ajaxify-admin__js-label', {
												'has-error': 'required' === errors.callbackOnAfterPostComment?.type,
												'has-error': 'pattern' === errors.callbackOnAfterPostComment?.type,
												'is-required': true,
											})}
											help={__('Parameter: commentUrl (string), unapproved (boolean)', 'wp-ajaxify-comments')}
											value={value}
											onChange={onChange}
											style={ { whiteSpace: 'pre-line' } }
										/>
									</>
								)}
							/>
						</div>
						<div className="ajaxify-admin__control-row">
							<Controller
								name="callbackOnBeforeUpdateComments"
								control={control}
								render={({ field: { onChange, value } }) => (
									<>
										<TextareaControl
											label={__('OnBeforeUpdateComments Callback', 'wp-ajaxify-comments')}
											type="text"
											className={classNames('ajaxify-admin__textarea-control ajaxify-admin__js-label', {
												'has-error': 'required' === errors.callbackOnBeforeUpdateComments?.type,
												'has-error': 'pattern' === errors.callbackOnBeforeUpdateComments?.type,
												'is-required': true,
											})}
											help={__('Parameters: newDom (jQuery DOM element), commentUrl (string)', 'wp-ajaxify-comments')}
											value={value}
											onChange={onChange}
											style={ { whiteSpace: 'pre-line' } }
										/>
									</>
								)}
							/>
						</div>
						<div className="ajaxify-admin__control-row">
							<Controller
								name="callbackOnAfterUpdateComments"
								control={control}
								render={({ field: { onChange, value } }) => (
									<>
										<TextareaControl
											label={__('OnAfterUpdateComments Callback', 'wp-ajaxify-comments')}
											type="text"
											className={classNames('ajaxify-admin__textarea-control ajaxify-admin__js-label', {
												'has-error': 'required' === errors.callbackOnAfterUpdateComments?.type,
												'has-error': 'pattern' === errors.callbackOnAfterUpdateComments?.type,
												'is-required': true,
											})}
											help={__('Parameters: newDom (jQuery DOM element), commentUrl (string)', 'wp-ajaxify-comments')}
											value={value}
											onChange={onChange}
											style={ { whiteSpace: 'pre-line' } }
										/>
									</>
								)}
							/>
						</div>
					</div>
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
export default CallbacksScreen;
