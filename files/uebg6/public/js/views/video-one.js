/**
 * @author Andreas Burger, Vivien Ebert & Daniel Schleußner
 */

define(['backbone', 'jquery', 'underscore', 'views/video'],
    function (Backbone, $, _, VideoView) {
        var VideoOneView = Backbone.View.extend({
            el: '#video-one',
            template: _.template($('#main_video-template').text()),
            events: {
                'click #btn_play_pause' : 'playPause',
                'click #btn_reset'      : 'reset',
                'click #checkbox_volume': 'volume',
                'click #btn_next'       : 'loadNextVid',
                'click #btn_prev'       : 'loadPrevVid'
            },
            index: 0,
            model: undefined,
            render: function () {
                this.$el.empty();
                this.model = this.collection.at(this.index);

                var counter = this.model.get('playcount');
                counter++;
                this.model.set('playcount', counter);
                this.model.save();

                this.$el.html(this.template(this.model.attributes));
                return this;
            },
            initialize: function () {
                // this.collection is a Backbone Collection
                this.listenTo(this.collection, 'add', this.render);
            },
            playPause: function () {
                //var video = this.$el.find('video');
                //var video = this.$("video");
                var video = document.getElementById("main_video");
                var btn_start_pause = this.$("#btn_play_pause");
                if (video.paused) {
                    video.play();
                    btn_start_pause.text = "||";
                } else {
                    video.pause();
                    btn_start_pause.text = ">";
                }
            },
            reset: function(){
                var video = document.getElementById("main_video");
                video.currentTime = 0;
            },
            volume: function(){
                var video = document.getElementById("main_video");
                if(document.getElementById("checkbox_volume").checked) {
                    video.muted = true;
                } else {
                    video.muted = false;
                }
            },
            loadNextVid: function () {
                //console.log("c.length : " + this.collection.length);
                //console.log("index    : " + this.index);
                if(this.index < this.collection.length-1){
                    this.index++;
                } else {
                    this.index = 0;
                }
                this.render();
            },
            loadPrevVid: function () {
                //console.log("c.length : " + this.collection.length);
                //console.log("index    : " + this.index);
                if(this.index > 0){
                    this.index--;
                } else {
                    this.index = this.collection.length-1;
                }
                this.render();
            }
        });
        return VideoOneView;
    });