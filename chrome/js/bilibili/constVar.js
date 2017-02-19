var chartHeight = 160;
var chartMargin = 10;
var chartSumHeight = chartHeight + chartMargin;
var domChartId = 'danmuku-chart';
var domChartInner = '<div id="' + domChartId + '-container" style="position: relative; overflow: hidden; height: ' + chartHeight + 'px; margin: ' + chartMargin +'px auto;" class="arc-toolbar">' +
    '<div id="' + domChartId + '" style="height: ' + chartHeight + 'px">' +
    '</div></div>';
var tellUpdateEle = '<div id="tell-update" style="width: 100%; height: ' + chartHeight + 'px; background: rgba(255, 255, 255, 0.8); position: absolute; top: 0; left: 0; text-align: center;">' +
    '<p style="font-size: 24px; color: #111;">你可能用了假的 HTML5 播放器，' +
    '<a href="http://www.bilibili.com/html/help.html#p" target="_blank" style="color: #00a1d6; height: ' + chartHeight + 'px; line-height: ' + chartHeight + 'px;">点击这里</a>' +
    '去升级吧！</p>' +
    '<div style="width: 48px; height: 48px; font-size: 36px; color: #666; position: absolute; top: 5px; right: 5px; cursor: pointer;" onclick="$(\'#tell-update\').remove();">×</div>' +
    '</div>';
var danmukuPart = 60;
var timeInAdvance = 5;
var containerSelector = '#bofqi';

var chartOption = {
    tooltip: {
        trigger: 'axis'
    },
    grid: {
        top: '36%',
        left: '2%',
        right: '8%',
        bottom: '4%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        data: null
    },
    yAxis: {
        type: 'value',
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        }
    },
    series: {
        name: '平均弹幕密度（条/秒）',
        type: 'line',
        smooth: true,
        symbolSize: 12,
        showSymbol: false,
        itemStyle: {
            normal: {
                color: 'rgb(0, 161, 214)'
            }
        },
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgb(0, 161, 214)'
                }, {
                    offset: 1,
                    color: 'rgb(255, 255, 255)'
                }])
            }
        },
        markLine: {
            symbol: 'none',
            symbolSize: 5,
            silent: true,
            data: [{
                name: '全程密度',
                label: {
                    normal: {
                        formatter: '{b}:\n{c}'
                    }
                }
            }, {
                name: '时间轴',
                xAxis: 0,
                label: {
                    normal: {
                        formatter: '00:00'
                    }
                }
            }]
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
