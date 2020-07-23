$(document).ready(function() {
    var thisblock = {
        init : function(){
            this.get_zoom();
        },
        get_zoom: function() {
            var a = $('.block-gallery-zoom .fancybox');
            if (a.length) {
                a.fancybox({
                    helpers: {
                        overlay: {
                            locked: false
                        }
                    },
                    prevEffect: 'none',
                    nextEffect: 'none',
                    padding: 0,
                    margin: 0,
                    maxWidth: 800,
                });
            }
        },
    }
    thisblock.init();

});

