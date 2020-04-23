class ImagesController < ApplicationController
  def new
    @image = Image.new
  end

  def create
    @image = Image.new(image_params)
    if @image.save
      flash[:success] = I18n.t(:image_created)
      redirect_to image_path(@image)
    else
      flash.now[:danger] = "The form contains #{@image.errors.count} #{'error'.pluralize(@image.errors.count)}"
      render 'new', status: :unprocessable_entity
    end
  end

  def show
    @image = Image.find_by(id: params[:id])
    return unless @image.nil?

    flash[:danger] = I18n.t(:image_not_found)
    redirect_to root_url
  end

  def index
    @images = params[:tag] ? Image.tagged_with(params[:tag]) : Image.all
  end

  def destroy
    @image = Image.find_by(id: params[:id])
    if @image.nil?
      flash[:danger] = I18n.t(:image_not_found)
    else
      @image.destroy
      flash[:success] = I18n.t(:image_deleted)
    end
    redirect_to root_url
  end

  private

  def image_params
    params.require(:image).permit(:url, :tag_list)
  end
end
