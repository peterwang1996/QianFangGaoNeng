var isOpen = true;
var domChartId = 'danmuku-chart';
var chartHeight = 160;
var chartMargin = 10
var domChartInner = '<div id="' + domChartId + '-container" style="height: ' + chartHeight + 'px; width: 980px; margin: ' + chartMargin + 'px auto; background: #fff; border: 1px solid #e5e9ef; border-radius: 4px;"><div id="' + domChartId + '" style="height: ' + chartHeight + 'px"></div></div>';
var danmukuPart = 60;
var timeInAdvance = 5;

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