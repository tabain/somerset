exports.config = {
	seleniumAddress: 'http://localhost:4444/wd/hub',
    baseUrl: 'http://localhost:3000/',
    rootElement: 'html',
	suites: {
        homepage: 'homepage.spec.js',
		checkin: './checkin/*.spec.js',
		login: './login/*.spec.js'
	},
    capabilities: {
        'browserName': 'chrome'
    },

    jasmineNodeOpts: {
        showColors: true
    }
};
