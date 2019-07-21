import {
  clusterForker
} from './../src/index';
import {
  expect
} from 'chai';

describe('clusterForker', () => {

  it('Returns `hello universe`', () => {
    expect(clusterForker()).to.equal('hello universe');
  });

});
