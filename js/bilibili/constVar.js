var isOpen = true;
var domChartId = 'danmuku-chart';
var domChartInner = '<div id="' + domChartId + '" style="width: 980px; height: 160px; margin: 0 auto;"></div>';
var danmukuPart = 60;
var timeInAdvance = 5;

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