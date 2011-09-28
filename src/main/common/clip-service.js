// Service for recorded clips.
// Dependencies:
// spec.httpClient
// spec.logger
var clipServiceCtor = function (spec) {
    
    var logger = spec.logger;

    // We want String trim below. Could belong elsewhere.
    var trim = function (str) {
        return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    };

    var formatDatePath = function (date) {
        var result = 
            "/" + date.getUTCFullYear().toString() +
            "/" + (date.getUTCMonth() + 1).toString() +
            "/" + date.getUTCDate().toString();
        logger.log("Date path: " + result);
        return result;
    };
    
    // TODO: Share with clip service
    var getChildText = function (element, childName) {
        var text = element.getElementsByTagName(childName)[0].childNodes[0].nodeValue;
        return trim(text);
    };
    
    var getClipURL = function (clip) {
        var url = spec.httpClient.resolveURL(
            "clip.svc/" + clip.mac + "/" + clip.id, false, true);
        url += "&format=mjpeg";
        return url;
    };
    
    var parseClip = function (clipElement) {
        var clip = {
          id: getChildText(clipElement, "ClipId"),
          mac: getChildText(clipElement, "MacAddress"),
          start: getChildText(clipElement, "StartTime")
        };
        clip.url = getClipURL(clip);
        return clip;
    };
    
    var parseClips = function (xml) {
		var c;
        var result = [];
        if (xml !== null) {
            var clipElements = xml.getElementsByTagName("Clip");
            for (c = 0; c < clipElements.length; ++c) {
                var clip = parseClip(clipElements[c]);
                result.push(clip);
            }
        } else {
            logger.log("No XML returned for this clip request.");
        }
        return result;
    };

    var getClipsForDate = function (mac, date, onSuccess, onFailure) {
        logger.log("Clip search date: " + date.toString());
        spec.httpClient.get("search.svc/" + mac + formatDatePath(date),
            null, true,
            function (response) {
                var clips = parseClips(response.responseXML);
                onSuccess(clips);
            },
            onFailure
        );
    };
    
    return {
        getClipsForDate: getClipsForDate
    };
};