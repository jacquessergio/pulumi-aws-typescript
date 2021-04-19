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
exports.proxy = void 0;
const Model_1 = require("./Model");
const Config_1 = require("./Config");
const Request_1 = require("./Request");
const Response_1 = require("./Response");
const Constants_1 = require("./Constants");
exports.proxy = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ event });
    let resourceService = new Response_1.Response();
    try {
        return resourceService.responseOK(yield new Request_1.Request(new Config_1.Config(event)).execute());
    }
    catch (e) {
        console.error({ e });
        return resourceService.responseError(new Model_1.Model(Constants_1.Constants.INTERNAL_SERVER_ERROR, { error: e.message }));
    }
});
//# sourceMappingURL=Handler.js.map