# Setup Wizard Plan

## Overview
A setup wizard that automatically detects and configures comment selectors for Ajaxify Comments. The wizard will be accessible from the Home tab in the admin panel, under the "Ajaxify Status" section.

## Location
- **Admin Tab**: Home
- **Section**: Ajaxify Status (around line 237 in `src/js/react/views/Home/home.js`)
- **UI Component**: Button/link that opens a SweetAlert2 modal

## Architecture

### Frontend (React/JavaScript)

#### 1. Home Tab Integration
**File**: `src/js/react/views/Home/home.js`

- Add a button/link in the "Ajaxify Status" table row (after the ToggleControl for "Enable Ajaxify Comments")
- Button text: "Run Setup Wizard" or "Auto-Configure Selectors"
- Button should trigger the wizard modal when clicked
- Use SweetAlert2 (already available in the codebase) for the modal interface

#### 2. Wizard Modal Flow
**File**: `src/js/react/views/Home/home.js` (or separate utility file)

The wizard will follow this flow:

1. **Initial Modal**
   - Title: "Ajaxify Comments Setup Wizard"
   - Text: "Let's automatically detect and configure your comment selectors."
   - Shows loading state
   - Fetches endpoint: `wpac_wizard_find_post`

2. **Post Finding Phase**
   - Endpoint searches for a post with:
     - Comments open (`comment_status = 'open'`)
     - At least one approved comment
   - If found, proceed to DOM analysis
   - If not found, show error with instructions

3. **DOM Analysis Phase**
   - Endpoint: `wpac_wizard_analyze_post`
   - Fetches the post HTML (server-side)
   - Parses DOM using PHP DOMDocument
   - Analyzes selectors (similar to menu-helper.js logic, but server-side)
   - Returns found selectors

4. **Success Screen**
   - If all 6 selectors found:
     - Show success modal with found selectors in a table
     - Allow user to confirm and save
     - Save selectors via `wpac_wizard_save_selectors` endpoint
     - Show final success message

5. **Failure Screen**
   - If not all selectors found:
     - Show error modal with:
       - List of missing selectors
       - Button to enable Menu Helper (toggles `menuHelper` option)
       - Links to documentation:
         - Menu Helper Guide: `https://docs.dlxplugins.com/v/ajaxify-comments/first-time-users/menu-helper`
         - Getting Started Guide: `https://docs.dlxplugins.com/v/ajaxify-comments/first-time-users/getting-started`
       - Option to try again

### Backend (PHP)

#### 1. AJAX Endpoint Registration
**File**: `php/Admin/Init.php`

Add three new AJAX actions:
- `wp_ajax_wpac_wizard_find_post` → `ajax_wizard_find_post()`
- `wp_ajax_wpac_wizard_analyze_post` → `ajax_wizard_analyze_post()`
- `wp_ajax_wpac_wizard_save_selectors` → `ajax_wizard_save_selectors()`

#### 2. Find Post Endpoint
**Method**: `ajax_wizard_find_post()`

**Logic**:
```php
// Security check: nonce + manage_options capability
// Query for posts with:
//   - comment_status = 'open'
//   - post_status = 'publish'
//   - Has at least one approved comment
// Return first matching post ID, permalink, and title
// If none found, return error with helpful message
```

**Response Format**:
```json
{
  "success": true,
  "data": {
    "postId": 123,
    "permalink": "https://example.com/post",
    "title": "Post Title"
  }
}
```

#### 3. Analyze Post Endpoint
**Method**: `ajax_wizard_analyze_post()`

**Logic**:
```php
// Security check: nonce + manage_options capability
// Get post ID from request
// Fetch post permalink
// Use wp_remote_get() to fetch the post HTML
// Parse HTML using DOMDocument
// Analyze DOM for selectors (replicate menu-helper.js logic)
// Return found selectors array
```

**Selector Detection Logic** (server-side replication of `menu-helper.js`):

The following selectors need to be detected:

1. **Comments Container** (`selectorCommentsContainer`)
   - Selectors to check: `.wp-block-comments`, `#comments`, `.comments-wrapper`, `.comments`, `.comments-area`, `#comment-wrap`, `.et_pb_comments_module`
   - Validation: Must have children, not a heading, not UL/OL, contains UL/OL or #respond or form or .comment

2. **Comment List** (`selectorCommentList`)
   - Selectors to check: `.commentlist`, `.comment-list`, `.comment-list-wrapper`, `.comment-list-container`, `.ast-comment-list`, `.wp-block-comment-template`, `#comments ul`, `#comments ol`
   - Validation: Contains `li` or `.comment` elements, or is UL/OL tag

3. **Comment Form** (`selectorCommentForm`)
   - Selectors to check: `#commentform`, `.comment-form`, `#ast-commentform`, `.commentform`, `#respond form`
   - Validation: Element is a `form` tag

4. **Respond Container** (`selectorRespondContainer`)
   - Selectors to check: `#respond`, `.comment-respond`, `.wp-block-post-comments-form`
   - Validation: Element exists

5. **Comment Textarea** (`selectorTextarea`)
   - Selectors to check: `#comment`, `#respond textarea`, `textarea[name="comment"]`
   - Validation: Element is a `textarea` tag

6. **Submit Button** (`selectorSubmitButton`)
   - Selectors to check: `#submit`, `#et_pb_submit`, `#respond button[type="submit"]`, `#respond input[type="submit"]`, `.form-submit input[type="submit"]`, `.wp-block-post-comments-form input[type="submit"]`
   - Validation: Element is `button` or `input` tag

**Response Format**:
```json
{
  "success": true,
  "data": {
    "selectors": [
      {
        "selector": "#comments",
        "selectorOptionName": "selectorCommentsContainer",
        "selectorLabel": "Comments Container"
      },
      // ... more selectors
    ],
    "foundCount": 6,
    "totalRequired": 6
  }
}
```

#### 4. Save Selectors Endpoint
**Method**: `ajax_wizard_save_selectors()`

**Logic**:
```php
// Security check: nonce + manage_options capability
// Get selectors array from request (JSON)
// Sanitize each selector
// Get existing options
// Merge selectors into options
// Update options using Options::update_options()
// Return success/error response
```

**Response Format**:
```json
{
  "success": true,
  "data": {
    "title": "Selectors Saved",
    "message": "Your selectors have been automatically configured. You can now enable Ajaxify Comments."
  }
}
```

### Selector Detection Algorithm (PHP)

The server-side selector detection should replicate the logic from `src/js/frontend/menu-helper.js`:

1. **Load HTML**: Use `wp_remote_get()` to fetch the post permalink
2. **Parse DOM**: Use `DOMDocument` to parse the HTML
3. **Query Elements**: Use `DOMXPath` for complex queries
4. **Validate**: Check element properties (tagName, children, etc.)
5. **Return**: Return first matching selector for each type

**Important Considerations**:
- Handle malformed HTML gracefully
- Filter out script/style tags before parsing
- Consider theme-specific selectors
- Log errors for debugging

### Error Handling

#### No Post Found
- Show modal with:
  - Error message explaining no suitable post found
  - Instructions to:
    1. Create a post with comments enabled
    2. Add at least one comment
    3. Try the wizard again
  - Link to documentation

#### Partial Selectors Found
- Show modal with:
  - List of found selectors (success indicators)
  - List of missing selectors (error indicators)
  - Options:
    1. Enable Menu Helper (toggle)
    2. View documentation links
    3. Try again
    4. Cancel

#### Network/Parse Errors
- Show generic error modal
- Suggest enabling Menu Helper as alternative
- Provide support link

### UI/UX Considerations

1. **Loading States**
   - Show loading spinner during all async operations
   - Use SweetAlert2's built-in loading state

2. **Progress Indication**
   - Step 1: Finding post...
   - Step 2: Analyzing post...
   - Step 3: Saving selectors...

3. **Success Feedback**
   - Show table of found selectors before saving
   - Confirmation before saving
   - Success message after saving
   - Option to enable Ajaxify Comments immediately

4. **Error Recovery**
   - Clear error messages
   - Actionable next steps
   - Easy retry mechanism

### Integration Points

1. **Menu Helper Toggle**
   - Wizard should be able to enable Menu Helper programmatically
   - Use existing `wpac_save_options` endpoint or create wizard-specific save

2. **Options Management**
   - Use `Options::get_options()` and `Options::update_options()`
   - Follow existing sanitization patterns

3. **Nonce Management**
   - Create nonces for each wizard endpoint
   - Use existing nonce patterns from `Admin/Init.php`

### Localization

All strings should be translatable:
- Use `__()` for PHP strings
- Use `@wordpress/i18n` `__()` for JavaScript strings
- Text domain: `'wp-ajaxify-comments'`

### Security

1. **Nonce Verification**: All endpoints must verify nonces
2. **Capability Check**: All endpoints must check `current_user_can( 'manage_options' )`
3. **Input Sanitization**: All inputs must be sanitized
4. **Output Escaping**: All outputs must be escaped
5. **Remote Request Validation**: Validate fetched HTML before parsing

### Testing Considerations

1. **Test Scenarios**:
   - Post with all selectors present
   - Post with missing selectors
   - Post with comments closed
   - Post with no comments
   - Network errors during HTML fetch
   - Malformed HTML

2. **Edge Cases**:
   - Custom themes with non-standard selectors
   - Block themes (Gutenberg)
   - Classic themes
   - Divi/Astra/other popular themes

### Documentation Links

- Menu Helper Guide: `https://docs.dlxplugins.com/v/ajaxify-comments/first-time-users/menu-helper`
- Getting Started: `https://docs.dlxplugins.com/v/ajaxify-comments/first-time-users/getting-started`
- Support: `https://dlxplugins.com/support/?product=Ajaxify Comments`

### Implementation Order

1. **Phase 1**: Backend endpoints
   - Create `ajax_wizard_find_post()`
   - Create `ajax_wizard_analyze_post()`
   - Create `ajax_wizard_save_selectors()`
   - Test endpoints independently

2. **Phase 2**: Frontend integration
   - Add button to Home tab
   - Create wizard modal flow
   - Integrate with endpoints
   - Handle success/error states

3. **Phase 3**: Polish
   - Add loading states
   - Improve error messages
   - Add documentation links
   - Test with various themes

### Files to Create/Modify

**New Files**:
- None (all functionality in existing files)

**Modified Files**:
1. `php/Admin/Init.php` - Add AJAX endpoints
2. `src/js/react/views/Home/home.js` - Add wizard button and modal logic
3. `src/js/react/views/Home/index.js` - Potentially add SweetAlert2 import if needed

**Dependencies**:
- SweetAlert2 (already available)
- WordPress AJAX infrastructure (already in place)
- Options class (already exists)

### Notes

- The wizard is a convenience feature; users can still manually configure selectors
- Menu Helper remains the primary method for selector detection on the frontend
- The wizard complements Menu Helper by providing server-side detection
- Consider caching analyzed results to avoid re-fetching the same post multiple times

