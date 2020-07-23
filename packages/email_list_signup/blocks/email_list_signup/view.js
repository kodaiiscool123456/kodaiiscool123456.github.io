$(document).ready(function() {
    var _thisblock = {
        newsletter_ajax: function() {
            var form = $('form.email-signup-form');
            var url = form.attr('action');
            form.submit(function() {
                var popup = $(this).next('.popup-newsletter-msg');
                var email = $(this).find('input[name="email"]').val();
                form.find('.loading').fadeIn();
                jQuery.post(url, {
                    'email': email,
                    'pop': 1,
                }, function(resp) {
                    if (resp.errorMsg) {
                        var msg = resp.errorMsg;
                        var tclass = 'alert-danger';
                    }else{
                        var msg = resp.successMsg;
                        var tclass = 'alert-success';
                    }
                    form.find('.msg').html('<div class="text '+tclass+' ">'+msg+'</div>');
                    form.find('.loading').fadeOut();
                });
                return false;
            }); 
        },
    }
    _thisblock.newsletter_ajax();
});