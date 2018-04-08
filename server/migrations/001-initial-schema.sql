-- Up
CREATE TABLE IF NOT EXISTS posts ( 
    postid TEXT NOT NULL, 
    userid TEXT NOT NULL,
    CONSTRAINT uniq UNIQUE (postid, userid)
);

-- Down
DROP TABLE posts
