# Five Pillars Investment Platform - Project Structure Documentation

## 📁 Project Overview

This is a Next.js 15 application built for the Five Pillars Investment Platform, a BSC-based DeFi investment and rewards system. The application uses TypeScript, React 19, wagmi v2, and RainbowKit for Web3 integration.

## 🏗️ Directory Structure

\`\`\`
five-pillars-dashboard/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page with dashboard
│   └── globals.css              # Global styles and CSS variables
│
├── components/                   # React components
│   ├── ui/                      # Reusable UI components (shadcn/ui)
│   │   ├── alert.tsx           # Alert component
│   │   ├── badge.tsx           # Badge component with variants
│   │   ├── button.tsx          # Button component with variants
│   │   ├── card.tsx            # Card components (Card, CardHeader, etc.)
│   │   ├── input.tsx           # Input component
│   │   ├── label.tsx           # Label component
│   │   ├── progress.tsx        # Progress bar component
│   │   ├── scroll-area.tsx     # Scrollable area component
│   │   ├── select.tsx          # Select dropdown component
│   │   ├── separator.tsx       # Separator component
│   │   └── tabs.tsx            # Tabs component
│   │
│   ├── dashboard.tsx            # Main dashboard component
│   ├── providers.tsx            # App providers (Wagmi, RainbowKit, etc.)
│   ├── error-boundary.tsx       # Error boundary for wallet errors
│   ├── test-error-boundary.tsx  # Error boundary for test runner
│   ├── transaction-history.tsx  # Transaction history tracker
│   ├── referral-system.tsx      # Referral link management
│   ├── pool-eligibility-checker.tsx # Pool eligibility calculator
│   ├── whitelist-manager.tsx    # Whitelist management (owner only)
│   ├── allowance-checker.tsx    # Token allowance checker
│   └── test-runner.tsx          # Automated test runner UI
│
├── hooks/                       # Custom React hooks
│   ├── use-five-pillars-token.ts    # Token contract interactions
│   └── use-investment-manager.ts     # Investment contract interactions
│
├── lib/                         # Utility libraries and configurations
│   ├── abis.ts                 # Contract ABIs (LOCKED FILE)
│   ├── config.ts               # Wagmi and contract configuration
│   ├── utils.ts                # Utility functions
│   ├── debug.ts                # Debug utilities
│   ├── transactions.ts         # Transaction history utilities
│   ├── errors.ts               # Error parsing utilities
│   ├── numbers.ts              # Number formatting utilities
│   └── tests/                  # Test definitions
│       ├── index.ts            # Test aggregator
│       ├── types.ts            # Test type definitions
│       └── *.ts                # Individual test categories (11 files)
│
├── public/                      # Static assets
│
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Project dependencies
\`\`\`

## 📦 Key Components

### 🎯 Core Components

#### `components/dashboard.tsx`
- **Purpose**: Main dashboard interface
- **Features**:
  - Overview statistics (balance, rewards, investors, deposits)
  - Token management (transfer, approve)
  - Investment operations (deposit, claim)
  - Tools (pool checker, transaction history)
  - Test runner integration
  - Debug panel
- **Dependencies**: All custom hooks, UI components, utilities

#### `components/providers.tsx`
- **Purpose**: Application-wide providers setup
- **Features**:
  - Wagmi provider configuration
  - RainbowKit provider with BSC theme
  - React Query client setup
  - Cookie-based state persistence

### 💰 Investment Components

#### `components/referral-system.tsx`
- **Purpose**: Manage referral links and track referrals
- **Features**:
  - Generate referral links
  - Copy to clipboard functionality
  - Display referral statistics
  - Show referrer information

#### `components/pool-eligibility-checker.tsx`
- **Purpose**: Check eligibility for investment pools
- **Features**:
  - Input investment amount and referral data
  - Calculate eligibility for all 9 pools
  - Display pool requirements

#### `components/whitelist-manager.tsx`
- **Purpose**: Manage whitelist for special pools (7-8)
- **Features**:
  - Owner-only access
  - Add/remove addresses from whitelist
  - Pool selection

### 🔧 Utility Components

#### `components/transaction-history.tsx`
- **Purpose**: Track and display transaction history
- **Features**:
  - Local storage persistence
  - Real-time status updates
  - BSCScan links
  - Transaction categorization

#### `components/allowance-checker.tsx`
- **Purpose**: Check token allowances
- **Features**:
  - Check allowance for any spender
  - Quick-fill Investment Manager address
  - Display formatted allowance

#### `components/test-runner.tsx`
- **Purpose**: Automated testing interface
- **Features**:
  - Run 100+ automated tests
  - Category-based test organization
  - Export test results
  - Real-time test execution display

### 🪝 Custom Hooks

#### `hooks/use-five-pillars-token.ts`
- **Purpose**: Interact with Five Pillars Token contract
- **Methods**:
  - `transfer()`: Transfer tokens
  - `approve()`: Approve spender
  - `setInvestmentManager()`: Set investment manager (owner only)
- **Data**: Token info, balance, owner

#### `hooks/use-investment-manager.ts`
- **Purpose**: Interact with Investment Manager contract
- **Methods**:
  - `deposit()`: Make investment
  - `claimReward()`: Claim accumulated rewards
  - `setWhitelist()`: Manage whitelist (owner only)
- **Data**: Rewards, investor info, pools, statistics

## 🛠️ Utilities

### `lib/utils.ts`
- `cn()`: Class name merger
- `formatAddress()`: Shorten addresses
- `isPoolEligible()`: Check pool eligibility
- `calculateTimeRemaining()`: Calculate deposit delay
- `generateReferralLink()`: Create referral URLs
- `copyToClipboard()`: Cross-browser clipboard

### `lib/config.ts`
- Wagmi configuration
- Contract addresses by network
- RainbowKit setup
- Network configurations

### `lib/abis.ts` (LOCKED)
- `FIVE_PILLARS_TOKEN_ABI`: Token contract ABI
- `INVESTMENT_MANAGER_ABI`: Investment contract ABI

### `lib/transactions.ts`
- `addTransactionToHistory()`: Centralized transaction tracking
- `TransactionRecord` interface

### `lib/errors.ts`
- `parseContractError()`: Human-readable error messages

### `lib/numbers.ts`
- `safeParseFloat()`: Safe number parsing
- `formatTokenAmount()`: Token formatting
- `formatLargeNumber()`: Large number formatting

### `lib/debug.ts`
- Debug logging utilities
- Component debugging helpers
- Environment-aware logging

## 🧪 Test System

### Test Categories (11 files)
1. **token-tests.ts**: Token contract functionality
2. **investment-tests.ts**: Investment manager operations
3. **deposit-tests.ts**: Deposit function validation
4. **claim-tests.ts**: Claim reward functionality
5. **referral-tests.ts**: Referral system
6. **pool-tests.ts**: Pool eligibility and display
7. **update-tests.ts**: Real-time data updates
8. **flow-tests.ts**: Transaction flows
9. **error-tests.ts**: Error handling
10. **ui-tests.ts**: UI component behavior
11. **format-tests.ts**: Data formatting
12. **validation-tests.ts**: Input validation

### Test Infrastructure
- **types.ts**: Test interfaces and types
- **index.ts**: Test aggregator and exporter

## 🎨 UI Components (shadcn/ui)

All UI components follow the shadcn/ui pattern:
- Radix UI primitives for accessibility
- Tailwind CSS for styling
- Class variance authority for variants
- Full TypeScript support

## 📋 Configuration Files

### `next.config.js`
- React strict mode enabled
- Source maps in production
- Web3 library fallbacks
- Build error ignoring (for rapid development)

### `tailwind.config.js`
- Custom color scheme (gold primary)
- Dark mode support
- Animation utilities
- Container configuration

### `tsconfig.json`
- Strict TypeScript
- Path aliases (@/*)
- Source map generation

### `package.json`
- Next.js 15.2.4
- React 19
- wagmi (latest)
- @rainbow-me/rainbowkit (latest)
- viem (latest)
- shadcn/ui components
- Tailwind CSS

## 🔐 Environment Variables

Required environment variables:
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: WalletConnect project ID
- `NEXT_PUBLIC_DEBUG`: Enable debug mode (optional)

## 🌐 Network Support

- **BSC Testnet** (Chain ID: 97)
  - Token: 0xD9482A362b121090306E8A997Bd4B5196399DF00
  - Investment: 0xde829c7aB7C7B1938CEd26Bf725AD99da477b238
- **BSC Mainnet** (Chain ID: 56)
  - Addresses to be configured for production

## 🚀 Key Features

1. **Web3 Integration**
   - MetaMask and WalletConnect support
   - Real-time blockchain data
   - Transaction management

2. **Investment Platform**
   - 9 investment pools with different criteria
   - Referral system with rewards
   - 4-hour deposit delay mechanism
   - 50% claim fee redistribution

3. **Developer Tools**
   - Comprehensive test suite
   - Debug panel
   - Transaction history
   - Error handling

4. **User Interface**
   - Responsive design
   - Dark mode ready
   - Loading states
   - Error boundaries

## 📝 Development Notes

1. **Locked Files**: `lib/abis.ts` is locked and should not be modified
2. **Hook Rules**: All React hooks must be called unconditionally
3. **SSR Considerations**: Web3 components use client-side rendering
4. **Error Handling**: Contract errors are parsed for user-friendly messages
5. **State Management**: Uses React Query for server state
6. **Type Safety**: Strict TypeScript with proper typing throughout

## 🔄 Data Flow

1. **User connects wallet** → RainbowKit handles connection
2. **Wagmi hooks fetch data** → Contract data loaded
3. **User performs action** → Write contract called
4. **Transaction submitted** → Added to history
5. **Data refreshes** → UI updates automatically

## 🎯 Architecture Decisions

1. **Next.js App Router**: Modern React Server Components
2. **wagmi v2**: Type-safe contract interactions
3. **Viem**: Lightweight Ethereum library
4. **shadcn/ui**: Composable component system
5. **Tailwind CSS**: Utility-first styling
6. **React Query**: Server state management
