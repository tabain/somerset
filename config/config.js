/**
 * Single Endpoint for verification/derivation of external endpoints based on external config/environment variables.
 * @module config/config
 */

'use strict';
var path = require('path');
var rootPath = path.normalize(__dirname + '/../');

module.exports = {
    rootPath: rootPath,
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT,
    dbHost: process.env.DB_HOST || 'localhost',
    dbName: process.env.DB_NAME,
    dbUser: process.env.DB_USER,
    dbString: process.env.DB_STRING,
    dbPassword: process.env.DB_PASS,
    dbPort: process.env.DB_PORT || 27017,
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
    S3_BUCKET: process.env.S3_BUCKET,
    REGION: process.env.S3_REGION,
    debug: process.env.DEBUG || true,

    viewPath: function () {
        return this.rootPath + '/server/views';
    },

    getPublicPath: function () {
        if (this.env == 'production') return this.rootPath + '/public';
        return this.rootPath + '/public-debug';
    },

    getDbConnectionString: function () {
        if (this.dbString && this.dbString.length > 5)
            return this.dbString;
        else if (this.dbUser && this.dbPassword)
            return 'mongodb://' + this.dbUser + ':' + this.dbPassword + '@' + this.dbHost + ':' + this.dbPort + '/' + this.dbName;
        else
            return 'mongodb://' + this.dbHost + ':' + this.dbPort + '/' + this.dbName;
    },

    /**
     * All variables should be valid in order to continue in production version. Can be used to block code access to sensitive app areas.
     */
    isProductionReady: function () {

        if (
            this.env === 'production' && this.port
        ) return true;

        console.warn('This code shoudnt be executed while not in production env or when testing. Or the config is incomplete.');
        return false;
    },

    /**
     * Some variables should be valid in order to continue in production version. Can be used to block code access to sensitive app areas.
     */
    isDevelopmentReady: function () {

        if (
            this.port >= 3000
        ) return true;

        console.warn('This code cannot be executed in development env. Or the config is incomplete.');
        return false;
    }
};