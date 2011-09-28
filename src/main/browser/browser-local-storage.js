// Local storage implementation backed by nothing (could use cookies).
// Dependencies:
// spec.logger
var browserLocalStorageCtor = function (spec) {
	var logger = spec.logger;
	
	var getValue = function (name) {
		return "";
	};
	
	var setValue = function (name, value) {
	};
	
	var remove = function (name) {
	};
	
	return {
		getValue: getValue,
		setValue: setValue,
		remove: remove
	};
};
