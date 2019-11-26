Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  namespace :api, defaults: {format: :json} do
    match '/diseases/list', to: 'diseases#disease_list', via: :get
    resources :diseases, only: :index
    resources :states, only: :index
  end

  root to: "static_pages#index"
end
