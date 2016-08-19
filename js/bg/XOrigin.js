chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'requireDanmuku' && request.type === 'xml') {
        try {
            var danmukuXml = $.ajax({
                url: request.src,
                processData: false,
                cache: false,
                async: false,
                dataType: 'xml'
            }).responseXML;
            responseData = {
                status: 'OK',
                danmukuXml: danmukuXml,
                danmukuXmlText: (new XMLSerializer()).serializeToString(danmukuXml)
            }
            console.log(responseData);
            sendResponse(responseData);
        } catch (e) {
            sendResponse({
                status: 'error',
                info: (e + '')
            });
        }
    }
});