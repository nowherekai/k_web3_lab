require 'eth'
require 'time'

class UsersController < ApplicationController

  def new
  end

  def create
    user = User.new(user_params)

    user.eth_nonce = SecureRandom.uuid

    if user.save
      redirect_to login_path
    else
      render :new
    end
  end

  def nonce
    user = User.where(eth_address: params[:eth_address]).first
    if user
      render json: { eth_nonce: user.eth_nonce }
    else
      return head(:not_found)
    end
  end

  private
  def user_params
    params.require(:user).permit(:username, :eth_address)
  end
end
