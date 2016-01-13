/**
 * @author Andreas Burger, Vivien Ebert & Daniel Schleußner
 */

define(['backbone', 'underscore'], function(Backbone, _) {
    var result = {};
    var videoSchema = {
        urlRoot: '/videos', // not really needed if collection exists
        idAttribute: "_id",
        defaults: {
            title:          '',
            src:            '',
            length:         0,
            description:    '',
            playcount:      0,
            ranking:        0,
            timestamp:      ''
        },
        initialize: function() {
            // after constructor code
        },
        validate: function(attr) {
            if ( _.isEmpty(attr.title) ) {
                return "Missing Title";
            }
            if (_.isEmpty(attr.src)) {
                return "Missing Source";
            }
            if (_.isEmpty(attr.length)) {
                return "Missing Lenght";
            }
        }

    };

    var VideoModel = Backbone.Model.extend(videoSchema);

    var VideoCollection = Backbone.Collection.extend({
        model: VideoModel,
        url: '/videos',
        initialize: function() {
            this.on('add', function(video) {
                if (video.isValid() && video.isNew()) {
                    video.save();
                }
            })
        }
    });


    result.Model = VideoModel;
    result.Collection = VideoCollection;
    return result;
});