$(document).ready(function () {
    var homepage = {
        init: function () {
            this.load();
            this.resize();
            this.top_slider();
            this.form_actions();
            this.moving_service();

        },
        top_slider: function () {
            var self = this;
            var parent = $('.section-top-page');
            var slider = parent.find('.block-gallery-list>div');
            var item = slider.find('.item');

            if (item.length > 1) {
                slider.bxSlider({
                    speed: 1200,
                    pause: 9000,
                    adaptiveHeight: true,
                    auto: true,
                    mode: 'fade',
                    controls: false,
                    onSliderLoad: function () {},
                    onSlideAfter: function (currentIndex, oldIndex, newIndex) {
                        item.removeClass('navInNext').removeClass('navOutNext').removeClass('navInPrev').removeClass('navOutPrev');
                    },
                    onSlideBefore: function (currentIndex, oldIndex, newIndex) {
                        item.eq(newIndex).addClass('navInNext').removeClass('navOutNext');
                        item.eq(oldIndex).addClass('navOutNext').removeClass('navInNext');
                    },
                    onSlidePrev: function (currentIndex, oldIndex, newIndex) {
                        item.eq(newIndex).addClass('navInPrev').removeClass('navOutPrev');
                        item.eq(oldIndex).addClass('navOutPrev').removeClass('navInPrev');
                    },
                    onSlideNext: function (currentIndex, oldIndex, newIndex) {
                        item.eq(newIndex).addClass('navInPrev').removeClass('navOutPrev');
                        item.eq(oldIndex).addClass('navOutPrev').removeClass('navInPrev');
                    },
                })
            }
        },
        form_actions: function () {
            var section = $('.filter-form-wrapper');
            var form = $('#filter-form');
            var nav = section.find('.nav-list li');
            var actions = {
                init: function () {
                    form.attr('action', nav.first().attr('data-url'));
                    var $pID = nav.first().attr('data-id');
                    this.nav_toggle();
                    this.price_slider($pID);
                    this.transToggle();
                    this.clickTrans();
                    this.get_autocomplete($pID);
                },
                nav_toggle: function () {
                    var self = this;
                    nav.click(function () {
                        var data_filter = $(this).attr('data-filter');
                        nav.removeClass('active');
                        $(this).addClass('active');
                        if (data_filter == 'search-nav') {
                            var url = $(this).attr('data-url');
                            form.attr('action', url);
                            var $pID = $(this).attr('data-id');
                            self.price_slider($pID);
                            self.get_autocomplete($pID);
                        }

                        if (!$('.filter-fields-item[data-item=' + data_filter + ']').hasClass('active')) {
                            $('.filter-fields-item').slideUp().removeClass('active');;
                            $('.filter-fields-item[data-item=' + data_filter + ']').slideDown().addClass('active');
                        }
                    });
                },
                price_slider: function ($pID) {
                    var self = this;
                    // var url = "/priceRange/" + $pID;
                    var url = "/api/dataprice.json";
                    var sliderrange = $("#slider-range");
                    var amount = $("#amount");
                    var min = $('input#min');
                    var max = $('input#max');
                    jQuery.post(url, {}, function (data) {
                        var resp = data[$pID];
                        sliderrange.slider({
                            range: true,
                            min: resp.min,
                            max: resp.max,
                            values: [resp.min, resp.max],
                            slide: function (event, ui) {
                                amount.html(`<span>฿ </span><span class="value">${ui.values[0].toLocaleString("en")}</span> 
                                    <span>- ฿ </span><span class="value">${ui.values[1].toLocaleString("en")}</span>`);
                                min.val(ui.values[0]);
                                max.val(ui.values[1]);

                            }

                        });
                        amount.html(`<span>฿ </span><span class="value">${sliderrange.slider("values", 0).toLocaleString("en")}</span>
                            <span>- ฿ </span><span class="value">${sliderrange.slider("values", 1).toLocaleString("en")}</span>`);
                        min.val(resp.min);
                        max.val(resp.max);

                    });
                },
                transToggle: function () {
                    var nav = $('.trans-nav-list li');
                    var content = $('.trans-content-list .content');
                    nav.click(function () {
                        var index = $(this).index();
                        if (!$(this).hasClass('active')) {
                            nav.removeClass('active');
                            $(this).addClass('active');
                            content.slideUp();
                            content.eq(index).slideDown();
                        }
                    })
                },
                clickTrans: function () {
                    var self = this;
                    $('.trans-content-list .map').each(function () {
                        var name = $(this).attr('data-name');
                        var mark = $(this).find('.mark');
                        mark.each(function () {
                            var id = $(this).attr('id');
                            $(this).append('<input type="hidden" name="' + name + '[]" data-id="' + id + '" />')
                        });
                        mark.click(function () {
                            var value = $(this).attr('data-value');
                            if (!$(this).hasClass('active')) {
                                $(this).find('input').val(value);
                                $(this).addClass('active');
                            } else {
                                $(this).removeClass('active');
                                $(this).find('input').val('');
                            }

                            // self.PostAjax();

                        })
                    })
                },
                get_autocomplete: function ($pID) {
                    var self = this;
                    // var url = '/sourceList/' + $pID;
                    var url = "/api/sourceList.json";
                    var auc = $('#keyword');
                    $('.autocomplete-suggestions').remove();
                    jQuery.post(url, {}, function (data) {
                        var resp = data[$pID];
                        auc.autoComplete({
                            minChars: 1,
                            source: function (term, suggest) {
                                term = term.toLowerCase();
                                var choices = resp;
                                var suggestions = [];
                                for (i = 0; i < choices.length; i++)
                                    if (~choices[i].toLowerCase().indexOf(term)) suggestions.push(choices[i]);
                                suggest(suggestions);
                            }
                        });
                    });



                },
            }
            actions.init();
        },
        moving_service:function(){
            var section = $('.fields-moving-service');
            var content = $('#moving-service-content');
            var contentform = $('#moving-service-form');
            var form = $('#ms-form');
            var popOverlay = $('.pop-overlay');
            var actions = {
                init : function(){
                    this.datepicker();
                    this.toggle();
                    this.submit();
                },
                datepicker: function(){
                    contentform.find( ".datepicker" ).datepicker({
                        minDate: 1 
                    });
                },
                toggle:function(){
                    section.find('.ms-toggle').click(function(){
                        content.stop(true, true).slideToggle();
                        contentform.stop(true, true).slideToggle();
                        return false;
                    })
                },
                submit: function () {
                    var chkCall = 0;
                    form.validate({
                        success: function(error) {
                            // console.log("Successfully validated");
                        },
                        submitHandler: function(form) {
                            chkCall++;
                            if (chkCall == 1) {
                                widgetId1 = grecaptcha.render('recaptcha-moving', {
                                    'sitekey': '6LduuysUAAAAAH7I2bIAnjvarHd9SpdZoyKOe9QR',
                                    'callback': onSubmit1,
                                    'size': "invisible"
                                });
                            }
                            grecaptcha.reset(widgetId1);
                            grecaptcha.execute(widgetId1);
                            popOverlay.addClass('active');
                        },
                    });

                    function onSubmit1(token) {
                        var url = form.attr('action');
                        var msgbox = $('.pop-list-message');
                        form.find('#responserecaptcha-moving').val(token);
                        var data = new FormData(form[0]);
                        $.ajax({
                            type: "POST",
                            enctype: 'multipart/form-data',
                            url: url,
                            data: data,
                            processData: false,
                            contentType: false,
                            cache: false,
                            timeout: 600000,
                            success: function (resp) {
                                if (resp.successMsg) {
                                    msgbox.html('<div class="message message-success">' + resp.successMsg + '</div>');
                                } else {
                                    msgbox.html('<div class="message message-error">Form Submission failed, please try again.</div>');
                                }
                                callback();
                                // console.log(resp);
                            },
                            error: function (e) {
                                // console.log(e);
                                msgbox.html('<div class="message message-error">Form Submission failed, please try again.</div>');
                                callback();
                            }
                        });
                        var callback = function () {
                            setTimeout(function () {
                                popOverlay.removeClass('active');
                                msgbox.empty();
                                content.stop(true, true).slideToggle();
                                contentform.stop(true, true).slideToggle();
                            }, 7000);
                        }
                    };
                },
            }
            actions.init();



        },
        load: function () {
            var self = this;
            $window.load(function () {

            })
        },
        resize: function () {
            var self = this;
            $window.resize(function () {

            })
        }
    }
    homepage.init();
});