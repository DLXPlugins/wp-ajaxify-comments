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
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/components */ "./node_modules/@wordpress/components/build-module/toggle-control/index.js");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @wordpress/components */ "./node_modules/@wordpress/components/build-module/text-control/index.js");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @wordpress/components */ "./node_modules/@wordpress/components/build-module/range-control/index.js");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @wordpress/components */ "./node_modules/@wordpress/components/build-module/button/index.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/alert-circle.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/eye.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "./node_modules/@wordpress/i18n/build-module/index.js");
/* harmony import */ var react_hook_form__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-hook-form */ "./node_modules/react-hook-form/dist/index.esm.mjs");
/* harmony import */ var _fancyapps_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @fancyapps/ui */ "./node_modules/@fancyapps/ui/dist/index.esm.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _components_Alignment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../components/Alignment */ "./src/js/react/components/Alignment/index.js");
/* harmony import */ var _components_ColorPicker__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/ColorPicker */ "./src/js/react/components/ColorPicker/index.js");
/* harmony import */ var _components_Notice__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../components/Notice */ "./src/js/react/components/Notice/index.js");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }










var InlineSkeleton = function InlineSkeleton(props) {
  var rows = props.rows,
    showHeading = props.showHeading,
    heading = props.heading;
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    showFancybox = _useState2[0],
    setShowFancybox = _useState2[1];
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
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, showHeading && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h2", null, heading), getRows());
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
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Loading Spinner', 'wp-ajaxify-comments')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-admin__control-row"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_hook_form__WEBPACK_IMPORTED_MODULE_7__.Controller, {
      name: "lazyLoadInlineSkeletonLoadingLabelEnabled",
      control: control,
      render: function render(_ref) {
        var _ref$field = _ref.field,
          onChange = _ref$field.onChange,
          value = _ref$field.value;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_8__["default"], {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show Loading Skeleton Heading', 'wp-ajaxify-comments'),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show a heading above the loading skeleton.', 'wp-ajaxify-comments'),
          checked: value,
          onChange: onChange
        }));
      }
    })), getValues('lazyLoadInlineSkeletonLoadingLabelEnabled') && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-admin__control-row"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_hook_form__WEBPACK_IMPORTED_MODULE_7__.Controller, {
      name: "lazyLoadInlineSkeletonLoadingLabel",
      control: control,
      rules: {
        required: true
      },
      render: function render(_ref2) {
        var _ref2$field = _ref2.field,
          _onChange = _ref2$field.onChange,
          value = _ref2$field.value;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__["default"], {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Loading Skeleton Heading', 'wp-ajaxify-comments'),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('The heading above the loading skeleton.', 'wp-ajaxify-comments'),
          value: value,
          onChange: function onChange(e) {
            clearErrors('lazyLoadInlineSkeletonLoadingLabel');
            _onChange(e);
          }
        }), errors.lazyLoadInlineSkeletonLoadingLabel && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_Notice__WEBPACK_IMPORTED_MODULE_6__["default"], {
          message: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('This field is required.', 'wp-ajaxify-comments'),
          status: "error",
          politeness: "assertive",
          inline: false,
          icon: function icon() {
            return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(lucide_react__WEBPACK_IMPORTED_MODULE_10__["default"], null);
          }
        }));
      }
    }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-admin__control-row"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_hook_form__WEBPACK_IMPORTED_MODULE_7__.Controller, {
      name: "lazyLoadInlineSkeletonItemsShow",
      control: control,
      render: function render(_ref3) {
        var _ref3$field = _ref3.field,
          onChange = _ref3$field.onChange,
          value = _ref3$field.value;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__["default"], {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Number of Skeletons to Show', 'wp-ajaxify-comments'),
          value: value,
          onChange: onChange,
          min: 1,
          max: 10,
          step: 1,
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Set how many loading instances that should show.', 'wp-ajaxify-comments'),
          color: "var(--ajaxify-admin--color-main)",
          trackColor: "var(--ajaxify-admin--color-main)",
          resetFallbackValue: 1
        }));
      }
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-admin__control-row"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_12__["default"], {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Preview Loading Skeleton', 'wp-ajaxify-comments'),
      className: "ajaxify-button ajaxify__btn-secondary has-text has-icon",
      icon: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(lucide_react__WEBPACK_IMPORTED_MODULE_13__["default"], null),
      "data-src": "#ajaxify-skeleton-preview",
      "data-fancybox": true,
      onClick: function onClick(e) {
        e.preventDefault();
        _fancyapps_ui__WEBPACK_IMPORTED_MODULE_2__.Fancybox.show([{
          src: '#ajaxify-skeleton-preview',
          type: 'clone',
          autoStart: true
        }]);
      }
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Preview', 'wp-ajaxify-comments'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "ajaxify-skeleton-preview",
      style: {
        display: 'none',
        width: '80%',
        margin: '0 auto'
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(InlineSkeleton, {
      rows: getValues('lazyLoadInlineSkeletonItemsShow'),
      showHeading: getValues('lazyLoadInlineSkeletonLoadingLabelEnabled'),
      heading: getValues('lazyLoadInlineSkeletonLoadingLabel')
    })))));
  };
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, getLoadingSkeletonOptions());
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (InlineSkeletonOptions);

/***/ })

}]);
//# sourceMappingURL=inline-skeleton-0.0.2.js.map