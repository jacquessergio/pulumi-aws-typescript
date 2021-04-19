"use strict";
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
exports.proxy = void 0;
const Constants_1 = require("./Constants");
const ResponseResourceImpl_1 = require("./ResponseResourceImpl");
const FunctionResource_1 = require("./FunctionResource");
const ResponseApi_1 = require("./ResponseApi");
const Config_1 = require("./Config");
exports.proxy = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ event });
    let resourceService = new ResponseResourceImpl_1.ResponseResourceImpl();
    try {
        return resourceService.responseOK(yield new FunctionResource_1.ApiIntegratorResource(new Config_1.Config(event)).execute());
    }
    catch (e) {
        console.error({ e });
        return resourceService.responseError(new ResponseApi_1.ResponseApi(Constants_1.Constants.INTERNAL_SERVER_ERROR, { error: e.message }));
    }
});
//# sourceMappingURL=Handler.js.map