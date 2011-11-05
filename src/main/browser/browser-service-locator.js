
function BrowserServiceLocator() {
    
    // Create services
    this.logger = loggerCtor();
    this.localStorage = browserLocalStorageCtor({ logger: this.logger });
    this.prefsService = {};
    this.httpClient = httpClientCtor({ logger: this.logger, prefsService: this.prefsService });
    this.authService = authServiceCtor({ httpClient: this.httpClient, localStorage: this.localStorage, logger: this.logger });
    this.siteService = siteServiceCtor({ httpClient: this.httpClient, logger: this.logger, prefsService: this.prefsService });
    this.clipService = clipServiceCtor({ httpClient: this.httpClient, logger: this.logger});
    this.netService = netServiceCtor({ httpClient: this.httpClient });
    
    // Resolve dependencies
    this.prefsService.localStorage = this.localStorage;
    this.netService.httpClient = this.httpClient;
    
    // Other setup
}

