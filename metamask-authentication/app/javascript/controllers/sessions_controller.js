import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "ethAddress", "form", "ethMessage", "ethSignature" ]

  connect() {
    console.log("debug0")
  }

  async login(event) {
    event.preventDefault()
    event.stopPropagation()

    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
    } else {
      console.log('MetaMask is not installed!');
      return
    }

    const account = await this.getAccount()
    this.ethAddressTarget.value = account
    const nonce = await this.getNonce(account)
    if (!nonce) {
      this.ethMessageTarget.value = "Pleas signup first"
    }

    const customTitle = "Ethereum on rails";
    const requestTime = new Date().getTime();
    const message = customTitle + "," + requestTime + "," + nonce;
    const signature = await this.personalSign(account, message);

    this.ethMessageTarget.value = message
    this.ethSignatureTarget.value = signature;

    this.formTarget.submit()
  }

  async personalSign(account, message) {
    const signature = await window.ethereum.request({ method: 'personal_sign', params: [ message, account ] });
    return signature;
  }

  async getNonce(account) {
    const response = await fetch(`/users/${account}/nonce`);
    const nonceJson = await response.json();
    if (!nonceJson) return null;

    return nonceJson.eth_nonce;
  }

  async getAccount() {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts'  })
    if (accounts.length > 0) {
      console.log(accounts[0])
      return accounts[0]
    }
  }

}
