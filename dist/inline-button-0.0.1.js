"use strict";
(self["webpackChunkwp_ajaxify_comments"] = self["webpackChunkwp_ajaxify_comments"] || []).push([["inline-button-0.0.1"],{

/***/ "./src/js/react/views/LazyLoad/inline-button.js":
/*!******************************************************!*\
  !*** ./src/js/react/views/LazyLoad/inline-button.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_hook_form__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-hook-form */ "./node_modules/react-hook-form/dist/index.esm.mjs");
/* harmony import */ var _fancyapps_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fancyapps/ui */ "./node_modules/@fancyapps/ui/dist/index.esm.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _components_Alignment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/Alignment */ "./src/js/react/components/Alignment/index.js");
/* harmony import */ var _components_ColorPicker__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../components/ColorPicker */ "./src/js/react/components/ColorPicker/index.js");
/* harmony import */ var _components_Notice__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../components/Notice */ "./src/js/react/components/Notice/index.js");










var defaultPalette = wpacAdminLazyLoad.palette;
var InlineButtonOptions = function InlineButtonOptions(props) {
  var control = props.control,
    errors = props.errors,
    setValue = props.setValue,
    getValues = props.getValues,
    clearErrors = props.clearErrors;
  var _getValues = getValues(),
    lazyLoadInlineButtonLabel = _getValues.lazyLoadInlineButtonLabel,
    lazyLoadInlineButtonLabelLoading = _getValues.lazyLoadInlineButtonLabelLoading,
    lazyLoadInlineButtonAppearance = _getValues.lazyLoadInlineButtonAppearance,
    lazyLoadInlineButtonUseThemeStyles = _getValues.lazyLoadInlineButtonUseThemeStyles,
    lazyLoadInlineButtonBackgroundColor = _getValues.lazyLoadInlineButtonBackgroundColor,
    lazyLoadInlineButtonBackgroundColorHover = _getValues.lazyLoadInlineButtonBackgroundColorHover,
    lazyLoadInlineButtonTextColor = _getValues.lazyLoadInlineButtonTextColor,
    lazyLoadInlineButtonTextColorHover = _getValues.lazyLoadInlineButtonTextColorHover,
    lazyLoadInlineButtonBorderColor = _getValues.lazyLoadInlineButtonBorderColor,
    lazyLoadInlineButtonBorderColorHover = _getValues.lazyLoadInlineButtonBorderColorHover,
    lazyLoadInlineButtonBorderWidth = _getValues.lazyLoadInlineButtonBorderWidth,
    lazyLoadInlineButtonBorderRadius = _getValues.lazyLoadInlineButtonBorderRadius,
    lazyLoadInlineButtonPaddingTop = _getValues.lazyLoadInlineButtonPaddingTop,
    lazyLoadInlineButtonPaddingRight = _getValues.lazyLoadInlineButtonPaddingRight,
    lazyLoadInlineButtonPaddingBottom = _getValues.lazyLoadInlineButtonPaddingBottom,
    lazyLoadInlineButtonPaddingLeft = _getValues.lazyLoadInlineButtonPaddingLeft,
    lazyLoadInlineButtonFontSize = _getValues.lazyLoadInlineButtonFontSize,
    lazyLoadInlineButtonLineHeight = _getValues.lazyLoadInlineButtonLineHeight,
    lazyLoadInlineButtonFontWeight = _getValues.lazyLoadInlineButtonFontWeight,
    lazyLoadInlineButtonFontFamily = _getValues.lazyLoadInlineButtonFontFamily,
    lazyLoadInlineButtonAlign = _getValues.lazyLoadInlineButtonAlign;
  var getInlineButton = function getInlineButton() {
    var styles = "\n\t\t\t.ajaxify-btn-reset.ajaxify-comments-loading-button {\n\t\t\t\t--ajaxify-comments-loading-button-background-color: ".concat(lazyLoadInlineButtonBackgroundColor, ";\n\t\t\t\t--ajaxify-comments-loading-button-background-color-hover: ").concat(lazyLoadInlineButtonBackgroundColorHover, ";\n\t\t\t\t--ajaxify-comments-loading-button-text-color: ").concat(lazyLoadInlineButtonTextColor, ";\n\t\t\t\t--ajaxify-comments-loading-button-text-color-hover: ").concat(lazyLoadInlineButtonTextColorHover, ";\n\t\t\t\t--ajaxify-comments-loading-button-border-color: ").concat(lazyLoadInlineButtonBorderColor, ";\n\t\t\t\t--ajaxify-comments-loading-button-border-color-hover: ").concat(lazyLoadInlineButtonBorderColorHover, ";\n\t\t\t\t--ajaxify-comments-loading-button-border-width: ").concat(lazyLoadInlineButtonBorderWidth, ";\n\t\t\t\t--ajaxify-comments-loading-button-border-radius: ").concat(lazyLoadInlineButtonBorderRadius, ";\n\t\t\t\t--ajaxify-comments-loading-button-padding-top: ").concat(lazyLoadInlineButtonPaddingTop, ";\n\t\t\t\t--ajaxify-comments-loading-button-padding-right: ").concat(lazyLoadInlineButtonPaddingRight, ";\n\t\t\t\t--ajaxify-comments-loading-button-padding-bottom: ").concat(lazyLoadInlineButtonPaddingBottom, ";\n\t\t\t\t--ajaxify-comments-loading-button-padding-left: ").concat(lazyLoadInlineButtonPaddingLeft, ";\n\t\t\t\t--ajaxify-comments-loading-button-font-size: ").concat(lazyLoadInlineButtonFontSize, "px;\n\t\t\t\t--ajaxify-comments-loading-button-line-height: ").concat(lazyLoadInlineButtonLineHeight, ";\n\t\t\t\t--ajaxify-comments-loading-button-font-weight: ").concat(lazyLoadInlineButtonFontWeight, ";\n\t\t\t\t--ajaxify-comments-loading-button-font-family: ").concat(lazyLoadInlineButtonFontFamily, ";\n\t\t\t}");
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("style", null, styles), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
      className: classnames__WEBPACK_IMPORTED_MODULE_4___default()('ajaxify-btn-reset ajaxify-comments-loading-button', {
        'ajaxify-is-solid': 'solid' === lazyLoadInlineButtonAppearance,
        'ajaxify-is-transparent': 'transparent' === lazyLoadInlineButtonAppearance
      }),
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Load Comments', 'wp-ajaxify-comments')
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Load Comments', 'wp-ajaxify-comments')));
  };

  /**
   * Retrieve the button options.
   */
  var getButtonOptions = function getButtonOptions() {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("table", {
      className: "form-table form-table-row-sections"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tbody", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("th", {
      scope: "row"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Button Options', 'wp-ajaxify-comments')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-admin__control-row"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_hook_form__WEBPACK_IMPORTED_MODULE_8__.Controller, {
      name: "lazyLoadInlineButtonLabel",
      control: control,
      rules: {
        required: true
      },
      render: function render(_ref) {
        var _ref$field = _ref.field,
          _onChange = _ref$field.onChange,
          value = _ref$field.value;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Button Label', 'wp-ajaxify-comments'),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('The label of the button.', 'wp-ajaxify-comments'),
          value: value,
          onChange: function onChange(e) {
            clearErrors('lazyLoadInlineButtonLabel');
            _onChange(e);
          }
        }), errors.lazyLoadInlineButtonLabel && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_Notice__WEBPACK_IMPORTED_MODULE_7__["default"], {
          status: "error",
          text: errors.lazyLoadInlineButtonLabel.message
        }));
      }
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-admin__control-row"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_hook_form__WEBPACK_IMPORTED_MODULE_8__.Controller, {
      name: "lazyLoadInlineButtonLabelLoading",
      control: control,
      render: function render(_ref2) {
        var _ref2$field = _ref2.field,
          onChange = _ref2$field.onChange,
          value = _ref2$field.value;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Loading Label', 'wp-ajaxify-comments'),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('The label of the button when loading.', 'wp-ajaxify-comments'),
          value: value,
          onChange: onChange
        }));
      }
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-admin__control-row"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_hook_form__WEBPACK_IMPORTED_MODULE_8__.Controller, {
      name: "lazyLoadInlineButtonUseThemeStyles",
      control: control,
      render: function render(_ref3) {
        var _ref3$field = _ref3.field,
          onChange = _ref3$field.onChange,
          value = _ref3$field.value;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Use Theme Styles', 'wp-ajaxify-comments'),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Use the theme styles for the button. Switch off to use the button designer.', 'wp-ajaxify-comments'),
          checked: value,
          onChange: onChange
        }));
      }
    })))))));
  };

  // Get button preview wrapper classes.
  var buttonWrapperClasses = classnames__WEBPACK_IMPORTED_MODULE_4___default()('ajaxify-button-designer__preview', {
    'ajaxify-align-left': 'left' === lazyLoadInlineButtonAlign,
    'ajaxify-align-center': 'center' === lazyLoadInlineButtonAlign,
    'ajaxify-align-right': 'right' === lazyLoadInlineButtonAlign
  });
  var getButtonDesigner = function getButtonDesigner() {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-button-designer"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-button-designer__header"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h3", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Button Designer', 'wp-ajaxify-comments'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-button-designer__body"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: buttonWrapperClasses
    }, getInlineButton()), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-button-designer__sidebar"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-button-designer__sidebar-body"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Appearance', 'wp-ajaxify-comments'),
      initialOpen: true
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-admin__control-row"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.BaseControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Button Style', 'wp-ajaxify-comments'),
      id: "ajaxify-button-designer__button-style"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ButtonGroup, {
      className: "ajaxify-button-designer__button-group"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
      variant: "secondary",
      isPressed: 'solid' === lazyLoadInlineButtonAppearance,
      onClick: function onClick() {
        setValue('lazyLoadInlineButtonAppearance', 'solid');
      }
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Solid', 'wp-ajaxify-comments')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
      variant: "secondary",
      isPressed: 'transparent' === lazyLoadInlineButtonAppearance,
      onClick: function onClick() {
        setValue('lazyLoadInlineButtonAppearance', 'transparent');
      }
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Transparent', 'wp-ajaxify-comments'))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-admin__control-row"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_hook_form__WEBPACK_IMPORTED_MODULE_8__.Controller, {
      name: "lazyLoadInlineButtonAlign",
      control: control,
      render: function render(_ref4) {
        var _ref4$field = _ref4.field,
          onChange = _ref4$field.onChange,
          value = _ref4$field.value;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_Alignment__WEBPACK_IMPORTED_MODULE_5__["default"], {
          alignment: value,
          onClick: onChange,
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Layout Alignment', 'wp-ajaxify-comments'),
          alignLeftLabel: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Left', 'wp-ajaxify-comments'),
          alignCenterLabel: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Center', 'wp-ajaxify-comments'),
          alignRightLabel: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Right', 'wp-ajaxify-comments'),
          leftOn: true,
          centerOn: true,
          rightOn: true
        }));
      }
    }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Colors', 'wp-ajaxify-comments'),
      initialOpen: true
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-admin__control-row"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_hook_form__WEBPACK_IMPORTED_MODULE_8__.Controller, {
      name: "lazyLoadInlineButtonBackgroundColor",
      control: control,
      render: function render(_ref5) {
        var _ref5$field = _ref5.field,
          _onChange2 = _ref5$field.onChange,
          value = _ref5$field.value;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_ColorPicker__WEBPACK_IMPORTED_MODULE_6__["default"], {
          value: value,
          key: 'inline-button-background-color',
          onChange: function onChange(slug, newValue) {
            _onChange2(newValue);
          },
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Background Color', 'wp-ajaxify-comments'),
          defaultColors: defaultPalette,
          defaultColor: '#000000',
          slug: 'inline-button-background-color'
        }));
      }
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-admin__control-row"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_hook_form__WEBPACK_IMPORTED_MODULE_8__.Controller, {
      name: "lazyLoadInlineButtonBackgroundColorHover",
      control: control,
      render: function render(_ref6) {
        var _ref6$field = _ref6.field,
          _onChange3 = _ref6$field.onChange,
          value = _ref6$field.value;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_ColorPicker__WEBPACK_IMPORTED_MODULE_6__["default"], {
          value: value,
          key: 'inline-button-background-color-hover',
          onChange: function onChange(slug, newValue) {
            _onChange3(newValue);
          },
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Background Color on Hover', 'wp-ajaxify-comments'),
          defaultColors: defaultPalette,
          defaultColor: '#000000',
          slug: 'inline-button-background-color-hover'
        }));
      }
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-admin__control-row"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_hook_form__WEBPACK_IMPORTED_MODULE_8__.Controller, {
      name: "lazyLoadInlineButtonTextColor",
      control: control,
      render: function render(_ref7) {
        var _ref7$field = _ref7.field,
          _onChange4 = _ref7$field.onChange,
          value = _ref7$field.value;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_ColorPicker__WEBPACK_IMPORTED_MODULE_6__["default"], {
          value: value,
          key: 'inline-button-text-color',
          onChange: function onChange(slug, newValue) {
            _onChange4(newValue);
          },
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Text Color', 'wp-ajaxify-comments'),
          defaultColors: defaultPalette,
          defaultColor: '#000000',
          slug: 'inline-button-text-color'
        }));
      }
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-admin__control-row"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_hook_form__WEBPACK_IMPORTED_MODULE_8__.Controller, {
      name: "lazyLoadInlineButtonTextColorHover",
      control: control,
      render: function render(_ref8) {
        var _ref8$field = _ref8.field,
          _onChange5 = _ref8$field.onChange,
          value = _ref8$field.value;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_ColorPicker__WEBPACK_IMPORTED_MODULE_6__["default"], {
          value: value,
          key: 'inline-button-text-color-hover',
          onChange: function onChange(slug, newValue) {
            _onChange5(newValue);
          },
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Text Color on Hover', 'wp-ajaxify-comments'),
          defaultColors: defaultPalette,
          defaultColor: '#000000',
          slug: 'inline-button-text-color-hover'
        }));
      }
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-admin__control-row"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_hook_form__WEBPACK_IMPORTED_MODULE_8__.Controller, {
      name: "lazyLoadInlineButtonBorderColor",
      control: control,
      render: function render(_ref9) {
        var _ref9$field = _ref9.field,
          _onChange6 = _ref9$field.onChange,
          value = _ref9$field.value;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_ColorPicker__WEBPACK_IMPORTED_MODULE_6__["default"], {
          value: value,
          key: 'inline-button-border-color',
          onChange: function onChange(slug, newValue) {
            _onChange6(newValue);
          },
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Border Color', 'wp-ajaxify-comments'),
          defaultColors: defaultPalette,
          defaultColor: '#000000',
          slug: 'inline-button-border-color'
        }));
      }
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-admin__control-row"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_hook_form__WEBPACK_IMPORTED_MODULE_8__.Controller, {
      name: "lazyLoadInlineButtonBorderColorHover",
      control: control,
      render: function render(_ref10) {
        var _ref10$field = _ref10.field,
          _onChange7 = _ref10$field.onChange,
          value = _ref10$field.value;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_ColorPicker__WEBPACK_IMPORTED_MODULE_6__["default"], {
          value: value,
          key: 'inline-button-border-color-hover',
          onChange: function onChange(slug, newValue) {
            _onChange7(newValue);
          },
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Border Color on Hover', 'wp-ajaxify-comments'),
          defaultColors: defaultPalette,
          defaultColor: '#000000',
          slug: 'inline-button-border-color-hover'
        }));
      }
    }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Spacing', 'wp-ajaxify-comments'),
      initialOpen: false
    }, "Spacing"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Colors', 'wp-ajaxify-comments'),
      initialOpen: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "ajaxify-admin__control-row"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_hook_form__WEBPACK_IMPORTED_MODULE_8__.Controller, {
      name: "lazyLoadInlineButtonBackgroundColor",
      control: control,
      render: function render(_ref11) {
        var _ref11$field = _ref11.field,
          _onChange8 = _ref11$field.onChange,
          value = _ref11$field.value;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_ColorPicker__WEBPACK_IMPORTED_MODULE_6__["default"], {
          value: value,
          key: 'inline-button-background-color',
          onChange: function onChange(slug, newValue) {
            _onChange8(newValue);
          },
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Background Color', 'wp-ajaxify-comments'),
          defaultColors: defaultPalette,
          defaultColor: '#000000',
          slug: 'inline-button-background-color',
          alpha: true
        }));
      }
    }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Spacing', 'wp-ajaxify-comments'),
      initialOpen: false
    }, "Spacing"))))));
  };
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, getButtonOptions(), !getValues('lazyLoadInlineButtonUseThemeStyles') && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, getButtonDesigner()));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (InlineButtonOptions);

/***/ })

}]);
//# sourceMappingURL=inline-button-0.0.1.js.map