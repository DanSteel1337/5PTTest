export function getAllTestCategories(
  tokenContract: ReturnType<typeof useFivePillarsToken>,
  investmentContract: ReturnType<typeof useInvestmentManager>,
  address: string,
) {
  // Ensure address is always a string
  const safeAddress = address || "0x0000000000000000000000000000000000000000"

  // Rest of the function using safeAddress instead of address
  // ...
}
