/**
 * Alignment Group (Left|Center|Right) with a label and button icons.
 *
 * Pass onClick prop to propagate up to parent. Values are (left|center|right).
 */
import React from 'react';
import PropTypes from 'prop-types';

import { __, _x } from '@wordpress/i18n';

import { Button, ButtonGroup } from '@wordpress/components';

import './editor.scss';

const AlignmentGroup = ( props ) => {
	const {
		alignment,
		label,
		alignLeftLabel,
		alignCenterLabel,
		alignRightLabel,
		leftOn,
		centerOn,
		rightOn,
	} = props;

	return (
		<div className="ajaxify-alignment-component-base">
			<span className="ajaxify-alignment-component-label">{ label }</span>
			<ButtonGroup>
				<>
					{ leftOn &&
					<Button
						isPressed={ 'left' === alignment ? true : false }
						isSecondary
						icon="editor-alignleft"
						label={ alignLeftLabel }
						onClick={ () => {
							props.onClick( 'left' );
						} }
					/>
					}
					{ centerOn &&
					<Button
						isPressed={ 'center' === alignment ? true : false }
						isSecondary
						icon="editor-aligncenter"
						label={ alignCenterLabel }
						onClick={ () => {
							props.onClick( 'center' );
						} }
					/>
					}
					{ rightOn &&
					<Button
						isPressed={ 'right' === alignment ? true : false }
						isSecondary
						icon="editor-alignright"
						label={ alignRightLabel }
						onClick={ () => {
							props.onClick( 'right' );
						} }
					/>
					}

				</>

			</ButtonGroup>
		</div>
	);
};

AlignmentGroup.defaultProps = {
	alignment: 'left',
	label: __( 'Change Alignment', 'wp-ajaxify-comments' ),
	alignLeftLabel: _x(
		'Align Left',
		'Align items left',
		'wp-ajaxify-comments'
	),
	alignCenterLabel: _x(
		'Align Center',
		'Align items center/middle',
		'wp-ajaxify-comments'
	),
	alignRightLabel: _x(
		'Align Right',
		'Align items right',
		'wp-ajaxify-comments'
	),
	leftOn: true,
	centerOn: true,
	rightOn: true,
};

AlignmentGroup.propTypes = {
	alignment: PropTypes.string,
	label: PropTypes.string,
	alignLeftLabel: PropTypes.string,
	alignCenterLabel: PropTypes.string,
	alignRightLabel: PropTypes.string,
	leftOn: PropTypes.bool,
	centerOn: PropTypes.bool,
	rightOn: PropTypes.bool,
};

export default AlignmentGroup;
