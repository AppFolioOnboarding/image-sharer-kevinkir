/* eslint-env mocha */

import { expect } from 'chai';
import { FeedbackStore } from '../stores/FeedbackStore';

describe('FeedbackStore', () => {
  it('defaults to an empty username', () => {
    const feedbackStore = new FeedbackStore();
    expect(feedbackStore.username).to.equal('');
  });

  it('defaults to empty comments', () => {
    const feedbackStore = new FeedbackStore();
    expect(feedbackStore.comments).to.equal('');
  });

  it('should update comments', () => {
    const feedbackStore = new FeedbackStore();
    feedbackStore.setComments('foo');
    expect(feedbackStore.comments).to.equal('foo');
  });
});
