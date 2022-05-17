import Web3 from '@dreamfactoryhr/web3t'

export const web3 = new Web3('https://tolarswap.io/api-testnet/')

export const tolar = web3.tolar

export const COTRUGLIContract = '5455135e22a4975f1b61ede799a958fb963dd82aa7e783a4df'

export function shortAddress(address) {
  const arr = []

  for (let i = 2; i < address.length - 8; i++) {
    arr.push(address[i])
  }

  const ethAddress = '0x' + arr.join('')
  return ethAddress
}
