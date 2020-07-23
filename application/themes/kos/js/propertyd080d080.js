$(document).ready(function() {
    var property = {
        init: function() {
            this.gallery_slider();
            this.form_actions();
            this.datetimepicker();
        },
        gallery_slider: function() {
            var widthpad = $(window).width() * 0.25 + 'px';
            var slider = $('.block-gallery-list>div');
            slider.on('init', function() {});
            slider.slick({
                centerMode: true,
                centerPadding: widthpad,
                slidesToShow: 1,
                // dots:true,
                // responsive: [
                //   {
                //     breakpoint: 1024,
                //     settings: {
                //       slidesToShow: 1,
                //       centerPadding: '100px',
                //     }
                //   },
                //   {
                //     breakpoint: 767,
                //     settings: {
                //       slidesToShow: 1,
                //       centerPadding: '50px',
                //     }
                //   }
                // ]
            });
        },
        form_actions: function() {
            var parentform = $('#enquiry-form');
            var form = parentform.find('form');
            var url = form.attr('action');
            var popup = $('.popup-message-form');
            var loading = $('#loading');
            var self = this;
            form.append('<input type="hidden" name="json" value="1" />');
            form.find('.field').eq(0).find('input').val(parentform.attr('data-name'));
            form.find('.field').eq(1).find('input').val(parentform.attr('data-url'));
            var actions = {
                init: function() {
                    var self = this;
                    actions.form_submit();
                    $(window).load(function() {
                        self.csselect_label();
                    })
                },
                csselect_label: function() {
                    var divcselect = $('div.cs-select');
                    divcselect.each(function() {
                        $(this).prepend('<div class="control-label">' + $(this).find('.cs-placeholder').text() + '</div>')
                    })

                },
                form_submit: function() {
                    var self = this;
                    form.submit(function() {
                        var data = new FormData(form[0]);
                        var button = form.find('button');
                        button.prop("disabled", true);
                        form.css('opacity', 0.3);
                        loading.fadeIn();
                        $.ajax({
                            type: "POST",
                            enctype: 'multipart/form-data',
                            url: url,
                            data: data,
                            processData: false,
                            contentType: false,
                            cache: false,
                            timeout: 600000,
                            success: function(resp) {
                                console.log(resp);
                                if (resp.successMsg) {
                                    popup.html('<div class="message message-success">' + resp.successMsg + '</div>');
                                } else {
                                    popup.html('<div class="message message-error">Form Submission failed, please try again.</div>');
                                }
                                self.callback(popup, button, form, loading, parentform);
                            },
                            error: function(e) {
                                console.log(e);
                                popup.html('<div class="message message-error">Form Submission failed, please try again.</div>');
                                self.callback(popup, button, form, loading, parentform);
                            }
                        });
                        return false;
                    });
                },
                callback: function(popup, button, form, loading, parentform) {
                    popup.addClass('active');
                    setTimeout(function() {
                        popup.removeClass('active');
                    }, 7000);

                    button.prop("disabled", false);
                    form.css('opacity', 1);
                    loading.fadeOut();
                    parentform.fadeOut();
                },
            }
            actions.init();
        },
        datetimepicker: function(){
            var today = new Date();
            var tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

            $('.datetimepicker').datetimepicker({
                //language:  'fr',
                // weekStart: 1,
                // todayBtn: 1,
                autoclose: 1,
                // todayHighlight: 1,
                startView: 2, 
                // forceParse: 0,
                showMeridian: 1,
                startDate: tomorrow,
            });
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
    property.init();
});