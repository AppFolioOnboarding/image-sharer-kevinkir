require 'test_helper'

class ImageTest < ActiveSupport::TestCase
  setup do
    response_mock = stub(code: '200', content_type: 'image/png')
    Net::HTTP.stubs(:get_response).returns(response_mock)
  end

  test 'rejects a blank url' do
    image = Image.new(url: '   ')
    assert_not_predicate image, :valid?
    assert_equal "Url can't be blank", image.errors.full_messages.first
  end

  test 'rejects a url which has an invalid protocol' do
    image = Image.new(url: 'foo://asdf')
    assert_not_predicate image, :valid?
    assert_equal 'Url must be http or https', image.errors.full_messages.first
  end

  test 'rejects a url which is inaccessible' do
    Net::HTTP.expects(:get_response).raises(StandardError)
    image = Image.new(url: 'https://asdf')
    assert_not_predicate image, :valid?
    assert_equal 'Url returned a bad response', image.errors.full_messages.first
  end

  test 'rejects a url which returns a non-200 response' do
    response_mock = stub(code: '404')
    Net::HTTP.expects(:get_response).returns(response_mock)
    image = Image.new(url: 'https://adsf')
    assert_not_predicate image, :valid?
    assert_equal 'Url returned a non-200 response: 404', image.errors.full_messages.first
  end

  test 'rejects a url which does not return an image' do
    response_mock = stub(code: '200', content_type: 'application/json')
    Net::HTTP.expects(:get_response).returns(response_mock)
    image = Image.new(url: 'https://adsf')
    assert_not_predicate image, :valid?
    assert_equal 'Url has non-image MIME type: application/json', image.errors.full_messages.first
  end

  test 'accepts a url which returns an image' do
    image = Image.new(url: 'https://example.com/foo.png')
    assert_predicate image, :valid?
  end

  test 'newest_first lists images from newest to oldest' do
    Image.create!(url: 'https://example.com/first.png', created_at: Time.now - 1.day)
    newest = Image.create!(url: 'https://example.com/second.png', created_at: Time.now)
    assert_equal newest, Image.newest_first.first
  end
end
