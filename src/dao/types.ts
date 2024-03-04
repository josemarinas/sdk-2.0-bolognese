import {
  type Client,
  type GetContractReturnType,
  type Hex,
} from "viem";
import { DAO_ABI } from "@abi";

export type DaoContract = DaoBaseContract & {
  contract: DaoBaseContract;
  write: {
    prepareUpdate: () => Promise<void>;
    prepareInstallation: () => Promise<void>;
    prepareUninstallation: () => Promise<void>;
  }
};

export type DaoBaseContract = GetContractReturnType<
  typeof DAO_ABI,
  Client,
  Hex
>;

export type CreateDaoParams = {
  ensSubdomain?: string;
  metadata: DaoMetadata;
  daoUri?: string;
  trustedForwarder?: string;
  plugins: Plugin[];
};

export type DaoResourceLink = { name: string; url: string };
export type DaoMetadata = {
  name: string;
  description: string;
  avatar?: string;
  links: DaoResourceLink[];
};

export type Plugin = {
  pluginRepoAddress: Hex;
  data: Hex;
};

export type ContractPlugin = {
  pluginSetupRef: {
    versionTag: {
      release: number;
      build: number;
    };
    pluginSetupRepo: Hex;
  };
  data: Hex;
};
