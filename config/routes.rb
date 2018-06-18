Rails.application.routes.draw do
  resources :feedbacks, only: %i[new]
  resources :images, only: %i[index create new show]
  root 'images#index'
end
