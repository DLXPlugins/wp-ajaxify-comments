/**
 * Alignment Group (Left|Center|Right) with a label and button icons.
 *
 * Pass onClick prop to propagate up to parent. Values are (left|center|right).
 */
import React from 'react';
import PropTypes from 'prop-types';

import { __, _x } from '@wordpress/i18n';

import { BaseControl, Button, ButtonGroup } from '@wordpress/components';
import { AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd } from 'lucide-react';

import './editor.scss';

const VerticalAlignmentGroup = ( props ) => {
	const {
		alignment,
		label,
		alignVerticalStartLabel,
		alignVerticalCenterLabel,
		alignVerticalEndLabel,
		verticalStartOn,
		verticalCenterOn,
		verticalEndOn,
	} = props;

	return (
		<div className="ajaxify-alignment-component-base">
			<BaseControl
				id="ajaxify-alignment-component-base"
				label={ label }
			>
				<ButtonGroup>
					<>
						{ verticalStartOn &&
						<Button
							isPressed={ 'verticalStart' === alignment ? true : false }
							isSecondary
							icon={ <AlignVerticalJustifyStart /> }
							label={ alignVerticalStartLabel }
							onClick={ () => {
								props.onClick( 'verticalStart' );
							} }
						/>
						}
						{ verticalCenterOn &&
						<Button
							isPressed={ 'verticalCenter' === alignment ? true : false }
							isSecondary
							icon={ <AlignVerticalJustifyCenter /> }
							label={ alignVerticalCenterLabel }
							onClick={ () => {
								props.onClick( 'verticalCenter' );
							} }
						/>
						}
						{ verticalEndOn &&
						<Button
							isPressed={ 'verticalEnd' === alignment ? true : false }
							isSecondary
							icon={ <AlignVerticalJustifyEnd /> }
							label={ alignVerticalEndLabel }
							onClick={ () => {
								props.onClick( 'verticalEnd' );
							} }
						/>
						}

					</>

				</ButtonGroup>
			</BaseControl>
		</div>
	);
};

VerticalAlignmentGroup.defaultProps = {
	alignment: 'verticalStart',
	label: __( 'Change Vertical Alignment', 'wp-ajaxify-comments' ),
	alignVerticalStartLabel: _x(
		'Vertically Align Top',
		'Justify Top',
		'wp-ajaxify-comments'
	),
	alignVerticalCenterLabel: _x(
		'Vertically Align Center',
		'Align items center/middle',
		'wp-ajaxify-comments'
	),
	alignVerticalEndLabel: _x(
		'Vertically Align Bottom',
		'Align items Bottom',
		'wp-ajaxify-comments'
	),
	verticalStartOn: true,
	verticalCenterOn: false,
	verticalEndOn: false,
};

VerticalAlignmentGroup.propTypes = {
	alignment: PropTypes.string,
	label: PropTypes.string,
	alignVerticalStartLabel: PropTypes.string,
	alignVerticalCenterLabel: PropTypes.string,
	alignVerticalEndLabel: PropTypes.string,
	verticalStartOn: PropTypes.bool,
	verticalCenterOn: PropTypes.bool,
	verticalEndOn: PropTypes.bool,
};

export default VerticalAlignmentGroup;
