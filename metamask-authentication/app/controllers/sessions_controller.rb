class SessionsController < ApplicationController
  def new
  end

  def create
    user = User.find_by eth_address: params[:eth_address]
    if user
      if params[:eth_signature]
        message = params[:eth_message]
        signature = params[:eth_signature]

        user_address = params[:eth_address]
        user_nonce = user.eth_nonce

        custom_title, request_time, signed_nonce = message.split(",")
        request_time = Time.at(request_time.to_f / 1000.0)
        expire_time = request_time + 300

        if request_time && request_time < expire_time
          if signed_nonce.eql? user_nonce
            signature_pubkey = Eth::Signature.personal_recover message, signature
            signature_address = Eth::Util.public_key_to_address signature_pubkey
            if user_address.downcase == signature_address.to_s.downcase
              user.eth_nonce = SecureRandom.uuid
              user.save

              session[:user_id] = user.id
              redirect_to root_path
            end
          end
        end

      end
    else
      redirect_to login_path
    end
  end
end
