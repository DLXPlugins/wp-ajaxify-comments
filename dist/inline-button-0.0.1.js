"use strict";
(self["webpackChunkwp_ajaxify_comments"] = self["webpackChunkwp_ajaxify_comments"] || []).push([["inline-button-0.0.1"],{

/***/ "./node_modules/@wordpress/components/build-module/panel/body.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@wordpress/components/build-module/panel/body.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PanelBody: () => (/* binding */ PanelBody),
/* harmony export */   UnforwardedPanelBody: () => (/* binding */ UnforwardedPanelBody),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "./node_modules/react/index.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/compose */ "./node_modules/@wordpress/compose/build-module/hooks/use-reduced-motion/index.js");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/compose */ "./node_modules/@wordpress/compose/build-module/hooks/use-merge-refs/index.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/chevron-up.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/chevron-down.js");
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../button */ "./node_modules/@wordpress/components/build-module/button/index.js");
/* harmony import */ var _icon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../icon */ "./node_modules/@wordpress/components/build-module/icon/index.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./node_modules/@wordpress/components/build-module/utils/hooks/use-controlled-state.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils */ "./node_modules/@wordpress/components/build-module/utils/hooks/use-update-effect.js");

/**
 * External dependencies
 */


/**
 * WordPress dependencies
 */




/**
 * Internal dependencies
 */




const noop = () => {};
function UnforwardedPanelBody(props, ref) {
  const {
    buttonProps = {},
    children,
    className,
    icon,
    initialOpen,
    onToggle = noop,
    opened,
    title,
    scrollAfterOpen = true
  } = props;
  const [isOpened, setIsOpened] = (0,_utils__WEBPACK_IMPORTED_MODULE_1__["default"])(opened, {
    initial: initialOpen === undefined ? true : initialOpen,
    fallback: false
  });
  const nodeRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useRef)(null);

  // Defaults to 'smooth' scrolling
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
  const scrollBehavior = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_3__["default"])() ? 'auto' : 'smooth';
  const handleOnToggle = event => {
    event.preventDefault();
    const next = !isOpened;
    setIsOpened(next);
    onToggle(next);
  };

  // Ref is used so that the effect does not re-run upon scrollAfterOpen changing value.
  const scrollAfterOpenRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useRef)();
  scrollAfterOpenRef.current = scrollAfterOpen;
  // Runs after initial render.
  (0,_utils__WEBPACK_IMPORTED_MODULE_4__["default"])(() => {
    if (isOpened && scrollAfterOpenRef.current && nodeRef.current?.scrollIntoView) {
      /*
       * Scrolls the content into view when visible.
       * This improves the UX when there are multiple stacking <PanelBody />
       * components in a scrollable container.
       */
      nodeRef.current.scrollIntoView({
        inline: 'nearest',
        block: 'nearest',
        behavior: scrollBehavior
      });
    }
  }, [isOpened, scrollBehavior]);
  const classes = classnames__WEBPACK_IMPORTED_MODULE_0___default()('components-panel__body', className, {
    'is-opened': isOpened
  });
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createElement)("div", {
    className: classes,
    ref: (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_5__["default"])([nodeRef, ref])
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createElement)(PanelBodyTitle, {
    icon: icon,
    isOpened: Boolean(isOpened),
    onClick: handleOnToggle,
    title: title,
    ...buttonProps
  }), typeof children === 'function' ? children({
    opened: Boolean(isOpened)
  }) : isOpened && children);
}
const PanelBodyTitle = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.forwardRef)(({
  isOpened,
  icon,
  title,
  ...props
}, ref) => {
  if (!title) return null;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createElement)("h2", {
    className: "components-panel__body-title"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createElement)(_button__WEBPACK_IMPORTED_MODULE_6__["default"], {
    className: "components-panel__body-toggle",
    "aria-expanded": isOpened,
    ref: ref,
    ...props
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createElement)("span", {
    "aria-hidden": "true"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createElement)(_icon__WEBPACK_IMPORTED_MODULE_7__["default"], {
    className: "components-panel__arrow",
    icon: isOpened ? _wordpress_icons__WEBPACK_IMPORTED_MODULE_8__["default"] : _wordpress_icons__WEBPACK_IMPORTED_MODULE_9__["default"]
  })), title, icon && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createElement)(_icon__WEBPACK_IMPORTED_MODULE_7__["default"], {
    icon: icon,
    className: "components-panel__icon",
    size: 20
  })));
});
const PanelBody = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.forwardRef)(UnforwardedPanelBody);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PanelBody);
//# sourceMappingURL=body.js.map

/***/ }),

/***/ "./node_modules/@wordpress/compose/build-module/hooks/use-reduced-motion/index.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@wordpress/compose/build-module/hooks/use-reduced-motion/index.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _use_media_query__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../use-media-query */ "./node_modules/@wordpress/compose/build-module/hooks/use-media-query/index.js");
/**
 * Internal dependencies
 */


/**
 * Hook returning whether the user has a preference for reduced motion.
 *
 * @return {boolean} Reduced motion preference value.
 */
const useReducedMotion = () => (0,_use_media_query__WEBPACK_IMPORTED_MODULE_0__["default"])('(prefers-reduced-motion: reduce)');
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useReducedMotion);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/chevron-up.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/chevron-up.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "./node_modules/react/index.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/primitives */ "./node_modules/@wordpress/primitives/build-module/svg/index.js");

/**
 * WordPress dependencies
 */

const chevronUp = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.SVG, {
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Path, {
  d: "M6.5 12.4L12 8l5.5 4.4-.9 1.2L12 10l-4.5 3.6-1-1.2z"
}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (chevronUp);
//# sourceMappingURL=chevron-up.js.map

/***/ }),

/***/ "./src/js/react/views/LazyLoad/inline-button.js":
/*!******************************************************!*\
  !*** ./src/js/react/views/LazyLoad/inline-button.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/components */ "./node_modules/@wordpress/components/build-module/button/index.js");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/components */ "./node_modules/@wordpress/components/build-module/panel/body.js");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @wordpress/components */ "./node_modules/@wordpress/components/build-module/base-control/index.js");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @wordpress/components */ "./node_modules/@wordpress/components/build-module/button-group/index.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "./node_modules/@wordpress/i18n/build-module/index.js");
/* harmony import */ var _fancyapps_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @fancyapps/ui */ "./node_modules/@fancyapps/ui/dist/index.esm.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _components_Alignment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../components/Alignment */ "./src/js/react/components/Alignment/index.js");
/* harmony import */ var _components_ColorPicker__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/ColorPicker */ "./src/js/react/components/ColorPicker/index.js");
/* harmony import */ var _components_Notice__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../components/Notice */ "./src/js/react/components/Notice/index.js");










var InlineButton = function InlineButton(props) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, "Hi for buttons!");
};
var InlineButtonOptions = function InlineButtonOptions(props) {
  var control = props.control,
    errors = props.errors,
    setValue = props.setValue,
    getValues = props.getValues,
    clearErrors = props.clearErrors;
  var getInlineButton = function getInlineButton() {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__["default"], {
      className: classnames__WEBPACK_IMPORTED_MODULE_3___default()('ajaxify-btn-reset ajaxify-lazy-load-btn', {}),
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Load Comments', 'wp-ajaxify-comments')
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Load Comments', 'wp-ajaxify-comments'));
  };
  var getButtonDesigner = function getButtonDesigner() {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-button-designer"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-button-designer__header"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h3", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Button Designer', 'wp-ajaxify-comments'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-button-designer__body"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-button-designer__preview"
    }, getInlineButton()), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-button-designer__sidebar"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-button-designer__sidebar-body"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_8__["default"], {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Button Options', 'wp-ajaxify-comments'),
      initialOpen: true
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__["default"], {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Button Style', 'wp-ajaxify-comments'),
      id: "ajaxify-button-designer__button-style"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__["default"], {
      className: "ajaxify-button-designer__button-group"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__["default"], {
      variant: "primary",
      isPressed: true
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Rounded', 'wp-ajaxify-comments')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__["default"], {
      variant: "primary",
      isPressed: false
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Rectangular', 'wp-ajaxify-comments'))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_8__["default"], {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Colors', 'wp-ajaxify-comments'),
      initialOpen: false
    }, "Colors"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_8__["default"], {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Spacing', 'wp-ajaxify-comments'),
      initialOpen: false
    }, "Spacing"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_8__["default"], {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Colors', 'wp-ajaxify-comments'),
      initialOpen: false
    }, "Colors"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_8__["default"], {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Spacing', 'wp-ajaxify-comments'),
      initialOpen: false
    }, "Spacing"))))));
  };
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, getButtonDesigner());
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (InlineButtonOptions);

/***/ })

}]);
//# sourceMappingURL=inline-button-0.0.1.js.map