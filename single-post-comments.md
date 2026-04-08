# Multiple posts with comments on one page

This guide is for sites that show **more than one post's full content and comment form on a single WordPress screen** (for example a custom page that loops posts, or a “reader” layout). Ajaxify Comments works best on a normal single post or page; multi-post layouts need one of the two paths below.

## Two supported paths (pick one)

### Path 1 — Post container + unique `id` on each wrapper

Use **Selectors → Advanced Selectors → Post Container Selector** so it matches every post wrapper (for example `article.multi-post-item`). **Each** matched element **must** have a **unique `id`** attribute (for example `id="post-<?php the_ID(); ?>"`). The plugin registers handlers per wrapper and scopes **every** comma-separated selector segment under that id (so `#post-123 #commentform, .comment-form` becomes `#post-123 #commentform, #post-123 .comment-form` internally).

Best when you control the loop markup and can output stable ids.

### Path 2 — Ancestor-scoped selectors (Post container **empty**)

If wrappers only share a **class** (no unique id per post) but each post repeats the same inner structure (for example the same `#comment-form` or `#respond` inside every `article`), leave **Post Container Selector** **empty** and use **one** selector string that repeats the wrapper before the inner target:

| Setting | Example |
|--------|---------|
| Comment form | `article.my-class #comment-form` |
| Comments container | `article.my-class #comments` or `article.my-class .comments-area` |
| Respond container | `article.my-class #respond` or `article.my-class .comment-respond` |
| Paging links | `article.my-class #comments nav a` (adjust to your theme) |
| Comment links | `article.my-class #comments a[href*="/comment-page-"]` (adjust to match theme) |

jQuery matches **each** wrapper’s subtree. One `AttachForm()` covers all posts.

**HTML note:** Duplicate `id` values are invalid HTML, but many themes do it inside a loop; this pattern is still the practical way to target those forms until markup is fixed to use classes.

**List pages:** If you stay on one URL for the whole list, enable **Use current page URL for comment refresh** (Advanced Selectors) and pair with a sensible `comment_post_redirect` (see below).

## What you should know

- After someone submits a comment, WordPress redirects the browser to a “thank you” URL (usually the post permalink with `#comment-123`). The plugin intercepts that flow with AJAX and then **fetches HTML** from the redirect URL to refresh the comment area.
- If you want visitors to **stay on the same list page** instead of jumping to each post's permalink, you must make sure the **redirect URL** and **selectors** match that list page. The plugin can use **Use current page URL for comment refresh** so the address bar and scroll logic use the page you are on.
- Duplicate `#comments` / `#respond` IDs across posts are invalid HTML; Path 2 works around that with a repeating wrapper in the selector; Path 1 scopes each segment under a unique wrapper id.

## User-friendly checklist

1. Choose **Path 1** or **Path 2** (see above).
2. **Path 1:** Wrap each post in a container with a unique `id`; set Post Container Selector; use comma-separated inner selectors as needed (each segment is scoped per post).
3. **Path 2:** Leave Post Container empty; prefix comments/form/respond/paging selectors with the same repeating wrapper (e.g. `article.my-class …`).
4. If comments should not send users to the single post URL, use `comment_post_redirect` (see below) and consider **Use current page URL for comment refresh**.
5. Test with **Debug** enabled and the browser console open if anything sticks on “Reloading page” or errors appear.

## Technical steps

### 1. Markup: one wrapper per post

**Path 1** example:

```html
<article id="post-123" class="multi-post-entry">
  <!-- title, content, comments template -->
</article>
```

**Path 2** example (class-only wrapper):

```html
<article class="my-class">
  <!-- theme may repeat #comment-form here -->
</article>
```

### 2. Selectors (Ajaxify Comments → Selectors)

**Path 1** with Post Container set:

- Inner selectors can mix ids and classes; every comma-separated part is prefixed with `#your-wrapper-id` for each matched post container.
- Follow the Post Container field help: avoid a single global id unless it exists once per wrapper.

**Path 2** with Post Container empty:

- Use the same outer selector on form, comments area, respond, and paging so each matches only inside one post card.

### 3. Stay on the list page: `comment_post_redirect`

WordPress filters the redirect URL with `comment_post_redirect`. Return an **absolute URL** to your list page (including any query args you need). Fragment-only values (e.g. `#comment-5` alone) are not valid redirect targets for the plugin's URL handling.

Example pattern:

```php
add_filter(
	'comment_post_redirect',
	function ( $location, $comment ) {
		// Replace with the real URL of your “all posts on one page” template.
		$list_page_url = home_url( '/your-list-page/' );
		return add_query_arg( 'comment-posted', (int) $comment->comment_post_ID, $list_page_url );
	},
	5,
	2
);
```

Use a priority **earlier than** the plugin's redirect hook if you need to override its appended query parameters, or **later** if you want the plugin's `WPACUrl` / `WPACUnapproved` parameters to remain on your custom URL (the plugin runs on `comment_post_redirect` at default priority 10).

### 4. “Use current page URL for comment refresh” (setting)

When enabled (Selectors → Advanced Selectors), after a successful AJAX comment post the plugin uses **`window.location.href`** for URL updates, scroll target extraction, and safe fallbacks instead of only the `X-WPAC-URL` response header.

**When it helps**

- Custom list or archive-like pages where you force the redirect back to the current page.
- **Path 2** multi-post layouts where the browser URL should stay the list page.

**When you might leave it off**

- Standard single post templates where the default redirect URL and header already match the page you are updating.

### 5. Server header: `X-WPAC-URL` (how it fits together)

When a comment is posted, WordPress responds with a redirect. The plugin’s PHP callback `wpac_comment_post_redirect` adds query arguments to that redirect, including **`WPACUrl`**, which carries the redirect target (the page WordPress decided you should land on, before those extra args were added). The browser (or jQuery’s XHR) follows the redirect and loads that URL.

On that **final** GET request, `wpac_init()` looks for `WPACUrl` in the query string. If it is valid, WordPress sends a response header **`X-WPAC-URL`** with the normalized address. The frontend script reads this header so it can:

- Match DOM replacement and fallbacks to the same URL the server used.
- Update the address bar and scroll to `#comment-…` when those features are enabled.

**Why normalization matters:** Some filters or setups return a **relative** path (for example `/my-page/`). Browsers resolve that fine for navigation, but the script uses `URL()` in JavaScript, which needs an **absolute** URL unless a base is provided. The plugin resolves relative and scheme-relative values on the server when building `X-WPAC-URL`, and uses a single resolver on the client with fallbacks so invalid values do not leave the UI stuck on “Reloading page.”

**Developer override:** After normalization, the value is passed through:

`apply_filters( 'dlxplugins/ajaxify/comments/x_wpac_url', $normalized_url, $raw_url_from_request );`

Return an empty string from the filter to omit the header (the JS side will still fall back to the current page where appropriate). Return another absolute URL only if you know it matches the HTML being returned for that request.

### 6. Centralized URL resolution in JavaScript

The frontend resolves URLs with a single helper so relative paths, scheme-relative URLs, and bad values do not trigger `Failed to construct 'URL'` and leave the overlay stuck. Invalid inputs fall back to the current page where possible, and hard reload fallbacks use the same logic.

### 7. Comma-separated selectors and `:not()`

Post-container scoping splits selectors on commas. If you use complex selectors with commas **inside** parentheses (for example `:not(.a, .b)`), split logic may break; prefer simpler selectors or avoid commas inside such pseudo-classes for Path 1.

## Troubleshooting

| Symptom | Things to check |
|--------|------------------|
| Redirect goes to single post | Your `comment_post_redirect` filter, theme, or another plugin overriding redirect. |
| Overlay stuck on “Reloading page” + URL error in console | Often a relative or invalid URL in a fallback path; ensure redirects return absolute URLs. |
| Wrong comment list updates | Selectors not scoped per post; Path 2 missing wrapper prefix on one field. |
| Only one form works on Path 1 | Wrapper missing `id`; or old behavior—ensure plugin version scopes every comma segment. |
| Script not loading on the custom page | `dlxplugins/ajaxify/scripts/load` filter or “Enable by URL regex” style settings may need to allow that URL. |

## Related reading

- [Selectors overview](https://docs.dlxplugins.com/v/ajaxify-comments/advanced/selectors) (DLX docs)
- Plugin settings: **Selectors** tab → **Advanced Selectors** → Post Container Selector and **Use current page URL for comment refresh**
