import type { Hex } from "viem";

export type MultisigPluginSettings = {
  members: Hex[];
  votingSettings: MultisigVotingSettings;
};

export type MultisigVotingSettings = {
  onlyListed: boolean;
  minApprovals: number;
};
