/* eslint-env mocha */

import 'mobx-react/batchingForReactDom';
import sinon from 'sinon';
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import FeedbackForm from '../components/FeedbackForm';
import * as Stores from '../hooks/use-stores';
import { FeedbackStore } from '../stores';

describe('FeedbackForm', () => {
  let stubbedFeedbackStore;

  beforeEach(() => {
    stubbedFeedbackStore = sinon.createStubInstance(FeedbackStore);
    sinon.stub(Stores, 'useStores').returns({
      feedbackStore: stubbedFeedbackStore
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('username input', () => {
    it('should get its value from the feedback store', () => {
      stubbedFeedbackStore.username = 'foo';
      const wrapper = shallow(<FeedbackForm />);
      const usernameElement = wrapper.find('#username');
      expect(usernameElement.prop('value')).to.equal('foo');
    });

    it('should call the setUsername action on change', () => {
      const wrapper = shallow(<FeedbackForm />);
      const usernameElement = wrapper.find('#username');
      usernameElement.simulate('change', {
        target: { value: 'new-username' },
      });
      sinon.assert.calledWith(stubbedFeedbackStore.setUsername, 'new-username');
    });
  });

  describe('comments textarea', () => {
    it('should get its value from the feedback store', () => {
      stubbedFeedbackStore.comments = 'foo';
      const wrapper = shallow(<FeedbackForm />);
      const commentsElement = wrapper.find('#comments');
      expect(commentsElement.prop('value')).to.equal('foo');
    });

    it('should call the setUsername action on change', () => {
      const wrapper = shallow(<FeedbackForm />);
      const commentsElement = wrapper.find('#comments');
      commentsElement.simulate('change', {
        target: { value: 'some comment' },
      });
      sinon.assert.calledWith(stubbedFeedbackStore.setComments, 'some comment');
    });
  });
});
