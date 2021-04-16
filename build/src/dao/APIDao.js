"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIDao = void 0;
const PgConnection_1 = require("../config/PgConnection");
class APIDao {
    query(revisionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let client = yield PgConnection_1.default.connect();
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
                const { rows } = yield client.query(sql);
                //console.log({ rows });
                client.release();
                return rows;
            }
            catch (e) {
                console.error(e);
            }
            return null;
        });
    }
}
exports.APIDao = APIDao;
//# sourceMappingURL=APIDao.js.map