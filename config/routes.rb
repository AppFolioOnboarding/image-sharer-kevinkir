Rails.application.routes.draw do
  root 'images#index'

  resources :feedbacks, only: %i[new]
  namespace :api do
    resource :feedbacks, only: [:create]
  end

  resources :images, only: %i[index create new show]
end
