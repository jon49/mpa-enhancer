// @ts-check
(() => {

let doc = document,
    w = window,
    query = doc.querySelector.bind(doc)

/**
* @param {HTMLElement} el
* @param {string} name
* @returns {boolean}
* */
function hasAttr(el, name) {
    return el.hasAttribute(name)
}

function getCleanUrlPath() {
    let url = new URL(doc.location.href)
    return url.pathname.replace(/\/$/, "")
}

w.addEventListener('beforeunload', () => {
    let active = doc.activeElement
    localStorage.pageLocation = JSON.stringify({
        href: getCleanUrlPath(),
        y: w.scrollY,
        height: doc.body.scrollHeight,
        active: {
            id: active?.id,
            name: active?.getAttribute('name')
        }
    })
})

function load() {
    if (query('[autofocus]')) return
    let location = localStorage.pageLocation
    if (!location) return
    let { y, height, href, active: { id, name } } = JSON.parse(location)
    if (!hasAttr(doc.body, 'mpa-skip-scroll')
        && href === getCleanUrlPath()
        && y) {
        w.scrollTo({ top: y + doc.body.scrollHeight - height })
    }
    let active =
        doc.getElementById(id)
        || query(`[name="${name}"]`)
    if (!active || hasAttr(active, 'mpa-skip-focus')) return
    run('focus', active)
    run('select', active)
}

/**
* @param {string} method
* @param {HTMLElement} el
* */
function run(method, el) {
    el[method] && el[method]()
}

load()

})()
