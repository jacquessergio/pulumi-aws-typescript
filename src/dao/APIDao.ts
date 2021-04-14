import pool from "../config/PgConnection";

export class APIDao {


    public async query(revisionId: string) {

        try {
            let client = await pool.connect();

            const sql = `SELECT
                            AP.api_uuid,
                            AP.api_name,
                            AP.api_version,
                            AP.status,
                            AP.context,
                            AP.context_template,
                            RS.revision_uuid,
                            RS.http_method,
                            RS.url_pattern,
                            RS.auth_scheme,
                            RS.throttling_tier,
                            GW.vhost,
                            GW.label
                        FROM am_api_url_mapping RS 
                                INNER JOIN am_gw_api_deployments GW ON (GW.revision_id = RS.revision_uuid) 
                                INNER JOIN am_api AP ON (AP.api_uuid = GW.api_id) 
                        WHERE GW.revision_id = '${revisionId}'`;

            const { rows } = await client.query(sql);

            //console.log({ rows });

            client.release();

            return rows;

        } catch (e) {
            console.error(e)
        }
        return null;
    }
}