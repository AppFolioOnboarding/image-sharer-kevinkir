require 'test_helper'

class FeedbackTest < ActiveSupport::TestCase
  test 'accepts a valid username and comments' do
    feedback = Feedback.new(username: 'foo', comments: 'bar')
    assert_predicate feedback, :valid?
  end

  test 'rejects a blank username' do
    feedback = Feedback.new(username: ' ', comments: 'bar')
    assert_not_predicate feedback, :valid?
  end

  test 'rejects blank comments' do
    feedback = Feedback.new(username: 'foo', comments: ' ')
    assert_not_predicate feedback, :valid?
  end
end
