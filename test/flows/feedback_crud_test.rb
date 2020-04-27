require 'flow_test_helper'

class FeedbackCrudTest < FlowTestCase
  test 'submit feedback' do
    new_feedback_page = PageObjects::Feedbacks::NewPage.visit

    new_feedback_page = new_feedback_page.create_feedback!(
      username: ' ',
      comments: 'foo'
    ).as_a(PageObjects::Feedbacks::NewPage)
    assert_equal "Username can't be blank", new_feedback_page.username.error_message
    assert_empty new_feedback_page.comments.error_message

    new_feedback_page = new_feedback_page.create_feedback!(
      username: 'foo',
      comments: ' '
    ).as_a(PageObjects::Feedbacks::NewPage)
    assert_equal "Comments can't be blank", new_feedback_page.comments.error_message
    assert_empty new_feedback_page.username.error_message

    images_index_page = new_feedback_page.create_feedback!(
      username: 'foo',
      comments: 'bar'
    ).as_a(PageObjects::Images::IndexPage)
    assert_equal 'Thank you for your feedback!', images_index_page.flash(:success)
  end
end
