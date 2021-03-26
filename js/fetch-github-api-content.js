
function fetchGithubAPIContent(element) {
    url = `https://api.github.com/repos/xmoyuu/xmoyuu.github.io/contents/blog/${location.pathname.substr(1)}.md`
    fetch(url, {
        headers: {
            'Accept': 'application/vnd.github.v3.html'
        }
    })
        .then(response => {
            if (response.status == 404) {
                return 404
            }
            return response.text()
        })
        .then(text => {
            element.innerHTML = text
            tableWrap()
        })
}

function tableWrap() {
    tableList = document.querySelectorAll('table')
    tableList.forEach(element => {
        parent = element.parentNode
        wrapper = document.createElement('div')
        wrapper.className = 'table-wrap'
        parent.replaceChild(wrapper, element)
        wrapper.appendChild(element)
    })
}