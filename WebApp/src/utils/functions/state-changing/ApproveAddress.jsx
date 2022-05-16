/* eslint-disable prettier/prettier */
import { web3, shortAddress } from 'src/utils/web3/web3Helper'

export const approveAddress = async (addressToApprove) => {
  const encoded = await web3.eth.abi.encodeFunctionCall(
    {
      name: 'approveAddress',
      type: 'function',
      inputs: [
        {
          internalType: 'address',
          name: '_toApprove',
          type: 'address',
        },
      ],
    },
    [shortAddress(addressToApprove)],
  )
  return encoded
}
