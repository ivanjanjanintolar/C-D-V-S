import { web3 } from 'src/utils/web3/web3Helper'

export const startSignatures = async (hash) => {
  const encoded = await web3.eth.abi.encodeFunctionCall(
    {
      name: 'startSignatures',
      type: 'function',
      inputs: [
        {
          internalType: 'string',
          name: '_digitalFingerprint',
          type: 'string',
        },
      ],
    },
    [hash.toString()],
  )
  return encoded
}
