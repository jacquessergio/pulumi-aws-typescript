export class Validator {

    public static validConfigVariables(config: any): void {
        if (config.require("api_name") == null || config.require("api_name") == undefined) {
            throw new Error("API name - cannot be null!");
        }
        if (config.require("lambda_authorization") == null || config.require("lambda_authorization") == undefined) {
            throw new Error("Lambda authorization Name cannot be null!");
        }
        if (config.require("lambda_execution_name") == null || config.require("lambda_execution_name") == undefined) {
            throw new Error("Lambda execution Name - cannot be null!");
        }
        if (config.require("db_url") == null || config.require("db_url") == undefined) {
            throw new Error("Database URL - cannot be null!");
        }
    }

}