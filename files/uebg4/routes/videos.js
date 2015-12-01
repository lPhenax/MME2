/** This module defines the routes for videos using the store.js as db memory
 *
 * @author Johannes Konert
 * @licence CC BY-SA 4.0
 *
 * @module routes/videos
 * @type {Router}
 */

// remember: in modules you have 3 variables given by CommonJS
// 1.) require() function
// 2.) module.exports
// 3.) exports (which is module.exports)

// modules
var express = require('express');
var logger = require('debug')('me2u4:videos');
var store = require('../blackbox/store');

var videos = express.Router();

// if you like, you can use this for task 1.b:
var requiredKeys = {title: 'string', src: 'string', length: 'number'};
var optionalKeys = {description: 'string', playcount: 'number', ranking: 'number'};
var internalKeys = {id: 'number', timestamp: 'number'};

/*videos.use(function (req, res, next) {
 console.log('Request of type ' + req.method + ' to URL ' + req.originalUrl);
 next();
 });*/


// routes **********************
videos.route('/')
    .get(function (req, res, next) {

        //res.status(200).json(store.select('videos'));
        next();
    })
    .post(function (req, res, next) {
        if (req.url != '/') res.status(405).end();
        console.log(req.body.timestamp);
        if(/*req.body.title == 404 || req.body.src == 404 || req.body.length == 404*/ req.body.timestamp) {
            //res.body.timestamp = Date.now();
            console.log("...bin hier");
            res.status(400).end();
        } else {
            console.log("...bin hier2");
            var id = store.insert('videos', req.body);
            id.timestamp = new Date();
            // set code 201 "created" and send the item back
            res.status(201).json(store.select('videos', id));
        }
    })
    .put(function (req, res, next) {
        res.status(405).end();
    });
videos.route('/:id')
    .get(function (req, res, next) {
        res.status(200).json(store.select('videos', req.params.id));
    })
    .post(function (req, res, next) {
        if (req.url != '/') res.status(405).end();
    })
    .delete(function (req, res, next) {
        res.set('Content-Type', 'application/json');
        var deletedItem = store.remove('videos', req.params.id);
        //console.log(deletedItem);
        if (deletedItem === undefined) {
            //console.log("iam here..");
            res.status(404).end();
        } else {
            res.status(204).end();
        }
    })
    .put(function (req, res, next) {
        store.replace('videos', req.params.id, req.body);
        res.status(200).json(store.select('videos', req.params.id)).end();
    });

// this middleware function can be used, if you like or remove it
videos.use(function (req, res, next) {
    // if anything to send has been added to res.locals.items
    //console.log(res.locals.items);
    if (res.locals.items) {
        // then we send it as json and remove it
        res.json(res.locals.items);
        delete res.locals.items;

    } else {
        // otherwise we set status to no-content
        res.set('Content-Type', 'application/json');
        res.status(204).end(); // no content;
    }
});

module.exports = videos;
