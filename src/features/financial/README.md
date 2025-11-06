# Financial Management Module

A comprehensive financial management system for the Yoga POS application with full support for invoicing, payments, expenses, cash flow monitoring, and financial reporting.

## Features

### 1. Invoice Generation and Management
- Create, edit, and delete invoices
- Track invoice status (draft, sent, paid, overdue, etc.)
- Support for partial payments
- Invoice line items with discounts and taxes
- Automatic invoice numbering
- Email invoices to customers
- Generate invoice PDFs

### 2. Payment Tracking
- Record and track all payment transactions
- Multiple payment methods (cash, card, bank transfer, mobile payment, store credit)
- Payment status tracking (completed, pending, failed, refunded)
- Link payments to invoices
- Payment reconciliation
- Generate payment receipts

### 3. Expense Recording
- Categorized expense tracking
- Expense approval workflow (pending → approved → paid)
- Recurring expense support
- Vendor/supplier tracking
- Receipt attachment support
- Tax-deductible expense marking
- Multi-category expense analysis

### 4. Cash Flow Monitoring
- Real-time cash flow tracking
- Operating, investing, and financing activities breakdown
- Multiple bank account support
- Cash position forecasting
- Daily/weekly/monthly cash flow statements
- Opening and closing balance tracking

### 5. Bank Reconciliation
- Bank statement reconciliation
- Match transactions between books and bank statements
- Identify unmatched transactions
- Reconciliation history tracking
- Account balance verification

### 6. Profit Margin Tracking
- Overall profit margin calculation
- Profit margin by product/service
- Profit margin by category
- Gross profit vs. net profit analysis
- Margin trend tracking
- Top and low margin product identification

### 7. End-of-Day Reporting and Cash Reconciliation
- Daily sales summary
- Payment method breakdown
- Cash movements tracking
- Expected vs. actual cash reconciliation
- Transaction history for the day
- Top-selling products
- Shift-based reporting
- Cash overage/shortage tracking

## Module Structure

```
financial/
├── components/          # React components (to be expanded)
├── hooks/              # Custom React hooks
│   ├── useInvoices.js
│   └── index.js
├── services/           # API service layer with mock data
│   ├── invoiceService.js
│   ├── paymentService.js
│   ├── expenseService.js
│   ├── transactionService.js
│   ├── cashflowService.js
│   ├── reportService.js
│   └── index.js
├── store/              # Zustand state management
│   ├── invoiceSlice.js
│   ├── paymentSlice.js
│   ├── expenseSlice.js
│   ├── transactionSlice.js
│   ├── financialSlice.js
│   └── index.js
├── types/              # JSDoc type definitions
│   ├── invoice.types.js
│   ├── payment.types.js
│   ├── expense.types.js
│   ├── transaction.types.js
│   ├── cashflow.types.js
│   ├── report.types.js
│   └── index.js
├── index.js           # Module exports
└── README.md          # This file
```

## Usage

### Using the Invoice Hook

```javascript
import { useInvoices } from '@/features/financial/hooks/useInvoices';

function InvoiceComponent() {
  const {
    invoices,
    invoiceStats,
    isLoading,
    fetchInvoices,
    createInvoice,
    updateInvoiceData,
    deleteInvoice,
    markInvoiceAsPaid,
  } = useInvoices();

  // Fetch invoices with filters
  const loadInvoices = async () => {
    await fetchInvoices({
      status: 'overdue',
      startDate: new Date('2024-01-01'),
      endDate: new Date(),
    });
  };

  // Create new invoice
  const handleCreateInvoice = async (invoiceData) => {
    const newInvoice = await createInvoice(invoiceData);
    console.log('Created invoice:', newInvoice);
  };

  return (
    <div>
      {/* Your invoice UI */}
    </div>
  );
}
```

### Using Services Directly

```javascript
import { invoiceService } from '@/features/financial/services';

// Get all invoices
const invoices = await invoiceService.getList({ status: 'paid' });

// Get invoice by ID
const invoice = await invoiceService.getById('INV001');

// Create invoice
const newInvoice = await invoiceService.create({
  customerId: '1',
  customerName: 'John Doe',
  items: [
    {
      productName: 'Yoga Class',
      quantity: 1,
      unitPrice: 50.00,
      tax: 5.00,
      total: 55.00,
    },
  ],
  total: 55.00,
});

// Mark invoice as paid
await invoiceService.markAsPaid('INV001', {
  paymentMethod: 'card',
  transactionId: 'TXN123',
});
```

### Accessing Store State

```javascript
import { useStore } from '@/store';

function FinancialComponent() {
  // Get invoices from store
  const invoices = useStore((state) => state.invoices);
  const invoiceStats = useStore((state) => state.invoiceStats);

  // Get actions
  const setInvoices = useStore((state) => state.setInvoices);
  const addInvoice = useStore((state) => state.addInvoice);

  // Get computed values
  const getInvoiceById = useStore((state) => state.getInvoiceById);
  const overdueInvoices = useStore((state) => state.getOverdueInvoices());

  return <div>{/* Your UI */}</div>;
}
```

## API Integration

All services are currently using mock data with simulated network delays. To integrate with a real backend:

1. Replace service implementations with actual API calls
2. Update the delay() calls with axios or fetch requests
3. Handle authentication tokens
4. Implement error handling

Example:

```javascript
// Before (mock)
async getList(filters = {}) {
  await delay(500);
  return MOCK_INVOICES.filter(/* filters */);
}

// After (real API)
async getList(filters = {}) {
  const { data } = await axios.get('/api/invoices', { params: filters });
  return data;
}
```

## State Persistence

The following financial data is persisted in localStorage:
- Invoices and invoice statistics
- Payments and payment statistics
- Expenses and expense statistics
- Financial transactions
- Bank accounts
- End-of-day reports

Non-persisted data (fetched on demand):
- Cash flow statements
- Profit & loss reports
- Bank reconciliations
- Financial summaries

## Key Metrics Tracked

### Invoice Metrics
- Total invoices
- Total amount
- Total paid
- Total due
- Overdue amount
- Collection rate
- Average invoice value

### Payment Metrics
- Total payments
- Payment breakdown by method
- Completed/pending/failed counts
- Average payment value

### Expense Metrics
- Total expenses
- Expenses by category
- Pending/approved/paid amounts
- Recurring expenses total
- Average expense value

### Cash Flow Metrics
- Opening balance
- Closing balance
- Total inflows
- Total outflows
- Net cash flow
- Operating/investing/financing cash flows

## Reports Available

1. **Profit & Loss Statement**
   - Revenue breakdown
   - Cost of goods sold
   - Operating expenses
   - Net income
   - Profit margins

2. **End-of-Day Report**
   - Daily sales summary
   - Payment breakdown
   - Cash reconciliation
   - Top products
   - Transaction list

3. **Cash Flow Statement**
   - Operating activities
   - Investing activities
   - Financing activities
   - Cash position forecast

4. **Tax Report**
   - Taxable sales
   - Tax collected
   - Tax payable
   - Tax breakdown by rate

5. **Financial Summary**
   - Revenue trends
   - Expense trends
   - Profit trends
   - Accounts receivable
   - Accounts payable

## Integration with Other Modules

### Customer Module
- Links invoices to customers
- Tracks customer purchase history
- Supports customer credit and store credit
- Integrates with loyalty points

### POS Module
- Creates invoices from POS transactions
- Records payments from sales
- Updates financial records automatically

### Purchase Module
- Tracks supplier invoices
- Records expense transactions
- Links to accounts payable

### Inventory Module
- Tracks product costs for COGS calculation
- Links sales to revenue
- Calculates profit margins

## Next Steps for Enhancement

1. **Additional UI Components**
   - Invoice list and detail views
   - Payment processing forms
   - Expense management interface
   - Report visualization components

2. **Advanced Features**
   - Recurring invoice automation
   - Payment reminders
   - Multi-currency support
   - Budget tracking
   - Financial forecasting
   - Custom report builder

3. **Backend Integration**
   - Replace mock services with real API calls
   - Implement webhook support
   - Add payment gateway integration
   - Enable real-time synchronization

4. **Analytics Enhancement**
   - Advanced charting and visualization
   - Predictive analytics
   - Comparative analysis
   - KPI dashboards

## Contributing

When adding new features to the financial module:

1. Follow the established patterns (services → slices → hooks → components)
2. Add JSDoc type definitions for all data structures
3. Include mock data for development
4. Update this README with new features
5. Add appropriate error handling and loading states
6. Ensure proper state persistence configuration

## License

Part of the Yoga POS Management System
