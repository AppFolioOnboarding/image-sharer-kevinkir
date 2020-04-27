/* eslint import/no-extraneous-dependencies: 1 */

import 'jsdom-global/register';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Adapter from 'enzyme-adapter-react-16/build/index';
import { configure } from 'enzyme';

configure({ adapter: new Adapter() });

chai.use(chaiAsPromised);

//
// Throw exceptions on unhandled promise rejections to prevent tests
// from silently failing async.
//
let unhandledRejection = false;
process.on('unhandledRejection', (reason, promise) => {
  console.error('unhandled rejection:', reason || promise); // eslint-disable-line no-console
  unhandledRejection = true;
  throw promise;
});
process.prependListener('exit', (code) => {
  if (unhandledRejection && code === 0) {
    process.exit(1);
  }
});
