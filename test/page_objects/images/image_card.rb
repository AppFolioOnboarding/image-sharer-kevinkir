module PageObjects
  module Images
    class ImageCard < AePageObjects::Element
      def url
        node.find('img')[:src]
      end

      def tags
        node.find_all('.image-tag').map(&:text)
      end

      def click_tag!(tag_name)
        node.find('.image-tag', text: tag_name).click
        window.change_to(IndexPage)
      end
    end
  end
end
