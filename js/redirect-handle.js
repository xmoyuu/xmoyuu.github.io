// redirect-handle
// https://xmoyuu.github.io/?pathname=/one/two&search=a=b~and~c=d#hash
//                     ↓
// https://xmoyuu.github.io/one/two?a=b&c=d#hash

// search == ?pathname=/one/two&search=a=b~and~c=d
// search.slice(1) == pathname=/one/two&search=a=b~and~c=d
// search.slice(1).split('&') 
// == Array [ 'pathname=/one/two', 'search=a=b~and~c=d' ]

let { protocol, hostname, port, pathname, search, hash } = location
if (search) {
    newLocation = {}
    search.slice(1).split('&').forEach(element => {
        array = element.split('=')
        newLocation[array[0]] = array.slice(1).join('=').replace(/~and~/g, '&')
    })
    if (newLocation.pathname !== undefined) {
        history.replaceState(null, null,
            pathname.slice(0, -1)
            + (newLocation.pathname || '')
            + (newLocation.search ? ('?' + newLocation.search) : '')
            + hash
        )
    }
}