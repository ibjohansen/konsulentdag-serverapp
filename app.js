'use strict';

var Express = require('express');
var Firebase = require('firebase');
var Twitter = require('twitter');

var config = {
    baseUrl: 'https://acandotweets.firebaseio.com/tweets',
    watchTag: 'acando, acandonorge',
    consumer_key: 'xxx',
    consumer_secret: 'xxx',
    access_token_key: 'xxx-xxx',
    access_token_secret: 'xxx'
};

var baseRef = new Firebase(config.baseUrl);

var app = Express();
var server = app.listen(process.env.PORT || 5000, function () {
    console.log('app; feed svarer på ' + server.address().port);
    core.processTweets();
});

var core = {
    processTweets: function () {

        var client = new Twitter({
            consumer_key: config.consumer_key,
            consumer_secret: config.consumer_secret,
            access_token_key: config.access_token_key,
            access_token_secret: config.access_token_secret
        });

        client.stream('statuses/filter', {track: config.watchTag}, function (stream) {
            console.log('on stream');
            stream.on('data', function (tweet) {
                console.log('on data');
                core.storeTweet(tweet);
            });

            stream.on('error', function
                (error) {
                console.error('error: ' + error.message);
            })
        })
    },

    storeTweet: function (tweet) {
        if (null !== tweet) {
            try {
                baseRef.push().set(tweet)
            }
            catch (error) {
                console.error('error: ' + error.message);
            }
        }
    }
};