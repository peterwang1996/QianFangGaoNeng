/**
 * 获得视频 cid 以及播放器接口
 * @param {String} cid 视频的 cid
 * @returns {Function} 播放器对象
 */
function getPlayer(cid) {
    var player = null;
    if ($('#player_placeholder > param[name=flashvars]').val()) {
        console.log('new');
        player = $('#player_placeholder')[0];
    } else {
        console.log('old');
        player = (function(cid) {
            var port = chrome.runtime.connect({
                name: cid + '_danmuku'
            });
            console.log(port);

            chrome.runtime.onConnect.addListener(function(port) {
                console.log(port.name + '- iframe');
                port.onMessage.addListener(function(msg) {
                    console.log(msg);
                });
            });

            return {
                jwSeek: function(param) {
                    console.log(port);
                    port.postMessage({
                        command: 'jwSeek',
                        param: param
                    });
                }
            }
        })(cid);
    }
    return player;
}

/**
 * 获得弹幕数据
 * @param {String} cid 视频的 cid
 * @returns {Object} 弹幕的 XML 文档
 */
function getDanmukuXml(cid) {
    var danmukuAddress = 'http://comment.bilibili.com/' + cid + '.xml';
    return $.ajax({
        url: danmukuAddress,
        processData: false,
        cache: false,
        async: false,
        dataType: 'xml'
    }).responseXML;
}

/**
 * 解析弹幕数据
 * @param {Object} danmukuXml 弹幕的 XML 文档
 * @returns {Array} 弹幕时间数据，每个元素是弹幕发送的时间
 */
function parseDanmukuData(danmukuXml) {
    var danmukuTime = [];
    $(danmukuXml).find('d').each(function() {
        var param = $(this).attr('p').split(',').map(function(str) {
            return parseInt(str);
        });
        if (param[5] === 0) {
            danmukuTime.push(parseInt(param[0]));
        }
    });
    return danmukuTime;
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
                if ((e + '') !== 'TypeError: player.jwGetPosition is not a function') {
                    console.error(e);
                }
                return;
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
    var cid = $('.player-wrapper').html().match(/cid=\d*/)[0].slice(4);
    var player = getPlayer(cid);
    var danmukuXml = getDanmukuXml(cid);
    var danmukuTime = parseDanmukuData(danmukuXml);
    var chartData = makeChartData(danmukuTime);
    var myChart = drawChart(chartData);
    addPlayerHook(myChart, player, chartData.step);
}