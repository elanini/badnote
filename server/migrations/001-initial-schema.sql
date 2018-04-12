-- Up
CREATE TABLE IF NOT EXISTS posts ( 
    postid TEXT NOT NULL, 
    userid TEXT NOT NULL,
    posttype TEXT NOT NULL,
    CONSTRAINT uniq UNIQUE (postid, userid, posttype)
);

-- Down
DROP TABLE posts
