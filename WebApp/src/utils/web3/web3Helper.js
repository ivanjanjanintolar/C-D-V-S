import Web3 from '@tolar/web3'

export const web3 = new Web3('https://jsongw.testnet.tolar.io')

//testnet - https://jsongw.testnet.tolar.io
//mainnet - https://jsongw.mainnet.tolar.io

export const tolar = web3.tolar

export const COTRUGLIContract = '54a6fe01f4fca710a9ca7915334ec1e41ec03244792ff38fb8'

//mainnet ''
//testnet '54a6fe01f4fca710a9ca7915334ec1e41ec03244792ff38fb8'

export function shortAddress(address) {
  const arr = []

  for (let i = 2; i < address.length - 8; i++) {
    arr.push(address[i])
  }

  const ethAddress = '0x' + arr.join('')
  return ethAddress
}
