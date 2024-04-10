import React, { useState, useEffect } from 'react';
import { Icon, desktop, mobile, tablet } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { ButtonGroup, Button } from '@wordpress/components';
const ResponsiveTabs = ( props ) => {
	const [ device, setDevice ] = useState( props.device );

	useEffect( () => {
		setDevice( props.device );
	}, [ props.device ] );

	return (
		<div className="wpac-responsive-tabs">
			<div className="wpac-responsive-tabs__tabs">
				<ButtonGroup>
					<Button
						isPrimary={ device === 'desktop' }
						onClick={ () => props.onChange( 'desktop' ) }
						label={ __( 'Desktop', 'wp-ajaxify-comments' ) }
					>
						<Icon icon={ desktop } />
					</Button>
					<Button
						isPrimary={ device === 'tablet' }
						onClick={ () => props.onChange( 'tablet' ) }
						label={ __( 'Tablet', 'wp-ajaxify-comments' ) }
					>
						<Icon icon={ tablet } />
					</Button>
					<Button
						isPrimary={ device === 'mobile' }
						onClick={ () => props.onChange( 'mobile' ) }
						label={ __( 'Mobile', 'wp-ajaxify-comments' ) }
					>
						<Icon icon={ mobile } />
					</Button>
				</ButtonGroup>
			</div>
		</div>
	);
}
export default ResponsiveTabs;