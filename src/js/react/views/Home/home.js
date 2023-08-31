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
import {  } from 'lucide-react';
import ErrorBoundary from '../../components/ErrorBoundary';
import SendCommand from '../../utils/SendCommand';
import Notice from '../../components/Notice';

const retrieveCommentEditingOptions = () => {
	return SendCommand( 'wpac_get_home_options', {
		nonce: wpacAdminHome.getNonce,
	} );
};

const HomeScreen = ( props ) => {
	const [ defaults, getDefaults ] = useAsyncResource(
		retrieveCommentEditingOptions,
		[]
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
						<h2>{ __( 'Comment Editing', 'comment-edit-pro' ) }</h2>
						<BeatLoader
							color={ '#9c68b0' }
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
	} = useForm( {
		defaultValues: {
			timer: data.timer,
			enableCommentEditing: data.enableCommentEditing,
			allowCommentLogging: data.allowCommentLogging,
			allowFrontEndEditing: data.allowFrontEndEditing,
			allowFrontEndModerationMenu: data.allowFrontEndModerationMenu,
			allowUnlimitedEditing: data.allowUnlimitedEditing,
			showStopTimer: data.showStopTimer,
			allowDelete: data.allowDelete,
			deleteOnly: data.deleteOnly,
			allowDeleteConfirmation: data.allowDeleteConfirmation,
			allowEditNotification: data.allowEditNotification,
			editNotificationTo: data.editNotificationTo,
			editNotificationFrom: data.editNotificationFrom,
			editNotificationSubject: data.editNotificationSubject,
			showTimer: data.showTimer,
			buttonTheme: data.buttonTheme,
			showIcons: data.showIcons,
			timerAppearance: data.timerAppearance,
			saveText: data.saveText,
			cancelText: data.cancelText,
			deleteText: data.deleteText,
			stopTimerText: data.stopTimerText,
			clickToEditText: data.clickToEditText,
			confirmDelete: data.confirmDelete,
			commentDeleted: data.commentDeleted,
			commentDeletedError: data.commentDeletedError,
			commentEmptyError: data.commentEmptyError,
			frontEndModerationMenuTheme: data.frontEndModerationMenuTheme,
			deleteBehaviorUsers: data.deleteBehaviorUsers,
			deleteBehaviorModerators: data.deleteBehaviorModerators,
			spamBehaviorModerators: data.spamBehaviorModerators,
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
		setSaving( true );
		SendCommand( 'sce_save_comment_editing_options', {
			nonce: sceCommentEditing.save_nonce,
			...formData,
		} )
			.then( ( ajaxResponse ) => {
				const ajaxSuccess = ajaxResponse.data.success;
				if ( ajaxSuccess ) {
					setIsSaved( true );
					setTimeout( () => {
						setIsSaved( false );
					}, 3000 );
				} else {
				}
			} )
			.catch( ( ajaxResponse ) => {} )
			.then( ( ajaxResponse ) => {
				setSaving( false );
			} );
	};

	const handleReset = () => {
		setResetting( true );
		SendCommand( 'sce_reset_comment_editing_options', {
			nonce: sceCommentEditing.reset_nonce,
		} )
			.then( ( ajaxResponse ) => {
				const ajaxData = ajaxResponse.data.data;
				const ajaxSuccess = ajaxResponse.data.success;
				if ( ajaxSuccess ) {
					setIsReset( true );
					reset( ajaxData );
					setTimeout( () => {
						setIsReset( false );
					}, 3000 );
				}
			} )
			.catch( ( ajaxResponse ) => {} )
			.then( ( ajaxResponse ) => {
				setResetting( false );
			} );
	};

	const getSaveIcon = () => {
		if ( saving ) {
			return Spinner;
		}
		if ( isSaved ) {
			return ClipboardCheck;
		}
		return false;
	};

	const getSaveText = () => {
		if ( saving ) {
			return __( 'Saving…', 'quotes-dlx' );
		}
		if ( isSaved ) {
			return __( 'Saved', 'quotes-dlx' );
		}
		return __( 'Save Comment Editing Options', 'quotes-dlx' );
	};

	const getResetText = () => {
		if ( resetting ) {
			return __( 'Restoring Defaults…', 'quotes-dlx' );
		}
		if ( isReset ) {
			return __( 'Defaults Restored', 'quotes-dlx' );
		}
		return __( 'Restore Comment Editing Defaults', 'quotes-dlx' );
	};

	const getCommentEditingHeader = () => {
		return (
			<>
				<h2>
					{ __( 'Comment Editing', 'comment-edit-pro' ) }
				</h2>
				<p className="description">
					{ __(
						'Comment editing is a great way to allow your users to fix their own comments.',
						'comment-edit-pro'
					) }
				</p>
			</>
		);
	};

	return (
		<>
			{ getCommentEditingHeader() }
			<form onSubmit={ handleSubmit( onSubmit ) }>
				<table className="form-table form-table-row-sections">
					<tbody>
						<tr>
							<th scope="row">{ __( 'Comment Editing', 'comment-edit-pro' ) }</th>
							<td>
								<Controller
									name="enableCommentEditing"
									control={ control }
									render={ ( { field: { onChange, value } } ) => (
										<ToggleControl
											label={ __( 'Enable Comment Editing.', 'comment-edit-pro' ) }
											className="sce-admin__toggle-control"
											checked={ value }
											onChange={ ( boolValue ) => {
												//setShowButtonOptions( boolValue );
												onChange( boolValue );
											} }
											help={ __(
												'Comment editing is enabled by default, but you can disable it here.',
												'comment-edit-pro'
											) }
										/>
									) }
								/>
								{ ! sceCommentEditing.is_sce_installed && (
									<>
										<Notice
											message={ __(
												'Comment Edit Lite is not installed and is needed to enable comment editing.',
												'comment-edit-pro'
											) }
											status="error"
											politeness="assertive"
											inline={ false }
											icon={ CircularExclamationIcon }
										/>
										<Button
											variant="primary"
											href={ sceCommentEditing.sce_install_url }
											target="_blank"
											rel="noopener noreferrer"
										>
											{ __( 'Install Comment Edit Lite', 'comment-edit-pro' ) }
										</Button>
									</>
								) }
								{ ( sceCommentEditing.is_sce_installed && ! getValues( 'enableCommentEditing' ) ) && (
									<Notice
										message={ __(
											'The Comment Edit Lite plugin is no longer needed when comment editing is disabled.',
											'comment-edit-pro'
										) }
										status="info"
										politeness="assertive"
										inline={ false }
										icon={ CircularExclamationIcon }
									/>
								) }
							</td>
						</tr>
						<tr>
							<th scope="row">{ __( 'Frontend Editing', 'comment-edit-pro' ) }</th>
							<td>
								<div className="sce-panel-row">
									<Controller
										name="allowFrontEndEditing"
										control={ control }
										render={ ( { field: { onChange, value } } ) => (
											<ToggleControl
												label={ __(
													'Enable Frontend Editing For Admins.',
													'comment-edit-pro'
												) }
												className="sce-admin__toggle-control"
												checked={ value }
												onChange={ ( boolValue ) => {
												//setShowButtonOptions( boolValue );
													onChange( boolValue );
												} }
												help={ __(
													'Enabling this will allow you to edit comments from the frontend of your site.',
													'comment-edit-pro'
												) }
											/>
										) }
									/>
								</div>
								<div className="sce-panel-row">
									<Controller
										name="allowFrontEndModerationMenu"
										control={ control }
										render={ ( { field: { onChange, value } } ) => (
											<ToggleControl
												label={ __(
													'Enable Frontend Moderation Menu',
													'comment-edit-pro'
												) }
												className="sce-admin__toggle-control"
												checked={ value }
												onChange={ ( boolValue ) => {
													onChange( boolValue );
												} }
												help={ __(
													'Enabling this will show a small horizontal menu on each comment, which will allow you to edit, delete, approve, or spam comments from the frontend of your site.',
													'comment-edit-pro'
												) }
											/>
										) }
									/>
								</div>
								{
									getValues( 'allowFrontEndModerationMenu' ) && (
										<>
											<div className="sce-panel-row">
												<Controller
													name="frontEndModerationMenuTheme"
													control={ control }
													render={ ( { field: { onChange, value } } ) => (
														<SelectControl
															label={ __( 'Moderation Menu Theme', 'comment-edit-pro' ) }
															value={ value }
															options={ [
																{
																	label: __( 'Default', 'comment-edit-pro' ),
																	value: 'default',
																},
																{
																	label: __( 'Light', 'comment-edit-pro' ),
																	value: 'light',
																},
																{
																	label: __( 'Dark', 'comment-edit-pro' ),
																	value: 'dark',
																},
															] }
															onChange={ ( newValue ) => {
																onChange( newValue );
															} }
															help={ __(
																'Choose a theme for the moderation menu.',
																'comment-edit-pro'
															) }
														/>
													) }
												/>
											</div>
											<div className="sce-panel-row">
												<p className="sce-admin__theme-preview fancybox-previews">
													<strong>{ __( 'Preview:', 'comment-edit-pro' ) }</strong>
													{ ` ` }
													<a
														href={ sceCommentEditing.default_menu_theme }
														data-fancybox="moderation-menu-themes" data-initial-size="fit" data-zoom="false" data-width="800px" data-caption={ __( 'Default Menu Theme', 'comment-edit-pro' ) }
														className="sce-admin__theme-preview-link"
													>
														{ __( 'Default Theme', 'comment-edit-pro' ) }
													</a>
													{ ` | ` }
													<a
														href={ sceCommentEditing.light_menu_theme }
														className="sce-admin__theme-preview-link"
														data-fancybox="moderation-menu-themes" data-initial-size="fit" data-zoom="false" data-width="800px" data-caption={ __( 'Light Menu Theme', 'comment-edit-pro' ) }
													>
														{ __( 'Light Theme', 'comment-edit-pro' ) }
													</a>
													{ ` | ` }
													<a
														href={ sceCommentEditing.dark_menu_theme }
														className="sce-admin__theme-preview-link"
														data-fancybox="moderation-menu-themes" data-initial-size="fit" data-zoom="false" data-width="800px" data-caption={ __( 'Dark Menu Theme', 'comment-edit-pro' ) }
													>
														{ __( 'Dark Theme', 'comment-edit-pro' ) }
													</a>
												</p>
											</div></>

									)
								}
							</td>
						</tr>
						{ getValues( 'enableCommentEditing' ) && (
							<>
								<tr>
									<th scope="row">{ __( 'Countdown Timer', 'comment-edit-pro' ) }</th>
									<td>
										<Controller
											name="timer"
											control={ control }
											rules={ { required: true, pattern: '\d+' } }
											render={ ( { field: { onChange, value } } ) => (
												<TextControl
													label={ __( 'Timer Length', 'quotes-dlx' ) }
													type="number"
													className={ classNames( 'sce-admin__text-control', {
														'has-error': 'required' === errors.timer?.type,
														'is-required': true,
													} ) }
													help={ __(
														'Enter the time that users have to edit their comments.',
														'comment-edit-pro'
													) }
													aria-required="true"
													value={ value }
													onChange={ onChange }
												/>
											) }
										/>
										{ errors.timer && (
											<Notice
												message={ __(
													'The value for the timer is invalid.',
													'comment-edit-pro'
												) }
												status="error"
												politeness="assertive"
												inline={ false }
												icon={ CircularExclamationIcon }
											/>
										) }
										<Controller
											name="allowUnlimitedEditing"
											control={ control }
											render={ ( { field: { onChange, value } } ) => (
												<ToggleControl
													label={ __(
														'Unlimited Timer for Logged-in Users.',
														'comment-edit-pro'
													) }
													className="sce-admin__toggle-control"
													checked={ value }
													onChange={ ( boolValue ) => {
														//setShowButtonOptions( boolValue );
														onChange( boolValue );
													} }
													help={ __(
														'Enabling this will allow unlimited editing for logged-in users.',
														'comment-edit-pro'
													) }
												/>
											) }
										/>
										<Controller
											name="showStopTimer"
											control={ control }
											render={ ( { field: { onChange, value } } ) => (
												<ToggleControl
													label={ __(
														'Allow Timer To Be Canceled by Users',
														'comment-edit-pro'
													) }
													className="sce-admin__toggle-control"
													checked={ value }
													onChange={ ( boolValue ) => {
														//setShowButtonOptions( boolValue );
														onChange( boolValue );
													} }
													help={ __(
														'Enabling this will show an extra button that will allow users to cancel their edit timer.',
														'comment-edit-pro'
													) }
												/>
											) }
										/>
									</td>
								</tr>
								<tr>
									<th scope="row">{ __( 'Logging', 'comment-edit-pro' ) }</th>
									<td>
										<Controller
											name="allowCommentLogging"
											control={ control }
											render={ ( { field: { onChange, value } } ) => (
												<ToggleControl
													label={ __(
														'Enable Comment Logging for Edited Comments.',
														'comment-edit-pro'
													) }
													className="sce-admin__toggle-control"
													checked={ value }
													onChange={ ( boolValue ) => {
														//setShowButtonOptions( boolValue );
														onChange( boolValue );
													} }
													help={ __(
														'Enabling this will allow you to restore edited comments and view an edit history for comments.',
														'comment-edit-pro'
													) }
												/>
											) }
										/>
									</td>
								</tr>
								<tr>
									<th scope="row">{ __( 'Comment Deletion', 'comment-edit-pro' ) }</th>
									<td>
										<Controller
											name="allowDelete"
											control={ control }
											render={ ( { field: { onChange, value } } ) => (
												<ToggleControl
													label={ __(
														'Allow Comment Deletion for Users',
														'comment-edit-pro'
													) }
													className="sce-admin__toggle-control"
													checked={ value }
													onChange={ ( boolValue ) => {
														//setShowButtonOptions( boolValue );
														onChange( boolValue );
													} }
													help={ __(
														'Enabling this option will allow users to delete their own comments.',
														'comment-edit-pro'
													) }
												/>
											) }
										/>
										<Controller
											name="deleteOnly"
											control={ control }
											render={ ( { field: { onChange, value } } ) => (
												<ToggleControl
													label={ __(
														'Allow Comment Deletion Only',
														'comment-edit-pro'
													) }
													className="sce-admin__toggle-control"
													checked={ value }
													onChange={ ( boolValue ) => {
														//setShowButtonOptions( boolValue );
														onChange( boolValue );
													} }
													help={ __(
														'Enabling this will hide the editing options and only allows the user to delete comments only.',
														'comment-edit-pro'
													) }
												/>
											) }
										/>
										<Controller
											name="allowDeleteConfirmation"
											control={ control }
											render={ ( { field: { onChange, value } } ) => (
												<ToggleControl
													label={ __(
														'Enable Comment Deletion Confirmation',
														'comment-edit-pro'
													) }
													className="sce-admin__toggle-control"
													checked={ value }
													onChange={ ( boolValue ) => {
														//setShowButtonOptions( boolValue );
														onChange( boolValue );
													} }
													help={ __(
														'Enabling this will show a confirmation before the user is allowed to delete their own comments.',
														'comment-edit-pro'
													) }
												/>
											) }
										/>
										<Controller
											name="deleteBehaviorModerators"
											control={ control }
											render={ ( { field: { onChange, value } } ) => (
												<RadioControl
													label={ __(
														'How should moderator-deleted comments be treated?',
														'comment-edit-pro'
													) }
													selected={ value }
													options={ [
														{
															label: __( 'Send to Trash', 'comment-edit-pro' ),
															value: 'trash',
														},
														{
															label: __( 'Delete Permanently', 'comment-edit-pro' ),
															value: 'delete',
														},
													] }
													onChange={ onChange }
													help={ __(
														'Choose whether to send moderator-deleted comments to the trash or delete them permanently. This affects comments deleted in the admin as well.',
														'comment-edit-pro'
													) }
												/>
											) }
										/>
										<Controller
											name="deleteBehaviorUsers"
											control={ control }
											render={ ( { field: { onChange, value } } ) => (
												<RadioControl
													label={ __(
														'How should user-deleted comments be treated?',
														'comment-edit-pro'
													) }
													selected={ value }
													options={ [
														{
															label: __( 'Send to Trash', 'comment-edit-pro' ),
															value: 'trash',
														},
														{
															label: __( 'Delete Permanently', 'comment-edit-pro' ),
															value: 'delete',
														},
													] }
													onChange={ onChange }
													help={ __(
														'Choose whether to send user-deleted comments to the trash or delete them permanently.',
														'comment-edit-pro'
													) }
												/>
											) }
										/>
									</td>
								</tr>
								<tr>
									<th scope="row">{ __( 'Spammed Comments', 'comment-edit-pro' ) }</th>
									<td>
										<Controller
											name="spamBehaviorModerators"
											control={ control }
											render={ ( { field: { onChange, value } } ) => (
												<RadioControl
													label={ __(
														'How should spam comments be treated?',
														'comment-edit-pro'
													) }
													selected={ value }
													options={ [
														{
															label: __( 'Send to Spam', 'comment-edit-pro' ),
															value: 'spam',
														},
														{
															label: __( 'Spam and Delete', 'comment-edit-pro' ),
															value: 'delete',
														},
													] }
													onChange={ onChange }
													help={ __(
														'When marking a comment as spam, choose whether to send the comment directly to spam, or to mark as spam then delete permanently. This affects comments marked as spam in the admin as well.',
														'comment-edit-pro'
													) }
												/>
											) }
										/>
									</td>
								</tr>
								<tr>
									<th scope="row">
										{ __( 'Email Notifications', 'comment-edit-pro' ) }
									</th>
									<td>
										<Controller
											name="allowEditNotification"
											control={ control }
											render={ ( { field: { onChange, value } } ) => (
												<ToggleControl
													label={ __(
														'Enable Email Notifications for Edited Comments',
														'comment-edit-pro'
													) }
													className="sce-admin__toggle-control"
													checked={ value }
													onChange={ ( boolValue ) => {
														//setShowButtonOptions( boolValue );
														onChange( boolValue );
													} }
													help={ __(
														'Enabling this will send an email notification when someone edits their comment.',
														'comment-edit-pro'
													) }
												/>
											) }
										/>
										{ getValues( 'allowEditNotification' ) && (
											<>
												<Controller
													name="editNotificationTo"
													control={ control }
													rules={ { required: true } }
													render={ ( { field: { onChange, value } } ) => (
														<TextControl
															label={ __( 'To Email Address', 'highlight-and-share' ) }
															value={ value }
															onChange={ ( newValue ) => {
																if ( ! ValidateEmail( newValue ) ) {
																	setError( 'editNotificationTo', {
																		shouldFocus: true,
																	} );
																} else {
																	clearErrors( 'editNotificationTo' );
																}
																onChange( newValue );
															} }
															className={ classNames( 'sce-admin__text-control', {
																'has-error':
															'required' === errors.editNotificationTo?.type,
																'is-required': true,
															} ) }
															help={ __(
																'The email address to send the notification to.',
																'comment-edit-pro'
															) }
														/>
													) }
												/>
												{ errors.editNotificationTo && (
													<Notice
														message={ __(
															'This does not appear to be a valid email address.',
															'comment-edit-pro'
														) }
														status="error"
														politeness="assertive"
														inline={ false }
														icon={ CircularExclamationIcon }
													/>
												) }
												<Controller
													name="editNotificationFrom"
													control={ control }
													rules={ { required: true } }
													render={ ( { field: { onChange, value } } ) => (
														<TextControl
															label={ __(
																'From Email Address',
																'highlight-and-share'
															) }
															value={ value }
															onChange={ ( newValue ) => {
																if ( ! ValidateEmail( newValue ) ) {
																	setError( 'editNotificationFrom', {
																		shouldFocus: true,
																	} );
																} else {
																	clearErrors( 'editNotificationFrom' );
																}
																onChange( newValue );
															} }
															className={ classNames( 'sce-admin__text-control', {
																'has-error':
															'required' === errors.editNotificationFrom?.type,
																'is-required': true,
															} ) }
															help={ __(
																'The email address that notifications should be sent from.',
																'comment-edit-pro'
															) }
														/>
													) }
												/>
												{ errors.editNotificationFrom && (
													<Notice
														message={ __(
															'This does not appear to be a valid email address.',
															'comment-edit-pro'
														) }
														status="error"
														politeness="assertive"
														inline={ false }
														icon={ CircularExclamationIcon }
													/>
												) }
												<Controller
													name="editNotificationSubject"
													control={ control }
													rules={ { required: true } }
													render={ ( { field: { onChange, value } } ) => (
														<TextControl
															label={ __( 'Email Subject', 'highlight-and-share' ) }
															value={ value }
															onChange={ ( newValue ) => {
																onChange( newValue );
															} }
															className={ classNames( 'sce-admin__text-control', {
																'has-error':
															'required' ===
															errors.editNotificationSubject?.type,
																'is-required': true,
															} ) }
															help={ __(
																'The subject of the email when someone edits their comment.',
																'comment-edit-pro'
															) }
														/>
													) }
												/>
												{ errors.editNotificationSubject && (
													<Notice
														message={ __(
															'This is a required field.',
															'comment-edit-pro'
														) }
														status="error"
														politeness="assertive"
														inline={ false }
														icon={ CircularExclamationIcon }
													/>
												) }
											</>
										) }
									</td>
								</tr>
								<tr>
									<th scope="row">{ __( 'Appearance', 'comment-edit-pro' ) }</th>
									<td>
										<Controller
											name="showTimer"
											control={ control }
											render={ ( { field: { onChange, value } } ) => (
												<ToggleControl
													label={ __( 'Show the timer', 'comment-edit-pro' ) }
													className="sce-admin__toggle-control"
													checked={ value }
													onChange={ ( boolValue ) => {
														onChange( boolValue );
													} }
													help={ __(
														'Enabling this will show the timer to the user when editing.',
														'comment-edit-pro'
													) }
												/>
											) }
										/>
										{ getValues( 'showTimer' ) && (
											<>
												<Controller
													name="timerAppearance"
													control={ control }
													rules={ { required: true } }
													render={ ( { field: { onChange, value } } ) => (
														<SelectControl
															label={ __( 'Timer Appearance', 'comment-edit-pro' ) }
															help={ __(
																'Select how the timer should appear to the user.',
																'comment-edit-pro'
															) }
															value={ value }
															options={ [
																{
																	label: __( 'Words', 'comment-edit-pro' ),
																	value: 'words',
																},
																{
																	label: __( 'Compact', 'comment-edit-pro' ),
																	value: 'compact',
																},
															] }
															onChange={ ( timerAppearanceValue ) => {
																onChange( timerAppearanceValue );
															} }
														/>
													) }
												/>
											</>
										) }
										<Controller
											name="buttonTheme"
											control={ control }
											rules={ { required: true } }
											render={ ( { field: { onChange, value } } ) => (
												<SelectControl
													label={ __( 'Choose a Button Theme', 'comment-edit-pro' ) }
													help={ __(
														'Select a button theme for editing interface.',
														'comment-edit-pro'
													) }
													value={ value }
													options={ [
														{
															label: __( 'None', 'comment-edit-pro' ),
															value: 'default',
														},
														{
															label: __( 'Regular', 'comment-edit-pro' ),
															value: 'regular',
														},
														{
															label: __( 'Light', 'comment-edit-pro' ),
															value: 'light',
														},
														{
															label: __( 'Dark', 'comment-edit-pro' ),
															value: 'dark',
														},
													] }
													onChange={ ( buttonThemeValue ) => {
														onChange( buttonThemeValue );
													} }
												/>
											) }
										/>
										{ 'default' !== getValues( 'buttonTheme' ) && (
											<>
												<Controller
													name="showIcons"
													control={ control }
													render={ ( { field: { onChange, value } } ) => (
														<ToggleControl
															label={ __(
																'Show Icons on Buttons',
																'comment-edit-pro'
															) }
															className="sce-admin__toggle-control"
															checked={ value }
															onChange={ ( boolValue ) => {
																onChange( boolValue );
															} }
															help={ __(
																'Allow icons for the buttons. Recommended if you have selected a button theme.',
																'comment-edit-pro'
															) }
														/>
													) }
												/>
											</>
										) }
										<p className="sce-admin__theme-preview fancybox-previews">
											<strong>{ __( 'Preview:', 'comment-edit-pro' ) }</strong>
											{ ` ` }
											<a
												href={ sceCommentEditing.default_theme }
												data-fancybox data-initial-size="fit" data-zoom="false" data-width="800px" data-caption={ __( 'Default Theme', 'comment-edit-pro' ) }
												className="sce-admin__theme-preview-link"
											>
												{ __( 'Default Theme', 'comment-edit-pro' ) }
											</a>
											{ ` | ` }
											<a
												href={ sceCommentEditing.light_theme }
												className="sce-admin__theme-preview-link"
												data-fancybox data-initial-size="fit" data-zoom="false" data-width="800px" data-caption={ __( 'Light Theme', 'comment-edit-pro' ) }
											>
												{ __( 'Light Theme', 'comment-edit-pro' ) }
											</a>
											{ ` | ` }
											<a
												href={ sceCommentEditing.dark_theme }
												className="sce-admin__theme-preview-link"
												data-fancybox data-initial-size="fit" data-zoom="false" data-width="800px" data-caption={ __( 'Dark Theme', 'comment-edit-pro' ) }
											>
												{ __( 'Dark Theme', 'comment-edit-pro' ) }
											</a>
										</p>
									</td>
								</tr>
								<tr>
									<th scope="row">{ __( 'Translations', 'comment-edit-pro' ) }</th>
									<td>
										<Controller
											name="saveText"
											control={ control }
											rules={ { required: true } }
											render={ ( { field: { onChange, value } } ) => (
												<TextControl
													label={ __( 'Save Button Text', 'quotes-dlx' ) }
													type="text"
													className={ classNames( 'sce-admin__text-control', {
														'has-error': 'required' === errors.saveText?.type,
														'is-required': true,
													} ) }
													aria-required="true"
													value={ value }
													onChange={ onChange }
												/>
											) }
										/>
										<Controller
											name="cancelText"
											control={ control }
											rules={ { required: true } }
											render={ ( { field: { onChange, value } } ) => (
												<TextControl
													label={ __( 'Cancel Button Text', 'quotes-dlx' ) }
													type="text"
													className={ classNames( 'sce-admin__text-control', {
														'has-error': 'required' === errors.cancelText?.type,
														'is-required': true,
													} ) }
													aria-required="true"
													value={ value }
													onChange={ onChange }
												/>
											) }
										/>
										<Controller
											name="deleteText"
											control={ control }
											rules={ { required: true } }
											render={ ( { field: { onChange, value } } ) => (
												<TextControl
													label={ __( 'Delete Button Text', 'quotes-dlx' ) }
													type="text"
													className={ classNames( 'sce-admin__text-control', {
														'has-error': 'required' === errors.deleteText?.type,
														'is-required': true,
													} ) }
													aria-required="true"
													value={ value }
													onChange={ onChange }
												/>
											) }
										/>
										<Controller
											name="stopTimerText"
											control={ control }
											rules={ { required: true } }
											render={ ( { field: { onChange, value } } ) => (
												<TextControl
													label={ __( 'Stop Timer Button Text', 'quotes-dlx' ) }
													type="text"
													className={ classNames( 'sce-admin__text-control', {
														'has-error': 'required' === errors.stopTimerText?.type,
														'is-required': true,
													} ) }
													aria-required="true"
													value={ value }
													onChange={ onChange }
												/>
											) }
										/>
										<Controller
											name="clickToEditText"
											control={ control }
											rules={ { required: true } }
											render={ ( { field: { onChange, value } } ) => (
												<TextControl
													label={ __( 'Click to Edit Text', 'quotes-dlx' ) }
													type="text"
													className={ classNames( 'sce-admin__text-control', {
														'has-error': 'required' === errors.clickToEditText?.type,
														'is-required': true,
													} ) }
													aria-required="true"
													value={ value }
													onChange={ onChange }
												/>
											) }
										/>
										<Controller
											name="confirmDelete"
											control={ control }
											rules={ { required: true } }
											render={ ( { field: { onChange, value } } ) => (
												<TextControl
													label={ __( 'Comment Deletion Confirmation Text', 'quotes-dlx' ) }
													type="text"
													className={ classNames( 'sce-admin__text-control', {
														'has-error': 'required' === errors.confirmDelete?.type,
														'is-required': true,
													} ) }
													aria-required="true"
													value={ value }
													onChange={ onChange }
												/>
											) }
										/>
										<Controller
											name="commentDeleted"
											control={ control }
											rules={ { required: true } }
											render={ ( { field: { onChange, value } } ) => (
												<TextControl
													label={ __( 'Comment Deleted Text', 'quotes-dlx' ) }
													type="text"
													className={ classNames( 'sce-admin__text-control', {
														'has-error': 'required' === errors.commentDeleted?.type,
														'is-required': true,
													} ) }
													aria-required="true"
													value={ value }
													onChange={ onChange }
												/>
											) }
										/>
										<Controller
											name="commentDeletedError"
											control={ control }
											rules={ { required: true } }
											render={ ( { field: { onChange, value } } ) => (
												<TextControl
													label={ __( 'Comment Deleted Error Text', 'quotes-dlx' ) }
													type="text"
													className={ classNames( 'sce-admin__text-control', {
														'has-error': 'required' === errors.commentDeletedError?.type,
														'is-required': true,
													} ) }
													aria-required="true"
													value={ value }
													onChange={ onChange }
												/>
											) }
										/>
										<Controller
											name="commentEmptyError"
											control={ control }
											rules={ { required: true } }
											render={ ( { field: { onChange, value } } ) => (
												<TextControl
													label={ __( 'Comment Empty Error Text', 'quotes-dlx' ) }
													type="text"
													className={ classNames( 'sce-admin__text-control', {
														'has-error': 'required' === errors.commentEmptyError?.type,
														'is-required': true,
													} ) }
													aria-required="true"
													value={ value }
													onChange={ onChange }
												/>
											) }
										/>
									</td>
								</tr>
							</>
						) }
					</tbody>
				</table>
				<div className="sce-admin-buttons">
					<Button
						className={ classNames(
							'qdlx__btn qdlx__btn-primary qdlx__btn--icon-right',
							{ 'has-error': hasErrors() },
							{ 'has-icon': saving || isSaved },
							{ 'is-saving': saving && ! isSaved },
							{ 'is-saved': isSaved }
						) }
						type="submit"
						text={ getSaveText() }
						icon={ getSaveIcon() }
						iconSize="18"
						iconPosition="right"
						disabled={ saving }
					/>
					<Button
						className={ classNames(
							'qdlx__btn qdlx__btn-danger qdlx__btn--icon-right',
							{ 'has-icon': resetting },
							{ 'is-resetting': { resetting } }
						) }
						type="button"
						text={ getResetText() }
						icon={ resetting ? Spinner : false }
						iconSize="18"
						iconPosition="right"
						disabled={ saving || resetting }
						onClick={ ( e ) => {
							setResetting( true );
							handleReset( e );
						} }
					/>
				</div>
				{ hasErrors() && (
					<Notice
						message={ __(
							'There are form validation errors. Please correct them above.',
							'comment-edit-pro'
						) }
						status="error"
						politeness="polite"
					/>
				) }
				{ isSaved && (
					<Notice
						message={ __( 'Your settings have been saved.', 'comment-edit-pro' ) }
						status="success"
						politeness="assertive"
					/>
				) }
				{ isReset && (
					<Notice
						message={ __( 'Your settings have been reset.', 'comment-edit-pro' ) }
						status="success"
						politeness="assertive"
					/>
				) }
			</form>
		</>
	);
};
export default HomeScreen;
