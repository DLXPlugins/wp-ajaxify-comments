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
								const preCheckSuccessModal = Swal.fire( {
									titleText: dataResponse.title,
									text: dataResponse.message,
									icon: 'success',
									confirmButtonText: __( 'Proceed', 'wp-ajaxify-comments' ),
									showLoaderOnConfirm: true,
									allowOutsideClick: false,
									showCloseButton: true,
									showCancelButton: true,
									iconHtml: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M256 448c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 49.6 21.3 95.1 56.9 130.8L16 480l150.4-45.1c27.9 8.5 58.1 13.1 89.6 13.1z"/></svg>',
								} ).then( ( result ) => {
									if ( result?.isConfirmed ) {
										// Fire the main helper.
										Swal.showLoading();
										launchSelectorHelper();
									}
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

	const headingsArr = [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ];

	/**
	 * Launch the selector helper.
	 */
	const launchSelectorHelper = () => {
		Swal.fire( {
			titleText: __( 'Ajaxify Selector Helper', 'wp-ajaxify-comments' ),
			text: __( 'Finding your comment selectors…', 'wp-ajaxify-comments' ),
			icon: 'success',
			allowOutsideClick: false,
			showCloseButton: true,
			iconHtml: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M256 448c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 49.6 21.3 95.1 56.9 130.8L16 480l150.4-45.1c27.9 8.5 58.1 13.1 89.6 13.1z"/></svg>',
			didOpen: () => {
				Swal.showLoading();

				const selectorList = [];

				// Find the comments container. todo - make filterable.
				const commentContainerSelectors = [
					'.wp-block-comments',
					'#comments',
					'.comments-wrapper',
					'.comments',
					'.comments-area',
				];

				// Loop through each of the comment selectors.
				// Find children and make sure its a comment.
				// Make sure selected element is a comment list.
				let foundCommentContainer = false;
				commentContainerSelectors.forEach( ( commentSelector ) => {
					if ( foundCommentContainer ) {
						return;
					}
					const commentElement = document.querySelector( commentSelector );
					if ( commentElement ) {
						const commentElementTagName = commentElement.tagName.toLowerCase();

						// Check to see if container has children. If not, skip.
						if ( commentElement.children.length <= 0 ) {
							return;
						}

						// If element is a heading, bail.
						if ( headingsArr.includes( commentElementTagName ) ) {
							return;
						}

						// If the element is UL or OL, bail.
						if ( 'ul' === commentElementTagName || 'ol' === commentElementTagName ) {
							return;
						}

						// Check to see if direct children contain UL, OL.
						// If not, skip.
						commentElement.childNodes.forEach( ( child ) => {
							if ( child.tagName ) {
								const childTagName = child.tagName.toLowerCase();

								// If direct child is a UL or OL, then parent is the comment container.
								if ( 'ul' === childTagName || 'ol' === childTagName ) {
									foundCommentContainer = true;
								}
							}
						} );

						// If we still haven't found the comment container, check that is has #respond or a form element.
						if ( ! foundCommentContainer ) {
							const respondOrForm = commentElement.querySelectorAll( '#respond, form' );
							if ( null !== respondOrForm && respondOrForm.length > 0 ) {
								foundCommentContainer = true;
							}
							return;
						}
						// If we still haven't found it... search for .comment, which is usually on the comment list item.
						if ( ! foundCommentContainer ) {
							// Search for .comment.
							const commentElementComment = commentElement.querySelector( '.comment' );
							if ( commentElementComment ) {
								// Find closest parent that matches the comment selector.
								const commentElementCommentParent = commentElementComment.closest( commentSelector );
								if ( commentElementCommentParent ) {
									foundCommentContainer = true;
								}
							}
						}
						if ( ! foundCommentContainer ) {
							return;
						}

						// We've likely found the comment list. This is a valid container.
						foundCommentContainer = true;

						selectorList.push( {
							selector: commentSelector,
							tagName: commentElementTagName,
							selectorOptionName: 'selectorCommentsContainer',
							selectorLabel: __( 'Comments Container', 'wp-ajaxify-comments' ),
						} );
					}
				} );

				// Now check to see if we can find the comment list.
				let foundCommentList = false;
				const commentListSelectors = [
					'.comment-list',
					'.comment-list-wrapper',
					'.comment-list-container',
					'.ast-comment-list',
					'.wp-block-comment-template',
				];
				commentListSelectors.forEach( ( commentListSelector ) => {
					if ( foundCommentList ) {
						return;
					}
					const commentListElement = document.querySelector( commentListSelector );
					if ( commentListElement ) {
						const commentListElementTagName = commentListElement.tagName.toLowerCase();

						// If child contains LI, or `.comment`, then we've found the comment list.
						const commentListItems = commentListElement.querySelectorAll( 'li, .comment' );
						if ( null !== commentListItems && commentListItems.length > 0 ) {
							foundCommentList = true;
						}

						if ( 'ul' === commentListElementTagName || 'ol' === commentListElementTagName ) {
							foundCommentList = true;
						}
						if ( foundCommentList ) {
							selectorList.push( {
								selector: commentListSelector,
								tagName: commentListElementTagName,
								selectorOptionName: 'selectorCommentList',
								selectorLabel: __( 'Comment List', 'wp-ajaxify-comments' ),
							} );
						}
					}
				} );

				// Now let's get the comment form.
				let foundCommentForm = false;
				const commentFormSelectors = [
					'#commentform',
					'.comment-form',
					'#ast-commentform',
					'.commentform',
					'#respond form',
				];
				commentFormSelectors.forEach( ( commentFormSelector ) => {
					if ( foundCommentForm ) {
						return;
					}
					const commentFormElement = document.querySelector( commentFormSelector );
					if ( commentFormElement ) {
						const commentFormElementTagName = commentFormElement.tagName.toLowerCase();
						if ( 'form' === commentFormElementTagName ) {
							foundCommentForm = true;
							selectorList.push( {
								selector: commentFormSelector,
								tagName: commentFormElementTagName,
								selectorOptionName: 'selectorCommentForm',
								selectorLabel: __( 'Comment Form', 'wp-ajaxify-comments' ),
							} );
						}
					}
				} );

				// Get the respond textarea.
				let foundRespondContainer = false;
				const respondContainerSelectors = [
					'#respond',
					'.comment-respond',
					'.wp-block-post-comments-form',
				];
				respondContainerSelectors.forEach( ( respondContainerSelector ) => {
					if ( foundRespondContainer ) {
						return;
					}
					const respondContainerElement = document.querySelector( respondContainerSelector );
					if ( respondContainerElement ) {
						selectorList.push( {
							selector: respondContainerSelector,
							tagName: respondContainerElement.tagName.toLowerCase(),
							selectorOptionName: 'selectorRespondContainer',
							selectorLabel: __( 'Respond Container', 'wp-ajaxify-comments' ),
						} );
						foundRespondContainer = true;
					}
				} );

				// Get the comment text textarea.
				let foundCommentTextarea = false;
				const commentTextareaSelectors = [
					'#comment',
					'#respond textarea',
					'textarea[name="comment"]',
				];
				commentTextareaSelectors.forEach( ( commentTextareaSelector ) => {
					if ( foundCommentTextarea ) {
						return;
					}
					const commentTextareaElement = document.querySelector( commentTextareaSelector );
					if ( commentTextareaElement ) {
						// Make sure it's a textarea.
						if ( 'textarea' === commentTextareaElement.tagName.toLowerCase() ) {
							selectorList.push( {
								selector: commentTextareaSelector,
								tagName: commentTextareaElement.tagName.toLowerCase(),
								selectorOptionName: 'selectorTextarea',
								selectorLabel: __( 'Comment Textarea', 'wp-ajaxify-comments' ),
							} );
							foundCommentTextarea = true;
						}
					}
				} );

				// Get the comment submit button.
				let foundCommentSubmit = false;
				const commentSubmitSelectors = [
					'#submit',
					'#respond input[type="submit"]',
					'.form-submit input[type="submit"]',
					'.wp-block-post-comments-form input[type="submit"]',
				];
				commentSubmitSelectors.forEach( ( commentSubmitSelector ) => {
					if ( foundCommentSubmit ) {
						return;
					}
					const commentSubmitElement = document.querySelector( commentSubmitSelector );
					// Make sure input is a button or input button.
					if ( commentSubmitElement ) {
						const commentSubmitElementTagName = commentSubmitElement.tagName.toLowerCase();
						if ( 'button' === commentSubmitElementTagName || 'input' === commentSubmitElementTagName ) {
							selectorList.push( {
								selector: commentSubmitSelector,
								tagName: commentSubmitElementTagName,
								selectorOptionName: 'selectorSubmitButton',
								selectorLabel: __( 'Submit Button', 'wp-ajaxify-comments' ),
							} );
							foundCommentSubmit = true;
						}
					}
				} );

				// Check to see if we found all the selectors.
				if ( selectorList.length < 6 ) {
					Swal.fire( {
						titleText: __( 'Unable to Find All Selectors', 'wp-ajaxify-comments' ),
						html: __( 'We were unable to find all the required selectors. Please contact support at <a style="color: #FFF;" href="https://dlxplugins.com/support/">dlxplugins.com/support/</a>.', 'wp-ajaxify-comments' ),
						icon: 'error',
						confirmButtonText: __( 'OK', 'wp-ajaxify-comments' ),
						allowOutsideClick: false,
						showCloseButton: true,
						iconHtml: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M256 448c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 45.1 17.7 86.8 47.7 120.9c-1.9 24.5-11.4 46.3-21.4 62.9c-5.5 9.2-11.1 16.6-15.2 21.6c-2.1 2.5-3.7 4.4-4.9 5.7c-.6 .6-1 1.1-1.3 1.4l-.3 .3 0 0 0 0 0 0 0 0c-4.6 4.6-5.9 11.4-3.4 17.4c2.5 6 8.3 9.9 14.8 9.9c28.7 0 57.6-8.9 81.6-19.3c22.9-10 42.4-21.9 54.3-30.6c31.8 11.5 67 17.9 104.1 17.9zm0-336c13.3 0 24 10.7 24 24V248c0 13.3-10.7 24-24 24s-24-10.7-24-24V136c0-13.3 10.7-24 24-24zM224 336a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>',
					} );
				} else {
					// Set up confirmation screen for saving selectors.
					let selectorListHtml = '';
					selectorListHtml += '<table style="text-align: left;"><tr><th style="color: #FFF;"><strong>' + __( 'Label', 'wp-ajaxify-comments' ) + '</strong></th><th style="color: #FFF;">' + __( 'Selector', 'wp-ajaxify-comments' ) + '</th></tr>';
					selectorList.forEach( ( selector ) => {
						// Add the selector.
						selectorListHtml += '<tr><td style="color: #DDD;">' + selector.selectorLabel + '</td><td style="color: #DDD;">' + selector.selector + '</td></tr>';
					} );
					selectorListHtml += '</table>';
					Swal.fire( {
						titleText: __( 'Ajaxify Selector Helper', 'wp-ajaxify-comments' ),
						html: __( 'We found all the selectors. Please confirm the following selectors are correct before saving.', 'wp-ajaxify-comments' ) + '<ul>' + selectorListHtml + '</ul>',
						icon: 'success',
						confirmButtonText: __( 'Save Selectors', 'wp-ajaxify-comments' ),
						allowOutsideClick: false,
						showCloseButton: true,
						showCancelButton: true,
						cancelButtonText: __( 'Cancel', 'wp-ajaxify-comments' ),
						iconHtml: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M256 448c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 49.6 21.3 95.1 56.9 130.8L16 480l150.4-45.1c27.9 8.5 58.1 13.1 89.6 13.1z"/></svg>',
					} ).then( ( result ) => {
						if ( result?.isConfirmed ) {
							// Fire the main helper.
							Swal.fire( {
								titleText: __( 'Saving Selectors', 'wp-ajaxify-comments' ),
								text: __( 'Saving the Selectors.', 'wp-ajaxify-comments' ),
								icon: 'success',
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
											body: 'action=wpac_save_selectors&nonce=' + wpacMenuHelper.saveNonce + '&selectors=' + JSON.stringify( selectorList ),
										} )
											.catch( ( error ) => {
												Swal.showValidationMessage( `Request failed: ${ error }` );
											} );
										return response;
									};
									const ajaxPromise = doAjax();
									ajaxPromise.then( ( response ) => {
										// Show success message.
										if ( response.ok ) {
											response.json().then( ( data ) => {
												const dataResponse = data.data;
												if ( data.success ) {
													Swal.fire( {
														titleText: dataResponse.title,
														text: dataResponse.message,
														icon: 'success',
														confirmButtonText: __( 'OK', 'wp-ajaxify-comments' ),
														allowOutsideClick: false,
														showCloseButton: true,
														iconHtml: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M256 448c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 45.1 17.7 86.8 47.7 120.9c-1.9 24.5-11.4 46.3-21.4 62.9c-5.5 9.2-11.1 16.6-15.2 21.6c-2.1 2.5-3.7 4.4-4.9 5.7c-.6 .6-1 1.1-1.3 1.4l-.3 .3 0 0 0 0 0 0 0 0c-4.6 4.6-5.9 11.4-3.4 17.4c2.5 6 8.3 9.9 14.8 9.9c28.7 0 57.6-8.9 81.6-19.3c22.9-10 42.4-21.9 54.3-30.6c31.8 11.5 67 17.9 104.1 17.9zM369 193L241 321c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 159c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>',
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
						}
					} );
				}
			},
		} );
	};

	// Open comments.
	const menuOpenCommentsButton = document.getElementById( 'wp-admin-bar-wpac-open-comments' );
	if ( null !== menuOpenCommentsButton ) {
		menuOpenCommentsButton.addEventListener( 'click', function( e ) {
			e.preventDefault();

			// Get URL Params (nonce, action).
			const urlParams = new URLSearchParams( e.target.href );
			const nonce = urlParams.get( 'nonce' );
			const postId = urlParams.get( 'post_id' );

			const isConfirm = Swal.fire( {
				titleText: __( 'Open Comments for This Post?', 'wp-ajaxify-comments' ),
				text: __( 'Comments are closed. Would you like to open them?', 'wp-ajaxify-comments' ),
				icon: 'success',
				confirmButtonText: __( 'Open Comments', 'wp-ajaxify-comments' ),
				allowOutsideClick: false,
				showCloseButton: true,
				showConfirmButton: true,
				iconHtml: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M512 240c0 114.9-114.6 208-256 208c-31.5 0-61.7-4.6-89.6-13.1L16 480 56.9 370.8C21.3 335.1 0 289.6 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208zM304.8 144l-29.1 29.1L323 220.4l29.1-29.1L304.8 144zm-51.7 51.7l-85.2 85.2L160 336.1l55.3-7.9L300.4 243l-47.3-47.3z"/></svg>',
			} );
			isConfirm.then( ( result ) => {
				if ( result?.isConfirmed ) {
					// Fire ajax request.
					Swal.fire( {
						titleText: __( 'Opening Comments', 'wp-ajaxify-comments' ),
						text: __( 'Opening the comments.', 'wp-ajaxify-comments' ),
						icon: 'success',
						iconHtml: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M512 240c0 114.9-114.6 208-256 208c-31.5 0-61.7-4.6-89.6-13.1L16 480 56.9 370.8C21.3 335.1 0 289.6 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208zM304.8 144l-29.1 29.1L323 220.4l29.1-29.1L304.8 144zm-51.7 51.7l-85.2 85.2L160 336.1l55.3-7.9L300.4 243l-47.3-47.3z"/></svg>',
						allowOutsideClick: false,
						showCloseButton: true,
						didOpen: () => {
							Swal.showLoading();
							const doAjax = async () => {
								const response = await fetch( wpacMenuHelper.ajaxUrl, {
									method: 'POST',
									headers: {
										'Content-Type': 'application/x-www-form-urlencoded',
									},
									body: 'action=wpac_shortcut_open_comments&nonce=' + nonce + '&post_id=' + postId,
								} )
									.catch( ( error ) => {
										Swal.showValidationMessage( `Request failed: ${ error }` );
									} );
								return response;
							};
							const ajaxPromise = doAjax();
							ajaxPromise.then( ( response ) => {
								// Show success message.
								if ( response.ok ) {
									response.json().then( ( data ) => {
										const dataResponse = data.data;
										if ( data.success ) {
											Swal.fire( {
												titleText: dataResponse.title,
												text: dataResponse.message,
												icon: 'success',
												allowOutsideClick: false,
												showCloseButton: true,
												showCancelButton: true,
												showConfirmButton: true,
												timer: 4500,
												timerProgressBar: true,
												cancelButtonText: __( 'Cancel', 'wp-ajaxify-comments' ),
												confirmButtonText: __( 'Refresh Post', 'wp-ajaxify-comments' ),
												iconHtml: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M256 448c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 45.1 17.7 86.8 47.7 120.9c-1.9 24.5-11.4 46.3-21.4 62.9c-5.5 9.2-11.1 16.6-15.2 21.6c-2.1 2.5-3.7 4.4-4.9 5.7c-.6 .6-1 1.1-1.3 1.4l-.3 .3 0 0 0 0 0 0 0 0c-4.6 4.6-5.9 11.4-3.4 17.4c2.5 6 8.3 9.9 14.8 9.9c28.7 0 57.6-8.9 81.6-19.3c22.9-10 42.4-21.9 54.3-30.6c31.8 11.5 67 17.9 104.1 17.9zM369 193L241 321c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 159c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>',
											} ).then( ( swalResult ) => {
												if ( swalResult?.isConfirmed || ( swalResult?.dismiss === Swal?.DismissReason?.timer ) ) {
													window.location.reload();
												}
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
				}
			} );
		} );
	}

	// Open comments.
	const menuCloseCommentsButton = document.getElementById( 'wp-admin-bar-wpac-close-comments' );
	if ( null !== menuCloseCommentsButton ) {
		menuCloseCommentsButton.addEventListener( 'click', function( e ) {
			e.preventDefault();

			// Get URL Params (nonce, action).
			const urlParams = new URLSearchParams( e.target.href );
			const nonce = urlParams.get( 'nonce' );
			const postId = urlParams.get( 'post_id' );

			const isConfirm = Swal.fire( {
				titleText: __( 'Close Comments for This Post?', 'wp-ajaxify-comments' ),
				text: __( 'Comments are open. Would you like to close them?', 'wp-ajaxify-comments' ),
				icon: 'success',
				confirmButtonText: __( 'Close Comments', 'wp-ajaxify-comments' ),
				allowOutsideClick: false,
				showCloseButton: true,
				showConfirmButton: true,
				iconHtml: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M256 448c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 45.1 17.7 86.8 47.7 120.9c-1.9 24.5-11.4 46.3-21.4 62.9c-5.5 9.2-11.1 16.6-15.2 21.6c-2.1 2.5-3.7 4.4-4.9 5.7c-.6 .6-1 1.1-1.3 1.4l-.3 .3 0 0 0 0 0 0 0 0c-4.6 4.6-5.9 11.4-3.4 17.4c2.5 6 8.3 9.9 14.8 9.9c28.7 0 57.6-8.9 81.6-19.3c22.9-10 42.4-21.9 54.3-30.6c31.8 11.5 67 17.9 104.1 17.9zM175 159c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>',
			} );
			isConfirm.then( ( result ) => {
				if ( result?.isConfirmed ) {
					// Fire ajax request.
					Swal.fire( {
						titleText: __( 'Closing Comments', 'wp-ajaxify-comments' ),
						text: __( 'Closing the comments.', 'wp-ajaxify-comments' ),
						icon: 'success',
						iconHtml: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M256 448c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 45.1 17.7 86.8 47.7 120.9c-1.9 24.5-11.4 46.3-21.4 62.9c-5.5 9.2-11.1 16.6-15.2 21.6c-2.1 2.5-3.7 4.4-4.9 5.7c-.6 .6-1 1.1-1.3 1.4l-.3 .3 0 0 0 0 0 0 0 0c-4.6 4.6-5.9 11.4-3.4 17.4c2.5 6 8.3 9.9 14.8 9.9c28.7 0 57.6-8.9 81.6-19.3c22.9-10 42.4-21.9 54.3-30.6c31.8 11.5 67 17.9 104.1 17.9zM175 159c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>',
						allowOutsideClick: false,
						showCloseButton: true,
						didOpen: () => {
							Swal.showLoading();
							const doAjax = async () => {
								const response = await fetch( wpacMenuHelper.ajaxUrl, {
									method: 'POST',
									headers: {
										'Content-Type': 'application/x-www-form-urlencoded',
									},
									body: 'action=wpac_shortcut_close_comments&nonce=' + nonce + '&post_id=' + postId,
								} )
									.catch( ( error ) => {
										Swal.showValidationMessage( `Request failed: ${ error }` );
									} );
								return response;
							};
							const ajaxPromise = doAjax();
							ajaxPromise.then( ( response ) => {
								// Show success message.
								if ( response.ok ) {
									response.json().then( ( data ) => {
										const dataResponse = data.data;
										if ( data.success ) {
											Swal.fire( {
												titleText: dataResponse.title,
												text: dataResponse.message,
												icon: 'success',
												allowOutsideClick: false,
												showCloseButton: true,
												showCancelButton: true,
												showConfirmButton: true,
												timer: 4500,
												timerProgressBar: true,
												cancelButtonText: __( 'Cancel', 'wp-ajaxify-comments' ),
												confirmButtonText: __( 'Refresh Post', 'wp-ajaxify-comments' ),
												iconHtml: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M256 448c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 45.1 17.7 86.8 47.7 120.9c-1.9 24.5-11.4 46.3-21.4 62.9c-5.5 9.2-11.1 16.6-15.2 21.6c-2.1 2.5-3.7 4.4-4.9 5.7c-.6 .6-1 1.1-1.3 1.4l-.3 .3 0 0 0 0 0 0 0 0c-4.6 4.6-5.9 11.4-3.4 17.4c2.5 6 8.3 9.9 14.8 9.9c28.7 0 57.6-8.9 81.6-19.3c22.9-10 42.4-21.9 54.3-30.6c31.8 11.5 67 17.9 104.1 17.9zM369 193L241 321c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 159c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>',
											} ).then( ( swalResult ) => {
												if ( swalResult?.isConfirmed || ( swalResult?.dismiss === Swal?.DismissReason?.timer ) ) {
													window.location.reload();
												}
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
				}
			} );
		} );
	}
} );

