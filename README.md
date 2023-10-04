# MPA Enhancer

Minimalist JavaScript to make your MPA work that much better

On reloading of a page will scroll back to where the user left off and focus on
the last element they were looking at.

At 1.2 kB of minified JavaScript.

[Example TODO MVC application.](https://jon49.github.io/mpa-enhancer/todo/)

## Docs

Install by downloading and linking to the script. You can use NPM too and copy
it from there.

### How it works

It works first by looking for the `id` on the last focused element. If not
present it will look for the `name` attribute. If both of those are missing you
can use the `mpa-miss` (see below) to target a different element to determine
the scroll location. If all those fail then it will scroll to the current
scrolled position of the page — this is not ideal as you can be deleting and
adding elements and this will make the scroll position slightly different.

### Attributes

These attributes can enable the enhancer to make special accommodation to your
pages.

`mpa-target`: This will target a different element instead of the active
element. This is useful when the active element is hidden and so the top value
is 0.

```html
<div id="my-id">
    <input mpa-target="#my-id" type=hidden name=whatever>
</div>
```

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

`mpa-miss`: This will give a back up location if the ID/name element is no
longer on the page after a refresh. You can supply it a back up location. Use it
like so:

```html
<div id="my-backup-location" mpa-miss="#my-backup-location">
    <input name=delete-me>
</div>
```

## Change Log

**2.3.0**

Added `mpa-target` attribute.

**2.2.2/3/4/6**

Improved scrolling location.

**2.2.1**

Fixed not working on Firefox and switched from event `beforeunload` to `unload`.

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


