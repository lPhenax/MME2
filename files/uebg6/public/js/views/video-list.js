/**
 * @author Andreas Burger, Vivien Ebert & Daniel Schleußner
 */

define(['backbone', 'jquery', 'underscore', 'views/video'],
    function(Backbone, $, _, VideoView) {
    var VideoListView = Backbone.View.extend({
        el: '#video-list',
        template: undefined,
        render: function() {
            this.$el.empty();
            this.collection.each(function(video) {
                var videoView = new VideoView({model: video});
                this.$el.prepend(videoView.render().el);

            }, this);
            return this;
        },
        initialize: function() {
            // this.collection is a Backbone Collection
            this.listenTo(this.collection,'add', this.render);
        }
    });
    return VideoListView;
});