/* eslint-env mocha */

import sinon from 'sinon';
import { expect } from 'chai';
import { FeedbackStore } from '../stores/FeedbackStore';
import * as PostFeedbackService from '../services/PostFeedbackService';
import * as Router from '../services/Router';

describe('FeedbackStore', () => {
  it('defaults to an empty username', () => {
    const feedbackStore = new FeedbackStore();
    expect(feedbackStore.username).to.equal('');
  });

  it('defaults to empty comments', () => {
    const feedbackStore = new FeedbackStore();
    expect(feedbackStore.comments).to.equal('');
  });

  describe('setComments', () => {
    it('should update comments', () => {
      const feedbackStore = new FeedbackStore();
      feedbackStore.setComments('foo');
      expect(feedbackStore.comments).to.equal('foo');
    });
  });

  describe('setUsername', () => {
    it('should update username', () => {
      const feedbackStore = new FeedbackStore();
      feedbackStore.setUsername('foo');
      expect(feedbackStore.username).to.equal('foo');
    });
  });

  describe('clearErrors', () => {
    it('should clear errors', () => {
      const feedbackStore = new FeedbackStore();
      feedbackStore.errors.comments = 'Comments are invalid';
      feedbackStore.errors.username = 'Username is invalid';

      feedbackStore.clearErrors();

      expect(feedbackStore.errors.comments).to.be.null;
      expect(feedbackStore.errors.username).to.be.null;
    });
  });

  describe('submitFeedback', () => {
    let postFeedback;
    let redirectToRoot;

    beforeEach(() => {
      postFeedback = sinon.stub(PostFeedbackService, 'postFeedback');
      redirectToRoot = sinon.stub(Router, 'redirectToRoot');
    });

    afterEach(() => {
      sinon.restore();
    });

    it('redirects to the root url on successful feedback submission', () => {
      postFeedback.resolves();
      const feedbackStore = new FeedbackStore();
      feedbackStore.setComments('foo');
      feedbackStore.setUsername('bar');

      return feedbackStore.submitFeedback().then(() => {
        sinon.assert.calledOnce(postFeedback);
        sinon.assert.calledWith(postFeedback, 'bar', 'foo');
        sinon.assert.calledOnce(redirectToRoot);
      });
    });

    it('sets errors if feedback submission fails', () => {
      const errorMessage = 'Username is invalid';
      postFeedback.rejects(Object.assign(new Error('fail'), {
        data: {
          errors: [{
            source: {
              parameter: 'username'
            },
            title: errorMessage
          }]
        }
      }));
      const feedbackStore = new FeedbackStore();

      return feedbackStore.submitFeedback().then(() => {
        sinon.assert.calledOnce(postFeedback);
        sinon.assert.notCalled(redirectToRoot);
        expect(feedbackStore.errors.username).to.equal(errorMessage);
        expect(feedbackStore.errors.comments).to.be.null;
      });
    });

    it('can handle multiple errors if feedback submission fails', () => {
      const usernameErrorMessage = 'Username is invalid';
      const commentsErrorMessage = 'Comments are invalid';
      postFeedback.rejects(Object.assign(new Error('fail'), {
        data: {
          errors: [
            {
              source: {
                parameter: 'username'
              },
              title: usernameErrorMessage
            },
            {
              source: {
                parameter: 'comments'
              },
              title: commentsErrorMessage
            }
          ]
        }
      }));
      const feedbackStore = new FeedbackStore();

      return feedbackStore.submitFeedback().then(() => {
        sinon.assert.calledOnce(postFeedback);
        sinon.assert.notCalled(redirectToRoot);
        expect(feedbackStore.errors.username).to.equal(usernameErrorMessage);
        expect(feedbackStore.errors.comments).to.equal(commentsErrorMessage);
      });
    });

    it('clears other errors if submission fails', () => {
      const errorMessage = 'Username is invalid';
      postFeedback.rejects(Object.assign(new Error('fail'), {
        data: {
          errors: [{
            source: {
              parameter: 'username'
            },
            title: errorMessage
          }]
        }
      }));
      const feedbackStore = new FeedbackStore();
      feedbackStore.errors.comments = 'Comments are invalid';

      return feedbackStore.submitFeedback().then(() => {
        sinon.assert.calledOnce(postFeedback);
        sinon.assert.notCalled(redirectToRoot);
        expect(feedbackStore.errors.username).to.equal(errorMessage);
        expect(feedbackStore.errors.comments).to.be.null;
      });
    });

    it('clears all errors on successful submission', () => {
      postFeedback.resolves();
      const feedbackStore = new FeedbackStore();
      feedbackStore.errors.comments = 'Comments are invalid';
      feedbackStore.errors.username = 'Username is invalid';

      return feedbackStore.submitFeedback().then(() => {
        expect(feedbackStore.errors.comments).to.be.null;
        expect(feedbackStore.errors.username).to.be.null;
      });
    });
  });

  describe('handleError', () => {
    it('should do nothing for a normal error', () => {
      const feedbackStore = new FeedbackStore();
      feedbackStore.handleError(new Error('foo')); // should not throw.
    });

    it('should update the errors observable for errors with data', () => {
      const usernameErrorMessage = 'Username is invalid';
      const commentsErrorMessage = 'Comments are invalid';
      const error = Object.assign(new Error('foo'), {
        data: {
          errors: [
            {
              source: {
                parameter: 'username'
              },
              title: usernameErrorMessage
            },
            {
              source: {
                parameter: 'comments'
              },
              title: commentsErrorMessage
            }
          ]
        }
      });
      const feedbackStore = new FeedbackStore();

      feedbackStore.handleError(error);

      expect(feedbackStore.errors.comments).to.be.equal(commentsErrorMessage);
      expect(feedbackStore.errors.username).to.be.equal(usernameErrorMessage);
    });
  });
});
