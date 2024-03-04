import {
  getContract,
  type Hex,
  parseEventLogs,
  type WalletClient,
  type Client,
} from "viem";
import type { ContractPlugin, CreateDaoParams, DaoContract } from "./types";
import {
  DAO_ABI,
  DAO_FACTORY_ABI,
  DAO_REGISTRY_ABI,
  PLUGIN_REPO_OVERLOAD_ABI,
} from "@abi";
import { contracts, getNetworkByChainId } from "@aragon/osx-commons-configs";
import { ADDRESS_ZERO } from "./constants";
import { waitForTransactionReceipt } from "viem/actions";

export async function createDao({
  client,
  params,
}: {
  client: WalletClient;
  params: CreateDaoParams;
}): Promise<DaoContract> {
  const chainId = client.chain?.id;
  if (!chainId) {
    throw new Error("Chain ID not found");
  }
  const networkName = getNetworkByChainId(chainId)?.name;
  if (!networkName) {
    throw new Error("Network not found");
  }
  const address = contracts[networkName]["v1.3.0"]?.DAOFactory.address as Hex;
  if (!address) {
    throw new Error("DAOFactory address not found");
  }
  const daoFactoryContract = getContract({
    client,
    address: address,
    abi: [...DAO_FACTORY_ABI] as const,
  });
  const plugins: ContractPlugin[] = [];
  for (const plugin of params.plugins) {
    const pluginRepoContract = getContract({
      client,
      address: plugin.pluginRepoAddress,
      abi: [...PLUGIN_REPO_OVERLOAD_ABI] as const,
    });
    const currentRelease = await pluginRepoContract.read.latestRelease();
    const latestVersion = await pluginRepoContract.read.getLatestVersion([
      currentRelease,
    ]);
    const version = latestVersion.tag as { release: number; build: number };
    plugins.push({
      pluginSetupRef: {
        versionTag: version,
        pluginSetupRepo: plugin.pluginRepoAddress,
      },
      data: plugin.data,
    });
  }

  const hash = await daoFactoryContract.write.createDao(
    [
      {
        trustedForwarder: (params.trustedForwarder as Hex) ?? ADDRESS_ZERO,
        daoURI: params.daoUri ?? "",
        subdomain: params.ensSubdomain ?? "",
        metadata: "0x", // stringToBytes(params.metadataUri),
      },
      plugins,
    ],
    {} as any
  );
  const transactionReceipt = await waitForTransactionReceipt(client, { hash });
  const daoRegisteredLogs = parseEventLogs({
    logs: transactionReceipt.logs,
    abi: [...DAO_REGISTRY_ABI] as const,
    eventName: "DAORegistered",
  });
  const args = daoRegisteredLogs[0].args as { dao: Hex };
  const daoAddress = args.dao;
  return getDaoContract({ client, address: daoAddress });
}

export function getDaoContract({
  client,
  address,
}: {
  client: Client;
  address: Hex;
}): DaoContract {
  const contract = getContract({
    client,
    address,
    abi: [...DAO_ABI] as const,
  });
  return {
    ...contract,
    write: {
      ...contract.write,
      prepareUpdate: async () => {
        console.log("preparing the update");
      },
      prepareInstallation: async () => {
        console.log("preparing the installation");
      },
      prepareUninstallation: async () => {
        console.log("preparing the uninstallation");
      },
    },
    contract: contract,
  };
}
