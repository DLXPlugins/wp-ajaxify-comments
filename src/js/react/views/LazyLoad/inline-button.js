import React, { useState } from 'react';
import { Button, ButtonGroup, RangeControl, ToggleControl, TextControl, BaseControl, PanelBody, Popover } from '@wordpress/components';
import { AlertCircle, Eye } from 'lucide-react';
import { __ } from '@wordpress/i18n';
import { Controller } from 'react-hook-form';
import { Fancybox } from '@fancyapps/ui';
import classNames from 'classnames';
import AlignmentGroup from '../../components/Alignment';
import ColorPickerControl from '../../components/ColorPicker';
import Notice from '../../components/Notice';

const defaultPalette = wpacAdminLazyLoad.palette;

const InlineButtonOptions = ( props ) => {
	const {
		control,
		errors,
		setValue,
		getValues,
		clearErrors,
	} = props;

	const {
		lazyLoadInlineButtonLabel,
		lazyLoadInlineButtonLabelLoading,
		lazyLoadInlineButtonAppearance,
		lazyLoadInlineButtonUseThemeStyles,
		lazyLoadInlineButtonBackgroundColor,
		lazyLoadInlineButtonBackgroundColorHover,
		lazyLoadInlineButtonTextColor,
		lazyLoadInlineButtonTextColorHover,
		lazyLoadInlineButtonBorderColor,
		lazyLoadInlineButtonBorderColorHover,
		lazyLoadInlineButtonBorderWidth,
		lazyLoadInlineButtonBorderRadius,
		lazyLoadInlineButtonPaddingTop,
		lazyLoadInlineButtonPaddingRight,
		lazyLoadInlineButtonPaddingBottom,
		lazyLoadInlineButtonPaddingLeft,
		lazyLoadInlineButtonFontSize,
		lazyLoadInlineButtonLineHeight,
		lazyLoadInlineButtonFontWeight,
		lazyLoadInlineButtonFontFamily,
		lazyLoadInlineButtonAlign,
	} = getValues();

	const getInlineButton = () => {
		const styles = `
			.ajaxify-btn-reset.ajaxify-comments-loading-button {
				--ajaxify-comments-loading-button-background-color: ${ lazyLoadInlineButtonBackgroundColor };
				--ajaxify-comments-loading-button-background-color-hover: ${ lazyLoadInlineButtonBackgroundColorHover };
				--ajaxify-comments-loading-button-text-color: ${ lazyLoadInlineButtonTextColor };
				--ajaxify-comments-loading-button-text-color-hover: ${ lazyLoadInlineButtonTextColorHover };
				--ajaxify-comments-loading-button-border-color: ${ lazyLoadInlineButtonBorderColor };
				--ajaxify-comments-loading-button-border-color-hover: ${ lazyLoadInlineButtonBorderColorHover };
				--ajaxify-comments-loading-button-border-width: ${ lazyLoadInlineButtonBorderWidth }px;
				--ajaxify-comments-loading-button-border-radius: ${ lazyLoadInlineButtonBorderRadius }px;
				--ajaxify-comments-loading-button-padding-top: ${ lazyLoadInlineButtonPaddingTop }px;
				--ajaxify-comments-loading-button-padding-right: ${ lazyLoadInlineButtonPaddingRight }px;
				--ajaxify-comments-loading-button-padding-bottom: ${ lazyLoadInlineButtonPaddingBottom }px;
				--ajaxify-comments-loading-button-padding-left: ${ lazyLoadInlineButtonPaddingLeft }px;
				--ajaxify-comments-loading-button-font-size: ${ lazyLoadInlineButtonFontSize }px;
				--ajaxify-comments-loading-button-line-height: ${ lazyLoadInlineButtonLineHeight };
				--ajaxify-comments-loading-button-font-weight: ${ lazyLoadInlineButtonFontWeight };
				--ajaxify-comments-loading-button-font-family: ${ lazyLoadInlineButtonFontFamily };
			}`;
		return (
			<>
				<style>
					{ styles }
				</style>
				<Button
					className={
						classNames(
							'ajaxify-btn-reset ajaxify-comments-loading-button',
							{
								'ajaxify-is-solid': 'solid' === lazyLoadInlineButtonAppearance,
								'ajaxify-is-transparent': 'transparent' === lazyLoadInlineButtonAppearance,
							},
						)
					}
					label={ __( 'Load Comments', 'wp-ajaxify-comments' ) }
				>
					{ __( 'Load Comments', 'wp-ajaxify-comments' ) }
				</Button>
			</>
		);
	};

	/**
	 * Retrieve the button options.
	 */
	const getButtonOptions = () => (
		<>
			<table className="form-table form-table-row-sections">
				<tbody>
					<tr>
						<th scope="row">
							{ __( 'Button Options', 'wp-ajaxify-comments' ) }
						</th>
						<td>
							<div className="ajaxify-admin__control-row">
								<Controller
									name="lazyLoadInlineButtonLabel"
									control={ control }
									rules={ {
										required: true,
									} }
									render={ ( { field: { onChange, value } } ) => (
										<>
											<TextControl
												label={ __( 'Button Label', 'wp-ajaxify-comments' ) }
												help={ __( 'The label of the button.', 'wp-ajaxify-comments' ) }
												value={ value }
												onChange={ ( e ) => {
													clearErrors( 'lazyLoadInlineButtonLabel' );
													onChange( e );
												} }
											/>
											{ errors.lazyLoadInlineButtonLabel && (
												<Notice
													status="error"
													text={ errors.lazyLoadInlineButtonLabel.message }
												/>
											) }
										</>
									) }
								/>
							</div>
							<div className="ajaxify-admin__control-row">
								<Controller
									name="lazyLoadInlineButtonLabelLoading"
									control={ control }
									render={ ( { field: { onChange, value } } ) => (
										<>
											<TextControl
												label={ __( 'Loading Label', 'wp-ajaxify-comments' ) }
												help={ __( 'The label of the button when loading.', 'wp-ajaxify-comments' ) }
												value={ value }
												onChange={ onChange }
											/>
										</>
									) }
								/>
							</div>
							<div className="ajaxify-admin__control-row">
								<Controller
									name="lazyLoadInlineButtonUseThemeStyles"
									control={ control }
									render={ ( { field: { onChange, value } } ) => (
										<>
											<ToggleControl
												label={ __( 'Use Theme Styles', 'wp-ajaxify-comments' ) }
												help={ __( 'Use the theme styles for the button. Switch off to use the button designer.', 'wp-ajaxify-comments' ) }
												checked={ value }
												onChange={ onChange }
											/>
										</>
									) }
								/>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</>
	);

	// Get button preview wrapper classes.
	const buttonWrapperClasses = classNames( 'ajaxify-button-designer__preview', {
		'ajaxify-align-left': 'left' === lazyLoadInlineButtonAlign,
		'ajaxify-align-center': 'center' === lazyLoadInlineButtonAlign,
		'ajaxify-align-right': 'right' === lazyLoadInlineButtonAlign,
	} );

	const getButtonDesigner = () => (
		<>
			<div className="ajaxify-button-designer">
				<div className="ajaxify-button-designer__header">
					<h3>
						{ __( 'Button Designer', 'wp-ajaxify-comments' ) }
					</h3>
				</div>
				<div className="ajaxify-button-designer__body">
					<div className={ buttonWrapperClasses }>
						{ getInlineButton() }
					</div>
					<div className="ajaxify-button-designer__sidebar">
						<div className="ajaxify-button-designer__sidebar-body">
							<PanelBody
								title={ __( 'Appearance', 'wp-ajaxify-comments' ) }
								initialOpen={ true }
							>
								<div className="ajaxify-admin__control-row">
									<BaseControl
										label={ __( 'Button Style', 'wp-ajaxify-comments' ) }
										id="ajaxify-button-designer__button-style"
									>
										<ButtonGroup className="ajaxify-button-designer__button-group">
											<Button
												variant="secondary" isPressed={ 'solid' === lazyLoadInlineButtonAppearance }
												onClick={ () => {
													setValue( 'lazyLoadInlineButtonAppearance', 'solid' );
												} }
											>
												{ __( 'Solid', 'wp-ajaxify-comments' ) }
											</Button>
											<Button
												variant="secondary" isPressed={ 'transparent' === lazyLoadInlineButtonAppearance }
												onClick={ () => {
													setValue( 'lazyLoadInlineButtonAppearance', 'transparent' );
												} }
											>
												{ __( 'Transparent', 'wp-ajaxify-comments' ) }
											</Button>
										</ButtonGroup>
									</BaseControl>
								</div>
								<div className="ajaxify-admin__control-row">
									<Controller
										name="lazyLoadInlineButtonAlign"
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
										name="lazyLoadInlineborderWidth"
										control={ control }
										render={ ( { field: { onChange, value } } ) => (
											<>
												<RangeControl
													label={ __( 'Border Width', 'wp-ajaxify-comments' ) }
													value={ value }
													onChange={ onChange }
													min={ 0 }
													max={ 10 }
													step={ 1 }
													help={ __( 'Set the width of the border.', 'wp-ajaxify-comments' ) }
													color="var(--ajaxify-admin--color-main)"
													trackColor="var(--ajaxify-admin--color-main)"
													resetFallbackValue={ 0 }
												/>
											</>
										) }
									/>
								</div>
							</PanelBody>
							<PanelBody
								title={ __( 'Colors', 'wp-ajaxify-comments' ) }
								initialOpen={ true }
							>
								<div className="ajaxify-admin__control-row">
									<Controller
										name="lazyLoadInlineButtonBackgroundColor"
										control={ control }
										render={ ( { field: { onChange, value } } ) => (
											<>
												<ColorPickerControl
													value={ value }
													key={ 'inline-button-background-color' }
													onChange={ ( slug, newValue ) => {
														onChange( newValue );
													} }
													label={ __( 'Background Color', 'wp-ajaxify-comments' ) }
													defaultColors={ defaultPalette }
													defaultColor={ '#000000' }
													slug={ 'inline-button-background-color' }
												/>
											</>
										) }
									/>
								</div>
								<div className="ajaxify-admin__control-row">
									<Controller
										name="lazyLoadInlineButtonBackgroundColorHover"
										control={ control }
										render={ ( { field: { onChange, value } } ) => (
											<>
												<ColorPickerControl
													value={ value }
													key={ 'inline-button-background-color-hover' }
													onChange={ ( slug, newValue ) => {
														onChange( newValue );
													} }
													label={ __( 'Background Color on Hover', 'wp-ajaxify-comments' ) }
													defaultColors={ defaultPalette }
													defaultColor={ '#000000' }
													slug={ 'inline-button-background-color-hover' }
												/>
											</>
										) }
									/>
								</div>
								<div className="ajaxify-admin__control-row">
									<Controller
										name="lazyLoadInlineButtonTextColor"
										control={ control }
										render={ ( { field: { onChange, value } } ) => (
											<>
												<ColorPickerControl
													value={ value }
													key={ 'inline-button-text-color' }
													onChange={ ( slug, newValue ) => {
														onChange( newValue );
													} }
													label={ __( 'Text Color', 'wp-ajaxify-comments' ) }
													defaultColors={ defaultPalette }
													defaultColor={ '#000000' }
													slug={ 'inline-button-text-color' }
												/>
											</>
										) }
									/>
								</div>
								<div className="ajaxify-admin__control-row">
									<Controller
										name="lazyLoadInlineButtonTextColorHover"
										control={ control }
										render={ ( { field: { onChange, value } } ) => (
											<>
												<ColorPickerControl
													value={ value }
													key={ 'inline-button-text-color-hover' }
													onChange={ ( slug, newValue ) => {
														onChange( newValue );
													} }
													label={ __( 'Text Color on Hover', 'wp-ajaxify-comments' ) }
													defaultColors={ defaultPalette }
													defaultColor={ '#000000' }
													slug={ 'inline-button-text-color-hover' }
												/>
											</>
										) }
									/>
								</div>
								<div className="ajaxify-admin__control-row">
									<Controller
										name="lazyLoadInlineButtonBorderColor"
										control={ control }
										render={ ( { field: { onChange, value } } ) => (
											<>
												<ColorPickerControl
													value={ value }
													key={ 'inline-button-border-color' }
													onChange={ ( slug, newValue ) => {
														onChange( newValue );
													} }
													label={ __( 'Border Color', 'wp-ajaxify-comments' ) }
													defaultColors={ defaultPalette }
													defaultColor={ '#000000' }
													slug={ 'inline-button-border-color' }
												/>
											</>
										) }
									/>
								</div>
								<div className="ajaxify-admin__control-row">
									<Controller
										name="lazyLoadInlineButtonBorderColorHover"
										control={ control }
										render={ ( { field: { onChange, value } } ) => (
											<>
												<ColorPickerControl
													value={ value }
													key={ 'inline-button-border-color-hover' }
													onChange={ ( slug, newValue ) => {
														onChange( newValue );
													} }
													label={ __( 'Border Color on Hover', 'wp-ajaxify-comments' ) }
													defaultColors={ defaultPalette }
													defaultColor={ '#000000' }
													slug={ 'inline-button-border-color-hover' }
												/>
											</>
										) }
									/>
								</div>
							</PanelBody>
							<PanelBody
								title={ __( 'Spacing', 'wp-ajaxify-comments' ) }
								initialOpen={ false }
							>
								Spacing
							</PanelBody>
							<PanelBody
								title={ __( 'Colors', 'wp-ajaxify-comments' ) }
								initialOpen={ false }
							>
								<div className="ajaxify-admin__control-row">
									<Controller
										name="lazyLoadInlineButtonBackgroundColor"
										control={ control }
										render={ ( { field: { onChange, value } } ) => (
											<>
												<ColorPickerControl
													value={ value }
													key={ 'inline-button-background-color' }
													onChange={ ( slug, newValue ) => {
														onChange( newValue );
													} }
													label={ __( 'Background Color', 'wp-ajaxify-comments' ) }
													defaultColors={ defaultPalette }
													defaultColor={ '#000000' }
													slug={ 'inline-button-background-color' }
													alpha={ true }
												/>
											</>
										) }
									/>
								</div>
							</PanelBody>
							<PanelBody
								title={ __( 'Spacing', 'wp-ajaxify-comments' ) }
								initialOpen={ false }
							>
								Spacing
							</PanelBody>
						</div>
					</div>
				</div>
				
			</div>
		</>
	);

	return (
		<>
			{ getButtonOptions() }
			{ ! getValues( 'lazyLoadInlineButtonUseThemeStyles' ) && (
				<>
					{ getButtonDesigner() }
				</>
			) }
		</>
	);
};
export default InlineButtonOptions;
