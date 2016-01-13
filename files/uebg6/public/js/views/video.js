/**
 * @author Andreas Burger, Vivien Ebert & Daniel Schleußner
 */

define(['backbone', 'jquery', 'underscore'], function(Backbone, $, _) {
    var VideoView = Backbone.View.extend({

        tagName: 'li',
        className: 'video',
        template: _.template($('#video-template').text()),
        events: {
            'click #btn2_play_pause' : 'playPause',
            'click #btn2_reset'      : 'reset'
        },
        render: function() {
            this.model.save();

            this.$el.html(this.template(this.model.attributes));
            return this;
        },
        renderOne: function(){
            this.video.save();
            //console.log(this.$el);
            //console.log(this.$el.html);
            console.log("hallo");

            this.$el.html(this.template(this.video.get('playcount')));
            return this;
        },
        //video: undefined,
        initialize: function() {
            //this.video = this.model;
            this.listenTo(this.model, 'change', this.render);
            //this.listenTo(this.video, 'change:playcount', this.renderOne());
            //this.video.on('change:playcount', function(model, playcount){
            //    console.log("change playcount from " + model.previous("playcount") + " to " + playcount);
            //    this.renderOne()
            //}, this)
        },
        playPause: function(){
            var video = this.$el.find('video').get(0);
            if (video.paused) {
                video.play();
                var counter = this.video.get('playcount');
                counter++;
                //this.video.set('playcount', counter);
            } else {
                video.pause();
            }

        },
        reset: function(){
            var video = this.$el.find('video').get(0);
            video.currentTime = 0;
        }
    });
    return VideoView;
});