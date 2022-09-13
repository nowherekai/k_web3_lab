require 'eth'

class User < ApplicationRecord
  validates :eth_address, presence: true, uniqueness: true
  validates :eth_nonce, presence: true, uniqueness: true
  validates :username, presence: true
  validate :address_must_valid, on: :create

  private
  def address_must_valid
    address = Eth::Address.new eth_address
    unless address.valid?
      errors.add(:eth_address, "must be valid ethereum address")
    end
  end
end
