//打开编辑表单
function jinsom_post_edit_form(post_id, type) {
	var tempbbs = type;
	if (type == 'normal' || type == 'pay_see' || type == 'login_see' || type == 'vip_see' || type == 'comment_see' || type == 'answer') {
    type = "bbs";
	}
	layer.closeAll();
	//console.log(tempbbs);
	myApp.getCurrentView().router.load({
			url: jinsom.theme_url + '/mobile/templates/page/edit/' + type + '.php?post_id=' + post_id+'&type='+tempbbs
		});
	myApp.hideIndicator();	
}
//删除图片
function jinsom_remove_edit_img(obj) {
    $(obj).parents('li').remove();
    number = $('#jinsom-publish-images-list li').length;
    if (number < jinsom.words_images_max) {
        $('.add').show();
    }

}


//编辑动态
function jinsom_edit_words(post_id) {

	power = $('#jinsom-pop-power')
		.val();
	if (power == 1 || power == 2 || power == 4 || power == 5) {
		if (power == 1) {
			if ($('.jinsom-publish-words-form .power-content .price')
				.val() == '') {
				layer.open({
					content: '请输入售价！',
					skin: 'msg',
					time: 2
				});
				return false;
			}
		}
		if (power == 2) {
			if ($.trim($('.jinsom-publish-words-form .power-content .password')
				.val()) == '') {
				layer.open({
					content: '请输入密码！',
					skin: 'msg',
					time: 2
				});
				return false;
			}
		}
	}

	data = $("#jinsom-publish-form")
		.serialize();
	if ($('.jinsom-publish-words-form .topic span')
		.length > 0) {
		topic = '&topic=';
		$('.jinsom-publish-words-form .topic span')
			.each(function() {
				topic_str = $(this)
					.attr('data');
				topic_str = topic_str.replace(RegExp("&", "g"), "#!");
				topic += topic_str + ',';
			});
		topic = topic.substr(0, topic.length - 1);
		data = data + topic;
	}


	if ($('#jinsom-publish-images-list li')
		.length > 0) {
		img = '&img=';
		img_thum = '&img_thum=';
		$('#jinsom-publish-images-list li')
			.each(function() {
				img += $(this)
					.children('a')
					.attr('href') + ',';
				img_thum += $(this)
					.find('img')
					.attr('src') + ',';
			});
		img = img.substr(0, img.length - 1);
		img_thum = img_thum.substr(0, img_thum.length - 1);
		data = data + img + img_thum;
	}
	//console.log( jinsom.jinsom_ajax_url + "/editor/words.php");
	
	myApp.showIndicator();
	
	$.ajax({
		type: "POST",
		url: jinsom.jinsom_ajax_url + "/editor/words.php",
		data: data + '&post_id=' + post_id,
		success: function(msg) {
			
			myApp.hideIndicator();
			layer.open({
				content: msg.msg,
				skin: 'msg',
				time: 1
			});
			if (msg.code == 1) {
				$('[data-page="publish"] .right a').removeAttr('onclick');
				$('.jinsom-home-menu li.on').addClass('no-voice').click();//重新加载内容
				
				
				 
				function d(){myApp.getCurrentView().router.back();}setTimeout(d,1000);
				function e(){myApp.getCurrentView().router.refreshPage();
				// 修改浏览器地址栏的 URL
					var newURL = '/'; // 新的 URL 地址
					history.pushState(null, '', newURL);
				}setTimeout(e,1000);
			} else if (msg.code == 5) {
				function a() {
					jinsom_publish_add_topic_form();
				}
				setTimeout(a, 1500);
			} else if (msg.code == 2) {
				jinsom_page('setting/setting-phone.php', 1, 'page');
			} else if (msg.code == 4) {
				jinsom_page('setting/setting-email.php', 1, 'page');
			}
		}
	});

}



//编辑音乐
function jinsom_edit_music(post_id) {

	power = $('#jinsom-pop-power')
		.val();
	if (power == 1 || power == 2 || power == 4 || power == 5) {
		if (power == 1) {
			if ($('.jinsom-publish-words-form .power-content .price')
				.val() == '') {
				layer.open({
					content: '请输入售价！',
					skin: 'msg',
					time: 2
				});
				return false;
			}
		}
		if (power == 2) {
			if ($.trim($('.jinsom-publish-words-form .power-content .password')
				.val()) == '') {
				layer.open({
					content: '请输入密码！',
					skin: 'msg',
					time: 2
				});
				return false;
			}
		}
	}


	data = $("#jinsom-publish-form")
		.serialize();
	if ($('.jinsom-publish-words-form .topic span')
		.length > 0) {
		topic = '&topic=';
		$('.jinsom-publish-words-form .topic span')
			.each(function() {
				topic_str = $(this)
					.attr('data');
				topic_str = topic_str.replace(RegExp("&", "g"), "#!");
				topic += topic_str + ',';
			});
		topic = topic.substr(0, topic.length - 1);
		data = data + topic;
	}
	
	musicurl=$("#jinsom-music-url").val();
	if(musicurl==''){
		layer.open({
				content: '请输入音乐地址或上传音乐！',
				skin: 'msg',
				time: 2
			});
			return false;
	}else{
		data = data +'&music-url='+musicurl;
	}

	//console.log( jinsom.jinsom_ajax_url + "/editor/words.php");
	
	myApp.showIndicator();
	
	$.ajax({
		type: "POST",
		url: jinsom.jinsom_ajax_url + "/editor/music.php",
		data: data + '&post_id=' + post_id,
		success: function(msg) {
			
			myApp.hideIndicator();
			layer.open({
				content: msg.msg,
				skin: 'msg',
				time: 1
			});
			if (msg.code == 1) {
				
				$('[data-page="publish"] .right a').removeAttr('onclick');
				$('.jinsom-home-menu li.on').addClass('no-voice').click();//重新加载内容
				function d(){myApp.getCurrentView().router.back();}setTimeout(d,1000);
				function e(){myApp.getCurrentView().router.refreshPage();
				// 修改浏览器地址栏的 URL
					var newURL = '/'; // 新的 URL 地址
					history.pushState(null, '', newURL);
				}setTimeout(e,1000);
			} else if (msg.code == 5) {
				function a() {
					jinsom_publish_add_topic_form();
				}
				setTimeout(a, 1500);
			} else if (msg.code == 2) {
				jinsom_page('setting/setting-phone.php', 1, 'page');
			} else if (msg.code == 4) {
				jinsom_page('setting/setting-email.php', 1, 'page');
			}
		}
	});
	
}


//编辑视频
function jinsom_edit_video(post_id) {

	power = $('#jinsom-pop-power')
		.val();
	if (power == 1 || power == 2 || power == 4 || power == 5) {
		if (power == 1) {
			if ($('.jinsom-publish-words-form .power-content .price')
				.val() == '') {
				layer.open({
					content: '请输入售价！',
					skin: 'msg',
					time: 2
				});
				return false;
			}
		}
		if (power == 2) {
			if ($.trim($('.jinsom-publish-words-form .power-content .password')
				.val()) == '') {
				layer.open({
					content: '请输入密码！',
					skin: 'msg',
					time: 2
				});
				return false;
			}
		}
	}


	data = $("#jinsom-publish-form")
		.serialize();
	if ($('.jinsom-publish-words-form .topic span')
		.length > 0) {
		topic = '&topic=';
		$('.jinsom-publish-words-form .topic span')
			.each(function() {
				topic_str = $(this)
					.attr('data');
				topic_str = topic_str.replace(RegExp("&", "g"), "#!");
				topic += topic_str + ',';
			});
		topic = topic.substr(0, topic.length - 1);
		data = data + topic;
	}
	
	videourl=$("#jinsom-music-url").val();
	videoimg=$("#jinsom-video-img-url").val();
	videotime=$("#jinsom-video-time").val();
	if(musicurl==''){
		layer.open({
				content: '请输入视频地址或上传视频！',
				skin: 'msg',
				time: 2
			});
			return false;
	}else{
		data = data +'&video_url='+videourl+',video_img='+videoimg+',video_time='+videotime;
	}

	//console.log( jinsom.jinsom_ajax_url + "/editor/words.php");
	
	myApp.showIndicator();

	$.ajax({
		type: "POST",
		url: jinsom.jinsom_ajax_url + "/editor/video.php",
		data: data + '&post_id=' + post_id,
		success: function(msg) {

			myApp.hideIndicator();
			layer.open({
				content: msg.msg,
				skin: 'msg',
				time: 1
			});
			if (msg.code == 1) {
	
				$('[data-page="publish"] .right a').removeAttr('onclick');
				$('.jinsom-home-menu li.on').addClass('no-voice').click();//重新加载内容
				function d(){myApp.getCurrentView().router.back();}setTimeout(d,1000);
				function e(){myApp.getCurrentView().router.refreshPage();
				// 修改浏览器地址栏的 URL
					var newURL = '/'; // 新的 URL 地址
					history.pushState(null, '', newURL);
				}setTimeout(e,1000);
			} else if (msg.code == 5) {
				function a() {
					jinsom_publish_add_topic_form();
				}
				setTimeout(a, 1500);
			} else if (msg.code == 2) {
				jinsom_page('setting/setting-phone.php', 1, 'page');
			} else if (msg.code == 4) {
				jinsom_page('setting/setting-email.php', 1, 'page');
			}
		}
	});
	
}


//编辑文章
function jinsom_edit_single(post_id) {
	if ($.trim($(".jinsom-publish-words-form .title input").val()) == '') {
		layer.open({
			content: '请输入标题！',
			skin: 'msg',
			time: 2
		});
		return false;
	}
	content = tinymce.get('jinsom-publish-single-textarea').getContent();
	content = content.replace(RegExp("&", "g"), "!`!");
	content = content.replace(/!`!nbsp;<\/p>/g, ''); 
	//console.log(content);
	if (content == '') {
        layer.open({
            content: '请输入内容！',
            skin: 'msg',
            time: 2
        });
        return false;
    }
	power = $('#jinsom-pop-power').val();
	if (power == 1 || power == 2 || power == 4 || power == 5) {
		if (power == 1) {
			if ($('.jinsom-publish-words-form .power-content .price')
				.val() == '') {
				layer.open({
					content: '请输入售价！',
					skin: 'msg',
					time: 2
				});
				return false;
			}
		}
		if (power == 2) {
			if ($.trim($('.jinsom-publish-words-form .power-content .password')
				.val()) == '') {
				layer.open({
					content: '请输入密码！',
					skin: 'msg',
					time: 2
				});
				return false;
			}
		}
		hide_content = tinymce.get('jinsom-publish-single-hide-textarea').getContent();
		hide_content = hide_content.replace(RegExp("&", "g"), "!`!");
		hide_content = hide_content.replace(/!`!nbsp;<\/p>/g, ''); 
		
		if ($.trim(hide_content) == '') {
			layer.open({
				content: '请输入隐藏内容！',
				skin: 'msg',
				time: 2
			});
			return false;
		}
	}

	data = $("#jinsom-publish-form").serialize();
	if ($('.jinsom-publish-words-form .topic span')
		.length > 0) {
		topic = '&topic=';
		$('.jinsom-publish-words-form .topic span')
			.each(function() {
				topic_str = $(this)
					.attr('data');
				topic_str = topic_str.replace(RegExp("&", "g"), "#!");
				topic += topic_str + ',';
			});
		topic = topic.substr(0, topic.length - 1);
		data = data + topic;
	}
	if ($('#jinsom-publish-images-list li').length > 0) {
		img = '&img=';
		$('#jinsom-publish-images-list li').each(function() {
			img += $(this).children('a').html() + '</br>';
		});
		data = data + img;
	}

	data += '&content=' + content;
	if (power == 1 || power == 2 || power == 4 || power == 5 || power == 6 || power == 7 || power == 8) {
		data += '&hide-content=' + hide_content;
	}

	myApp.showIndicator();
	//console.log(data);
	$.ajax({
		type: "POST",
		url: jinsom.jinsom_ajax_url + "/editor/single.php",
		data: data + '&post_id=' + post_id,
		success: function(msg) {
			
			myApp.hideIndicator();
			layer.open({
				content: msg.msg,
				skin: 'msg',
				time: 1
			});
			if (msg.code == 1) {
				$('[data-page="publish"] .right a').removeAttr('onclick');
				$('.jinsom-home-menu li.on').addClass('no-voice').click();//重新加载内容
				
				
				 
				function d(){myApp.getCurrentView().router.back();}setTimeout(d,1000);
				function e(){myApp.getCurrentView().router.refreshPage();
				// 修改浏览器地址栏的 URL
					var newURL = '/'; // 新的 URL 地址
					history.pushState(null, '', newURL);
				}setTimeout(e,1000);
			} else if (msg.code == 5) {
				function a() {
					jinsom_publish_add_topic_form();
				}
				setTimeout(a, 1500);
			} else if (msg.code == 2) {
				jinsom_page('setting/setting-phone.php', 1, 'page');
			} else if (msg.code == 4) {
				jinsom_page('setting/setting-email.php', 1, 'page');
			}
		}
	});

}


