require 'uri'
require 'net/http'

class ImageUrlValidator < ActiveModel::Validator
  def validate(record)
    return unless record.url.present?

    error_message = get_error_message(record.url)
    record.errors[:url] << error_message unless error_message.nil?
  end

  private

  def get_error_message(url)
    begin
      parsed_url = URI.parse(url)
    rescue URI::InvalidURIError
      return 'is invalid'
    end

    return 'must be http or https' unless parsed_url.is_a?(URI::HTTP)

    begin
      response = Net::HTTP.get_response(parsed_url)
    # Catch-all here, as this can raise a lot of different errors.
    rescue StandardError
      return 'returned a bad response'
    end

    return "returned a non-200 response: #{response.code}" unless response.code.start_with?('2')
    return "has non-image MIME type: #{response.content_type}" unless response.content_type.start_with?('image')
  end
end
