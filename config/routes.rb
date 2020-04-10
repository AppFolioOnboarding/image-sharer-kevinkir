Rails.application.routes.draw do
  get 'welcome/index'
  resources :images, only: %i[create new show]
  root 'welcome#index'
end
