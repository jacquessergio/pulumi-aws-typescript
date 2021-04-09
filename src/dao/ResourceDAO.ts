import { Database } from '../config/Database';
import { IResource } from '../types/IResource';
import Resource from '../models/Resource';


export class ResourceDAO {

    private urlBase: any;

    constructor(config: any) {
        this.urlBase = config.require("db_url");
    }

    async saveCopyDatabase(data: any) {
        let database = new Database(this.urlBase);
        try {
            database.connect();
            let resource: IResource = new Resource({
                am_id: 'string',
                am_name: 'string'
            });
            await resource.save();
        } catch (e) {
            console.error(e)
        } finally {
            database.disconnect();
        }
    }
}