require 'test_helper'

class ImagesControllerTest < ActionDispatch::IntegrationTest
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
