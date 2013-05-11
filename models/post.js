/**
 * 文章相关
 * User: jonery
 * Date: 13-5-11
 * Time: 下午4:29
 * To change this template use File | Settings | File Templates.
 */
var mongodb = require('./db');

var Post = function(post){
    if(!post.time){
        post.time = new Date();
    }
    this.post = post;
}

Post.prototype = {
    save: function(callback){
        var self = this;
        mongodb.open(function(err, db){
            if(err){
                   return callback(err);
            }
            db.collection('posts', function(err, collection){
                if(err){
                    mongodb.close();
                    return callback(err);
                }
                collection.ensureIndex('user');
                collection.insert(self.post, {
                    safe: true
                }, function(err, post){
                    mongodb.close();
                    callback(err, post);
                });

            });
        });
    }
};

Post.get = function(username, callback){
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('posts', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query = {};

            if(username){
                query = username;
            }

            collection.find(query).sort({
                time: -1
            }).toArray(function(err, docs){
                mongodb.close();
                if(err){
                    callback(err);
                }
                var posts = [];

                docs.forEach(function(doc, index){
                    var newDoc = {
                        user: doc.username,
                        title: doc.title,
                        post: doc.post,
                        time: doc.time
                    };
                    var now = doc.time;
                    newDoc.time = now.getFullYear() + "-" + (now.getUTCMonth() + 1) + "-" + now.getUTCDate();

                    posts.push(newDoc);
                });

                callback(null, posts);
            });

        });



    });
}

module.exports = Post;