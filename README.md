# MPA Enhancer

Minimalist JavaScript to make your MPA work that much better

On reloading of a page will scroll back to where the user left off and focus on
the last element they were looking at.

At 1.1 kB of minified JavaScript.

[Example TODO MVC application.](https://jon49.github.io/mpa-enhancer/todo/)

## Docs

Install by downloading and linking to the script. You can use NPM too and copy
it from there.

### Attributes

These attributes can enable the enhancer to make special accommodation to your
pages.

`mpa-page-name`: This overrides the default page name (the pathname in your
URL). Use it like so:

```html
<body mpa-page-name="my-page-name">
```

`mpa-persist`: This will persist the page location even when you change pages
and come back later. Use it like so:

```html
<body mpa-persist>
```

`mpa-skip-focus`: This will skip the focus of the element that you are on on
page refresh. Use it like so:

```html
<input name=my-name mpa-skip-focus>
```

`mpa-skip-scroll`: This will skip the scrolling of the page. This is useful
when you focus in a location and don't want the scroll to move it to the new
spot. Use it like so:

```html
<input name=my-name mpa-skip-scroll>
```

## Change Log

**2.2.1**

Fixed not working on Firefox and switched from even `beforeunload` to `unload`.

**2.2.0**

Added ability to persist pages and name a page different than the URL pathname.

**2.1.1**:

Fixed no element to focus on skipping scroll.

**2.1.0**:

When an element is hidden before reload still collect its information before
reload and use that instead of the `body` element.

**2.0.0**:

Changed the order from scrolling first to focus on what was focused before
first.


