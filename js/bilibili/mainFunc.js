/**
 * 获得视频 cid 以及播放器接口
 * @returns {Object} $player: 播放器 jQuery 对象， player: 播放器对象， cid: 视频 cid
 */
function initInfo() {
    var $player = null;
    var player = null;
    var cid = null;
    if ($('#player_placeholder').length > 0) {
        $player = $('#player_placeholder');
        console.log($player);
        player = $player[0];
        cid = $player.parent().html().match(/cid=\d*/)[0].slice(4);
    } else if ($('#bofqi_embed')) {
        $player = $('#bofqi_embed');
        $player.css('height', '556px')
        player = $player[0];
        cid = $player.parent().html().match(/cid=\d*/)[0].slice(4);
    } else {
        console.warn('Unsupported player');
    }

    console.log(player);
    console.log(cid);
    return {
        $player: $player,
        player: player,
        cid: cid
    };
}

/**
 * 获得弹幕 XML 树
 * @param {String} cid 视频的 cid
 * @param {then} 接下来要执行的函数
 */
function getDanmukuXml(cid, then) {
    var danmukuAddress = 'http://comment.bilibili.com/' + cid + '.xml';
    var danmukuXml = null;
    try {
        danmukuXml = $.ajax({
            url: danmukuAddress,
            processData: false,
            cache: false,
            async: false,
            dataType: 'xml'
        }).responseXML;
        return then.apply(this, danmukuXml);
    } catch (e) {
        if ((e + '').indexOf('Failed to execute \'send\' on \'XMLHttpRequest\'') !== -1) {
            console.log('xsite');
            chrome.runtime.sendMessage({
                action: 'requireDanmuku',
                type: 'xml',
                src: danmukuAddress
            }, function(response) {
                console.log(response);
                danmukuXml = response.danmukuXml;
                return then.apply(this, danmukuXml);
            });
        } else {
            console.error(e);
        }
    }
}

/**
 * 解析弹幕数据
 * @param {Object} danmukuXml 弹幕的 XML 文档
 * @returns {Array} 弹幕数据， time: 整数发送时间， content: 弹幕内容
 */
function parseDanmukuData(danmukuXml) {
    console.log(danmukuXml);
    var danmukuData = [];
    $(danmukuXml).find('d').each(function() {
        var param = $(this).attr('p').split(',').map(function(str) {
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
 * 在图表和播放器之间添加钩子以实现进度条同步
 * @param {Object} myChart 图表的 eCharts 对象
 * @param {Object} player 播放器对象
 * @param {Number} step 图表上每一格对应的秒数
 */
function addPlayerHook(myChart, player, step) {
    if (!player) {
        console.warn('Waring: Old player is not supported.');
    } else {
        chartOption.series.markLine.data.push(chartTimeline);
        var lastTime = 0;
        myChart.on('click', function(params) {
            var timeStamp = null;
            if (params.componentType === "markPoint") {
                timeStamp = params.data.coord[0];
            } else {
                timeStamp = params.dataIndex;
            }
            var time = timeStamp * step - timeInAdvance;
            if (time < 0) {
                time = 0;
            }
            player.jwSeek(time);
        });

        var timelineMove = setInterval(function() {
            try {
                var nowTime = Math.floor(player.jwGetPosition());
            } catch (e) {
                if ((e + '') === 'TypeError: player.jwGetPosition is not a function') {
                    return;
                } else {
                    console.error(e);
                }
            }
            if (nowTime !== lastTime) {
                chartOption.series.markLine.data[1].label.normal.formatter = timeNumToStr(nowTime);
                chartOption.series.markLine.data[1].xAxis = Math.floor(nowTime / step);
                myChart.setOption(chartOption);
                lastTime = nowTime;
            }
        }, 100);
    }
}

// START
if (isOpen) {
    if ($('iframe').length > 0) {
        var $iframe = $('iframe')
        var oriHeight = parseInt($iframe.attr('height'));
        var tarHeight = oriHeight + (chartHeight + chartMargin) * 2;
        $iframe.attr('height', tarHeight);
        $iframe.css('height', tarHeight + 'px');
    } else {
        var myInitInfo = initInfo();
        // var cid = $('.player-wrappers').html().match(/cid=\d*/)[0].slice(4);
        // var danmukuXml = getDanmukuXml(myInitInfo.cid);
        // var danmukuData = parseDanmukuData(danmukuXml);
        var danmukuData = getDanmukuXml(myInitInfo.cid, parseDanmukuData);
        var chartData = makeChartData(danmukuData);
        var keyPoints = findKeyPoints(danmukuData, chartData.step, chartData.maxLength);
        var myChart = drawChart(myInitInfo.$player, chartData);
        addPlayerHook(myChart, myInitInfo.player, chartData.step);
    }
}