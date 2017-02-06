/**
 * 根据 av 号获得视频的 cid
 * @param {Object} avObj av号及页码信息
 * @returns {String} 获取到的 cid
 */
function getCid(avObj) {
    return $.parseJSON($.ajax({
        url: 'http://api.bilibili.com/view?type=json&appkey=8e9fc618fbd41e28&id=' + avObj.avId + '&page=' + avObj.pageNum,
        async: false,
    }).responseText).cid;
}

function getDanmukuXML(cid) {
    var danmukuAddress = 'http://comment.bilibili.com/' + cid + '.xml';
    var danmukuXml = null;
    return danmukuXml = $.ajax({
        url: danmukuAddress,
        processData: false,
        cache: false,
        async: false,
    }).responseXML;
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

// START

function startChart() {
    var avObj = getAvObj();
    var cid = getCid(avObj);
    var danmukuXml = getDanmukuXML(cid);
    var danmukuData = parseDanmukuData(danmukuXml);
    var chartData = makeChartData(danmukuData);
    var keyPoints = findKeyPoints(danmukuData, chartData.step, chartData.maxLength);
    var $myChart = initEChartsDom($(containerSelector));
    var myChart = refreshChartData($myChart, chartData);
    getBiliPlayer(function(biliPlayerForControl) {
        console.log(biliPlayerForControl);
        addPlayerHook(myChart, biliPlayerForControl, chartData.step);
    }, function() {
        tellUpdate($myChart);
    });
}