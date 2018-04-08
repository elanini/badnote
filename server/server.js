const express = require('express')
const app = express()
const sqlite = require('sqlite');
const mung = require('express-mung');

const port = process.env.PORT || 3000;

function send(res, status, body) {
    console.log(`< ${status} ${body ? JSON.stringify(body) : ''}`)
    if (body) {
        res.status(status).send(body)
    } else {
        res.sendStatus(status)
    }
}

async function get_user_status(db, pid, user) {
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
        return {
            count: cntObj.cnt, 
            voted: existObj.voted === 1 ? true : false
        }
}

exports.start = (name) => {
    const dbPromise = Promise.resolve()
        .then(() => sqlite.open(name, { Promise }))
        .then(db => db.migrate({ force: 'last' }));

    app.use((req, res, next) => {
        dbPromise.then((db) => {
            req.db = db;
            next()
        });
    });

    app.use((req, res, next) => {
        console.log(`> ${req.method} ${req.url} ${req.body ? req.body : ""}`)
        next()
    });

    app.get('/:postid/:user', async function (req, res, next) {
        let {user, postid: pid} = req.params;
        let db = req.db;
        

        send(res, 200, await get_user_status(db, pid, user));
    })


    app.post('/:postid/:user/', async function (req, res, next) {
        let {user, postid: pid} = req.params;
        let db = req.db;

        
        let stmt = await db.prepare("INSERT OR IGNORE INTO posts VALUES (?, ?);");
        let _ = await stmt.run([pid, user])
        stmt.finalize();

        send(res, 200, await get_user_status(db, pid, user));
        // send(res, 200);
    })

    app.delete('/:postid/:user', async (req, res, next) => {
        let {user, postid: pid} = req.params;
        let db = req.db;

        let stmt = await db.prepare("DELETE FROM posts WHERE postid = ? AND userid = ?;")
        let _ = await stmt.run([pid, user])
        stmt.finalize()
        send(res, 200, await get_user_status(db, pid, user));
    })



    app.listen(port, () => console.log('Listening on port ' + port))
}

