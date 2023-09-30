/* eslint-disable no-unused-vars */
import React, { useState, Suspense, useEffect } from 'react';
import { useForm, Controller, useWatch, useFormState } from 'react-hook-form';
import classNames from 'classnames';
import { useAsyncResource } from 'use-async-resource';
import { __, sprintf } from '@wordpress/i18n';
import BeatLoader from 'react-spinners/BeatLoader';
import * as LoadingSvgs from '../../icons/loading/index';

import {
	TextControl,
	Button,
	ButtonGroup,
	ToggleControl,
	SelectControl,
	Popover,
	RangeControl,
	RadioControl,
	Card,
	CardHeader,
	CardBody,
	CardFooter,
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
	const [ selectLoadingSpinnerButtonRef, setSelectLoadingSpinnerButtonRef ] = useState( null );
	const [ showLoadingSpinnerPopover, setShowLoadingSpinnerPopover ] = useState( false );
	const [ showLoadingSpinnerAnimation, setShowLoadingSpinnerAnimation ] = useState( false );

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
			lazyLoadInlineSpinnerLabel: data.lazyLoadInlineSpinnerLabel,
			lazyLoadInlineSpinnerLabelEnabled: data.lazyLoadInlineSpinnerLabelEnabled,
			lazyLoadInlineSpinnerSpeed: data.lazyLoadInlineSpinnerSpeed,
			lazyLoadInlineSpinnerSize: data.lazyLoadInlineSpinnerSize,
			lazyLoadTrigger: data.lazyLoadTrigger,
			lazyLoadTriggerElement: data.lazyLoadTriggerElement,
			lazyLoadPaginationEnabled: data.lazyLoadPaginationEnabled,
			lazyLoadCommentsPerPage: data.lazyLoadCommentsPerPage,
			lazyLoadUseThemePagination: data.lazyLoadUseThemePagination,
			lazyLoadPaginationStyle: data.lazyLoadPaginationStyle,
			lazyLoadPaginationLocation: data.lazyLoadPaginationLocation,
			lazyLoadingPaginationScrollToTop: data.lazyLoadingPaginationScrollToTop,
			lazyLoadTriggerScrollOffset: data.lazyLoadTriggerScrollOffset,
			lazyLoadInlineSpinner: data.lazyLoadInlineSpinner,
			saveNonce: wpacAdminLazyLoad.saveNonce,
			resetNonce: wpacAdminLazyLoad.resetNonce,
			lazyLoadInlineSpinnerContainerBackgroundColor: data.lazyLoadInlineSpinnerContainerBackgroundColor,
			lazyLoadInlineSpinnerLabelFontSize: data.lazyLoadInlineSpinnerLabelFontSize,
			lazyLoadInlineSpinnerIconColor: data.lazyLoadInlineSpinnerIconColor,
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

	/**
	 * Returns a button group with all the available loading spinners.
	 *
	 * @return {JSX.Element} Button group with spinners.
	 */
	const getSpinners = () => {
		return (
			<ButtonGroup className="ajaxify-button-loading-svgs">
				{
					( Object.entries( LoadingSvgs ).map( ( [ key, SvgComponent ] ) => {
						return (
							<Button
								key={ key }
								isSmall
								isPressed={ getValues( 'lazyLoadInlineSpinner' ) === key }
								isPrimary={ getValues( 'lazyLoadInlineSpinner' ) === key }
								onClick={ () => {
									setValue( 'lazyLoadInlineSpinner', key );
								} }
								icon={ <SvgComponent width="64" height="64" /> }
								label={ key }
							/>
						);
					} ) )
				}
			</ButtonGroup>
		);
	};

	const getSpinnerOptions = () => {
		if ( 'spinner' !== getValues( 'lazyLoadInlineLoadingType' ) ) {
			return null;
		}
		const LoadingSpinner = LoadingSvgs[ getValues( 'lazyLoadInlineSpinner' ) ];
		return (
			<>
				<p className="description">
					{ __(
						'Choose a loading icon to display while comments are loading.', 'wp-ajaxify-comments',
					) }
				</p>
				<div className="ajaxify-icon-preview">
					<div className="ajaxify-icon-wrapper">
						<>
							<style>
								{
									`
									.ajaxify-icon-loading-animation-on {
										--ajaxify-lazy-load-spinner-speed: ${ getValues( 'lazyLoadInlineSpinnerSpeed' ) }s;
									}
									`
								}
							</style>
							<LoadingSpinner width="64" height="64" className={ showLoadingSpinnerAnimation ? 'ajaxify-icon-loading-animation-on' : '' } />
						</>
					</div>
					<div className="ajaxify-icon-spin-control">
						<Button
							variant="secondary"
							label={ showLoadingSpinnerAnimation ? __( 'Stop Animation', 'wp-ajaxify-comments' ) : __( 'Start Animation', 'wp-ajaxify-comments' ) }
							onClick={ () => {
								setShowLoadingSpinnerAnimation( ! showLoadingSpinnerAnimation );
							} }
						>
							{ showLoadingSpinnerAnimation ? __( 'Stop', 'wp-ajaxify-comments' ) : __( 'Spin', 'wp-ajaxify-comments' ) }
						</Button>
					</div>
				</div>
				<div className="ajaxify-admin__popover-inner ajaxify-admin__popover-svgs">
					{
						getSpinners()
					}
				</div>
				<div className="ajaxify-admin__control-row">

					<Controller
						name="lazyLoadInlineSpinnerSpeed"
						control={ control }
						render={ ( { field: { onChange, value } } ) => (
							<>
								<RangeControl
									label={ __( 'Animation Speed and Duration', 'wp-ajaxify-comments' ) }
									value={ value }
									onChange={ onChange }
									min={ 0.5 }
									max={ 3 }
									step={ 0.05 }
									type={ 'stepper' }
									allowReset={ false }
									color="var(--ajaxify-admin--color-main)"
									trackColor="var(--ajaxify-admin--color-main)"
									currentInput={ 1.2 }
									help={ __( 'Choose the time it takes for the loading animation to take place. For a faster animation, choose a lower value. For a slower animation, choose a higher value.', 'wp-ajaxify-comments' ) }
									initialPosition={ 1.2 }
									showTooltip={ true }
									separatorType={
										'topFullWidth'
									}
									marks={ [
										{
											value: 0.5,
											label: __( 'Fastest', 'wp-ajaxify-comments' ),
										},
										{
											value: 0.75,
											label: __( '0.75s', 'wp-ajaxify-comments' ),
										},
										{
											value: 1,
											label: __( '1', 'wp-ajaxify-comments' ),
										},
										{
											value: 1.25,
											label: __( '1.25s', 'wp-ajaxify-comments' ),
										},
										{
											value: 1.5,
											label: __( '1.5s', 'wp-ajaxify-comments' ),
										},
										{
											value: 1.75,
											label: __( '1.75s', 'wp-ajaxify-comments' ),
										},
										{
											value: 2,
											label: __( '2s', 'wp-ajaxify-comments' ),
										},
										{
											value: 2.5,
											label: __( '2.5s', 'wp-ajaxify-comments' ),
										},
										{
											value: 3,
											label: __( 'Slowest', 'wp-ajaxify-comments' ),
										},
									] }
									withInputField={ false }

								/>
							</>
						) }
					/>
				</div>
			</>
		);
	};

	const LoadingSpinnerPreview = LoadingSvgs[ getValues( 'lazyLoadInlineSpinner' ) ];

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
							{ 'inline' === getValues( 'lazyLoadDisplay' ) && (
								<>
									<tr>
										<th scope="row">{ __( 'Inline Loading', 'wp-ajaxify-comments' ) }</th>
										<td>
											<div className="ajaxify-admin__control-row">
												<p className="description">
													{ __(
														'If you choose to display the loading message inline, how would you like to display it?', 'wp-ajaxify-comments',
													) }
												</p>
											</div>
											<div className="ajaxify-admin__control-row">
												<Controller
													name="lazyLoadInlineLoadingType"
													control={ control }
													render={ ( { field: { onChange, value } } ) => (
														<>
															<SelectControl
																label={ __( 'Inline Loading Type', 'wp-ajaxify-comments' ) }
																help={ __( 'Choose how you would like to display the loading message.', 'wp-ajaxify-comments' ) }
																value={ value }
																onChange={ onChange }
																options={ [
																	{ value: 'spinner', label: __( 'Spinner (default)', 'wp-ajaxify-comments' ) },
																	{ value: 'skeleton', label: __( 'Loading Skeleton', 'wp-ajaxify-comments' ) },
																	{
																		value: 'button',
																		label: __( 'Loading Button', 'wp-ajaxify-comments' ),
																	},
																	{
																		value: 'shortcode',
																		label: __( 'Shortcode', 'wp-ajaxify-comments' ),
																	},
																] }
															/>
														</>
													) }
												/>
											</div>
										</td>
									</tr>
									<tr className="ajaxify-admin__loading-spinner-row">
										<th scope="row">
											{ __( 'Loading Spinner', 'wp-ajaxify-comments' ) }
										</th>
										<td>
											{
												getSpinnerOptions()
											}
										</td>
									</tr>
									<tr>
										<th scope="row">{ __( 'Loading Label', 'wp-ajaxify-comments' ) }</th>
										<td>
											<div className="ajaxify-admin__control-row">
												<Controller
													name="lazyLoadInlineSpinnerLabelEnabled"
													control={ control }
													render={ ( { field: { onChange, value } } ) => (
														<>
															<ToggleControl
																label={ __( 'Enable Label for Spinner', 'wp-ajaxify-comments' ) }
																help={ __( 'Show a loading label next to the spinner.', 'wp-ajaxify-comments' ) }
																checked={ value }
																onChange={ onChange }
															/>
														</>
													) }
												/>
											</div>
											{
												getValues( 'lazyLoadInlineSpinnerLabelEnabled' ) && (
													<div className="ajaxify-admin__control-row">
														<Controller
															name="lazyLoadInlineSpinnerLabel"
															control={ control }
															rules={ {
																required: true,
															} }
															render={ ( { field: { onChange, value } } ) => (
																<>
																	<TextControl
																		label={ __( 'Enter a label for the Spinner', 'wp-ajaxify-comments' ) }
																		help={ __( 'The label goes next to the spinner.', 'wp-ajaxify-comments' ) }
																		value={ value }
																		onChange={ onChange }
																		className={ classNames( 'ajaxify-admin__text-control', {
																			'has-error': 'required' === errors.lazyLoadInlineSpinnerLabel?.type,
																			'is-required': true,
																		} ) }
																	/>
																	{ errors?.lazyLoadInlineSpinnerLabel && (
																		<Notice
																			message={ __(
																				'This field is required.',
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
												)
											}
										</td>
									</tr>
									<tr>
										<th scope="row">{ __( 'Appearance and Preview', 'wp-ajaxify-comments' ) }</th>
										<td>
											<style>
												{
													`:root {
														--ajaxify-comments-spinner-container-background-color: ${ getValues( 'lazyLoadInlineSpinnerContainerBackgroundColor' ) };
														--ajaxify-comments-spinner-container-font-size: ${ getValues( 'lazyLoadInlineSpinnerLabelFontSize' ) }px;
														--ajaxify-comments-spinner-icon-color: ${ getValues( 'lazyLoadInlineSpinnerIconColor' ) };
														--ajaxify-comments-spinner-icon-size: ${ getValues( 'lazyLoadInlineSpinnerSize' ) }px;
														--ajaxify-comments-spinner-label-color: #FFFFFF;
														--ajaxify-comments-spinner-icon-margin-right: 20px;
														--ajaxify-comments-spinner-icon-animation-speed: ${ getValues( 'lazyLoadInlineSpinnerSpeed' ) }s;
														--ajaxify-comments-spinner-container-padding: 30px;
													}
												`
												}
											</style>
											<div className="ajaxify-admin__preview">
												<div className="ajaxify-comments-spinner__wrapper" aria-hidden="true">
													<div className="ajaxify-comments-spinner__inner">
														<div className="ajaxify-comments-spinner__icon">
															<LoadingSpinnerPreview width={ getValues( 'lazyLoadInlineSpinnerSize' ) } height={ getValues( 'lazyLoadInlineSpinnerSize' ) } className="ajaxify-icon-loading-animation-on" />
														</div>
														<div className="ajaxify-comments-spinner__label" aria-hidden="true">
															{ getValues( 'lazyLoadInlineSpinnerLabel' ) }
														</div>
													</div>
												</div>
											</div>
											<div className="ajaxify-admin__control-row">
												<Controller
													name="lazyLoadInlineSpinnerSize"
													control={ control }
													render={ ( { field: { onChange, value } } ) => (
														<>
															<RangeControl
																label={ __( 'Loading Icon Size', 'wp-ajaxify-comments' ) }
																value={ value }
																onChange={ onChange }
																min={ 16 }
																max={ 150 }
																step={ 1 }
																help={ __( 'Set the size of the loading icon.', 'wp-ajaxify-comments' ) }
																color="var(--ajaxify-admin--color-main)"
																trackColor="var(--ajaxify-admin--color-main)"
																resetFallbackValue={ 72 }
																allowReset={ true }
															/>
														</>
													) }
												/>
											</div>
											<div className="ajaxify-admin__control-row">
												<Controller
													name="lazyLoadInlineSpinnerContainerBackgroundColor"
													control={ control }
													render={ ( { field: { onChange, value } } ) => (
														<>
															<ColorPickerControl
																value={ value }
																key={ 'spinner-container-background-color' }
																onChange={ ( slug, newValue ) => {
																	onChange( newValue );
																} }
																label={ __( 'Background Color', 'wp-ajaxify-comments' ) }
																defaultColors={ defaultPalette }
																defaultColor={ '#000000' }
																slug={ 'spinner-container-background-color' }
															/>
														</>
													) }
												/>
											</div>
											<div className="ajaxify-admin__control-row">
												<Controller
													name="lazyLoadInlineSpinnerIconColor"
													control={ control }
													render={ ( { field: { onChange, value } } ) => (
														<>
															<ColorPickerControl
																value={ value }
																key={ 'spinner-icon-color' }
																onChange={ ( slug, newValue ) => {
																	onChange( newValue );
																} }
																label={ __( 'Spinner Icon Color', 'wp-ajaxify-comments' ) }
																defaultColors={ defaultPalette }
																defaultColor={ '#FFFFFF' }
																slug={ 'spinner-icon-color' }
															/>
														</>
													) }
												/>
											</div>
											<div className="ajaxify-admin__control-row">
												<Controller
													name="lazyLoadInlineSpinnerLabelFontSize"
													control={ control }
													render={ ( { field: { onChange, value } } ) => (
														<>
															<RangeControl
																label={ __( 'Label Font Size', 'wp-ajaxify-comments' ) }
																value={ value }
																onChange={ onChange }
																min={ 12 }
																max={ 150 }
																step={ 1 }
																help={ __( 'Set the size of the label.', 'wp-ajaxify-comments' ) }
																color="var(--ajaxify-admin--color-main)"
																trackColor="var(--ajaxify-admin--color-main)"
																resetFallbackValue={ 32 }
																allowReset={ true }
															/>
														</>
													) }
												/>
											</div>
										</td>
									</tr>
								</>
							) }
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
