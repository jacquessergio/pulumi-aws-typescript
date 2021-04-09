import { Pool } from 'pg';

import { Environment } from "../config/Environment";

let config = Environment.config();

export default new Pool ({
    max: 20,
    connectionString: config.pgConnectionString,
    idleTimeoutMillis: 1000
});