class Feedback < ApplicationRecord
  validates :username, presence: true
  validates :comments, presence: true
end
