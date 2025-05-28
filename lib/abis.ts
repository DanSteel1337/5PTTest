export const FIVE_PILLARS_TOKEN_ABI = [
  // ERC20 Standard Functions
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Five Pillars Specific Functions
  {
    inputs: [{ name: "manager", type: "address" }],
    name: "setInvestmentManager",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "account", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "account", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "burnFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // View Functions
  {
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const

export const INVESTMENT_MANAGER_ABI = [
  // Read Functions
  {
    inputs: [],
    name: "getAccumulatedRewards",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getLastRoundRewards",
    outputs: [
      { name: "dailyReward", type: "uint256" },
      { name: "refReward", type: "uint256" },
      { name: "poolsReward", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "accountToInvestorInfo",
    outputs: [
      { name: "totalDepositAmount", type: "uint256" },
      { name: "lastDepositTimestamp", type: "uint256" },
      { name: "referer", type: "address" },
      { name: "directReferralsCount", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "investor", type: "address" },
      { name: "poolId", type: "uint8" },
    ],
    name: "isInvestorInPool",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "poolId", type: "uint256" }],
    name: "pools",
    outputs: [
      { name: "isActive", type: "bool" },
      { name: "curReward", type: "uint256" },
      { name: "participantsCount", type: "uint256" },
      { name: "minInvestmentAmount", type: "uint256" },
      { name: "minDirectReferralsCount", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalInvestorsCount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalDepositAmount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "startTimestamp",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  // Write Functions
  {
    inputs: [
      { name: "amount", type: "uint256" },
      { name: "referer", type: "address" },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Owner Functions
  {
    inputs: [
      { name: "investor", type: "address" },
      { name: "poolId", type: "uint8" },
      { name: "add", type: "bool" },
    ],
    name: "setWhitelist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const
