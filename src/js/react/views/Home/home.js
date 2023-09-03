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
import { AlertCircle } from 'lucide-react';
import ErrorBoundary from '../../components/ErrorBoundary';
import SendCommand from '../../utils/SendCommand';
import Notice from '../../components/Notice';

const retrieveHomeOptions = () => {
	return SendCommand('wpac_get_home_options', {
		nonce: wpacAdminHome.getNonce,
	});
};

const HomeScreen = (props) => {
	const [defaults, getDefaults] = useAsyncResource(
		retrieveHomeOptions,
		[]
	);
	return (
		<ErrorBoundary
			fallback={
				<p>
					{__('Could not load Home options.', 'highlight-and-share')}
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

	console.log( data );
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
			enabled: data.enabled,
			debug: data.debug,
			menuHelper: data.menuHelper,
			scrollSpeed: data.scrollSpeed,
			autoUpdateIdleTime: data.autoUpdateIdleTime,
		},
	});
	console.log( data.scrollSpeed );
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
			return Spinner;
		}
		if (isSaved) {
			return ClipboardCheck;
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
		return __('Save Settings', 'wp-ajaxify-comments');
	};

	const getResetText = () => {
		if (resetting) {
			return __('Restoring Defaults…', 'wp-ajaxify-comments');
		}
		if (isReset) {
			return __('Defaults Restored', 'wp-ajaxify-comments');
		}
		return __('Reset Settings', 'wp-ajaxify-comments');
	};

	const getCommentEditingHeader = () => {
		return (
			<>
				<h2>
					{__('Ajaxify Settings Home', 'wp-ajaxify-comments')}
				</h2>
				<p className="description">
					{__(
						'Enable or disable Ajaxify comments, or place into debug mode.',
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
					<div className="ajaxify-panel-row">
						<table className="form-table form-table-row-sections">
							<tbody>
								<tr>
									<th scope="row">{__('Ajaxify Status', 'wp-ajaxify-comments')}</th>
									<td>
										<Controller
											name="enabled"
											control={control}
											render={({ field: { onChange, value } }) => (
												<ToggleControl
													label={__('Enable Ajaxify Comments', 'wp-ajaxify-comments')}
													checked={value}
													onChange={(boolValue) => {
														onChange(boolValue);
													}}
													help={__(
														'Configure whether to enable or disable Ajaxify Comments.',
														'wp-ajaxify-comments'
													)}
												/>
											)}
										/>
										{
											getValues('enabled') && (
												<>
													<Controller
														name="debug"
														control={control}
														render={({ field: { onChange, value } }) => (
															<ToggleControl
																label={__('Enable Debug Mode', 'wp-ajaxify-comments')}
																checked={value}
																onChange={(boolValue) => {
																	onChange(boolValue);
																}}
																help={__(
																	'Debug mode will show you the Ajaxify Comments debug log in the browser console.',
																	'wp-ajaxify-comments'
																)}
															/>
														)}
													/>
												</>
											)
										}
									</td>
								</tr>
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
														'Turn on some menu shortcuts when viewing a post with comments. You can force Ajaxify comments to load, and check the page for selectors.',
														'wp-ajaxify-comments'
													)}
												/>
											)}
										/>
									</td>
								</tr>
								<tr>
									<th scope="row">{__('Miscellaneous', 'wp-ajaxify-comments')}</th>
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
															'wp-ajaxify-comments'
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
														'wp-ajaxify-comments'
													) }
													status="error"
													politeness="assertive"
													inline={ false }
													icon={ <AlertCircle /> }
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
															'wp-ajaxify-comments'
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
														'wp-ajaxify-comments'
													) }
													status="error"
													politeness="assertive"
													inline={ false }
													icon={ <AlertCircle /> }
												/>
											) }
									</td>
								</tr>
							</tbody>
						</table>
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
export default HomeScreen;
