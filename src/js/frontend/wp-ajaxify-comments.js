import { createHooks } from '@wordpress/hooks';

const wpacHooks = createHooks();

WPAC._Options = WPAC._Options || {};

WPAC._BodyRegex = new RegExp( '<body[^>]*>((.|\n|\r)*)</body>', 'i' );
WPAC._ExtractBody = function( html ) {
	try {
		return jQuery( '<div>' + WPAC._BodyRegex.exec( html )[ 1 ] + '</div>' );
	} catch ( e ) {
		return false;
	}
};

WPAC._TitleRegex = new RegExp( '<title[^>]*>(.*?)<\\/title>', 'im' );
WPAC._ExtractTitle = function( html ) {
	try {
		return WPAC._TitleRegex.exec( html )[ 1 ];
	} catch ( e ) {
		return false;
	}
};

WPAC._ShowMessage = function( message, type ) {
	// Determine how to display the loading message.
	const lazyLoadDisplay = WPAC._Options.lazyLoadDisplay;
	const lazyLoadEnabled = WPAC._Options.lazyLoadEnabled;

	// Check if lazy load enabled or not.
	if ( lazyLoadEnabled && 'overlay' !== lazyLoadDisplay ) {
		return;
	}
	const top =
		WPAC._Options.popupMarginTop + ( jQuery( '#wpadminbar' ).outerHeight() || 0 );

	let backgroundColor = WPAC._Options.popupBackgroundColorLoading;
	let textColor = WPAC._Options.popupTextColorLoading;
	if ( type == 'error' ) {
		backgroundColor = WPAC._Options.popupBackgroundColorError;
		textColor = WPAC._Options.popupTextColorError;
	} else if ( type == 'success' ) {
		backgroundColor = WPAC._Options.popupBackgroundColorSuccess;
		textColor = WPAC._Options.popupTextColorSuccess;
	}
	
	jQuery.blockUI({ 
		blockMsgClass: "wpac-overlay",
		message: message, 
		fadeIn: WPAC._Options.popupFadeIn, 
		fadeOut: WPAC._Options.popupFadeOut, 
		timeout:(type == "loading") ? 0 : WPAC._Options.popupTimeout,
		centerY: false,
		centerX: true,
		showOverlay: type == 'loading' || type == 'loadingPreview',
		css: {
			width: WPAC._Options.popupWidth + '%',
			left: ( 100 - WPAC._Options.popupWidth ) / 2 + '%',
			top: top + 'px',
			border: 'none',
			padding: WPAC._Options.popupPadding + 'px',
			backgroundColor,
			'-webkit-border-radius': WPAC._Options.popupCornerRadius + 'px',
			'-moz-border-radius': WPAC._Options.popupCornerRadius + 'px',
			'border-radius': WPAC._Options.popupCornerRadius + 'px',
			opacity: WPAC._Options.popupOpacity / 100,
			color: textColor,
			textAlign: WPAC._Options.popupTextAlign,
			cursor:
				type == 'loading' || type == 'loadingPreview' ? 'wait' : 'default',
			'font-size': WPAC._Options.popupTextFontSize,
		},
		overlayCSS: {
			backgroundColor: '#000',
			opacity: 0,
		},
		baseZ: WPAC._Options.popupZindex,
	} );
};

WPAC._DebugErrorShown = false;
WPAC._Debug = function( level, message ) {
	if ( ! WPAC._Options.debug ) {
		return;
	}

	// Fix console.log.apply for IE9
	// see http://stackoverflow.com/a/5539378/516472
	if (
		Function.prototype.call &&
		Function.prototype.call.bind &&
		typeof window.console !== 'undefined' &&
		console &&
		typeof console.log === 'object' &&
		typeof window.console[ level ].apply === 'undefined'
	) {
		console[ level ] = Function.prototype.call.bind( console[ level ], console );
	}

	if (
		typeof window.console === 'undefined' ||
		typeof window.console[ level ] === 'undefined' ||
		typeof window.console[ level ].apply === 'undefined'
	) {
		if ( ! WPAC._DebugErrorShown ) {
			alert(
				'Unfortunately the console object is undefined or is not supported in your browser, debugging WP Ajaxify Comments is disabled! Please use Firebug, Google Chrome or Internet Explorer 9 or above with enabled Developer Tools (F12) for debugging WP Ajaxify Comments.',
			);
		}
		WPAC._DebugErrorShown = true;
		return;
	}

	const args = jQuery.merge(
		[ '[WP Ajaxify Comments] ' + message ],
		jQuery.makeArray( arguments ).slice( 2 ),
	);
	console[ level ].apply( console, args );
};

WPAC._DebugSelector = function( elementType, selector, optional ) {
	if ( ! WPAC._Options.debug ) {
		return;
	}

	const element = jQuery( selector );
	if ( ! element.length ) {
		WPAC._Debug(
			optional ? 'info' : 'error',
			"Search %s (selector: '%s')... Not found",
			elementType,
			selector,
		);
	} else {
		WPAC._Debug(
			'info',
			"Search %s (selector: '%s')... Found: %o",
			elementType,
			selector,
			element,
		);
	}
};

WPAC._AddQueryParamStringToUrl = function( url, param, value ) {
	// Get URL object.
	const urlObject = new URL( url );

	// Get query params.
	const queryParams = urlObject.searchParams;

	// Set query param.
	queryParams.set( param, value );

	// Set query params.
	urlObject.search = queryParams.toString();

	// Return URL.
	return urlObject.toString();
};

WPAC._LoadFallbackUrl = function( fallbackUrl ) {
	WPAC._ShowMessage( WPAC._Options.textReloadPage, 'loading' );

	const url = WPAC._AddQueryParamStringToUrl(
		fallbackUrl,
		'WPACRandom',
		new Date().getTime(),
	);
	WPAC._Debug(
		'info',
		"Something went wrong. Reloading page (URL: '%s')...",
		url,
	);

	const reload = function() {
		location.href = url;
	};
	if ( ! WPAC._Options.debug ) {
		reload();
	} else {
		WPAC._Debug( 'info', 'Sleep for 5s to enable analyzing debug messages...' );
		window.setTimeout( reload, 5000 );
	}
};

WPAC._ScrollToAnchor = function( anchor, updateHash, scrollComplete ) {
	scrollComplete = scrollComplete || function() { };
	const anchorElement = jQuery( anchor );
	if ( anchorElement.length ) {
		WPAC._Debug(
			'info',
			'Scroll to anchor element %o (scroll speed: %s ms)...',
			anchorElement,
			WPAC._Options.scrollSpeed,
		);
		const animateComplete = function() {
			if ( updateHash ) {
				window.location.hash = anchor;
			}
			scrollComplete();
		};
		const scrollTargetTopOffset = anchorElement.offset().top;
		if ( jQuery( window ).scrollTop() == scrollTargetTopOffset ) {
			animateComplete();
		} else {
			jQuery( 'html,body' ).animate(
				{ scrollTop: scrollTargetTopOffset },
				{
					duration: WPAC._Options.scrollSpeed,
					complete: animateComplete,
				},
			);
		}
		return true;
	}
	WPAC._Debug( 'error', "Anchor element not found (selector: '%s')", anchor );
	return false;
};

WPAC._UpdateUrl = function( url ) {
	if ( url.split( '#' )[ 0 ] == window.location.href.split( '#' )[ 0 ] ) {
		return;
	}
	if ( window.history.replaceState ) {
		window.history.replaceState( {}, window.document.title, url );
	} else {
		WPAC._Debug(
			'info',
			'Browser does not support window.history.replaceState() to update the URL without reloading the page',
			anchor,
		);
	}
};

WPAC._ReplaceComments = function(
	data,
	commentUrl,
	useFallbackUrl,
	formData,
	formFocus,
	selectorCommentsContainer,
	selectorCommentForm,
	selectorRespondContainer,
	beforeSelectElements,
	beforeUpdateComments,
	afterUpdateComments,
) {
	// Remove any lazy loading messages.
	jQuery( '#wpac-lazy-load-content-clone' ).remove();

	const fallbackUrl = useFallbackUrl
		? WPAC._AddQueryParamStringToUrl( commentUrl, 'WPACFallback', '1' )
		: commentUrl;

	let oldCommentsContainer = jQuery( selectorCommentsContainer );
	if ( WPAC._Options.lazyLoadIntoElement && 'comments' !== WPAC._Options.lazyLoadInlineDisplayLocation ) {
		oldCommentsContainer = jQuery( WPAC._Options.lazyLoadInlineDisplayElement );
	}
	if ( ! oldCommentsContainer.length ) {
		WPAC._Debug(
			'error',
			"Comment container on current page not found (selector: '%s')",
			selectorCommentsContainer,
		);
		WPAC._LoadFallbackUrl( fallbackUrl );
		return false;
	}
	// If length is greater than one, there may be greedy selectors.
	if ( oldCommentsContainer.length > 1 ) {
		WPAC._Debug(
			'error',
			"Comment form on requested page found multiple times (selector: '%s')",
			oldCommentsContainer,
		);
		oldCommentsContainer = oldCommentsContainer.filter( function() {
			return jQuery( this ).children().length > 0 && ! jQuery( this ).is( ':header' );
		} );
	}

	const extractedBody = WPAC._ExtractBody( data );
	if ( extractedBody === false ) {
		WPAC._Debug(
			'error',
			"Unsupported server response, unable to extract body (data: '%s')",
			data,
		);
		WPAC._LoadFallbackUrl( fallbackUrl );
		return false;
	}

	// Call before select elements.
	if ( beforeSelectElements !== '' ) {
		const beforeSelect = new Function( 'extractedBody', beforeSelectElements );
		beforeSelect( extractedBody );

		// Set up custom event.
		const beforeSelectEvent = new CustomEvent( 'wpacBeforeSelectElements', {
			detail: { extractedBody },
		} );
		document.dispatchEvent( beforeSelectEvent );
	}

	let newCommentsContainer = extractedBody.find( selectorCommentsContainer );
	if ( ! newCommentsContainer.length ) {
		WPAC._Debug(
			'error',
			"Comment container on requested page not found (selector: '%s')",
			selectorCommentsContainer,
		);
		WPAC._LoadFallbackUrl( fallbackUrl );
		return false;
	}
	if ( newCommentsContainer.length > 1 ) {
		WPAC._Debug(
			'error',
			"Comment form on requested page found multiple times (selector: '%s')",
			newCommentsContainer,
		);

		// Find the first comment container that has children and is not a heading.
		newCommentsContainer = newCommentsContainer.filter( function() {
			return jQuery( this ).children().length > 0 && ! jQuery( this ).is( ':header' );
		} );

		// Find respond selector and remove.
		const respondContainer = newCommentsContainer.find( selectorRespondContainer );
		if ( respondContainer.length ) {
			respondContainer.remove();
		}
	}

	// Call before update comments.
	if ( '' !== beforeUpdateComments ) {
		const beforeComments = new Function(
			'extractedBody',
			'commentUrl',
			beforeUpdateComments,
		);
		beforeComments( extractedBody, commentUrl );

		// Set up native event handler.
		const beforeCommentsEvent = new CustomEvent( 'wpacBeforeUpdateComments', {
			detail: { newDom: extractedBody, commentUrl },
		} );
		document.dispatchEvent( beforeCommentsEvent );
	}

	// Update title
	const extractedTitle = WPAC._ExtractTitle( data );
	if ( extractedBody !== false ) {
		// Decode HTML entities (see http://stackoverflow.com/a/5796744)
		document.title = jQuery( '<textarea />' ).html( extractedTitle ).text();
	}

	// Empty old container, replace with innards of new container.
	oldCommentsContainer.empty();
	oldCommentsContainer.append( newCommentsContainer.children() );

	if ( WPAC._Options.commentsEnabled ) {
		const form = jQuery( selectorCommentForm );
		if ( form.length ) {
			// Replace comment form (for spam protection plugin compatibility) if comment form is not nested in comments container
			// If comment form is nested in comments container comment form has already been replaced
			if ( ! form.parents( selectorCommentsContainer ).length ) {
				WPAC._Debug( 'info', 'Replace comment form...' );
				const newCommentForm = extractedBody.find( selectorCommentForm );
				if ( newCommentForm.length == 0 ) {
					WPAC._Debug(
						'error',
						"Comment form on requested page not found (selector: '%s')",
						selectorCommentForm,
					);
					WPAC._LoadFallbackUrl( fallbackUrl );
					return false;
				}
				form.replaceWith( newCommentForm );
			}
		} else {
			WPAC._Debug( 'info', 'Try to re-inject comment form...' );

			// "Re-inject" comment form, if comment form was removed by updating the comments container; could happen
			// if theme support threaded/nested comments and form tag is not nested in comments container
			// -> Replace WordPress placeholder <div> (#wp-temp-form-div) with respond <div>
			const wpTempFormDiv = jQuery( '#wp-temp-form-div' );
			if ( ! wpTempFormDiv.length ) {
				WPAC._Debug(
					'error',
					"WordPress' #wp-temp-form-div container not found",
					selectorRespondContainer,
				);
				WPAC._LoadFallbackUrl( fallbackUrl );
				return false;
			}
			const newRespondContainer = extractedBody.find( selectorRespondContainer );
			if ( ! newRespondContainer.length ) {
				WPAC._Debug(
					'error',
					"Respond container on requested page not found (selector: '%s')",
					selectorRespondContainer,
				);
				WPAC._LoadFallbackUrl( fallbackUrl );
				return false;
			}
			wpTempFormDiv.replaceWith( newRespondContainer );
		}

		if ( formData ) {
			// Re-inject saved form data
			jQuery.each( formData, function( key, value ) {
				const formElement = jQuery(
					"[name='" + value.name + "']",
					selectorCommentForm,
				);
				if ( formElement.length != 1 || formElement.val() ) {
					return;
				}
				formElement.val( value.value );
			} );
		}
		if ( formFocus ) {
			// Reset focus
			const formElement = jQuery(
				"[name='" + formFocus + "']",
				selectorCommentForm,
			);
			if ( formElement ) {
				formElement.focus();
			}
		}
	}

	// Call after update comments.
	if ( '' !== afterUpdateComments ) {
		const updateComments = new Function(
			'extractedBody',
			'commentUrl',
			afterUpdateComments,
		);
		updateComments( extractedBody, commentUrl );

		// Set up native event handler.
		const updateCommentsEvent = new CustomEvent( 'wpacAfterUpdateComments', {
			detail: { newDom: extractedBody, commentUrl },
		} );
		document.dispatchEvent( updateCommentsEvent );
	}

	return true;
};

WPAC._TestCrossDomainScripting = function( url ) {
	if ( url.indexOf( 'http' ) != 0 ) {
		return false;
	}
	const domain = window.location.protocol + '//' + window.location.host;
	return url.indexOf( domain ) != 0;
};

WPAC._TestFallbackUrl = function( url ) {
	// Get URL object.
	const urlObject = new URL( url );

	// Get query params.
	const queryParams = urlObject.searchParams;
	const fallbackParam = queryParams.get( 'WPACFallback' );
	const randomParam = queryParams.get( 'WPACRandom' );

	return fallbackParam && randomParam;
};

WPAC.AttachForm = function( options ) {
	// Set default options
	options = jQuery.extend(
		{
			selectorCommentForm: WPAC._Options.selectorCommentForm,
			selectorCommentPagingLinks: WPAC._Options.selectorCommentPagingLinks,
			beforeSelectElements: WPACCallbacks.beforeSelectElements,
			beforeSubmitComment: WPACCallbacks.beforeSubmitComment,
			afterPostComment: WPACCallbacks.afterPostComment,
			selectorCommentsContainer: WPAC._Options.selectorCommentsContainer,
			selectorRespondContainer: WPAC._Options.selectorRespondContainer,
			beforeUpdateComments: WPACCallbacks.beforeUpdateComments,
			afterUpdateComments: WPACCallbacks.afterUpdateComments,
			scrollToAnchor: ! WPAC._Options.disableScrollToAnchor,
			updateUrl: ! WPAC._Options.disableUrlUpdate,
			selectorCommentLinks: WPAC._Options.selectorCommentLinks,
		},
		options || {},
	);

	/**
	 * Filter the options for Ajaxify Comments.
	 *
	 * @param { Object } options Options for Ajaxify Comments.
	 * @param { string } url     The URL to load.
	 * @param { string } caller  What function called the filter.
	 */
	options = wpacHooks.applyFilters( 'wpacJSOptions', options, '', 'AttachForm' );

	if ( WPAC._Options.debug && WPAC._Options.commentsEnabled ) {
		WPAC._Debug( 'info', 'Attach form...' );
		WPAC._DebugSelector( 'comment form', options.selectorCommentForm );
		WPAC._DebugSelector(
			'comments container',
			options.selectorCommentsContainer,
		);
		WPAC._DebugSelector( 'respond container', options.selectorRespondContainer );
		WPAC._DebugSelector(
			'comment paging links',
			options.selectorCommentPagingLinks,
			true,
		);
		WPAC._DebugSelector( 'comment links', options.selectorCommentLinks, true );
	}

	// Try before submit comment. Using new function is not ideal here, but safer than exec.
	if ( '' !== WPACCallbacks.beforeSelectElements ) {
		const beforeSelect = new Function(
			'dom',
			WPACCallbacks.beforeSelectElements,
		);
		beforeSelect( jQuery( document ) );

		// Set up native event handler.
		const beforeSelectEvent = new CustomEvent( 'wpacBeforeSelectElements', {
			detail: { dom: jQuery( document ) },
		} );
		document.dispatchEvent( beforeSelectEvent );
	}

	// Get addHandler method
	if ( jQuery( document ).on ) {
		// jQuery 1.7+
		var addHandler = function( event, selector, handler ) {
			jQuery( document ).on( event, selector, handler );
		};
	} else if ( jQuery( document ).delegate ) {
		// jQuery 1.4.3+
		var addHandler = function( event, selector, handler ) {
			jQuery( document ).delegate( selector, event, handler );
		};
	} else {
		// jQuery 1.3+
		var addHandler = function( event, selector, handler ) {
			jQuery( selector ).live( event, handler );
		};
	}

	// Handle paging link clicks
	const pagingClickHandler = function( event ) {
		const href = jQuery( this ).attr( 'href' );
		if ( href ) {
			event.preventDefault();
			WPAC.LoadComments( href, {
				selectorCommentForm: options.selectorCommentForm,
				selectorCommentsContainer: options.selectorCommentsContainer,
				selectorRespondContainer: options.selectorRespondContainer,
				beforeSelectElements: options.beforeSelectElements,
				beforeUpdateComments: options.beforeUpdateComments,
				afterUpdateComments: options.afterUpdateComments,
			} );
		}
	};
	addHandler( 'click', options.selectorCommentPagingLinks, pagingClickHandler );

	// Handle comment link clicks
	const linkClickHandler = function( event ) {
		const element = jQuery( this );
		if ( element.is( options.selectorCommentPagingLinks ) ) {
			return;
		} // skip if paging link was clicked
		const href = element.attr( 'href' );
		// To use new URL.
		const anchor = new URL( href ).hash;
		
		if ( jQuery( anchor ).length > 0 ) {
			if ( options.updateUrl ) {
				WPAC._UpdateUrl( href );
			}
			WPAC._ScrollToAnchor( anchor, options.updateUrl );
			event.preventDefault();
		}
	};
	addHandler( 'click', options.selectorCommentLinks, linkClickHandler );

	if ( ! WPAC._Options.commentsEnabled ) {
		return;
	}

	// Handle form submit
	const formSubmitHandler = function( event ) {
		const form = jQuery( this );

		// Try before submit comment. Using new function is not ideal here, but safer than exec.
		if ( WPACCallbacks.beforeSubmitComment !== '' ) {
			const beforeSubmit = new Function(
				'dom',
				WPACCallbacks.beforeSubmitComment,
			);
			beforeSubmit( jQuery( document ) );

			// Set up native event handler.
			const beforeSubmitEvent = new CustomEvent( 'wpacBeforeSubmitComment', {
				detail: { dom: jQuery( document ) },
			} );
			document.dispatchEvent( beforeSubmitEvent );
		}

		const submitUrl = form.attr( 'action' );

		// Cancel AJAX request if cross-domain scripting is detected
		if ( WPAC._TestCrossDomainScripting( submitUrl ) ) {
			if ( WPAC._Options.debug && ! form.data( 'submitCrossDomain' ) ) {
				WPAC._Debug(
					'error',
					"Cross-domain scripting detected (submit url: '%s'), cancel AJAX request",
					submitUrl,
				);
				WPAC._Debug(
					'info',
					'Sleep for 5s to enable analyzing debug messages...',
				);
				event.preventDefault();
				form.data( 'submitCrossDomain', true );
				window.setTimeout( function() {
					jQuery( '#submit', form ).remove();
					form.submit();
				}, 5000 );
			}
			return;
		}

		// Stop default event handling
		event.preventDefault();

		// Test if form is already submitting
		if ( form.data( 'WPAC_SUBMITTING' ) ) {
			WPAC._Debug(
				'info',
				'Cancel submit, form is already submitting (Form: %o)',
				form,
			);
			return;
		}
		form.data( 'WPAC_SUBMITTING', true );

		// Show loading info
		WPAC._ShowMessage( WPAC._Options.textPostComment, 'loading' );

		const handleErrorResponse = function( data ) {
			WPAC._Debug( 'info', 'Comment has not been posted' );
			WPAC._Debug(
				'info',
				"Try to extract error message (selector: '%s')...",
				WPAC._Options.selectorErrorContainer,
			);

			// Extract error message
			const extractedBody = WPAC._ExtractBody( data );
			if ( extractedBody !== false ) {
				let errorMessage = extractedBody.find(
					WPAC._Options.selectorErrorContainer,
				);
				if ( errorMessage.length ) {
					errorMessage = errorMessage.html();
					WPAC._Debug(
						'info',
						"Error message '%s' successfully extracted",
						errorMessage,
					);
					WPAC._ShowMessage( errorMessage, 'error' );
					return;
				}
			}

			WPAC._Debug(
				'error',
				"Error message could not be extracted, use error message '%s'.",
				WPAC._Options.textUnknownError,
			);
			WPAC._ShowMessage( WPAC._Options.textUnknownError, 'error' );
		};

		var request = jQuery.ajax( {
			url: submitUrl,
			type: 'POST',
			data: form.serialize(),
			beforeSend( xhr ) {
				xhr.setRequestHeader( 'X-WPAC-REQUEST', '1' );
			},
			complete( xhr, textStatus ) {
				form.removeData( 'WPAC_SUBMITTING', true );
			},
			success( data ) {
				// Test error state (WordPress >=4.1 does not return 500 status code if posting comment failed)
				if ( request.getResponseHeader( 'X-WPAC-ERROR' ) ) {
					WPAC._Debug(
						'info',
						'Found error state X-WPAC-ERROR header.',
						commentUrl,
					);
					handleErrorResponse( data );
					return;
				}

				WPAC._Debug( 'info', 'Comment has been posted' );

				// Get info from response header
				var commentUrl = request.getResponseHeader( 'X-WPAC-URL' );
				WPAC._Debug(
					'info',
					"Found comment URL '%s' in X-WPAC-URL header.",
					commentUrl,
				);
				const unapproved = request.getResponseHeader( 'X-WPAC-UNAPPROVED' );
				WPAC._Debug(
					'info',
					"Found unapproved state '%s' in X-WPAC-UNAPPROVED",
					unapproved,
				);

				// Try afterPostComment submit comment. Using new function is not ideal here, but safer than exec.
				if ( WPACCallbacks.afterPostComment !== '' ) {
					const afterComment = new Function(
						'commentUrl',
						'unapproved',
						afterPostComment,
					);
					afterComment( commentUrl, unapproved == '1' );

					// Set up native event handler.
					const afterCommentEvent = new CustomEvent( 'wpacAfterPostComment', {
						detail: { commentUrl, unapproved: unapproved == '1' },
					} );
					document.dispatchEvent( afterCommentEvent );
				}

				// Show success message
				WPAC._ShowMessage(
					unapproved == '1'
						? WPAC._Options.textPostedUnapproved
						: WPAC._Options.textPosted,
					'success',
				);

				/**
				 * Sunshine Confetti Plugin integration.
				 *
				 * @since 3.0.0
				 *
				 * @see https://wordpress.org/plugins/confetti/
				 */
				if ( typeof window.wps_launch_confetti_cannon !== 'undefined' ) {
					window.wps_launch_confetti_cannon();
				}

				// Replace comments (and return if replacing failed)
				if (
					! WPAC._ReplaceComments(
						data,
						commentUrl,
						false,
						{},
						'',
						options.selectorCommentsContainer,
						options.selectorCommentForm,
						options.selectorRespondContainer,
						options.beforeSelectElements,
						options.beforeUpdateComments,
						options.afterUpdateComments,
					)
				) {
					return;
				}

				// Smooth scroll to comment url and update browser url
				if ( commentUrl ) {
					if ( options.updateUrl ) {
						WPAC._UpdateUrl( commentUrl );
					}

					if ( options.scrollToAnchor ) {
						const anchor =
							commentUrl.indexOf( '#' ) >= 0
								? commentUrl.substr( commentUrl.indexOf( '#' ) )
								: null;
						if ( anchor ) {
							WPAC._Debug(
								'info',
								"Anchor '%s' extracted from comment URL '%s'",
								anchor,
								commentUrl,
							);
							WPAC._ScrollToAnchor( anchor, options.updateUrl );
						}
					}
				}
			},
			error( jqXhr, textStatus, errorThrown ) {
				// Test if loading comment url failed (due to cross site scripting error)
				if ( jqXhr.status === 0 && jqXhr.responseText === '' ) {
					WPAC._Debug(
						'error',
						'Comment seems to be posted, but loading comment update failed.',
					);
					WPAC._LoadFallbackUrl(
						WPAC._AddQueryParamStringToUrl(
							window.location.href,
							'WPACFallback',
							'1',
						),
					);
					return;
				}

				handleErrorResponse( jqXhr.responseText );
			},
		} );
	};
	addHandler( 'submit', options.selectorCommentForm, formSubmitHandler );
};

WPAC._Initialized = false;
WPAC.Init = function() {
	// Test if plugin already has been initialized
	if ( WPAC._Initialized ) {
		WPAC._Debug( 'info', 'Abort initialization (plugin already initialized)' );
		return false;
	}
	WPAC._Initialized = true;

	// Assert that environment is set up correctly
	if ( ! WPAC._Options || ! WPACCallbacks ) {
		WPAC._Debug(
			'error',
			'Something unexpected happened, initialization failed. Please try to reinstall the plugin.',
		);
		return false;
	}

	// Debug infos
	WPAC._Debug( 'info', 'Initializing version %s', WPAC._Options.version );

	// Debug infos
	if ( WPAC._Options.debug ) {
		if ( ! jQuery || ! jQuery.fn || ! jQuery.fn.jquery ) {
			WPAC._Debug(
				'error',
				'jQuery not found, abort initialization. Please try to reinstall the plugin.',
			);
			return false;
		}
		WPAC._Debug( 'info', 'Found jQuery %s', jQuery.fn.jquery );
		if ( ! jQuery.blockUI || ! jQuery.blockUI.version ) {
			WPAC._Debug(
				'error',
				'jQuery blockUI not found, abort initialization. Please try to reinstall the plugin.',
			);
			return false;
		}
		WPAC._Debug( 'info', 'Found jQuery blockUI %s', jQuery.blockUI.version );
		if ( ! jQuery.idleTimer ) {
			WPAC._Debug(
				'error',
				'jQuery Idle Timer plugin not found, abort initialization. Please try to reinstall the plugin.',
			);
			return false;
		}
		WPAC._Debug( 'info', 'Found jQuery Idle Timer plugin' );
	}

	if ( WPAC._Options.selectorPostContainer ) {
		WPAC._Debug(
			'info',
			"Multiple comment form support enabled (selector: '%s')",
			WPAC._Options.selectorPostContainer,
		);
		jQuery( WPAC._Options.selectorPostContainer ).each( function( i, e ) {
			const id = jQuery( e ).attr( 'id' );
			if ( ! id ) {
				WPAC._Debug(
					'info',
					'Skip post container element %o (ID not defined)',
					e,
				);
				return;
			}
			WPAC.AttachForm( {
				selectorCommentForm: '#' + id + ' ' + WPAC._Options.selectorCommentForm,
				selectorCommentPagingLinks:
					'#' + id + ' ' + WPAC._Options.selectorCommentPagingLinks,
				selectorCommentsContainer:
					'#' + id + ' ' + WPAC._Options.selectorCommentsContainer,
				selectorRespondContainer:
					'#' + id + ' ' + WPAC._Options.selectorRespondContainer,
			} );
		} );
	} else {
		WPAC.AttachForm();
	}

	// Set up loading preview handlers.
	jQuery( '#wp-admin-bar-wpac-menu-helper-preview-overlay-loading a' ).on(
		'click',
		function( e ) {
			e.preventDefault();
			WPAC._ShowMessage( 'This is the loading preview...', 'loadingPreview' );
		},
	);

	// Set up success preview handlers.
	jQuery( '#wp-admin-bar-wpac-menu-helper-preview-overlay-success a' ).on(
		'click',
		function( e ) {
			e.preventDefault();
			WPAC._ShowMessage( 'This is a success message', 'success' );
		},
	);

	// Set up error preview handlers.
	jQuery( '#wp-admin-bar-wpac-menu-helper-preview-overlay-error a' ).on(
		'click',
		function( e ) {
			e.preventDefault();
			WPAC._ShowMessage( 'This is an error message', 'error' );
		},
	);

	// Set up idle timer
	if ( WPAC._Options.commentsEnabled && WPAC._Options.autoUpdateIdleTime > 0 ) {
		WPAC._Debug(
			'info',
			'Auto updating comments enabled (idle time: %s)',
			WPAC._Options.autoUpdateIdleTime,
		);
		WPAC._InitIdleTimer();
	}

	WPAC._Debug( 'info', 'Initialization completed' );

	return true;
};

WPAC._OnIdle = function() {
	WPAC.RefreshComments( { success: WPAC._InitIdleTimer, scrollToAnchor: false } );
};

WPAC._InitIdleTimer = function() {
	if ( WPAC._TestFallbackUrl( location.href ) ) {
		WPAC._Debug(
			'error',
			"Fallback URL was detected (url: '%s'), cancel init idle timer",
			location.href,
		);
		return;
	}

	jQuery( document ).idleTimer( 'destroy' );
	jQuery( document ).idleTimer( WPAC._Options.autoUpdateIdleTime );
	jQuery( document ).on( 'idle.idleTimer', WPAC._OnIdle );
};

/**
 * Refresh the comments by Ajaxify Comments.
 * @param { Object } options Optiosn for Ajaxify Comments.
 * @return comments.
 */
WPAC.RefreshComments = function( options ) {
	const url = location.href;
	if ( WPAC._TestFallbackUrl( location.href ) ) {
		WPAC._Debug(
			'error',
			"Fallback URL was detected (url: '%s'), cancel AJAX request",
			url,
		);
		return false;
	}

	/**
	 * Filter the options for Ajaxify Comments.
	 *
	 * @param { Object } options Options for Ajaxify Comments.
	 * @param { string } url     The URL to load.
	 * @param { string } caller  What function called the filter.
	 */
	options = wpacHooks.applyFilters(
		'wpacJSOptions',
		options,
		url,
		'RefreshComments',
	);

	// Users can pass options as first parameter to override selectors.
	return WPAC.LoadComments( url, options );
};

WPAC.LoadComments = function( url, options ) {
	// Cancel AJAX request if cross-domain scripting is detected
	if ( WPAC._TestCrossDomainScripting( url ) ) {
		WPAC._Debug(
			'error',
			"Cross-domain scripting detected (url: '%s'), cancel AJAX request",
			url,
		);
		return false;
	}

	// Convert boolean parameter (used in version <0.14.0)
	if ( typeof options === 'boolean' ) {
		options = { scrollToAnchor: options };
	}

	// Set default options
	options = jQuery.extend(
		{
			scrollToAnchor: ! WPAC._Options.disableScrollToAnchor,
			showLoadingInfo: true,
			updateUrl: ! WPAC._Options.disableUrlUpdate,
			success() { },
			selectorCommentForm: WPAC._Options.selectorCommentForm,
			selectorCommentsContainer: WPAC._Options.selectorCommentsContainer,
			selectorRespondContainer: WPAC._Options.selectorRespondContainer,
			disableCache: WPAC._Options.disableCache,
			beforeSelectElements: WPACCallbacks.beforeSelectElements,
			beforeUpdateComments: WPACCallbacks.beforeUpdateComments,
			afterUpdateComments: WPACCallbacks.afterUpdateComments,
		},
		options || {},
	);

	/**
	 * Filter the options for Ajaxify Comments.
	 *
	 * @param { Object } options Options for Ajaxify Comments.
	 * @param { string } url     The URL to load.
	 * @param { string } caller  What function called the filter.
	 */
	options = wpacHooks.applyFilters(
		'wpacJSOptions',
		options,
		url,
		'LoadComments',
	);

	// Save form data and focus
	const formData = jQuery( options.selectorCommentForm ).serializeArray();
	const formFocus = document.activeElement
		? jQuery(
			"[name='" + document.activeElement.name + "']",
			options.selectorCommentForm,
		).attr( 'name' )
		: '';

	// Get query strings form URL (ajaxifyLazyLoadEnable, nonce, post_id).
	const urlObject = new URL( url );
	const queryParams = urlObject.searchParams;
	const ajaxifyLazyLoadEnable = queryParams.get( 'ajaxifyLazyLoadEnable' );
	const nonce = queryParams.get( 'nonce' );
	const postId = queryParams.get( 'post_id' );

	// Add to URL.
	url = WPAC._AddQueryParamStringToUrl(
		url,
		'ajaxifyLazyLoadEnable',
		ajaxifyLazyLoadEnable,
	);
	url = WPAC._AddQueryParamStringToUrl( url, 'nonce', nonce );
	url = WPAC._AddQueryParamStringToUrl( url, 'post_id', postId );

	if ( options.disableCache ) {
		url = WPAC._AddQueryParamStringToUrl(
			url,
			'WPACRandom',
			new Date().getTime(),
		);
	}

	const request = jQuery.ajax( {
		url,
		type: 'GET',
		beforeSend( xhr ) {
			xhr.setRequestHeader( 'X-WPAC-REQUEST', '1' );
		},
		success( data ) {
			try {
				console.log( data );

				if (
					! WPAC._ReplaceComments(
						data,
						url,
						true,
						formData,
						formFocus,
						options.selectorCommentsContainer,
						options.selectorCommentForm,
						options.selectorRespondContainer,
						options.beforeSelectElements,
						options.beforeUpdateComments,
						options.afterUpdateComments,
					)
				) {
					return;
				}

				if ( options.updateUrl ) {
					WPAC._UpdateUrl( url );
				}

				// Scroll to anchor
				var waitForScrollToAnchor = false;
				if ( options.scrollToAnchor ) {
					const anchor =
						url.indexOf( '#' ) >= 0 ? url.substr( url.indexOf( '#' ) ) : null;
					if ( anchor ) {
						WPAC._Debug( 'info', "Anchor '%s' extracted from url", anchor );
						if (
							WPAC._ScrollToAnchor( anchor, options.updateUrl, function() {
								options.success();
							} )
						) {
							waitForScrollToAnchor = true;
						}
					}
				}
			} catch ( e ) {
				WPAC._Debug(
					'error',
					'Something went wrong while refreshing comments: %s',
					e,
				);
			}

			// Unblock UI
			jQuery.unblockUI();

			if ( ! waitForScrollToAnchor ) {
				options.success();
			}
		},
		error() {
			WPAC._LoadFallbackUrl(
				WPAC._AddQueryParamStringToUrl(
					window.location.href,
					'WPACFallback',
					'1',
				),
			);
		},
	} );

	return true;
};

jQuery( function() {
	const initSuccesful = WPAC.Init();
	if ( true === WPAC._Options.lazyLoadEnabled ) {
		if ( ! initSuccesful ) {
			WPAC._LoadFallbackUrl(
				WPAC._AddQueryParamStringToUrl(
					window.location.href,
					'WPACFallback',
					'1',
				),
			);
			return;
		}

		const triggerType = WPAC._Options.lazyLoadTrigger;

		let lazyLoadTrigger = WPAC._Options.lazyLoadTrigger;
		const lazyLoadScrollOffset = parseInt(
			WPAC._Options.lazyLoadTriggerScrollOffset,
		);
		const lazyLoadElement = WPAC._Options.lazyLoadTriggerElement;
		const lazyLoadInlineType = WPAC._Options.lazyLoadInlineLoadingType;
		let lazyLoadOffset = parseInt( WPAC._Options.lazyLoadTriggerOffset );
		if ( lazyLoadOffset === 0 ) {
			lazyLoadOffset = '100%';
		}

		// Determine where to load the lazy loading message (if not overlay).
		const isLazyLoadInline = 'inline' === WPAC._Options.lazyLoadDisplay;
		const lazyloadInlineDisplayLocation = WPAC._Options.lazyLoadInlineDisplayLocation; /* can be comments, element */
		

		// If inline, let's move the loader.
		if ( WPAC._Options.lazyLoadIntoElement ) {
			let lazyloadInlineDisplayElement = WPAC._Options.lazyLoadInlineDisplayElement;
			if ( 'comments' === lazyloadInlineDisplayLocation ) {
				lazyloadInlineDisplayElement = WPAC._Options.selectorCommentsContainer;
			}

			const lazyLoadContent = document.querySelector( '#wpac-lazy-load-content' ); // hardcoded selector.
			if ( null !== lazyLoadContent ) {
				// Clone it without ref.
				const lazyLoadContentClone = jQuery.clone( lazyLoadContent );
				lazyLoadContentClone.id = 'wpac-lazy-load-content-clone';

				// Add display block and opacity 1.
				lazyLoadContentClone.style.display = 'block';
				lazyLoadContentClone.style.opacity = '1';
				lazyLoadContentClone.style.visibility = 'visible';

				// Determine trigger if button.
				if ( 'button' === lazyLoadInlineType ) {
					// This will make it so that a button must be clicked to load comments.
					lazyLoadTrigger = 'external';
					
				}

				// Display the loader.
				if ( 'comments' === lazyloadInlineDisplayLocation ) {
					const commentsContainer = jQuery( lazyloadInlineDisplayElement );
					if ( commentsContainer ) {
						commentsContainer.prepend( lazyLoadContentClone );
					} else {
						WPAC._Debug(
							'error',
							'Comments container not found for lazy loading when reaching the comments section.',
						);
					}
				} else if ( 'element' === lazyloadInlineDisplayLocation ) {
					const domElement = jQuery( lazyloadInlineDisplayElement );
					if ( domElement ) {
						// add to top of comments element.
						jQuery( domElement ).prepend( lazyLoadContentClone );

						// Remove style attribute.
						jQuery( domElement ).removeAttr( 'style' );
						
					} else {
						WPAC._Debug(
							'error',
							'Element not found for lazy loading when reaching the element.',
						);
					}
				}

				// Init lazy loading button (if any).
				const lazyLoadButton = document.querySelector( '.ajaxify-comments-loading-button-wrapper button' );
				if ( null !== lazyLoadButton ) {
					lazyLoadButton.addEventListener( 'click', function( e ) {
						e.preventDefault();
						lazyLoadButton.innerHTML = WPAC._Options.lazyLoadInlineLoadingButtonLabelLoading;
						WPAC.RefreshComments();
					} );
				}
			}
		}

		/**
		 * Filter the offset for lazy loading.
		 *
		 * @see: http://imakewebthings.com/waypoints/api/offset-option/
		 *
		 * @param { string } lazyLoadOffset       Offset for lazy loading.
		 * @param { string } lazyLoadTrigger      The trigger type for lazy loading.
		 * @param { number } lazyLoadScrollOffset The scroll offset for lazy loading.
		 * @param { string } lazyLoadElement      The element for lazy loading.
		 */
		lazyLoadOffset = wpacHooks.applyFilters(
			'wpacLazyLoadOffset',
			lazyLoadOffset,
			lazyLoadTrigger,
			lazyLoadScrollOffset,
			lazyLoadElement,
		);

		WPAC._Debug(
			'info',
			"Loading comments asynchronously with secondary AJAX request (trigger: '%s')",
			lazyLoadTrigger,
		);

		if ( window.location.hash ) {
			const regex = /^#comment-[0-9]+$/;
			if ( regex.test( window.location.hash ) ) {
				WPAC._Debug(
					'info',
					"Comment anchor in URL detected, force loading comments on DomReady (hash: '%s')",
					window.location.hash,
				);
				lazyLoadTrigger = 'domready';
			}
		}
		switch ( lazyLoadTrigger ) {
			case 'external':
				WPAC._Debug(
					'info',
					'Lazy loading: Waiting on external trigger for lazy loading comments.',
					window.location.hash,
				);
				break;
			case 'comments':
				const commentsContainer = document.querySelector(
					WPAC._Options.selectorCommentsContainer,
				);
				if ( null !== commentsContainer ) {
					WPAC._Debug(
						'info',
						'Lazy loading: Waiting on comments to scroll into view for lazy loading.',
						window.location.hash,
					);
					jQuery( commentsContainer ).waypoint(
						function( direction ) {
							this.destroy();
							WPAC._ShowMessage( WPAC._Options.textRefreshComments, 'loading' );
							WPAC.RefreshComments();
						},
						{ offset: lazyLoadScrollOffset ? lazyLoadScrollOffset : '100%' },
					);
				} else {
					WPAC._Debug(
						'error',
						'Comments container not found for lazy loading when reaching the comments section.',
					);
				}
				break;
			case 'element':
				const domElement = document.querySelector( lazyLoadElement );
				if ( null !== domElement ) {
					WPAC._Debug(
						'info',
						'Lazy loading: Waiting on element to scroll into view for lazy loading.',
						window.location.hash,
					);
					jQuery( domElement ).waypoint(
						function( direction ) {
							this.destroy();
							WPAC._ShowMessage( WPAC._Options.textRefreshComments, 'loading' );
							WPAC.RefreshComments();
						},
						{ offset: lazyLoadScrollOffset ? lazyLoadScrollOffset : '100%' },
					);
				} else {
					WPAC._Debug(
						'error',
						'Element not found for lazy loading when reaching the element.',
					);
				}
				break;
			case 'domready':
				WPAC._Debug(
					'info',
					'Lazy loading: Waiting on Dom to be ready for lazy loading.',
					window.location.hash,
				);
				WPAC.RefreshComments( { scrollToAnchor: true } ); // force scroll to anchor.
				break;
			case 'scroll':
				WPAC._Debug(
					'info',
					'Lazy loading: Waiting on Scroll Into View.',
					window.location.hash,
				);

				// Get the body tag and calculate offset.
				const body = document.querySelector( 'body' );

				jQuery( body ).waypoint(
					function( direction ) {
						this.destroy();
						WPAC._ShowMessage( WPAC._Options.textRefreshComments, 'loading' );
						WPAC.RefreshComments();
					},
					{ offset: lazyLoadScrollOffset * -1 },
				);
		}
	}
} );

function wpac_init() {
	WPAC._Debug( 'info', 'wpac_init() is deprecated, please use WPAC.Init()' );
	WPAC.Init();
}
