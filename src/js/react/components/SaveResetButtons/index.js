import React, { useState } from 'react';
import { AlertCircle, Loader2, ClipboardCheck } from 'lucide-react';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';
import { Button, Snackbar } from '@wordpress/components';
import Notice from '../Notice';
import SendCommand from '../../utils/SendCommand';
import SnackPop from '../SnackPop';

export function onSave( formData, setError ) {
	console.log( formData );

}

export function onReset( { formValues, setError, reset } ) {

}

const SaveResetButtons = ( props ) => {
	// Gather props.
	const {
		formValues,
		setError,
		reset,
		errors,
		isDirty,
		dirtyFields,
	} = props;

	const [ saving, setSaving ] = useState( false );
	const [ resetting, setResetting ] = useState( false );
	const [ isSaved, setIsSaved ] = useState( false );
	const [ isReset, setIsReset ] = useState( false );
	const [ savePromise, setSavePromise ] = useState( null );

	const saveOptions = async () => {
		const saveOptionsPromise = SendCommand( 'wpac_save_options', formValues );
		setSavePromise( saveOptionsPromise );
		setSaving( true );
		const response = await saveOptionsPromise;
		return response;
	};

	const hasErrors = () => {
		return Object.keys( errors ).length > 0;
	};

	const getSaveIcon = () => {
		if ( saving ) {
			return () => <Loader2 />;
		}
		if ( isSaved ) {
			return () => <ClipboardCheck />;
		}
		return false;
	};

	const getSaveText = () => {
		if ( saving ) {
			return __( 'Saving…', 'wp-ajaxify-comments' );
		}
		if ( isSaved ) {
			return __( 'Saved', 'wp-ajaxify-comments' );
		}
		return __( 'Save Options', 'wp-ajaxify-comments' );
	};

	const getResetText = () => {
		if ( resetting ) {
			return __( 'Resetting to Defaults…', 'wp-ajaxify-comments' );
		}
		if ( isReset ) {
			return __( 'Options Restored to Defaults', 'wp-ajaxify-comments' );
		}
		return __( 'Reset to Defaults', 'wp-ajaxify-comments' );
	};

	return (
		<>
			<div className="ajaxify-admin-buttons">
				<Button
					className={ classNames(
						'ajaxify__btn ajaxify__btn-primary ajaxify__btn--icon-right',
						{ 'has-error': hasErrors() },
						{ 'has-icon': saving || isSaved },
						{ 'is-saving': saving && ! isSaved },
						{ 'is-saved': isSaved },
					) }
					type="button"
					text={ getSaveText() }
					icon={ getSaveIcon() }
					iconSize="18"
					iconPosition="right"
					disabled={ saving }
					onClick={ ( e ) => {
						e.preventDefault();
						saveOptions();
					} }
				/>
				<Button
					className={ classNames(
						'ajaxify__btn ajaxify__btn-danger ajaxify__btn--icon-right',
						{ 'has-icon': resetting },
						{ 'is-resetting': { resetting } },
					) }
					type="button"
					text={ getResetText() }
					icon={ resetting ? <Loader2 /> : false }
					iconSize="18"
					iconPosition="right"
					disabled={ saving || resetting }
					onClick={ ( e ) => {
						setResetting( true );
						onReset( e );
					} }
				/>
			</div>
			<div className="ajaxify-admin-notices-bottom">
				{ saving && (
					<Notice
						message={ __( 'Your settings are being saved.', 'wp-ajaxify-comments' ) }
						status="success"
						politeness="assertive"
					/>
				) }
				{ saving && (
					<SnackPop
						ajaxOptions={ savePromise }
						loadingMessage={ __( 'Saving Options…', 'wp-ajaxify-comments' ) }
					/>
				) }
				{ hasErrors() && (
					<Notice
						message={ __(
							'There are form validation errors. Please correct them above.',
							'wp-ajaxify-comments',
						) }
						status="error"
						politeness="polite"
					/>
				) }
				{ isSaved && (
					<Notice
						message={ __( 'Your settings have been saved.', 'wp-ajaxify-comments' ) }
						status="success"
						politeness="assertive"
						hasToTop={ true }
					/>
				) }
				{ isReset && (
					<Notice
						message={ __( 'Your settings have been reset.', 'wp-ajaxify-comments' ) }
						status="success"
						politeness="assertive"
					/>
				) }
			</div>
		</>
	);
};
export default SaveResetButtons;
