/**
 * 根据 av 号获得视频的 cid
 * @param {Object} avObj av号及页码信息
 * @param {Function} afterThat 获取到 cid 后的回调函数
 */
function getCid(avObj, afterThat) {
    $.ajax({
        url: '//www.bilibili.com/widget/getPageList?aid=' + avObj.avId,
        success: function (data) {
            var result = $.parseJSON(data)[avObj.pageNum - 1].cid;
            afterThat.call(this, result);
        }
    });
}

/**
 * 根据 cid 号获得弹幕的 XML 文档
 * @param {Object} cid 视频的 cid
 * @param {Function} afterThat 获取到弹幕 XML 后的回调函数
 */
function getDanmukuXML(cid, afterThat) {
    $.ajax({
        url: '//comment.bilibili.com/' + cid + '.xml',
        cache: false,
        success: afterThat
    });
}

/**
 * 在获取到弹幕 XML 之后做的事情
 * @param {String} danmukuXml 弹幕的原始 XML 对象 
 * @param {Number} maxLength 视频长度 
 * @param {Object} myChart echarts 对象
 */
function afterGettingDanmukuXML(danmukuXml, maxLength, myChart) {
    var newDanmukuData = parseDanmukuData(danmukuXml);
    var chartData = makeChartData(newDanmukuData, maxLength);
    refreshChartData(myChart, chartData, chartData.step);
}

/**
 * 解析弹幕数据
 * @param {Object} danmukuXml 弹幕的 XML 文档
 * @returns {Array} 弹幕数据， time: 整数发送时间， content: 弹幕内容
 */
function parseDanmukuData(danmukuXml) {
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
    return danmukuData;
}

/**
 * 更新弹幕数据
 * @param {Object} myChart 预留的 eCharts 对象
 * @returns {Object} myChart 生成的eCharts 对象
 */
function updateDanmukuData(myChart, maxLength) {
    console.log(maxLength);
    var avObj = getAvObj();
    getCid(getAvObj(), function (cid) {
        getDanmukuXML(cid, function (XMLData) {
            afterGettingDanmukuXML(XMLData, maxLength, myChart)
        });
    });
}

/**
 * 在页面更新后做的事情
 * @param {Object} myChart echarts 对象
 */
function afterPageLoaded(myChart) {
    getBiliPlayer(function (biliPlayerForControl) {
        updateDanmukuData(myChart, biliPlayerForControl.videoLength);
        addPlayerHook(myChart, biliPlayerForControl);
    }, function () {
        tellUpdate($myChart);
    });
}

// START
function startChart() {
    var $myChart = initEChartsDom($(containerSelector));
    var myChart = echarts.init($myChart[0]);
    myChart.danmuku = {};
    var danmukuData = null;
    afterPageLoaded(myChart);
    addEventListener('hashchange', function () {
        afterPageLoaded(myChart);
    });
}