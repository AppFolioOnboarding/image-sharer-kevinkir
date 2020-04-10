ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../config/environment', __dir__)
require 'rails/test_help'
require 'mocha/minitest'

module ActiveSupport
  class TestCase
    # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
    fixtures :all

    # Add more helper methods to be used by all tests here...

    setup do
      response_mock = stub(code: '200', content_type: 'image/png')
      Net::HTTP.stubs(:get_response).returns(response_mock)
    end
  end
end
