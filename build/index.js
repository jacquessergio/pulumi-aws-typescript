"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.res = void 0;
const ApiHandler_1 = require("./src/ApiHandler");
const Environment_1 = require("./src/config/Environment");
let response = null;
try {
    let config = Environment_1.Environment.config();
    response = new ApiHandler_1.ApiHandler(config).execute();
}
catch (e) {
    console.error(e);
}
exports.res = response;
//# sourceMappingURL=index.js.map