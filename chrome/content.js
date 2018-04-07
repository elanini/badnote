function getPostId() {
    let re = /class\/([^?]+)\?cid=(\d+)/;
    let res = re.exec(window.location);
    return (res[1] + res[2])
}

window.addEventListener('load', function() {
console.log(document.cookie)
}, false);
