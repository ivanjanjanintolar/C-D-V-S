import { web3 } from 'src/utils/web3/web3Helper'

export const verifyDiploma = async (hash, connectedAccount) => {
  const encoded = await web3.eth.abi.encodeFunctionCall(
    {
      name: 'verifyDiploma',
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
