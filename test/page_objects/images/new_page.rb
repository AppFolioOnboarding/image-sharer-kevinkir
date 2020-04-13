module PageObjects
  module Images
    class NewPage < PageObjects::Document
      path :new_image
      path :images

      form_for :image do
        element :url
        element :tag_list
      end

      def create_image!(url: nil, tags: nil)
        image.url.set url unless url.nil?
        image.tag_list.set tags unless tags.nil?
        node.click_on('Create Image')
        window.change_to(ShowPage, NewPage)
      end
    end
  end
end
