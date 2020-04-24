module PageObjects
  module Images
    class IndexPage < PageObjects::Document
      path :images

      collection :images, locator: '.js-image-list', item_locator: '.js-image-list-item', contains: ImageCard do
        def view!
          url = node.find('img')[:src]
          image = Image.find_by!(url: url)
          ShowPage.visit(image.id)
        end
      end

      def add_new_image!
        node.click_on('add an image')
        window.change_to(NewPage)
      end

      def showing_image?(url:, tags: nil)
        images.any? do |elem|
          elem.url == url && (tags.nil? || elem.tags == tags)
        end
      end

      def clear_tag_filter!
        IndexPage.visit
      end
    end
  end
end
