import React, { useState } from 'react';
import { Button, ButtonGroup, RangeControl, BaseControl, ToggleControl, TextControl } from '@wordpress/components';
import { AlertCircle, Eye } from 'lucide-react';
import { __ } from '@wordpress/i18n';
import { Controller } from 'react-hook-form';
import { Fancybox } from '@fancyapps/ui';
import classNames from 'classnames';
import AlignmentGroup from '../../components/Alignment';
import ColorPickerControl from '../../components/ColorPicker';
import Notice from '../../components/Notice';

const InlineSkeleton = ( props ) => {
	const { rows, showHeading, heading } = props;
	const [ showFancybox, setShowFancybox ] = useState( false );

	const getRow = ( key ) => {
		const row = (
			<div className="ajaxify-loading-skeleton" key={ key }>
				<div className="ajaxify-skeleton-comment-header">
					<div className="ajaxify-skeleton-avatar"></div>
					<div className="ajaxify-skeleton-comment-meta"></div>
				</div>
				<div className="ajaxify-skeleton-comment-body"></div>
			</div>
		);
		return row;
	};

	const getRows = () => {
		// For loop and return rows.
		const loadingRows = [];
		for ( let i = 0; i < rows; i++ ) {
			loadingRows.push( getRow( i ) );
		}
		return loadingRows;
	};
	return (
		<>
			{ showHeading && (
				<h2>{ heading }</h2>
			) }
			{ getRows() }
		</>
	);
};

const InlineSkeletonOptions = ( props ) => {
	const {
		control,
		errors,
		setValue,
		getValues,
		clearErrors,
	} = props;

	const getLoadingSkeletonOptions = () => (
		<>
			<tr className="ajaxify-admin__loading-spinner-row">
				<th scope="row">
					{ __( 'Loading Spinner', 'wp-ajaxify-comments' ) }
				</th>
				<td>
					<div className="ajaxify-admin__control-row">
						<Controller
							name="lazyLoadInlineSkeletonLoadingLabelEnabled"
							control={ control }
							render={ ( { field: { onChange, value } } ) => (
								<>
									<ToggleControl
										label={ __( 'Show Loading Skeleton Heading', 'wp-ajaxify-comments' ) }
										help={ __( 'Show a heading above the loading skeleton.', 'wp-ajaxify-comments' ) }
										checked={ value }
										onChange={ onChange }
									/>
								</>
							) }
						/>
					</div>
					{ getValues( 'lazyLoadInlineSkeletonLoadingLabelEnabled' ) && (
						<>
							<div className="ajaxify-admin__control-row">
								<Controller
									name="lazyLoadInlineSkeletonLoadingLabel"
									control={ control }
									rules={ {
										required: true,
									} }
									render={ ( { field: { onChange, value } } ) => (
										<>
											<TextControl
												label={ __( 'Loading Skeleton Heading', 'wp-ajaxify-comments' ) }
												help={ __( 'The heading above the loading skeleton.', 'wp-ajaxify-comments' ) }
												value={ value }
												onChange={ ( e ) => {
													clearErrors( 'lazyLoadInlineSkeletonLoadingLabel' );
													onChange( e );
												} }
											/>
											{ errors.lazyLoadInlineSkeletonLoadingLabel && (
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
						</>
					) }
					<div className="ajaxify-admin__control-row">
						<Controller
							name="lazyLoadInlineSkeletonItemsShow"
							control={ control }
							render={ ( { field: { onChange, value } } ) => (
								<>
									<RangeControl
										label={ __( 'Number of Skeletons to Show', 'wp-ajaxify-comments' ) }
										value={ value }
										onChange={ onChange }
										min={ 1 }
										max={ 10 }
										step={ 1 }
										help={ __( 'Set how many loading instances that should show.', 'wp-ajaxify-comments' ) }
										color="var(--ajaxify-admin--color-main)"
										trackColor="var(--ajaxify-admin--color-main)"
										resetFallbackValue={ 1 }
									/>
								</>
							) }
						/>
					</div>
					<div className="ajaxify-admin__control-row">
						<Button
							label={ __( 'Preview Loading Skeleton', 'wp-ajaxify-comments' ) }
							className="ajaxify-button ajaxify__btn-secondary has-text has-icon"
							icon={ <Eye /> }
							
							data-src="#ajaxify-skeleton-preview"
							data-fancybox
							onClick={ ( e ) => {
								e.preventDefault();
								Fancybox.show(
									[
										{
											src: '#ajaxify-skeleton-preview',
											type: 'clone',
											autoStart: true,
										}
									]
								);
							}}
						>
							{ __( 'Preview', 'wp-ajaxify-comments' ) }
						</Button>
					</div>
					<div id="ajaxify-skeleton-preview" style={{ display: 'none', width: '80%', margin: '0 auto'}}>
						<InlineSkeleton
							rows={ getValues( 'lazyLoadInlineSkeletonItemsShow' ) }
							showHeading={ getValues( 'lazyLoadInlineSkeletonLoadingLabelEnabled' ) }
							heading={ getValues( 'lazyLoadInlineSkeletonLoadingLabel' ) }
						/>
					</div>
				</td>
			</tr>
		</>
	);

	return (
		<>
			{ getLoadingSkeletonOptions() }
		</>
	);
};
export default InlineSkeletonOptions;
