const assert = require('assert');
const request = require('request-promise');

const server = require('./server');
server.start(':memory:');

const base = 'http://localhost:3000';

async function test() {
    let res = await request.get(base + '/a/b');
    assert.deepStrictEqual(JSON.parse(res),
        {
            cnt: 0,
            voted: false
        });

    res = await request.post(base + '/a/b');

    res = await request.get(base + '/a/b');

    assert.deepStrictEqual(JSON.parse(res),
        {
            cnt: 1,
            voted: true
        })

    res = await request.get(base + '/a/c');

    assert.deepStrictEqual(JSON.parse(res),
        {
            cnt: 1,
            voted: false
        })

    res = await request.post(base + '/a/c');
    
    res = await request.get(base + '/a/c');

    assert.deepStrictEqual(JSON.parse(res),
        {
            cnt: 2,
            voted: true
        })

    res = await request.delete(base + '/a/c');
    
    res = await request.get(base + '/a/c');

    assert.deepStrictEqual(JSON.parse(res),
        {
            cnt: 1,
            voted: false
        })
    console.log("pass")
    process.exit()
}

test()

