import * as pulumi from "@pulumi/pulumi";
import { Validator } from "../utils/Validator"

export class Environment {

    public static config() {

        let environment = new pulumi.Config();

        Validator.validConfigVariables(environment);

        let gateway = {
            apiName: environment.require("api_name"),
            revisionId: environment.require("revision_id"),
            authorization: environment.require("lambda_authorization"),
            eventHanlder: environment.require("lambda_execution_name"),
            pgConnectionString: environment.require("pg_connection_string"),
            certificateArn: environment.require("certificate_arn"),
            environment: environment.require("environment")
        }

        return gateway;
    }

}