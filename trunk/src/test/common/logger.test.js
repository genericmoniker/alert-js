// Logger tests
// https://github.com/pivotal/jasmine/wiki
describe('Logger', function () {

	var logger;
	var result;
	var outputFunction = function (text) {
		result = text;
	};

    beforeEach(function () {
		result = "";
		logger = loggerCtor({ output: outputFunction });
    });

    it('should not log if no args are passed in', function () {
		logger.log();
        expect(result).toBeFalsy();
    });

    it('should not log if the first arg is not a string', function () {
		logger.log(10);
        expect(result).toBeFalsy();
    });

    it('should copy a simple message to the output', function () {
		logger.log("nuclear chicken");
        expect(result).toEqual("nuclear chicken");
    });

    it('should do replacements in the output', function () {
		logger.log("%0 %1 %2", 1, "hello", 2);
        expect(result).toEqual("1 hello 2");
    });

    it('should leave replacements if there is nothing to replace with', function () {
		logger.log("%0 %1 %2", 1, "hello");
        expect(result).toEqual("1 hello %2");
    });

    it('should ignore extra args', function () {
		logger.log("%0 %1", 1, "hello", 2, 3);
        expect(result).toEqual("1 hello");
    });

    it('should fail', function () {
        expect(true).toEqual(false);
    });

});