import React, { useState } from 'react';
import { Button, ButtonGroup, RangeControl, ToggleControl, TextControl, BaseControl, PanelBody, Popover, SelectControl } from '@wordpress/components';
import { AlertCircle, Eye } from 'lucide-react';
import { __ } from '@wordpress/i18n';
import { Controller } from 'react-hook-form';
import { Fancybox } from '@fancyapps/ui';
import classNames from 'classnames';
import AlignmentGroup from '../../components/Alignment';
import ColorPickerControl from '../../components/ColorPicker';
import Notice from '../../components/Notice';
import { on } from 'process';

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
		lazyLoadInlineButtonAppearance,
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
					label={ lazyLoadInlineButtonLabel }
				>
					{ lazyLoadInlineButtonLabel }
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
								initialOpen={ false }
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
										name="lazyLoadInlineButtonBorderWidth"
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
								<div className="ajaxify-admin__control-row">
									<Controller
										name="lazyLoadInlineButtonBorderRadius"
										control={ control }
										render={ ( { field: { onChange, value } } ) => (
											<>
												<RangeControl
													label={ __( 'Border Radius', 'wp-ajaxify-comments' ) }
													value={ value }
													onChange={ onChange }
													min={ 0 }
													max={ 60 }
													step={ 1 }
													help={ __( 'Set the radius of the border.', 'wp-ajaxify-comments' ) }
													color="var(--ajaxify-admin--color-main)"
													trackColor="var(--ajaxify-admin--color-main)"
													resetFallbackValue={ 0 }
												/>
											</>
										) }
									/>
									<div className="ajaxify-admin__control-row">
										<Controller
											name="lazyLoadInlineButtonPaddingTop"
											control={ control }
											render={ ( { field: { onChange, value } } ) => (
												<>
													<RangeControl
														label={ __( 'Vertical Padding', 'wp-ajaxify-comments' ) }
														value={ value }
														onChange={ ( newValue ) => {
															setValue( 'lazyLoadInlineButtonPaddingTop', newValue );
															setValue( 'lazyLoadInlineButtonPaddingBottom', newValue );
															onChange( newValue );
														} }
														min={ 0 }
														max={ 60 }
														step={ 1 }
														help={ __( 'Set the padding of the top and bottom of the button.', 'wp-ajaxify-comments' ) }
														color="var(--ajaxify-admin--color-main)"
														trackColor="var(--ajaxify-admin--color-main)"
														resetFallbackValue={ 0 }
													/>
												</>
											) }
										/>
									</div>
									<div className="ajaxify-admin__control-row">
										<Controller
											name="lazyLoadInlineButtonPaddingRight"
											control={ control }
											render={ ( { field: { onChange, value } } ) => (
												<>
													<RangeControl
														label={ __( 'Horizontal Padding', 'wp-ajaxify-comments' ) }
														value={ value }
														onChange={ ( newValue ) => {
															setValue( 'lazyLoadInlineButtonPaddingRight', newValue );
															setValue( 'lazyLoadInlineButtonPaddingLeft', newValue );
															onChange( newValue );
														} }
														min={ 0 }
														max={ 60 }
														step={ 1 }
														help={ __( 'Set the padding of the left and right of the button.', 'wp-ajaxify-comments' ) }
														color="var(--ajaxify-admin--color-main)"
														trackColor="var(--ajaxify-admin--color-main)"
														resetFallbackValue={ 0 }
													/>
												</>
											) }
										/>
									</div>
								</div>
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
								title={ __( 'Typography', 'wp-ajaxify-comments' ) }
								initialOpen={ false }
							>
								<div className="ajaxify-admin__control-row">
									<Controller
										name="lazyLoadInlineButtonFontSize"
										control={ control }
										render={ ( { field: { onChange, value } } ) => (
											<>
												<RangeControl
													label={ __( 'Font Size', 'wp-ajaxify-comments' ) }
													value={ value }
													onChange={ onChange }
													min={ 10 }
													max={ 60 }
													step={ 1 }
													help={ __( 'Set the font size of the button.', 'wp-ajaxify-comments' ) }
													color="var(--ajaxify-admin--color-main)"
													trackColor="var(--ajaxify-admin--color-main)"
													resetFallbackValue={ 16 }
												/>
											</>
										) }
									/>
								</div>
								<div className="ajaxify-admin__control-row">
									<Controller
										name="lazyLoadInlineButtonLineHeight"
										control={ control }
										render={ ( { field: { onChange, value } } ) => (
											<>
												<RangeControl
													label={ __( 'Line Height', 'wp-ajaxify-comments' ) }
													value={ value }
													onChange={ onChange }
													min={ 1 }
													max={ 3 }
													step={ 0.1 }
													help={ __( 'Set the line height of the button.', 'wp-ajaxify-comments' ) }
													color="var(--ajaxify-admin--color-main)"
													trackColor="var(--ajaxify-admin--color-main)"
													resetFallbackValue={ 1.5 }
												/>
											</>
										) }
									/>
								</div>
								<div className="ajaxify-admin__control-row">
									<Controller
										name="lazyLoadInlineButtonFontWeight"
										control={ control }
										render={ ( { field: { onChange, value } } ) => (
											<>
												<SelectControl
													label={ __( 'Font Weight', 'wp-ajaxify-comments' ) }
													value={ value }
													onChange={ onChange }
													options={ [
														{
															label: '100',
															value: 100,
														},
														{
															label: '200',
															value: 200,
														},
														{
															label: '300',
															value: 300,
														},
														{
															label: '400',
															value: 400,
														},
														{
															label: '500',
															value: 500,
														},
														{
															label: '600',
															value: 600,
														},
														{
															label: '700',
															value: 700,
														},
														{
															label: '800',
															value: 800,
														},
														{
															label: '900',
															value: 900,
														},
													] }
												/>
											</>
										) }
									/>
								</div>
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
