$(document).ready(function () {
    var pID = body.attr('data-page-id') ? body.attr('data-page-id') : 185;
    var pagepath = body.attr('data-page-path');
    var section = $('.section-prop-list');
    var urlPageListFiter = pagepath + '/readPageJson/' + pID;
    var form = $('form#filter-form');
    var ajaxContent = $('#ajx-content');
    var pagination = $('.pagination-append');
    var totalDiv = $('.total-number');
    var currency = body.attr('data-currency');
    var reset = $('.reset-filter');
    var loading = $('#ring-loading');
    var debounce;
    var group = null;
    var property_list = {
        init: function () {
            this.ajax_load();
            this.get_autocomplete();
        },
        ajax_load: function () {
            var actions = {
                init: function () {
                    this.price_slider();
                    this.size_slider();
                    this.firstLoad();
                    this.clickPagination();
                    this.filterLoad();
                    this.transActions();

                    property_list.infoWindowSlideAction();
                },
                price_slider: function () {
                    var self = this;
                    // var url = '/priceRange/' + pID;
                    var url = "/api/dataprice.json";
                    var sliderrange = $("#slider-range");
                    var amount = $("#amount");
                    var min = $('input#min');
                    var max = $('input#max');
                    jQuery.post(url, {}, function (data) {

                        var resp = data[pID];
                        sliderrange.slider({
                            range: true,
                            min: resp.min,
                            max: resp.max,
                            values: [parseInt(min.val()), parseInt(max.val())],
                            slide: function (event, ui) {
                                amount.html(`<span>${currency} </span><span class="value">${ui.values[0].toLocaleString("en")}</span> 
                            <span>- ${currency} </span><span class="value">${ui.values[1].toLocaleString("en")}</span>`);
                                min.val(ui.values[0]);
                                max.val(ui.values[1]);
                                reset.show();
                                clearTimeout(debounce);
                                debounce = setTimeout(function () {
                                    self.PostAjax();

                                }.bind(this), 400);
                            }
                        });
                        amount.html(`<span>${currency} </span><span class="value">${sliderrange.slider("values", 0).toLocaleString("en")}</span>
                    <span>- ${currency} </span><span class="value">${sliderrange.slider("values", 1).toLocaleString("en")}</span>`);
                    });
                },
                size_slider: function () {
                    var self = this;
                    // var url = '/priceRange/' + pID;
                    var url = "/api/datasize.json";
                    var sliderrange = $("#slider-size-range");
                    var amount = $("#sizeamount");
                    var min = $('input#sizemin');
                    var max = $('input#sizemax');
                    jQuery.post(url, {}, function (data) {

                        var resp = data[pID];
                        sliderrange.slider({
                            range: true,
                            min: parseFloat(resp.sizemin),
                            max: parseFloat(resp.sizemax),
                            values: [parseFloat(min.val()), parseFloat(max.val())],
                            slide: function (event, ui) {
                                amount.html(`<span class="value">${ui.values[0].toLocaleString("en")} m<sup>2</sup></span> 
                                <span class="px-2"> - </span><span class="value"> ${ui.values[1].toLocaleString("en")} m<sup>2</sup></span>`);
                                min.val(ui.values[0]);
                                max.val(ui.values[1]);
                                reset.show();
                                clearTimeout(debounce);
                                debounce = setTimeout(function () {
                                    self.PostAjax();

                                }.bind(this), 400);
                            }
                        });
                        amount.html(`<span class="value">${sliderrange.slider("values", 0).toLocaleString("en")} m<sup>2</sup></span>
                        <span class="px-2"> - </span><span class="value"> ${sliderrange.slider("values", 1).toLocaleString("en")} m<sup>2</sup></span>`);

                    });
                },
                firstLoad: function () {
                    var self = this;
                    var str = window.location.href;
                    var res = str.split("?");
                    var url = typeof res[1] !== "undefined" ? urlPageListFiter + '?' + res[1] : urlPageListFiter;
                    loading.fadeIn();
                    jQuery.post(url, {}, function (resp) {
                        self.htmlAjax(resp);
                        loading.fadeOut();
                        // property_list.mapActions(resp);
                    });
                    jQuery.post(url + '?item_page=100000', {}, function (resp) {
                        property_list.mapActions(resp);
                    });
                },
                filterLoad: function () {
                    var self = this;
                    var actions = {
                        init: function () {
                            this.clickAction('#filter-form .input-search button');
                            this.clickAction('#filter-form .cs-options>ul> li');
                        },
                        clickAction: function ($ele) {
                            $(document).on('click', $ele, function () {
                                $('#ccm_paging_p').val(1);
                                self.PostAjax();
                                reset.show();
                                return false;
                            });
                        }
                    }
                    actions.init();
                },
                clickPagination: function () {
                    var self = this;
                    var nav = $('.pagination-append a');
                    $(document).on('click', '.pagination-append a', function () {
                        var url = $(this).attr('data-url');
                        var ccm_paging_p = self.urlParam(url, 'ccm_paging_p');
                        $('#ccm_paging_p').val(ccm_paging_p);
                        self.PostAjax();
                        $('html,body').animate({
                            scrollTop: 0
                        }, 500);
                        return false;

                    })
                },

                urlParam: function (url, name) {
                    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(url);
                    if (results == null) {
                        return null;
                    }
                    return decodeURI(results[1]) || 0;
                },
                PostAjax: function () {
                    var self = this;
                    var data = new FormData(form[0]);
                    section.css('opacity', 0.4);
                    loading.fadeIn();
                    $.ajax({
                        type: "POST",
                        url: urlPageListFiter,
                        data: data,
                        processData: false,
                        contentType: false,
                        cache: false,
                        timeout: 600000,
                        success: function (resp) {
                            self.htmlAjax(resp);
                            section.css('opacity', 1);
                            loading.fadeOut();
                        },
                        error: function (e) {

                        }
                    });

                    // for map
                    $.ajax({
                        type: "POST",
                        url: urlPageListFiter,
                        data: $('#filter-form').serialize() + '&all_page=1',
                        cache: false,
                        timeout: 600000,
                        success: function (allresp) {
                            property_list.mapActions(allresp);
                            // console.log('allresp', allresp);
                        },
                        error: function (e) {

                        }
                    });

                },
                htmlAjax: function (resp) {
                    ajaxContent.empty();
                    pagination.empty();
                    $(resp.list).each(function (i, item) {
                        var badge = item.badge != '' ? `<span class="text-badge">${item.badge}</span>` : '';
                        var size = item.size != null ? `<div class="size col-normal"><i class="icomoon-size"> </i><span>${item.size}</span></div>` : '';
                        var bathroom = item.bathroom != null ? `<div class="bathroom col-small"><i class="icomoon-bath"> </i><span>${item.bathroom}</span></div>` : '';
                        var bedroom = item.bedroom != null ? `<div class="bedroom col-normal"><i class="icomoon-bed"> </i><span>${item.bedroom}</span></div>` : '';
                        var pricetext = item.pricetext != null ? item.pricetext : '';
                        var price = item.price != null ? `<div class="bottom"><div class="price">${currency}${item.price}${pricetext}</div></div>` : '';
                        var transport = item.transport != null ? `<div class="transport mt-3"><i class="fa fa-map-marker"></i> ${item.transport}</div>` : '';
                        var html = ` 
                                    <div class="col-item col-md-12 col-sm-6" data-lat="${item.latitude}" data-long="${item.longtitude}">
                                        <a href="${item.url}" target="_blank"> 
                                            <div class="image lazy" style="background-image:url(${item.thumb})">${badge}</div>
                                            <div class="text">
                                                <div class="name">${item.title}
                                                ${transport}</div>
                                                
                                                <div class="info text-center">
                                                    <div class="top">
                                                        ${size}
                                                        ${bathroom}
                                                        ${bedroom}
                                                    </div>
                                                    ${price}
                                                </div>
                                            </div>
                                        </a>
                                    </div>`;
                        ajaxContent.append(html);
                    });
                    pagination.html(resp.pagination);
                    pagination.find('a').each(function () {
                        var dataurl = $(this).attr('href');
                        $(this).attr('data-url', dataurl);
                        $(this).attr('href', 'javascript:void(0)');
                    })

                    var numberpage = resp.numberpage;
                    var numberstart = ((numberpage.ccm_paging_p - 1) * numberpage.item_page) + 1;
                    var numberend = numberpage.ccm_paging_p * numberpage.item_page;
                    numberend = numberpage.ccm_paging_p * numberpage.item_page > numberpage.total ? numberpage.total : numberend;
                    if (numberpage.total > 0) {
                        totalDiv.html(`Result(s) ${numberstart} - ${numberend} of ${numberpage.total}`);
                    } else {
                        totalDiv.html(`Result 0 of 0`);
                    }
                },
                transActions: function () {
                    var self = this;
                    var nav = $('.trans-nav-list li');
                    var content = $('.trans-content-list .content');
                    var tActions = {
                        init: function () {
                            this.navClick();
                            this.markClick();
                            content.find('.mark').each(function () {
                                if ($(this).hasClass('active')) {
                                    $(this).find('input').val($(this).attr('data-value'));
                                }
                            });
                        },
                        navClick: function () {
                            nav.click(function () {
                                var index = $(this).index();
                                if (!$(this).hasClass('active')) {
                                    nav.removeClass('active');
                                    $(this).addClass('active');
                                    content.slideUp();
                                    content.eq(index).slideDown();
                                }
                            });
                        },
                        markClick: function () {
                            $('.trans-content-list .map').each(function () {
                                var name = $(this).attr('data-name');
                                var mark = $(this).find('.mark');
                                mark.each(function () {
                                    var id = $(this).attr('id');
                                    $(this).append('<input type="hidden" name="' + name + '[]" data-id="' + id + '" />');
                                });
                                mark.click(function () {
                                    var value = $(this).attr('data-value');
                                    if (!$(this).hasClass('active')) {

                                        $(this).addClass('active');
                                        $(this).find('input').val(value);
                                    } else {
                                        $(this).removeClass('active');
                                        $(this).find('input').val('');
                                    }
                                    self.PostAjax();
                                    reset.show();
                                });
                            });

                        },
                    }
                    tActions.init();
                },
            }
            actions.init();
        },
        get_autocomplete: function () {
            var self = this;
            var url = "/api/sourceList.json";
            var auc = $('#keyword');
            jQuery.post(url, {}, function (data) {
                var resp = data[pID];
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
        mapActions: function (resp) {
            var numberpage = resp.numberpage;
            var locations = [];
            var infocontent = [];
            if (!group && resp.list.length > 0) group = property_list.groupData(resp.list);
            $(resp.list).each(function (i, item) {
                var contentSlide = '';
                if (item.prID != '' && group[item.prID] && group[item.prID].length > 1) {
                    contentSlide += '<div class="control"><button class="prev" data-type="prev"></button><button class="next" data-type="next"></button></div>';
                    $(group[item.prID]).each(function (_i, _item) {
                        var _badge = _item.badge != '' ? `<span class="text-badge">${_item.badge}</span>` : '';
                        var _size = _item.size != null ? `<div class="size col-normal"><i class="icomoon-size"> </i><span>${_item.size}</span></div>` : '';
                        var _bathroom = _item.bathroom != null ? `<div class="bathroom col-small"><i class="icomoon-bath"> </i><span>${_item.bathroom}</span></div>` : '';
                        var _bedroom = _item.bedroom != null ? `<div class="bedroom col-normal"><i class="icomoon-bed"> </i><span>${_item.bedroom}</span></div>` : '';
                        var _pricetext = _item.pricetext != null ? _item.pricetext : '';
                        var _price = _item.price != null ? `<div class="bottom"><div class="price">${currency}${_item.price}${_pricetext}</div></div>` : '';
                        var _transport = _item.transport != null ? `<div class="transport mt-2"><i class="fa fa-map-marker"></i> ${_item.transport}</div>` : '';
                        var _default = item.cID == _item.cID ? 'class="default active"' : '';
                        contentSlide += `<a href="${_item.url}" target="_blank" ${_default} data-id='${_i}'> 
                                                <div class="image lazy" style="background-image:url(${_item.thumb})">${_badge}</div>
                                                <div class="text">
                                                    <div class="name">${_item.title} ${_transport}</div>
                                                    <div class="info text-center">
                                                        <div class="top">
                                                            ${_size}
                                                            ${_bathroom}
                                                            ${_bedroom}
                                                        </div>
                                                        ${_price}
                                                    </div>
                                                </div>
                                            </a>`;
                    });
                    contentSlide += `<p class="total" data-start="1" data-end="${group[item.prID].length}"><span class="start">1</span>/<span class="end">${group[item.prID].length}</span></p>`;
                }
                locations.push([item.title, item.latitude, item.longtitude]);
                var badge = item.badge != '' ? `<span class="text-badge">${item.badge}</span>` : '';
                var size = item.size != null ? `<div class="size col-normal"><i class="icomoon-size"> </i><span>${item.size}</span></div>` : '';
                var bathroom = item.bathroom != null ? `<div class="bathroom col-small"><i class="icomoon-bath"> </i><span>${item.bathroom}</span></div>` : '';
                var bedroom = item.bedroom != null ? `<div class="bedroom col-normal"><i class="icomoon-bed"> </i><span>${item.bedroom}</span></div>` : '';
                var pricetext = item.pricetext != null ? item.pricetext : '';
                var price = item.price != null ? `<div class="bottom"><div class="price">${currency}${item.price}${pricetext}</div></div>` : '';
                var transport = item.transport != null ? `<div class="transport mt-2"><i class="fa fa-map-marker"></i> ${item.transport}</div>` : '';
                var hasSlide = item.prID != '' && group[item.prID] && group[item.prID].length > 1 ? 'has-slide' : '';
                var contentString = `<div class="info-content ${hasSlide}" id="iw_content" data-lat="${item.latitude}" data-long="${item.longtitude}"><div>`;
                if (contentSlide != '') contentString += contentSlide;
                else {
                    contentString += `<a href="${item.url}" target="_blank" class="default"> 
                                                <div class="image lazy" style="background-image:url(${item.thumb})">${badge}</div>
                                                <div class="text">
                                                    <div class="name">${item.title} ${transport}</div>
                                                    <div class="info text-center">
                                                        <div class="top">
                                                            ${size}
                                                            ${bathroom}
                                                            ${bedroom}
                                                        </div>
                                                        ${price}
                                                    </div>
                                                </div>
                                            </a>`;
                }
                contentString += `</div></div>`;

                infocontent.push(contentString);
            });

            if (numberpage.total == 0) {
                var centerPos = new google.maps.LatLng(13.743413, 100.529573);
            } else {
                var centerPos = new google.maps.LatLng(locations[0][1], locations[0][2]);
            }
            var myOptions = {
                disableDefaultUI: true,
                scrollwheel: true,
                draggable: true,
                zoom: 14,
                center: centerPos,
                zoomControl: true,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.SMALL,
                },

            };
            var map = new google.maps.Map(document.getElementById("map"), myOptions);
            var infowindow = new google.maps.InfoWindow();
            google.maps.event.addListener(infowindow, 'domready', function () {
                var iwOuter = $('.gm-style-iw');
                var iwBackground = iwOuter.prev();
                iwBackground.children(':nth-child(2)').css({
                    'display': 'none'
                });
                iwBackground.children(':nth-child(4)').css({
                    'display': 'none'
                });
                if ($('#iw_content').length) {
                    el = document.getElementById('iw_content').parentNode.parentNode.parentNode;
                    el.firstChild.setAttribute('class', 'closeInfoWindow');
                    el.firstChild.setAttribute('title', 'Close Info Window');
                    el = el.previousElementSibling || el.previousSibling;
                    // el.setAttribute('class', 'infoWindowBackground');
                }
            });
            var marker, i;
            for (i = 0; i < locations.length; i++) {
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map,
                    icon: '/application/themes/kos/images/acp-pin-dark.png',
                });
                google.maps.event.addListener(marker, 'mouseover', (function (marker, i) {
                    return function () {
                        // marker.infowindow.close();
                        infowindow.setContent(infocontent[i]);
                        infowindow.open(map, marker);
                    }
                })(marker, i));


                // google.maps.event.addListener(marker, 'mouseout', (function(marker, infowindow) {
                //     return function() {
                //       infowindow.close();
                //     };
                //   })(marker, infowindow));

                jQuery(document).click(function (e) {
                    if (e.target.className != 'next' && e.target.className != 'prev') infowindow.close();
                })


                google.maps.event.addListener(marker, 'click', (function (marker, i) {
                    return function () {
                        // infoWindow.close();

                        infowindow.setContent(infocontent[i]);
                        infowindow.open(map, marker);
                    }
                })(marker, i));
            }

            $('#ajx-content').on('mouseover', '.col-item', function () {
                var index = $(this).index();
                var latlng = new google.maps.LatLng($(this).attr('data-lat'), $(this).attr('data-long'));
                marker.setPosition(latlng);
                infowindow.setContent(infocontent[index]);
                infowindow.open(map, marker);
                // map.setCenter(new google.maps.LatLng(parseFloat($(this).attr('data-lat')) + 0.01, parseFloat($(this).attr('data-long'))));

            });
            $('#ajx-content').on('mouseout', '.col-item', function () {
                infowindow.close();
            });
        },
        groupData: function (orgs) {
            var results = orgs.reduce(function (results, org) {
                if (org.prID)(results[org.prID] = results[org.prID] || []).push(org);
                return results;
            }, {});
            return results;
        },
        infoWindowSlideAction: function () {
            $('.col-map-list').on('click', '.has-slide .control>button', function () {
                var _type = $(this).attr('data-type');
                _parent = $(this).parents('.info-content');
                _id = parseInt(_parent.find('.active').attr('data-id')),
                    _max = parseInt(_parent.find('>div>a').size()),
                    _next = 0;
                _parent.addClass('active-slide');

                if (_type == 'next') _next = _id + 1 >= _max ? 0 : _id + 1;
                else if (_type == 'prev') _next = _id - 1 < 0 ? _max - 1 : _id - 1;

                _parent.find('>div>a').removeClass('active');
                _parent.find('>div>a[data-id="' + _next + '"]').addClass('active');
                _parent.find('.total .start').text((_next + 1));
            });
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
    property_list.init();
});