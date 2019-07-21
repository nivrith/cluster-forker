/*!
 * cluster-forker <https://github.com/nivrith/cluster-forker>
 *
 * Copyright (c) Nivrith
 * Licensed under the MIT License.
 */


import cluster, {
  Address,
  ClusterSettings,
  Worker
} from 'cluster';
import {
  cpus
} from 'os';

import net from 'net';
import {
  threadId
} from 'worker_threads';

type ClusterModule = typeof cluster;
type ClusterWorkers = typeof cluster.workers;

/**
 *
 *
 * @export
 * @class Cluster
 */
export class Cluster {
  /**
   *
   *
   * @private
   * @type {ClusterModule}
   * @memberof Cluster
   */
  private cluster: ClusterModule = cluster;

  /**
   *
   *
   * @private
   * @type {(Function | undefined)}
   * @memberof Cluster
   */
  private _master: Function | undefined;

  /**
   *
   *
   * @private
   * @type {(Function | undefined)}
   * @memberof Cluster
   */
  private _forked: Function | undefined;

  /**
   *
   *
   * @static
   * @memberof Cluster
   */
  public static cpus = cpus().length;


  /**
   *
   *
   * @type {number}
   * @memberof Cluster
   */
  public _limit: number = Cluster.cpus;

  /**
   *Creates an instance of Cluster.
   * @memberof Cluster
   */
  constructor() {

  }
  /**
   *
   *
   * @param {( cluster: ClusterModule ) => any} [fn]
   * @returns
   * @memberof Cluster
   */
  public fork( fn ? : ( cluster: ClusterModule ) => any ) {
    this._forked = fn;
    return this;
  }

  /**
   *
   *
   * @returns
   * @memberof Cluster
   */
  public async run() {
    let limit = this._limit;
    // Fork workers.
    if ( this.cluster.isMaster ) {
      for ( let i = 0; i < limit; i++ ) {
        this.cluster.fork();
      }
      return Promise.resolve( {
        worker: this.cluster.worker,
        value: await this.runMaster()
      } )
    } else {
      return Promise.resolve( {
        worker: this.cluster.worker,
        value: await this.runForked()
      } )
    }
  }

  /**
   *
   *
   * @private
   * @returns
   * @memberof Cluster
   */
  private async runMaster() {
    if ( typeof this._master === 'function' ) {
      return await this._master( this.cluster );
    }
  }

  /**
   *
   *
   * @private
   * @returns
   * @memberof Cluster
   */
  private async runForked() {
    if ( typeof this._forked === 'function' ) {
      return await this._forked( this.cluster );
    }
  }

  /**
   *
   *
   * @param {( id: string, worker ? : cluster.Worker ) => any} [callback]
   * @returns
   * @memberof Cluster
   */
  public forEachWorker( callback ? : ( id: string, worker ? : cluster.Worker ) => any ) {
    if ( this.isMaster ) {
      const callbackIsFunction = callback !== undefined && typeof callback === 'function';
      for ( const [ id, worker ] of Object.entries( this.cluster.workers ) ) {
        if ( callbackIsFunction ) {
          callback!( id, worker );
        }
      }
    }
    return this;
  }


  public onExit( listener ? : ( worker: Worker, code: number, signal: cluster.Cluster ) => any ): Cluster {
    if ( listener ) {
      this.cluster.on( 'exit', listener );
    }
    return this;
  }

  public forkOnExit( listener ? : ( worker: Worker, code: number, signal: cluster.Cluster ) => any ): Cluster {
    this.cluster.on( 'exit', ( worker: Worker, code: number, signal: cluster.Cluster ) => {
      this.cluster.fork();
      if ( listener && ( typeof listener === 'function' ) ) {
        listener!( worker, code, signal );
      }
    } )
    return this;
  }

  public removeAllListeners() {
    this.cluster.removeAllListeners();
    return this;
  }

  on( event: string, listener: ( ...args: any[] ) => void ): this;
  on( event: "disconnect", listener: ( worker: Worker ) => void ): this;
  on( event: "exit", listener: ( worker: Worker, code: number, signal: cluster.Cluster ) => void ): this;
  on( event: "fork", listener: ( worker: Worker ) => void ): this;
  on( event: "listening", listener: ( worker: Worker, address: Address ) => void ): this;
  on( event: "message", listener: ( worker: Worker, message: any, handle: net.Socket | net.Server ) => void ): this; // the handle is a net.Socket or net.Server object, or undefined.
  on( event: "online", listener: ( worker: Worker ) => void ): this;
  on( event: "setup", listener: ( settings: ClusterSettings ) => void ): this;
  public on( event: any, listener: any ) {
    this.cluster.on( event, listener )
    return this;
  }
  /**
   *
   *
   * @param {( worker: cluster.Worker ) => void} [listener]
   * @returns
   * @memberof Cluster
   */
  public onfork( listener ? : ( worker: cluster.Worker ) => void ) {
    if ( listener ) {
      this.cluster.on( 'fork', listener );
    }
    return this;
  }


  /**
   *
   *
   * @param {number} [n=Cluster.cpus]
   * @returns
   * @memberof Cluster
   */
  public limit( n: number = Cluster.cpus ) {
    if ( n > Cluster.cpus ) {
      this._limit = Cluster.cpus;
    } else {
      this._limit = n;
    }
    return this;
  }

  /**
   *
   *
   * @param {( cluster: ClusterModule ) => any} [fn]
   * @returns
   * @memberof Cluster
   */
  public master( fn ? : ( cluster: ClusterModule ) => any ) {
    this._master = fn;
    return this;
  }

  /**
   *
   *
   * @readonly
   * @memberof Cluster
   */
  public get isMaster() {
    return this.cluster.isMaster;
  }

  /**
   *
   *
   * @readonly
   * @memberof Cluster
   */
  public get isWorker() {
    return this.cluster.isWorker;
  }

}

export default Cluster;