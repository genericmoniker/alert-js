// Network status service
// Dependencies:
// spec.httpClient
var netServiceCtor = function (spec) {

	var httpClient = spec.httpClient;
	var ipAddressRegExp = /([0-9]+)\.([0-9]+)\.([0-9]+)\.([0-9]+)/; // liberal match
	var ipExternal = null;
	
	var isOnline = function () {
		return navigator.onLine;
	};
	
	var getIPExternal = function () {
		return ipExternal;
	};
	
	var refreshIPExternal = function () {
		// TODO - use web service to determine external IP address
	};
	
	// Public interface
	return {
		isOnline: isOnline,
		getIPExternal: getIPExternal,
		refreshIPExternal: refreshIPExternal
	};
};
