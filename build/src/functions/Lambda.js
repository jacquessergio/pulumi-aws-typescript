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
exports.handler = void 0;
exports.handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield new Promise((resolve) => {
        callAPI((data) => {
            resolve(data);
        });
    });
    return {
        statusCode: 200,
        body: response,
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
    };
});
function callAPI(callback) {
    let content = "";
    require("https").get("https://606313a30133350017fd285b.mockapi.io/api/v1/apis", (res) => {
        res.setEncoding("utf8");
        res.on("data", (chunk) => content += chunk);
        res.on("end", () => {
            callback(content);
        });
    }, (error) => {
        callback(error);
    });
}
//# sourceMappingURL=Lambda.js.map