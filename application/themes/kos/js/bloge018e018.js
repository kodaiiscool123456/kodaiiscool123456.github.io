$(document).ready(function() {
    var blog = {
        init: function() {
            this.related_slider();
        },
        related_slider: function() {
            var slider = $('.related__list .card-page-list');
            var item = slider.find('.item');
            slider.bxSlider({
                speed: 1000,
                pause: 9000,
                mode: 'fade',
                controls: false,
                responsive: true,
                onSliderLoad: function(currentIndex) {

                },
            })
        },
        load: function() {
            var self = this;
            $window.load(function() {

            })
        },
        resize: function() {
            var self = this;
            $window.resize(function() {

            })
        }
    }
    blog.init();
});