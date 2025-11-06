import { useTranslation } from 'react-i18next';
import { useStore } from '../../store';
import { formatCurrency } from '../../utils/currency';

/**
 * Branded Receipt Component
 * Customizable receipt template with business branding
 */
const BrandedReceipt = ({ transaction, className = '' }) => {
  const { t } = useTranslation();
  const {
    businessInfo,
    branding,
    currency,
    currencySymbol,
    locale,
    receiptHeader,
    receiptFooter,
  } = useStore();

  const formatPrice = (amount) => {
    return formatCurrency(amount, currency, locale);
  };

  return (
    <div
      className={`bg-white max-w-sm mx-auto ${className}`}
      style={{
        fontFamily: 'monospace',
        '--primary-color': branding.primaryColor,
        '--secondary-color': branding.secondaryColor,
        '--accent-color': branding.accentColor,
      }}
    >
      {/* Logo */}
      {businessInfo.logo && (
        <div className="text-center mb-4">
          <img
            src={businessInfo.logo}
            alt={businessInfo.name}
            className="h-16 mx-auto"
          />
        </div>
      )}

      {/* Business Name */}
      <div
        className="text-center text-xl font-bold mb-2"
        style={{ color: branding.primaryColor }}
      >
        {businessInfo.name || 'Yoga POS'}
      </div>

      {/* Business Info */}
      <div className="text-center text-sm text-gray-600 mb-4">
        {businessInfo.address && <div>{businessInfo.address}</div>}
        {businessInfo.phone && <div>{businessInfo.phone}</div>}
        {businessInfo.email && <div>{businessInfo.email}</div>}
        {businessInfo.website && <div>{businessInfo.website}</div>}
        {businessInfo.taxId && <div>Tax ID: {businessInfo.taxId}</div>}
      </div>

      {/* Custom Header */}
      {receiptHeader && (
        <div className="text-center text-sm mb-4 border-t border-b border-dashed py-2">
          {receiptHeader}
        </div>
      )}

      <div className="border-t border-dashed border-gray-400 my-4"></div>

      {/* Receipt Details */}
      <div className="text-sm space-y-1 mb-4">
        <div className="flex justify-between">
          <span>{t('receipt.receiptNo')}:</span>
          <span className="font-semibold">{transaction.receiptNumber}</span>
        </div>
        <div className="flex justify-between">
          <span>{t('receipt.date')}:</span>
          <span>{new Date(transaction.date).toLocaleString(locale)}</span>
        </div>
        {transaction.cashier && (
          <div className="flex justify-between">
            <span>{t('receipt.cashier')}:</span>
            <span>{transaction.cashier}</span>
          </div>
        )}
        {transaction.customer && (
          <div className="flex justify-between">
            <span>{t('receipt.customer')}:</span>
            <span>{transaction.customer}</span>
          </div>
        )}
      </div>

      <div className="border-t border-dashed border-gray-400 my-4"></div>

      {/* Items */}
      <div className="mb-4">
        <div className="text-sm font-bold mb-2">{t('receipt.items')}</div>
        {transaction.items.map((item, index) => (
          <div key={index} className="text-sm mb-2">
            <div className="flex justify-between">
              <span className="font-medium">{item.name}</span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
            <div className="text-gray-600 text-xs ml-2">
              {item.quantity} x {formatPrice(item.price)}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-dashed border-gray-400 my-4"></div>

      {/* Totals */}
      <div className="text-sm space-y-1 mb-4">
        <div className="flex justify-between">
          <span>{t('receipt.subtotal')}:</span>
          <span>{formatPrice(transaction.subtotal)}</span>
        </div>
        {transaction.discount > 0 && (
          <div className="flex justify-between text-red-600">
            <span>{t('receipt.discount')}:</span>
            <span>-{formatPrice(transaction.discount)}</span>
          </div>
        )}
        {transaction.tax > 0 && (
          <div className="flex justify-between">
            <span>{t('receipt.tax')}:</span>
            <span>{formatPrice(transaction.tax)}</span>
          </div>
        )}
        <div
          className="flex justify-between text-lg font-bold pt-2 border-t"
          style={{ color: branding.primaryColor }}
        >
          <span>{t('receipt.grandTotal')}:</span>
          <span>{formatPrice(transaction.total)}</span>
        </div>
      </div>

      <div className="border-t border-dashed border-gray-400 my-4"></div>

      {/* Payment Details */}
      <div className="text-sm space-y-1 mb-4">
        <div className="flex justify-between">
          <span>{t('receipt.paymentMethod')}:</span>
          <span className="capitalize">{transaction.paymentMethod}</span>
        </div>
        {transaction.amountPaid !== undefined && (
          <div className="flex justify-between">
            <span>{t('receipt.amountPaid')}:</span>
            <span>{formatPrice(transaction.amountPaid)}</span>
          </div>
        )}
        {transaction.change > 0 && (
          <div className="flex justify-between">
            <span>{t('receipt.change')}:</span>
            <span>{formatPrice(transaction.change)}</span>
          </div>
        )}
      </div>

      <div className="border-t border-dashed border-gray-400 my-4"></div>

      {/* Custom Footer */}
      {receiptFooter && (
        <div className="text-center text-sm mb-4">{receiptFooter}</div>
      )}

      {/* Thank You Message */}
      <div className="text-center text-sm space-y-1">
        <div
          className="font-semibold"
          style={{ color: branding.secondaryColor }}
        >
          {t('receipt.thankYou')}
        </div>
        <div>{t('receipt.visitAgain')}</div>
      </div>

      <div className="border-t border-dashed border-gray-400 my-4"></div>

      {/* Powered By */}
      <div className="text-center text-xs text-gray-500">
        {t('receipt.poweredBy')}
      </div>

      {/* Barcode (if receipt number exists) */}
      {transaction.receiptNumber && (
        <div className="text-center mt-4">
          <svg
            className="mx-auto"
            width="200"
            height="50"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Simple barcode representation */}
            <text x="50%" y="30" textAnchor="middle" fontSize="10" fill="#000">
              {transaction.receiptNumber}
            </text>
            <g transform="translate(20, 35)">
              {transaction.receiptNumber.split('').map((digit, i) => (
                <rect
                  key={i}
                  x={i * 10}
                  y="0"
                  width={parseInt(digit) % 2 === 0 ? 8 : 4}
                  height="15"
                  fill="#000"
                />
              ))}
            </g>
          </svg>
        </div>
      )}
    </div>
  );
};

export default BrandedReceipt;
