// Dom7
var $$ = Dom7;
animations = ["رنگین کمان", "رنگین کمان+درخشش", "تپش تصادفی", "ستاره دنباله دار", "3 ستاره دنباله دار", "رفت و برگشتی", "7 رنگ پیوسته"];
//format of animListSaveObj ===> [['ll',[1,2,3]],['mmm',[5,6,7,8,9,10]]];
animListSaveObj=JSON.parse(localStorage.getItem('listSaveLocalStorage'));
if(!animListSaveObj){animListSaveObj=[]};
console.log(animListSaveObj);
var itemToAddAnimationAfter = '';
var powerState=true;
var deviceIP="http://192.168.1.10/";


// Init App
var app = new Framework7({
    id: 'io.framework7.testapp',
    root: '#app',
    theme: 'md',
    statusbar: {
        materialBackgroundColor: '#303e8e',
    },
    data: function() {
        return {
            user: {
                firstName: 'John',
                lastName: 'Doe',
            },
        };
    },
	view: {
		pushState: true,
	},
    methods: {
        helloWorld: function() {
            app.dialog.alert('Hello World!');
        },
    },
});


// Handle Cordova Device Ready Event
/*
$$(document).on('deviceready', function() {
    document.addEventListener("backbutton", onBackKeyDown, false);
});

function onBackKeyDown(e) {
			  app.dialog.create({
    title: 'خروج',
    text: 'آیا مایلید از نرم افزار خارج شوید؟',
    buttons: [
      {
        text: 'خیر',
      },
      {
        text: 'بله',
		color: 'red',
		onClick: function() {
			navigator.app.exitApp();
                },
      },
    ],
    verticalButtons: false,
  }).open();
}
*/
// Now we need to run the code that will be executed only for About page.


// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function(e) {

    // Get page data from event data
    var page = e.detail.page;
    console.log('1');
    if (page.name === 'about') {
        // Following code will be executed for page with data-page attribute equal to "about"
        app.alert('Here comes About page');
    }

})


document.addEventListener("DOMContentLoaded", function(event) {
/*	setTimeout(function(){
 	app.preloader.show();
	sendStartMsg();
	},500);*/
$$('.animSett-popup').on('popup:open', function (e, popup) {
  app.range.create({el: $$('#durationSlider')});
  app.range.create({el: $$('#FPSSlider')});
  app.range.create({el: $$('#hueChangeSlider')});
 
$$('#durationSlider').on("range:change",throttle(function(e, range){
			sendChange({
				"dur":range.value,	
			});
		},250));
		
$$('#FPSSlider').on("range:change",throttle(function(e, range){
			sendChange({
				"fps":range.value,	
			});
		},250));
		
$$('#hueChangeSlider').on("range:change",throttle(function(e, range){
			sendChange({
				"hue":range.value,	
			});
		},250));
  
});
	
	
	$$('#powerBtn').css({'color': '#8cff77'});
	$$('#powerBtn').on('click',function(){
		if(powerState){
			powerState=false;
			sendChange({"state":"off"});
			$('#powerBtn').css({'color': '#ff1111'});
			}else{
			powerState=true;
			sendChange({"state":"on"});
			$('#powerBtn').css({'color': '#8cff77'});
			}
	});
	
	$('#sendBtn').on('click', function(){
		var animIdx='-';
		$('#animationListDiv ul li').each(function() { //this part generates the string to be sent to controller, like -1-0-3-2-0	
		console.log($(this)[0].childNodes[1].childNodes[1].childNodes[1]);
			animIdx+=($(this)[0].value+1)+'-';
        })
		sendChange({"anim": animIdx});
	});
	

    var listHTMLstring = '';
    for (var i = 0; i < animations.length; i++) {
        listHTMLstring += $listAddItem(animations[i],i);
    }

    document.querySelector('#animationListDiv ul').innerHTML = listHTMLstring;

	
    // Brightness slider

    $$('#brightnessSliderdiv').on("range:change", throttle(function(e, range){
			sendChange({
				"bri":Math.round(range.value*2.55)	
			});
		},200));



	widthSize = $(window).width() * 0.65;
    $('#colorPickerDiv').css({
        'width': widthSize,
        'height': widthSize
    });


    $('#colorPickerInput').wheelColorPicker({
        format: 'hsv',
        sliders: 'w',
        layout: 'block',
        autoResize: false
    });
	
	// the following even is added because when returning to static color tab the wcp size shrinks
	$('#staticColorTab').on('tab:show', function(){
		$('#colorPickerInput').wheelColorPicker( 'refreshWidget' );
	});
	
	//when sett page on animation tab opens and a text box input selects when returning to solid color tab
	//the color picker size shrinks the following lines fixes this
	$$('.settPage-popup').on('popup:close', function (e, popup) {
	widthSize = $(window).width() * .65;
    $('#colorPickerDiv').css({
        'width': widthSize,
        'height': widthSize
    });	
	$('#colorPickerInput').wheelColorPicker( 'refreshWidget' );
	});


 /*   app.on('sortableSort', function(listEl, indexes) {
		console.log(listEl);
        console.log(indexes);
      });  */

    app.sortable.enable('.sortable');

    $$('.openRGBdialog').on('click', function() {
        //document.getElementById('greenSlider').value=200;
        app.dialog.create({
            title: 'تنظیم رنگ',
            verticalButtons: false,
            cssClass: 'appdialog',
            buttons: [{
                    text: 'بستن',
                    onClick: function() {
                        $('#colorPickerInput').wheelColorPicker('setColor', {
                            r: app.range.getValue('#redSlider') / 255,
                            g: app.range.getValue('#greenSlider') / 255,
                            b: app.range.getValue('#blueSlider') / 255
                        });
                    },
                }
            ],
            on: {
                open: function(d) {
                    var els = d.$el.find('.range-slider');
                    for (var i = 0; i < els.length; i++) {
                        els[i].value = 200;
                        app.range.create({
                            el: els[i],
                            /*on: {
                                change: throttle(function(r){
										console.log(r.el);
										//console.log(r.value);
										sendChange({
											"R":Math.round(color.r*255),
											"G":Math.round(color.g*255),
											"B":Math.round(color.b*255),	
										});
									},200)
                                
                            }*/
                        });

                    }

                }
            },
            content: '<div class="block">\
             <div class="range-slider color-red" id="redSlider" data-label="true">\
               <input type="range" min="0" max="255" step="1" value="0">\
             </div>\
           </div>\
           <div class="block">\
             <div class="range-slider color-green" id="greenSlider" data-label="true">\
               <input type="range" min="0" max="255" step="1" value="0">\
             </div>\
           </div>\
           <div class="block" >\
             <div class="range-slider color-blue" id="blueSlider" data-label="true">\
               <input  type="range" min="0" max="255" step="1" value="0">\
             </div>\
           </div>',
        }).open();
        var color = $('#colorPickerInput').wheelColorPicker('getColor');
        app.range.setValue('#redSlider', Math.round(color.r * 255));
        app.range.setValue('#greenSlider', Math.round(color.g * 255));
        app.range.setValue('#blueSlider', Math.round(color.b * 255));
		$$("#redSlider").on("range:change",throttle(function(){
			sendChange({
				"R":app.range.getValue('#redSlider'),	
			});
		},250));
		$$("#greenSlider").on("range:change",throttle(function(){
			sendChange({
				"G":app.range.getValue('#greenSlider'),	
			});
		},250));
		$$("#blueSlider").on("range:change",throttle(function(){
			sendChange({
				"B":app.range.getValue('#blueSlider'),	
			});
		},250));
    });


    $('#animationListDiv').on('click', '.swipeout-delete', function() {
        if ($('#animationListDiv ul li').length > 1) {
            $(this).parent().parent().remove();
            if ($('#animationListDiv ul li').length == 1) {
                $('#animationListDiv .swipeout-delete').removeClass('swipeout-delete');
            }
        }

    });

    $('#animationListDiv').on('click', '.listAddItem', function() {
        itemToAddAnimationAfter = $(this).parent().parent();
    });

    $('#animationAddSelectList').on('click', '.animItem', function() {
        if ($('#animationListDiv ul li').length == 1) {
            $('#animationListDiv .listDeleteBtn').addClass('swipeout-delete');
        }
		console.log($(this).parent()[0].value);
        itemToAddAnimationAfter.after($listAddItem(animations[$(this).parent()[0].value], $(this).parent()[0].value));
        itemToAddAnimationAfter = '';
		app.sheet.close($('.add-animation-sheet'), true);
    });

	


    var liListItemsHtml = '<ul>';
    for (var i = 0; i < animations.length; i++) {
        liListItemsHtml += '<li value="'+i+'">\
			<a href="#" class="animItem">'+animations[i]+'</a>\
    </li>';
    }
    liListItemsHtml += '</ul>';
    $('#animationAddSelectList').html(liListItemsHtml);
	
	//////* color change events *//////
		$('#colorPickerInput').on('slidermove', throttle(function(){
			var color=$(this).wheelColorPicker('getColor');
			sendChange({
				"R":Math.round(color.r*255),
				"G":Math.round(color.g*255),
				"B":Math.round(color.b*255),	
			});
		},200));

	$('#colorPickerInput').on('sliderup', function () {
		var color=$(this).wheelColorPicker('getColor');
			sendChange({
				"R":Math.round(color.r*255),
				"G":Math.round(color.g*255),
				"B":Math.round(color.b*255),	
			});
	});

$$('.open-save').on('click', function () {
        var saveDialog=app.dialog.create({
            title: 'ذخیره لیست',
            verticalButtons: false,
            buttons: [{
                    text: 'انصراف',
					color: 'red',
                    onClick: function() {
                    },
                },
			
				{
                    text: 'ذخیره',
					close: false,
                    onClick: function() {
						var newSaveName=$('#saveNameField').val();
						if(newSaveName!=''){
							var duplicate=false;
							animListSaveObj.forEach(function(item,index){
							if(item[0]==newSaveName) {duplicate=true; return;}
							});
							if(!duplicate){
								var listArr=[];
								var i=0;
								$('#animationListDiv ul li').each(function() {
									listArr[i]=$(this)[0].value;
									i++;
								});
								console.log(listArr);
								animListSaveObj.push([newSaveName,listArr]);
								localStorage.setItem('listSaveLocalStorage',JSON.stringify(animListSaveObj));
								app.dialog.close();
								app.toast.create({
									text: 'لیست ذخیره شد',
									closeTimeout: 2000,
									cssClass: 'toastCustomize',
									position: 'center',
								}).open();																
							}else{
								app.dialog.close();
								app.dialog.create({
									title: 'توجه!',
									verticalButtons: false,
									buttons: [{
											text: 'انصراف',
											color: 'green',
											onClick: function() {
												saveDialog.open();
											},
										},
									
										{
											text: 'تایید',
											color: 'red',
											close: true,
											onClick: function() {
													var listArr=[];
													var i=0;
													$('#animationListDiv ul li').each(function() {
														listArr[i]=$(this)[0].value;
														i++;
													});
													console.log(listArr);
													animListSaveObj.push([newSaveName,listArr]);
													localStorage.setItem('listSaveLocalStorage',JSON.stringify(animListSaveObj));
													app.dialog.close();
													app.toast.create({
														text: 'لیست ذخیره شد',
														closeTimeout: 2000,
														cssClass: 'toastCustomize',
														position: 'center',
													}).open();															
											},
										}
										
									],
									on: {
										open: function(d) {

										}
									},
									content: '<div class="block">\
										<div class="koodak-font">لیستی با این عنوان وجود دارد. محتویات لیست ذخیره شده با لیست موجود جایگزین خواهد شد. آیا تایید می کنید؟</div>\
											</div>',
								}).open();
								
							}							
						}
						
                    },
                }
				
            ],
            on: {
                open: function(d) {

                }
            },
            content: '<div class="block">\
				<div class="list inline-labels no-hairlines-md">\
				<div class="koodak-font">لطفاً عنوان مورد نظر برای ذخیره لیست را وارد نمایید.</div>\
				  <ul>\
					<li class="item-content item-input">\
					  <div class="item-inner">\
						<div class="item-input-wrap">\
						  <input type="text" id="saveNameField" placeholder="" required validate data-error-message="لطفاً یک عنوان وارد کنید">\
						  <span class="input-clear-button"></span>\
						</div>\
					  </div>\
					</li>\
					</ul>\
					</div>\
					</div>',
        }).open();
});	

$$('#loadBtn').on('click',function(){
	var loadListHTMLstring = '';  
	animListSaveObj.forEach(function(item, index){
		loadListHTMLstring += $loadListAddItem(item[0],index);
	});
	document.querySelector('#animListSavedNamesDiv ul').innerHTML = loadListHTMLstring;
});	

$('#animListSavedNamesDiv').on('click', '.loadListDeleteBtn', function() {
		console.log($(this).parent().parent()[0].value);
		animListSaveObj.splice($(this).parent().parent()[0].value,1);
		localStorage.setItem('listSaveLocalStorage',JSON.stringify(animListSaveObj));
		var loadListHTMLstring = '';  
	animListSaveObj.forEach(function(item, index){
		loadListHTMLstring += $loadListAddItem(item[0],index);
	});
	document.querySelector('#animListSavedNamesDiv ul').innerHTML = loadListHTMLstring;
        //itemToAddAnimationAfter = $(this).parent().parent();
    });

	$('#animListSavedNamesDiv').on('click', '.loadListItem', function() {
		console.log($(this).parent().parent()[0].value);
		var loadListIdx=$(this).parent().parent()[0].value;
		 listHTMLstring = '';
    for (var i = 0; i < animListSaveObj[loadListIdx][1].length; i++) {
        listHTMLstring += $listAddItem(animations[animListSaveObj[loadListIdx][1][i]],animListSaveObj[loadListIdx][1][i]);
    }

    document.querySelector('#animationListDiv ul').innerHTML = listHTMLstring;
	app.popup.close($('.load-popup'), true);	
    });

});


//This function returns the html for new item to add
function $listAddItem(item, itemNo) {
    return '<li class="swipeout" value= '+itemNo+'>\
          <div class="swipeout-content">\
            <div class="item-inner">\
              <div class="item-title">' + item + ' </div>\
            </div>\
          </div>\
          <div class="sortable-handler"></div>\
		        <div class="swipeout-actions-right">\
        <a href="#" data-sheet=".add-animation-sheet" class="color-green listAddItem sheet-open"><i class="material-icons">add</i></a>\
        <a href="#" class="listDeleteBtn swipeout-delete"><i class="material-icons">delete</i></a>\
      </div>\
        </li>'
}

function $loadListAddItem(item, itemNo) {
 
	return '<li class="swipeout" value="'+itemNo+'">\
	      <div class="swipeout-content">\
        <a href="#" class="item-link item-content loadListItem">\
          <div class="item-inner">\
              <div class="item-title">'+item+'</div>\
          </div>\
        </a>\
      </div>\
			<div class="swipeout-actions-right">\
        <a href="#" class="loadListDeleteBtn swipeout-delete"><i class="material-icons">delete</i></a>\
      </div>\
			</li>';

}


function sendChange(dataToSend) {
	$.ajax({
		url: deviceIP+"com",
		data: dataToSend,
		//crossDomain: true,
		type: 'GET',
		cache: true,
		timeout: 2500,
		error: function () {
		},
		success: function (data) {
		}
	});
}

function sendStartMsg() {
	$.ajax({
		url: deviceIP+'hi',
		//data: {"aa" :34, "bb": "sdf"},
		//crossDomain: true,
		type: 'GET',
		//async: false,
		cache: true,
		timeout: 500,
		error: function () {
			app.preloader.hide();
			  app.dialog.create({
    title: 'خطا در ارتباط',
    text: 'ارتباط با دستگاه برقرار نیست لطفا مطمئن شوید به شبکه وایفای مربوط به دستگاه متصل شده اید.',
    buttons: [
      {
        text: 'سعی مجدد',
		onClick: function() {
			app.preloader.show();
		sendStartMsg();
                    },
      },
      {
        text: 'خروج',
		color: 'red',
      },
    ],
    verticalButtons: false,
	//cssClass: 'appdialog',
  }).open();
			

		},
		success: function (data) {
			app.preloader.hide();
			console.log(data);
		}
	});
}




// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
function throttle(func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function() {
    var now = Date.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};

