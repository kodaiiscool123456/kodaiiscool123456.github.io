var edit = $('body.edit').length,
    $window = $(window),
    html = $('html'),
    body = $('body'),
    header = $('header'),
    article = $('article'),
    footer = $('footer');

$(document).ready(function () {
    var global = {
        init: function () {
            this.get_lazy();
            this.xs_menu_toggle();
            this.scroll_shrink();
            this.popup_toggle();
            this.scrollto();
            this.get_csselect();
            this.section_min_height();
            this.section_max_height();
            this.get_image_background();
            this.page_min_height();
            this.padding_top_head();
            this.get_fancybox();
            this.list_property();
            this.load();
            this.resize();
            this.overlay_load();
        },
        overlay_load: function () {
            var overlay = $('#overlay-load');
            overlay.fadeOut();
        },
        get_lazy: function () {
            $('.lazy').lazy();
        },
        xs_menu_toggle: function () {
            var xsbar = $('.xs-head-bars');
            var xstoggle = $('.xs-head-toggle');
            xsbar.click(function () {
                xsbar.toggleClass('active');
                xstoggle.toggleClass('open');
            })
        },
        padding_top_head: function () {
            var section = $('.padding-top-head');
            var hh = header.outerHeight();
            section.css('padding-top', hh);
            article.css('padding-top', hh);
        },
        scroll_shrink: function () {
            var self = this;
            if (!edit) {
                var wh = $window.height();
                $(window).scroll(function () {
                    var scroll = getCurrentScroll();
                    if (scroll >= 400) body.addClass('shrink-2');
                    else body.removeClass('shrink-2');
                    if (scroll >= 200) body.addClass('shrink');
                    else body.removeClass('shrink');
                    if (scroll == 0) {
                        setTimeout(function () {
                            self.padding_top_head();
                        }, 400);

                    }
                });

                function getCurrentScroll() {
                    return window.pageYOffset;
                }
            }
        },
        scrollto: function () {
            var scrollto = $('.scrollto');
            scrollto.click(function () {
                var datapos = $(this).attr('data-pos')
                if (typeof datapos === "undefined") {
                    var id = $(this).attr('data-id');
                    if ($('#' + id).length) {
                        $('html,body').animate({
                            scrollTop: $('#' + id).offset().top
                        }, 500);
                    }
                } else {
                    if (datapos != '') {
                        $('html,body').animate({
                            scrollTop: parseInt(datapos)
                        }, 500);
                    }

                }

                return false;
            });

            $('a[href^="#"]').click(function () {
                var id = $(this).attr('href');
                if ($(id).length) {
                    $('html,body').animate({
                        scrollTop: $(id).offset().top
                    }, 500);
                    return false;
                }
            });
        },
        popup_toggle: function () {
            var toggle = $('.toggle-pop');
            toggle.click(function () {
                var id = $(this).attr('data-pop');
                var pop = $('#' + id);
                $(this).toggleClass('active');
                pop.each(function () {
                    if ($(this).attr('data-action') == 'fade') $(this).fadeToggle();
                    else if ($(this).attr('data-action') == 'slide') $(this).stop(true, true).slideToggle();
                    $(this).toggleClass('active');

                });
                if ($(this).hasClass('scroll')) {
                    $('html,body').animate({
                        scrollTop: pop.offset().top - 150
                    }, 500);
                }
                // console.log(header.outerHeight());
                return false;
            })
        },
        section_min_height: function () {
            var wh = $window.height();
            var section = $('.section-min-page');
            section.css('min-height', wh);
        },
        section_max_height_xh: function () {
            var wh = $window.height();
            var hh = header.outerHeight();
            var section = $('.section-max-page-xh');
            section.css('max-height', wh - hh);
        },
        section_min_height_xh: function () {
            var wh = $window.height();
            var hh = header.outerHeight();
            var section = $('.section-min-page-xh');
            section.css('min-height', wh - hh);
        },
        section_max_height: function () {
            var wh = $window.height();
            var section = $('.section-max-page');
            section.css('max-height', wh);
        },
        get_image_background: function () {
            var section = $('.background');
            section.each(function () {
                var img = $(this).find('img');
                if (img.length) {
                    var src = img.attr('src');
                    $(this).css('background-image', 'url(' + src + ')');
                }
            })
        },
        page_min_height: function () {
            var wh = $window.height();
            var hh = header.outerHeight();
            article.css('min-height', wh - hh);
        },
        get_csselect: function () {
            var self = this;
            var select = $('select.cs-select');
            var wload = $('select.cs-select.cs-select-wload');

            if (wload.length) {
                $window.load(function () {
                    getActione();
                });
            } else {
                if (select.length) {
                    getActione();
                }

            }

            function getActione() {
                [].slice.call(document.querySelectorAll('.cs-select')).forEach(function (el) {
                    new SelectFx(el, {
                        onChange: function (url) {
                            if (el.classList.contains('cs-redirect')) {
                                window.location = url;
                            }
                        }
                    });
                });
            }

            var divcsselect = $('div.cs-select');
            divcsselect.each(function () {
                var li = $(this).find('ul li');
                var select = $(this).find('select');

                li.click(function () {
                    var datavalue = $(this).attr('data-value');
                    if (datavalue != '') $(this).parents('.cs-select').find('.cs-placeholder,.control-label').addClass('active');
                    else $(this).parents('.cs-select').find('.cs-placeholder,.control-label').removeClass('active');
                });

                if (select.val() != '') {
                    $(this).find('.cs-placeholder,.control-label').addClass('active');
                }

            });


            var custom_actions = {
                init: function () {
                    this.cs_target_toggle();
                    this.cs_multi_select();
                },
                cs_target_toggle: function () {
                    document.addEventListener('click', function (ev) {
                        var target = ev.target;
                        var parent = $(this).parent();
                        if ($(ev.target).hasClass('cs-custom-options') ||
                            $(ev.target).parents().hasClass('cs-custom-options') ||
                            $(ev.target).parent().hasClass('cs-custom-options') ||
                            $(ev.target).hasClass('placeholder-custom') ||
                            $(ev.target).hasClass('custom-div') ||
                            $(ev.target).parents().hasClass('custom-div') ||
                            $(ev.target).parent().hasClass('custom-div')) {

                        } else {
                            $('div').removeClass('cs-custom-active');
                        }

                    });
                    $('.placeholder-custom').click(function (ev) {
                        var parent = $(this).parent();
                        if (parent.hasClass('cs-custom-active')) {
                            parent.removeClass('cs-custom-active');

                        } else {
                            $('.field-select').removeClass('cs-custom-active');
                            parent.addClass('cs-custom-active');
                        }
                    });
                },
                cs_multi_select: function () {
                    var multiselect = $('div.cs-select-multi');
                    var li = multiselect.find('.cs-options li');
                    var option = multiselect.find('option');
                    var thismulti = {
                        initEvent: function () {
                            li.each(function () {
                                var parents = $(this).parents('div.cs-select-multi');
                                var csselect = parents.find('select.cs-select');
                                var name = csselect.attr('name');
                                var count = csselect.attr('data-count');
                                var placeholder = parents.find('.cs-placeholder');
                                var value = $(this).attr('data-value');
                                if (value != '') $(this).append('<input type="checkbox" name="' + name + '[]" value="' + value + '">');
                                if (count != '' && (typeof count !== "undefined") && count != '0') placeholder.text(count + ' items selected');
                            });

                            option.each(function () {
                                var parents = $(this).parents('div.cs-select-multi');
                                var li = parents.find('.cs-options li');
                                var index = $(this).index();
                                if ($(this).prop("selected") == true) {
                                    li.eq(index).addClass('mselected');
                                    li.eq(index).find('input').prop("checked", true);
                                }
                            });
                            multiselect.find('select.cs-select').remove();
                            this.clickEvent();
                        },
                        clickEvent: function () {
                            li.click(function () {
                                var parents = $(this).parents('div.cs-select-multi');
                                var input = $(this).find('input');
                                if (input.is(':checked')) input.prop("checked", false);
                                else input.prop("checked", true);


                                var placeholder = parents.find('.cs-placeholder');
                                var slen = parents.find('.mselected').length;
                                if (slen != '' && (typeof slen !== "undefined") && slen != '0') placeholder.text(slen + ' items selected');
                                else placeholder.text(parents.find('li').first().find('span').text());

                            });
                        },
                    }
                    thismulti.initEvent();


                }
            }
            custom_actions.init();


        },
        get_fancybox: function () {
            if ($('[data-fancybox]').length) {
                $('[data-fancybox]').fancybox({
                    loop: true
                })
            }
        },
        list_property: function () {
            var pop = $('.list-property-pop');
            var popOverlay = $('.pop-overlay');
            var form = pop.find('form');
            var nav = $('.list-property-pop .list-nav ul li');
            var fieldsHtml = pop.find('.fields-init').html();
            var actions = {
                init: function () {
                    this.selectChange();
                    this.next();
                    this.back();
                    this.addnew();
                    this.remove();
                    this.submit();
                },
                selectChange:function(){
                    select = pop.find('.select-box select');
                    select.change(function() {
                        var val = $(this).val();
                        if(val!='') $(this).addClass('active');
                        else $(this).removeClass('active');
                    });
                },
                next: function () {
                    var self = this;
                    pop.find('.next').click(function () {
                        if (form.valid()) {
                            var parents = $(this).parents('.fields-item');
                            parents.slideUp();
                            parents.next('.fields-item').slideDown();
                            var nextindex = parents.next('.fields-item').index();
                            nav.removeClass('active');
                            nav.eq(nextindex).addClass('active');
                        }
                        return false;
                    })
                },
                back: function () {
                    pop.find('.back').click(function () {
                        var parents = $(this).parents('.fields-item');
                        parents.slideUp();
                        parents.prev('.fields-item').slideDown();
                        var previndex = parents.prev('.fields-item').index();
                        nav.removeClass('active');
                        nav.eq(previndex).addClass('active');
                        return false;
                    });
                },
                addnew:function(){
                    var self = this;
                    var addButton  = pop.find('.fields-actions .add');
                    addButton.click(function(){
                        var parents = $(this).parents('.fields-item');
                        parents.find('.fields-list').append('<div class="fields row fields-new"><div class="fields-close"><span></span></div>'+fieldsHtml+'</div>');
                        var last = parents.find('.fields-new').last();
                        last.find('.field-box').each(function(){
                            var dataname = $(this).attr('data-name');
                            var datatype = $(this).attr('data-type');
                            $(this).attr('name',datatype+'['+dataname+']['+last.index()+']');
                            $(this).attr('id',datatype+'['+dataname+']['+last.index()+']');
                        });

                        self.selectChange();
                    })
                },
                remove:function(){
                    pop.on('click','.fields-close', function(){
                        $(this).parent().remove();
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
                                widgetId1 = grecaptcha.render('recaptcha1', {
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
                        var listform = $('#list-property-form');
                        var button = listform.find('button');
                        var url = listform.attr('action');
                        var msgbox = $('.pop-list-message');
                        listform.find('#responserecaptcha').val(token);
                        var form = $('#list-property-form')[0];
                        var data = new FormData(form);
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
                            pop.slideUp();
                            $('.menu-after a').removeClass('active');
                            setTimeout(function () {
                                popOverlay.removeClass('active');
                                msgbox.empty();
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
                self.section_max_height();
                self.section_min_height();
                self.section_max_height_xh();
                self.section_min_height_xh();
                self.page_min_height();
                if ($('*[data-enllax-type]').length) {
                    if ($window.width() > 767) {
                        $(window).enllax();
                    }

                }
            })
        },
        resize: function () {
            var self = this;
            $window.resize(function () {
                self.section_max_height();
                self.section_min_height();
                self.section_max_height_xh();
                self.section_min_height_xh();
                self.page_min_height();
            })
        },


    }
    global.init();
});