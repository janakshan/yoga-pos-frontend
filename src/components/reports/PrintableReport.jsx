import { useTranslation } from 'react-i18next';
import { useStore } from '../../store';
import { formatCurrency } from '../../utils/currency';

/**
 * Printable Report Component
 * Professional report template optimized for printing
 * Supports various report types: Sales, Revenue, Inventory, etc.
 */
const PrintableReport = ({ report, className = '' }) => {
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

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get report type label
  const getReportTypeLabel = (type) => {
    const labels = {
      sales: 'Sales Report',
      revenue: 'Revenue Report',
      inventory: 'Inventory Report',
      customer: 'Customer Report',
      product: 'Product Performance Report',
      payment: 'Payment Methods Report',
      tax: 'Tax Summary Report',
      expense: 'Expense Report',
      profit_loss: 'Profit & Loss Statement',
      daily: 'Daily Summary Report',
      weekly: 'Weekly Summary Report',
      monthly: 'Monthly Summary Report',
      yearly: 'Yearly Summary Report',
    };
    return labels[type?.toLowerCase()] || 'Report';
  };

  return (
    <div
      className={`printable-report bg-white ${className}`}
      id="printable-report"
      style={{
        '--primary-color': branding.primaryColor,
        '--secondary-color': branding.secondaryColor,
        '--accent-color': branding.accentColor,
      }}
    >
      {/* Header */}
      <div className="report-header" style={{
        textAlign: 'center',
        borderBottom: '3px solid ' + branding.primaryColor,
        paddingBottom: '20px',
        marginBottom: '30px'
      }}>
        {businessInfo.logo && (
          <div style={{ marginBottom: '15px' }}>
            <img
              src={businessInfo.logo}
              alt={businessInfo.name}
              style={{ height: '60px', maxWidth: '200px', objectFit: 'contain' }}
            />
          </div>
        )}

        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          margin: '0 0 8px 0',
          color: branding.primaryColor
        }}>
          {businessInfo.name || 'Yoga POS'}
        </h1>

        <h2 className="report-title" style={{
          fontSize: '22px',
          fontWeight: 'bold',
          margin: '15px 0 8px 0',
          color: '#333'
        }}>
          {report.title || getReportTypeLabel(report.type)}
        </h2>

        <div className="report-subtitle" style={{
          fontSize: '14px',
          color: '#666',
          margin: '5px 0'
        }}>
          {report.description}
        </div>
      </div>

      {/* Report Metadata */}
      <div className="report-meta" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <div>
          <h3 style={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#666',
            textTransform: 'uppercase',
            marginBottom: '8px',
            letterSpacing: '0.5px'
          }}>
            Report Information
          </h3>
          <div style={{ fontSize: '13px', lineHeight: '1.8', color: '#333' }}>
            <div><strong>Report ID:</strong> {report.id}</div>
            <div><strong>Type:</strong> {getReportTypeLabel(report.type)}</div>
            <div><strong>Status:</strong> <span style={{
              textTransform: 'uppercase',
              fontWeight: '600',
              color: report.status === 'generated' ? '#10b981' : '#6b7280'
            }}>{report.status}</span></div>
            <div><strong>Generated:</strong> {formatDateTime(report.generatedAt || new Date())}</div>
          </div>
        </div>

        <div>
          <h3 style={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#666',
            textTransform: 'uppercase',
            marginBottom: '8px',
            letterSpacing: '0.5px'
          }}>
            Report Period
          </h3>
          <div style={{ fontSize: '13px', lineHeight: '1.8', color: '#333' }}>
            {report.dateRange ? (
              <>
                <div><strong>From:</strong> {formatDate(report.dateRange.from)}</div>
                <div><strong>To:</strong> {formatDate(report.dateRange.to)}</div>
                <div><strong>Period:</strong> {report.period || 'Custom'}</div>
              </>
            ) : (
              <div><strong>As of:</strong> {formatDate(new Date())}</div>
            )}
            {report.generatedBy && (
              <div><strong>Generated by:</strong> {report.generatedBy}</div>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {report.stats && Object.keys(report.stats).length > 0 && (
        <div className="report-stats" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '15px',
          marginBottom: '30px'
        }}>
          {Object.entries(report.stats).map(([key, value]) => (
            <div key={key} className="stat-card avoid-break" style={{
              padding: '15px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              textAlign: 'center',
              backgroundColor: '#fefefe'
            }}>
              <div style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                color: '#666',
                fontWeight: '600',
                letterSpacing: '0.5px',
                marginBottom: '8px'
              }}>
                {formatStatLabel(key)}
              </div>
              <div className="stat-value" style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: branding.primaryColor
              }}>
                {formatStatValue(key, value, formatPrice)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Report Data Table */}
      {report.data && Array.isArray(report.data) && report.data.length > 0 && (
        <div style={{ marginBottom: '30px' }} className="avoid-break">
          <h3 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '15px',
            color: '#333',
            borderBottom: '2px solid #e5e7eb',
            paddingBottom: '8px'
          }}>
            Report Details
          </h3>

          <table className="report-table" style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '12px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                {Object.keys(report.data[0]).map((key) => (
                  <th key={key} style={{
                    padding: '12px 8px',
                    textAlign: isNumberColumn(key) ? 'right' : 'left',
                    fontWeight: 'bold',
                    borderBottom: '2px solid #333',
                    textTransform: 'uppercase',
                    fontSize: '11px'
                  }}>
                    {formatColumnHeader(key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {report.data.map((row, index) => (
                <tr key={index} style={{
                  borderBottom: '1px solid #e5e7eb',
                  backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa'
                }}>
                  {Object.entries(row).map(([key, value]) => (
                    <td key={key} style={{
                      padding: '10px 8px',
                      textAlign: isNumberColumn(key) ? 'right' : 'left',
                    }} className={isNumberColumn(key) ? 'number-column' : ''}>
                      {formatCellValue(key, value, formatPrice, formatDate)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            {/* Totals Row if applicable */}
            {report.totals && (
              <tfoot>
                <tr style={{
                  backgroundColor: '#f0f0f0',
                  fontWeight: 'bold',
                  borderTop: '2px solid #333'
                }}>
                  {Object.entries(report.totals).map(([key, value], index) => (
                    <td key={key} style={{
                      padding: '12px 8px',
                      textAlign: isNumberColumn(key) || index > 0 ? 'right' : 'left',
                      fontWeight: 'bold'
                    }}>
                      {index === 0 && typeof value === 'string' ? value : formatCellValue(key, value, formatPrice, formatDate)}
                    </td>
                  ))}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}

      {/* Summary Section */}
      {report.summary && (
        <div style={{
          marginBottom: '30px',
          padding: '20px',
          backgroundColor: '#f9fafb',
          borderLeft: '4px solid ' + branding.primaryColor,
          borderRadius: '4px'
        }} className="avoid-break">
          <h3 style={{
            fontSize: '15px',
            fontWeight: 'bold',
            marginBottom: '12px',
            color: '#333'
          }}>
            Summary
          </h3>
          <div style={{ fontSize: '13px', lineHeight: '1.8', color: '#555', whiteSpace: 'pre-wrap' }}>
            {report.summary}
          </div>
        </div>
      )}

      {/* Notes/Comments */}
      {report.notes && (
        <div style={{
          marginBottom: '30px',
          padding: '15px',
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
          backgroundColor: '#fefefe'
        }} className="avoid-break">
          <h3 style={{
            fontSize: '13px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#333',
            textTransform: 'uppercase'
          }}>
            Notes:
          </h3>
          <div style={{ fontSize: '12px', lineHeight: '1.6', color: '#666', whiteSpace: 'pre-wrap' }}>
            {report.notes}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="report-footer" style={{
        marginTop: '50px',
        paddingTop: '20px',
        borderTop: '2px solid #e5e7eb',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '10px', color: '#999', lineHeight: '1.6' }}>
          <p style={{ margin: '0 0 4px 0' }}>
            This report is generated by {businessInfo.name || 'Yoga POS'}
          </p>
          {businessInfo.address && (
            <p style={{ margin: '0 0 4px 0' }}>{businessInfo.address}</p>
          )}
          {businessInfo.phone && businessInfo.email && (
            <p style={{ margin: '0 0 4px 0' }}>
              {businessInfo.phone} | {businessInfo.email}
            </p>
          )}
          <p style={{ margin: '8px 0 0 0', fontSize: '9px' }}>
            Generated on {formatDateTime(new Date())} | Page 1 of 1
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '9px', fontStyle: 'italic' }}>
            This is a computer-generated report and does not require a signature.
          </p>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const formatStatLabel = (key) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

const formatStatValue = (key, value, formatPrice) => {
  if (key.toLowerCase().includes('revenue') ||
      key.toLowerCase().includes('sales') ||
      key.toLowerCase().includes('total') ||
      key.toLowerCase().includes('amount') ||
      key.toLowerCase().includes('value')) {
    return formatPrice(value);
  }
  if (typeof value === 'number') {
    return value.toLocaleString();
  }
  return value;
};

const isNumberColumn = (key) => {
  const numericKeys = ['price', 'amount', 'total', 'revenue', 'sales', 'cost', 'profit', 'value', 'quantity', 'qty', 'count'];
  return numericKeys.some(numKey => key.toLowerCase().includes(numKey));
};

const formatColumnHeader = (key) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

const formatCellValue = (key, value, formatPrice, formatDate) => {
  if (value === null || value === undefined) return '-';

  // Check if it's a monetary value
  if (key.toLowerCase().includes('price') ||
      key.toLowerCase().includes('amount') ||
      key.toLowerCase().includes('total') ||
      key.toLowerCase().includes('revenue') ||
      key.toLowerCase().includes('sales') ||
      key.toLowerCase().includes('cost') ||
      key.toLowerCase().includes('profit') ||
      key.toLowerCase().includes('value')) {
    return formatPrice(value);
  }

  // Check if it's a date
  if (key.toLowerCase().includes('date') && typeof value === 'string') {
    try {
      return formatDate(value);
    } catch (e) {
      return value;
    }
  }

  // Check if it's a number
  if (typeof value === 'number') {
    return value.toLocaleString();
  }

  // Check if it's a boolean
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  return value;
};

export default PrintableReport;
