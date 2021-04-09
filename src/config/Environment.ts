import * as pulumi from "@pulumi/pulumi";
import { Validator } from "../utils/Validator"

export class Environment {

    public static config() {

        let enviroment = new pulumi.Config();

        Validator.validConfigVariables(enviroment);

        let gateway = {
            apiName: enviroment.require("api_name"),
            revisionId: enviroment.require("revision_id"),
            authorization: enviroment.require("lambda_authorization"),
            eventHanlder: enviroment.require("lambda_execution_name"),
            pgConnectionString: enviroment.require("pg_connection_string")
        }

        return gateway;
    }

}