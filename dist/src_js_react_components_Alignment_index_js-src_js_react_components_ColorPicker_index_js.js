"use strict";
(self["webpackChunkwp_ajaxify_comments"] = self["webpackChunkwp_ajaxify_comments"] || []).push([["src_js_react_components_Alignment_index_js-src_js_react_components_ColorPicker_index_js"],{

/***/ "./src/js/react/components/Alignment/index.js":
/*!****************************************************!*\
  !*** ./src/js/react/components/Alignment/index.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "./node_modules/@wordpress/i18n/build-module/index.js");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "./node_modules/@wordpress/components/build-module/base-control/index.js");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/components */ "./node_modules/@wordpress/components/build-module/button-group/index.js");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/components */ "./node_modules/@wordpress/components/build-module/button/index.js");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./editor.scss */ "./src/js/react/components/Alignment/editor.scss");
/**
 * Alignment Group (Left|Center|Right) with a label and button icons.
 *
 * Pass onClick prop to propagate up to parent. Values are (left|center|right).
 */





var AlignmentGroup = function AlignmentGroup(props) {
  var alignment = props.alignment,
    label = props.label,
    alignLeftLabel = props.alignLeftLabel,
    alignCenterLabel = props.alignCenterLabel,
    alignRightLabel = props.alignRightLabel,
    leftOn = props.leftOn,
    centerOn = props.centerOn,
    rightOn = props.rightOn;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "ajaxify-alignment-component-base"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__["default"], {
    id: "ajaxify-alignment-component-base",
    label: label
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__["default"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, leftOn && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__["default"], {
    isPressed: 'left' === alignment ? true : false,
    isSecondary: true,
    icon: "editor-alignleft",
    label: alignLeftLabel,
    onClick: function onClick() {
      props.onClick('left');
    }
  }), centerOn && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__["default"], {
    isPressed: 'center' === alignment ? true : false,
    isSecondary: true,
    icon: "editor-aligncenter",
    label: alignCenterLabel,
    onClick: function onClick() {
      props.onClick('center');
    }
  }), rightOn && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__["default"], {
    isPressed: 'right' === alignment ? true : false,
    isSecondary: true,
    icon: "editor-alignright",
    label: alignRightLabel,
    onClick: function onClick() {
      props.onClick('right');
    }
  })))));
};
AlignmentGroup.defaultProps = {
  alignment: 'left',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Change Alignment', 'wp-ajaxify-comments'),
  alignLeftLabel: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._x)('Align Left', 'Align items left', 'wp-ajaxify-comments'),
  alignCenterLabel: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._x)('Align Center', 'Align items center/middle', 'wp-ajaxify-comments'),
  alignRightLabel: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._x)('Align Right', 'Align items right', 'wp-ajaxify-comments'),
  leftOn: true,
  centerOn: true,
  rightOn: true
};
AlignmentGroup.propTypes = {
  alignment: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().string),
  label: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().string),
  alignLeftLabel: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().string),
  alignCenterLabel: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().string),
  alignRightLabel: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().string),
  leftOn: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().bool),
  centerOn: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().bool),
  rightOn: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().bool)
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AlignmentGroup);

/***/ }),

/***/ "./src/js/react/components/ColorPicker/index.js":
/*!******************************************************!*\
  !*** ./src/js/react/components/ColorPicker/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var hex_to_rgba__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! hex-to-rgba */ "./node_modules/hex-to-rgba/build/index.js");
/* harmony import */ var hex_to_rgba__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(hex_to_rgba__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var rgb2hex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rgb2hex */ "./node_modules/rgb2hex/index.js");
/* harmony import */ var rgb2hex__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(rgb2hex__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/i18n */ "./node_modules/@wordpress/i18n/build-module/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/components */ "./node_modules/@wordpress/components/build-module/base-control/index.js");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/components */ "./node_modules/@wordpress/components/build-module/tooltip/index.js");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/components */ "./node_modules/@wordpress/components/build-module/popover/index.js");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/components */ "./node_modules/@wordpress/components/build-module/color-picker/legacy-adapter.js");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @wordpress/components */ "./node_modules/@wordpress/components/build-module/range-control/index.js");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @wordpress/components */ "./node_modules/@wordpress/components/build-module/color-palette/index.js");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @wordpress/components */ "./node_modules/@wordpress/components/build-module/button/index.js");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
/**
 * Color Picker.
 *
 * Credit: Forked from @generateblocks
 */







var ColorPickerControl = function ColorPickerControl(props) {
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(props.slug),
    _useState2 = _slicedToArray(_useState, 2),
    colorKey = _useState2[0],
    setColorKey = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState4 = _slicedToArray(_useState3, 2),
    isVisible = _useState4[0],
    setIsVisible = _useState4[1];
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(props.value),
    _useState6 = _slicedToArray(_useState5, 2),
    color = _useState6[0],
    setColor = _useState6[1];
  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(props.opacity),
    _useState8 = _slicedToArray(_useState7, 2),
    opacity = _useState8[0],
    setOpacity = _useState8[1];
  var defaultColor = props.defaultColor,
    defaultColors = props.defaultColors,
    value = props.value,
    _onChange = props.onChange,
    onOpacityChange = props.onOpacityChange,
    label = props.label,
    _props$alpha = props.alpha,
    alpha = _props$alpha === void 0 ? false : _props$alpha,
    slug = props.slug,
    _props$hideLabelFromV = props.hideLabelFromVision,
    hideLabelFromVision = _props$hideLabelFromV === void 0 ? false : _props$hideLabelFromV;
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    setColor(value);
  }, [value]);

  /**
   * Return a color based on passed alpha value.
   *
   * @param {string} colorValue   hex, rgb, rgba, or CSS var.
   * @param {number} opacityValue The opacity (from 0 - 1).
   * @return {string} The color in hex, rgba, or CSS var format.
   */
  var getColor = function getColor(colorValue) {
    var opacityValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    // Test for CSS var values in color value.
    if (colorValue.indexOf('var(') === 0) {
      return colorValue;
    }

    // Test for RGBA at the beginning, and return value.
    if (colorValue.indexOf('rgba') === 0) {
      // Calculate hex value from rgba.
      var hex = rgb2hex__WEBPACK_IMPORTED_MODULE_3___default()(colorValue).hex;
      return hex_to_rgba__WEBPACK_IMPORTED_MODULE_2___default()(hex, opacityValue);
    }

    // Test for RGB at the beginning, and return hex if found.
    if (colorValue.indexOf('rgb') === 0) {
      return hex_to_rgba__WEBPACK_IMPORTED_MODULE_2___default()(rgb2hex__WEBPACK_IMPORTED_MODULE_3___default()(colorValue).hex, opacityValue);
    }
    if (alpha) {
      return hex_to_rgba__WEBPACK_IMPORTED_MODULE_2___default()(colorValue, opacityValue);
    }
    return colorValue;
  };

  // Retrieve colors while avoiding duplicates.
  var getDefaultColors = function getDefaultColors() {
    var existingColors = [];
    var newColors = [];
    defaultColors.forEach(function (maybeNewColor, index) {
      if (!existingColors.includes(maybeNewColor.color)) {
        existingColors.push(maybeNewColor.color);
        newColors.push(maybeNewColor);
      }
    });
    return newColors;
  };
  var opacityIcon = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 488.47 488.47"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M244.235 0S61.058 174.454 61.058 314.016c0 96.347 82.011 174.454 183.177 174.454s183.177-78.107 183.177-174.454C427.412 174.454 244.235 0 244.235 0zm0 91.588c46.976 52.953 97.174 123.655 114.946 183.177H129.292c17.771-59.522 67.968-130.223 114.943-183.177z"
  }));

  /**
   * Toggle whether the color popup is showing.
   */
  var toggleVisible = function toggleVisible() {
    setIsVisible(true);
  };

  /**
   * Close color popup if visible.
   */
  var toggleClose = function toggleClose() {
    if (isVisible) {
      setIsVisible(false);
    }
  };
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__["default"], {
    className: "ajaxify-block-component-color-picker-wrapper"
  }, !!label && !hideLabelFromVision && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h3", {
    className: "ajaxify-block-color-component-label"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, label)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "ajaxify-block-component-color-picker"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "ajaxify-block-color-picker-area ajaxify-block-component-color-picker-palette"
  }, !isVisible && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('components-color-palette__item-wrapper components-circular-option-picker__option-wrapper ajaxify-block-color-picker-area ajaxify-block-component-color-picker-palette', value ? '' : 'components-color-palette__custom-color')
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__["default"], {
    text: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Choose Color', 'ajaxify-block')
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
    type: "button",
    "aria-expanded": isVisible,
    className: "components-button components-circular-option-picker__option is-pressed",
    onClick: toggleVisible,
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Custom color picker', 'ajaxify-block'),
    style: {
      background: getColor(color, opacity)
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
    className: "components-color-palette__custom-color-gradient"
  }))))), isVisible && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('components-color-palette__item-wrapper components-circular-option-picker__option-wrapper ajaxify-block-color-picker-area ajaxify-block-component-color-picker-palette', value ? '' : 'components-color-palette__custom-color')
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__["default"], {
    text: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Choose Color', 'ajaxify-block')
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
    type: "button",
    "aria-expanded": isVisible,
    className: "components-button components-circular-option-picker__option is-pressed",
    onClick: toggleClose,
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Custom color picker', 'ajaxify-block'),
    style: {
      background: getColor(color, opacity)
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
    className: "components-color-palette__custom-color-gradient"
  })))), isVisible && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__["default"], {
    className: "ajaxify-block-component-color-picker",
    onClose: toggleClose,
    noArrow: false,
    placement: "left-end",
    offset: 20
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__["default"], {
    key: colorKey
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_8__.LegacyAdapter, {
    key: colorKey,
    color: color,
    onChangeComplete: function onChangeComplete(newColor) {
      var maybeNewColor = getColor(newColor.hex, opacity);
      setColor(maybeNewColor);
      _onChange(slug, maybeNewColor);
    },
    disableAlpha: true,
    defaultValue: defaultColor
  })), alpha && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "ajaxify-block-component-color-opacity"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__["default"], {
    text: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Opacity', 'ajaxify-block')
  }, opacityIcon), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__["default"], {
    value: opacity,
    onChange: function onChange(opacityValue) {
      var newColor = getColor(color, opacityValue);
      setOpacity(opacityValue);
      setColor(newColor);
      _onChange(slug, newColor);
      onOpacityChange(opacityValue);
    },
    min: 0,
    max: 1,
    step: 0.01,
    initialPosition: 1
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__["default"], {
    className: "ajaxify-block-component-color-picker-palette"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__["default"], {
    colors: getDefaultColors(),
    value: color,
    onChange: function onChange(newColor) {
      var maybeNewColor = getColor(newColor);
      _onChange(slug, maybeNewColor);
      setColor(maybeNewColor);
    },
    disableCustomColors: true,
    clearable: false
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "components-color-clear-color"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__["default"], {
    onClick: function onClick() {
      _onChange(slug, defaultColor);
      setColor(defaultColor);
    }
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Clear Color', 'ajaxify-block')))))));
};
ColorPickerControl.propTypes = {
  label: (prop_types__WEBPACK_IMPORTED_MODULE_12___default().string),
  onChange: (prop_types__WEBPACK_IMPORTED_MODULE_12___default().func).isRequired,
  onOpacityChange: (prop_types__WEBPACK_IMPORTED_MODULE_12___default().func),
  value: (prop_types__WEBPACK_IMPORTED_MODULE_12___default().string),
  defaultColor: (prop_types__WEBPACK_IMPORTED_MODULE_12___default().string),
  alpha: (prop_types__WEBPACK_IMPORTED_MODULE_12___default().bool),
  hideLabelFromVision: (prop_types__WEBPACK_IMPORTED_MODULE_12___default().bool),
  defaultColors: (prop_types__WEBPACK_IMPORTED_MODULE_12___default().array).isRequired
};
ColorPickerControl.defaultProps = {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Color', 'ajaxify-block'),
  value: '',
  defaultColor: 'transparent',
  alpha: false,
  hideLabelFromVision: false,
  onOpacityChange: function onOpacityChange() {}
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ColorPickerControl);

/***/ }),

/***/ "./src/js/react/components/Alignment/editor.scss":
/*!*******************************************************!*\
  !*** ./src/js/react/components/Alignment/editor.scss ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

}]);
//# sourceMappingURL=src_js_react_components_Alignment_index_js-src_js_react_components_ColorPicker_index_js.js.map