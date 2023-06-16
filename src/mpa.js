// @ts-check
(() => {

let d = document,
    w = window

function getCleanUrlPath() {
    let url = new URL(d.location.href)
    return url.pathname.replace(/\/$/, "")
}

w.addEventListener('beforeunload', () => {
    let active = d.activeElement
    localStorage.pageLocation = JSON.stringify({
        href: getCleanUrlPath(),
        y: w.scrollY,
        height: d.body.scrollHeight,
        active: {
            id: active?.id,
            name: active?.getAttribute('name')
        }
    })
})

function load() {
    if (d.querySelector('[autofocus]')) return
    let location = localStorage.pageLocation
    if (!location) return
    let { y, height, href, active: { id, name } } = JSON.parse(location)
    if (y && href === getCleanUrlPath()) {
        w.scrollTo({ top: y + d.body.scrollHeight - height })
    }
    let active =
        d.getElementById(id) ||
        d.querySelector(`[name="${name}"]`)
    if (active) {
        active.focus()
        // @ts-ignore
        active.select instanceof  Function && active.select()
    }
}

load()

})()
