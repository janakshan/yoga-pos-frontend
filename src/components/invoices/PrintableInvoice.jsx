import { useTranslation } from 'react-i18next';
import { useStore } from '../../store';
import { formatCurrency } from '../../utils/currency';

/**
 * Printable Invoice Component
 * Professional invoice template optimized for printing
 * Includes: items, prices, tax, discounts, payment details, terms
 */
const PrintableInvoice = ({ invoice, className = '' }) => {
  const { t } = useTranslation();
  const {
    businessInfo,
    branding,
    currency,
    currencySymbol,
    locale,
  } = useStore();

  const formatPrice = (amount) => {
    return formatCurrency(amount, currency, locale);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateTotals = () => {
    const subtotal = invoice.items?.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0) || 0;

    const discountAmount = invoice.discount || 0;
    const taxAmount = invoice.tax || 0;
    const total = subtotal - discountAmount + taxAmount;

    return {
      subtotal,
      discountAmount,
      taxAmount,
      total,
    };
  };

  const totals = calculateTotals();

  return (
    <div
      className={`printable-invoice bg-white ${className}`}
      id="printable-invoice"
      style={{
        '--primary-color': branding.primaryColor,
        '--secondary-color': branding.secondaryColor,
        '--accent-color': branding.accentColor,
      }}
    >
      {/* Header */}
      <div className="invoice-header">
        <div className="invoice-header-left">
          {businessInfo.logo && (
            <img
              src={businessInfo.logo}
              alt={businessInfo.name}
              className="invoice-logo"
            />
          )}
          <div style={{ marginTop: '10px' }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              margin: '0 0 8px 0',
              color: branding.primaryColor
            }}>
              {businessInfo.name || 'Yoga POS'}
            </h1>
            <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.6' }}>
              {businessInfo.address && <div>{businessInfo.address}</div>}
              {businessInfo.phone && <div>Phone: {businessInfo.phone}</div>}
              {businessInfo.email && <div>Email: {businessInfo.email}</div>}
              {businessInfo.website && <div>Web: {businessInfo.website}</div>}
              {businessInfo.taxId && <div>Tax ID: {businessInfo.taxId}</div>}
            </div>
          </div>
        </div>

        <div className="invoice-header-right" style={{ textAlign: 'right' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            margin: '0 0 10px 0',
            color: branding.primaryColor
          }}>
            INVOICE
          </h2>
          <div style={{ fontSize: '13px', lineHeight: '1.8' }}>
            <div><strong>Invoice #:</strong> {invoice.invoiceNumber || invoice.id}</div>
            <div><strong>Date:</strong> {formatDate(invoice.date || new Date())}</div>
            {invoice.dueDate && (
              <div><strong>Due Date:</strong> {formatDate(invoice.dueDate)}</div>
            )}
            <div style={{
              marginTop: '8px',
              padding: '6px 12px',
              backgroundColor: getStatusColor(invoice.status),
              color: 'white',
              borderRadius: '4px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: '11px',
            }}>
              {invoice.status || 'DRAFT'}
            </div>
          </div>
        </div>
      </div>

      {/* Bill To / Ship To */}
      <div className="invoice-details" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginTop: '30px',
        marginBottom: '30px'
      }}>
        <div>
          <h3 style={{
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '10px',
            color: '#333',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Bill To:
          </h3>
          <div style={{ fontSize: '13px', lineHeight: '1.8', color: '#555' }}>
            {invoice.customer?.name && (
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                {invoice.customer.name}
              </div>
            )}
            {invoice.customer?.address && <div>{invoice.customer.address}</div>}
            {invoice.customer?.email && <div>Email: {invoice.customer.email}</div>}
            {invoice.customer?.phone && <div>Phone: {invoice.customer.phone}</div>}
            {invoice.customer?.taxId && <div>Tax ID: {invoice.customer.taxId}</div>}
          </div>
        </div>

        {invoice.shippingAddress && (
          <div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '10px',
              color: '#333',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Ship To:
            </h3>
            <div style={{ fontSize: '13px', lineHeight: '1.8', color: '#555' }}>
              {invoice.shippingAddress}
            </div>
          </div>
        )}
      </div>

      {/* Items Table */}
      <table className="invoice-items" style={{
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '30px'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{
              padding: '12px',
              textAlign: 'left',
              fontWeight: 'bold',
              fontSize: '12px',
              textTransform: 'uppercase',
              borderBottom: '2px solid #333'
            }}>
              #
            </th>
            <th style={{
              padding: '12px',
              textAlign: 'left',
              fontWeight: 'bold',
              fontSize: '12px',
              textTransform: 'uppercase',
              borderBottom: '2px solid #333'
            }}>
              Item Description
            </th>
            <th style={{
              padding: '12px',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '12px',
              textTransform: 'uppercase',
              borderBottom: '2px solid #333'
            }}>
              Quantity
            </th>
            <th style={{
              padding: '12px',
              textAlign: 'right',
              fontWeight: 'bold',
              fontSize: '12px',
              textTransform: 'uppercase',
              borderBottom: '2px solid #333'
            }}>
              Unit Price
            </th>
            <th style={{
              padding: '12px',
              textAlign: 'right',
              fontWeight: 'bold',
              fontSize: '12px',
              textTransform: 'uppercase',
              borderBottom: '2px solid #333'
            }}>
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {invoice.items?.map((item, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '12px', fontSize: '12px' }}>
                {index + 1}
              </td>
              <td style={{ padding: '12px', fontSize: '12px' }}>
                <div style={{ fontWeight: '500', marginBottom: '2px' }}>
                  {item.name}
                </div>
                {item.description && (
                  <div style={{ fontSize: '11px', color: '#666' }}>
                    {item.description}
                  </div>
                )}
                {item.sku && (
                  <div style={{ fontSize: '10px', color: '#999' }}>
                    SKU: {item.sku}
                  </div>
                )}
              </td>
              <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>
                {item.quantity}
              </td>
              <td style={{ padding: '12px', textAlign: 'right', fontSize: '12px' }}>
                {formatPrice(item.price)}
              </td>
              <td style={{ padding: '12px', textAlign: 'right', fontSize: '12px', fontWeight: '500' }}>
                {formatPrice(item.price * item.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
        <div style={{ minWidth: '300px' }}>
          <table style={{ width: '100%', fontSize: '13px' }}>
            <tbody>
              <tr>
                <td style={{ padding: '8px 12px', textAlign: 'right', color: '#555' }}>
                  Subtotal:
                </td>
                <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: '500' }}>
                  {formatPrice(totals.subtotal)}
                </td>
              </tr>
              {totals.discountAmount > 0 && (
                <tr>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: '#555' }}>
                    Discount:
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: '#dc2626', fontWeight: '500' }}>
                    -{formatPrice(totals.discountAmount)}
                  </td>
                </tr>
              )}
              {totals.taxAmount > 0 && (
                <tr>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: '#555' }}>
                    Tax {invoice.taxRate ? `(${invoice.taxRate}%)` : ''}:
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: '500' }}>
                    {formatPrice(totals.taxAmount)}
                  </td>
                </tr>
              )}
              <tr style={{ borderTop: '2px solid #333' }}>
                <td style={{
                  padding: '12px 12px 8px',
                  textAlign: 'right',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: branding.primaryColor
                }}>
                  Total:
                </td>
                <td style={{
                  padding: '12px 12px 8px',
                  textAlign: 'right',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: branding.primaryColor
                }}>
                  {formatPrice(totals.total)}
                </td>
              </tr>
              {invoice.amountPaid > 0 && (
                <>
                  <tr>
                    <td style={{ padding: '8px 12px', textAlign: 'right', color: '#555' }}>
                      Amount Paid:
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', color: '#16a34a', fontWeight: '500' }}>
                      -{formatPrice(invoice.amountPaid)}
                    </td>
                  </tr>
                  <tr style={{ borderTop: '1px solid #ddd' }}>
                    <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 'bold', color: '#555' }}>
                      Amount Due:
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 'bold', color: '#dc2626' }}>
                      {formatPrice(totals.total - invoice.amountPaid)}
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Details */}
      {invoice.paymentMethod && (
        <div style={{
          marginBottom: '30px',
          padding: '15px',
          backgroundColor: '#f9fafb',
          borderLeft: '4px solid ' + branding.primaryColor
        }}>
          <h3 style={{
            fontSize: '13px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#333',
            textTransform: 'uppercase'
          }}>
            Payment Information:
          </h3>
          <div style={{ fontSize: '12px', lineHeight: '1.6', color: '#555' }}>
            <div><strong>Method:</strong> {invoice.paymentMethod}</div>
            {invoice.paymentDate && (
              <div><strong>Payment Date:</strong> {formatDate(invoice.paymentDate)}</div>
            )}
            {invoice.transactionId && (
              <div><strong>Transaction ID:</strong> {invoice.transactionId}</div>
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      {invoice.notes && (
        <div className="invoice-notes" style={{
          marginBottom: '30px',
          padding: '15px',
          backgroundColor: '#f9fafb',
          borderLeft: '4px solid ' + branding.secondaryColor
        }}>
          <h3 style={{
            fontSize: '13px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#333',
            textTransform: 'uppercase'
          }}>
            Notes:
          </h3>
          <div style={{ fontSize: '12px', lineHeight: '1.6', color: '#555', whiteSpace: 'pre-wrap' }}>
            {invoice.notes}
          </div>
        </div>
      )}

      {/* Terms & Conditions */}
      {invoice.terms && (
        <div style={{
          marginBottom: '30px',
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          backgroundColor: '#fefefe'
        }}>
          <h3 style={{
            fontSize: '13px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#333',
            textTransform: 'uppercase'
          }}>
            Terms & Conditions:
          </h3>
          <div style={{ fontSize: '11px', lineHeight: '1.6', color: '#666', whiteSpace: 'pre-wrap' }}>
            {invoice.terms}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="invoice-footer" style={{
        marginTop: '40px',
        paddingTop: '20px',
        borderTop: '2px solid #e5e7eb',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
          <p style={{ margin: '0 0 8px 0' }}>
            Thank you for your business!
          </p>
          {businessInfo.email && (
            <p style={{ margin: '0 0 4px 0' }}>
              For questions about this invoice, contact {businessInfo.email}
            </p>
          )}
          {businessInfo.phone && (
            <p style={{ margin: '0 0 4px 0' }}>
              Phone: {businessInfo.phone}
            </p>
          )}
          <p style={{ margin: '12px 0 0 0', fontSize: '10px', color: '#999' }}>
            Generated by {businessInfo.name || 'Yoga POS'} on {formatDate(new Date())}
          </p>
        </div>
      </div>
    </div>
  );
};

// Helper function to get status color
const getStatusColor = (status) => {
  const colors = {
    draft: '#6b7280',
    sent: '#3b82f6',
    paid: '#10b981',
    partial: '#f59e0b',
    overdue: '#ef4444',
    cancelled: '#6b7280',
  };
  return colors[status?.toLowerCase()] || colors.draft;
};

export default PrintableInvoice;
