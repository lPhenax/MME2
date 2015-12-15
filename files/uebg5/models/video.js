/**
 * Created by Burger, Ebert & Schleußner on 09.12.2015.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VideoSchema = new Schema({
    titel: {        type: String, required: true},
    description: {  type: String, default: ""},
    src: {          type: String, required: true},
    length: {       type: Number, required: true, min: 0},
    playcount: {    type: Number, min: 0, default: 0},
    ranking: {      type: Number, min: 0, default: 0}
    }, {
    timestamps: {   createdAt: 'timestamp'}
});

module.exports = mongoose.model('Video', VideoSchema);