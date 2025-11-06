import { format } from 'date-fns';

/**
 * Export Service
 * Handles exporting reports to different formats (PDF, Excel, CSV)
 */

// Utility function to simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Convert data to CSV format
 */
const convertToCSV = (data) => {
  if (!data || data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');

  const csvRows = data.map(row =>
    headers.map(header => {
      const value = row[header];
      // Handle values with commas or quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );

  return [csvHeaders, ...csvRows].join('\n');
};

/**
 * Flatten nested object for CSV export
 */
const flattenObject = (obj, prefix = '') => {
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    const newKey = prefix ? `${prefix}_${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      Object.assign(acc, flattenObject(value, newKey));
    } else {
      acc[newKey] = value;
    }

    return acc;
  }, {});
};

/**
 * Download file to client
 */
const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export report as CSV
 */
export const exportCSV = async (report) => {
  await delay(500);

  try {
    let csvContent = '';
    const timestamp = format(new Date(), 'yyyy-MM-dd_HHmmss');
    const filename = `${report.title.replace(/\s+/g, '_')}_${timestamp}.csv`;

    // Add report metadata
    csvContent += `Report Title,${report.title}\n`;
    csvContent += `Report Type,${report.type}\n`;
    csvContent += `Generated At,${format(new Date(report.createdAt), 'yyyy-MM-dd HH:mm:ss')}\n`;
    csvContent += `\n`;

    // Export data based on report type
    const { data } = report;

    if (data.summary) {
      csvContent += `\nSummary\n`;
      const summaryFlat = flattenObject(data.summary);
      csvContent += Object.keys(summaryFlat).map(key => `${key},${summaryFlat[key]}`).join('\n');
      csvContent += `\n`;
    }

    // Export arrays in the data
    Object.keys(data).forEach(key => {
      if (Array.isArray(data[key]) && data[key].length > 0) {
        csvContent += `\n${key}\n`;
        csvContent += convertToCSV(data[key]);
        csvContent += `\n`;
      }
    });

    downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');

    return {
      success: true,
      filename,
      format: 'csv',
    };
  } catch (error) {
    console.error('CSV export error:', error);
    throw new Error('Failed to export CSV');
  }
};

/**
 * Export report as Excel (simplified - generates CSV that can be opened in Excel)
 */
export const exportExcel = async (report) => {
  await delay(600);

  try {
    const timestamp = format(new Date(), 'yyyy-MM-dd_HHmmss');
    const filename = `${report.title.replace(/\s+/g, '_')}_${timestamp}.xlsx`;

    // For a real implementation, you would use a library like xlsx or exceljs
    // For now, we'll create a CSV-like format that Excel can open
    let content = '';

    // Report header
    content += `${report.title}\n`;
    content += `Generated: ${format(new Date(report.createdAt), 'yyyy-MM-dd HH:mm:ss')}\n`;
    content += `\n`;

    // Export data based on report type
    const { data } = report;

    if (data.summary) {
      content += `\nSummary\n`;
      const summaryFlat = flattenObject(data.summary);
      content += Object.keys(summaryFlat).map(key => `${key},${summaryFlat[key]}`).join('\n');
      content += `\n`;
    }

    // Export arrays in the data
    Object.keys(data).forEach(key => {
      if (Array.isArray(data[key]) && data[key].length > 0) {
        content += `\n${key}\n`;
        content += convertToCSV(data[key]);
        content += `\n`;
      }
    });

    // Note: In production, you should use a proper Excel library
    // For demo purposes, we're creating a CSV with .xlsx extension
    downloadFile(
      content,
      filename.replace('.xlsx', '.csv'), // Fallback to CSV
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    return {
      success: true,
      filename,
      format: 'excel',
      note: 'Downloaded as CSV - For full Excel support, integrate xlsx library',
    };
  } catch (error) {
    console.error('Excel export error:', error);
    throw new Error('Failed to export Excel');
  }
};

/**
 * Export report as PDF (simplified version)
 */
export const exportPDF = async (report) => {
  await delay(800);

  try {
    const timestamp = format(new Date(), 'yyyy-MM-dd_HHmmss');
    const filename = `${report.title.replace(/\s+/g, '_')}_${timestamp}.pdf`;

    // For a real implementation, you would use a library like jsPDF or pdfmake
    // For now, we'll create an HTML version and prompt the user to print to PDF
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${report.title}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      color: #333;
    }
    .header {
      border-bottom: 2px solid #333;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    h1 {
      margin: 0;
      color: #1a1a1a;
    }
    .metadata {
      color: #666;
      font-size: 14px;
      margin-top: 10px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: #1a1a1a;
      margin-bottom: 15px;
      border-bottom: 1px solid #ddd;
      padding-bottom: 5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th, td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #f5f5f5;
      font-weight: bold;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 20px;
    }
    .summary-item {
      padding: 15px;
      background-color: #f9f9f9;
      border-radius: 5px;
    }
    .summary-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    .summary-value {
      font-size: 24px;
      font-weight: bold;
      color: #1a1a1a;
    }
    @media print {
      body { margin: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${report.title}</h1>
    <div class="metadata">
      <p>Report Type: ${report.type}</p>
      <p>Generated: ${format(new Date(report.createdAt), 'MMMM dd, yyyy HH:mm:ss')}</p>
      ${report.filters?.startDate && report.filters?.endDate ?
        `<p>Period: ${format(new Date(report.filters.startDate), 'MMM dd, yyyy')} - ${format(new Date(report.filters.endDate), 'MMM dd, yyyy')}</p>` :
        ''
      }
      <p>Records: ${report.metadata?.recordCount?.toLocaleString() || 'N/A'}</p>
    </div>
  </div>

  ${generatePDFContent(report.data)}

  <div class="section no-print" style="margin-top: 40px; text-align: center; color: #999;">
    <p>Use your browser's Print function (Ctrl+P / Cmd+P) and select "Save as PDF" to create a PDF file.</p>
  </div>
</body>
</html>
    `;

    // Open in new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Trigger print dialog after a short delay
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }

    return {
      success: true,
      filename,
      format: 'pdf',
      note: 'PDF opened in new window - Use browser print to save',
    };
  } catch (error) {
    console.error('PDF export error:', error);
    throw new Error('Failed to export PDF');
  }
};

/**
 * Generate HTML content for PDF based on report data
 */
const generatePDFContent = (data) => {
  let html = '';

  // Summary section
  if (data.summary) {
    html += `<div class="section">
      <div class="section-title">Summary</div>
      <div class="summary-grid">`;

    Object.entries(data.summary).forEach(([key, value]) => {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      const formattedValue = typeof value === 'number' ?
        (key.includes('Rate') || key.includes('Margin') || key.includes('Percentage') ?
          `${value}%` :
          value.toLocaleString()) :
        value;

      html += `
        <div class="summary-item">
          <div class="summary-label">${label}</div>
          <div class="summary-value">${formattedValue}</div>
        </div>
      `;
    });

    html += `</div></div>`;
  }

  // Arrays as tables
  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      const title = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

      html += `<div class="section">
        <div class="section-title">${title}</div>
        <table>`;

      // Table headers
      const headers = Object.keys(value[0]);
      html += '<thead><tr>';
      headers.forEach(header => {
        const headerLabel = header.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        html += `<th>${headerLabel}</th>`;
      });
      html += '</tr></thead>';

      // Table rows
      html += '<tbody>';
      value.forEach(item => {
        html += '<tr>';
        headers.forEach(header => {
          const cellValue = item[header];
          const formattedValue = typeof cellValue === 'number' ? cellValue.toLocaleString() : cellValue;
          html += `<td>${formattedValue}</td>`;
        });
        html += '</tr>';
      });
      html += '</tbody>';

      html += '</table></div>';
    }
  });

  return html;
};

/**
 * Export report based on format
 */
export const exportReport = async (report, format) => {
  switch (format.toLowerCase()) {
    case 'csv':
      return await exportCSV(report);
    case 'excel':
    case 'xlsx':
      return await exportExcel(report);
    case 'pdf':
      return await exportPDF(report);
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};

export default {
  exportCSV,
  exportExcel,
  exportPDF,
  exportReport,
};
