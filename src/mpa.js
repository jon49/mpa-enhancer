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
    return el?.hasAttribute(name)
}

function getCleanUrlPath() {
    let url = new URL(doc.location.href)
    return url.pathname.replace(/\/$/, "")
}

let lastClick = null
w.addEventListener('click', e => {
    lastClick = e.target
})

w.addEventListener('beforeunload', () => {
    let active = doc.activeElement
    let target = doc.activeElement === doc.body ? lastClick : active
    localStorage.pageLocation = JSON.stringify({
        href: getCleanUrlPath(),
        y: w.scrollY,
        height: doc.body.scrollHeight,
        active: {
            id: target?.id,
            name: target?.getAttribute('name')
        }
    })
})

function load() {
    if (query('[autofocus]')) return
    let location = localStorage.pageLocation
    if (!location) return
    let { y, height, href, active: { id, name } } = JSON.parse(location)

    let active =
        doc.getElementById(id)
        || query(`[name="${name}"]`)
    if (!hasAttr(active, 'mpa-skip-focus')) {
        run('focus', active)
        run('select', active)
    }

    if (!hasAttr(doc.body, 'mpa-skip-scroll')
        && href === getCleanUrlPath()
        && y) {
        w.scrollTo({ top: y + doc.body.scrollHeight - height })
    }
}

/**
* @param {string} method
* @param {HTMLElement} el
* */
function run(method, el) {
    el && el[method] && el[method]()
}

load()

})()

