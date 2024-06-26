const { join } = require('path');
const { execSync } = require('child_process');
const { rimrafSync } = require('rimraf');
const { protoPath: healthProtoPath } = require('grpc-health-check');
const path = require('path');
const fs = require('fs');

const PROTO_DIR = join(__dirname, '../proto');
const MODEL_DIR = join(__dirname, '../src/models');
const PROTOC_PATH = join(__dirname, "../node_modules/grpc-tools/bin/protoc");
const PLUGIN_PATH = join(__dirname, "../node_modules/.bin/protoc-gen-ts_proto");

rimrafSync(`${MODEL_DIR}/*`, {
  glob: { ignore: `${MODEL_DIR}/tsconfig.json` },
});

fs.copyFileSync(healthProtoPath, join(PROTO_DIR, 'health.proto'));

// check models is exist
const isExist = fs.existsSync(path.join(__dirname, '../src/models'));
if (!isExist) {
  fs.mkdirSync(path.join(__dirname, '../src/models'));
}

// https://github.com/stephenh/ts-proto/blob/main/README.markdown#supported-options
const tsProtoOpt = [
  'outputServices=grpc-js',
  'env=node',
  'useOptionals=messages',
  'exportCommonSymbols=false',
  'esModuleInterop=true',
];

const protoConfig = [
  `--plugin=${PLUGIN_PATH}`,
  `--ts_proto_opt=${tsProtoOpt.join(',')}`,
  `--ts_proto_out=${MODEL_DIR}`,
  `--proto_path ${PROTO_DIR} ${PROTO_DIR}/*.proto`,
];

// https://github.com/stephenh/ts-proto#usage
execSync(`${PROTOC_PATH} ${protoConfig.join(" ")}`);
console.log(`> Proto models created: ${MODEL_DIR}`);