Rails.application.routes.draw do
  get "signup", to: "users#new"
  post "signup", to: "users#create"

  get "login", to: "sessions#new"
  post "login", to: "sessions#create"

  get "users/:eth_address/nonce", to: "users#nonce"

  root to: "welcome#index"
end
