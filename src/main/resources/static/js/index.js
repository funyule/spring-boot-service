// 管理页面程序
var click = device.mobile() ? 'touchstart' : 'click';
$(function () {
    // 侧边栏操作按钮
    $(document).on(click, '#guide', function () {
        // 当主内容区变大后，点击菜单后隐藏
        if ((document.body.clientWidth - $('#content').width() < 100)){
            $(this).toggleClass('toggled');
            $('#sidebar').toggleClass('toggled');
        }
    });
    // 侧边栏点击开关子项
    $(document).on('click', '.sub-menu a, .sp-profile a', function () {
        $(this).next().slideToggle(200);
        $(this).parent().toggleClass('toggled');
    });
    // Waves初始化
    Waves.displayEffect();
    // 滚动条初始化
    $('#sidebar').mCustomScrollbar({
        theme: 'minimal-dark',
        scrollInertia: 100,
        axis: 'yx',
        mouseWheel: {
            enable: true,
            axis: 'y',
            preventDefault: true
        }
    });
    // 切换主题
    $('.switch-skins').click(function () {
        var skin = $(this).attr('data-skin');
        $('body').attr("id", skin);
    });
});

// iframe高度自适应
function changeFrameHeight(ifm) {
    ifm.height = document.documentElement.clientHeight - 105;
}

function resizeFrameHeight() {
    $('.tab_iframe').css('height', document.documentElement.clientHeight - 105);
    $('md-tab-content').css('left', '0');
}

window.onresize = function () {
    resizeFrameHeight();
    initScrollShow();
    initScrollState();
};

// 选项卡操作
$(function () {
    // 选项卡点击
    $(document).on('click', '.content_tab li', function () {
        // 切换选项卡
        $('.content_tab li').removeClass('cur');
        $(this).addClass('cur');
        // 切换iframe
        $('.iframe').removeClass('cur');
        $('#iframe_' + $(this).data('index')).addClass('cur');
        var marginLeft = ($('#tabs').css('marginLeft').replace('px', ''));
        // 滚动到可视区域:在左侧
        if ($(this).position().left < marginLeft) {
            var left = $('.content_tab>ul').scrollLeft() + $(this).position().left - marginLeft;
            $('.content_tab>ul').animate({scrollLeft: left}, 200, function () {
                initScrollState();
            });
        }
        // 滚动到可视区域:在右侧
        if (($(this).position().left + $(this).width() - marginLeft)
            > document.getElementById('tabs').clientWidth) {
            var left = $('.content_tab>ul').scrollLeft()
                + (($(this).position().left + $(this).width() - marginLeft)
                    - document.getElementById('tabs').clientWidth);
            $('.content_tab>ul').animate({scrollLeft: left}, 200, function () {
                initScrollState();
            });
        }
    });
    // 控制选项卡滚动位置
    $(document).on('click', '.tab_left>a', function () {
        $('.content_tab>ul').animate({scrollLeft: $('.content_tab>ul').scrollLeft() - 300},
            200, function () {
                initScrollState();
            });
    });
    // 向右箭头
    $(document).on('click', '.tab_right>a', function () {
        $('.content_tab>ul').animate({scrollLeft: $('.content_tab>ul').scrollLeft() + 300},
            200, function () {
                initScrollState();
            });
    });
    // 选项卡右键菜单
    new BootstrapMenu('.tabs li', {
        fetchElementData: function (item) {
            return item;
        },
        actionsGroups: [
            ['close', 'refresh'],
            ['closeOther', 'closeAll'],
            ['closeRight', 'closeLeft']
        ],
        actions: {
            close: {
                name: '关闭',
                iconClass: 'fa fa-close',
                onClick: function (item) {
                    closeTab($(item));
                }
            },
            closeOther: {
                name: '关闭其他',
                iconClass: 'fa fa-arrows-h',
                onClick: function (item) {
                    var index = $(item).data('index');
                    $('.content_tab li').each(function () {
                        if ($(this).data('index') != index) {
                            closeTab($(this));
                        }
                    });
                }
            },
            closeAll: {
                name: '关闭全部',
                iconClass: 'fa fa-window-close-o',
                onClick: function () {
                    $('.content_tab li').each(function () {
                        closeTab($(this));
                    });
                }
            },
            closeLeft: {
                name: '关闭左侧所有',
                iconClass: 'fa fa-arrow-left',
                onClick: function (item) {
                    var index = $(item).data('index');
                    $('.content_tab li').each(function () {
                        if ($(this).data('index') != index) {
                            closeTab($(this));
                        } else {
                            return false;
                        }
                    });
                }
            },
            closeRight: {
                name: '关闭右侧所有',
                iconClass: 'fa fa-arrow-right',
                onClick: function (item) {
                    var index = $(item).data('index');
                    $($('.content_tab li').toArray().reverse()).each(function () {
                        if ($(this).data('index') != index) {
                            closeTab($(this));
                        } else {
                            return false;
                        }
                    });
                }
            },
            refresh: {
                name: '刷新',
                iconClass: 'fa fa-refresh',
                onClick: function (item) {
                    var index = $(item).data('index');
                    var $iframe = $('#iframe_' + index).find('iframe');
                    $iframe.attr('src', $iframe.attr('src'));
                }
            }
        }
    });
});

// 选项卡对象
function addTab(title, url) {
    // 选项卡标识符为url中的数字和字母
    var index = url.replace(/[^a-zA-Z0-9]+/g, '_');
    // 激活或者创建新选项卡
    if ($('#tab_' + index).length == 0) {
        // 添加选项卡
        $('.content_tab li').removeClass('cur');
        var tab = '<li id="tab_' + index + '" data-index="' + index + '" class="cur">' +
            '<a class="waves-effect waves-light">' + title + '</a></li>';
        $('.content_tab>ul').append(tab);
        // 添加iframe
        $('.iframe').removeClass('cur');
        var iframe = '<div id="iframe_' + index + '" class="iframe cur">' +
            '<iframe class="tab_iframe" src="' + url + '" width="100%" frameborder="0"' +
            ' scrolling="auto" onload="changeFrameHeight(this)"></iframe></div>';
        $('.content_main').append(iframe);
        initScrollShow();
        $('.content_tab>ul').animate({
            scrollLeft: document.getElementById('tabs').scrollWidth
            - document.getElementById('tabs').clientWidth
        }, 200, function () {
            initScrollState();
        });
    } else {
        $('#tab_' + index).trigger('click');
    }
    // 关闭侧边栏
    $('#guide').trigger(click);
}

function closeTab($item) {
    var closeable = $item.data('closeable');
    if (closeable != false) {
        // 如果当前时激活状态则关闭后激活左边选项卡
        if ($item.hasClass('cur')) {
            $item.prev().trigger('click');
        }
        // 关闭当前选项卡
        var index = $item.data('index');
        $('#iframe_' + index).remove();
        $item.remove();
    }
    initScrollShow();
}

function initScrollShow() {
    if (document.getElementById('tabs').scrollWidth
        > document.getElementById('tabs').clientWidth) {
        $('.content_tab').addClass('scroll');
    } else {
        $('.content_tab').removeClass('scroll');
    }
}

function initScrollState() {
    if ($('.content_tab>ul').scrollLeft() == 0) {
        $('.tab_left>a').removeClass('active');
    } else {
        $('.tab_left>a').addClass('active');
    }
    if (($('.content_tab>ul').scrollLeft()
            + document.getElementById('tabs').clientWidth)
        >= document.getElementById('tabs').scrollWidth) {
        $('.tab_right>a').removeClass('active');
    } else {
        $('.tab_right>a').addClass('active');
    }
}

// 全屏模式
if (!$.util.supportsFullScreen)
    $("#fullScreenBtn").hide();

function fullPage() {
    if ($.util.isFullScreen()) {
        $.util.cancelFullScreen();
        $("#full-screen").attr("class", "fa fa-expand him-icon");
    } else {
        $.util.requestFullScreen();
        $("#full-screen").attr("class", "fa fa-compress him-icon");
    }
}