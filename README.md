# sdk-2.0-bolognese

![Bolognese](./bolognese-code.png)

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

## Summary

This is a Viem based version of the Aragon SDK. It uses the viem client to interact with the aragon contracts. For now, it only supports creating a DAO.

## Usage

```ts
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { goerli } from "viem/chains";

const account = privateKeyToAccount(
  "0xe9bb9aa1a1e8aac99dc785e3b9e9d8a9d2b401b94bab48a55b65feb372935acd"
);

const client = createWalletClient({
  account,
  chain: goerli,
  transport: http(), // Add your wallet provider here
});

const daoAddress = "0x...";
const daoContract = getDaoContract({ client, address: daoAddress });

// the object contains overridden methods so we 
daoContract.write.prepareInstallation()
daoContract.read.daoURI()
// but it also contains the original Contract from viem
// that can be called directly
daoContract.contract.read.daoURI()
```
