import * as pulumi from "@pulumi/pulumi";
import { Validator } from "../utils/Validator"

export class Environment {

    public static config() {

        let environment = new pulumi.Config();

        Validator.validConfigVariables(environment);

        let gateway = {
            apiId: environment.require("api_id"),
            apiName: environment.require("api_name").toLowerCase(),
            revisionId: environment.require("revision_id"),
            authorization: environment.require("lambda_authorization"),
            pgConnectionString: environment.require("pg_connection_string"),
            certificateArn: environment.require("certificate_arn"),
            environment: environment.require("environment"),
            vhost: environment.require("vhost")
        }

        return gateway;
    }

}