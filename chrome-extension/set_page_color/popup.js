const objPlayers = document.querySelector('#objPlayers')
const bcPlayers = document.querySelector('#bcPlayers')

chrome.storage.sync.get('yourBody', function(data) {
  objPlayers.innerHTML = data.yourBody.objInfo.players.length
  bcPlayers.innerHTML = data.yourBody.bcInfo.players.length
})

chrome.storage.onChanged.addListener(function(changes, namespace) {
  objPlayers.innerHTML = changes.yourBody.newValue.objInfo.players.length
  bcPlayers.innerHTML = changes.yourBody.newValue.bcInfo.players.length
})