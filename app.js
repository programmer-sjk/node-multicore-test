const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const express = require('express')

const app = express()
const port = 3000

app.get('/', function(req, res) {
    var j = 0;
    console.log('worker is running, pid: ' + process.pid)
    for(var i = 0; i < 999999999; i++) { // delay response for using another cpu core
        for(var j = 0; j < 5; j++) {}
    }
    res.send('worker pid: ' + process.pid)
})

if(numCPUs > 1) {
    if (cluster.isMaster) {
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }
      
        cluster.on('exit', (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} died`);
        });
    } else {
        app.listen(port, () => console.log(`Express works on ${port} with worker ${process.pid}`))
    }
} else {
    app.listen(port, () => console.log(`Express works with single worker ${process.pid}`))
}




