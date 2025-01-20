# 💰 WalletApp

## 🌟 Overview

WalletApp is a financial tracking application built for users to manage their personal finances. It helps users like Eric track their expenses and income across different accounts, offering detailed categorization and visualization of financial data.

## ✨ Features

### 💳 Transaction Management

- Track income and expenses with detailed descriptions and amounts
- Filter transactions by type (income/expense), time period (today, week, month, year)
- Visual indicators for transaction types (green for income, red for expenses)
- Add transactions with an intuitive dialog interface

### 📊 Reports & Analytics

- Export transactions to Excel with comprehensive details including:
  - Transaction date
  - Transaction type
  - Description
  - Category and subcategory
  - Amount with proper formatting
- Filter and analyze transactions based on custom date ranges

### 🎯 Categories System

- Predefined expense categories:
  - Housing, Transportation, Food, Utilities, Insurance, Healthcare, Savings, Personal, Entertainment, Other
- Income categories:
  - Salary, Freelance, Investments, Rental, Other
- Support for subcategories within each main category

### 📱 User Interface

- Modern, responsive dark/light mode interface
- Transaction filters for type, time period, and categories
- Clear visual distinction between income and expenses using icons and colors
- Easy-to-use export functionality with preview dialog

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- npm or yarn
- Git

### Environment Variables

Create a `.env.local` file in the root directory with:

```
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/wizard
```

### Installation Steps

1. Clone the repository:

```bash
git clone https://github.com/ChernetAsmamaw/walletapp.git
cd walletapp
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to:

```
http://localhost:3000
```

## 🛠️ Tech Stack

- **Frontend**: Next.js with TypeScript
- **UI Components**:
  - shadcn/ui
  - Lucide React for icons
  - Tailwind CSS for styling
- **Data Export**: SheetJS (XLSX) for Excel file generation
- **Authentication**: Clerk with custom sign-in/sign-up flows
- **Database**: MongoDB with Mongoose
- **API**: Next.js API Routes with transaction management
- **Deployment**: Vercel app can be found at wallet.chernet.dev

## 📱 Application Structure

- Below is an example of the structure of the folders

```
walletapp/
├── app/
│   └── api/
│       └── transactions/
│           └── route.ts    # Transaction API endpoints
├── components/
│   ├── ExportTransactionsDialog.tsx
│   ├── AddTransaction.tsx
│   |── NavBar.tsx
|── └── Providers/
|       └── RootProviders.tsx
├── models/
│   └── Transaction.ts      # Mongoose transaction model
└── utils/
    └── db.ts              # Database connection utility
```

## 🔐 Security Features

- Secure authentication flow with Clerk
- Protected API routes requiring authentication
- MongoDB session management for safe transactions
- Input validation

## 👥 Author

- Chernet Asmamaw - Initial work - [Github](https://github.com/ChernetAsmamaw)
