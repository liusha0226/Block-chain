// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import incidenceArtifact from '../../build/contracts/Incidence.json'

// Incidence is our usable abstraction, which we'll use through the code below.
const Incidence = contract(incidenceArtifact)

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let account

const App = {
  start: function () {
    const self = this

    // Bootstrap the Incidence abstraction for Use.
    Incidence.setProvider(web3.currentProvider)

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      accounts = accs
      account = accounts[0]

      self.refreshMsg()
    })
  },

  refreshMsg: function () {
    const self = this

    let meta
    Incidence.deployed().then(function (instance) {
      meta = instance
      return meta.getName.call({ from: account })
    }).then(function (value) {
      const nameMsg = document.getElementById('nameMsg')
      nameMsg.innerHTML = "疾病名称：" + value.toString()
      return meta.getallNum.call({ from: account })
    }).then(function (value) {
      const num1 = document.getElementById('num1')
      num1.innerHTML = "参与人数：" + value.toString()
      return meta.getpatientsNum.call({ from: account })
    }).then(function (value) {
      const num2 = document.getElementById('num2')
      num2.innerHTML = "患病人数：" + value.toString()
      return meta.getIncidence.call({ from: account })
    }).then(function (value) {
      const incidenceMsg = document.getElementById('incidenceMsg')
      incidenceMsg.innerHTML = "总发病率：" + value.toString() + "%";
    }).catch(function (e) {
      console.log(e)
      console.log('Error getting Message; see log.')
    })
  },

  submit: function () {
    const self = this

    const disease_name = parseInt(document.getElementById('disease_name').value);
    const publisher_name = document.getElementById('publisher_name').value;
    const tip1 = document.getElementById("tip1");
    const tip2 = document.getElementById("tip2");
    const add = document.getElementById("add");

    let meta
    Incidence.deployed().then(function (instance) {
      meta = instance
      if (disease_name == 1){
        meta.participate(true, { from: publisher_name, gas: 1000000 });
        tip1.innerHTML = "";
        tip2.innerHTML = "已参与.";
      }else if (disease_name == 0){
        meta.participate(false, { from: publisher_name });
        tip1.innerHTML = "";
        tip2.innerHTML = "已参与.";
      }else{
        tip1.innerHTML = "请输入1(患病) 或 0(未患病).";
        tip2.innerHTML = "";
      }
    })
    self.refreshMsg()
  },

  addDisease: function (){
    const self = this

    const disease = document.getElementById('disease');
    const people = document.getElementById('publisher');
    disease.innerHTML = "疾病名称：";
    people.innerHTML = "发起者：";
  },

  participate: function (){
    const self = this

    const disease = document.getElementById('disease');
    const people = document.getElementById('publisher');
    disease.innerHTML = "是否患病：";
    people.innerHTML = "参与者：";
  },
}

window.App = App

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 MetaCoin,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:7545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'))
  }

  App.start()
})