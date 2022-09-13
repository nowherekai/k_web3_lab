import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "username", "ethAddress", "form" ]

  connect() {
    console.log("debug0")
  }

  signup(event) {
    event.preventDefault()
    event.stopPropagation()

    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
    } else {
      console.log('MetaMask is not installed!');
      return
    }

    // console.log(this.usernameTarget.value)
    ethereum.request({ method: 'eth_requestAccounts'  })
      .then((accounts) => {
        if (accounts.length > 0) {
          console.log(accounts[0])
          this.ethAddressTarget.value = accounts[0]
        }

        this.formTarget.submit()
      });
  }

}
