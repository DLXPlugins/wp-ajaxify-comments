import Swal from 'sweetalert2';
import { __ } from '@wordpress/i18n';

/**
 * On page load, attach to admin bar menu item for helper.
 */
// vanilla js
document.addEventListener( 'DOMContentLoaded', function() {
	const menuHelperButton = document.getElementById( 'wp-admin-bar-wpac-open-selector-helper' );
	menuHelperButton.addEventListener( 'click', function( e ) {
		e.preventDefault();

		// Get query params of URL.
		const urlParams = new URLSearchParams( e.target.href );
		// Get the post ID from the URL.
		const postId = urlParams.get( 'post_id' );
		const nonce = wpacMenuHelper.nonce;
		Swal.fire( {
			titleText: __( 'Ajaxify Selector Helper', 'wp-ajaxify-comments' ),
			text: __( 'Checking the comment status.', 'wp-ajaxify-comments' ),
			icon: 'success',
			confirmButtonText: 'Cool',
			allowOutsideClick: false,
			showCloseButton: true,
			iconHtml: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M256 448c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 49.6 21.3 95.1 56.9 130.8L16 480l150.4-45.1c27.9 8.5 58.1 13.1 89.6 13.1z"/></svg>',
			didOpen: () => {
				Swal.showLoading();

				const doAjax = async () => {
					const response = await fetch( wpacMenuHelper.ajaxUrl, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
						},
						body: 'action=wpac_check_comment_status&nonce=' + nonce + '&postId=' + postId,
					} )
						.catch( ( error ) => {
							Swal.showValidationMessage( `Request failed: ${ error }` );
						} );
					return response;
				};
				const ajaxPromise = doAjax();
				ajaxPromise.then( ( response ) => {
					if ( response.ok ) {
						response.json().then( ( data ) => {
							const dataResponse = data.data;
							if ( data.success ) {
								Swal.fire( {
									titleText: dataResponse.title,
									text: dataResponse.message,
									icon: 'success',
									confirmButtonText: __( 'Proceed', 'wp-ajaxify-comments' ),
									showLoaderOnConfirm: true,
									allowOutsideClick: false,
									showCloseButton: true,
									iconHtml: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M256 448c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 49.6 21.3 95.1 56.9 130.8L16 480l150.4-45.1c27.9 8.5 58.1 13.1 89.6 13.1z"/></svg>',
								} );
							} else {
								Swal.fire( {
									titleText: dataResponse.title,
									text: dataResponse.message,
									icon: 'error',
									confirmButtonText: __( 'OK', 'wp-ajaxify-comments' ),
									allowOutsideClick: false,
									showCloseButton: true,
									iconHtml: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M256 448c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 45.1 17.7 86.8 47.7 120.9c-1.9 24.5-11.4 46.3-21.4 62.9c-5.5 9.2-11.1 16.6-15.2 21.6c-2.1 2.5-3.7 4.4-4.9 5.7c-.6 .6-1 1.1-1.3 1.4l-.3 .3 0 0 0 0 0 0 0 0c-4.6 4.6-5.9 11.4-3.4 17.4c2.5 6 8.3 9.9 14.8 9.9c28.7 0 57.6-8.9 81.6-19.3c22.9-10 42.4-21.9 54.3-30.6c31.8 11.5 67 17.9 104.1 17.9zm0-336c13.3 0 24 10.7 24 24V248c0 13.3-10.7 24-24 24s-24-10.7-24-24V136c0-13.3 10.7-24 24-24zM224 336a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>',
								} );
							}
						} );
					} else {
						Swal.fire( {
							titleText: __( 'An unknown error occurred.', 'wp-ajaxify-comments' ),
							text: __( 'Something unexpected happened. Please try again.', 'wp-ajaxify-comments' ),
							icon: 'error',
							showConfirmButton: false,
							showCancelButton: true,
							cancelButtonText: __( 'Close', 'wp-ajaxify-comments' ),
							allowOutsideClick: true,
							showCloseButton: true,
							iconHtml: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512"><path fill="currentColor" d="M144 480H0V336c0-62.7 40.1-116 96-135.8V192c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96v36c55.2 14.2 96 64.3 96 124V480H512 144zM344 160H296v24V296v24h48V296 184 160zM296 352v48h48V352H296z"/></svg>',
						} );
					}
				} );
			},

		} );
	} );
} );

