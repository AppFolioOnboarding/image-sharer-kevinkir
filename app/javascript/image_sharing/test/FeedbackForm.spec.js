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

  it('should submit the feedback on form submission', () => {
    const preventDefault = sinon.spy();
    const wrapper = shallow(<FeedbackForm />);

    wrapper.simulate('submit', { preventDefault });

    sinon.assert.calledOnce(stubbedFeedbackStore.submitFeedback);
    sinon.assert.calledOnce(preventDefault);
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

    it('should not render any errors prior to submission', () => {
      const wrapper = shallow(<FeedbackForm />);
      const usernameElement = wrapper.find('#username');
      expect(usernameElement.prop('invalid')).to.be.false;
    });

    it('should render errors', () => {
      stubbedFeedbackStore.errors.username = 'not valid';
      const wrapper = shallow(<FeedbackForm />);

      const usernameElement = wrapper.find('#username');
      expect(usernameElement.prop('invalid')).to.be.true;

      const usernameErrorElement = wrapper.find('.js-username-error');
      expect(usernameErrorElement.render().text()).to.equal(stubbedFeedbackStore.errors.username);
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

    it('should not render any errors prior to submission', () => {
      const wrapper = shallow(<FeedbackForm />);
      const commentsElement = wrapper.find('#comments');
      expect(commentsElement.prop('invalid')).to.be.false;
    });

    it('should render errors', () => {
      stubbedFeedbackStore.errors.comments = 'not valid';
      const wrapper = shallow(<FeedbackForm />);

      const commentsElement = wrapper.find('#comments');
      expect(commentsElement.prop('invalid')).to.be.true;

      const commentsErrorElement = wrapper.find('.js-comments-error');
      expect(commentsErrorElement.render().text()).to.equal(stubbedFeedbackStore.errors.comments);
    });
  });
});
