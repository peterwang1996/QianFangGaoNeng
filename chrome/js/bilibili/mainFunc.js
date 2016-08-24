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
        player = {
            seek: function(sec) {
                $player[0].jwSeek(sec);
            },
            getPos: function() {
                return $player[0].jwGetPosition();
            }
        }
        cid = $player.parent().html().match(/cid=\d*/)[0].slice(4);
    } else if ($('#bofqi_embed')) {
        $player = $('#bofqi_embed');
        $player.before('<style>\n' +
            '#bofqi_embed {\n' +
            '    height: calc(100% - ' + chartSumHeight + 'px) !important\n' +
            '}\n' +
            '@media screen and (max-width: 320px) {\n' +
            '    #' + domChartId + '-container {\n' +
            '        display: none;\n' +
            '    }\n' +
            '    #bofqi_embed {\n' +
            '        height: 100% !important;\n' +
            '    }\n' +
            '}\n' +
            '</style>\n'
        );
        player = {
            seek: function(sec) {
                $player[0].jwSeek(sec);
            },
            getPos: function() {
                return $player[0].jwGetPosition(sec);
            }
        }
        cid = $player.parent().html().match(/cid=\d*/)[0].slice(4);
    } else {
        throw new Error('Unsupported player');
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
 * 在获取到弹幕 XML 之后需要做的所有事情
 * @param {Object} danmukuXml 弹幕 XML 对象
 */
function afterGettingXml(danmukuXml) {
    var danmukuData = parseDanmukuData(danmukuXml);
    var chartData = makeChartData(danmukuData);
    var keyPoints = findKeyPoints(danmukuData, chartData.step, chartData.maxLength);
    var myChart = drawChart(myInitInfo.$player, chartData);
    addPlayerHook(myChart, myInitInfo.player, chartData.step);
}

// START
var myInitInfo = null;

function startChart() {
    if ($('iframe').length > 0) {
        var $iframe = $('iframe')
        var oriHeight = parseInt($iframe.attr('height'));
        var tarHeight = 556 + chartHeight + (chartMargin);
        $iframe.attr('height', tarHeight);
        $iframe.css('height', tarHeight + 'px');
    } else {
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
            if ((e + '').indexOf('Failed to execute \'send\' on \'XMLHttpRequest\'') !== -1) {
                console.log('xsite');
                chrome.runtime.sendMessage({
                    action: 'requireDanmuku',
                    type: 'xml',
                    src: danmukuAddress
                }, function(response) {
                    console.log(response);
                    afterGettingXml(new DOMParser().parseFromString(response.danmukuXmlText, "text/xml"));
                });
            } else {
                console.error(e);
            }
        }
    }
}