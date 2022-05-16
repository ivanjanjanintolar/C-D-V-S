/* eslint-disable prettier/prettier */
import { web3, shortAddress } from 'src/utils/web3/web3Helper'

export const removeApprovedAddress = async (addressToRemove) => {
  const encoded = await web3.eth.abi.encodeFunctionCall(
    {
      name: 'removeApprovedAddress',
      type: 'function',
      inputs: [
        {
          internalType: 'address',
          name: '_toRemove',
          type: 'address',
        },
      ],
    },
    [shortAddress(addressToRemove)],
  )
  return encoded
}
