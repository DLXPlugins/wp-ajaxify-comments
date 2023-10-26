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

	const getInlineButton = () => {
		return (
			<Button
				className={
					classNames(
						'ajaxify-btn-reset ajaxify-lazy-load-btn',
						{}
					)
				}
				label={ __( 'Load Comments', 'wp-ajaxify-comments' ) }
			>
				{ __( 'Load Comments', 'wp-ajaxify-comments' ) }
			</Button>
		);
	};

	const getButtonDesigner = () => (
		<>
			<div className="ajaxify-button-designer">
				<div className="ajaxify-button-designer__header">
					<h3>
						{ __( 'Button Designer', 'wp-ajaxify-comments' ) }
					</h3>
				</div>
				<div className="ajaxify-button-designer__body">
					<div className="ajaxify-button-designer__preview">
						{ getInlineButton() }
					</div>
					<div className="ajaxify-button-designer__sidebar">
						<div className="ajaxify-button-designer__sidebar-body">
							<PanelBody
								title={ __( 'Button Options', 'wp-ajaxify-comments' ) }
								initialOpen={ true }
							>
								<BaseControl
									label={ __( 'Button Style', 'wp-ajaxify-comments' ) }
									id="ajaxify-button-designer__button-style"
								>
									<ButtonGroup className="ajaxify-button-designer__button-group">
										<Button
											variant="primary" isPressed={ true }
										>
											{ __( 'Rounded', 'wp-ajaxify-comments' ) }
										</Button>
										<Button
											variant="primary" isPressed={ false }
										>
											{ __( 'Rectangular', 'wp-ajaxify-comments' ) }
										</Button>
									</ButtonGroup>
								</BaseControl>
							</PanelBody>
							<PanelBody
								title={ __( 'Colors', 'wp-ajaxify-comments' ) }
								initialOpen={ false }
							>
								Colors
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
			{ getButtonDesigner() }
		</>
	);
};
export default InlineButtonOptions;
