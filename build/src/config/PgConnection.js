"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const Environment_1 = require("../config/Environment");
let config = Environment_1.Environment.config();
exports.default = new pg_1.Pool({
    max: 20,
    connectionString: config.pgConnectionString,
    idleTimeoutMillis: 1000
});
//# sourceMappingURL=PgConnection.js.map