import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import './ExcelProcessor.css';

const ExcelProcessor = () => {
  const [excelData, setExcelData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('excelData');
    const savedHeaders = localStorage.getItem('excelHeaders');
    const savedFileName = localStorage.getItem('excelFileName');

    if (savedData && savedHeaders) {
      try {
        const parsedData = JSON.parse(savedData);
        const parsedHeaders = JSON.parse(savedHeaders);
        
        // Process the data when loading from localStorage
        const processedData = processExcelData(parsedData, parsedHeaders);
        
        setExcelData(processedData);
        setHeaders(parsedHeaders);
        setFileName(savedFileName || '');
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
  }, []);

  const calculateFreightCost = (row, headers) => {
    // Get column indices
    const volumeWeightIndex = headers.findIndex(h => h.trim() === 'VOLUME WEIGHT');
    const cityFactIndex = headers.findIndex(h => h.trim() === 'CITY FACT');
    const roundWeightIndex = headers.findIndex(h => h.trim() === 'ROUND WEIGHT');
    const freightCostIndex = headers.findIndex(h => h.trim() === 'Fr. COST($)');
    
    // If any required column is missing, return the row as is
    if (volumeWeightIndex === -1 || cityFactIndex === -1 || roundWeightIndex === -1 || freightCostIndex === -1) {
      return row;
    }
    
    const volumeWeight = String(row[volumeWeightIndex] || '').trim();
    const cityFact = String(row[cityFactIndex] || '').trim().toUpperCase();
    const roundWeight = parseFloat(row[roundWeightIndex]) || 0;
    
    // Only process if VOLUME WEIGHT is 'RO'
    if (volumeWeight === 'RO') {
      let cost = 0;
      
      if (cityFact === 'SHANGHAI') {
        if (roundWeight === 1) {
          cost = 6;
        } else if (roundWeight > 1 && roundWeight <= 50) {
          cost = 5.5 * roundWeight;
        } else if (roundWeight > 50) {
          cost = 5.3 * roundWeight;
        }
      } else if (cityFact === 'JIANGSU' || cityFact === 'ZHEJIANG') {
        if (roundWeight === 1) {
          cost = 8;
        } else if (roundWeight > 1 && roundWeight <= 50) {
          cost = 7 * roundWeight;
        } else if (roundWeight > 50) {
          cost = 6 * roundWeight;
        }
      }
      
      // Format the cost with USD prefix and 2 decimal places
      if (cost > 0) {
        const formattedCost = `USD ${cost.toFixed(1).replace(/\.0$/, '')}`;
        row[freightCostIndex] = formattedCost;
      }
    }
    
    return row;
  };

  const processExcelData = (data, headers) => {
    return data.map(row => calculateFreightCost([...row], headers));
  };

  const handleFileUpload = (e) => {
    setError('');
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];

    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/)) {
      setError('অনুগ্রহ করে একটি বৈধ এক্সেল ফাইল আপলোড করুন (XLSX, XLS বা CSV)');
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to array of arrays to preserve exact structure
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1, 
          defval: '', 
          blankrows: true,
          raw: false // Ensure formatted text is used
        });

        if (jsonData.length > 0) {
          // Process headers and data
          const processedHeaders = jsonData[0].map(h => h || '');
          const processedData = processExcelData(jsonData.slice(1).filter(row => row.length > 0), processedHeaders);

          setHeaders(processedHeaders);
          setExcelData(processedData);
          
          // Save to localStorage
          localStorage.setItem('excelData', JSON.stringify(processedData));
          localStorage.setItem('excelHeaders', JSON.stringify(processedHeaders));
          localStorage.setItem('excelFileName', file.name);
        }
      } catch (error) {
        console.error("Error processing file:", error);
        setError('ফাইল প্রসেস করতে সমস্যা হয়েছে। অনুগ্রহ করে একটি ভিন্ন ফাইল চেষ্টা করুন।');
      }
    };

    reader.onerror = () => {
      setError('ফাইল পড়তে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    };

    reader.readAsArrayBuffer(file);
  };

  const clearData = () => {
    if (window.confirm('আপনি কি নিশ্চিত যে আপনি সমস্ত ডাটা মুছে ফেলতে চান?')) {
      localStorage.removeItem('excelData');
      localStorage.removeItem('excelHeaders');
      localStorage.removeItem('excelFileName');
      setExcelData([]);
      setHeaders([]);
      setFileName('');
      setError('');
    }
  };

  const downloadData = () => {
    const ws = XLSX.utils.aoa_to_sheet([headers, ...excelData]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `saved_data_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const getCellStyle = (value) => {
    const isNumber = !isNaN(parseFloat(value)) && isFinite(value);
    return {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      padding: '8px 12px',
      border: '1px solid #ddd',
      textAlign: isNumber ? 'right' : 'left',
      maxWidth: '300px'
    };
  };

  return (
    <div className="excel-processor">
      <h2>এক্সেল ডাটা ভিউয়ার</h2>
      
      <div className="upload-section">
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileUpload}
          className="file-input"
          id="excelFileInput"
        />
        <label htmlFor="excelFileInput" className="upload-button">
          এক্সেল ফাইল সিলেক্ট করুন
        </label>
        
        {fileName && (
          <div className="file-actions">
            <span className="file-name">{fileName}</span>
            <button onClick={downloadData} className="action-button download">
              ডাউনলোড করুন
            </button>
            <button onClick={clearData} className="action-button clear">
              ডাটা ক্লিয়ার করুন
            </button>
          </div>
        )}
        
        {error && <p className="error-message">{error}</p>}
      </div>

      {headers.length > 0 ? (
        <div className="table-container">
          <div className="table-scroll-wrapper">
            <table className="excel-table">
              <thead>
                <tr>
                  {headers.map((header, index) => (
                    <th key={index} style={getCellStyle(header)}>
                      {header || `কলাম ${index + 1}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {excelData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {headers.map((_, cellIndex) => (
                      <td key={cellIndex} style={getCellStyle(row[cellIndex])}>
                        {row[cellIndex] || ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-info">
            মোট সারি: {excelData.length} | মোট কলাম: {headers.length}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <p>কোন ডাটা পাওয়া যায়নি। অনুগ্রহ করে একটি এক্সেল ফাইল আপলোড করুন।</p>
        </div>
      )}
    </div>
  );
};

export default ExcelProcessor;