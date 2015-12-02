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
        var url = req.url;
        //console.log(req.url);
        if (req.url == "/") {
            var selectionList = store.select('videos', null);
            if (selectionList.length == 0) {
                res.set('Content-Type', 'application/json');
                res.status(204).end();
                return;
            }
            req.body = selectionList;
            res.set('Content-Type', 'application/json');
            res.status(200).json(req.body).end();
        } else {
            var limitAndOffset = url.substring(2, url.length);
            var tempArr = [];
            var offset = 0;
            var limit = 0;
            /**
             * if
             * true --> more params --> split("&") --> split("=")
             * else --> one param (offset or limit)--> split("=")
             */
            if (limitAndOffset.length > 13) {
                var splitLimitAndOffset = limitAndOffset.split("&");
                var afterSplitTwo_SplitInParam = [];
                //console.log(splitLimitAndOffset);
                for (var i = 0; i < splitLimitAndOffset.length; i++) {
                    afterSplitTwo_SplitInParam.push(splitLimitAndOffset[i].split("="));
                }
                //console.log(afterSplitTwo_SplitInParam);
                var selectionListWithMoreParams = store.select('videos', null);
                if (selectionListWithMoreParams.length == 0) {
                    res.set('Content-Type', 'application/json');
                    res.status(204).end();
                    return;
                }
                for (var a = 0; a < afterSplitTwo_SplitInParam.length; a++) {
                    var currentParam = afterSplitTwo_SplitInParam[a];
                    //console.log(currentParam);
                    if (currentParam[0] == "offset") {
                        offset = currentParam[1];
                        try {
                            offset = parseInt(offset);
                        } catch (err) {
                            //console.log("not a number");
                            res.set('Content-Type', 'application/json');
                            res.status(400).end();
                        }
                        if (offset <= 0 || typeof offset !== 'number' || isNaN(offset)
                            || offset == selectionListWithMoreParams.length) {
                            res.set('Content-Type', 'application/json');
                            res.status(400).end();
                            return;
                        }
                    } else if (currentParam[0] == "limit") {
                        limit = currentParam[1];
                        try {
                            limit = parseInt(limit);
                        } catch (err) {
                            //console.log("not a number");
                            res.set('Content-Type', 'application/json');
                            res.status(400).end();
                        }
                        if (limit <= 0 || typeof limit !== 'number' || isNaN(limit)) {
                            res.set('Content-Type', 'application/json');
                            res.status(400).end();
                            return;
                        }
                    } else {
                        res.end();
                        return;
                    }
                }
                var typeLimit = 0;
                if (limit > selectionListWithMoreParams.length) {
                    typeLimit = selectionListWithMoreParams.length;
                } else {
                    typeLimit = limit;
                }
                if (offset+typeLimit > selectionListWithMoreParams.length) {
                    typeLimit -= offset;
                }
                for (var j = 0; j < typeLimit; j++) {
                    tempArr.push(selectionListWithMoreParams[j+offset]);
                }
            } else {
                var param = limitAndOffset.split("=");
                //noinspection JSDuplicatedDeclaration
                var selectionListWithOneParam = store.select('videos', null);
                if (selectionListWithOneParam.length == 0) {
                    res.set('Content-Type', 'application/json');
                    res.status(204).end();
                    return;
                }

                if (param[0] == "offset") {
                    offset = param[1];
                    if (offset < 0) {
                        res.set('Content-Type', 'application/json');
                        res.status(400).end();
                        return;
                    }

                    for (var i = offset; i < selectionListWithOneParam.length; i++) {
                        tempArr.push(selectionListWithOneParam[i]);
                    }
                } else if (param[0] == "limit") {
                    limit = param[1];
                    if (limit <= 0) {
                        res.set('Content-Type', 'application/json');
                        res.status(400).end();
                        return;
                    }
                    for (var i = 0; i < limit; i++) {
                        tempArr.push(selectionListWithOneParam[i]);
                    }
                } else {
                    res.end();
                    return;
                }
            }
            //console.log("ich bin durch2");
            //console.log(tempArr);
            res.set('Content-Type', 'application/json');
            res.status(200).json(tempArr).end();
        }

    })
    .post(function (req, res, next) {
        req.body.timestamp = new Date().getTime();
        if (req.body.playcount === undefined) req.body.playcount = 0;
        if (req.body.ranking === undefined) req.body.ranking = 0;
        var id = store.insert('videos', req.body);
        // set code 201 "created" and send the item back
        res.status(201).json(store.select('videos', id));

    })
    .put(function (req, res, next) {
        var fehler = {error: {message: "Method Not Allowed", code: 405}};
        if (req.body.error == undefined) req.body.error = fehler;
        res.set('Content-Type', 'application/json');
        res.status(405).json(req.body.error);
    });
videos.route('/:id')
    .get(function (req, res, next) {

        var url = req.url;
        var kindOf = url.substring(0, 12);
        if (kindOf == "/" + req.params.id + "?filter=") {
            var filterPart = url.substring(12, url.length);
            var filterPara = filterPart.split("%2C");
            var arr = {};
            for (var i = 0; i < filterPara.length; i++) {
                var vidArr = store.select('videos', null);
                var para = filterPara[i];
                if (para == "src") for (var j = 0; j < vidArr.length; j++) arr[para] = vidArr[j].src;
                else if (para == "title") for (var j = 0; j < vidArr.length; j++) arr[para] = vidArr[j].title;
                else if (para == "length") for (var j = 0; j < vidArr.length; j++) arr[para] = vidArr[j].length;
                else if (para == "timestamp") for (var j = 0; j < vidArr.length; j++) arr[para] = vidArr[j].timestamp;
                else if (para == "id") for (var j = 0; j < vidArr.length; j++) arr[para] = vidArr[j].id;
                else if (para == "ranking") for (var j = 0; j < vidArr.length; j++) arr[para] = vidArr[j].ranking;
                else if (para == "description") for (var j = 0; j < vidArr.length; j++) arr[para] = vidArr[j].description;
                else if (para == "playcount") for (var j = 0; j < vidArr.length; j++) arr[para] = vidArr[j].playcount;
                else {
                    res.status(400).end();
                }
            }
            //console.log(arr);
            req.body.keys = arr;
            res.status(200).json(req.body.keys);
        }
    })
    .post(function (req, res, next) {
        var fehler = {error: {message: "Method Not Allowed", code: 405}};
        if (req.body.error == undefined) req.body.error = fehler;
        res.set('Content-Type', 'application/json');
        res.status(405).json(req.body.error);
    })
    .delete(function (req, res, next) {
        if (store.select('videos', req.params.id) != undefined) {
            store.remove('videos', req.params.id);
            res.set('Content-Type', 'application/json');
            res.status(204).end();
        }
        var fehler = {error: {message: "Method Not Allowed", code: 404}};
        if (req.body.error == undefined) req.body.error = fehler;
        res.set('Content-Type', 'application/json');
        res.status(404).json(req.body.error);
    })
    .put(function (req, res, next) {
        store.replace('videos', req.params.id, req.body);
        res.status(200).json(store.select('videos', req.params.id)).end();
    });

module.exports = videos;
