export class Validator {

    public static validConfigVariables(config: any): void {
        if (config.require("api_name") == null || config.require("api_name") == undefined) {
            throw new Error("API name - cannot be null!");
        }
        if (config.require("lambda_authorization") == null || config.require("lambda_authorization") == undefined) {
            throw new Error("Lambda authorization Name cannot be null!");
        }
        if (config.require("mg_connection_string") == null || config.require("mg_connection_string") == undefined) {
            throw new Error("Database URL - cannot be null!");
        }
        if (config.require("revision_id") == null || config.require("revision_id") == undefined) {
            throw new Error("Deploy ID - cannot be null!");
        }
        if (config.require("certificate_arn") == null || config.require("certificate_arn") == undefined) {
            throw new Error("Certificate URN is required!");
        }
    }

}