/**
 *  Mongoose Schema and Model for Video
 *
 *  @author Johannes Konert
 *  changed by Andreas Burger, Vivien Ebert & Daniel Schleußner
  */
"use strict";

var mongoose = require('mongoose');
var VideoSchema = require('./video-schema');

module.exports = mongoose.model('Video', VideoSchema);