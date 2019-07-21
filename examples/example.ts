import Cluster from "../src";

let superCluster = new Cluster();

superCluster
  .master( ( cluster ) => {
    // This block runs only in master worker
    console.log( 'Only Master', process.pid );
    // console.log(workers);
    return 'master return';
  } )
  .limit( 25 )// Limit number of child processes . Defaults to max cpu cores
  // If limit is passed greater than num of cpu cores.
  // num of cup cores is used

  .onExit( ( signal, code ) => console.log( 'Exit code: ', process.pid, code ) )
  .fork( ( cluster ) => {
    // runs only in forked workers
    // Do not attempt to call fork on cluster here
    // cluster.fork is undefined here as it can only be called in master process
    return 'fork return';
  } )
  .run() // Runs the cluster and begins forking
  .then( ( result ) => {
    // this block runs in both master and worker before
    // result.value has resolved return value of fork callback

    console.log( result.value, process.pid );
  } );

  // iterate over each worker in master worker
  // Iteration occurs only on master cluster
  superCluster.forEachWorker( ( id, worker ) => {
    console.log( id );
  } )