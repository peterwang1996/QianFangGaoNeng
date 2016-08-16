;
(function() {
    var domChartId = 'danmuku-chart';
    var domChartInner = '<div id="' + domChartId + '" style="width: 980px; height: 160px; margin: 0 auto;"></div>';
    var echartsSrc = 'http://echarts.baidu.com/dist/echarts.js';
    var danmukuPart = 60;
    var timeInAdvance = 5;
    var player = null;
    var isOpen = true;


    var chartOption = {
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            top: '36%',
            left: '2%',
            right: '58%',
            bottom: '0%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: null
        },
        yAxis: {
            type: 'value'
        },
        series: {
            name: '平均弹幕密度（条/秒）',
            type: 'line',
            smooth: true,
            symbolSize: 12,
            showSymbol: false,
            areaStyle: {
                normal: {}
            },
            markLine: {
                symbol: 'none',
                symbolSize: 5,
                silent: true,
                data: [{
                    name: '全程密度',
                    type: 'average',
                    label: {
                        normal: {
                            formatter: '{b}:\n{c}'
                        }
                    }
                }, ]
            },
            markPoint: {
                symbolSize: 60,
                precision: 0,
                data: [{
                    name: '最大值',
                    type: 'max'
                }]
            },
            data: null
        }
    };

    var chartTimeline = {
        name: '时间轴',
        xAxis: 0,
        label: {
            normal: {
                formatter: '00:00'
            }
        }
    }

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

    function initInfo() {
        // 奇怪的 Bug ？
        // var cid = document.body.innerHTML.match(/cid=\d*/)[0].slice(4);

        var cid = $('.player-wrapper').html().match(/cid=\d*/)[0].slice(4);
        if ($('#player_placeholder > param[name=flashvars]').val()) {
            console.log('new');
            // cid = $('#player_placeholder > param[name=flashvars]').val().split('&')[0].split('=')[1];
            player = $('#player_placeholder')[0];
        } else {
            console.log('old');
            // cid = $('#bofqi > iframe').attr('src').split('&')[0].split('=')[1];
        }
        getDanmuku(cid);
    }

    function getDanmuku(cid) {
        var danmukuAddress = 'http://comment.bilibili.com/' + cid + '.xml';
        $.ajax({
            url: danmukuAddress,
            processData: false,
            cache: false,
            dataType: 'xml',
            success: parseDanmuku
        });
    }

    function parseDanmuku(data) {
        var danmukuTime = [];
        $(data).find('d').each(function() {
            var param = $(this).attr('p').split(',').map(function(str) {
                return parseInt(str);
            });
            if (param[5] === 0) {
                danmukuTime.push(parseInt(param[0]));
            }
        });
        danmukuTime.sort(function(a, b) {
            return b - a;
        });
        var maxLength = danmukuTime[0];
        var avgRho = (danmukuTime.length / maxLength).toFixed(2);

        var partDanmukuTime = [];
        var partDanmukuRho = [];
        var step = maxLength > danmukuPart ? Math.floor(maxLength / danmukuPart) : 1;
        console.log(step);

        for (var i = 0; i < maxLength; i += step) {
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

        console.log(partDanmukuTime);
        console.log(partDanmukuRho);
        console.log(avgRho);

        drawChart(partDanmukuTime, partDanmukuRho, avgRho, step);
    }

    function drawChart(time, rho, avg, step) {
        $('.scontent').css('margin-bottom', '0');
        $('.scontent').after(domChartInner);
        var myChart = echarts.init(document.getElementById(domChartId));
        chartOption.xAxis.data = time;
        chartOption.series.data = rho;
        myChart.setOption(chartOption);
        addPlayerHook(myChart, step);
    }

    function addPlayerHook(myChart, step) {
        if (!player) {
            console.warn('Waring: Old player is not supported.');
        } else {
            chartOption.series.markLine.data.push(chartTimeline);

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
                chartOption.series.markLine.data[1].label.normal.formatter = timeNumToStr(nowTime);
                chartOption.series.markLine.data[1].xAxis = Math.floor(nowTime / step);
                myChart.setOption(chartOption);
            }, 500);
        }
    }

    // START
    if (isOpen) {
        initInfo();
    }
})()