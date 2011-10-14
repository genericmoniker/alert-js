Packages.org.mozilla.javascript.Context.getCurrentContext().setOptimizationLevel(-1);

load('lib/test/env.rhino.1.2.js');

// Configure Envjs to handle regular text/javascript.
Envjs({
	scriptTypes: {
		"text/javascript": true
	}
});

// Load our test runner into the DOM.
window.location = "src/test/runner.html";
