var edit = $('body.edit').length,
	$window = $(window),
	html = $('html'),
	body = $('body'),
	header = $('header'), 
	article = $('article'),
	footer = $('footer');
	var script = { 
		get_lazy:function(){
			$('.lazy').lazy();
		},
		get_background : function(e){
			e.each(function(){
				var img = $(this).find('img');
				if(img.length){ 
					var src = img.attr('src');
					$(this).css('background-image','url('+src+')');
				}				
			})

		},
		visibility : function(e){
			e.css('visibility','visible');
		},
		visibility_hidden : function(e){
			e.css('visibility','hidden');
		},		
		visibility_toggle: function(e){
			e.css('visibility') == 'visible' ? e.css('visibility','hidden') : e.css('visibility','visible');
		},	
		get_delay:function(e){
			e.each(function(){
				var datadelay = $(this).attr('data-delay');
				if(datadelay!='') {
					$(this).css({
					   '-webkit-transition-delay': datadelay+'s' ,
						    '-moz-transition-delay':datadelay+'s' ,
						      '-o-transition-delay':datadelay+'s' ,
						     '-ms-transition-delay':datadelay+'s' ,
					            'transition-delay':datadelay+'s' ,						
					})
				}
			})
		},	
		addClass:function(el,cls){
			el.addClass(cls);
		},
		removeClass:function(el,cls){
			el.addClass(cls);
		},
        switch_elem: function(block,i) {
            if (!edit) { 
                block.each(function(index) {
                    var blockimage = $(this).find('.block-image');
                    var blocktext = $(this).find('.block-text');
                    if (index % 2 == i) {
                        blockimage.insertAfter(blocktext);
                    } 
                })
            }
        },
	}