module Api
  class FeedbacksController < ApplicationController
    def create
      feedback = Feedback.new(feedback_params)
      if feedback.save
        render status: :created, json: {
          data: {
            type: 'feedback',
            id: feedback.id,
            attributes: {
              username: feedback.username,
              comments: feedback.comments
            }
          }
        }
      else
        render status: :unprocessable_entity, json: {
          errors: feedback.errors.map do |field, message|
            {
              title: "#{field.capitalize} #{message}",
              source: {
                parameter: field
              }
            }
          end
        }
      end
    end

    private

    def feedback_params
      params.require(:feedback).permit(:username, :comments)
    end
  end
end
