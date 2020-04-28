require 'test_helper'

class FeedbacksControllerTest < ActionDispatch::IntegrationTest
  test 'create valid feedback' do
    assert_difference 'Feedback.count', 1 do
      post api_feedbacks_path, params: {
        feedback: {
          username: 'foo',
          comments: 'bar'
        }
      }
    end

    assert_response :created

    body = JSON.parse(response.body)
    assert_equal 'feedback', body['data']['type']
    assert_equal Feedback.last.id.to_s, body['data']['id']

    assert_equal I18n.t(:feedback_successful), flash[:success]
  end

  test 'create invalid feedback' do
    assert_no_difference 'Feedback.count' do
      post api_feedbacks_path, params: {
        feedback: {
          username: 'foo',
          comments: ''
        }
      }
    end

    assert_response :unprocessable_entity

    body = JSON.parse(response.body)
    assert_equal "Comments can't be blank", body['errors'][0]['title']
    assert_equal 'comments', body['errors'][0]['source']['parameter']

    assert_empty flash
  end
end
