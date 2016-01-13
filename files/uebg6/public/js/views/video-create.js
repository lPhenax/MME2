/**
 * @author Andreas Burger, Vivien Ebert & Daniel Schleußner
 */

define(['backbone', 'jquery', 'underscore'], function(Backbone, $, _) {
    const ENTER_KEY = 13;
    var VideoCreateView = Backbone.View.extend({
        el: '#new-video',
        events: {
            'click button': 'createVideo',
            'keypress input': 'createOnEnter'
        },
        initialize: function(options) {
            this.app = options.app;  // expects a Backbone Router instance as option
        },
        createVideo: function() {
            var title       = $('#tit');
            var src         = $('#src');
            var length      = $('#len');
            var description = $('#des');
            var playcount   = $('#pc');
            var ranking     = $('#ran');
            var input       = this.$el.find('input');
            if (input.val().trim()) {
                if( (title.val() == "") ||
                    (length.val() == 0) ||
                    (src.val() == "")){
                    alert("Wrong vid-declaration...!");
                } else {
                    var video = this.collection.add({
                        title       : title.val(),
                        src         : src.val(),
                        description : description.val(),
                        length      : length.val(),
                        playcount   : playcount.val(),
                        ranking     : ranking.val()
                    });
                    input.val('');
                }

            }
        },
        createOnEnter: function(event) {
            // check for key = ENTER and then call createTweet

            if ( event.which === ENTER_KEY) {
                this.createVideo();
            }
        }
    });
    return VideoCreateView;
});