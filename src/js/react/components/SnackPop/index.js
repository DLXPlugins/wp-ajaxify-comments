import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Snackbar as WPSnackBar, Modal, Button } from '@wordpress/components';
import classnames from 'classnames';
import { __ } from '@wordpress/i18n';
import Notice from '../Notice';

/**
 * SnackPop is a component which handles alerts and notifications for the user.
 * It can handle multiple alerts at once, toggles and forms, and will display the notifications in a queue.
 *
 * @param {Object} props Component props.
 *
 * @return {Element} JSX markup for the component.
 */
const SnackPop = ( props ) => {
	const { ajaxOptions, loadingMessage } = props;
	const [ notificationOptions, setNotificationOptions ] = useState( {
		type: 'info',
		message: '',
		title: '',
		isDismissable: false,
		isPersistent: false,
		isSuccess: false,
		loadingMessage,
		politeness: 'polite', /* can also be assertive */
	} );
	const [ isBusy, setIsBusy ] = useState( false );
	const [ isModalVisible, setIsModalVisible ] = useState( false );
	const [ isSnackbarVisible, setIsSnackbarVisible ] = useState( false );

	useEffect( () => {
		const getPromise = async () => {
			const response = await ajaxOptions;
			return response;
		};
		if ( ajaxOptions instanceof Promise ) {
			// Set state to busy.
			setIsSnackbarVisible( true );
			setIsBusy( true );

			getPromise().then( ( response ) => {
				const { data } = response;
				const { success: isSuccess } = data;
				const { data: responseData } = data;

				// Get the type of notification. (error, info, success, warning, critical, confirmation).
				const type = responseData.type || 'info';

				// Get the message.
				const message = responseData.message || '';

				// Get the title.
				const title = responseData.title || ''; /* title of snackbar or modal */

				// Get whether the notification is dismissable.
				const isDismissable = responseData.dismissable || false; /* whether the snackbar or modal is dismissable */

				// Get whether the notification is persistent.
				const isPersistent = responseData.persistent || false; /* whether the snackbar or modal is persistent */

				// Get the politeness based on if successful.
				const politeness = isSuccess ? 'polite' : 'assertive';

				// Set state with the notification.
				setNotificationOptions( {
					type,
					message,
					title,
					isDismissable,
					isBusy: false,
					isPersistent,
					politeness,
				} );

				if ( isSuccess ) {
					//onSuccess( notificationOptions );
				} else {
					//onError( notificationOptions );
				}
				if ( 'critical' === type ) {
					setIsSnackbarVisible( false );
					setIsModalVisible( true );
				} else {
					setTimeout( () => {
						setIsSnackbarVisible( false );
					}, 10000 );
				}
			} ).catch( ( error ) => {
				// Handle error
				setNotificationOptions( {
					type: 'critical',
					message: error.message,
					title: __( 'An Error Has Occurred', 'wp-ajaxify-comments' ),
					isDismissable: false,
					isBusy: false,
					isPersistent: true,
					politeness: 'assertive',
				} );
				//onError( notificationOptions );
			} ).then( () => {
				// Set state to not busy.
				setIsBusy( false );
			} );
		}
	}, [ ajaxOptions ] );

	// Bail if no promise.
	if ( null === ajaxOptions ) {
		return (
			<></>
		);
	}

	/**
	 * Gets the icon for the notification.
	 *
	 * @return {Element} JSX markup for the icon.
	 */
	const getIcon = () => {
		switch ( notificationOptions.type ) {
			case 'success':
				return <CheckCircle2 />;
			case 'error':
			case 'critical':
				return <AlertCircle />;
			default:
				return <Loader2 />;
		}
	};

	const getSnackBar = () => {
		return (
			<WPSnackBar
				className={
					classnames(
						`uau-snackbar uau-snackbar-${ notificationOptions.type }`,
						{
							'uau-snackbar-loading': isBusy,
						}
					)
				}
				icon={ getIcon() }
				onDismiss={ () => setIsSnackbarVisible( false ) }
				explicitDismiss={ notificationOptions.isDismissable }
			>
				{ isBusy ? loadingMessage : notificationOptions.message }
			</WPSnackBar>
		);
	};

	const getModal = () => {
		if ( 'critical' === notificationOptions.type ) {
			return (
				<Modal
					className={
						classnames(
							`uau-modal uau-modal-${ notificationOptions.type }`,
							{
								'uau-modal-loading': isBusy,
							}
						)
					}
					bodyOpenClassName={ 'uau-modal-body-open' }
					title={ notificationOptions.title }
					onRequestClose={ () => {
						setIsModalVisible( false );
					} }
					isDismissible={ true }
					shouldCloseOnClickOutside={ notificationOptions.isPersistent }
					shouldCloseOnEsc={ notificationOptions.isPersistent }
				>
					<Notice
						message={ notificationOptions.message }
						status={ notificationOptions.type }
						politeness={ notificationOptions.politeness }
						icon={ getIcon }
						inline={ false }
					/>
					<div className="uau-modal-button-group">
						<Button
							className="button button-error"
							variant="secondary"
							onClick={ () => {
								setIsModalVisible( false );
							} }
						>
							{ __( 'OK', 'wp-ajaxify-comments' ) }
						</Button>
					</div>
				</Modal>
			);
		}
	};

	return (
		<>
			{ isSnackbarVisible && getSnackBar() } { /* Show snackbar */ }
			{ isModalVisible && getModal() } { /* Show modal */ }
		</>
	);
};
export default SnackPop;
