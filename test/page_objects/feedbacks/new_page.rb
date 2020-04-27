module PageObjects
  module Feedbacks
    class NewPage < PageObjects::Document
      path :new_feedback

      form_for :feedback, locator: '.js-feedback-form' do
        element :username, locator: '#username'
        element :comments, locator: '#comments'
      end

      def create_feedback!(username: nil, comments: nil)
        feedback.username.set username unless username.nil?
        feedback.comments.set comments unless comments.nil?

        node.click_on('Submit')

        window.change_to(PageObjects::Images::IndexPage, NewPage)
      end
    end
  end
end
