-- Active: 1686603411176@@127.0.0.1@3306
CREATE TABLE users (
    id TEXT PRIMARY KEY NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(100),
    creation_date VARCHAR(255) NOT NULL,
    information_update VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    accept_terms VARCHAR(50) NOT NULL
);

CREATE TABLE posts (
    id TEXT PRIMARY KEY NOT NULL UNIQUE,
    user_id TEXT NOT NULL,
    contents TEXT NOT NULL,
    creation_date VARCHAR(255) NOT NULL,
    information_update VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE like_dislike (
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id)
);

CREATE TABLE comments (
    id TEXT PRIMARY KEY NOT NULL UNIQUE,
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    contents TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id)
);

CREATE TABLE comments_like_dislike (
    user_id TEXT NOT NULL,
    comments_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (comments_id) REFERENCES comments(id)
);
-- -- ;
SELECT * from users;

DROP Table users;

SELECT
 posts.id as post_id,
 posts.contents,
 posts.creation_date,
 posts.information_update,
SUM(CASE WHEN like = 0 THEN 1 ELSE 0 END) AS dislike,
SUM(CASE WHEN like = 1 THEN 1 ELSE 0 END) AS like,
SUM(CASE WHEN like_dislike.like IS NULL THEN 1 ELSE 0 END) AS nulo
 from posts
LEFT join like_dislike ON posts.id = like_dislike.post_id;

DELETE from  comments;

SELECT 
posts.id,
posts.contents,
users.email,
like_dislike.like,
users.email AS liked_by
from posts
LEFT JOIN users on posts.user_id = users.id
LEFT JOIN like_dislike ON posts.id = like_dislike.post_id
LEFT JOIN users AS liked_by_user ON like_dislike.user_id = liked_by_user.id;
INSERT INTO like_dislike(user_id,post_id,like) VALUES(

);