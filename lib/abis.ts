// Complete ABIs from documentation
export const FIVE_PILLARS_TOKEN_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [{"internalType": "address", "name": "spender", "type": "address"}, {"internalType": "uint256", "name": "allowance", "type": "uint256"}, {"internalType": "uint256", "name": "needed", "type": "uint256"}],
    "name": "ERC20InsufficientAllowance",
    "type": "error"
  },
  {
    "inputs": [{"internalType": "address", "name": "sender", "type": "address"}, {"internalType": "uint256", "name": "balance", "type": "uint256"}, {"internalType": "uint256", "name": "needed", "type": "uint256"}],
    "name": "ERC20InsufficientBalance",
    "type": "error"
  },
  {
    "inputs": [{"internalType": "address", "name": "approver", "type": "address"}],
    "name": "ERC20InvalidApprover",
    "type": "error"
  },
  {
    "inputs": [{"internalType": "address", "name": "receiver", "type": "address"}],
    "name": "ERC20InvalidReceiver",
    "type": "error"
  },
  {
    "inputs": [{"internalType": "address", "name": "sender", "type": "address"}],
    "name": "ERC20InvalidSender",
    "type": "error"
  },
  {
    "inputs": [{"internalType": "address", "name": "spender", "type": "address"}],
    "name": "ERC20InvalidSpender",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ManagerAlreadySetted",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "OnlyInvestmentManager",
    "type": "error"
  },
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ZeroAddress",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "address", "name": "owner", "type": "address"}, {"indexed": true, "internalType": "address", "name": "spender", "type": "address"}, {"indexed": false, "internalType": "uint256", "name": "value", "type": "uint256"}],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "address", "name": "previousOwner", "type": "address"}, {"indexed": true, "internalType": "address", "name": "newOwner", "type": "address"}],
    "name": "OwnershipTransferStarted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "address", "name": "previousOwner", "type": "address"}, {"indexed": true, "internalType": "address", "name": "newOwner", "type": "address"}],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "address", "name": "from", "type": "address"}, {"indexed": true, "internalType": "address", "name": "to", "type": "address"}, {"indexed": false, "internalType": "uint256", "name": "value", "type": "uint256"}],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "acceptOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}, {"internalType": "address", "name": "spender", "type": "address"}],
    "name": "allowance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "spender", "type": "address"}, {"internalType": "uint256", "name": "value", "type": "uint256"}],
    "name": "approve",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}, {"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "burnFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "investmentManager",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}, {"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "pendingOwner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "manager", "type": "address"}],
    "name": "setInvestmentManager",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "to", "type": "address"}, {"internalType": "uint256", "name": "value", "type": "uint256"}],
    "name": "transfer",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "from", "type": "address"}, {"internalType": "address", "name": "to", "type": "address"}, {"internalType": "uint256", "name": "value", "type": "uint256"}],
    "name": "transferFrom",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "newOwner", "type": "address"}],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const

export const INVESTMENT_MANAGER_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "owner_", "type": "address"}, {"internalType": "uint32", "name": "startTime_", "type": "uint32"}, {"internalType": "address", "name": "treasury_", "type": "address"}, {"internalType": "address", "name": "treasury2_", "type": "address"}, {"internalType": "address", "name": "dexRouter_", "type": "address"}, {"internalType": "address", "name": "fivePillarsToken_", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "DepositNotYetAvailable",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "HalfRequirementViolated",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidArrayLengths",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidFee",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidPoolId",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidReferer",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidStartTime",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvestorAlreadyNotWhitelisted",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvestorAlreadyWhitelisted",
    "type": "error"
  },
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "PoolCriteriaUpdateNotEnded",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "RefererAlreadySetted",
    "type": "error"
  },
  {
    "inputs": [{"internalType": "address", "name": "to", "type": "address"}],
    "name": "SendEtherFailed",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "SequencePoolCriteriaBroken",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "SetPoolCriteriaNotYetAvailable",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "SmallDepositOrClaimAmount",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ZeroAddress",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": false, "internalType": "uint256", "name": "newClaimFeeInBp", "type": "uint256"}],
    "name": "ClaimFeeUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": false, "internalType": "address", "name": "investor", "type": "address"}, {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "ClaimReward",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": false, "internalType": "address", "name": "investor", "type": "address"}, {"indexed": false, "internalType": "address", "name": "referer", "type": "address"}, {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "Deposit",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": false, "internalType": "uint256", "name": "newDepositFeeInBp", "type": "uint256"}],
    "name": "DepositFeeUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "address", "name": "previousOwner", "type": "address"}, {"indexed": true, "internalType": "address", "name": "newOwner", "type": "address"}],
    "name": "OwnershipTransferStarted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "address", "name": "previousOwner", "type": "address"}, {"indexed": true, "internalType": "address", "name": "newOwner", "type": "address"}],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": false, "internalType": "uint8[]", "name": "poolIds", "type": "uint8[]"}],
    "name": "PoolsCriteriaUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": false, "internalType": "address", "name": "investor", "type": "address"}, {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "Redistribute",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": false, "internalType": "uint256", "name": "accumulatedFees", "type": "uint256"}],
    "name": "SwapFeesFailed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": false, "internalType": "address", "name": "account", "type": "address"}, {"indexed": false, "internalType": "uint256", "name": "poolId", "type": "uint256"}, {"indexed": false, "internalType": "bool", "name": "add", "type": "bool"}],
    "name": "WhitelistUpdated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "BASIS_POINTS",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MAX_FEE",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "acceptOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "accountToInvestorInfo",
    "outputs": [{"internalType": "uint256", "name": "totalDeposit", "type": "uint256"}, {"internalType": "uint128", "name": "directRefsCount", "type": "uint128"}, {"internalType": "uint128", "name": "downlineRefsCount", "type": "uint128"}, {"internalType": "uint256", "name": "directRefsDeposit", "type": "uint256"}, {"internalType": "uint256", "name": "downlineRefsDeposit", "type": "uint256"}, {"internalType": "address", "name": "referer", "type": "address"}, {"internalType": "uint256", "name": "lastDailyReward", "type": "uint256"}, {"internalType": "uint256", "name": "lastRefReward", "type": "uint256"}, {"internalType": "uint256", "name": "accumulatedReward", "type": "uint256"}, {"internalType": "uint32", "name": "lastClaimTimestamp", "type": "uint32"}, {"internalType": "uint32", "name": "lastDepositTimestamp", "type": "uint32"}, {"internalType": "uint32", "name": "updateRefRewardTimestamp", "type": "uint32"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimFeeInBp",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimReward",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}, {"internalType": "address", "name": "referer", "type": "address"}],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "depositDelay",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "depositFeeInBp",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "dexRouter",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "fivePillarsToken",
    "outputs": [{"internalType": "contract IFivePillarsToken", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAccumulatedRewards",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "investor", "type": "address"}, {"internalType": "uint8", "name": "poolId", "type": "uint8"}],
    "name": "getInvestorPoolRewardPerTokenPaid",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getLastRoundRewards",
    "outputs": [{"internalType": "uint256", "name": "dailyReward", "type": "uint256"}, {"internalType": "uint256", "name": "refReward", "type": "uint256"}, {"internalType": "uint256", "name": "poolsReward", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalInvestorsCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}, {"internalType": "uint8", "name": "", "type": "uint8"}],
    "name": "isInvestorInPool",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "isUpdateCriteriaActive",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}, {"internalType": "uint8", "name": "", "type": "uint8"}],
    "name": "isWhitelisted",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "lastUpdatePoolCriteriaTimestamp",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "lastUpdatePoolRewardTimestamp",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "onlyWhitelistedInvestorsCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "pendingOwner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "poolCriteriaUpdateDelay",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "pools",
    "outputs": [{"internalType": "bool", "name": "isActive", "type": "bool"}, {"internalType": "uint256", "name": "curReward", "type": "uint256"}, {"internalType": "uint256", "name": "lastReward", "type": "uint256"}, {"internalType": "uint256", "name": "participantsCount", "type": "uint256"}, {"internalType": "uint256", "name": "rewardPerInvestorStored", "type": "uint256"}, {"internalType": "uint128", "name": "personalInvestRequired", "type": "uint128"}, {"internalType": "uint128", "name": "totalDirectInvestRequired", "type": "uint128"}, {"internalType": "uint8", "name": "directRefsRequired", "type": "uint8"}, {"internalType": "uint16", "name": "share", "type": "uint16"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "roundDuration",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "newClaimFeeInBp", "type": "uint256"}],
    "name": "setClaimFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "newDepositFeeInBp", "type": "uint256"}],
    "name": "setDepositFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint8[]", "name": "poolIds", "type": "uint8[]"}, {"components": [{"internalType": "uint128", "name": "personalInvestRequired", "type": "uint128"}, {"internalType": "uint128", "name": "totalDirectInvestRequired", "type": "uint128"}, {"internalType": "uint8", "name": "directRefsRequired", "type": "uint8"}], "internalType": "struct InvestmentManager.PoolCriteria[]", "name": "criteriaOfPools", "type": "tuple[]"}, {"internalType": "uint256", "name": "checkCountLimit", "type": "uint256"}],
    "name": "setPoolCriteria",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "investor", "type": "address"}, {"internalType": "uint8", "name": "poolId", "type": "uint8"}, {"internalType": "bool", "name": "add", "type": "bool"}],
    "name": "setWhitelist",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "startTimestamp",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalDepositAmount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "newOwner", "type": "address"}],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "treasury",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "treasury2",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
] as const
