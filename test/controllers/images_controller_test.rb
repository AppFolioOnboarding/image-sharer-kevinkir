require 'test_helper'

class ImagesControllerTest < ActionDispatch::IntegrationTest
  test 'should get index' do
    get images_url
    assert_response :success
    assert_select 'a[href=?]', new_image_path
  end

  test 'should show images on the index' do
    oldest = Image.create!(url: 'http://images.com/oldest.png', created_at: Time.now - 1.day)
    newest = Image.create!(url: 'http://images.com/newest.png', created_at: Time.now)

    get images_url
    assert_select 'a[href=?]', new_image_path
    assert_select 'li img', count: 2 do |elements|
      assert_equal newest.url, elements.first.attribute('src').value
      assert_equal oldest.url, elements[1].attribute('src').value
    end
  end

  test 'should not display a list of images if there are none' do
    get images_url
    assert_select '.image-list', count: 0
  end

  test 'should get new' do
    get new_image_url
    assert_response :success
  end

  test 'should redirect to the image on create success' do
    post images_url, params: {
      image: { url: 'http://bogus-url' }
    }
    assert_redirected_to image_path(Image.last)
    assert_equal I18n.t(:image_created), flash[:success]
  end

  test 'should return an error response on create failure' do
    response_mock = stub(code: '404', content_type: 'image/png')
    Net::HTTP.expects(:get_response).returns(response_mock)

    post images_url, params: {
      image: { url: 'http://bogus-url' }
    }
    assert_response :unprocessable_entity
    assert_equal 'The form contains 1 error', flash[:danger]
  end

  test 'should show an image' do
    url = 'http://bogus-url'
    image = Image.create!(url: url)
    get image_url(image)
    assert_response :success
    assert_select 'img[src=?]', url
  end

  test 'should redirect to root if the image does not exist' do
    get image_url(id: -1)
    assert_redirected_to root_url
    assert_equal I18n.t(:image_not_found), flash[:danger]
  end
end
