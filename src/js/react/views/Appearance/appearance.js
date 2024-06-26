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
	RangeControl,
	RadioControl,
} from '@wordpress/components';
import { Icon, desktop, mobile, tablet } from '@wordpress/icons';
import { AlertCircle, Loader2, ClipboardCheck } from 'lucide-react';
import ErrorBoundary from '../../components/ErrorBoundary';
import SendCommand from '../../utils/SendCommand';
import Notice from '../../components/Notice';
import ColorPickerControl from '../../components/ColorPicker';
import AlignmentGroup from '../../components/Alignment';
import VerticalAlignmentGroup from '../../components/VerticalAlignment';
import SaveResetButtons from '../../components/SaveResetButtons';
import ResponsiveTabs from '../../components/ResponsiveTabs';

const retrieveAppearanceOptions = () => {
	return SendCommand( 'wpac_get_appearance_options', {
		nonce: wpacAdminAppearance.getNonce,
	} );
};

const cssRegex = /^(?:(?:\*|(?:[a-z0-9_-]+(?:\|[a-z0-9_-]+)?))|\[(?:[a-z0-9_-]+)(?:=[\'"]?(.*?)[\'"]?)?\]|#[a-z0-9_-]+|\.(?:[a-z0-9_-]+))+(?:\s*,\s*(?:(?:\*|(?:[a-z0-9_-]+(?:\|[a-z0-9_-]+)?))|\[(?:[a-z0-9_-]+)(?:=[\'"]?(.*?)[\'"]?)?\]|#[a-z0-9_-]+|\.(?:[a-z0-9_-]+))+)*/i;

const defaultPalette = wpacAdminAppearance.palette;

const showPreview = ( formValues, type, device ) => {
	let backgroundColor = '';
	let textColor = '';
	let message = '';
	const top = formValues.popupMarginTop + ( jQuery( '#wpadminbar' ).outerHeight() || 0 );
	if ( type == 'loading' ) {
		backgroundColor = formValues.popupBackgroundColorLoading;
		textColor = formValues.popupTextColorLoading;
		message = __( 'Loading…', 'wp-ajaxify-comments' );
	}
	if ( type == 'success' ) {
		backgroundColor = formValues.popupBackgroundColorSuccess;
		textColor = formValues.popupTextColorSuccess;
		message = __( 'Your comment has been posted!', 'wp-ajaxify-comments' );
	}
	if ( type == 'error' ) {
		backgroundColor = formValues.popupBackgroundColorError;
		textColor = formValues.popupTextColorError;
		message = __( 'There was an error posting your comment.', 'wp-ajaxify-comments' );
	}
	let topOffset = formValues.popupVerticalAlign === 'verticalStart' ? top + 'px' : 'unset';
	if ( formValues.popupVerticalAlign === 'verticalCenter' ) {
		topOffset = '45%';
	}
	let popupWidth = formValues.popupWidth;
	let popupCornerRadius = formValues.popupCornerRadius;
	let popupPadding = formValues.popupPadding;
	let popupOpacity = formValues.popupOpacity / 100;
	let popupTextFontSize = formValues.popupTextFontSize;
	if ( 'mobile' === device ) {
		popupWidth = formValues.popupWidthMobile;
		popupCornerRadius = formValues.popupCornerRadiusMobile;
		popupPadding = formValues.popupPaddingMobile;
		popupOpacity = formValues.popupOpacityMobile / 100;
		popupTextFontSize = formValues.popupTextFontSizeMobile;
	}
	if ( 'tablet' === device ) {
		popupWidth = formValues.popupWidthTablet;
		popupCornerRadius = formValues.popupCornerRadiusTablet;
		popupPadding = formValues.popupPaddingTablet;
		popupOpacity = formValues.popupOpacityTablet / 100;
		popupTextFontSize = formValues.popupTextFontSizeTablet;
	}
	const args = {
		message,
		fadeIn: formValues.popupFadeIn,
		fadeOut: formValues.popupFadeOut,
		timeout: formValues.popupTimeout,
		centerY: false,
		centerX: true,
		showOverlay: true,
		css: {
			width: popupWidth + '%',
			left: ( ( 100 - popupWidth ) / 2 ) + '%',
			top: topOffset,
			bottom: formValues.popupVerticalAlign === 'verticalEnd' ? top + 'px' : 'unset',
			border: 'none',
			padding: popupPadding + 'px',
			backgroundColor,
			'-webkit-border-radius': popupCornerRadius + 'px',
			'-moz-border-radius': popupCornerRadius + 'px',
			'border-radius': popupCornerRadius + 'px',
			opacity: popupOpacity,
			color: textColor,
			textAlign: formValues.popupTextAlign,
			cursor: ( type == 'loading' ) ? 'wait' : 'default',
			'font-size': popupTextFontSize,
			'line-height': 1.25,
		},
		overlayCSS: {
			backgroundColor: formValues.popupOverlayBackgroundColor,
			opacity: formValues.popupOverlayBackgroundOpacity,
		},
		baseZ: formValues.popupZindex,
	};
	console.log( args );
	jQuery.blockUI( args );
};

const AppearanceScreen = ( props ) => {
	const [ defaults, getDefaults ] = useAsyncResource(
		retrieveAppearanceOptions,
		[],
	);
	return (
		<ErrorBoundary
			fallback={
				<p>
					{ __( 'Could not load appearance options.', 'highlight-and-share' ) }
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
	const [ device, setDevice ] = useState( 'desktop' );

	const getAdminBarHeight = () => {
		const adminBar = document.getElementById( 'wpadminbar' );
		if ( null !== adminBar ) {
			return adminBar.offsetHeight;
		}
		return 0;
	};

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
			popupBackgroundColorLoading: data.popupBackgroundColorLoading,
			popupTextColorLoading: data.popupTextColorLoading,
			popupBackgroundColorSuccess: data.popupBackgroundColorSuccess,
			popupTextColorSuccess: data.popupTextColorSuccess,
			popupBackgroundColorError: data.popupBackgroundColorError,
			popupTextColorError: data.popupTextColorError,
			popupOverlayBackgroundColor: data.popupOverlayBackgroundColor,
			popupOverlayBackgroundOpacity: data.popupOverlayBackgroundOpacity,
			popupOpacity: data.popupOpacity,
			popupOpacityTablet: data.popupOpacityTablet,
			popupOpacityMobile: data.popupOpacityMobile,
			popupCornerRadius: data.popupCornerRadius,
			popupCornerRadiusTablet: data.popupCornerRadiusTablet,
			popupCornerRadiusMobile: data.popupCornerRadiusMobile,
			popupMarginTop: data.popupMarginTop,
			popupMarginTopTablet: data.popupMarginTopTablet,
			popupMarginTopMobile: data.popupMarginTopMobile,
			popupWidth: data.popupWidth,
			popupWidthTablet: data.popupWidthTablet,
			popupWidthMobile: data.popupWidthMobile,
			popupPadding: data.popupPadding,
			popupPaddingTablet: data.popupPaddingTablet,
			popupPaddingMobile: data.popupPaddingMobile,
			popupFadeIn: data.popupFadeIn,
			popupFadeOut: data.popupFadeOut,
			popupTimeout: data.popupTimeout,
			popupTextAlign: data.popupTextAlign,
			popupVerticalAlign: data.popupVerticalAlign,
			popupTextFontSize: data.popupTextFontSize,
			popupTextFontSizeTablet: data.popupTextFontSizeTablet,
			popupTextFontSizeMobile: data.popupTextFontSizeMobile,
			popupZindex: data.popupZindex,
			saveNonce: wpacAdminAppearance.saveNonce,
			resetNonce: wpacAdminAppearance.resetNonce,
			caller: 'appearance',
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
					{ __( 'Appearance Settings', 'wp-ajaxify-comments' ) }
				</h2>
				<p className="description">
					{ __(
						'Adjust the appearance of Ajaxify comments and see a preview of how it will look on the frontend.',
						'wp-ajaxify-comments',
					) }
				</p>
			</>
		);
	};

	/**
	 * Get the device icon.
	 *
	 * @return {Element} The device icon.
	 */
	const getDeviceIcon = () => {
		if ( 'desktop' === device ) {
			return <Icon icon={ desktop } />;
		}
		if ( 'tablet' === device ) {
			return <Icon icon={ tablet } />;
		}
		if ( 'mobile' === device ) {
			return <Icon icon={ mobile } />;
		}
		return null;
	};

	return (
		<>
			<div className="ajaxify-admin-panel-area">
				{ getCommentEditingHeader() }
				<form onSubmit={ handleSubmit( onSubmit ) }>
					<div className="ajaxify-admin-appearance-preview-row" style={ { position: 'sticky', top: ( getAdminBarHeight() + 5 ) + 'px' } }>
						<div className="ajaxify-admin-appearance-preview-row__buttons">
							<Button
								onClick={ ( e ) => {
									e.preventDefault();
									showPreview( formValues, 'loading', device );
								} }
								icon={ getDeviceIcon() }
								className="ajaxify-button ajaxify__btn-info ajaxify-admin__preview-button"
								variant="secondary"
							>
								{ __( 'Preview Loading', 'wp-ajaxify-comments' ) }
							</Button>
							<Button
								onClick={ ( e ) => {
									e.preventDefault();
									showPreview( formValues, 'success', device );
								} }
								icon={ getDeviceIcon() }
								className="ajaxify-button ajaxify__btn-info ajaxify-admin__preview-button"
								variant="secondary"
							>
								{ __( 'Preview Success', 'wp-ajaxify-comments' ) }
							</Button>
							<Button
								onClick={ ( e ) => {
									e.preventDefault();
									showPreview( formValues, 'error', device );
								} }
								icon={ getDeviceIcon() }
								className="ajaxify-button ajaxify__btn-info ajaxify-admin__preview-button"
								variant="secondary"
							>
								{ __( 'Preview Error', 'wp-ajaxify-comments' ) }
							</Button>
						</div>
					</div>
					<table className="form-table form-table-row-sections">
						<tbody>
							<tr>
								<th scope="row">{ __( 'Overlay Colors', 'wp-ajaxify-comments' ) }</th>
								<td>
									<div className="ajaxify-admin__control-row">
										<p className="description">
											{ __(
												'Adjust the colors of the popup and launch a preview below.', 'wp-ajaxify-comments',
											) }
										</p>
									</div>
									<div className="ajaxify-admin__control-row">
										<Controller
											name="popupOverlayBackgroundColor"
											control={ control }
											render={ ( { field: { onChange, value } } ) => (
												<>
													<ColorPickerControl
														value={ value }
														key={ 'popup-overlay-background-color' }
														onChange={ ( slug, newValue, hex ) => {
															onChange( hex );
														} }
														opacity={ getValues( 'popupOverlayBackgroundOpacity' ) }
														label={ __( 'Overlay Background Color', 'wp-ajaxify-comments' ) }
														defaultColors={ defaultPalette }
														defaultColor={ '#000000' }
														onOpacityChange={ ( opacity ) => {
															setValue( 'popupOverlayBackgroundOpacity', opacity );
														} }
														alpha={ true }
														slug={ 'popup-overlay-background-color' }
													/>
												</>
											) }
										/>
									</div>
									<div className="ajaxify-admin__control-row">
										<Controller
											name="popupBackgroundColorLoading"
											control={ control }
											render={ ( { field: { onChange, value } } ) => (
												<>
													<ColorPickerControl
														value={ value }
														key={ 'popup-background-color-loading' }
														onChange={ ( slug, newValue ) => {
															onChange( newValue );
														} }
														label={ __( 'Loading Background Color', 'wp-ajaxify-comments' ) }
														defaultColors={ defaultPalette }
														defaultColor={ '#000000' }
														slug={ 'popup-background-color-loading' }
													/>
												</>
											) }
										/>
									</div>
									<div className="ajaxify-admin__control-row">
										<Controller
											name="popupTextColorLoading"
											control={ control }
											render={ ( { field: { onChange, value } } ) => (
												<>
													<ColorPickerControl
														value={ value }
														key={ 'popup-text-color-loading' }
														onChange={ ( slug, newValue ) => {
															onChange( newValue );
														} }
														label={ __( 'Loading Text Color', 'wp-ajaxify-comments' ) }
														defaultColors={ defaultPalette }
														defaultColor={ '#FFFFFF' }
														slug={ 'popup-text-color-loading' }
													/>
												</>
											) }
										/>
									</div>
									<div className="ajaxify-admin__control-row">
										<Controller
											name="popupBackgroundColorSuccess"
											control={ control }
											render={ ( { field: { onChange, value } } ) => (
												<>
													<ColorPickerControl
														value={ value }
														key={ 'popup-background-color-success-loading' }
														onChange={ ( slug, newValue ) => {
															onChange( newValue );
														} }
														label={ __( 'Success Loading Background Color', 'wp-ajaxify-comments' ) }
														defaultColors={ defaultPalette }
														defaultColor={ '#008000' }
														slug={ 'popup-background-color-success-loading' }
													/>
												</>
											) }
										/>
									</div>
									<div className="ajaxify-admin__control-row">
										<Controller
											name="popupTextColorSuccess"
											control={ control }
											render={ ( { field: { onChange, value } } ) => (
												<>
													<ColorPickerControl
														value={ value }
														key={ 'popup-text-color-success-loading' }
														onChange={ ( slug, newValue ) => {
															onChange( newValue );
														} }
														label={ __( 'Success Loading Text Color', 'wp-ajaxify-comments' ) }
														defaultColors={ defaultPalette }
														defaultColor={ '#000000' }
														slug={ 'popup-text-color-success-loading' }
													/>
												</>
											) }
										/>
									</div>
									<div className="ajaxify-admin__control-row">
										<Controller
											name="popupBackgroundColorError"
											control={ control }
											render={ ( { field: { onChange, value } } ) => (
												<>
													<ColorPickerControl
														value={ value }
														key={ 'popup-background-color-error-loading' }
														onChange={ ( slug, newValue ) => {
															onChange( newValue );
														} }
														label={ __( 'Error Loading Background Color', 'wp-ajaxify-comments' ) }
														defaultColors={ defaultPalette }
														defaultColor={ '#ff0000' }
														slug={ 'popup-background-color-error-loading' }
													/>
												</>
											) }
										/>
									</div>
									<div className="ajaxify-admin__control-row">
										<Controller
											name="popupTextColorError"
											control={ control }
											render={ ( { field: { onChange, value } } ) => (
												<>
													<ColorPickerControl
														value={ value }
														key={ 'popup-text-color-error-loading' }
														onChange={ ( slug, newValue ) => {
															onChange( newValue );
														} }
														label={ __( 'Error Loading Text Color', 'wp-ajaxify-comments' ) }
														defaultColors={ defaultPalette }
														defaultColor={ '#000000' }
														slug={ 'popup-text-color-error-loading' }
													/>
												</>
											) }
										/>
									</div>
								</td>
							</tr>
							<tr>
								<th scope="row">{ __( 'Spacing and Opacity', 'wp-ajaxify-comments' ) }</th>
								<td>
									<div className="ajaxify-admin__control-row">
										<div className="ajaxify-admin__control-devices">
											<ResponsiveTabs
												onChange={ ( newDevice ) => {
													setDevice( newDevice );
												} }
												device={ device }
											/>
										</div>
										{ 'desktop' === device && (
											<Controller
												name="popupOpacity"
												control={ control }
												render={ ( { field: { onChange, value } } ) => (
													<>
														<RangeControl
															label={ __( 'Overlay Opacity %', 'wp-ajaxify-comments' ) }
															value={ value }
															onChange={ onChange }
															min={ 0 }
															max={ 100 }
															step={ 1 }
															help={ __( 'Adjust the opacity of the overlay.', 'wp-ajaxify-comments' ) }
															color="var(--ajaxify-admin--color-main)"
															trackColor="var(--ajaxify-admin--color-main)"
															resetFallbackValue={ 70 }
															allowReset={ true }
														/>
													</>
												) }
											/>
										) }
										{ 'tablet' === device && (
											<Controller
												name="popupOpacityTablet"
												control={ control }
												render={ ( { field: { onChange, value } } ) => (
													<>
														<RangeControl
															label={ __( 'Overlay Opacity %', 'wp-ajaxify-comments' ) }
															value={ value }
															onChange={ onChange }
															min={ 0 }
															max={ 100 }
															step={ 1 }
															help={ __( 'Adjust the opacity of the overlay.', 'wp-ajaxify-comments' ) }
															color="var(--ajaxify-admin--color-main)"
															trackColor="var(--ajaxify-admin--color-main)"
															resetFallbackValue={ 70 }
															allowReset={ true }
														/>
													</>
												) }
											/>
										) }
										{ 'mobile' === device && (
											<Controller
												name="popupOpacityMobile"
												control={ control }
												render={ ( { field: { onChange, value } } ) => (
													<>
														<RangeControl
															label={ __( 'Overlay Opacity %', 'wp-ajaxify-comments' ) }
															value={ value }
															onChange={ onChange }
															min={ 0 }
															max={ 100 }
															step={ 1 }
															help={ __( 'Adjust the opacity of the overlay.', 'wp-ajaxify-comments' ) }
															color="var(--ajaxify-admin--color-main)"
															trackColor="var(--ajaxify-admin--color-main)"
															resetFallbackValue={ 70 }
															allowReset={ true }
														/>
													</>
												) }
											/>
										) }
									</div>
									<div className="ajaxify-admin__control-row">
										<div className="ajaxify-admin__control-devices">
											<ResponsiveTabs
												onChange={ ( newDevice ) => {
													setDevice( newDevice );
												} }
												device={ device }
											/>
										</div>
										{ 'desktop' === device && (
											<Controller
												name="popupCornerRadius"
												control={ control }
												render={ ( { field: { onChange, value } } ) => (
													<>
														<RangeControl
															label={ __( 'Popup Corner Radius (px)', 'wp-ajaxify-comments' ) }
															value={ value }
															onChange={ onChange }
															min={ 0 }
															max={ 100 }
															step={ 1 }
															help={ __( 'Adjust the corner radius of the overlay (in pixels).', 'wp-ajaxify-comments' ) }
															color="var(--ajaxify-admin--color-main)"
															trackColor="var(--ajaxify-admin--color-main)"
															resetFallbackValue={ 5 }
															allowReset={ true }
														/>
													</>
												) }
											/>
										) }
										{ 'tablet' === device && (
											<Controller
												name="popupCornerRadiusTablet"
												control={ control }
												render={ ( { field: { onChange, value } } ) => (
													<>
														<RangeControl
															label={ __( 'Popup Corner Radius (px)', 'wp-ajaxify-comments' ) }
															value={ value }
															onChange={ onChange }
															min={ 0 }
															max={ 100 }
															step={ 1 }
															help={ __( 'Adjust the corner radius of the overlay (in pixels).', 'wp-ajaxify-comments' ) }
															color="var(--ajaxify-admin--color-main)"
															trackColor="var(--ajaxify-admin--color-main)"
															resetFallbackValue={ 5 }
															allowReset={ true }
														/>
													</>
												) }
											/>
										) }
										{ 'mobile' === device && (
											<Controller
												name="popupCornerRadiusMobile"
												control={ control }
												render={ ( { field: { onChange, value } } ) => (
													<>
														<RangeControl
															label={ __( 'Popup Corner Radius (px)', 'wp-ajaxify-comments' ) }
															value={ value }
															onChange={ onChange }
															min={ 0 }
															max={ 100 }
															step={ 1 }
															help={ __( 'Adjust the corner radius of the overlay (in pixels).', 'wp-ajaxify-comments' ) }
															color="var(--ajaxify-admin--color-main)"
															trackColor="var(--ajaxify-admin--color-main)"
															resetFallbackValue={ 5 }
															allowReset={ true }
														/>
													</>
												) }
											/>
										) }
									</div>
									<div className="ajaxify-admin__control-row">
										<div className="ajaxify-admin__control-devices">
											<ResponsiveTabs
												onChange={ ( newDevice ) => {
													setDevice( newDevice );
												} }
												device={ device }
											/>
										</div>
										{ 'desktop' === device && (
											<Controller
												name="popupMarginTop"
												control={ control }
												render={ ( { field: { onChange, value } } ) => (
													<>
														<RangeControl
															label={ __( 'Popup Margin Top (px)', 'wp-ajaxify-comments' ) }
															value={ value }
															onChange={ onChange }
															min={ 0 }
															max={ 100 }
															step={ 1 }
															help={ __( 'Adjust the margin top value of the overlay (in pixels).', 'wp-ajaxify-comments' ) }
															color="var(--ajaxify-admin--color-main)"
															trackColor="var(--ajaxify-admin--color-main)"
															resetFallbackValue={ 10 }
															allowReset={ true }
														/>
													</>
												) }
											/>
										) }
										{ 'tablet' === device && (
											<Controller
												name="popupMarginTopTablet"
												control={ control }
												render={ ( { field: { onChange, value } } ) => (
													<>
														<RangeControl
															label={ __( 'Popup Margin Top (px)', 'wp-ajaxify-comments' ) }
															value={ value }
															onChange={ onChange }
															min={ 0 }
															max={ 100 }
															step={ 1 }
															help={ __( 'Adjust the margin top value of the overlay (in pixels).', 'wp-ajaxify-comments' ) }
															color="var(--ajaxify-admin--color-main)"
															trackColor="var(--ajaxify-admin--color-main)"
															resetFallbackValue={ 10 }
															allowReset={ true }
														/>
													</>
												) }
											/>
										) }
										{ 'mobile' === device && (
											<Controller
												name="popupMarginTopMobile"
												control={ control }
												render={ ( { field: { onChange, value } } ) => (
													<>
														<RangeControl
															label={ __( 'Popup Margin Top (px)', 'wp-ajaxify-comments' ) }
															value={ value }
															onChange={ onChange }
															min={ 0 }
															max={ 100 }
															step={ 1 }
															help={ __( 'Adjust the margin top value of the overlay (in pixels).', 'wp-ajaxify-comments' ) }
															color="var(--ajaxify-admin--color-main)"
															trackColor="var(--ajaxify-admin--color-main)"
															resetFallbackValue={ 10 }
															allowReset={ true }
														/>
													</>
												) }
											/>
										) }
									</div>
									<div className="ajaxify-admin__control-row">
										<ResponsiveTabs
											onChange={ ( newDevice ) => {
												setDevice( newDevice );
											} }
											device={ device }
										/>
										{ 'desktop' === device && (
											<Controller
												name="popupWidth"
												control={ control }
												render={ ( { field: { onChange, value } } ) => (
													<>
														<RangeControl
															label={ __( 'Popup Width (%)', 'wp-ajaxify-comments' ) }
															value={ value }
															onChange={ onChange }
															min={ 0 }
															max={ 100 }
															step={ 1 }
															help={ __( 'Adjust the width value as a percentage.', 'wp-ajaxify-comments' ) }
															color="var(--ajaxify-admin--color-main)"
															trackColor="var(--ajaxify-admin--color-main)"
															resetFallbackValue={ 30 }
															allowReset={ true }
														/>
													</>
												) }
											/>
										) }
										{ 'tablet' === device && (
											<Controller
												name="popupWidthTablet"
												control={ control }
												render={ ( { field: { onChange, value } } ) => (
													<>
														<RangeControl
															label={ __( 'Popup Width (%)', 'wp-ajaxify-comments' ) }
															value={ value }
															onChange={ onChange }
															min={ 0 }
															max={ 100 }
															step={ 1 }
															help={ __( 'Adjust the width value as a percentage.', 'wp-ajaxify-comments' ) }
															color="var(--ajaxify-admin--color-main)"
															trackColor="var(--ajaxify-admin--color-main)"
															resetFallbackValue={ 30 }
															allowReset={ true }
														/>
													</>
												) }
											/>
										) }
										{ 'mobile' === device && (
											<Controller
												name="popupWidthMobile"
												control={ control }
												render={ ( { field: { onChange, value } } ) => (
													<>
														<RangeControl
															label={ __( 'Popup Width (%)', 'wp-ajaxify-comments' ) }
															value={ value }
															onChange={ onChange }
															min={ 0 }
															max={ 100 }
															step={ 1 }
															help={ __( 'Adjust the width value as a percentage.', 'wp-ajaxify-comments' ) }
															color="var(--ajaxify-admin--color-main)"
															trackColor="var(--ajaxify-admin--color-main)"
															resetFallbackValue={ 30 }
															allowReset={ true }
														/>
													</>
												) }
											/>
										) }
									</div>
									<div className="ajaxify-admin__control-row">
										<ResponsiveTabs
											onChange={ ( newDevice ) => {
												setDevice( newDevice );
											} }
											device={ device }
										/>
										{ 'desktop' === device && (
											<Controller
												name="popupPadding"
												control={ control }
												render={ ( { field: { onChange, value } } ) => (
													<>
														<RangeControl
															label={ __( 'Popup Padding (px)', 'wp-ajaxify-comments' ) }
															value={ value }
															onChange={ onChange }
															min={ 0 }
															max={ 100 }
															step={ 1 }
															help={ __( 'Adjust the padding value of the popup in pixels.', 'wp-ajaxify-comments' ) }
															color="var(--ajaxify-admin--color-main)"
															trackColor="var(--ajaxify-admin--color-main)"
															resetFallbackValue={ 5 }
															allowReset={ true }
														/>
													</>
												) }
											/>
										) }
										{ 'tablet' === device && (
											<Controller
												name="popupPaddingTablet"
												control={ control }
												render={ ( { field: { onChange, value } } ) => (
													<>
														<RangeControl
															label={ __( 'Popup Padding (px)', 'wp-ajaxify-comments' ) }
															value={ value }
															onChange={ onChange }
															min={ 0 }
															max={ 100 }
															step={ 1 }
															help={ __( 'Adjust the padding value of the popup in pixels.', 'wp-ajaxify-comments' ) }
															color="var(--ajaxify-admin--color-main)"
															trackColor="var(--ajaxify-admin--color-main)"
															resetFallbackValue={ 5 }
															allowReset={ true }
														/>
													</>
												) }
											/>
										) }
										{ 'mobile' === device && (
											<Controller
												name="popupPaddingMobile"
												control={ control }
												render={ ( { field: { onChange, value } } ) => (
													<>
														<RangeControl
															label={ __( 'Popup Padding (px)', 'wp-ajaxify-comments' ) }
															value={ value }
															onChange={ onChange }
															min={ 0 }
															max={ 100 }
															step={ 1 }
															help={ __( 'Adjust the padding value of the popup in pixels.', 'wp-ajaxify-comments' ) }
															color="var(--ajaxify-admin--color-main)"
															trackColor="var(--ajaxify-admin--color-main)"
															resetFallbackValue={ 5 }
															allowReset={ true }
														/>
													</>
												) }
											/>
										) }
									</div>
								</td>
							</tr>
							<tr>
								<th scope="row">{ __( 'Popover Text Styles', 'wp-ajaxify-comments' ) }</th>
								<td>
									<div className="ajaxify-admin__control-row">
										<ResponsiveTabs
											onChange={ ( newDevice ) => {
												setDevice( newDevice );
											} }
											device={ device }
										/>
										{ 'desktop' === device && (
											<Controller
												name="popupTextFontSize"
												control={ control }
												rules={ { required: true } }
												render={ ( { field: { onChange, value } } ) => (
													<>
														<TextControl
															label={ __( 'Font Size', 'wp-ajaxify-comments' ) }
															type="text"
															className={ classNames( 'ajaxify-admin__text-control', {
																'has-error': 'required' === errors.popupFadeIn?.type,
																'has-error': 'pattern' === errors.popupFadeIn?.type,
																'is-required': true,
															} ) }
															help={ __( 'Font size (e.g. "14px", "1.1em")', 'wp-ajaxify-comments' ) }
															aria-required="true"
															value={ value }
															onChange={ onChange }
														/>
														{ 'required' === errors.popupTextFontSize?.type && (
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
										) }
										{ 'tablet' === device && (
											<Controller
												name="popupTextFontSizeTablet"
												control={ control }
												rules={ { required: true } }
												render={ ( { field: { onChange, value } } ) => (
													<>
														<TextControl
															label={ __( 'Font Size', 'wp-ajaxify-comments' ) }
															type="text"
															className={ classNames( 'ajaxify-admin__text-control', {
																'has-error': 'required' === errors.popupFadeIn?.type,
																'has-error': 'pattern' === errors.popupFadeIn?.type,
																'is-required': true,
															} ) }
															help={ __( 'Font size (e.g. "14px", "1.1em")', 'wp-ajaxify-comments' ) }
															aria-required="true"
															value={ value }
															onChange={ onChange }
														/>
														{ 'required' === errors.popupTextFontSize?.type && (
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
										) }
										{ 'mobile' === device && (
											<Controller
												name="popupTextFontSizeMobile"
												control={ control }
												rules={ { required: true } }
												render={ ( { field: { onChange, value } } ) => (
													<>
														<TextControl
															label={ __( 'Font Size', 'wp-ajaxify-comments' ) }
															type="text"
															className={ classNames( 'ajaxify-admin__text-control', {
																'has-error': 'required' === errors.popupFadeIn?.type,
																'has-error': 'pattern' === errors.popupFadeIn?.type,
																'is-required': true,
															} ) }
															help={ __( 'Font size (e.g. "14px", "1.1em")', 'wp-ajaxify-comments' ) }
															aria-required="true"
															value={ value }
															onChange={ onChange }
														/>
														{ 'required' === errors.popupTextFontSize?.type && (
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
										) }
									</div>
									<div className="ajaxify-admin__control-row">
										<Controller
											name="popupTextAlign"
											control={ control }
											render={ ( { field: { onChange, value } } ) => (
												<>
													<AlignmentGroup
														alignment={ value }
														onClick={ onChange }
														label={ __( 'Text Alignment', 'wp-ajaxify-comments' ) }
														alignLeftLabel={ __( 'Left', 'wp-ajaxify-comments' ) }
														alignCenterLabel={ __( 'Center', 'wp-ajaxify-comments' ) }
														alignRightLabel={ __( 'Right', 'wp-ajaxify-comments' ) }
														leftOn={ true }
														centerOn={ true }
														rightOn={ true }
													/>
												</>
											) }
										/>
									</div>
									<div className="ajaxify-admin__control-row">
										<Controller
											name="popupVerticalAlign"
											control={ control }
											render={ ( { field: { onChange, value } } ) => (
												<>
													<VerticalAlignmentGroup
														alignment={ value }
														onClick={ onChange }
														label={ __( 'Vertical Alignment', 'wp-ajaxify-comments' ) }
														verticalStartOn={ true }
														verticalCenterOn={ true }
														verticalEndOn={ true }
													/>
												</>
											) }
										/>
									</div>
								</td>
							</tr>
							<tr>
								<th scope="row">{ __( 'Timing and Transitions', 'wp-ajaxify-comments' ) }</th>
								<td>
									<div className="ajaxify-admin__control-row">
										<Controller
											name="popupFadeIn"
											control={ control }
											rules={ { required: true, pattern: /\d+/ } }
											render={ ( { field: { onChange, value } } ) => (
												<>
													<TextControl
														label={ __( 'Fade in time (ms)', 'wp-ajaxify-comments' ) }
														type="number"
														className={ classNames( 'ajaxify-admin__text-control', {
															'has-error': 'required' === errors.popupFadeIn?.type,
															'has-error': 'pattern' === errors.popupFadeIn?.type,
															'is-required': true,
														} ) }
														help={ __( 'The fade in time in milliseconds.', 'wp-ajaxify-comments' ) }
														aria-required="true"
														value={ value }
														onChange={ onChange }
													/>
													{ 'pattern' === errors.popupFadeIn?.type && (
														<Notice
															message={ __(
																'Please enter only integers.',
																'wp-ajaxify-comments',
															) }
															status="error"
															politeness="assertive"
															inline={ false }
															icon={ () => ( <AlertCircle /> ) }
														/>
													) }
													{ 'required' === errors.popupFadeIn?.type && (
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
											name="popupFadeOut"
											control={ control }
											rules={ { required: true, pattern: /\d+/ } }
											render={ ( { field: { onChange, value } } ) => (
												<>
													<TextControl
														label={ __( 'Fade out time (ms)', 'wp-ajaxify-comments' ) }
														type="number"
														className={ classNames( 'ajaxify-admin__text-control', {
															'has-error': 'required' === errors.popupFadeOut?.type,
															'has-error': 'pattern' === errors.popupFadeOut?.type,
															'is-required': true,
														} ) }
														help={ __( 'The fade out time in milliseconds.', 'wp-ajaxify-comments' ) }
														aria-required="true"
														value={ value }
														onChange={ onChange }
													/>
													{ 'pattern' === errors.popupFadeOut?.type && (
														<Notice
															message={ __(
																'Please enter only integers.',
																'wp-ajaxify-comments',
															) }
															status="error"
															politeness="assertive"
															inline={ false }
															icon={ () => ( <AlertCircle /> ) }
														/>
													) }
													{ 'required' === errors.popupFadeOut?.type && (
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
											name="popupTimeout"
											control={ control }
											rules={ { required: true, pattern: /\d+/ } }
											render={ ( { field: { onChange, value } } ) => (
												<>
													<TextControl
														label={ __( 'Popover Timeout (ms)', 'wp-ajaxify-comments' ) }
														type="number"
														className={ classNames( 'ajaxify-admin__text-control', {
															'has-error': 'required' === errors.popupTimeout?.type,
															'has-error': 'pattern' === errors.popupTimeout?.type,
															'is-required': true,
														} ) }
														help={ __( 'How long should the popover display in milliseconds.', 'wp-ajaxify-comments' ) }
														aria-required="true"
														value={ value }
														onChange={ onChange }
													/>
													{ 'pattern' === errors.popupTimeout?.type && (
														<Notice
															message={ __(
																'Please enter only integers.',
																'wp-ajaxify-comments',
															) }
															status="error"
															politeness="assertive"
															inline={ false }
															icon={ () => ( <AlertCircle /> ) }
														/>
													) }
													{ 'required' === errors.popupTimeout?.type && (
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
								</td>
							</tr>
							<tr>
								<th scope="row">{ __( 'Popover Z-Index', 'wp-ajaxify-comments' ) }</th>
								<td>
									<div className="ajaxify-admin__control-row">
										<Controller
											name="popupZindex"
											control={ control }
											rules={ { required: true, pattern: /\d+/ } }
											render={ ( { field: { onChange, value } } ) => (
												<>
													<TextControl
														label={ __( 'Overlay Z-Index', 'wp-ajaxify-comments' ) }
														type="number"
														className={ classNames( 'ajaxify-admin__text-control', {
															'has-error': 'required' === errors.popupZindex?.type,
															'has-error': 'pattern' === errors.popupZindex?.type,
															'is-required': true,
														} ) }
														help={ __( 'Set the z-index of the overlay popover.', 'wp-ajaxify-comments' ) }
														aria-required="true"
														value={ value }
														onChange={ onChange }
													/>
													{ 'pattern' === errors.popupZindex?.type && (
														<Notice
															message={ __(
																'Please enter only integers.',
																'wp-ajaxify-comments',
															) }
															status="error"
															politeness="assertive"
															inline={ false }
															icon={ () => ( <AlertCircle /> ) }
														/>
													) }
													{ 'required' === errors.popupZindex?.type && (
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
export default AppearanceScreen;
