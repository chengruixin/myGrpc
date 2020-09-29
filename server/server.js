const PROTO_PATH = __dirname + './../protos/calculator.proto';

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync(
    PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
}
)

const calculator_proto = grpc.loadPackageDefinition(packageDef).calculator;


function Add(call, callback) {
    callback(null, { result: call.request.num1 + call.request.num2 });
}

function getData(call) {
    console.log('body: ', call.request);
    let num = call.request.num;

    console.log('get data : ', num);


    let i = 0;

    let timer = setInterval(() => {
        if (i < 10) {
            call.write({ num: ++num });
            console.log('writing data to stream : ', num);
            i++;
        }
        else {
            console.log('sending finished');
            call.end();
            clearInterval(timer);
        }
    }, 1000);
}

function sendData(call, callback) {
    let sum = 0;
    call.on('data', function (data) {
        console.log('get streaming data from client: ', data);
        sum += data.num;
    })

    call.on('end', function () {
        callback(null, { num: sum });
        console.log('send finished');
    })
}
function main() {
    const server = new grpc.Server();
    server.addService(calculator_proto.Calculator.service, {
        Add: Add,
        getData: getData,
        sendData: sendData
    });
    server.bind('0.0.0.0:9090', grpc.ServerCredentials.createInsecure());
    server.start();
    console.log('server is running on port 9090');
}

main();