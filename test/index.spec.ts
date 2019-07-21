import {
  Cluster
} from './../src/index';
import {
  expect
} from 'chai';

describe('clusterForker', () => {

  it('Is instance of Cluster', () => {
    expect(new Cluster).to.be.instanceOf(Cluster);
  });

});
