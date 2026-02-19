# Real-Time Comment Form Validation - Technical Specification

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Execution Plan](#execution-plan)
4. [JavaScript Modules](#javascript-modules)
5. [Event Flow](#event-flow)
6. [Accessibility Considerations](#accessibility-considerations)
7. [Compatibility Risks & Mitigation](#compatibility-risks--mitigation)
8. [Phased Rollout Plan](#phased-rollout-plan)

---

## Overview

This document outlines the implementation plan for adding real-time validation to the WordPress comment form while maintaining **full compatibility** with WordPress core, themes, and third-party plugins. The validation system operates as a **progressive enhancement** layer that never modifies the original form structure.

### Core Principles

1. **WordPress HTML is the source of truth** - Never replace, rename, or re-render inputs
2. **Progressive enhancement** - Validation enhances UX but doesn't block native submission
3. **Fail open** - If JavaScript fails, native form submission still works
4. **Non-destructive markup** - Only inject adjacent elements for feedback
5. **Accessibility first** - ARIA attributes, screen reader support, keyboard navigation

---

## Architecture

### High-Level Design

```
┌─────────────────────────────────────────────────────────────┐
│                    WordPress Comment Form                    │
│  (Unmodified HTML - id, name, structure preserved)          │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Observed by
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Validation Observer Layer                       │
│  - Watches input changes                                     │
│  - Maintains internal state map                              │
│  - Triggers validation on events                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Updates
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Feedback Injection Layer                       │
│  - Injects validation messages (adjacent to inputs)         │
│  - Adds character counters                                   │
│  - Updates ARIA attributes                                   │
│  - Manages visual feedback                                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Validates via
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Validation Engine                               │
│  - Modular validators per field                              │
│  - Pluggable validation rules                                │
│  - Real-time validation logic                                │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Intercepts
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Form Submission Interceptor                      │
│  - Validates before AJAX submission                          │
│  - Blocks submission if invalid                              │
│  - Falls back to native if validation fails                 │
└─────────────────────────────────────────────────────────────┘
```

### Component Relationships

1. **Form Observer** → Monitors DOM for comment form, attaches event listeners
2. **State Manager** → Maintains internal map of field values and validity
3. **Validator Registry** → Contains validation rules per field type
4. **Feedback Renderer** → Injects and updates validation UI elements
5. **Submission Handler** → Integrates with existing `formSubmitHandler` in `wp-ajaxify-comments.js`

---

## Execution Plan

### Phase 1: Foundation Setup

#### Step 1.1: Create Module Structure
```
src/js/frontend/
├── validation/
│   ├── index.js              # Main entry point
│   ├── observer.js           # Form observer and event binding
│   ├── state-manager.js      # Internal state management
│   ├── validators.js         # Core validation logic
│   ├── feedback-renderer.js  # UI feedback injection
│   └── submission-handler.js # Submission validation
```

#### Step 1.2: Define Field Mappings
- Map WordPress comment form field names to validation rules:
  - `author` → Name validation
  - `email` → Email validation
  - `url` → URL validation (optional)
  - `comment` → Comment text validation
  - `comment_post_ID` → Hidden field (no validation)

#### Step 1.3: Create State Structure
```javascript
{
  fields: {
    'author': {
      value: '',
      isValid: null,  // null = not validated, true/false = validated
      errors: [],
      touched: false,
      element: HTMLElement,
      feedbackElement: HTMLElement
    },
    // ... other fields
  },
  formValid: false,
  isSubmitting: false
}
```

### Phase 2: Core Validation Logic

#### Step 2.1: Implement Base Validators
- **Name validator**: Required, min length, max length
- **Email validator**: Required, valid email format, WordPress email validation pattern
- **URL validator**: Optional, valid URL format if provided
- **Comment validator**: Required, min length, max length (WordPress limits)

#### Step 2.2: Create Validator Registry
- Centralized registry for field-to-validator mapping
- Support for custom validators via hooks
- Async validation support (future enhancement)

#### Step 2.3: Validation Timing Strategy
- **On blur**: Validate when user leaves field (reduces noise)
- **On change**: Validate after user starts typing (debounced, 300ms)
- **On submit**: Full form validation before submission
- **On paste**: Validate after paste events

### Phase 3: Feedback System

#### Step 3.1: Markup Injection Strategy
- Inject feedback elements **adjacent** to inputs (not inside)
- Use `insertAdjacentElement('afterend', element)` or `insertAdjacentElement('beforebegin', element)`
- Never modify input attributes directly (except ARIA)
- Use data attributes for tracking: `data-wpac-validation-id`

#### Step 3.2: Feedback Element Structure
```html
<!-- Original input (unchanged) -->
<input type="text" name="author" id="author" />

<!-- Injected feedback (adjacent) -->
<div class="wpac-validation-feedback" data-wpac-field="author" role="alert" aria-live="polite">
  <span class="wpac-validation-message wpac-validation-error">
    Please enter your name.
  </span>
  <span class="wpac-validation-counter">
    <span class="wpac-counter-current">0</span> / <span class="wpac-counter-max">245</span>
  </span>
</div>
```

#### Step 3.3: Visual Feedback States
- **Valid**: Green checkmark, success message (optional)
- **Invalid**: Red error message, error icon
- **Pending**: Loading spinner (for async validation)
- **Untouched**: No feedback until user interacts

### Phase 4: Integration with Existing Code

#### Step 4.1: Hook into Form Attachment
- Modify `WPAC.AttachForm()` to initialize validation after form attachment
- Ensure validation initializes after form is found in DOM
- Handle dynamic form replacement (after comment submission)

#### Step 4.2: Enhance Submission Handler
- Add validation check in `formSubmitHandler` before `event.preventDefault()`
- If validation fails, prevent AJAX submission
- Show validation errors, focus first invalid field
- Allow native submission as fallback if validation system fails

#### Step 4.3: Handle Form Replacement
- Re-initialize validation after `WPAC._ReplaceComments()` runs
- Preserve validation state if form data is re-injected
- Clean up old validation feedback before form replacement

### Phase 5: Accessibility Implementation

#### Step 5.1: ARIA Attributes
- `aria-invalid="true|false"` on inputs
- `aria-describedby` linking inputs to feedback messages
- `aria-live="polite"` on feedback containers
- `role="alert"` for error messages
- `aria-required="true"` for required fields

#### Step 5.2: Keyboard Navigation
- Ensure focus management when showing errors
- Tab order remains unchanged
- Escape key to dismiss validation messages (optional)

#### Step 5.3: Screen Reader Support
- Announce validation errors immediately
- Provide context for field requirements
- Announce success states (optional, less verbose)

### Phase 6: Styling & UX Polish

#### Step 6.1: CSS Architecture
- Namespace all styles: `.wpac-validation-*`
- Use CSS custom properties for theming
- Ensure styles don't conflict with theme styles
- Responsive design considerations

#### Step 6.2: Animation & Transitions
- Smooth transitions for feedback appearance
- Fade in/out for validation messages
- Subtle shake animation for errors (optional, accessible)

#### Step 6.3: Character Counters
- Show current/max characters for comment field
- Update in real-time
- Warn when approaching limit
- Visual indicator (progress bar, color change)

---

## JavaScript Modules

### Module: `validation/index.js`
**Purpose**: Main entry point, orchestrates all validation components

**Responsibilities**:
- Initialize validation system
- Coordinate between modules
- Expose public API
- Handle cleanup and re-initialization

**Public API**:
```javascript
WPAC.Validation = {
  init(formSelector),
  destroy(),
  validateField(fieldName),
  validateForm(),
  getState(),
  reset()
};
```

### Module: `validation/observer.js`
**Purpose**: Observes form and input changes, manages event listeners

**Responsibilities**:
- Find comment form in DOM
- Attach event listeners to inputs
- Handle dynamic form replacement
- Debounce input events
- Clean up listeners on destroy

**Key Functions**:
- `observeForm(formElement)`
- `attachFieldListeners(fieldElement)`
- `handleInputChange(event)`
- `handleInputBlur(event)`
- `handleFormSubmit(event)`

### Module: `validation/state-manager.js`
**Purpose**: Manages internal state of form fields and validation results

**Responsibilities**:
- Maintain state map of all fields
- Update field values on input changes
- Store validation results
- Track field interaction (touched/untouched)
- Provide state queries

**Key Functions**:
- `getFieldState(fieldName)`
- `updateFieldValue(fieldName, value)`
- `setFieldValidity(fieldName, isValid, errors)`
- `markFieldTouched(fieldName)`
- `isFormValid()`
- `resetState()`

### Module: `validation/validators.js`
**Purpose**: Contains validation rules and logic

**Responsibilities**:
- Define validation rules per field type
- Execute validation functions
- Return validation results with error messages
- Support custom validators via hooks

**Key Functions**:
- `validateName(value)`
- `validateEmail(value)`
- `validateURL(value)`
- `validateComment(value)`
- `getValidator(fieldName)`
- `registerValidator(fieldName, validatorFn)`

**Validation Rules**:
```javascript
{
  author: {
    required: true,
    minLength: 2,
    maxLength: 245,
    pattern: null
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    // WordPress email validation
  },
  comment: {
    required: true,
    minLength: 1,
    maxLength: 65525, // WordPress limit
  }
}
```

### Module: `validation/feedback-renderer.js`
**Purpose**: Injects and updates validation feedback UI

**Responsibilities**:
- Create feedback elements
- Inject adjacent to inputs
- Update feedback messages
- Manage character counters
- Update ARIA attributes
- Remove feedback on cleanup

**Key Functions**:
- `injectFeedback(fieldElement, fieldState)`
- `updateFeedback(fieldElement, fieldState)`
- `removeFeedback(fieldElement)`
- `updateARIA(fieldElement, fieldState)`
- `updateCounter(fieldElement, current, max)`

**Markup Injection Pattern**:
```javascript
// Find parent container (usually <p> tag in WordPress)
const parent = fieldElement.closest('p') || fieldElement.parentElement;

// Create feedback element
const feedback = document.createElement('div');
feedback.className = 'wpac-validation-feedback';
feedback.setAttribute('data-wpac-field', fieldName);
feedback.setAttribute('role', 'alert');
feedback.setAttribute('aria-live', 'polite');

// Inject after input
fieldElement.insertAdjacentElement('afterend', feedback);
```

### Module: `validation/submission-handler.js`
**Purpose**: Validates form before submission, integrates with existing handler

**Responsibilities**:
- Validate entire form before AJAX submission
- Prevent submission if invalid
- Focus first invalid field
- Show all validation errors
- Allow fallback to native submission

**Key Functions**:
- `validateBeforeSubmit(formElement)`
- `focusFirstInvalidField()`
- `showAllErrors()`
- `shouldAllowSubmission()`

**Integration Point**:
```javascript
// In wp-ajaxify-comments.js formSubmitHandler
const formSubmitHandler = function(event) {
  const form = jQuery(this);
  
  // NEW: Validate before proceeding
  if (!WPAC.Validation.validateForm()) {
    event.preventDefault();
    WPAC.Validation.focusFirstInvalidField();
    return;
  }
  
  // Existing code continues...
};
```

---

## Event Flow

### 1. DOM Ready / Form Attachment

```
DOM Ready
  │
  ├─> WPAC.Init()
  │     │
  │     └─> WPAC.AttachForm()
  │           │
  │           └─> WPAC.Validation.init('#commentform')
  │                 │
  │                 ├─> Observer.observeForm()
  │                 │     │
  │                 │     └─> Attach listeners to all inputs
  │                 │
  │                 ├─> StateManager.initialize()
  │                 │
  │                 └─> FeedbackRenderer.injectFeedbackElements()
```

### 2. Input Change Event

```
User types in input
  │
  ├─> Input 'input' event fires
  │     │
  │     └─> Observer.handleInputChange()
  │           │
  │           ├─> Debounce (300ms)
  │           │
  │           ├─> StateManager.updateFieldValue()
  │           │
  │           ├─> Validators.validateField()
  │           │     │
  │           │     └─> Returns { isValid, errors }
  │           │
  │           ├─> StateManager.setFieldValidity()
  │           │
  │           └─> FeedbackRenderer.updateFeedback()
  │                 │
  │                 ├─> Update message
  │                 ├─> Update ARIA attributes
  │                 └─> Update visual state
```

### 3. Input Blur Event

```
User leaves input field
  │
  ├─> Input 'blur' event fires
  │     │
  │     └─> Observer.handleInputBlur()
  │           │
  │           ├─> StateManager.markFieldTouched()
  │           │
  │           ├─> Validators.validateField()
  │           │
  │           ├─> StateManager.setFieldValidity()
  │           │
  │           └─> FeedbackRenderer.updateFeedback()
```

### 4. Form Submit Event

```
User clicks submit button
  │
  ├─> Form 'submit' event fires
  │     │
  │     ├─> Existing formSubmitHandler (wp-ajaxify-comments.js)
  │     │     │
  │     │     └─> NEW: SubmissionHandler.validateBeforeSubmit()
  │     │           │
  │     │           ├─> Validate all fields
  │     │           │     │
  │     │           │     └─> If invalid:
  │     │           │           ├─> event.preventDefault()
  │     │           │           ├─> Show all errors
  │     │           │           ├─> Focus first invalid field
  │     │           │           └─> Return false
  │     │           │
  │     │           └─> If valid:
  │     │                 └─> Continue with existing AJAX submission
  │     │
  │     └─> Fallback: If validation fails, native submission proceeds
```

### 5. AJAX Response Event

```
AJAX response received
  │
  ├─> Existing success/error handlers
  │     │
  │     ├─> On success:
  │     │     │
  │     │     └─> WPAC._ReplaceComments()
  │     │           │
  │     │           └─> NEW: WPAC.Validation.init() (re-initialize)
  │     │
  │     └─> On error:
  │           │
  │           └─> NEW: Show server-side validation errors
  │                 │
  │                 └─> Update field states with server errors
```

### 6. Form Replacement Event

```
Comments updated after submission
  │
  ├─> WPAC._ReplaceComments() completes
  │     │
  │     └─> Form replaced in DOM
  │           │
  │           └─> NEW: WPAC.Validation.destroy()
  │                 │
  │                 └─> NEW: WPAC.Validation.init()
  │                       │
  │                       └─> Re-observe new form
```

---

## Accessibility Considerations

### ARIA Implementation

#### Input Attributes
```html
<input 
  type="text" 
  name="author" 
  id="author"
  aria-invalid="false"
  aria-describedby="wpac-author-feedback"
  aria-required="true"
/>
```

#### Feedback Container
```html
<div 
  id="wpac-author-feedback"
  class="wpac-validation-feedback"
  role="alert"
  aria-live="polite"
  aria-atomic="true"
>
  <span class="wpac-validation-message">
    Please enter your name.
  </span>
</div>
```

### Screen Reader Announcements

1. **Error Announcement**: When validation fails, screen reader announces:
   - Field name
   - Error message
   - Current value (if applicable)

2. **Success Announcement** (optional, less verbose):
   - Only announce if user previously saw an error
   - "Name field is valid"

3. **Character Counter**:
   - Announce when approaching limit
   - "Comment field: 500 of 65525 characters remaining"

### Keyboard Navigation

1. **Tab Order**: Unchanged - validation doesn't affect tab order
2. **Focus Management**:
   - On submit error: Focus moves to first invalid field
   - On field error: Focus remains on current field (don't steal focus)
3. **Escape Key** (optional): Dismiss validation message

### Visual Indicators

1. **Error States**:
   - Red border on input (via CSS class, not inline style)
   - Error icon (SVG, accessible)
   - Error message text

2. **Success States**:
   - Green border (subtle)
   - Checkmark icon (optional)

3. **Focus Indicators**:
   - Ensure validation feedback doesn't interfere with focus styles
   - High contrast for error states

### Color Contrast

- Error text: WCAG AA compliant (4.5:1 contrast ratio)
- Success text: WCAG AA compliant
- Icons: Include text labels or sufficient contrast

---

## Compatibility Risks & Mitigation

### Risk 1: Theme Overrides `comments.php`

**Risk**: Theme may use custom field names, IDs, or structure

**Mitigation**:
- Use flexible selectors (name attributes, not IDs)
- Support WordPress core field names: `author`, `email`, `url`, `comment`
- Gracefully degrade if expected fields not found
- Provide filter for custom field mapping:
  ```javascript
  WPAC.Validation.fieldMappings = apply_filters(
    'wpac_validation_field_mappings',
    defaultMappings
  );
  ```

### Risk 2: Plugins Hook into `comment_form_*` Actions

**Risk**: Plugins may add custom fields or modify form structure

**Mitigation**:
- Only observe known WordPress core fields by default
- Provide hook for plugins to register custom fields:
  ```javascript
  document.addEventListener('wpacValidationRegisterField', (e) => {
    WPAC.Validation.registerField(e.detail.fieldName, e.detail.validator);
  });
  ```
- Don't assume form structure - use flexible DOM traversal

### Risk 3: Third-Party Scripts Rely on Input IDs/Names

**Risk**: Scripts may query inputs by ID or name

**Mitigation**:
- **Never modify** input `id`, `name`, or `value` attributes
- Only add/update ARIA attributes
- Use data attributes on feedback elements, not inputs
- Test with popular plugins (Akismet, reCAPTCHA, etc.)

### Risk 4: Form Replacement Breaks Validation

**Risk**: After comment submission, form is replaced, breaking event listeners

**Mitigation**:
- Re-initialize validation after `WPAC._ReplaceComments()`
- Use event delegation where possible
- Clean up old listeners before re-initialization
- Hook into `wpacAfterUpdateComments` event

### Risk 5: CSS Conflicts with Theme Styles

**Risk**: Theme styles may override validation feedback styles

**Mitigation**:
- Use high-specificity selectors: `.wpac-validation-feedback`
- Use `!important` sparingly, only for critical states
- Provide CSS custom properties for theming
- Namespace all classes with `wpac-` prefix

### Risk 6: JavaScript Errors Break Form Submission

**Risk**: Validation code error prevents form submission

**Mitigation**:
- Wrap all validation code in try-catch blocks
- Fail open: If validation fails, allow native submission
- Use feature detection before using APIs
- Provide fallback mode if validation can't initialize

### Risk 7: Performance Impact

**Risk**: Real-time validation may cause performance issues

**Mitigation**:
- Debounce input events (300ms)
- Throttle validation execution
- Use `requestAnimationFrame` for DOM updates
- Lazy load validation code if possible
- Minimize DOM queries

### Risk 8: Accessibility Regression

**Risk**: Adding validation may break screen reader experience

**Mitigation**:
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Follow WCAG 2.1 AA guidelines
- Use semantic HTML
- Provide text alternatives for icons
- Test keyboard navigation thoroughly

---

## Phased Rollout Plan

### Phase 1: MVP (Minimum Viable Product)

**Goal**: Basic real-time validation for core fields

**Features**:
- ✅ Validate `author`, `email`, `comment` fields
- ✅ Show error messages on blur
- ✅ Prevent submission if invalid
- ✅ Basic ARIA support
- ✅ Integration with existing form handler

**Deliverables**:
- Core validation modules
- Basic feedback rendering
- Submission validation
- Unit tests for validators

**Timeline**: 2-3 weeks

**Success Criteria**:
- Form validates before AJAX submission
- Error messages appear adjacent to inputs
- Screen readers announce errors
- Native submission still works if JS fails

### Phase 2: Enhanced UX

**Goal**: Improve user experience with real-time feedback

**Features**:
- ✅ Validate on input change (debounced)
- ✅ Character counters for comment field
- ✅ Visual feedback (icons, colors)
- ✅ Smooth animations
- ✅ Success states (optional)

**Deliverables**:
- Enhanced feedback renderer
- CSS styling
- Animation system
- Character counter component

**Timeline**: 1-2 weeks

**Success Criteria**:
- Validation happens as user types
- Character counter updates in real-time
- Visual feedback is clear and accessible
- Animations don't cause motion sickness

### Phase 3: Extensibility

**Goal**: Allow plugins/themes to extend validation

**Features**:
- ✅ Plugin API for custom validators
- ✅ JavaScript hooks/events
- ✅ Custom field support
- ✅ Validation rule customization
- ✅ Developer documentation

**Deliverables**:
- Plugin API documentation
- Hook system implementation
- Example integrations
- Developer guide

**Timeline**: 1-2 weeks

**Success Criteria**:
- Plugins can register custom validators
- Themes can customize validation rules
- Clear documentation for developers
- Example code provided

### Phase 4: Advanced Features (Optional)

**Goal**: Add advanced validation features

**Features**:
- ⚠️ Async validation (server-side checks)
- ⚠️ URL field validation
- ⚠️ Custom validation rules per field
- ⚠️ Validation presets (strict, lenient)
- ⚠️ React/Vanilla UI components (if needed)

**Deliverables**:
- Async validation system
- Advanced validator registry
- UI component library (if React chosen)
- Configuration options

**Timeline**: 2-3 weeks (optional)

**Success Criteria**:
- Server-side validation works
- Custom rules can be configured
- UI components are reusable
- Performance remains acceptable

---

## Implementation Checklist

### Foundation
- [ ] Create module structure
- [ ] Set up build configuration
- [ ] Define state structure
- [ ] Create field mappings

### Core Validation
- [ ] Implement name validator
- [ ] Implement email validator
- [ ] Implement comment validator
- [ ] Create validator registry
- [ ] Add validation timing logic

### Feedback System
- [ ] Create feedback element injector
- [ ] Implement message rendering
- [ ] Add character counter
- [ ] Update ARIA attributes
- [ ] Style feedback elements

### Integration
- [ ] Hook into form attachment
- [ ] Enhance submission handler
- [ ] Handle form replacement
- [ ] Re-initialize after AJAX

### Accessibility
- [ ] Add ARIA attributes
- [ ] Test with screen readers
- [ ] Ensure keyboard navigation
- [ ] Verify color contrast
- [ ] Add focus management

### Testing
- [ ] Unit tests for validators
- [ ] Integration tests
- [ ] Cross-browser testing
- [ ] Theme compatibility testing
- [ ] Plugin compatibility testing
- [ ] Accessibility testing

### Documentation
- [ ] Code comments
- [ ] Developer documentation
- [ ] User guide (if needed)
- [ ] Migration guide (if needed)

---

## Technical Notes

### WordPress Comment Form Structure

Standard WordPress comment form fields:
- `author` - Comment author name
- `email` - Comment author email
- `url` - Comment author website (optional)
- `comment` - Comment text
- `comment_post_ID` - Post ID (hidden)
- `comment_parent` - Parent comment ID (hidden, for threaded comments)

### Field Selectors

Use flexible selectors:
```javascript
// Good: Uses name attribute
const authorField = form.querySelector('input[name="author"]');

// Avoid: Hard-coded IDs
const authorField = form.querySelector('#author');
```

### Debouncing Strategy

```javascript
// Debounce validation on input
const debouncedValidate = debounce((fieldName, value) => {
  validateField(fieldName, value);
}, 300);

// Immediate validation on blur
input.addEventListener('blur', () => {
  validateField(fieldName, input.value);
});
```

### State Persistence

After form replacement, preserve user input:
- WordPress already handles this via `formData` in `WPAC._ReplaceComments()`
- Validation state should reset (fresh form = fresh validation)

### Error Message Localization

- Use WordPress i18n functions for error messages
- Provide filter for custom messages:
  ```php
  apply_filters('wpac_validation_error_message', $message, $field, $rule);
  ```

---

## Conclusion

This validation system is designed to be:
- **Non-invasive**: Never modifies WordPress form structure
- **Resilient**: Fails open, allows native submission
- **Accessible**: Full ARIA support, screen reader compatible
- **Extensible**: Plugin API for custom validators
- **Maintainable**: Modular architecture, clear separation of concerns

The phased approach allows for incremental development and testing, ensuring compatibility at each stage while building toward a robust, user-friendly validation system.

