'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Constants = void 0;
class Constants {
}
exports.Constants = Constants;
Constants.SUCCESS = 200;
Constants.BAD_REQUEST = 400;
Constants.RESOURCE_NOT_FOUND = 404;
Constants.INTERNAL_SERVER_ERROR = 500;
Constants.UNPROCESSABLE_ENTITY = 422;
Constants.RGX_ONLY_NUMBER = '^[0-9]*$';
Constants.RGX_ORIGIN_RESOURCE_LOGIN = /\/v+[0-9]\/(auth)\/([\w.])+$/g;
Constants.RGX_ORIGIN_RESOURCE_PRODUCT = /\/v+[0-9]\/(products.*)+$/g;
Constants.IS_VALID_CODE = 0;
Constants.MSG_ERROR = '(!) Ocorreu um erro ao processar a solicitacao: ';
Constants.MSG_SUCCESS = '>>> Operacao realizada com sucesso! <<<';
Constants.BUCKET_SOURCE = /bucketproduct.s3.amazonaws.com/gi;
Constants.BUCKET_TARGET = 'betaimages.lopes.com.br';
Constants.ENVIRONMENT = (process.env.stage) ? process.env.stage : 'dev';
Constants.REALM_NAME_INTEGRACAO = 'integracao';
Constants.PATNER_BLISQ = 'blisq';
Constants.PATNER_LPS_EDUARDO = 'lpseduardo';
//# sourceMappingURL=Constants.js.map