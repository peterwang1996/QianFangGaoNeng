/**
 * 将以秒为单位的时间整数数转化成诸如 '02:33' 的字符串
 * @param {Number} n 时间（整数，单位为秒）
 * @return {String} str 转换后的字符串
 */
function timeNumToStr(n) {
    var min = Math.floor(n / 60) + '';
    var sec = n % 60 + '';
    if (min.length === 1) {
        min = '0' + min;
    }
    if (sec.length === 1) {
        sec = '0' + sec;
    }
    return min + ':' + sec;
}

/**
 * 将诸如 '02:33' 的字符串转化成以秒为单位的时间整数数
 * @return {String} str 时间字符串
 * @param {Number} n 时间（整数，单位为秒）
 */
function timeStrToNum(str) {
    var timeArray = str.split(':').map(function(str) {
        return parseInt(str);
    });
    return timeArray[0] * 60 + timeArray[1];
}

/**
 * 将弹幕发送时间数据转化成图表数据
 * @param 弹幕时间数据，每个元素是弹幕发送的时间
 * @returns 弹幕的具体数据
 */
function makeChartData(danmukuData) {
    var danmukuTime = danmukuData.map(function(n) {
        return n.time;
    })
    danmukuTime.sort(function(a, b) {
        return b - a;
    });
    var maxLength = danmukuTime[0];
    var avgRho = parseFloat((danmukuTime.length / maxLength).toFixed(2));

    var partDanmukuTime = [];
    var partDanmukuRho = [];
    var step = maxLength > danmukuPart ? Math.floor(maxLength / danmukuPart) : 1;
    console.log(step);

    for (var i = 0; i <= maxLength; i += step) {
        partDanmukuTime.push(timeNumToStr(i));
        partDanmukuRho.push(0);
    }

    for (var i = 0; i < danmukuTime.length; i++) {
        var curPart = Math.floor(danmukuTime[i] / step);
        partDanmukuRho[curPart] = partDanmukuRho[curPart] + 1;
    }

    console.log(partDanmukuRho);

    for (var i = 0; i < partDanmukuRho.length; i++) {
        partDanmukuRho[i] = (partDanmukuRho[i] / step).toFixed(2);
    }

    return {
        partDanmukuTime: partDanmukuTime,
        partDanmukuRho: partDanmukuRho,
        avgRho: avgRho,
        step: step,
        maxLength: maxLength
    };
}


/**
 * 绘制并返回 eCharts 图表
 * @param {Object} $player 播放器 jQuery 对象 
 * @param {Object} danmukuData 处理过的弹幕数据
 * @returns {Object} 绘制好的 eCharts 对象
 */
function drawChart($player, danmukuData) {
    $player.css('margin-bottom', '0');
    $player.after(domChartInner);
    var myChart = echarts.init(document.getElementById(domChartId));
    chartOption.xAxis.data = danmukuData.partDanmukuTime;
    chartOption.series.data = danmukuData.partDanmukuRho;
    chartOption.series.markLine.data[0].yAxis = danmukuData.avgRho;
    myChart.setOption(chartOption);
    return myChart;
}


function findKeyPoints(danmukuData, step, maxLength) {
    var keyPoints = [];
    var regexpTime = /\d+\:\d{2}/;
    for (i = 0; i < danmukuData.length; i++) {
        var curContent = danmukuData[i].content;
        var curTime = danmukuData[i].time;
        var contentTime = curContent.match(/\d+\:\d{2}/);
        if (contentTime && contentTime.length === 1 && timeStrToNum(contentTime[0]) < maxLength) {
            for (j = 0; j < keyWords.withTimePoint.length; j++) {
                if (curContent.indexOf(keyWords.withTimePoint[j]) !== -1) {
                    keyPoints.push(Math.floor(timeStrToNum(contentTime[0]) / step));
                    console.log(curContent, contentTime[0])
                    break;
                }
            }
        } else {
            for (j = 0; j < keyWords.withoutTimePoint.length; j++) {
                if (curContent.indexOf(keyWords.withoutTimePoint[j]) !== -1) {
                    keyPoints.push(Math.floor(curTime / step));
                    console.log(curContent, timeNumToStr(curTime));
                    break;
                }
            }
        }
    }

    // console.log(keyPoints.map(function(n) {
    //     return timeNumToStr((n*step));
    // }));
    // console.log(keyPoints);
    return keyPoints;
}