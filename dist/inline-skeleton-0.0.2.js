"use strict";
(self["webpackChunkwp_ajaxify_comments"] = self["webpackChunkwp_ajaxify_comments"] || []).push([["inline-skeleton-0.0.2"],{

/***/ "./src/js/react/views/LazyLoad/inline-skeleton.js":
/*!********************************************************!*\
  !*** ./src/js/react/views/LazyLoad/inline-skeleton.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/alert-circle.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/eye.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_hook_form__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-hook-form */ "./node_modules/react-hook-form/dist/index.esm.mjs");
/* harmony import */ var _fancyapps_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fancyapps/ui */ "./node_modules/@fancyapps/ui/dist/index.esm.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _components_Alignment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/Alignment */ "./src/js/react/components/Alignment/index.js");
/* harmony import */ var _components_ColorPicker__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../components/ColorPicker */ "./src/js/react/components/ColorPicker/index.js");
/* harmony import */ var _components_Notice__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../components/Notice */ "./src/js/react/components/Notice/index.js");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }










var defaultPalette = wpacAdminLazyLoad.palette;
var InlineSkeleton = function InlineSkeleton(props) {
  var rows = props.rows,
    showHeading = props.showHeading,
    heading = props.heading,
    getValues = props.getValues;
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    showFancybox = _useState2[0],
    setShowFancybox = _useState2[1];
  var _getValues = getValues(),
    lazyLoadInlineSkeletonBackgroundColor = _getValues.lazyLoadInlineSkeletonBackgroundColor,
    lazyLoadInlineSkeletonHighlightColor = _getValues.lazyLoadInlineSkeletonHighlightColor,
    lazyLoadInlineSkeletonHeadingColor = _getValues.lazyLoadInlineSkeletonHeadingColor,
    lazyLoadInlineSkeletonHeadingFontSize = _getValues.lazyLoadInlineSkeletonHeadingFontSize,
    lazyLoadInlineSkeletonHeadingLineHeight = _getValues.lazyLoadInlineSkeletonHeadingLineHeight;
  var getRow = function getRow(key) {
    var row = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-loading-skeleton",
      key: key
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-skeleton-comment-header"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-skeleton-avatar"
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-skeleton-comment-meta"
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-skeleton-comment-body"
    }));
    return row;
  };
  var getRows = function getRows() {
    // For loop and return rows.
    var loadingRows = [];
    for (var i = 0; i < rows; i++) {
      loadingRows.push(getRow(i));
    }
    return loadingRows;
  };
  var styles = "\n\t\t.ajaxify-loading-skeleton-wrapper {\n\t\t\t--ajaxify-skeleton-loader-background-color: ".concat(lazyLoadInlineSkeletonBackgroundColor, ";\n\t\t\t--ajaxify-skeleton-loader-highlight-color: ").concat(lazyLoadInlineSkeletonHighlightColor, ";\n\t\t\t--ajaxify-skeleton-loader-heading-color: ").concat(lazyLoadInlineSkeletonHeadingColor, ";\n\t\t\t--ajaxify-skeleton-loader-heading-font-size: ").concat(lazyLoadInlineSkeletonHeadingFontSize, "px;\n\t\t\t--ajaxify-skeleton-loader-heading-line-height: ").concat(lazyLoadInlineSkeletonHeadingLineHeight, ";\n\t\t\t--ajaxify-skeleton-gradient: linear-gradient(90deg, var(--ajaxify-skeleton-loader-background-color) 25%, var(--ajaxify-skeleton-loader-highlight-color) 50%, var(--ajaxify-skeleton-loader-background-color) 75%);\n\t\t}\n\t");
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("style", null, styles), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "ajaxify-loading-skeleton-wrapper"
  }, showHeading && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h2", {
    className: "ajaxify-skeleton-heading"
  }, heading), getRows()));
};
var InlineSkeletonOptions = function InlineSkeletonOptions(props) {
  var control = props.control,
    errors = props.errors,
    setValue = props.setValue,
    getValues = props.getValues,
    clearErrors = props.clearErrors;
  var getLoadingSkeletonOptions = function getLoadingSkeletonOptions() {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tr", {
      className: "ajaxify-admin__loading-spinner-row"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("th", {
      scope: "row"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Loading Spinner', 'wp-ajaxify-comments')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-admin__control-row"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_hook_form__WEBPACK_IMPORTED_MODULE_8__.Controller, {
      name: "lazyLoadInlineSkeletonLoadingLabelEnabled",
      control: control,
      render: function render(_ref) {
        var _ref$field = _ref.field,
          onChange = _ref$field.onChange,
          value = _ref$field.value;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Show Loading Skeleton Heading', 'wp-ajaxify-comments'),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Show a heading above the loading skeleton.', 'wp-ajaxify-comments'),
          checked: value,
          onChange: onChange
        }));
      }
    })), getValues('lazyLoadInlineSkeletonLoadingLabelEnabled') && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-admin__control-row"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_hook_form__WEBPACK_IMPORTED_MODULE_8__.Controller, {
      name: "lazyLoadInlineSkeletonLoadingLabel",
      control: control,
      rules: {
        required: true
      },
      render: function render(_ref2) {
        var _ref2$field = _ref2.field,
          _onChange = _ref2$field.onChange,
          value = _ref2$field.value;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Loading Skeleton Heading', 'wp-ajaxify-comments'),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('The heading above the loading skeleton.', 'wp-ajaxify-comments'),
          value: value,
          onChange: function onChange(e) {
            clearErrors('lazyLoadInlineSkeletonLoadingLabel');
            _onChange(e);
          }
        }), errors.lazyLoadInlineSkeletonLoadingLabel && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_Notice__WEBPACK_IMPORTED_MODULE_7__["default"], {
          message: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('This field is required.', 'wp-ajaxify-comments'),
          status: "error",
          politeness: "assertive",
          inline: false,
          icon: function icon() {
            return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(lucide_react__WEBPACK_IMPORTED_MODULE_9__["default"], null);
          }
        }));
      }
    }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-admin__control-row"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_hook_form__WEBPACK_IMPORTED_MODULE_8__.Controller, {
      name: "lazyLoadInlineSkeletonItemsShow",
      control: control,
      render: function render(_ref3) {
        var _ref3$field = _ref3.field,
          onChange = _ref3$field.onChange,
          value = _ref3$field.value;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Number of Skeletons to Show', 'wp-ajaxify-comments'),
          value: value,
          onChange: onChange,
          min: 1,
          max: 10,
          step: 1,
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Set how many loading instances that should show.', 'wp-ajaxify-comments'),
          color: "var(--ajaxify-admin--color-main)",
          trackColor: "var(--ajaxify-admin--color-main)",
          resetFallbackValue: 1
        }));
      }
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-admin__control-row"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_hook_form__WEBPACK_IMPORTED_MODULE_8__.Controller, {
      name: "lazyLoadInlineSkeletonBackgroundColor",
      control: control,
      render: function render(_ref4) {
        var _ref4$field = _ref4.field,
          _onChange2 = _ref4$field.onChange,
          value = _ref4$field.value;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_ColorPicker__WEBPACK_IMPORTED_MODULE_6__["default"], {
          value: value,
          key: 'skeleton-background-color',
          onChange: function onChange(slug, newValue) {
            _onChange2(newValue);
          },
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Skeleton Background Color', 'wp-ajaxify-comments'),
          defaultColors: defaultPalette,
          defaultColor: '#EEEEEE',
          slug: 'skeleton-background-color'
        }));
      }
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-admin__control-row"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_hook_form__WEBPACK_IMPORTED_MODULE_8__.Controller, {
      name: "lazyLoadInlineSkeletonHighlightColor",
      control: control,
      render: function render(_ref5) {
        var _ref5$field = _ref5.field,
          _onChange3 = _ref5$field.onChange,
          value = _ref5$field.value;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_ColorPicker__WEBPACK_IMPORTED_MODULE_6__["default"], {
          value: value,
          key: 'skeleton-highlight-color',
          onChange: function onChange(slug, newValue) {
            _onChange3(newValue);
          },
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Skeleton Highlight Color', 'wp-ajaxify-comments'),
          defaultColors: defaultPalette,
          defaultColor: '#dedede',
          slug: 'skeleton-highlight-color'
        }));
      }
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-admin__control-row"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Preview Loading Skeleton', 'wp-ajaxify-comments'),
      className: "ajaxify-button ajaxify__btn-secondary has-text has-icon",
      icon: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(lucide_react__WEBPACK_IMPORTED_MODULE_10__["default"], null),
      "data-src": "#ajaxify-skeleton-preview",
      "data-fancybox": true,
      onClick: function onClick(e) {
        e.preventDefault();
        _fancyapps_ui__WEBPACK_IMPORTED_MODULE_3__.Fancybox.show([{
          src: '#ajaxify-skeleton-preview',
          type: 'clone',
          autoStart: true
        }]);
      }
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Preview', 'wp-ajaxify-comments'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "ajaxify-skeleton-preview",
      style: {
        display: 'none',
        width: '80%',
        margin: '0 auto'
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(InlineSkeleton, {
      rows: getValues('lazyLoadInlineSkeletonItemsShow'),
      showHeading: getValues('lazyLoadInlineSkeletonLoadingLabelEnabled'),
      heading: getValues('lazyLoadInlineSkeletonLoadingLabel'),
      getValues: getValues
    })))));
  };
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, getLoadingSkeletonOptions());
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (InlineSkeletonOptions);

/***/ }),

/***/ "./node_modules/lucide-react/dist/esm/icons/eye.js":
/*!*********************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/eye.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Eye)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * lucide-react v0.268.0 - ISC
 */



const Eye = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("Eye", [
  [
    "path",
    { d: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z", key: "rwhkz3" }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);


//# sourceMappingURL=eye.js.map


/***/ })

}]);
//# sourceMappingURL=inline-skeleton-0.0.2.js.map