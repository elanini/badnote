const express = require('express')
const app = express()
const sqlite = require('sqlite');

const port = process.env.PORT || 3000;

exports.start = (name) => {
    const dbPromise = Promise.resolve()
        .then(() => sqlite.open(name, { Promise }))
        .then(db => db.migrate());
    

    app.use((req, res, next) => {
        dbPromise.then((db) => {
            req.db = db;
            next()
        });
    });

    app.get('/:postid/:user', async function (req, res) {
        let {user, postid: pid} = req.params;
        let db = req.db;

        let [cntstmt, existstmt] = await Promise.all([
            db.prepare("SELECT count(userid) AS cnt FROM posts WHERE postid = ?;"),
            db.prepare("SELECT EXISTS(SELECT 1 FROM posts WHERE postid = ? AND userid = ?) as voted;")
        ]);

        let [cntObj, existObj] = await Promise.all([
            cntstmt.get([pid]),
            existstmt.get([pid, user])
        ])
        cntstmt.finalize()
        existstmt.finalize()

        res.status(200).send({
            cnt: cntObj.cnt,
            voted: existObj.voted == 1 ? true : false,
        })
    })


    app.post('/:postid/:user', async function (req, res) {
        let {user, postid: pid} = req.params;
        let db = req.db;

        
        let stmt = await db.prepare("INSERT OR IGNORE INTO posts VALUES (?, ?);");
        stmt.run([pid, user])
            .then(() => {
                stmt.finalize()
                res.sendStatus(200);
            });
    })

    app.delete('/:postid/:user', async (req, res) => {
        let {user, postid: pid} = req.params;
        let db = req.db;

        let stmt = await db.prepare("DELETE FROM posts WHERE postid = ? AND userid = ?;")
        stmt.run([pid, user])
            .then(() => {
                stmt.finalize()
                res.sendStatus(200)
            })
    })

    app.listen(port, () => console.log('Listening on port ' + port))
}

