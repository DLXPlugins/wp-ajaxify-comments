/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!************************************************!*\
  !*** ./src/js/frontend/wp-ajaxify-comments.js ***!
  \************************************************/
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
WPAC._Options = WPAC._Options || {};
WPAC._BodyRegex = new RegExp('<body[^>]*>((.|\n|\r)*)</body>', 'i');
WPAC._ExtractBody = function (html) {
  try {
    return jQuery('<div>' + WPAC._BodyRegex.exec(html)[1] + '</div>');
  } catch (e) {
    return false;
  }
};
WPAC._TitleRegex = new RegExp('<title[^>]*>(.*?)<\\/title>', 'im');
WPAC._ExtractTitle = function (html) {
  try {
    return WPAC._TitleRegex.exec(html)[1];
  } catch (e) {
    return false;
  }
};
WPAC._ShowMessage = function (message, type) {
  var force = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  // Determine how to display the loading message.
  var lazyLoadDisplay = WPAC._Options.lazyLoadDisplay;
  var lazyLoadEnabled = WPAC._Options.lazyLoadEnabled;

  // Check if lazy load enabled or not.
  if (lazyLoadEnabled && 'overlay' !== lazyLoadDisplay && !force) {
    return;
  }
  var top = WPAC._Options.popupMarginTop + (jQuery('#wpadminbar').outerHeight() || 0);
  var backgroundColor = WPAC._Options.popupBackgroundColorLoading;
  var textColor = WPAC._Options.popupTextColorLoading;
  if (type == 'error') {
    backgroundColor = WPAC._Options.popupBackgroundColorError;
    textColor = WPAC._Options.popupTextColorError;
  } else if (type == 'success') {
    backgroundColor = WPAC._Options.popupBackgroundColorSuccess;
    textColor = WPAC._Options.popupTextColorSuccess;
  }
  var topOffset = WPAC._Options.popupVerticalAlign === 'verticalStart' ? top + 'px' : 'unset';
  if (WPAC._Options.popupVerticalAlign === 'verticalCenter') {
    topOffset = '45%';
  }
  jQuery.blockUI({
    blockMsgClass: "wpac-overlay",
    message: message,
    fadeIn: WPAC._Options.popupFadeIn,
    fadeOut: WPAC._Options.popupFadeOut,
    timeout: type == "loading" ? 0 : WPAC._Options.popupTimeout,
    centerY: false,
    centerX: true,
    showOverlay: true,
    css: {
      width: 'var(--wpac-popup-width)',
      left: 'calc(50% - var(--wpac-popup-width) / 2)',
      top: topOffset,
      bottom: WPAC._Options.popupVerticalAlign === 'verticalEnd' ? top + 'px' : 'unset',
      border: 'none',
      padding: WPAC._Options.popupPadding + 'px',
      backgroundColor: backgroundColor,
      '-webkit-border-radius': WPAC._Options.popupCornerRadius + 'px',
      '-moz-border-radius': WPAC._Options.popupCornerRadius + 'px',
      'border-radius': WPAC._Options.popupCornerRadius + 'px',
      opacity: WPAC._Options.popupOpacity / 100,
      color: textColor,
      textAlign: WPAC._Options.popupTextAlign,
      cursor: type == 'loading' || type == 'loadingPreview' ? 'wait' : 'default',
      'font-size': WPAC._Options.popupTextFontSize
    },
    overlayCSS: {
      backgroundColor: WPAC._Options.popupOverlayBackgroundColor,
      opacity: WPAC._Options.popupOverlayBackgroundColorOpacity
    },
    baseZ: WPAC._Options.popupZindex
  });
};
WPAC._DebugErrorShown = false;
WPAC._Debug = function (level, message) {
  if (!WPAC._Options.debug) {
    return;
  }

  // Fix console.log.apply for IE9
  // see http://stackoverflow.com/a/5539378/516472
  if (Function.prototype.call && Function.prototype.call.bind && typeof window.console !== 'undefined' && console && _typeof(console.log) === 'object' && typeof window.console[level].apply === 'undefined') {
    console[level] = Function.prototype.call.bind(console[level], console);
  }
  if (typeof window.console === 'undefined' || typeof window.console[level] === 'undefined' || typeof window.console[level].apply === 'undefined') {
    if (!WPAC._DebugErrorShown) {
      alert('Unfortunately the console object is undefined or is not supported in your browser, debugging WP Ajaxify Comments is disabled! Please use Firebug, Google Chrome or Internet Explorer 9 or above with enabled Developer Tools (F12) for debugging WP Ajaxify Comments.');
    }
    WPAC._DebugErrorShown = true;
    return;
  }
  var args = jQuery.merge(['[WP Ajaxify Comments] ' + message], jQuery.makeArray(arguments).slice(2));
  console[level].apply(console, args);
};
WPAC._DebugSelector = function (elementType, selector, optional) {
  if (!WPAC._Options.debug) {
    return;
  }
  var element = jQuery(selector);
  if (!element.length) {
    WPAC._Debug(optional ? 'info' : 'error', "Search %s (selector: '%s')... Not found", elementType, selector);
  } else {
    WPAC._Debug('info', "Search %s (selector: '%s')... Found: %o", elementType, selector, element);
  }
};
WPAC._AddQueryParamStringToUrl = function (url, param, value) {
  // Get URL object.
  var urlObject = new URL(url);

  // Get query params.
  var queryParams = urlObject.searchParams;

  // Set query param.
  queryParams.set(param, value);

  // Set query params.
  urlObject.search = queryParams.toString();

  // Return URL.
  return urlObject.toString();
};
WPAC._LoadFallbackUrl = function (fallbackUrl) {
  WPAC._ShowMessage(WPAC._Options.textReloadPage, 'loading');
  var url = WPAC._AddQueryParamStringToUrl(fallbackUrl, 'WPACRandom', new Date().getTime());
  WPAC._Debug('info', "Something went wrong. Reloading page (URL: '%s')...", url);
  var reload = function reload() {
    location.href = url;
  };
  if (!WPAC._Options.debug) {
    reload();
  } else {
    WPAC._Debug('info', 'Sleep for 5s to enable analyzing debug messages...');
    window.setTimeout(reload, 5000);
  }
};
WPAC._ScrollToAnchor = function (anchor, updateHash, scrollComplete) {
  scrollComplete = scrollComplete || function () {};
  var anchorElement = jQuery(anchor);
  if (anchorElement.length) {
    WPAC._Debug('info', 'Scroll to anchor element %o (scroll speed: %s ms)...', anchorElement, WPAC._Options.scrollSpeed);
    var animateComplete = function animateComplete() {
      if (updateHash) {
        window.location.hash = anchor;
      }
      scrollComplete();
    };
    var scrollTargetTopOffset = anchorElement.offset().top;
    if (jQuery(window).scrollTop() == scrollTargetTopOffset) {
      animateComplete();
    } else {
      jQuery('html,body').animate({
        scrollTop: scrollTargetTopOffset
      }, {
        duration: WPAC._Options.scrollSpeed,
        complete: animateComplete
      });
    }
    return true;
  }
  WPAC._Debug('error', "Anchor element not found (selector: '%s')", anchor);
  return false;
};
WPAC._UpdateUrl = function (url) {
  if (url.split('#')[0] == window.location.href.split('#')[0]) {
    return;
  }
  if (window.history.replaceState) {
    window.history.replaceState({}, window.document.title, url);
  } else {
    WPAC._Debug('info', 'Browser does not support window.history.replaceState() to update the URL without reloading the page', anchor);
  }
};
WPAC._ReplaceComments = function (data, commentUrl, useFallbackUrl, formData, formFocus, selectorCommentsContainer, selectorCommentForm, selectorRespondContainer, beforeSelectElements, beforeUpdateComments, afterUpdateComments) {
  // Remove any lazy loading messages.
  jQuery('#wpac-lazy-load-content-clone').remove();
  var fallbackUrl = useFallbackUrl ? WPAC._AddQueryParamStringToUrl(commentUrl, 'WPACFallback', '1') : commentUrl;
  var oldCommentsContainer = jQuery(selectorCommentsContainer);
  if (WPAC._Options.lazyLoadIntoElement && 'comments' !== WPAC._Options.lazyLoadInlineDisplayLocation) {
    oldCommentsContainer = jQuery(WPAC._Options.lazyLoadInlineDisplayElement);
  }
  if (!oldCommentsContainer.length) {
    WPAC._Debug('error', "Comment container on current page not found (selector: '%s')", selectorCommentsContainer);
    WPAC._LoadFallbackUrl(fallbackUrl);
    return false;
  }
  // If length is greater than one, there may be greedy selectors.
  if (oldCommentsContainer.length > 1) {
    WPAC._Debug('error', "Comment form on requested page found multiple times (selector: '%s')", oldCommentsContainer);
    oldCommentsContainer = oldCommentsContainer.filter(function () {
      return jQuery(this).children().length > 0 && !jQuery(this).is(':header');
    });
  }
  var extractedBody = WPAC._ExtractBody(data);
  if (extractedBody === false) {
    WPAC._Debug('error', "Unsupported server response, unable to extract body (data: '%s')", data);
    WPAC._LoadFallbackUrl(fallbackUrl);
    return false;
  }

  // Call before select elements.
  if (beforeSelectElements !== '') {
    var beforeSelect = new Function('extractedBody', beforeSelectElements);
    beforeSelect(extractedBody);
  }

  // Set up custom event.
  var beforeSelectEvent = new CustomEvent('wpacBeforeSelectElements', {
    detail: {
      extractedBody: extractedBody
    }
  });
  document.dispatchEvent(beforeSelectEvent);
  var newCommentsContainer = extractedBody.find(selectorCommentsContainer);
  if (!newCommentsContainer.length) {
    WPAC._Debug('error', "Comment container on requested page not found (selector: '%s')", selectorCommentsContainer);
    WPAC._LoadFallbackUrl(fallbackUrl);
    return false;
  }
  if (newCommentsContainer.length > 1) {
    WPAC._Debug('error', "Comment form on requested page found multiple times (selector: '%s')", newCommentsContainer);

    // Find the first comment container that has children and is not a heading.
    newCommentsContainer = newCommentsContainer.filter(function () {
      return jQuery(this).children().length > 0 && !jQuery(this).is(':header');
    });

    // Find respond selector and remove.
    var respondContainer = newCommentsContainer.find(selectorRespondContainer);
    if (respondContainer.length) {
      respondContainer.remove();
    }
  }

  // Call before update comments.
  if ('' !== beforeUpdateComments) {
    var beforeComments = new Function('extractedBody', 'commentUrl', beforeUpdateComments);
    beforeComments(extractedBody, commentUrl);
  }

  // Set up native event handler.
  var beforeCommentsEvent = new CustomEvent('wpacBeforeUpdateComments', {
    detail: {
      newDom: extractedBody,
      commentUrl: commentUrl
    }
  });
  document.dispatchEvent(beforeCommentsEvent);

  // Update title
  var extractedTitle = WPAC._ExtractTitle(data);
  if (extractedBody !== false) {
    // Decode HTML entities (see http://stackoverflow.com/a/5796744)
    document.title = jQuery('<textarea />').html(extractedTitle).text();
  }

  // Empty old container, replace with innards of new container.
  oldCommentsContainer.empty();
  oldCommentsContainer.append(newCommentsContainer.children());
  if (WPAC._Options.commentsEnabled) {
    var form = jQuery(selectorCommentForm);
    if (form.length) {
      // Replace comment form (for spam protection plugin compatibility) if comment form is not nested in comments container
      // If comment form is nested in comments container comment form has already been replaced
      if (!form.parents(selectorCommentsContainer).length) {
        WPAC._Debug('info', 'Replace comment form...');
        var newCommentForm = extractedBody.find(selectorCommentForm);
        if (newCommentForm.length == 0) {
          WPAC._Debug('error', "Comment form on requested page not found (selector: '%s')", selectorCommentForm);
          WPAC._LoadFallbackUrl(fallbackUrl);
          return false;
        }
        form.replaceWith(newCommentForm);
      }
    } else {
      WPAC._Debug('info', 'Try to re-inject comment form...');

      // "Re-inject" comment form, if comment form was removed by updating the comments container; could happen
      // if theme support threaded/nested comments and form tag is not nested in comments container
      // -> Replace WordPress placeholder <div> (#wp-temp-form-div) with respond <div>
      var wpTempFormDiv = jQuery('#wp-temp-form-div');
      if (!wpTempFormDiv.length) {
        WPAC._Debug('error', "WordPress' #wp-temp-form-div container not found", selectorRespondContainer);
        WPAC._LoadFallbackUrl(fallbackUrl);
        return false;
      }
      var newRespondContainer = extractedBody.find(selectorRespondContainer);
      if (!newRespondContainer.length) {
        WPAC._Debug('error', "Respond container on requested page not found (selector: '%s')", selectorRespondContainer);
        WPAC._LoadFallbackUrl(fallbackUrl);
        return false;
      }
      wpTempFormDiv.replaceWith(newRespondContainer);
    }
    if (formData) {
      // Re-inject saved form data
      jQuery.each(formData, function (key, value) {
        var formElement = jQuery("[name='" + value.name + "']", selectorCommentForm);
        if (formElement.length != 1 || formElement.val()) {
          return;
        }
        formElement.val(value.value);
      });
    }
    if (formFocus) {
      // Reset focus
      var formElement = jQuery("[name='" + formFocus + "']", selectorCommentForm);
      if (formElement) {
        formElement.focus();
      }
    }
  }
  // Call after update comments.
  if ('' !== afterUpdateComments) {
    var updateComments = new Function('extractedBody', 'commentUrl', afterUpdateComments);
    updateComments(extractedBody, commentUrl);
  }
  // Set up native event handler.
  var updateCommentsEvent = new CustomEvent('wpacAfterUpdateComments', {
    detail: {
      newDom: extractedBody,
      commentUrl: commentUrl
    }
  });
  document.dispatchEvent(updateCommentsEvent);
  return true;
};
WPAC._TestCrossDomainScripting = function (url) {
  if (url.indexOf('http') != 0) {
    return false;
  }
  var domain = window.location.protocol + '//' + window.location.host;
  return url.indexOf(domain) != 0;
};
WPAC._TestFallbackUrl = function (url) {
  // Get URL object.
  var urlObject = new URL(url);

  // Get query params.
  var queryParams = urlObject.searchParams;
  var fallbackParam = queryParams.get('WPACFallback');
  var randomParam = queryParams.get('WPACRandom');
  return fallbackParam && randomParam;
};
WPAC.AttachForm = function (options) {
  // Set default options
  options = jQuery.extend({
    selectorCommentForm: WPAC._Options.selectorCommentForm,
    selectorCommentPagingLinks: WPAC._Options.selectorCommentPagingLinks,
    beforeSelectElements: WPACCallbacks.beforeSelectElements,
    beforeSubmitComment: WPACCallbacks.beforeSubmitComment,
    afterPostComment: WPACCallbacks.afterPostComment,
    selectorCommentsContainer: WPAC._Options.selectorCommentsContainer,
    selectorRespondContainer: WPAC._Options.selectorRespondContainer,
    beforeUpdateComments: WPACCallbacks.beforeUpdateComments,
    afterUpdateComments: WPACCallbacks.afterUpdateComments,
    scrollToAnchor: !WPAC._Options.disableScrollToAnchor,
    updateUrl: !WPAC._Options.disableUrlUpdate,
    selectorCommentLinks: WPAC._Options.selectorCommentLinks
  }, options || {});
  if (WPAC._Options.debug && WPAC._Options.commentsEnabled) {
    WPAC._Debug('info', 'Attach form...');
    WPAC._DebugSelector('comment form', options.selectorCommentForm);
    WPAC._DebugSelector('comments container', options.selectorCommentsContainer);
    WPAC._DebugSelector('respond container', options.selectorRespondContainer);
    WPAC._DebugSelector('comment paging links', options.selectorCommentPagingLinks, true);
    WPAC._DebugSelector('comment links', options.selectorCommentLinks, true);
  }

  // Try before submit comment. Using new function is not ideal here, but safer than exec.
  if ('' !== WPACCallbacks.beforeSelectElements) {
    var beforeSelect = new Function('dom', WPACCallbacks.beforeSelectElements);
    beforeSelect(jQuery(document));

    // Set up native event handler.
    var beforeSelectEvent = new CustomEvent('wpacBeforeSelectElements', {
      detail: {
        dom: jQuery(document)
      }
    });
    document.dispatchEvent(beforeSelectEvent);
  }

  // Get addHandler method
  if (jQuery(document).on) {
    // jQuery 1.7+
    var addHandler = function addHandler(event, selector, handler) {
      jQuery(document).on(event, selector, handler);
    };
  } else if (jQuery(document).delegate) {
    // jQuery 1.4.3+
    var addHandler = function addHandler(event, selector, handler) {
      jQuery(document).delegate(selector, event, handler);
    };
  } else {
    // jQuery 1.3+
    var addHandler = function addHandler(event, selector, handler) {
      jQuery(selector).live(event, handler);
    };
  }

  // Handle paging link clicks
  var pagingClickHandler = function pagingClickHandler(event) {
    var href = jQuery(this).attr('href');
    if (href) {
      event.preventDefault();
      WPAC.LoadComments(href, {
        selectorCommentForm: options.selectorCommentForm,
        selectorCommentsContainer: options.selectorCommentsContainer,
        selectorRespondContainer: options.selectorRespondContainer,
        beforeSelectElements: options.beforeSelectElements,
        beforeUpdateComments: options.beforeUpdateComments,
        afterUpdateComments: options.afterUpdateComments
      });
    }
  };
  addHandler('click', options.selectorCommentPagingLinks, pagingClickHandler);

  // Handle comment link clicks
  var linkClickHandler = function linkClickHandler(event) {
    var element = jQuery(this);
    if (element.is(options.selectorCommentPagingLinks)) {
      return;
    } // skip if paging link was clicked
    var href = element.attr('href');
    // To use new URL.
    var anchor = new URL(href).hash;
    if (jQuery(anchor).length > 0) {
      if (options.updateUrl) {
        WPAC._UpdateUrl(href);
      }
      WPAC._ScrollToAnchor(anchor, options.updateUrl);
      event.preventDefault();
    }
  };
  addHandler('click', options.selectorCommentLinks, linkClickHandler);
  if (!WPAC._Options.commentsEnabled) {
    return;
  }

  // Handle form submit
  var formSubmitHandler = function formSubmitHandler(event) {
    var form = jQuery(this);

    // Try before submit comment. Using new function is not ideal here, but safer than exec.
    if (WPACCallbacks.beforeSubmitComment !== '') {
      var beforeSubmit = new Function('dom', WPACCallbacks.beforeSubmitComment);
      beforeSubmit(jQuery(document));

      // Set up native event handler.
      var beforeSubmitEvent = new CustomEvent('wpacBeforeSubmitComment', {
        detail: {
          dom: jQuery(document)
        }
      });
      document.dispatchEvent(beforeSubmitEvent);
    }
    var submitUrl = form.attr('action');

    // Cancel AJAX request if cross-domain scripting is detected
    if (WPAC._TestCrossDomainScripting(submitUrl)) {
      if (WPAC._Options.debug && !form.data('submitCrossDomain')) {
        WPAC._Debug('error', "Cross-domain scripting detected (submit url: '%s'), cancel AJAX request", submitUrl);
        WPAC._Debug('info', 'Sleep for 5s to enable analyzing debug messages...');
        event.preventDefault();
        form.data('submitCrossDomain', true);
        window.setTimeout(function () {
          jQuery('#submit', form).remove();
          form.submit();
        }, 5000);
      }
      return;
    }

    // Stop default event handling
    event.preventDefault();

    // Test if form is already submitting
    if (form.data('WPAC_SUBMITTING')) {
      WPAC._Debug('info', 'Cancel submit, form is already submitting (Form: %o)', form);
      return;
    }
    form.data('WPAC_SUBMITTING', true);

    // Show loading info
    WPAC._ShowMessage(WPAC._Options.textPostComment, 'loading', true);
    var handleErrorResponse = function handleErrorResponse(data) {
      WPAC._Debug('info', 'Comment has not been posted');
      WPAC._Debug('info', "Try to extract error message (selector: '%s')...", WPAC._Options.selectorErrorContainer);

      // Extract error message
      var extractedBody = WPAC._ExtractBody(data);
      if (extractedBody !== false) {
        var errorMessage = extractedBody.find(WPAC._Options.selectorErrorContainer);
        if (errorMessage.length) {
          errorMessage = errorMessage.html();
          WPAC._Debug('info', "Error message '%s' successfully extracted", errorMessage);
          WPAC._ShowMessage(errorMessage, 'error', true);
          return;
        }
      }
      WPAC._Debug('error', "Error message could not be extracted, use error message '%s'.", WPAC._Options.textUnknownError);
      WPAC._ShowMessage(WPAC._Options.textUnknownError, 'error', true);
    };
    var request = jQuery.ajax({
      url: submitUrl,
      type: 'POST',
      data: new FormData(this),
      processData: false,
      contentType: false,
      beforeSend: function beforeSend(xhr) {
        xhr.setRequestHeader('X-WPAC-REQUEST', '1');
      },
      complete: function complete(xhr, textStatus) {
        form.removeData('WPAC_SUBMITTING', true);
      },
      success: function success(data) {
        // Test error state (WordPress >=4.1 does not return 500 status code if posting comment failed)
        if (request.getResponseHeader('X-WPAC-ERROR')) {
          WPAC._Debug('info', 'Found error state X-WPAC-ERROR header.', commentUrl);
          handleErrorResponse(data);
          return;
        }
        WPAC._Debug('info', 'Comment has been posted');

        // Get info from response header
        var commentUrl = request.getResponseHeader('X-WPAC-URL');
        WPAC._Debug('info', "Found comment URL '%s' in X-WPAC-URL header.", commentUrl);
        var unapproved = request.getResponseHeader('X-WPAC-UNAPPROVED');
        WPAC._Debug('info', "Found unapproved state '%s' in X-WPAC-UNAPPROVED", unapproved);

        // Try afterPostComment submit comment. Using new function is not ideal here, but safer than exec.
        if (WPACCallbacks.afterPostComment !== '') {
          var afterComment = new Function('commentUrl', 'unapproved', options.afterPostComment);
          afterComment(commentUrl, unapproved == '1');

          // Set up native event handler.
          var afterCommentEvent = new CustomEvent('wpacAfterPostComment', {
            detail: {
              commentUrl: commentUrl,
              unapproved: unapproved == '1'
            }
          });
          document.dispatchEvent(afterCommentEvent);
        }

        // Show success message
        WPAC._ShowMessage(unapproved == '1' ? WPAC._Options.textPostedUnapproved : WPAC._Options.textPosted, 'success', true);

        /**
         * Sunshine Confetti Plugin integration.
         *
         * @since 3.0.0
         *
         * @see https://wordpress.org/plugins/confetti/
         */
        if (typeof window.wps_launch_confetti_cannon !== 'undefined') {
          window.wps_launch_confetti_cannon();
        }

        // Replace comments (and return if replacing failed)
        if (!WPAC._ReplaceComments(data, commentUrl, false, {}, '', options.selectorCommentsContainer, options.selectorCommentForm, options.selectorRespondContainer, options.beforeSelectElements, options.beforeUpdateComments, options.afterUpdateComments)) {
          return;
        }

        // Smooth scroll to comment url and update browser url
        if (commentUrl) {
          if (options.updateUrl) {
            WPAC._UpdateUrl(commentUrl);
          }
          if (options.scrollToAnchor) {
            var _anchor = commentUrl.indexOf('#') >= 0 ? commentUrl.substr(commentUrl.indexOf('#')) : null;
            if (_anchor) {
              WPAC._Debug('info', "Anchor '%s' extracted from comment URL '%s'", _anchor, commentUrl);
              WPAC._ScrollToAnchor(_anchor, options.updateUrl);
            }
          }
        }
      },
      error: function error(jqXhr, textStatus, errorThrown) {
        // Test if loading comment url failed (due to cross site scripting error)
        if (jqXhr.status === 0 && jqXhr.responseText === '') {
          WPAC._Debug('error', 'Comment seems to be posted, but loading comment update failed.');
          WPAC._LoadFallbackUrl(WPAC._AddQueryParamStringToUrl(window.location.href, 'WPACFallback', '1'));
          return;
        }
        handleErrorResponse(jqXhr.responseText);
      }
    });
  };
  addHandler('submit', options.selectorCommentForm, formSubmitHandler);
};
WPAC._Initialized = false;
WPAC.Init = function () {
  // Test if plugin already has been initialized
  if (WPAC._Initialized) {
    WPAC._Debug('info', 'Abort initialization (plugin already initialized)');
    return false;
  }
  WPAC._Initialized = true;

  // Assert that environment is set up correctly
  if (!WPAC._Options || !WPACCallbacks) {
    WPAC._Debug('error', 'Something unexpected happened, initialization failed. Please try to reinstall the plugin.');
    return false;
  }

  // Debug infos
  WPAC._Debug('info', 'Initializing version %s', WPAC._Options.version);

  // Debug infos
  if (WPAC._Options.debug) {
    if (!jQuery || !jQuery.fn || !jQuery.fn.jquery) {
      WPAC._Debug('error', 'jQuery not found, abort initialization. Please try to reinstall the plugin.');
      return false;
    }
    WPAC._Debug('info', 'Found jQuery %s', jQuery.fn.jquery);
    if (!jQuery.blockUI || !jQuery.blockUI.version) {
      WPAC._Debug('error', 'jQuery blockUI not found, abort initialization. Please try to reinstall the plugin.');
      return false;
    }
    WPAC._Debug('info', 'Found jQuery blockUI %s', jQuery.blockUI.version);
    if (!jQuery.idleTimer) {
      WPAC._Debug('error', 'jQuery Idle Timer plugin not found, abort initialization. Please try to reinstall the plugin.');
      return false;
    }
    WPAC._Debug('info', 'Found jQuery Idle Timer plugin');
  }
  if (WPAC._Options.selectorPostContainer) {
    WPAC._Debug('info', "Multiple comment form support enabled (selector: '%s')", WPAC._Options.selectorPostContainer);
    jQuery(WPAC._Options.selectorPostContainer).each(function (i, e) {
      var id = jQuery(e).attr('id');
      if (!id) {
        WPAC._Debug('info', 'Skip post container element %o (ID not defined)', e);
        return;
      }
      WPAC.AttachForm({
        selectorCommentForm: '#' + id + ' ' + WPAC._Options.selectorCommentForm,
        selectorCommentPagingLinks: '#' + id + ' ' + WPAC._Options.selectorCommentPagingLinks,
        selectorCommentsContainer: '#' + id + ' ' + WPAC._Options.selectorCommentsContainer,
        selectorRespondContainer: '#' + id + ' ' + WPAC._Options.selectorRespondContainer
      });
    });
  } else {
    WPAC.AttachForm();
  }

  // Set up loading preview handlers.
  jQuery('#wp-admin-bar-wpac-menu-helper-preview-overlay-loading a').on('click', function (e) {
    e.preventDefault();
    WPAC._ShowMessage('This is the loading preview...', 'loadingPreview', true);
  });

  // Set up success preview handlers.
  jQuery('#wp-admin-bar-wpac-menu-helper-preview-overlay-success a').on('click', function (e) {
    e.preventDefault();
    WPAC._ShowMessage('This is a success message', 'success', true);
  });

  // Set up error preview handlers.
  jQuery('#wp-admin-bar-wpac-menu-helper-preview-overlay-error a').on('click', function (e) {
    e.preventDefault();
    WPAC._ShowMessage('This is an error message', 'error', true);
  });

  // Set up idle timer
  if (WPAC._Options.commentsEnabled && WPAC._Options.autoUpdateIdleTime > 0) {
    WPAC._Debug('info', 'Auto updating comments enabled (idle time: %s)', WPAC._Options.autoUpdateIdleTime);
    WPAC._InitIdleTimer();
  }
  WPAC._Debug('info', 'Initialization completed');
  return true;
};
WPAC._OnIdle = function () {
  WPAC.RefreshComments({
    success: WPAC._InitIdleTimer,
    scrollToAnchor: false
  });
};
WPAC._InitIdleTimer = function () {
  if (WPAC._TestFallbackUrl(location.href)) {
    WPAC._Debug('error', "Fallback URL was detected (url: '%s'), cancel init idle timer", location.href);
    return;
  }
  jQuery(document).idleTimer('destroy');
  jQuery(document).idleTimer(WPAC._Options.autoUpdateIdleTime);
  jQuery(document).on('idle.idleTimer', WPAC._OnIdle);
};

/**
 * Refresh the comments by Ajaxify Comments.
 * @param { Object } options Optiosn for Ajaxify Comments.
 * @return comments.
 */
WPAC.RefreshComments = function (options) {
  if (WPAC._TestFallbackUrl(location.href)) {
    WPAC._Debug('error', "Fallback URL was detected (url: '%s'), cancel AJAX request", location.href);
    return false;
  }

  // Users can pass options as first parameter to override selectors.
  return WPAC.LoadComments(location.href, options);
};
WPAC.LoadComments = function (url, options) {
  // Cancel AJAX request if cross-domain scripting is detected
  if (WPAC._TestCrossDomainScripting(url)) {
    WPAC._Debug('error', "Cross-domain scripting detected (url: '%s'), cancel AJAX request", url);
    return false;
  }

  // Convert boolean parameter (used in version <0.14.0)
  if (typeof options === 'boolean') {
    options = {
      scrollToAnchor: options
    };
  }

  // Set default options
  options = jQuery.extend({
    scrollToAnchor: !WPAC._Options.disableScrollToAnchor,
    showLoadingInfo: true,
    updateUrl: !WPAC._Options.disableUrlUpdate,
    success: function success() {},
    selectorCommentForm: WPAC._Options.selectorCommentForm,
    selectorCommentsContainer: WPAC._Options.selectorCommentsContainer,
    selectorRespondContainer: WPAC._Options.selectorRespondContainer,
    disableCache: WPAC._Options.disableCache,
    beforeSelectElements: WPACCallbacks.beforeSelectElements,
    beforeUpdateComments: WPACCallbacks.beforeUpdateComments,
    afterUpdateComments: WPACCallbacks.afterUpdateComments
  }, options || {});

  // Save form data and focus
  var formData = jQuery(options.selectorCommentForm).serializeArray();
  var formFocus = document.activeElement ? jQuery("[name='" + document.activeElement.name + "']", options.selectorCommentForm).attr('name') : '';

  // Get query strings form URL (ajaxifyLazyLoadEnable, nonce, post_id).
  var urlObject = new URL(url);
  var queryParams = urlObject.searchParams;
  if (queryParams.has('ajaxifyLazyLoadEnable')) {
    var ajaxifyLazyLoadEnable = queryParams.get('ajaxifyLazyLoadEnable');
    var nonce = queryParams.get('nonce');
    var postId = queryParams.get('post_id');

    // Add to URL.
    url = WPAC._AddQueryParamStringToUrl(url, 'ajaxifyLazyLoadEnable', ajaxifyLazyLoadEnable);
    url = WPAC._AddQueryParamStringToUrl(url, 'nonce', nonce);
    url = WPAC._AddQueryParamStringToUrl(url, 'post_id', postId);
  }
  if (options.disableCache) {
    url = WPAC._AddQueryParamStringToUrl(url, 'WPACRandom', new Date().getTime());
  }
  var request = jQuery.ajax({
    url: url,
    type: 'GET',
    beforeSend: function beforeSend(xhr) {
      xhr.setRequestHeader('X-WPAC-REQUEST', '1');
    },
    success: function success(data) {
      try {
        if (!WPAC._ReplaceComments(data, url, true, formData, formFocus, options.selectorCommentsContainer, options.selectorCommentForm, options.selectorRespondContainer, options.beforeSelectElements, options.beforeUpdateComments, options.afterUpdateComments)) {
          return;
        }
        if (options.updateUrl) {
          WPAC._UpdateUrl(url);
        }

        // Scroll to anchor
        var waitForScrollToAnchor = false;
        if (options.scrollToAnchor) {
          var _anchor2 = url.indexOf('#') >= 0 ? url.substr(url.indexOf('#')) : null;
          if (_anchor2) {
            WPAC._Debug('info', "Anchor '%s' extracted from url", _anchor2);
            if (WPAC._ScrollToAnchor(_anchor2, options.updateUrl, function () {
              options.success();
            })) {
              waitForScrollToAnchor = true;
            }
          }
        }
      } catch (e) {
        WPAC._Debug('error', 'Something went wrong while refreshing comments: %s', e);
      }

      // Unblock UI
      jQuery.unblockUI();
      if (!waitForScrollToAnchor) {
        options.success();
      }
    },
    error: function error() {
      WPAC._LoadFallbackUrl(WPAC._AddQueryParamStringToUrl(window.location.href, 'WPACFallback', '1'));
    }
  });
  return true;
};
jQuery(function () {
  var initSuccesful = WPAC.Init();
  if (true === WPAC._Options.lazyLoadEnabled) {
    if (!initSuccesful) {
      WPAC._LoadFallbackUrl(WPAC._AddQueryParamStringToUrl(window.location.href, 'WPACFallback', '1'));
      return;
    }
    var triggerType = WPAC._Options.lazyLoadTrigger;
    var lazyLoadTrigger = WPAC._Options.lazyLoadTrigger;
    var lazyLoadScrollOffset = parseInt(WPAC._Options.lazyLoadTriggerScrollOffset);
    var lazyLoadElement = WPAC._Options.lazyLoadTriggerElement;
    var lazyLoadInlineType = WPAC._Options.lazyLoadInlineLoadingType;
    var lazyLoadOffset = parseInt(WPAC._Options.lazyLoadTriggerOffset);
    if (lazyLoadOffset === 0) {
      lazyLoadOffset = '100%';
    }

    // Determine where to load the lazy loading message (if not overlay).
    var isLazyLoadInline = 'inline' === WPAC._Options.lazyLoadDisplay;
    var lazyloadInlineDisplayLocation = WPAC._Options.lazyLoadInlineDisplayLocation; /* can be comments, element */

    // If inline, let's move the loader.
    if (isLazyLoadInline && WPAC._Options.lazyLoadIntoElement) {
      var lazyloadInlineDisplayElement = WPAC._Options.lazyLoadInlineDisplayElement;
      if ('comments' === lazyloadInlineDisplayLocation) {
        lazyloadInlineDisplayElement = WPAC._Options.selectorCommentsContainer;
      }
      var lazyLoadContent = document.querySelector('#wpac-lazy-load-content'); // hardcoded selector.
      if (null !== lazyLoadContent) {
        // Clone it without ref.
        var lazyLoadContentClone = jQuery.clone(lazyLoadContent);
        lazyLoadContentClone.id = 'wpac-lazy-load-content-clone';

        // Determine trigger if button.
        if ('button' === lazyLoadInlineType) {
          // This will make it so that a button must be clicked to load comments.
          lazyLoadTrigger = 'external';
        }
        if ('skeleton' === lazyLoadInlineType) {
          // Show the loading skeleton to the user.
        }

        // Display the loader.
        if ('comments' === lazyloadInlineDisplayLocation) {
          var commentsContainer = jQuery(lazyloadInlineDisplayElement);
          if (commentsContainer) {
            // Test for block theme comment container title.
            var maybeBlockCommentstitle = commentsContainer.find('.wp-block-comments-title, .comments-title');
            if (maybeBlockCommentstitle.length > 0) {
              // Insert after title.
              jQuery(maybeBlockCommentstitle).after(lazyLoadContentClone);
            } else {
              commentsContainer.prepend(lazyLoadContentClone);
            }
          } else {
            WPAC._Debug('error', 'Comments container not found for lazy loading when reaching the comments section.');
          }
        } else if ('element' === lazyloadInlineDisplayLocation) {
          var domElement = jQuery(lazyloadInlineDisplayElement);
          if (domElement) {
            // add to top of comments element.
            jQuery(domElement).prepend(lazyLoadContentClone);

            // Remove style attribute.
            jQuery(domElement).removeAttr('style');
          } else {
            WPAC._Debug('error', 'Element not found for lazy loading when reaching the element.');
          }
        }

        // Init lazy loading button (if any).
        var lazyLoadButton = document.querySelector('.ajaxify-comments-loading-button-wrapper button');
        if (null !== lazyLoadButton) {
          lazyLoadButton.addEventListener('click', function (e) {
            e.preventDefault();
            lazyLoadButton.innerHTML = WPAC._Options.lazyLoadInlineButtonLabelLoading;
            WPAC.RefreshComments();
          });
        }
      }
    }
    WPAC._Debug('info', "Loading comments asynchronously with secondary AJAX request (trigger: '%s')", lazyLoadTrigger);
    if (window.location.hash) {
      var regex = /^#comment-[0-9]+$/;
      if (regex.test(window.location.hash)) {
        WPAC._Debug('info', "Comment anchor in URL detected, force loading comments on DomReady (hash: '%s')", window.location.hash);
        lazyLoadTrigger = 'domready';
      }
    }
    switch (lazyLoadTrigger) {
      case 'external':
        WPAC._Debug('info', 'Lazy loading: Waiting on external trigger for lazy loading comments.', window.location.hash);
        break;
      case 'comments':
        var _commentsContainer = document.querySelector(WPAC._Options.selectorCommentsContainer);
        if (null !== _commentsContainer) {
          WPAC._Debug('info', 'Lazy loading: Waiting on comments to scroll into view for lazy loading.', window.location.hash);
          jQuery(_commentsContainer).waypoint(function (direction) {
            this.destroy();
            WPAC._ShowMessage(WPAC._Options.textRefreshComments, 'loading');
            WPAC.RefreshComments();
          }, {
            offset: lazyLoadScrollOffset ? lazyLoadScrollOffset : '100%'
          });
        } else {
          WPAC._Debug('error', 'Comments container not found for lazy loading when reaching the comments section.');
        }
        break;
      case 'element':
        var _domElement = document.querySelector(lazyLoadElement);
        if (null !== _domElement) {
          WPAC._Debug('info', 'Lazy loading: Waiting on element to scroll into view for lazy loading.', window.location.hash);
          jQuery(_domElement).waypoint(function (direction) {
            this.destroy();
            if ('button' !== lazyLoadInlineType && isLazyLoadInline) {
              WPAC._ShowMessage(WPAC._Options.textRefreshComments, 'loading');
              WPAC.RefreshComments();
            }
          }, {
            offset: lazyLoadScrollOffset ? lazyLoadScrollOffset : '100%'
          });
        } else {
          WPAC._Debug('error', 'Element not found for lazy loading when reaching the element.');
        }
        break;
      case 'domready':
        // Only refresh comments if not inline button.
        if ('button' !== lazyLoadInlineType && isLazyLoadInline || !isLazyLoadInline) {
          WPAC._Debug('info', 'Lazy loading: Waiting on Dom to be ready for lazy loading.', window.location.hash);
          WPAC._ShowMessage(WPAC._Options.textRefreshComments, 'loading');
          WPAC.RefreshComments({
            scrollToAnchor: true
          }); // force scroll to anchor.
        }

        break;
      case 'scroll':
        WPAC._Debug('info', 'Lazy loading: Waiting on Scroll Into View.', window.location.hash);

        // Get the body tag and calculate offset.
        var body = document.querySelector('body');
        jQuery(body).waypoint(function (direction) {
          this.destroy();
          if ('button' !== lazyLoadInlineType && 'inline' === lazyLoadInlineType) {
            WPAC._ShowMessage(WPAC._Options.textRefreshComments, 'loading');
            WPAC.RefreshComments();
          }
        }, {
          offset: lazyLoadScrollOffset * -1
        });
    }
  }
});
function wpac_init() {
  WPAC._Debug('info', 'wpac_init() is deprecated, please use WPAC.Init()');
  WPAC.Init();
}
/******/ })()
;
//# sourceMappingURL=wpac-frontend-wp-ajaxify-comments.js.map