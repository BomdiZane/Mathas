// const cluster = require('cluster');

// if (cluster.isMaster){
//     // Master cluster

//     const numCPUs = require('os').cpus().length;
//     console.log(`Forking ${numCPUs} CPUs`);
//     for (let i = 0; i < numCPUs; i++) cluster.fork();
//     cluster.on('exit', () => cluster.fork());
// }
// else{
// Child cluster
const app = require('express')(),
	credentials = require('./credentials'),
	http = require('http').Server(app);

require('./app/webSocketConfig').createConnection(http);
http.listen(credentials.port, () => console.log(`Server started on port ${credentials.port}`));

module.exports = require('./app/expressConfig')(app, credentials);
// }
