/**
 * 获得和抽象播放器接口（Bilibili 番剧）
 * @param {Function} success 获取成功后执行的函数
 * @param {Function} fail 获取失败后执行的函数
 * @returns {Object} 抽象出的播放器对象
 */
function getBiliPlayer(success, fail) {
    var rawPlayer = null;
    var $rawIframe = null;

    if (localStorage.defaulth5 === '1') {
        var gettingIframe = setInterval(function () {
            if ($('iframe.bilibiliHtml5Player').length >= 1) {
                $rawIframe = $('iframe.bilibiliHtml5Player');
                clearInterval(gettingIframe);
                gettingIframe = null;
                var iframeSrc = $rawIframe.attr('src');
                if (iframeSrc.slice(0, 2) === '//') {
                    $rawIframe.attr('src', window.location.protocol + iframeSrc);
                }
                var gettingPlayer = setInterval(function () {
                    if (rawPlayer = $($rawIframe[0].contentDocument).find('video')[0]) {
                        player = {
                            seek: function (sec) {
                                rawPlayer.currentTime = sec;
                            },
                            getPos: function () {
                                return rawPlayer.currentTime;
                            }
                        }
                        clearInterval(gettingPlayer);
                        gettingPlayer = null;
                        success.call(this, player);
                    } else {
                        console.info('Player not ready');
                    }
                }, 1000);
            } else {
                console.info('Iframe not ready');
            }
        }, 1000);
    } else {
        fail.call(this);
    }
}

/**
 * 获取视频的 av 号和页码数
 * @returns {Object} avObj avId: av号, pageNum: 页数
 */
function getAvObj() {
    return {
        avId: $.parseJSON($.ajax({
            url: 'http:\/\/bangumi.bilibili.com/web_api/episode/' + window.location.href.match(/\d+/g)[1] + '.json',
            async: false
        }).responseText).result.currentEpisode.avId,
        pageNum: '1'
    }
}