Packages.org.mozilla.javascript.Context.getCurrentContext().setOptimizationLevel(-1);

load('lib/test/env.rhino.1.2.js');

Envjs({
	scriptTypes: {
		"text/javascript": true
	}
});

window.location = "src/test/runner.html";
