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

/**
* @param {HTMLElement} el
* @param {string} name
*/
function getAttr(el, name) {
    return el?.getAttribute(name)
}

function getPageName() {
    let pageName = getAttr(doc.body, 'mpa-page-name')
    if (pageName) return pageName
    let url = new URL(doc.location.href)
    return url.pathname.replace(/\/$/, "")
}


let lastClick = null
w.addEventListener('click', e => {
    lastClick = e.target
})

/**
* @param {HTMLElement | undefined} el
* @returns {number | undefined}
* */
function calculateY(el) {
    return el?.getBoundingClientRect().top
}

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
    let target = active === doc.body ? lastClick : active
    let miss = getAttr(target?.closest('[mpa-miss]'), 'mpa-miss')
    let name = target?.getAttribute('name')
    data[pageName] = {
        y: w.scrollY,
        // active
        a: {
            // target
            t: { y: calculateY(target), q: (target?.id && `#${target.id}`) || (name && `[name="${name}"]`) },
            // miss
            m: { y: calculateY(query(miss)), q: miss }
        }
    }
    localStorage._mpa = JSON.stringify(data)
})

function load() {
    if (query('[autofocus]')) return
    let location = getData(getPageName())
    if (!location) return
    let { y, a: { t, m } } = location

    let active = (t.q && query(t.q)) || (m.q && query(m.q))
    if (!hasAttr(active, 'mpa-skip-focus')) {
        run('focus', active)
        run('select', active)
    }

    if (!hasAttr(doc.body, 'mpa-skip-scroll') && y) {
        if (active) {
            // Scroll to where element was before
            w.scrollTo({
                top:
                    w.scrollY
                    // @ts-ignore
                    + calculateY(active)
                    - (t.q && t.y || m.q && m.y || 0)
            })
        } else {
            // Scroll to where page was before
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
    let data = localStorage._mpa
    data = data && JSON.parse(data)
    return name == null ? data : data && data[name]
}

load()

})()


