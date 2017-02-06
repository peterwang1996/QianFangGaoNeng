/**
 * 获得和抽象播放器接口（Bilibili 常规）
 * @param {Function} success 获取成功后执行的函数
 * @param {Function} fail 获取失败后执行的函数
 * @returns {Object} 抽象出的播放器对象
 */
function getBiliPlayer(success, fail) {
    var player = null;
    var rawPlayer = null;

    if (localStorage.defaulth5 === '1') {
        var gettingPlayer = setInterval(function () {
            if (rawPlayer = $('.bilibili-player-video video')[0]) {
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
        fail.call(this);
    }
}

/**
 * 获取视频的 av 号和页码数
 * @returns {Object} avObj avId: av号, pageNum: 页数
 */
function getAvObj() {
    return {
        avId: window.location.href.match(/\d+/g)[0],
        pageNum: 1
    }
}