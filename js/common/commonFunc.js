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
 * 将弹幕发送时间数据转化成图表数据
 * @param 弹幕时间数据，每个元素是弹幕发送的时间
 * @returns 弹幕的具体数据
 */
function makeChartData(danmukuTime) {
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
        step: step
    };
}