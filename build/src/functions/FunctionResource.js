'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiIntegratorResource = void 0;
const RestTemplateImpl_1 = require("./RestTemplateImpl");
const ResponseApi_1 = require("./ResponseApi");
const ResourceUtil_1 = require("./ResourceUtil");
const InterceptorServiceImpl_1 = require("./InterceptorServiceImpl");
const URL = process.env.base_url;
class ApiIntegratorResource {
    constructor(event) {
        this.execute = () => __awaiter(this, void 0, void 0, function* () {
            try {
                let response = yield this.restService.executeApiCall();
                let responseIntercepted = this.interceptorService.interceptResponse(response);
                return new ResponseApi_1.ResponseApi(responseIntercepted.statusCode, responseIntercepted.responseBody);
            }
            catch (e) {
                throw new Error(e.message);
            }
        });
        this.interceptorService = new InterceptorServiceImpl_1.InterceptorApiIntegratorServiceImpl();
        this.requestIntercepted = this.interceptorService.interceptRequest(event);
        this.config = ResourceUtil_1.ResourceUtil.config(this.requestIntercepted, URL);
        this.restService = new RestTemplateImpl_1.RestTemplateImpl(this.config);
    }
}
exports.ApiIntegratorResource = ApiIntegratorResource;
//# sourceMappingURL=FunctionResource.js.map