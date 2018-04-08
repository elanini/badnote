const assert = require('assert');
const request = require('request-promise');

const base = 'http://localhost:3000';

const server = require('./server');
server.start(':memory:')
.then(() => {
    test()
})


async function test() {
    // should be empty, not voted
    let res = await request.get(base + '/a/b');
    assert.deepStrictEqual(JSON.parse(res),
        {
            count: 0,
            voted: false
        });

    // b vote on a
    res = await request.post(base + '/a/b');
    assert.deepStrictEqual(JSON.parse(res),
        {
            count: 1,
            voted: true
        })

    // check c has not voted
    res = await request.get(base + '/a/c');
    assert.deepStrictEqual(JSON.parse(res),
        {
            count: 1,
            voted: false
        })

    // c vote on a
    res = await request.post(base + '/a/c');
    assert.deepStrictEqual(JSON.parse(res),
        {
            count: 2,
            voted: true
        })

    // c cant vote twice
    res = await request.post(base + '/a/c');
    assert.deepStrictEqual(JSON.parse(res),
        {
            count: 2,
            voted: true
        })

    // delete c's vote
    res = await request.delete(base + '/a/c');
    assert.deepStrictEqual(JSON.parse(res),
        {
            count: 1,
            voted: false
        })
    console.log("pass")
    process.exit()
}


