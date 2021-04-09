
import { ApiHandler } from "./src/ApiHandler";
import { Environment } from "./src/config/Environment";

let response = null;

try {

    let config = Environment.config();

    response = new ApiHandler(config).execute();

} catch (e) {
    console.error(e)
}

export const res = response;
