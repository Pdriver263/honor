import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import './ExcelProcessor.css';

const ExcelProcessor = () => {
    // State declarations
    const [excelData, setExcelData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [fileName, setFileName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [editedCells, setEditedCells] = useState({});

    // Calculate column 2 cell statistics
    const getColumn2Stats = () => {
        let filledCount = 0;
        let emptyCount = 0;

        if (excelData.length > 0 && headers.length > 1) {
            excelData.forEach((row) => {
                const cellValue = row[1]; // Column 2 is index 1
                if (cellValue && cellValue.toString().trim() !== '') {
                    filledCount++;
                } else {
                    emptyCount++;
                }
            });
        }

        return { filledCount, emptyCount };
    };

    const { filledCount, emptyCount } = getColumn2Stats();

    // Load data from localStorage
    useEffect(() => {
        const savedData = localStorage.getItem('excelData');
        const savedHeaders = localStorage.getItem('excelHeaders');
        const savedFileName = localStorage.getItem('excelFileName');
        const savedEditedCells = localStorage.getItem('editedCells');

        if (savedData && savedHeaders) {
            try {
                const parsedData = JSON.parse(savedData);
                setExcelData(parsedData);
                setHeaders(JSON.parse(savedHeaders));
                setFileName(savedFileName || '');
                setFilteredData(parsedData);

                if (savedEditedCells) {
                    setEditedCells(JSON.parse(savedEditedCells));
                }
            } catch (error) {
                console.error("Error parsing saved data:", error);
            }
        }
    }, []);

    // Filter data based on search term
    useEffect(() => {
        if (searchTerm === '') {
            setFilteredData(excelData);
        } else {
            const results = excelData.filter(row =>
                row.some(cell =>
                    String(cell).toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
            setFilteredData(results);
        }
    }, [searchTerm, excelData]);

    // Handle file upload
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileName(file.name);
        setEditedCells({});

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                    header: 1,
                    defval: '',
                    blankrows: true
                });

                if (jsonData.length > 0) {
                    const headers = jsonData[0].map((header, index) => header || `কলাম-${index + 1}`);
                    const dataRows = jsonData.slice(1).map(row => headers.map((_, i) => row[i] || ''));

                    setHeaders(headers);
                    setExcelData(dataRows);
                    setFilteredData(dataRows);

                    localStorage.setItem('excelData', JSON.stringify(dataRows));
                    localStorage.setItem('excelHeaders', JSON.stringify(headers));
                    localStorage.setItem('excelFileName', file.name);
                    localStorage.removeItem('editedCells');
                }
            } catch (error) {
                console.error("Error processing file:", error);
                alert("ফাইল প্রসেস করতে সমস্যা হয়েছে। সঠিক এক্সেল ফাইল আপলোড করুন।");
            }
        };
        reader.readAsArrayBuffer(file);
    };

    // Clear all data with confirmation
    const clearData = () => {
        if (window.confirm("আপনি কি নিশ্চিতভাবে সকল ডাটা ক্লিয়ার করতে চান?")) {
            localStorage.removeItem('excelData');
            localStorage.removeItem('excelHeaders');
            localStorage.removeItem('excelFileName');
            localStorage.removeItem('editedCells');
            setExcelData([]);
            setHeaders([]);
            setFileName('');
            setFilteredData([]);
            setSearchTerm('');
            setEditedCells({});
            alert("ডাটা সফলভাবে ক্লিয়ার করা হয়েছে!");
        }
    };

    // Handle cell editing
    const handleCellEdit = (rowIndex, colIndex, value) => {
  const newData = [...excelData];
  if (!newData[rowIndex]) newData[rowIndex] = [];
  newData[rowIndex][colIndex] = value;
  setExcelData(newData);

  // Update edited cells tracking
  const newEditedCells = {
    ...editedCells,
    [`${rowIndex}-${colIndex}`]: value.trim() !== ''
  };
  setEditedCells(newEditedCells);

  localStorage.setItem('excelData', JSON.stringify(newData));
  localStorage.setItem('editedCells', JSON.stringify(newEditedCells));

  // Apply search filter if active
  if (searchTerm !== '') {
    const results = newData.filter(row =>
      row.some(cell => String(cell).toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredData(results);
  } else {
    setFilteredData(newData);
  }
};

    // Download Excel file
    const downloadExcel = () => {
        if (excelData.length === 0 || headers.length === 0) {
            alert("ডাউনলোড করার জন্য কোনো ডাটা নেই!");
            return;
        }

        try {
            const wb = XLSX.utils.book_new();
            const dataToExport = [headers, ...excelData];
            const ws = XLSX.utils.aoa_to_sheet(dataToExport);
            XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

            const downloadFileName = fileName
                ? fileName.replace(/\.[^/.]+$/, "") + "_modified.xlsx"
                : "modified_data.xlsx";

            XLSX.writeFile(wb, downloadFileName);
        } catch (error) {
            console.error("Error exporting Excel:", error);
            alert("এক্সেল ডাউনলোড করতে সমস্যা হয়েছে!");
        }
    };

    // Highlight search term in results
    const highlightSearchTerm = (text) => {
        if (!searchTerm) return text;

        const parts = String(text).split(new RegExp(`(${searchTerm})`, 'gi'));
        return parts.map((part, i) =>
            part.toLowerCase() === searchTerm.toLowerCase()
                ? <mark key={i}>{part}</mark>
                : part
        );
    };

    // Check if column-3 starts with a digit (0-9)
    const isColumn3StartsWithDigit = (row) => {
        if (row.length > 2 && row[2]) {
            return /^[0-9]/.test(String(row[2]));
        }
        return false;
    };

    return (
        <div className="excel-processor">
            <h2>সেম্পল লিস্ট</h2>

            <div className="upload-section">
                <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileUpload}
                    className="file-input"
                    id="excelFileInput"
                />
                <label htmlFor="excelFileInput" className="upload-button">
                    এক্সেল ফাইল সিলেক্ট করুন
                </label>

                {fileName && (
                    <div className="file-info">
                        <p className="file-name">সিলেক্টেড ফাইল: {fileName}</p>
                        {/* Column 2 Statistics Display */}
                        <div className="column-stats">
                            <div className="stat-item">
                                <span className="stat-label">পারসেল এসেছে:</span>
                                <span className="stat-value filled">{filledCount}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">মিসিং আছে:</span>
                                <span className="stat-value empty">{emptyCount}</span>
                            </div>
                        </div>
                        <div className="action-buttons">
                            <button onClick={clearData} className="action-btn clear-btn">
                                ডাটা ক্লিয়ার করুন
                            </button>
                            <button onClick={downloadExcel} className="action-btn download-btn">
                                ডাটা ডাউনলোড করুন
                            </button>
                            <button onClick={() => window.print()} className="action-btn print-btn">
                                প্রিন্ট করুন
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {headers.length > 0 && (
                <>
                  <div className="search-section">
  <input
    type="text"
    placeholder="এখানে বিস্তারিতভাবে সার্চ করুন..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="search-input-large"
    style={{
      fontSize: '22px',
      padding: '25px 30px',
      height: '80px'
    }}
  />
  {searchTerm && (
    <span className="search-results-large">
      মোট {filteredData.length} টি রেকর্ড পাওয়া গেছে
    </span>
  )}
</div>

                    <div className="table-container" style={{
  maxWidth: '100%',
  overflowX: 'auto',
  boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
  borderRadius: '4px',
  margin: '20px 0'
}}>
                        <table className="excel-table">
                            <thead>
                                <tr>
                                    {headers.map((header, index) => (
                                        <th key={index}>{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {headers.map((_, colIndex) => (
                                        <td
  key={colIndex}
  data-label={headers[colIndex]}
  className={
    colIndex === 1 && isColumn3StartsWithDigit(row) && editedCells[`${rowIndex}-${colIndex}`]
      ? 'edited-cell-highlight'
      : ''
  }
>
  {colIndex === 1 && isColumn3StartsWithDigit(row) ? (
    <input
      type="text"
      value={row[colIndex] || ''}
      onChange={(e) => handleCellEdit(
        excelData.findIndex(r => JSON.stringify(r) === JSON.stringify(filteredData[rowIndex])),
        colIndex,
        e.target.value
      )}
      className="editable-cell"
    />
  ) : (
    highlightSearchTerm(row[colIndex])
  )}
</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default ExcelProcessor;