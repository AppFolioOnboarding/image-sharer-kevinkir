class Image < ApplicationRecord
  validates :url, presence: true
  validates_with ImageUrlValidator
end
