
import * as pulumi from "@pulumi/pulumi";
import { ApiHandler } from "./src/ApiHandler";

import {Validator} from "./src/utils/Validator"

let response = null;

try {
    
    let config = new pulumi.Config();
    
    Validator.validConfigVariables(config);

    response = new ApiHandler(config).execute();
    
} catch (e) {
    console.error(e)
}

export const res = response;
