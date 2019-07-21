import {
  Cluster
} from './../src/index';
import {
  expect
} from 'chai';

describe('clusterForker', () => {

  it('Returns `hello universe`', () => {
    expect(new Cluster).to.be.instanceOf(Cluster);
  });

});
