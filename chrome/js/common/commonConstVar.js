chrome.storage.sync.get(null, function(result) {
    console.log(result);
    try {
        isOpen = result.isOpen;
        if (isOpen) {
            startChart();
        }
    } catch (error) {
        chrome.storage.sync.set({
            'isOpen': ture
        });
    }
});

var domChartId = 'danmuku-chart';
var keyWords = {
    withTimePoint: [
        '空降',
        '高能',
        '换色'
    ],
    withoutTimePoint: [
        '空降成功',
        '前方高能',
        '高能预警',
        '弹幕准备',
        '啊啊啊',
        '我要死了',
        '放闪',
        '发糖',
        '结婚'
    ]
};