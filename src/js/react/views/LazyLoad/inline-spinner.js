import React, { useState } from 'react';
import * as LoadingSvgs from '../../icons/loading/index';
import { Button, ButtonGroup, RangeControl, BaseControl, ToggleControl, TextControl } from '@wordpress/components';
import { AlertCircle, Monitor, Tablet, Smartphone } from 'lucide-react';
import { __ } from '@wordpress/i18n';
import { Controller } from 'react-hook-form';
import classNames from 'classnames';
import AlignmentGroup from '../../components/Alignment';
import ColorPickerControl from '../../components/ColorPicker';
import Notice from '../../components/Notice';

const defaultPalette = wpacAdminLazyLoad.palette;

const InlineSpinnerOptions = ( props ) => {

	const [ showLoadingSpinnerAnimation, setShowLoadingSpinnerAnimation ] = useState( false );
	const [ deviceType, setDeviceType ] = useState( 'Desktop' );

	const {
		control,
		errors,
		setValue,
		getValues,
	} = props;

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
				<p className="description" style={ { marginBottom: '15px' } }>
					{ __(
						'Choose a loading icon to display while comments are loading. A preview is shown below.', 'wp-ajaxify-comments',
					) }
				</p>
				{
					getLoadingSpinnerPreview()
				}
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

	const getLoadingSpinnerPreview = ( device = 'Desktop', containerClass = 'ajaxify-spinner-preview' ) => {
		const loadingPreviewWrapperClasses = classNames(
			'ajaxify-comments-spinner__wrapper',
			'ajaxify-comments-spinner__layout--' + getValues( 'lazyLoadInlineSpinnerLayoutType' ),
			'ajaxify-comments-spinner__alignment--' + getValues( 'lazyLoadInlineSpinnerLayoutAlignment' ),
			{
				'ajaxify-comments-spinner__rtl': getValues( 'lazyLoadInlineSpinnerLayoutRTL' ),
			},
		);
		return (
			<>
				<style>
					{
						`.${ containerClass } {
						--ajaxify-comments-spinner-container-background-color: ${ getValues( 'lazyLoadInlineSpinnerContainerBackgroundColor' ) };
						--ajaxify-comments-spinner-container-font-size: ${ getValues( 'lazyLoadInlineSpinnerLabelFontSize' + device ) }px;
						--ajaxify-comments-spinner-icon-color: ${ getValues( 'lazyLoadInlineSpinnerIconColor' ) };
						--ajaxify-comments-spinner-icon-size: ${ getValues( 'lazyLoadInlineSpinnerSize' + device ) }px;
						--ajaxify-comments-spinner-container-line-height: ${ getValues( 'lazyLoadInlineSpinnerLabelLineHeight' + device ) }px;
						--ajaxify-comments-spinner-label-color: ${ getValues( 'lazyLoadInlineSpinnerLabelColor' ) };
						--ajaxify-comments-spinner-icon-gap: ${ getValues( 'lazyLoadInlineSpinnerGap' + device ) }px;
						--ajaxify-comments-spinner-icon-animation-speed: ${ getValues( 'lazyLoadInlineSpinnerSpeed' ) }s;
						--ajaxify-comments-spinner-container-padding:  ${ getValues( 'lazyLoadInlineSpinnerContainerPadding' + device ) }px;

						
					}
				`
					}
				</style>
				<div className={ `ajaxify-admin__preview ${ containerClass }` } style={ { marginBottom: '15px' } }>
					<div className={ loadingPreviewWrapperClasses } aria-hidden="true">
						<div className="ajaxify-comments-spinner__inner">
							<div className="ajaxify-comments-spinner__icon">
								<LoadingSpinnerPreview width={ getValues( 'lazyLoadInlineSpinnerSizeDesktop' ) } height={ getValues( 'lazyLoadInlineSpinnerSizeDesktop' ) } className={ showLoadingSpinnerAnimation ? 'ajaxify-icon-loading-animation-on' : 'ajaxify-icon-loading-animation-off' } />
							</div>
							<div className="ajaxify-comments-spinner__label" aria-hidden="true">
								{ getValues( 'lazyLoadInlineSpinnerLabel' ) }
							</div>
						</div>
						<div className="ajaxify-admin__preview-controls">
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
				</div>
			</>
		);
	};

	const getResponsiveControls = ( newDeviceType ) => {
		return (
			<>
				<div className="ajaxify-admin__control-row">
					<Controller
						name={ `lazyLoadInlineSpinnerSize${ newDeviceType }` }
						control={ control }
						render={ ( { field: { onChange, value } } ) => (
							<>
								<RangeControl
									label={ __( 'Loading Icon Size', 'wp-ajaxify-comments' ) }
									value={ getValues( 'lazyLoadInlineSpinnerSize' + newDeviceType ) }
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
						name={ `lazyLoadInlineSpinnerLabelFontSize${ newDeviceType }` }
						control={ control }
						render={ ( { field: { onChange, value } } ) => (
							<>
								<RangeControl
									label={ __( 'Label Font Size', 'wp-ajaxify-comments' ) }
									value={
										getValues( 'lazyLoadInlineSpinnerLabelFontSize' + newDeviceType )
									}
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
				<div className="ajaxify-admin__control-row">
					<Controller
						name={ `lazyLoadInlineSpinnerLabelLineHeight${ newDeviceType }` }
						control={ control }
						render={ ( { field: { onChange, value } } ) => (
							<>
								<RangeControl
									label={ __( 'Label Line Height', 'wp-ajaxify-comments' ) }
									value={ getValues( 'lazyLoadInlineSpinnerLabelLineHeight' + newDeviceType ) }
									onChange={ onChange }
									min={ 12 }
									max={ 200 }
									step={ 1 }
									help={ __( 'Set the line height of the label.', 'wp-ajaxify-comments' ) }
									color="var(--ajaxify-admin--color-main)"
									trackColor="var(--ajaxify-admin--color-main)"
									resetFallbackValue={ 48 }
									allowReset={ true }
								/>
							</>
						) }
					/>
				</div>
				<div className="ajaxify-admin__control-row">
					<Controller
						name={ `lazyLoadInlineSpinnerGap${ newDeviceType }` }
						control={ control }
						render={ ( { field: { onChange, value } } ) => (
							<>
								<RangeControl
									label={ __( 'Label and Icon Gap', 'wp-ajaxify-comments' ) }
									value={ getValues( 'lazyLoadInlineSpinnerGap' + newDeviceType ) }
									onChange={ onChange }
									min={ 0 }
									max={ 150 }
									step={ 1 }
									help={ __( 'Set the gap between the icon and label.', 'wp-ajaxify-comments' ) }
									color="var(--ajaxify-admin--color-main)"
									trackColor="var(--ajaxify-admin--color-main)"
									resetFallbackValue={ 20 }
									allowReset={ true }
								/>
							</>
						) }
					/>
				</div>
				<div className="ajaxify-admin__control-row">
					<Controller
						name={ `lazyLoadInlineSpinnerContainerPadding${ newDeviceType }` }
						control={ control }
						render={ ( { field: { onChange, value } } ) => (
							<>
								<RangeControl
									label={ __( 'Padding', 'wp-ajaxify-comments' ) }
									value={ getValues( 'lazyLoadInlineSpinnerContainerPadding' + newDeviceType ) }
									onChange={ onChange }
									min={ 0 }
									max={ 200 }
									step={ 1 }
									help={ __( 'Set the padding of the container.', 'wp-ajaxify-comments' ) }
									color="var(--ajaxify-admin--color-main)"
									trackColor="var(--ajaxify-admin--color-main)"
									resetFallbackValue={ 30 }
									allowReset={ true }
								/>
							</>
						) }
					/>
				</div>
			</>
		);
	};

	const getInlineSpinnerOptions = () => (
		<>
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
				<th scope="row">{ __( 'Layout', 'wp-ajaxify-comments' ) }</th>
				<td>
					{
						getLoadingSpinnerPreview()
					}
					<div className="ajaxify-admin__control-row">
						<Controller
							name="lazyLoadInlineSpinnerLayoutType"
							control={ control }
							render={ ( { field: { onChange, value } } ) => (
								<>
									<BaseControl
										id="lazyLoadInlineSpinnerLayoutType"
										label={ __( 'Layout Type', 'wp-ajaxify-comments' ) }
										help={ __( 'Choose a layout for this loading banner.', 'wp-ajaxify-comments' ) }
									>
										<ButtonGroup>
											<Button
												label={ __( 'Horizontal', 'wp-ajaxify-comments' ) }
												isPressed={ 'horizontal' === getValues( 'lazyLoadInlineSpinnerLayoutType' ) }
												onClick={ () => {
													setValue( 'lazyLoadInlineSpinnerLayoutType', 'horizontal' );
												}
												}

											>
												{ __( 'Horizontal', 'wp-ajaxify-comments' ) }
											</Button>
											<Button
												label={ __( 'Vertical', 'wp-ajaxify-comments' ) }
												isPressed={ 'vertical' === getValues( 'lazyLoadInlineSpinnerLayoutType' ) }
												onClick={ () => {
													setValue( 'lazyLoadInlineSpinnerLayoutType', 'vertical' );
												}
												}
											>
												{ __( 'Vertical', 'wp-ajaxify-comments' ) }
											</Button>
										</ButtonGroup>
									</BaseControl>
								</>
							) }
						/>
					</div>
					<div className="ajaxify-admin__control-row">
						<Controller
							name="lazyLoadInlineSpinnerLayoutAlignment"
							control={ control }
							render={ ( { field: { onChange, value } } ) => (
								<>
									<AlignmentGroup
										alignment={ value }
										onClick={ onChange }
										label={ __( 'Layout Alignment', 'wp-ajaxify-comments' ) }
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
							name="lazyLoadInlineSpinnerLayoutRTL"
							control={ control }
							render={ ( { field: { onChange, value } } ) => (
								<>
									<ToggleControl
										label={ __( 'Flip Layout', 'wp-ajaxify-comments' ) }
										help={ __( 'Flip the order of the spinner and label.', 'wp-ajaxify-comments' ) }
										checked={ value }
										onChange={ onChange }
									/>
								</>
							) }
						/>
					</div>
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
				<th scope="row">{ __( 'Colors', 'wp-ajaxify-comments' ) }</th>
				<td>
					{
						getLoadingSpinnerPreview()
					}
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
										alpha={ true }
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
										alpha={ true }
									/>
								</>
							) }
						/>
					</div>
					<div className="ajaxify-admin__control-row">
						<Controller
							name="lazyLoadInlineSpinnerLabelColor"
							control={ control }
							render={ ( { field: { onChange, value } } ) => (
								<>
									<ColorPickerControl
										value={ value }
										key={ 'spinner-label-color' }
										onChange={ ( slug, newValue ) => {
											onChange( newValue );
										} }
										label={ __( 'Label Text Color', 'wp-ajaxify-comments' ) }
										defaultColors={ defaultPalette }
										defaultColor={ '#000000' }
										slug={ 'spinner-label-color' }
									/>
								</>
							) }
						/>
					</div>
				</td>
			</tr>
			<tr>
				<th scope="row">{ __( 'Typography and Dimensions', 'wp-ajaxify-comments' ) }</th>
				<td>
					<div className="ajaxify-admin-appearance-preview-row">
						<div className="ajaxify-admin-appearance-preview-row__buttons">
							<Button
								onClick={ ( e ) => {
									e.preventDefault();
									setDeviceType( 'Desktop' );
								} }
								isPressed={ 'Desktop' === deviceType }
								className="ajaxify-button ajaxify-admin__preview-button"
								variant="secondary"
								icon={ <Monitor style={ { fill: 'none' } } /> }
							>
								{ __( 'Desktop Options', 'wp-ajaxify-comments' ) }
							</Button>
							<Button
								onClick={ ( e ) => {
									e.preventDefault();
									setDeviceType( 'Tablet' );
								} }
								isPressed={ 'Tablet' === deviceType }
								className="ajaxify-button ajaxify-admin__preview-button"
								variant="secondary"
								icon={ <Tablet style={ { fill: 'none' } } /> }
							>
								{ __( 'Tablet Options', 'wp-ajaxify-comments' ) }
							</Button>
							<Button
								onClick={ ( e ) => {
									e.preventDefault();
									setDeviceType( 'Mobile' );
								} }
								isPressed={ 'Mobile' === deviceType }
								className="ajaxify-button ajaxify-admin__preview-button"
								variant="secondary"
								icon={ <Smartphone style={ { fill: 'none' } } /> }
							>
								{ __( 'Mobile Options', 'wp-ajaxify-comments' ) }
							</Button>
						</div>
					</div>
					<div className="ajaxify-admin__preview-inline-modal">
						<div className="ajaxify-admin__preview-inline-modal__inner" style={ { marginTop: '20px', maxWidth } }>
							{
								getLoadingSpinnerPreview( deviceType, 'ajaxify-admin-responsive-preview' )
							}
						</div>
					</div>
					{
						getResponsiveControls( deviceType )
					}
					<div className="ajaxify-admin__preview-inline-modal">
						<div className="ajaxify-admin__preview-inline-modal__inner" style={ { marginTop: '20px', maxWidth } }>
							{
								getLoadingSpinnerPreview( deviceType, 'ajaxify-admin-responsive-preview' )
							}
						</div>
					</div>
				</td>
			</tr>
		</>
	);

	const LoadingSpinnerPreview = LoadingSvgs[ getValues( 'lazyLoadInlineSpinner' ) ];

	// Get max widht for responsive preview. Assume desktop size is 600, as 600 is content size.
	let maxWidth = '100%';
	if ( 'Tablet' === deviceType ) {
		maxWidth = '480px';
	} else if ( 'Mobile' === deviceType ) {
		maxWidth = '320px';
	}

	return (
		<>
			{ getInlineSpinnerOptions() }
		</>
	);
};
export default InlineSpinnerOptions;
