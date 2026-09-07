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

WPAC._ShowMessage = function( message, type, force = false ) {
	// Determine how to display the loading message.
	const lazyLoadDisplay = WPAC._Options.lazyLoadDisplay;
	const lazyLoadEnabled = WPAC._Options.lazyLoadEnabled;

	// Check if lazy load enabled or not.
	if ( lazyLoadEnabled && 'overlay' !== lazyLoadDisplay && ! force ) {
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

	let topOffset =
		WPAC._Options.popupVerticalAlign === 'verticalStart' ? top + 'px' : 'unset';
	if ( WPAC._Options.popupVerticalAlign === 'verticalCenter' ) {
		topOffset = '45%';
	}

	jQuery.blockUI( {
		blockMsgClass: 'wpac-overlay',
		message,
		fadeIn: WPAC._Options.popupFadeIn,
		fadeOut: WPAC._Options.popupFadeOut,
		timeout: type == 'loading' ? 0 : WPAC._Options.popupTimeout,
		centerY: false,
		centerX: true,
		showOverlay: true,
		css: {
			width: 'var(--wpac-popup-width)',
			left: 'calc(50% - var(--wpac-popup-width) / 2)',
			top: topOffset,
			bottom:
				WPAC._Options.popupVerticalAlign === 'verticalEnd'
					? top + 'px'
					: 'unset',
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
			backgroundColor: WPAC._Options.popupOverlayBackgroundColor,
			opacity: WPAC._Options.popupOverlayBackgroundColorOpacity,
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
	scrollComplete = scrollComplete || function() {};
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

/**
 * Parse a scoped comments selector of the form #comments-{postId}.
 *
 * @param {string} selector Selector that may contain a client-generated post ID.
 * @return {number} Post ID, or 0 if the selector is not scoped.
 */
WPAC._GetScopedPostId = function( selector ) {
	if ( typeof selector !== 'string' || ! selector ) {
		return 0;
	}

	const match = selector.match( /^#comments-(\d+)$/ );
	return match ? parseInt( match[ 1 ], 10 ) : 0;
};

/**
 * Find the comment_post_ID form marker for a post inside a jQuery root.
 *
 * @param {jQuery} $root  Root to search (document or extracted body).
 * @param {number} postId Post ID to match.
 * @return {jQuery} Matching input, or empty jQuery object.
 */
WPAC._FindFormMarkerByPostId = function( $root, postId ) {
	const parsedPostId = parseInt( postId, 10 );
	if ( ! $root || ! $root.length || ! parsedPostId ) {
		return jQuery();
	}

	return $root.find( 'input[name="comment_post_ID"]' ).filter( function() {
		return parseInt( jQuery( this ).val(), 10 ) === parsedPostId;
	} ).first();
};

/**
 * Find the configured comments container for a post ID.
 *
 * @param {jQuery} $root  Root to search (document or extracted body).
 * @param {number} postId Post ID to match.
 * @return {jQuery} Matching comments container, or empty jQuery object.
 */
WPAC._FindCommentsContainerByPostId = function( $root, postId ) {
	const parsedPostId = parseInt( postId, 10 );
	const commentsSelector = WPAC._Options.selectorCommentsContainer;
	const $marker = WPAC._FindFormMarkerByPostId( $root, parsedPostId );

	if ( $marker.length ) {
		const $closest = $marker.closest( commentsSelector );
		if ( $closest.length ) {
			return $closest.first();
		}

		// Form sits outside the comments container; look within the post wrapper.
		const postContainerSelector = WPAC._Options.selectorPostContainer;
		if ( postContainerSelector ) {
			const $post = $marker.closest( postContainerSelector );
			if ( $post.length ) {
				const $fromPost = $post.find( commentsSelector );
				if ( $fromPost.length ) {
					return $fromPost.first();
				}
			}
		}
	}

	// Live pages stamp #comments-{postId} on the post wrapper; fetched HTML does not.
	if ( parsedPostId ) {
		const $scopedPost = $root.find( '#comments-' + parsedPostId );
		if ( $scopedPost.length ) {
			const $fromScoped = $scopedPost.find( commentsSelector );
			if ( $fromScoped.length ) {
				return $fromScoped.first();
			}
			if ( $scopedPost.is( commentsSelector ) ) {
				return $scopedPost.first();
			}
		}
	}

	return jQuery();
};

/**
 * Find the configured comment form for a post ID.
 *
 * @param {jQuery} $root  Root to search (document or extracted body).
 * @param {number} postId Post ID to match.
 * @return {jQuery} Matching comment form, or empty jQuery object.
 */
WPAC._FindCommentFormByPostId = function( $root, postId ) {
	const $marker = WPAC._FindFormMarkerByPostId( $root, postId );
	if ( ! $marker.length ) {
		return jQuery();
	}

	const formSelector = WPAC._Options.selectorCommentForm;
	if ( formSelector ) {
		const $form = $marker.closest( formSelector );
		if ( $form.length ) {
			return $form.first();
		}
	}

	return $marker.closest( 'form' );
};

/**
 * Collect unique comment_post_ID values from a jQuery root.
 *
 * @param {jQuery} $root Root to search.
 * @return {number[]} Unique post IDs.
 */
WPAC._CollectPostIds = function( $root ) {
	const postIds = [];
	if ( ! $root || ! $root.length ) {
		return postIds;
	}

	$root.find( 'input[name="comment_post_ID"]' ).each( function() {
		const postId = parseInt( jQuery( this ).val(), 10 );
		if ( postId && postIds.indexOf( postId ) === -1 ) {
			postIds.push( postId );
		}
	} );

	return postIds;
};

/**
 * Get serialized form fields saved before a comments refresh.
 *
 * @param {Array|Object} formData Flat serializeArray data or per-post-id map.
 * @param {number}       postId   Post ID when using a per-post-id map.
 * @return {Array|null} Saved fields, or null.
 */
WPAC._GetSavedFormFields = function( formData, postId ) {
	if ( ! formData ) {
		return null;
	}
	if ( formData.byPostId ) {
		return postId ? formData.byPostId[ postId ] : null;
	}
	if ( Array.isArray( formData ) ) {
		return formData;
	}
	return null;
};

/**
 * Restore saved field values into a comment form without overwriting user input.
 *
 * @param {jQuery} $form  Comment form.
 * @param {Array}  fields serializeArray() fields.
 */
WPAC._RestoreFormData = function( $form, fields ) {
	if ( ! $form || ! $form.length || ! fields || ! fields.length ) {
		return;
	}

	jQuery.each( fields, function( key, value ) {
		const formElement = $form.find( "[name='" + value.name + "']" );
		if ( formElement.length !== 1 || formElement.val() ) {
			return;
		}
		formElement.val( value.value );
	} );
};

/**
 * Replace comments for one or more posts by matching comment_post_ID markers.
 *
 * @param {jQuery}       extractedBody             Parsed body from the fetched document.
 * @param {string}       commentUrl                Request URL.
 * @param {string}       fallbackUrl               Fallback URL if mapping fails.
 * @param {Array|Object} formData                  Saved form fields.
 * @param {string}       formFocus                 Focused field name.
 * @param {string}       selectorCommentsContainer Live comments selector (may be #comments-{postId}).
 * @param {string}       selectorCommentForm       Live comment form selector.
 * @param {string}       selectorRespondContainer  Respond container selector.
 * @param {string}       beforeUpdateComments      Optional before-update callback source.
 * @param {string}       afterUpdateComments       Optional after-update callback source.
 * @return {boolean} True on success.
 */
WPAC._ReplaceMultipleComments = function(
	extractedBody,
	commentUrl,
	fallbackUrl,
	formData,
	formFocus,
	selectorCommentsContainer,
	selectorCommentForm,
	selectorRespondContainer,
	beforeUpdateComments,
	afterUpdateComments,
) {
	const liveRoot = jQuery( document );
	const scopedPostId = WPAC._GetScopedPostId( selectorCommentsContainer );
	const postIds = scopedPostId ? [ scopedPostId ] : WPAC._CollectPostIds( liveRoot );

	if ( ! postIds.length ) {
		WPAC._Debug(
			'error',
			'No comment_post_ID markers found for multiple comment containers',
		);
		WPAC._LoadFallbackUrl( fallbackUrl );
		return false;
	}

	if ( '' !== beforeUpdateComments ) {
		const beforeComments = new Function(
			'extractedBody',
			'commentUrl',
			beforeUpdateComments,
		);
		beforeComments( extractedBody, commentUrl );
	}

	const beforeCommentsEvent = new CustomEvent( 'wpacBeforeUpdateComments', {
		detail: { newDom: extractedBody, commentUrl },
	} );
	document.dispatchEvent( beforeCommentsEvent );

	const replacedPostIds = [];
	jQuery.each( postIds, function( i, postId ) {
		const $old = WPAC._FindCommentsContainerByPostId( liveRoot, postId );
		const $new = WPAC._FindCommentsContainerByPostId( extractedBody, postId );

		if ( ! $old.length || ! $new.length ) {
			WPAC._Debug(
				'error',
				'Unable to map comments container for post ID %s (live: %s, fetched: %s)',
				postId,
				$old.length,
				$new.length,
			);
			return;
		}

		$old.empty();
		$old.append( $new.children() );
		replacedPostIds.push( postId );
		WPAC._Debug( 'info', 'Replaced comments container for post ID %s', postId );
	} );

	if ( scopedPostId && replacedPostIds.length !== 1 ) {
		WPAC._LoadFallbackUrl( fallbackUrl );
		return false;
	}

	if ( ! scopedPostId && ! replacedPostIds.length ) {
		WPAC._LoadFallbackUrl( fallbackUrl );
		return false;
	}

	if ( WPAC._Options.commentsEnabled ) {
		let formReplaceFailed = false;

		jQuery.each( replacedPostIds, function( i, postId ) {
			const $oldContainer = WPAC._FindCommentsContainerByPostId( liveRoot, postId );
			const $oldForm = WPAC._FindCommentFormByPostId( liveRoot, postId );
			const formIsNested = $oldForm.length && $oldContainer.length && (
				jQuery.contains( $oldContainer[ 0 ], $oldForm[ 0 ] ) ||
				$oldContainer[ 0 ] === $oldForm[ 0 ]
			);

			if ( $oldForm.length ) {
				if ( ! formIsNested ) {
					WPAC._Debug( 'info', 'Replace comment form for post ID %s...', postId );
					const $newForm = WPAC._FindCommentFormByPostId( extractedBody, postId );
					if ( ! $newForm.length ) {
						WPAC._Debug(
							'error',
							'Comment form for post ID %s not found in fetched document',
							postId,
						);
						if ( scopedPostId ) {
							formReplaceFailed = true;
							return false;
						}
						return;
					}
					$oldForm.replaceWith( $newForm );
				}
			} else if ( scopedPostId ) {
				WPAC._Debug( 'info', 'Try to re-inject comment form...' );

				const wpTempFormDiv = jQuery( '#wp-temp-form-div' );
				if ( ! wpTempFormDiv.length ) {
					WPAC._Debug(
						'error',
						"WordPress' #wp-temp-form-div container not found",
						selectorRespondContainer,
					);
					formReplaceFailed = true;
					return false;
				}

				const $newForm = WPAC._FindCommentFormByPostId( extractedBody, postId );
				const $newRespond = $newForm.length
					? $newForm.closest( selectorRespondContainer )
					: extractedBody.find( selectorRespondContainer ).first();
				if ( ! $newRespond.length ) {
					WPAC._Debug(
						'error',
						"Respond container on requested page not found (selector: '%s')",
						selectorRespondContainer,
					);
					formReplaceFailed = true;
					return false;
				}
				wpTempFormDiv.replaceWith( $newRespond );
			}

			const $restoredForm = WPAC._FindCommentFormByPostId( liveRoot, postId );
			WPAC._RestoreFormData(
				$restoredForm,
				WPAC._GetSavedFormFields( formData, postId ),
			);
		} );

		if ( formReplaceFailed ) {
			WPAC._LoadFallbackUrl( fallbackUrl );
			return false;
		}

		if ( formFocus ) {
			const focusPostId = ( formData && formData.focusPostId ) ? formData.focusPostId : scopedPostId;
			const $focusForm = focusPostId
				? WPAC._FindCommentFormByPostId( liveRoot, focusPostId )
				: jQuery( selectorCommentForm );
			const $focusElement = $focusForm.find( "[name='" + formFocus + "']" );
			if ( $focusElement.length ) {
				$focusElement.focus();
			}
		}
	}

	if ( '' !== afterUpdateComments ) {
		const updateComments = new Function(
			'extractedBody',
			'commentUrl',
			afterUpdateComments,
		);
		updateComments( extractedBody, commentUrl );
	}

	const updateCommentsEvent = new CustomEvent( 'wpacAfterUpdateComments', {
		detail: { newDom: extractedBody, commentUrl },
	} );
	document.dispatchEvent( updateCommentsEvent );

	return true;
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
	}

	// Set up custom event.
	const beforeSelectEvent = new CustomEvent( 'wpacBeforeSelectElements', {
		detail: { extractedBody },
	} );
	document.dispatchEvent( beforeSelectEvent );

	if ( WPAC._Options.hasMultipleCommentContainers ) {
		return WPAC._ReplaceMultipleComments(
			extractedBody,
			commentUrl,
			fallbackUrl,
			formData,
			formFocus,
			selectorCommentsContainer,
			selectorCommentForm,
			selectorRespondContainer,
			beforeUpdateComments,
			afterUpdateComments,
		);
	}

	let oldCommentsContainer = jQuery( selectorCommentsContainer );
	if (
		WPAC._Options.lazyLoadIntoElement &&
		'comments' !== WPAC._Options.lazyLoadInlineDisplayLocation
	) {
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

	let newCommentsContainer = extractedBody.find( WPAC._Options.selectorCommentsContainer );
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
		const respondContainer = newCommentsContainer.find(
			selectorRespondContainer,
		);
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
	}

	// Set up native event handler.
	const beforeCommentsEvent = new CustomEvent( 'wpacBeforeUpdateComments', {
		detail: { newDom: extractedBody, commentUrl },
	} );
	document.dispatchEvent( beforeCommentsEvent );

	// Update title.
	const extractedTitle = WPAC._ExtractTitle( data );
	if ( extractedBody !== false ) {
		// Decode HTML entities (see http://stackoverflow.com/a/5796744).
		document.title = jQuery( '<textarea />' ).html( extractedTitle ).text();
	}

	// Empty old container, replace with innards of new container.
	oldCommentsContainer.empty();
	oldCommentsContainer.append( newCommentsContainer.children() );

	if ( WPAC._Options.commentsEnabled ) {
		const form = jQuery( selectorCommentForm );
		if ( form.length ) {
			// Replace comment form (for spam protection plugin compatibility) if comment form is not nested in comments container.
			// If comment form is nested in comments container comment form has already been replaced.
			if ( ! form.parents( selectorCommentsContainer ).length ) {
				WPAC._Debug( 'info', 'Replace comment form...' );
				const newCommentForm = extractedBody.find( selectorCommentForm );
				if ( newCommentForm.length === 0 ) {
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
			// if theme support threaded/nested comments and form tag is not nested in comments container.
			// -> Replace WordPress placeholder <div> (#wp-temp-form-div) with respond <div>.
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

		WPAC._RestoreFormData(
			jQuery( selectorCommentForm ),
			WPAC._GetSavedFormFields( formData ),
		);
		if ( formFocus ) {
			// Reset focus.
			const formElement = jQuery(
				"[name='" + formFocus + "']",
				selectorCommentForm,
			);
			if ( formElement.length ) {
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
	}
	// Set up native event handler.
	const updateCommentsEvent = new CustomEvent( 'wpacAfterUpdateComments', {
		detail: { newDom: extractedBody, commentUrl },
	} );
	document.dispatchEvent( updateCommentsEvent );

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

WPAC._ScopeSelector = function( containerSelector, selector ) {
	if ( typeof selector !== 'string' || ! selector ) {
		return '';
	}

	return selector
		.split( ',' )
		.map( function( selectorPart ) {
			return selectorPart.trim();
		} )
		.filter( function( selectorPart ) {
			return selectorPart;
		} )
		.map( function( selectorPart ) {
			return containerSelector + ' ' + selectorPart;
		} )
		.join( ',' );
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
	}

	// Set up native event handler.
	const beforeSelectEvent = new CustomEvent( 'wpacBeforeSelectElements', {
		detail: { dom: jQuery( document ) },
	} );
	document.dispatchEvent( beforeSelectEvent );

	// Get addHandler method
	if ( jQuery( document ).on ) {
		// jQuery 1.7+
		var addHandler = function( event, selector, handler ) {
			if ( typeof selector !== 'string' || ! selector ) {
				return;
			}
			jQuery( document ).on( event, selector, handler );
		};
	} else if ( jQuery( document ).delegate ) {
		// jQuery 1.4.3+
		var addHandler = function( event, selector, handler ) {
			if ( typeof selector !== 'string' || ! selector ) {
				return;
			}
			jQuery( document ).delegate( selector, event, handler );
		};
	} else {
		// jQuery 1.3+
		var addHandler = function( event, selector, handler ) {
			if ( typeof selector !== 'string' || ! selector ) {
				return;
			}
			jQuery( selector ).live( event, handler );
		};
	}

	// Handle paging link clicks
	const pagingClickHandler = function( event ) {
		let href = jQuery( this ).attr( 'href' );
		if ( ! href ) {
			href = event.target.href;
		}
		if ( href ) {
			event.preventDefault();
			let pageId = 0;
			let paginationTargetSelector = null;
			const paginationTarget = event.target;
			const paginationTargetContainer = paginationTarget.closest( options.selectorCommentsContainer );
			if ( paginationTargetContainer ) {
				paginationTargetSelector = paginationTargetContainer.querySelector( 'input[name="comment_post_ID"]' );
				if ( paginationTargetSelector ) {
					pageId = paginationTargetSelector.value;
					paginationTargetSelector = '#comments-' + pageId;
				}
			}
			if ( ! WPAC._Options.hasMultipleCommentContainers ) {
				WPAC.LoadComments( href, {
					selectorCommentForm: options.selectorCommentForm,
					selectorCommentsContainer: options.selectorCommentsContainer,
					selectorRespondContainer: options.selectorRespondContainer,
					beforeSelectElements: options.beforeSelectElements,
					beforeUpdateComments: options.beforeUpdateComments,
					afterUpdateComments: options.afterUpdateComments,
				} );
			} else if ( WPAC._Options.hasMultipleCommentContainers && paginationTargetSelector && pageId ) {
				WPAC.LoadComments( href, {
					selectorCommentForm: options.selectorCommentForm,
					selectorCommentsContainer: paginationTargetSelector,
					selectorRespondContainer: options.selectorRespondContainer,
					beforeSelectElements: options.beforeSelectElements,
					beforeUpdateComments: options.beforeUpdateComments,
					afterUpdateComments: options.afterUpdateComments,
				} );
			}
		}
	};
	const maybeSelectorCommentPagingEl = jQuery(
		options.selectorCommentPagingLinks,
	);
	if ( maybeSelectorCommentPagingEl.length > 0 ) {
		addHandler( 'click', options.selectorCommentPagingLinks, pagingClickHandler );
	} else {
		// Let's try the nav selector.
		const navSelector = '#comments nav a';
		const navEl = jQuery( navSelector );
		if ( navEl.length > 0 ) {
			addHandler( 'click', navSelector, pagingClickHandler );
		} else if ( WPAC._Options.debug ) {
			WPAC._Debug(
				'error',
				'Selector for paging links not found: %s',
				options.selectorCommentPagingLinks,
			);
		}
	}

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
		}

		// Set up native event handler.
		const beforeSubmitEvent = new CustomEvent( 'wpacBeforeSubmitComment', {
			detail: { dom: jQuery( document ) },
		} );
		document.dispatchEvent( beforeSubmitEvent );

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
		WPAC._ShowMessage( WPAC._Options.textPostComment, 'loading', true );

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
					WPAC._ShowMessage( errorMessage, 'error', true );
					return;
				}
			}

			WPAC._Debug(
				'error',
				"Error message could not be extracted, use error message '%s'.",
				WPAC._Options.textUnknownError,
			);
			WPAC._ShowMessage( WPAC._Options.textUnknownError, 'error', true );
		};

		const request = jQuery.ajax( {
			url: submitUrl,
			type: 'POST',
			data: new FormData( this ),
			processData: false,
			contentType: false,
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
				const commentUrl = request.getResponseHeader( 'X-WPAC-URL' );
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
						options.afterPostComment,
					);
					afterComment( commentUrl, unapproved == '1' );
				}

				// Set up native event handler.
				const afterCommentEvent = new CustomEvent( 'wpacAfterPostComment', {
					detail: { commentUrl, unapproved: unapproved == '1' },
				} );
				document.dispatchEvent( afterCommentEvent );

				// Show success message
				WPAC._ShowMessage(
					unapproved == '1'
						? WPAC._Options.textPostedUnapproved
						: WPAC._Options.textPosted,
					'success',
					true,
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
					if ( options.updateUrl && ! WPAC._Options.hasMultipleCommentContainers ) {
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

	WPAC._Options.hasMultipleCommentContainers = jQuery( WPAC._Options.selectorCommentsContainer ).length > 1;
	if ( WPAC._Options.selectorPostContainer && WPAC._Options.hasMultipleCommentContainers ) {
		WPAC._Debug(
			'info',
			"Multiple comment form support enabled (selector: '%s')",
			WPAC._Options.selectorPostContainer,
		);
		jQuery( WPAC._Options.selectorPostContainer ).each( function( i, e ) {
			const maybePageId = jQuery( e ).find( 'input[name="comment_post_ID"]' ).val();
			const pageSelector = maybePageId ? `comments-${ parseInt( maybePageId ) }` : null;
			if ( pageSelector ) {
				jQuery( e ).attr( 'id', pageSelector );
			}

			const id = pageSelector || jQuery( e ).attr( 'id' );
			if ( ! id ) {
				WPAC._Debug(
					'info',
					'Skip post container element %o (ID not defined)',
					e,
				);
				return;
			}
			const containerSelector = `#${ id }`;
			WPAC.AttachForm( {
				selectorCommentForm: WPAC._ScopeSelector(
					containerSelector,
					WPAC._Options.selectorCommentForm,
				),
				selectorCommentPagingLinks: WPAC._ScopeSelector(
					containerSelector,
					WPAC._Options.selectorCommentPagingLinks,
				),
				selectorCommentsContainer: containerSelector,
				selectorRespondContainer: WPAC._ScopeSelector(
					containerSelector,
					WPAC._Options.selectorRespondContainer,
				),
				selectorCommentLinks: WPAC._ScopeSelector(
					containerSelector,
					WPAC._Options.selectorCommentLinks,
				),
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
			WPAC._ShowMessage(
				'This is the loading preview...',
				'loadingPreview',
				true,
			);
		},
	);

	// Set up success preview handlers.
	jQuery( '#wp-admin-bar-wpac-menu-helper-preview-overlay-success a' ).on(
		'click',
		function( e ) {
			e.preventDefault();
			WPAC._ShowMessage( 'This is a success message', 'success', true );
		},
	);

	// Set up error preview handlers.
	jQuery( '#wp-admin-bar-wpac-menu-helper-preview-overlay-error a' ).on(
		'click',
		function( e ) {
			e.preventDefault();
			WPAC._ShowMessage( 'This is an error message', 'error', true );
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
	if ( WPAC._TestFallbackUrl( location.href ) ) {
		WPAC._Debug(
			'error',
			"Fallback URL was detected (url: '%s'), cancel AJAX request",
			location.href,
		);
		return false;
	}

	// Users can pass options as first parameter to override selectors.
	return WPAC.LoadComments( location.href, options );
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
			success() {},
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

	// Save form data and focus.
	let formData;
	let formFocus = '';
	if ( WPAC._Options.hasMultipleCommentContainers ) {
		formData = { byPostId: {}, focusPostId: 0 };
		const liveRoot = jQuery( document );
		const scopedPostId = WPAC._GetScopedPostId( options.selectorCommentsContainer );
		const postIds = scopedPostId ? [ scopedPostId ] : WPAC._CollectPostIds( liveRoot );

		jQuery.each( postIds, function( i, postId ) {
			const $form = WPAC._FindCommentFormByPostId( liveRoot, postId );
			if ( $form.length ) {
				formData.byPostId[ postId ] = $form.serializeArray();
			}
		} );

		if ( document.activeElement && document.activeElement.name ) {
			const $activeForm = jQuery( document.activeElement ).closest( 'form' );
			const focusPostId = parseInt( $activeForm.find( 'input[name="comment_post_ID"]' ).val(), 10 );
			if ( focusPostId ) {
				formData.focusPostId = focusPostId;
				formFocus = document.activeElement.name;
			}
		}
	} else {
		formData = jQuery( options.selectorCommentForm ).serializeArray();
		formFocus = document.activeElement
			? jQuery(
				"[name='" + document.activeElement.name + "']",
				options.selectorCommentForm,
			).attr( 'name' )
			: '';
	}

	// Get query strings form URL (ajaxifyLazyLoadEnable, nonce, post_id).
	const urlObject = new URL( url );
	const queryParams = urlObject.searchParams;
	if ( queryParams.has( 'ajaxifyLazyLoadEnable' ) ) {
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
	}

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

				if ( options.updateUrl && ! WPAC._Options.hasMultipleCommentContainers ) {
					WPAC._UpdateUrl( url );
				}

				// Scroll to anchor
				var waitForScrollToAnchor = false;
				if ( options.scrollToAnchor ) {
					let anchor =
						url.indexOf( '#' ) >= 0 ? url.substr( url.indexOf( '#' ) ) : null;
					if ( WPAC._Options.hasMultipleCommentContainers ) {
						anchor = options.selectorCommentsContainer;
					}
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
		const lazyloadInlineDisplayLocation =
			WPAC._Options
				.lazyLoadInlineDisplayLocation; /* can be comments, element */

		// If inline, let's move the loader.
		if ( isLazyLoadInline && WPAC._Options.lazyLoadIntoElement ) {
			let lazyloadInlineDisplayElement =
				WPAC._Options.lazyLoadInlineDisplayElement;
			if ( 'comments' === lazyloadInlineDisplayLocation ) {
				lazyloadInlineDisplayElement = WPAC._Options.selectorCommentsContainer;
			}

			const lazyLoadContent = document.querySelector( '#wpac-lazy-load-content' ); // hardcoded selector.
			if ( null !== lazyLoadContent ) {
				// Clone it without ref.
				const lazyLoadContentClone = jQuery.clone( lazyLoadContent );
				lazyLoadContentClone.id = 'wpac-lazy-load-content-clone';

				// Determine trigger if button.
				if ( 'button' === lazyLoadInlineType ) {
					// This will make it so that a button must be clicked to load comments.
					lazyLoadTrigger = 'external';
				}

				if ( 'skeleton' === lazyLoadInlineType ) {
					// Show the loading skeleton to the user.
				}

				// Display the loader.
				if ( 'comments' === lazyloadInlineDisplayLocation ) {
					const commentsContainer = jQuery( lazyloadInlineDisplayElement );
					if ( commentsContainer ) {
						// Test for block theme comment container title.
						const maybeBlockCommentstitle = commentsContainer.find(
							'.wp-block-comments-title, .comments-title',
						);
						if ( maybeBlockCommentstitle.length > 0 ) {
							// Insert after title.
							jQuery( maybeBlockCommentstitle ).after( lazyLoadContentClone );
						} else {
							commentsContainer.prepend( lazyLoadContentClone );
						}
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
				const lazyLoadButton = document.querySelector(
					'.ajaxify-comments-loading-button-wrapper button',
				);
				if ( null !== lazyLoadButton ) {
					lazyLoadButton.addEventListener( 'click', function( e ) {
						e.preventDefault();
						lazyLoadButton.innerHTML =
							WPAC._Options.lazyLoadInlineButtonLabelLoading;
						WPAC.RefreshComments();
					} );
				}
			}
		}

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
							if ( 'button' !== lazyLoadInlineType && isLazyLoadInline ) {
								WPAC._ShowMessage( WPAC._Options.textRefreshComments, 'loading' );
								WPAC.RefreshComments();
							}
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
				// Only refresh comments if not inline button.
				if (
					( 'button' !== lazyLoadInlineType && isLazyLoadInline ) ||
					! isLazyLoadInline
				) {
					WPAC._Debug(
						'info',
						'Lazy loading: Waiting on Dom to be ready for lazy loading.',
						window.location.hash,
					);
					WPAC._ShowMessage( WPAC._Options.textRefreshComments, 'loading' );
					WPAC.RefreshComments( { scrollToAnchor: true } ); // force scroll to anchor.
				}
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
						if (
							'button' !== lazyLoadInlineType &&
							'inline' === lazyLoadInlineType
						) {
							WPAC._ShowMessage( WPAC._Options.textRefreshComments, 'loading' );
							WPAC.RefreshComments();
						}
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
