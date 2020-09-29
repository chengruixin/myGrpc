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

function main() {
    const client = new calculator_proto.Calculator('localhost:9090', grpc.credentials.createInsecure());

    // client.Add({ num1: 2, num2: 8 }, function (err, response) {
    //     if (err) console.error(err);
    //     console.log('result is ' + response.result);
    // });

    // const call = client.getData({ num: 10 });

    // // console.log('1');
    // call.on('data', function (response) {
    //     console.log(response);
    //     console.log(response.num);
    // })
    // // console.log('2');
    // call.on('end', function (response) {
    //     console.log('finished');
    // })
    // // console.log('3');

    const call = client.sendData(function (err, response) {
        if (err) console.error(err);
        console.log(response);
    })
    let i = 0;
    let timer = setInterval(() => {
        if (i < 10) {
            let num = Math.random() * 10;
            console.log('sending data to server ', num);
            call.write({ num: num });
            i++;
        }
        else {
            console.log('done');
            call.end();
            clearInterval(timer);
        }
    }, 1000);
}

main();