// Service for sites (and their cameras).
// Dependencies:
// spec.httpClient
// spec.logger
// spec.prefsService
var siteServiceCtor = function (spec) {

	var sites = null;
	var selectedSite = null;
	var logger = spec.logger;
	
	// We want String trim below. Could belong elsewhere.
	var trim = function (str) {
		return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	};
	
	var stringToBoolean = function (s) {
		return (s === "true");
	};

	var findSiteById = function (siteId) {
		var s;
		for (s = 0; s < sites.length; ++s) {
			if (sites[s].id === siteId) {
				return sites[s];
			}
		}
		return null;
	};

	var getCameraSnapshotURL = function (camera) {
		return spec.httpClient.resolveURL(
			"camera2.svc/" + camera.mac + "/snapshotviewable", false, true);
	};

	var getCameraClassName = function (camera) {
		if (!camera.isOnline) {
			return "camera-offline";
		} else if (camera.productId === 17) { 
			return "camera-snowbird";
		} else {
			return "camera-alta";
		}
	};

	var getInitialSelectedSite = function () {
		var selectedSiteId = spec.prefsService.selectedSite;
		var site = findSiteById(selectedSiteId);
		if (site) {
			return site;
		}
		return sites[0];
	};

	var getSites = function () {
		return sites;
	};

	var getSelectedSite = function () {
		return selectedSite;
	};

	var selectSiteById = function (siteId) {
		var site = this.findSiteById(siteId);
		if (site) {
			this.selectedSite = site;
			this.prefsService.selectedSite = site.id;
		}
	};

	var getChildText = function (element, childName) {
		var text = element.getElementsByTagName(childName)[0].childNodes[0].nodeValue;
		return trim(text);
	};

	var parseCamera = function (cameraElement) {
		var camera = {
			mac: getChildText(cameraElement, "Mac"),
			name: getChildText(cameraElement, "Name"),
			isOnline: stringToBoolean(getChildText(cameraElement, "IsOnline")),
			ip: getChildText(cameraElement, "InternalIPAddress"),
			ipExternal: getChildText(cameraElement, "IPAddress"),
			productId: getChildText(cameraElement, "ProductId"),
			siteName: getChildText(cameraElement, "SiteName")
		};
		camera.snapshotURL = getCameraSnapshotURL(camera);
		// This seems to make the snapshots appear faster, but they also don't 
		// ever refresh anymore:
		// camera.snapshot = new Image();
		// camera.snapshot.src = camera.snapshotURL();
		camera.className = getCameraClassName(camera);
		logger.log("Camera: %0", camera);
		return camera;
	};

	var parseSite = function (siteElement) {
		var site = {
			name: getChildText(siteElement, "SiteName"),
			id: getChildText(siteElement, "SiteId")
		};
		var cameraElements = siteElement.getElementsByTagName("CameraInfo");
		site.cameras = [];
		for (var c = 0; c < cameraElements.length; ++c) {
			var camera = parseCamera(cameraElements[c]);
			site.cameras.push(camera);
		}
		return site;
	};

	var parseSites = function (xml) {
		var siteElements = xml.getElementsByTagName("SiteInfo");
		var result = [];
		for (var s = 0; s < siteElements.length; ++s) {
			var site = parseSite(siteElements[s]);
			result.push(site);
		}
		return result;
	};

	var loadSites = function (onSuccess, onFailure) {
		spec.httpClient.get("site.svc/?cameras=all&user=default", null, true,
			// Success
			function (response) {
				sites = parseSites(response.responseXML);
				selectedSite = getInitialSelectedSite();
				onSuccess(sites);
			},
			
			// Failure
			onFailure);
	};

	// Public Interface -------------------------------------
	return {
		loadSites: loadSites,
		getSites: getSites,
		selectSiteById: selectSiteById,
		getSelectedSite: getSelectedSite,
		findSiteById: findSiteById
	};
};
