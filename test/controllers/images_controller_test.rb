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
    assert_select 'li img', count: 2 do |elements|
      assert_equal newest.url, elements.first.attribute('src').value
      assert_equal oldest.url, elements[1].attribute('src').value
    end
  end

  test 'should show tags on the index' do
    Image.create!(url: 'http://images.com/image.png', tag_list: 'foo,bar')
    get images_url
    assert_select '.js-image-tag' do |elements|
      assert_equal %w[foo bar], elements.map(&:text)
    end
  end

  test 'should not show tags on the index for images which have no tags' do
    Image.create!(url: 'http://images.com/image.png')
    get images_url
    assert_select '.js-tag-list', count: 0
  end

  test 'should not display a list of images if there are none' do
    get images_url
    assert_select '.js-image-list', count: 0
    assert_select '.js-no-images-message', 'No images have been added'
  end

  test 'should filter images if the tag query parameter is provided' do
    Image.create!(url: 'http://images.com/image1.png', tag_list: 'foo, bar')
    Image.create!(url: 'http://images.com/image2.png', tag_list: 'baz, foo')
    Image.create!(url: 'http://images.com/image3.png', tag_list: 'bim')

    get images_url(tag: 'foo')

    assert_select 'li img', count: 2
    assert_select '.js-clear-filter-link[href=?]', images_path
  end

  test 'should display no images if the tag query parameter does not match any images' do
    Image.create!(url: 'http://images.com/image1.png', tag_list: 'foo, bar')
    get images_url(tag: 'bim')
    assert_select '.js-image-list', count: 0
    assert_select '.js-no-images-message', "There are no images tagged with 'bim'"
  end

  test 'should get new' do
    get new_image_url
    assert_response :success
    assert_select '.form-control', count: 2
    assert_select '#image_url'
    assert_select '#image_tag_list'
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

  test 'should preserve form field data if creation fails' do
    response_mock = stub(code: '404', content_type: 'image/png')
    Net::HTTP.expects(:get_response).returns(response_mock)

    url = 'http://bogus-url'
    tag_list = 'foo, bar'
    post images_url, params: {
      image: { url: url, tag_list: tag_list }
    }
    assert_response :unprocessable_entity
    assert_select '.form-control[value=?]', url
    assert_select '.form-control[value=?]', tag_list
  end

  test 'should create an image with tags' do
    post images_url, params: {
      image: { url: 'http://bogus-url', tag_list: 'foo, bar' }
    }
    assert_equal %w[foo bar], Image.last.tag_list
  end

  test 'should show an image' do
    url = 'http://bogus-url'
    image = Image.create!(url: url)
    get image_url(image)
    assert_response :success
    assert_select 'img[src=?]', url
    assert_select '.js-delete-image-link[href=?]', image_path(image)
  end

  test 'should redirect to root if the image does not exist' do
    get image_url(id: -1)
    assert_redirected_to root_url
    assert_equal I18n.t(:image_not_found), flash[:danger]
  end

  test "should show the image's tags" do
    image = Image.create!(url: 'http://images.com/image.png', tag_list: 'foo,bar')
    get image_url(image)
    assert_select '.js-image-tag' do |elements|
      assert_equal %w[foo bar], elements.map(&:text)
    end
  end

  test 'should not show tags for the image if there are none' do
    image = Image.create!(url: 'http://images.com/image.png')
    get image_url(image)
    assert_select '.js-tag-list', count: 0
  end

  test 'should delete an image' do
    image = Image.create!(url: 'http://images.com/image.png')
    assert_difference 'Image.count', -1 do
      delete image_url(image)
    end
    assert_redirected_to root_url
    assert_equal I18n.t(:image_deleted), flash[:success]
  end

  test 'should display an error when deleting a non-existent image' do
    assert_no_difference 'Image.count' do
      delete image_url(id: -1)
    end
    assert_redirected_to root_url
    assert_equal I18n.t(:image_not_found), flash[:danger]
  end
end
