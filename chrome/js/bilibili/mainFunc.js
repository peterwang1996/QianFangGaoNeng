var myInitInfo = null;

/**
 * 获得视频 cid 以及播放器接口
 * @returns {Object} player: 抽象出的播放器对象， cid: 视频 cid
 */
function initInfo() {
    var player = null;
    var cid = null;

    if (localStorage.defaulth5 === '1') {
        player = {
            seek: function (sec) {
                $(playerSelector)[0].currentTime = sec;
            },
            getPos: function () {
                return $(playerSelector)[0].currentTime;
            }
        }
    }

    var responseHTML = $.ajax({
        url: window.location.href,
        async: false
    }).responseText;
    cid = responseHTML.split('\"\/\/static\.hdslb\.com\/play.swf\"\, \"cid\=')[1].split('\&')[0];
    console.log(cid);
    return {
        player: player,
        cid: cid
    };
}

/**
 * 解析弹幕数据
 * @param {Object} danmukuXml 弹幕的 XML 文档
 * @returns {Array} 弹幕数据， time: 整数发送时间， content: 弹幕内容
 */
function parseDanmukuData(danmukuXml) {
    console.log(danmukuXml);
    var danmukuData = [];
    $(danmukuXml).find('d').each(function () {
        var param = $(this).attr('p').split(',').map(function (str) {
            return parseInt(str);
        });
        if (param[5] === 0) {
            danmukuData.push({
                time: parseInt(param[0]),
                content: $(this).html()
            });
        }
    });
    console.log(danmukuData);
    return danmukuData;
}

/**
 * 在获取到弹幕 XML 之后需要做的所有事情
 * @param {Object} danmukuXml 弹幕 XML 对象
 */
function afterGettingXml(danmukuXml) {
    var danmukuData = parseDanmukuData(danmukuXml);
    var chartData = makeChartData(danmukuData);
    var keyPoints = findKeyPoints(danmukuData, chartData.step, chartData.maxLength);
    var myChartSet = drawChart($(containerSelector), chartData);
    console.log(myInitInfo.player);
    if (myInitInfo.player) {
        addPlayerHook(myChartSet.myChart, myInitInfo.player, chartData.step);
    } else {
        tellUpdate(myChartSet.$myChart);
    }
}

// START

function startChart() {
    myInitInfo = initInfo();
    var danmukuAddress = 'http://comment.bilibili.com/' + myInitInfo.cid + '.xml';
    var danmukuXml = null;

    // 获取弹幕 XML 数据。由于是异步过程，就单独拿出来了
    try {
        danmukuXml = $.ajax({
            url: danmukuAddress,
            processData: false,
            cache: false,
            async: false,
        }).responseXML;
        afterGettingXml(danmukuXml);
    } catch (e) {
        console.error(e);
    }
}