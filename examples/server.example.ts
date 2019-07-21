import Cluster from "../src";
import http from 'http';

let superCluster = new Cluster();

superCluster
  .master( ( cluster ) => {
    // This block runs only in master worker
    console.log('master is running');
  } )
  .fork( ( cluster ) => {
    http.createServer(function(req, res) {
      res.writeHead(200);
      res.end('process ' + process.pid + ' says hello!');
    }).listen(8000);
  } )
  .on('online', function(worker) {
    console.log('Worker ' + worker.process.pid + ' is online');
  })
  .limit( 4 )
  .forkOnExit((worker, code, signal) => {
    console.log('started new worker fork');
  })
  .onExit( ( worker, code, signal ) => {
    console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
    console.log('Starting a new worker');
  } )
  .run() // Runs the cluster and begins forking
