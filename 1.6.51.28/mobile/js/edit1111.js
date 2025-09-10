function initEditor() {
	textareainitEditor();
	powertextareainitEditor();
}

//隐藏初始化
function powertextareainitEditor() {
	tinymce.remove('#jinsom-publish-single-hide-textarea');
	//初始化编辑器
		tinymce.init({
			selector: '#jinsom-publish-single-hide-textarea',
			height: 300,
			statusbar: false,
			plugins: 'autosave',
			toolbar: 'undo redo bold italic alignleft aligncenter custom_emoji custom_images',
			autosave_interval: '10s',
			autosave_retention: '43776m',
			autosave_restore_when_empty: true,
			autosave_ask_before_unload: false,
			autosave_prefix: 'single_hide_autosave_',
			relative_urls: false,
			remove_script_host: false,
			content_style: 'img {max-width: 60%;}',
			setup: function(editor) {
				editor.ui.registry.addButton('custom_images', {
					icon: 'image',
					onAction: function() {
						$('.jinsom-publish-words-form .images').addClass('pay').removeClass('normal');
						$('.jinsom-publish-words-form .add input').click();
					}
				});
				editor.ui.registry.addButton('custom_emoji', {
					icon: 'emoji',
					onAction: function() {
						$('.jinsom-smile-form span').attr('data', 'jinsom-publish-single-hide-textarea');
						$('.jinsom-publish-words-form .content>.smile').click();
					}
				});
			}
		});

	

	
	
}


//编辑器初始化
function textareainitEditor() {
	tinymce.remove('#jinsom-publish-single-textarea');
	//初始化编辑器
	console.log("initEditor()");
		tinymce.init({
			selector: '#jinsom-publish-single-textarea',
			height: 400,
			statusbar: false,
			plugins: 'autosave',
			toolbar: 'undo redo bold italic alignleft aligncenter custom_emoji custom_images',
			autosave_interval: '10s',
			autosave_retention: '43776m',
			autosave_restore_when_empty: true,
			autosave_ask_before_unload: false,
			autosave_prefix: 'single_autosave_',
			content_style: 'img {max-width: 60%;}',
			relative_urls: false,
			remove_script_host: false,
			setup: function(editor) {
				editor.ui.registry.addButton('custom_images', {
					icon: 'image',
					onAction: function() {
						$('.jinsom-publish-words-form .images').addClass('normal').removeClass('pay');
						$('.jinsom-publish-words-form .add input').click();
					}
				});
				editor.ui.registry.addButton('custom_emoji', {
					icon: 'emoji',
					onAction: function() {
						$('.jinsom-smile-form span').attr('data', 'jinsom-publish-single-textarea');
						$('.jinsom-publish-words-form .content>.smile').click();
					}
				});
			}
		});
}



function initPublishPage(type) {
	
	
		if (type != 'video' && type != 'music' && type != 'secret') {
		document.querySelector('#file').addEventListener('change',
		function() {
			var that = this;
			var number = that.files.length;

			if (type == 'words') {
				var words_images_max = jinsom.words_images_max; //最大上传数量
			} else {
				var words_images_max = 40;
			}

			if (number > words_images_max || $('#jinsom-publish-images-list li').length >= words_images_max) {
				layer.open({
					content: '最多只能上传' + words_images_max + '张图片！',
					skin: 'msg',
					time: 2
				});
				return false;
			}

			a = 0; //计时器
			for (i = 0; i < number; i++) {

				//显示加载loading
				if (type == 'single' || type == 'bbs') {
					myApp.hidePreloader();
					myApp.showPreloader('上传中...');
				} else {
					$('.jinsom-publish-words-form .add i').hide();
					$('.jinsom-publish-words-form .add span').css('display', 'inline-block');
				}

				info = that.files[i];
				//console.log(jinsom.jinsom_ajax_url + "/upload/words-base64.php");
				if (info.type != 'image/gif') {
					lrz(info, {
						quality: parseFloat(jinsom.publish_img_quality)
					}).then(function(rst) {
						$.ajax({
							type: "POST",
							dataType: 'json',
							url: jinsom.jinsom_ajax_url + "/upload/words-base64.php",
							data: {
								base64: rst.base64
							},
							success: function(msg) {
								img_count = $('#jinsom-publish-images-list li').length; //获取已经上传的图片数量
								if (img_count >= words_images_max - 1) { //如果已经上传了9张
									$('.jinsom-publish-words-form .add').hide(); //隐藏添加按钮
								}
								if (img_count < words_images_max) { //如果上传的超过了9张就不载入容器
									if (msg.code == 1) {
										//console.log(msg);
										if (type == 'single' || type == 'bbs') {
											myApp.hidePreloader();
											if ($('.jinsom-publish-words-form .images').hasClass('pay')) {
												tinymce.get('jinsom-publish-single-hide-textarea').insertContent('<img src="' + msg.url + '">');
											} else {
												tinymce.get('jinsom-publish-single-textarea').insertContent('<img src="' + msg.url + '">');
											}
											$('#file').val(''); //清空已选状态
										} else {
											$('#jinsom-publish-images-list').append('<li><i class="jinsom-icon jinsom-guanbi" onclick="jinsom_remove_image(' + words_images_max + ',this)"></i><a href="' + msg.url + '" data-fancybox="gallery-publish"><img src="' + msg.url + '"></a></li>');
											jinsom_lightbox(); //渲染灯箱
											a++;
										}

										if (a == number) { //如果照片已经上传完成就关闭
											$('#file').val(''); //清空已选状态
											$('.jinsom-publish-words-form .add i').show(); //关闭loading动画
											$('.jinsom-publish-words-form .add span').hide(); //关闭loading动画
										}

									} else {
										layer.open({
											content: msg.msg,
											skin: 'msg',
											time: 1
										});
										$('#file').val(''); //清空已选状态
										$('.jinsom-publish-words-form .add i').show(); //关闭loading动画
										$('.jinsom-publish-words-form .add span').hide(); //关闭loading动画
									}

								} else {
									$('#file').val(''); //清空已选状态
									$('.jinsom-publish-words-form .add i').show(); //关闭loading动画
									$('.jinsom-publish-words-form .add span').hide(); //关闭loading动画	
								}

							}
						});
					});

				} else { //gif图片上传
					if (info.size / (1024 * 1024) < jinsom.mobile_gif_size_max) {
						var reader = new FileReader();
						reader.onload = function(evt) {
							image = evt.target.result;
							$.ajax({
								type: "POST",
								dataType: 'json',
								url: jinsom.jinsom_ajax_url + "/upload/words-base64.php",
								data: {
									base64: image
								},
								success: function(msg) {
									img_count = $('#jinsom-publish-images-list li').length; //获取已经上传的图片数量
									if (img_count >= words_images_max - 1) { //如果已经上传了9张
										$('.jinsom-publish-words-form .add').hide(); //隐藏添加按钮
									}
									if (img_count < words_images_max) { //如果上传的超过了9张就不载入容器
										if (msg.code == 1) {
											//console.log(msg);
											if (type == 'single' || type == 'bbs') {
												myApp.hidePreloader();
												if ($('.jinsom-publish-words-form .images').hasClass('pay')) {
													tinymce.get('jinsom-publish-single-hide-textarea').insertContent('<img src="' + msg.url + '">');
												} else {
													tinymce.get('jinsom-publish-single-textarea').insertContent('<img src="' + msg.url + '">');
												}
												$('#file').val(''); //清空已选状态
											} else {
												$('#jinsom-publish-images-list').append('<li><i class="jinsom-icon jinsom-guanbi" onclick="jinsom_remove_image(' + words_images_max + ',this)"></i><a href="' + msg.url + '" data-fancybox="gallery-publish"><img src="' + msg.url + '"></a></li>');
												jinsom_lightbox(); //渲染灯箱
												a++;
											}

											if (a == number) { //如果照片已经上传完成就关闭
												$('#file').val(''); //清空已选状态
												$('.jinsom-publish-words-form .add i').show(); //关闭loading动画
												$('.jinsom-publish-words-form .add span').hide(); //关闭loading动画
											}

										} else {
											layer.open({
												content: msg.msg,
												skin: 'msg',
												time: 1
											});
											$('#file').val(''); //清空已选状态
											$('.jinsom-publish-words-form .add i').show(); //关闭loading动画
											$('.jinsom-publish-words-form .add span').hide(); //关闭loading动画
										}

									} else {
										$('#file').val(''); //清空已选状态
										$('.jinsom-publish-words-form .add i').show(); //关闭loading动画
										$('.jinsom-publish-words-form .add span').hide(); //关闭loading动画	
									}

								}
							});

						}
						reader.readAsDataURL(info);
					} else {
						layer.open({
							content: '上传的动图不能超过' + jinsom.mobile_gif_size_max + 'MB！',
							skin: 'msg',
							time: 2
						});
						$('#file').val(''); //清空已选状态
						$('.jinsom-publish-words-form .add i').show(); //关闭loading动画
						$('.jinsom-publish-words-form .add span').hide(); //关闭loading动画
					}

				}

			}
		});

		//图片拖动排序
		var el = document.getElementById('jinsom-publish-images-list');
		var sortable = Sortable.create(el);

	} //图片上传结束
	if (type == 'video') {
        document.querySelector('#jinsom-upload-video').addEventListener('change', function() {
            var percent = $('.jinsom-upload-video-btn .percent');
            var progress = $(".jinsom-upload-video-btn p");

            $("#jinsom-upload-video-form").ajaxSubmit({
                dataType: 'json',
                uploadProgress: function(event, position, total, percentComplete) {
                    var percentVal = percentComplete + '%';
                    percent.width(percentVal);
                    progress.html(percentVal);
                    if (percentVal == '100%') {
                        progress.html('视频正在处理中...');
                    }
                },
                success: function(msg) {
                    $('#jinsom-upload-video').val('');
                    if (msg.code == 0) {
                        layer.open({
                            content: msg.msg,
                            skin: 'msg',
                            time: 2
                        });
                        percent.width(0);
                        progress.html('选择一个视频');
                    } else if (msg.code == 1) {
                        $('#jinsom-upload-video-form').hide();
                        $('.jinsom-remove-video-toolbar').css('display', 'flex');
                        $('#jinsom-video-url').val(msg.url);

                        var jinsom_view_video = new Player({
                            id: 'jinsom-publish-video-demo',
                            url: msg.url,
                            'x5-video-player-type': 'h5',
                            'x5-video-player-fullscreen': false,
                            playbackRate: [0.5, 1, 2, 6, 8],
                            fitVideoSize: 'fixWidth',
                            playsinline: true,
                            videoInit: true,
                            autoplay: true,
                            ignores: ['volume', 'pc'],
                            closeVideoTouch: true,
                            rotate: {
                                innerRotate: true, //只旋转内部video
                                clockwise: false // 旋转方向是否为顺时针
                            }
                        });

                        video = $('#jinsom-publish-video-demo video');
                        video.attr('crossOrigin', 'Anonymous');

                        jinsom_view_video.on("canplay", function() {
                            video_time = $('#jinsom-publish-video-demo .xgplayer-time em').text();
                            video_time_s = video_time.split(':')[video_time.split(':').length - 1];
                            video_time_m = video_time.split(':', 1);
                            $('#jinsom-video-time').val(parseInt(video_time_m) * 60 + parseInt(video_time_s));
                        });

                        $('.jinsom-remove-video-toolbar .del').click(function() {
                            $('#jinsom-publish-video-demo').empty().attr('class', '').attr('style', '');
                            $('.jinsom-remove-video-toolbar').css('display', 'none');
                            $('#jinsom-upload-video-form').show();
                            percent.width(0);
                            progress.html('选择一个视频');
                            $('.jinsom-remove-video-toolbar .read').removeClass('on').text('截取封面');
                            $('.jinsom-publish-video-set-cover-content').empty();
                            $('#jinsom-video-img-url,#jinsom-video-url').val('');
                        });

                        $('.jinsom-remove-video-toolbar .read').click(function() {
                            if (!$(this).hasClass('on')) {
                                var canvas = document.createElement("canvas");
                                // canvas.width = video[0].videoWidth;
                                // canvas.height = video[0].videoHeight;
                                video_width = $('#jinsom-publish-video-demo').width();
                                video_height = $('#jinsom-publish-video-demo').height();
                                canvas.width = video_width;
                                canvas.height = video_height;
                                var ctx = canvas.getContext("2d");
                                if (myApp.device.os == 'ios' && jinsom_get_file_type(msg.url) == '.mov' && (video_height > video_width)) {
                                    ctx.rotate(90 * Math.PI / 180);
                                    ctx.translate(0, -video_width);
                                    ctx.drawImage(video[0], 0, 0, canvas.width * 2, canvas.height);
                                } else {
                                    ctx.drawImage(video[0], 0, 0, canvas.width, canvas.height);
                                }
                                video_cover = canvas.toDataURL("image/jpeg");

                                $('.jinsom-publish-video-set-cover-content').html('<img src="' + video_cover + '">');
                                $.ajax({
                                    type: "POST",
                                    dataType: 'json',
                                    url: jinsom.jinsom_ajax_url + "/upload/video-img-base64.php",
                                    data: {
                                        base64: video_cover
                                    },
                                    success: function(rel) {
                                        if (rel.code == 1) {
                                            $('#jinsom-video-img-url').val(rel.url);
                                            $('.jinsom-remove-video-toolbar span.read').addClass('on').text('已截取封面');
                                            $('.jinsom-publish-video-set-cover-content').html('<img src="' + rel.url + '">');
                                        } else {
                                            layer.open({
                                                content: rel.msg,
                                                skin: 'msg',
                                                time: 2
                                            });
                                            $('.jinsom-remove-video-toolbar span.read').addClass('on').removeAttr('data-popup').removeClass('open-popup');
                                        }
                                    }
                                });
                            }
                        });

                        $('#jinsom-publish-remove-video-cover').click(function() {
                            $('.jinsom-remove-video-toolbar .read').removeClass('on').text('截取封面');
                            $('.jinsom-publish-video-set-cover-content').empty();
                            $('#jinsom-video-img-url').val('');
                        });

                    }


                },
                error: function() {
                    $('#jinsom-upload-video-form').show();
                    percent.width(0);
                    progress.html('选择一个视频');
                    layer.open({
                        content: '上传失败！',
                        skin: 'msg',
                        time: 2
                    });
                    $('#jinsom-upload-video').val('');
                    return false;
                }
            });

        });
    }


    if (type == 'music') { //上传音乐
        document.querySelector('#jinsom-upload-music').addEventListener('change', function() {
            var percent = $('.jinsom-upload-music-btn .percent');
            var progress = $(".jinsom-upload-music-btn p");

            $("#jinsom-upload-music-form").ajaxSubmit({
                dataType: 'json',
                uploadProgress: function(event, position, total, percentComplete) {
                    var percentVal = percentComplete + '%';
                    percent.width(percentVal);
                    progress.html(percentVal);
                    if (percentVal == '100%') {
                        progress.html('音频正在处理中...');
                    }
                },
                success: function(msg) {
                    $('#jinsom-upload-music').val('');
                    if (msg.code == 0) {
                        layer.open({
                            content: msg.msg,
                            skin: 'msg',
                            time: 2
                        });
                        percent.width(0);
                        progress.html('选择一个音频');
                    } else if (msg.code == 1) {
                        $('#jinsom-music-url').val(msg.url);
                        progress.html('音频已经上传');
                    }


                },
                error: function() {
                    $('#jinsom-upload-music-form').show();
                    percent.width(0);
                    progress.html('选择一个音频');
                    layer.open({
                        content: '上传失败！',
                        skin: 'msg',
                        time: 2
                    });
                    $('#jinsom-upload-music').val('');
                    return false;
                }
            });

        });


    }

    //发布@好友
    $('.jinsom-publish-aite-popup').on('opened', function() { //打开
        if ($('.jinsom-publish-aite-form .list.aite li').length == 0) {
            myApp.showIndicator();
            $.ajax({
                type: "POST",
                url: jinsom.mobile_ajax_url + "/user/following.php",
                success: function(msg) {
                    myApp.hideIndicator();
                    html = '';
                    for (var i = msg.data.length - 1; i >= 0; i--) {
                        html += '\
<li onclick="jinsom_aite_selete_user(this)" data="' + msg.data[i].nickname + '">\
<div class="avatarimg">' + msg.data[i].avatar + msg.data[i].verify + '</div>\
<div class="name">' + msg.data[i].name + msg.data[i].vip + '</div>\
</li>';
                    }
                    $('.jinsom-publish-aite-form .list.aite').html(html);
                }
            });

        }
    });
	 //选择话题
    $('.jinsom-publish-topic-popup').on('opened', function() { //打开
        if ($('.jinsom-publish-aite-form .list.topic li').length == 0) {
            myApp.showIndicator();
            $.ajax({
                type: "POST",
                url: jinsom.mobile_ajax_url + "/topic/topic-hot.php",
                success: function(msg) {
                    myApp.hideIndicator();
                    html = '';
                    for (var i = 0; i < msg.data.length; i++) {
                        html += '\
<li onclick="jinsom_publish_topic_selete(this)" data="' + msg.data[i].name + '">\
<div class="avatarimg">' + msg.data[i].avatar + '</div>\
<div class="name">#' + msg.data[i].name + '#</div>\
<div class="hot"><i class="jinsom-icon jinsom-huo"></i> ' + msg.data[i].hot + '</div>\
</li>';
                    }
                    $('.jinsom-publish-aite-form .list.topic').html(html);
                }
            });

        }
    });
    // 选择权限
    $('.jinsom-publish-power-popup').on('opened', function() { //打开
        if ($('.jinsom-publish-power-form li').length == 0) {
            myApp.showIndicator();
            post_type = $('.jinsom-publish-words-form .tool .power i').attr('post_type');
            $.ajax({
                type: "POST",
                url: jinsom.mobile_ajax_url + "/publish/power-form.php",
                data: {
                    post_type: type
                },
                success: function(msg) {
                    myApp.hideIndicator();
                    $('.jinsom-publish-power-form').html(msg);
                }
            });
        }
    });
		
	
    // 显示表情
    $('.jinsom-publish-words-form .smile').click(function() {
        layer.open({
            type: 1,
            content: $(this).next().html(),
            anim: 'up',
            style: 'position:fixed;bottom:0;left:0;width:100%;height:65vw;border:none;'
        });
    });

    // 选择背景图
    $('.jinsom-publish-select-bg-form li').click(function(){
        myApp.closeModal();
        $('.jinsom-publish-words-form .content textarea').removeAttr('class').addClass('bg-'+$(this).attr('data'));
        $('#jinsom-pop-bg').val($(this).attr('data'));
    });
}

//打开编辑表单
function jinsom_post_edit_form(post_id, type) {
	var tempbbs = type;
	if (type == 'normal' || type == 'pay_see' || type == 'login_see' || type == 'vip_see' || type == 'comment_see' || type == 'answer') {
    type = "bbs";
                 layer.open({
					content: '暂未开启帖子编辑！',
					skin: 'msg',
					time: 2
				});
				return false;
	}
	//console.log(jinsom.theme_url + '/mobile/templates/page/edit/' + type + '.php?post_id=' + post_id+'&type='+tempbbs);
	layer.closeAll();
	console.log(tempbbs);
	myApp.getCurrentView().router.load({
			url: jinsom.theme_url + '/mobile/templates/page/edit/' + type + '.php?post_id=' + post_id+'&type='+tempbbs
		});
		
	

	 // 移除之前绑定的事件处理程序
	
    $(document).off('pageInit');

	 // 监听pageInit事件
    $(document).on('pageInit', function (e) {
	
		if (type == 'single' || type == 'bbs') {
	
			 // 移除之前创建的 TinyMCE 编辑器实例
				//tinymce.remove('#jinsom-publish-single-textarea');
				//tinymce.remove('#jinsom-publish-single-hide-textarea');
				initEditor();
				
		}
		
		if(type!="words"){
			
			initPublishPage(type);
		}   

    });
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
				/**type = $('.jinsom-home-menu li.on')
					.attr('data');
					
				jinsom_post_data(type, 'pull', 0, this);

				function d() {
					myApp.getCurrentView().router.back();
				}
				
				setTimeout(d, 1000);**/
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


