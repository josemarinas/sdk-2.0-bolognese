import { encodeAbiParameters, type Client, type Hex } from "viem";
import { MULTISIG_METADATA } from "@metadata";
import { contracts, getNetworkByChainId } from "@aragon/osx-commons-configs";
import type { Plugin } from "../dao/types";
import type { MultisigPluginSettings } from "./types";

export function multisig({
  params,
  client,
}: {
  client: Client;
  params: MultisigPluginSettings;
}): Plugin {
  // assertions because im lazy
  const network = getNetworkByChainId(client.chain!.id)!;
  const data = encodeAbiParameters(
    MULTISIG_METADATA.pluginSetup.prepareInstallation.inputs,
    [params.members, params.votingSettings]
  );
  return {
    data,
    pluginRepoAddress: contracts[network.name]["v1.3.0"]!.MultisigRepoProxy
      .address as Hex,
  };
}
