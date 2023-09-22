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

function getPageName() {
    let pageName = doc.body.getAttribute('mpa-page-name')
    if (pageName) return pageName
    let url = new URL(doc.location.href)
    return url.pathname.replace(/\/$/, "")
}


let lastClick = null
w.addEventListener('click', e => {
    lastClick = e.target
})

w.addEventListener('unload', () => {
    let data = getData() || {}
    let persistedPages = new Set(data.__ || [])
    let pageName = getPageName()
    if (hasAttr(doc.body, 'mpa-persist')) {
        persistedPages.add(pageName)
        data.__ = Array.from(persistedPages)
    }
    for (let key in Object.keys(data)) {
        if (persistedPages.has(key) || key === '__') continue
        delete data[key]
    }

    let active = doc.activeElement
    let target = doc.activeElement === doc.body ? lastClick : active
    data[pageName] = {
        elY: target?.getBoundingClientRect().top,
        y: w.scrollY,
        active: {
            id: target?.id,
            name: target?.getAttribute('name')
        }
    }
    localStorage.pageLocations = JSON.stringify(data)
})

function load() {
    if (query('[autofocus]')) return
    let location = getData(getPageName())
    if (!location) return
    let { y, elY, active: { id, name } } = location

    let active =
        doc.getElementById(id)
        || query(`[name="${name}"]`)
    if (!hasAttr(active, 'mpa-skip-focus')) {
        run('focus', active)
        run('select', active)
    }

    if (!hasAttr(doc.body, 'mpa-skip-scroll') && y) {
        if (active) {
            w.scrollTo({ top: w.scrollY + active.getBoundingClientRect().top - elY })
        } else {
            w.scrollTo({ top: y })
        }
    }
}

/**
* @param {string} method
* @param {HTMLElement} el
* */
function run(method, el) {
    el && el[method] && el[method]()
}

/**
* @param {string} [name]
*/
function getData(name) {
    let data = localStorage.pageLocations
    data = data && JSON.parse(data)
    return name == null ? data : data && data[name]
}

load()

})()


