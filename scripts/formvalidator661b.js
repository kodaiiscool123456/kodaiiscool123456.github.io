
if(typeof(Prototype)=="undefined"){throw"protoValid requires prototype.js";}
if(typeof(Effect)=="undefined"){throw"protoValid requires scriptaculous.js";}
var protoValid=Class.create({initialize:function(options){this.options={form:"myForm",valid:"tick",notValid:"cross",msgElement:"span",effectShow:"Appear",effectHide:"Fade",regexes:{email:"^[-!#$%&'*+\\/0-9=?A-Z^_a-z{|}~](\\.?[-!#$%&'*+\\/0-9=?A-Z^_a-z{|}~])*@[a-zA-Z0-9](-?[a-zA-Z0-9])*(\\.[a-zA-Z0-9](-?[a-zA-Z0-9])*)+$",string:"[^\\\\]*(?:\\\\.[^\\\\]*)*",number:"\\b\\d+\\b"},validateOnBlur:true,clearOnFocus:false,passwordToggles:false,extend:null};this.internals={event:null,form:null,validated:[]};Object.extend(this.options,options||{});this.internals.form=$(this.options.form);if(!this.internals.form)return false;this.internals.form.observe("submit",function(ev){this.internals.event=ev;this.validateForm();}.bind(this));if(this.options.validateOnBlur===true){this.internals.form.getElements().invoke("observe","blur",function(ev){this.internals.event=ev;this.validateElement(ev.element());}.bind(this));}
if(this.options.clearOnFocus===true){this.internals.form.getElements().invoke("observe","focus",function(ev){var el=ev.element();if(el.hasClassName(this.options.notValid)){$(el).next(this.options.msgElement).hide();}
el.removeClassName(this.options.valid).removeClassName(this.options.notValid);}.bind(this));}
if(this.options.passwordToggles===true){this.internals.form.getInputs('password').each(function(el){var chk=el.id+'_chk';el.insert({after:'<input type="checkbox" id="'+chk+'">'});$(chk).observe("click",function(){var chkel=($(chk).id).replace("_chk","");if($(chk).checked){$(chkel).type="text";}else{$(chkel).type="password";}});},this);}},validateForm:function(){this.internals.form.getElements().each(function(el){this.validateElement(el);},this);},validateElement:function(el){if(el.className.include('required'))this.validateRequired(el);if(el.className.include('optional')||el.className.include('combo'))this.validateOptional(el);if(el.className.include('duplicate')){if(el.className.include('optional')){this.validateOptional(el);}else{this.validateRequired(el);}}},validateOptional:function(el){if($F(el).strip()){this.validateRegexp(el);}else{this.passValidation(el);}},validateRequired:function(el){if(el.type=='checkbox'){if(!el.checked){this.failValidation(el);}else{this.passValidation(el);}}else{if(!$F(el).strip()){this.failValidation(el);}else{this.validateRegexp(el);}}},validatedObjectsAdd:function(el){if(this.internals.validated.indexOf(el.id)==-1){this.internals.validated.push(el.id);}},validatedObjectsRemove:function(el){if(this.internals.validated.indexOf(el.id)!=-1){this.internals.validated.splice(this.internals.validated.indexOf(el.id),1);}},validateRegexp:function(el){for(var regex in(this.options.regexes)){if(el.hasClassName(regex)){var regexp=new RegExp(this.options.regexes[regex]);var match=regexp.exec($F(el));if(match!==null){this.passValidation(el);}else{this.failValidation(el);}}}},validateCombo:function(el){el.className.match(/(?:^|\s+)combi-(\d+)(?:\s|$)/);var ocid=RegExp.$1;var cont=true;var combos=this.internals.form.select('.combi-'+ocid);combos.each(function(elm){if(this.internals.validated.indexOf(elm.id)==-1){this.validateElement(elm);cont=false;}},this);if(cont){var allempty=true;combos.each(function(elmt){if($F(elmt).strip())allempty=false;});if(allempty){this.failElementValidations(combos);}else{this.passElementValidations(combos);}}},validateDuplicate:function(el){el.className.match(/(?:^|\s+)dupe-(\d+)(?:\s|$)/);var val=RegExp.$1;var cont=true;var duplicates=this.internals.form.select('.dupe-'+val);duplicates.each(function(elm){if(this.internals.validated.indexOf(elm.id)==-1){cont=false;throw $break;}},this);if(cont){var value=null;duplicates.each(function(e){fail=(value=value||$F(e))!==$F(e);},this);if(fail){this.failElementValidations(duplicates);}else{this.passElementValidations(duplicates);}}else{this.styleValidationResult(el,this.options.valid);}},passValidation:function(el){this.validatedObjectsAdd(el);if(el.className.include('duplicate')){this.validateDuplicate(el);}else if(el.className.include('combo')){this.validateCombo(el);}else{this.styleValidationResult(el,this.options.valid);}},passElementValidations:function(el){if(Object.isArray(el)){el.each(function(e){this.styleValidationResult(e,this.options.valid);},this);}else{this.styleValidationResult(el,this.options.valid);}},failElementValidations:function(el){if(Object.isArray(el)){el.each(function(e){this.styleValidationResult(e,this.options.notValid);},this);}else{this.styleValidationResult(el,this.options.notValid);}},styleValidationResult:function(el,newclass){var testclass=(newclass==this.options.valid)?this.options.notValid:this.options.valid;var errEl="";if(!$(el).hasClassName(newclass)){$(el).removeClassName(testclass).addClassName(newclass);}
if(newclass==this.options.notValid){errEl=$(el).next(this.options.msgElement);$(errEl).update($(el).title).hide();new Effect[this.options.effectShow](errEl);}else{errEl=$(el).next(this.options.msgElement);if($(errEl).visible()){new Effect[this.options.effectHide](errEl);}}},failValidation:function(el){if(this.internals.event)Event.stop(this.internals.event);this.validatedObjectsRemove(el);this.failElementValidations(el);}});