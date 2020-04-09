Rails.application.routes.draw do
  resources :images, only: %i[index create new show]
  root 'images#index'
end
