const express = require('express')
const app = express()
const sqlite = require('sqlite');
const mung = require('express-mung');

const port = process.env.PORT || 3000;

function send(res, status, body) {
    if (process.env.NODE_ENV !== "production") {
	console.log(`< ${status} ${body ? JSON.stringify(body) : ''}`)
    }
    if (body) {
        res.status(status).send(body)
    } else {
        res.sendStatus(status)
    }
}

async function get_user_status(db, pid, user, posttype) {
        let [cntstmt, existstmt] = await Promise.all([
            db.prepare("SELECT count(userid) AS cnt FROM posts WHERE postid = ? AND posttype = ?;"),
            db.prepare("SELECT EXISTS(SELECT 1 FROM posts WHERE postid = ? AND userid = ? AND posttype = ?) as voted;")
        ]);

        let [cntObj, existObj] = await Promise.all([
            cntstmt.get([pid, posttype]),
            existstmt.get([pid, user, posttype])
        ])
        cntstmt.finalize()
        existstmt.finalize()
        return {
            count: cntObj.cnt, 
            voted: existObj.voted === 1 ? true : false
        }
}

async function get_user_statuses(db, pid, user) {
        let [cntstmt, existstmt] = await Promise.all([
            db.prepare("select count(userid) as count, posttype from posts where postid = ? group by posttype;"),
            db.prepare("SELECT posttype FROM posts WHERE postid = ? AND userid = ? group by posttype;")
        ]);

        let [cntObj, existObj] = await Promise.all([
            cntstmt.all([pid]),
            existstmt.all([pid, user])
        ])
        cntstmt.finalize()
        existstmt.finalize()
        let results = []
        cntObj.map((row) => {
            results.push({
                ...row,
                voted: existObj.some(el => el.posttype == row.posttype)
            })
        })
        return results;
}

exports.start = async (name) => {
    const db = await Promise.resolve()
        .then(() => sqlite.open(name, { Promise }))
        .then(db => db.migrate({ force: 'last' }));

    if (process.env.NODE_ENV !== "production") {
        app.use((req, res, next) => {
            console.log(`> ${req.method} ${req.url} ${req.body ? req.body : ""}`)
            next()
        });
    }


    app.get('/:postid/:user/:posttype', async function (req, res, next) {
        let {user, postid: pid, posttype} = req.params;

        send(res, 200, await get_user_status(db, pid, user, posttype));
    })

    app.get('/:postid/:user', async function (req, res, next) {
        let {user, postid: pid, posttype} = req.params;

        send(res, 200, await get_user_statuses(db, pid, user, '*'));
    })

    app.post('/:postid/:user/:posttype', async function (req, res, next) {
        let {user, postid: pid, posttype} = req.params;
        
        let stmt = await db.prepare("INSERT OR IGNORE INTO posts VALUES (?, ?, ?);");
        let _ = await stmt.run([pid, user, posttype])
        stmt.finalize();

        send(res, 200, await get_user_status(db, pid, user, posttype));
    })

    app.delete('/:postid/:user/:posttype', async (req, res, next) => {
        let {user, postid: pid, posttype} = req.params;

        let stmt = await db.prepare("DELETE FROM posts WHERE postid = ? AND userid = ? AND posttype = ?;")
        let _ = await stmt.run([pid, user, posttype])
        stmt.finalize()
        send(res, 200, await get_user_status(db, pid, user, posttype));
    })



    app.set('trust proxy', true);
    app.set('trust proxy', 'loopback');
    app.listen(port, '127.0.0.1', () => console.log('Listening on port ' + port))
    return Promise.resolve()
}

