'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
const Config_1 = require("./Config");
const querystring = require('querystring');
const jwt_decode = require('jwt-decode');
class Util {
    static config(request, url) {
        request.url = url;
        return new Config_1.Config(request, this.buildAndVerifyURI(request));
    }
    static decodeToken(token) {
        if (token === undefined || token === null)
            throw new Error('Error decode JWT token');
        return jwt_decode(token);
    }
    static buildAndVerifyURI(request) {
        this.validations(request);
        let queryStringParameters = request.queryStringParameters;
        if (queryStringParameters != null && queryStringParameters !== undefined) {
            queryStringParameters = querystring.stringify(queryStringParameters);
        }
        let basePath = this.buildBasePath(request);
        return (queryStringParameters != null) ? String(request.url).concat(`${basePath}?${queryStringParameters}`) : String(request.url).concat(basePath);
    }
    static validations(request) {
        this.isValidURL(request.url);
        this.isValidBasePath(request.path);
    }
    static isValidURL(url) {
        if (url === undefined || url === null)
            throw new Error('URL not found');
    }
    static isValidBasePath(path) {
        if (path === undefined || path === null)
            throw new Error('Base path Not found');
        let firstLevel = path.split('/')[1];
        this.isValidFirstLevel(firstLevel);
    }
    static isValidFirstLevel(firstLevel) {
        if (firstLevel === undefined || firstLevel === null)
            throw new Error('First Level not found');
    }
    static buildBasePath(request) {
        let firstLevel = request.path.split('/')[1];
        if (firstLevel.charAt(0).toLocaleLowerCase() === 'v') {
            request.path = request.path.replace(firstLevel, 'api/'.concat(firstLevel));
        }
        else {
            request.path = request.path.replace(firstLevel, 'api');
        }
        return request.path;
    }
}
exports.Util = Util;
//# sourceMappingURL=Util.js.map