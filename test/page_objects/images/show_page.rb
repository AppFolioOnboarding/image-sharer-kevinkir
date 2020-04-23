module PageObjects
  module Images
    class ShowPage < PageObjects::Document
      path :image

      def image_url
        node.find('img')[:src]
      end

      def tags
        node.find_all('.image-tag').map(&:text)
      end

      def delete
        node.find('.js-delete-image-link').click
        yield node.driver.browser.switch_to.alert
      end

      def delete_and_confirm!
        delete(&:accept)
        window.change_to(IndexPage)
      end

      def go_back_to_index!
        IndexPage.visit
      end
    end
  end
end
