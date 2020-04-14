class Image < ApplicationRecord
  scope :newest_first, -> { order(created_at: :desc) }
  validates :url, presence: true
  validates_with ImageUrlValidator
  acts_as_taggable
end
