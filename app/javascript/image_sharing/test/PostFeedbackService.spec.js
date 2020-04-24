/* eslint-env mocha */

import { expect } from 'chai';
import sinon from 'sinon';

import * as PostHelper from '../utils/helper';
import { postFeedback } from '../services/PostFeedbackService';

describe('PostFeedbackService', () => {
  let postStub;

  beforeEach(() => {
    postStub = sinon.stub(PostHelper, 'post');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('postFeedback', () => {
    it('should resolve if the request succeeds', () => {
      const expectedResponse = 'foo';
      postStub.resolves(expectedResponse);

      return postFeedback('user', 'comment').then((response) => {
        sinon.assert.calledOnce(postStub);
        sinon.assert.calledWithExactly(
          postStub,
          '/api/feedbacks',
          { username: 'user', comments: 'comment' }
        );
        expect(response).to.equal(expectedResponse);
      });
    });

    it('should reject if the request fails', () => {
      const expectedError = new Error('expected errror');
      postStub.rejects(expectedError);

      return postFeedback('user', 'comment').then(
        () => {
          expect.fail('postFeedback unexpectedly resolved');
        },
        (error) => {
          expect(error).to.equal(expectedError);
        }
      );
    });
  });
});
