import { createPublicClient, getContract, http } from "viem";
import { goerli } from "viem/chains";
import { getDaoContract } from "./src/dao/contract";

const publicClient = createPublicClient({
  chain: goerli,
  transport: http(),
});

const dao = getDaoContract({
  client: publicClient,
  address: "0x123",
});



dao.write.prepareUpdate();
dao.write.prepareInstallation();
dao.write.prepareUninstallation();
dao.read.daoURI();
dao.contract.read.daoURI();
