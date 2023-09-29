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
import { AlertCircle, Loader2, ClipboardCheck, Code } from 'lucide-react';
import ErrorBoundary from '../../components/ErrorBoundary';
import SendCommand from '../../utils/SendCommand';
import Notice from '../../components/Notice';
import ColorPickerControl from '../../components/ColorPicker';
import AlignmentGroup from '../../components/Alignment';
import SaveResetButtons from '../../components/SaveResetButtons';

const retrieveLazyLoadOptions = () => {
	return SendCommand( 'wpac_get_lazy_load_options', {
		nonce: wpacAdminLazyLoad.getNonce,
	} );
};

const cssRegex = /^(?:(?:\*|(?:[a-z0-9_-]+(?:\|[a-z0-9_-]+)?))|\[(?:[a-z0-9_-]+)(?:=[\'"]?(.*?)[\'"]?)?\]|#[a-z0-9_-]+|\.(?:[a-z0-9_-]+))+(?:\s*,\s*(?:(?:\*|(?:[a-z0-9_-]+(?:\|[a-z0-9_-]+)?))|\[(?:[a-z0-9_-]+)(?:=[\'"]?(.*?)[\'"]?)?\]|#[a-z0-9_-]+|\.(?:[a-z0-9_-]+))+)*/i;

const defaultPalette = wpacAdminLazyLoad.palette;


const LazyLoadScreen = ( props ) => {
	const [ defaults, getDefaults ] = useAsyncResource(
		retrieveLazyLoadOptions,
		[],
	);
	return (
		<ErrorBoundary
			fallback={
				<p>
					{ __( 'Could not load Lazy Load options.', 'highlight-and-share' ) }
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
			caller: 'lazy-load',
			lazyLoadEnabled: data.lazyLoadEnabled,
			lazyLoadDisplay: data.lazyLoadDisplay,
			lazyLoadInlineLoadingType: data.lazyLoadInlineLoadingType,
			lazyLoadTrigger: data.lazyLoadTrigger,
			lazyLoadTriggerElement: data.lazyLoadTriggerElement,
			lazyLoadPaginationEnabled: data.lazyLoadPaginationEnabled,
			lazyLoadCommentsPerPage: data.lazyLoadCommentsPerPage,
			lazyLoadUseThemePagination: data.lazyLoadUseThemePagination,
			lazyLoadPaginationStyle: data.lazyLoadPaginationStyle,
			lazyLoadPaginationLocation: data.lazyLoadPaginationLocation,
			lazyLoadingPaginationScrollToTop: data.lazyLoadingPaginationScrollToTop,
			lazyLoadTriggerScrollOffset: data.lazyLoadTriggerScrollOffset,
			saveNonce: wpacAdminLazyLoad.saveNonce,
			resetNonce: wpacAdminLazyLoad.resetNonce,
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
					{ __( 'Lazy Load Comments Settings', 'wp-ajaxify-comments' ) }
				</h2>
				<p className="description">
					{ __(
						'Lazy loading comments can help speed up your page load time, especially if you have a page with a lot of comments.',
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
								<th scope="row">{ __( 'Lazy Loading', 'wp-ajaxify-comments' ) }</th>
								<td>
									<div className="ajaxify-admin__control-row">
										<p className="description">
											{ __(
												'Determine if you would like to lazy load your comments.', 'wp-ajaxify-comments',
											) }
										</p>
									</div>
									<div className="ajaxify-admin__control-row">
										<Controller
											name="lazyLoadEnabled"
											control={ control }
											render={ ( { field: { onChange, value } } ) => (
												<>
													<ToggleControl
														label={ __( 'Enable Lazy Loading', 'wp-ajaxify-comments' ) }
														help={ __( 'Enable lazy loading of comments.', 'wp-ajaxify-comments' ) }
														checked={ value }
														onChange={ onChange }
													/>
												</>
											) }
										/>
									</div>
								</td>
							</tr>
							<tr>
								<th scope="row">{ __( 'Loading Trigger', 'wp-ajaxify-comments' ) }</th>
								<td>
									<div className="ajaxify-admin__control-row">
										<p className="description">
											{ __(
												'Choose how to load the comments. You can choose a specific location or even load comments in a custom container.', 'wp-ajaxify-comments',
											) }
										</p>
									</div>
									<div className="ajaxify-admin__control-row">
										<Controller
											name="lazyLoadTrigger"
											control={ control }
											render={ ( { field: { onChange, value } } ) => (
												<>
													<SelectControl
														label={ __( 'Trigger', 'wp-ajaxify-comments' ) }
														help={ __( 'Choose what triggers the comments to load.', 'wp-ajaxify-comments' ) }
														value={ value }
														onChange={ onChange }
														options={ [
															{ value: 'external', label: __( 'External Trigger', 'wp-ajaxify-comments' ) },
															{ value: 'comments', label: __( 'Comments Scrolled Into Viewport', 'wp-ajaxify-comments' ) },
															{ value: 'domready', label: __( 'Dom Ready', 'wp-ajaxify-comments' ) },
															{ value: 'element', label: __( 'Dom Element Reached', 'wp-ajaxify-comments' ) },
															{ value: 'scroll', label: __( 'Page Scroll Length', 'wp-ajaxify-comments' ) },
														] }
													/>
													{
														'external' === getValues( 'lazyLoadTrigger' ) && (
															<>
																<Notice
																	message={ __(
																		'You can trigger the comments to load externally by using the following JavaScript function: WPAC.RefreshComments();',
																		'wp-ajaxify-comments',
																	) }
																	status="info"
																	politeness="assertive"
																	inline={ false }
																	icon={ () => <Code /> }
																/>
															</>
														)
													}
												</>
											) }
										/>
									</div>
									{
										'element' === getValues( 'lazyLoadTrigger' ) && (
											<>
												<div className="ajaxify-admin__control-row">
													<Controller
														name="lazyLoadTriggerElement"
														control={ control }
														rules={ {
															pattern: {
																value: cssRegex,
																message: __( 'Please enter a valid CSS selector.', 'wp-ajaxify-comments' ),
															},
															required: true,
														} }
														render={ ( { field: { onChange, value } } ) => (
															<>
																<TextControl
																	label={ __( 'HTML ID, or Class', 'wp-ajaxify-comments' ) }
																	help={ __( 'Enter a CSS selector for the element that will trigger the comments to load.', 'wp-ajaxify-comments' ) }
																	value={ value }
																	onChange={ onChange }
																	className={ classNames( 'ajaxify-admin__text-control', {
																		'has-error': 'required' === errors.lazyLoadTriggerElement?.type || 'pattern' === errors.lazyLoadTriggerElement?.type,
																		'is-required': true,
																	} ) }
																/>
																{ errors.lazyLoadTriggerElement && (
																	<Notice
																		message={ __(
																			'A valid CSS selector must be entered.',
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
											</>
										)
									}
									{
										( 'scroll' === getValues( 'lazyLoadTrigger' ) || 'comments' === getValues( 'lazyLoadTrigger' ) || 'element' === getValues( 'lazyLoadTrigger' ) ) && (
											<>
												<div className="ajaxify-admin__control-row">
													<Controller
														name="lazyLoadTriggerScrollOffset"
														control={ control }
														rules={ {
															required: true,
															pattern: {
																value: /^[0-9]+$/,
																message: __( 'Please enter a valid number.', 'wp-ajaxify-comments' ),
															},
														} }
														render={ ( { field: { onChange, value } } ) => (
															<>
																<TextControl
																	label={ __( 'Scroll Offset', 'wp-ajaxify-comments' ) }
																	help={ 'scroll' === getValues( 'lazyLoadTrigger' ) ? __( 'Enter a vertical offset that is relative to the top viewport. Entering 0 will assume an offest of 100%.', 'wp-ajaxify-comments' ) : __( 'Enter a vertical offset for that will trigger loading a certain number of pixels above the element. Entering 0 will assume an offest of 100%.', 'wp-ajaxify-comments' ) }
																	value={ value }
																	type="number"
																	onChange={ onChange }
																	className={ classNames( 'ajaxify-admin__text-control', {
																		'has-error': 'required' === errors.lazyLoadTriggerScrollOffset?.type,
																		'is-required': true,
																	} ) }
																/>
																{ errors.lazyLoadTriggerScrollOffset && (
																	<Notice
																		message={ __(
																			'A valid number must be entered.',
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
											</>
										)
									}
									<div className="ajaxify-admin__control-row">

									</div>
								</td>
							</tr>
							<tr>
								<th scope="row">{ __( 'Loading Message', 'wp-ajaxify-comments' ) }</th>
								<td>
									<div className="ajaxify-admin__control-row">
										<p className="description">
											{ __(
												'While comments are loading, a loading message displays. How would you like to display the loading message?', 'wp-ajaxify-comments',
											) }
										</p>
									</div>
									<div className="ajaxify-admin__control-row">
										<Controller
											name="lazyLoadDisplay"
											control={ control }
											render={ ( { field: { onChange, value } } ) => (
												<>
													<SelectControl
														label={ __( 'Display', 'wp-ajaxify-comments' ) }
														help={ __( 'Choose how you would like to display the loading message. Choose None to not show any loading indicator.', 'wp-ajaxify-comments' ) }
														value={ value }
														onChange={ onChange }
														options={ [
															{ value: 'overlay', label: __( 'Overlay (default)', 'wp-ajaxify-comments' ) },
															{ value: 'inline', label: __( 'Inline', 'wp-ajaxify-comments' ) },
															{ value: 'none', label: __( 'None', 'wp-ajaxify-comments' ) },
														] }
													/>
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
export default LazyLoadScreen;
