/**
 * 获得和抽象播放器接口（Bilibili 常规）
 * @param {Function} success 获取成功后执行的函数
 * @param {Function} fail 获取失败后执行的函数
 * @returns {Object} 抽象出的播放器对象
 */
function getBiliPlayer(success, fail) {
    var player = null;
    var rawPlayer = null;
    var videoLength = null;

    if (localStorage.defaulth5 === '1') {
        var gettingPlayer = setInterval(function () {
            if (rawPlayer = $('.bilibili-player-video video')[0]) {
                if (videoLength = rawPlayer.duration) {
                    player = {
                        videoLength: videoLength,
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
                    console.info('Duration not ready');
                }
            } else {
                console.info('Player not ready');
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
    var url = location.href;
    var avId = url.match(/av\d+/)[0].slice(2);
    var pageNum = 1;
    if (url.match(/page\=\d+/)) {
        pageNum = url.match(/page\=\d+/)[0].slice(5);
    } else if (url.match(/index\_\d+/)) {
        pageNum = url.match(/index\_\d+/)[0].slice(6);
    } else {
        pageNum = 1;
    }

    console.log(avId, pageNum);
    return {
        avId: avId,
        pageNum: pageNum
    }
}