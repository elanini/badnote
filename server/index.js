const express = require('express')
const app = express()


let posts = {}

app.get('/:postid/:user', function (req, res) {
    let pid = req.params.postid;
    if (pid in posts) {
        res.status(200).send('' + posts[pid].size)
    } else {
        res.status(200).send("1337")
    }
})


app.post('/:postid/:user', function (req, res) {
    let pid = req.params.postid;
    let user = req.params.user;
    if (pid in posts) {
        posts[pid].add(user);
    } else {
        posts[pid] = new Set([user]);
    }
    res.sendStatus(200)
})

app.delete('/:postid/:user', (req, res) => {
    let pid = req.params.postid;
    let user = req.params.user;
    if (pid in posts) {
        posts[pid].delete(user);
        res.sendStatus(200)
    } else {
        res.sendStatus(404)
    }
})



app.listen(3000, () => console.log('Example app listening on port 3000!'))
