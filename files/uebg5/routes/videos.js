/** This module defines the routes for videos using a mongoose model
 *
 * @author Johannes Konert
 * changed by Burger, Ebert & Schleußner
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
var mongoose = require('mongoose');
var express = require('express');
var logger = require('debug')('me2u5:videos');

/**
 * DB  - Connection
 * me2 - DB-Name
 */
mongoose.connect('mongodb://localhost:27017/me2');

// TODO add here your require for your own model file
var VideoModel = require('../models/video');

var videos = express.Router();


// routes **********************
videos.route('/')
    .get(function (req, res, next) {
        VideoModel.find({}, function (err, items) {
            if (items.length == 0) {
                return res.status(204).end();
            }
            return res.status(200).json(items).end();
        });
    })
    .post(function (req, res, next) {
        req.body.timestamp = new Date().getTime();
        var video = new VideoModel(req.body);
        video.save(function (err) {
            if (err)
                return res.status(400).json({error: {message: "Wrong request", code: 400}}).end();

            return res.status(201).json(video).end();
        });
    })
    .all(function (req, res, next) {
        return res.status(405).json({error: {message: "Method not allowed", code: 405}}).end();
    });

videos.route('/:id')
    .get(function (req, res, next) {
        VideoModel.find({_id: req.params.id}, function (err, items) {
            if (err)
                return res.status(404).json({error: {message: "ID not found", code: 404}}).end();

            return res.status(200).json(items).end();
        });
    })
    .put(function (req, res, next) {

        VideoModel.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, item) {
            if (err) {
                if (err.path === "_id")
                    return res.status(404).json({
                        error: {message: "ID not found", code: 404}
                    }).end();

                return res.status(400).json({
                    error: {message: "Attributes was wrong declared", code: 400}
                }).end();
            }
            if (item._id == req.body._id) {
                if (req.body.titel === undefined || req.body.src === undefined || req.body.length === undefined) {
                    return res.status(400).end();
                }
                console.log(req.body.description);
                if(req.body.description === undefined) item.description = "";
                if(req.body.ranking === undefined) item.ranking = 0;
                if(req.body.playcount === undefined) item.playcount = 0;

                return res.status(200).json(item).end();

            } else {
                return res.status(400).json({
                    error: {message: "_id has changed", code: 400}
                }).end();
            }
        });

    })
    .delete(function (req, res, next) {
        VideoModel.findByIdAndRemove(req.params.id, function (err, item) {
            if (err)
                return res.status(404).json({error: {message: "ID not found", code: 404}}).end();

            return res.status(200).json(item).end();
        });
    })
    .patch(function (req, res, next) {
        VideoModel.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, item) {
            //console.log(err.path);
            //console.log(req.body.id);
            //console.log(req.params.id);
            //console.log(item._id);
            //console.log(item);
            if (err) {
                if (err.path === "_id")
                    return res.status(404).json({
                        error: {message: "ID not found", code: 404}
                    }).end();

                return res.status(400).json({
                    error: {message: "Attributes was wrong declared", code: 400}
                }).end();
            }
            if (item._id == req.params.id) {
                return res.status(200).json(item).end();
            } else {
                return res.status(400).json({
                    error: {message: "_id has changed", code: 400}
                }).end();
            }
        });
    })

    .all(function (req, res, next) {
        res.status(405).json({error: {message: "Method not allowed", code: 405}}).end();
    });


// this middleware function can be used, if you like or remove it
// it looks for object(s) in res.locals.items and if they exist, they are send to the client as json
videos.use(function (req, res, next) {
    // if anything to send has been added to res.locals.items
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