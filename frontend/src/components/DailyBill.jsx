import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import './ExcelProcessor.css';

const ExcelProcessor = () => {
  const [excelData, setExcelData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  // DM Companies list
  const dmCompanies = [
    'UNITEX/JIANGSU UNITY TEXT',
    'ZHONG ZAI INTERNATIONAL COM LTD/ZINFAB INT/YZ',
    'TEX EBO INDUSTRIAL PVT LTD/TAG INDUTRY',
    'M&M/MULTIPLE MERCHANDISER',
    'LOUIETEX MANUFACTRING LTD',
    'HIGH HOPE INTERNATIONAL/ HIGH HOPE CORPORATION',
    'GLOBAL APPEAREL/KAISER',
    'FABRIC MART/HEAD OFFICE/FEBRIC EXPRESS'
  ].map(c => c.toUpperCase());

  // M Companies list
  const mCompanies = [
  'AADI EXPORT/CINDRELLA FASHION LIMITED',
  'AIM GLOBAL TEXTILE LTD/GLOBAL TEXTILE/FAHIM GLOB TEX/IBRAHIM KHACI',
  'AIM GLOBAL TEXTILE LTD/UNIBRANDS BD/GLOBAL TEXTILE/FAHIM GLOB TEX/IBRAHIM KHACI',
  'A & A SOURCING',
  'A & A SOURCING/AA SOURCING',
  'AMIA/JIANGSU GUOTAI/BD OFFICE/RUPAN',
  'AMTEX',
  'BANGLA TEX/FABRIC EXPRESS/ULLASH/AWAL/BENOJIR',
  'BARAKAH GLOBAL',
  'CHINA RESOURCE INT\'L',
  'CHINA RESOURCE TEXTILE',
  'CHUNQIN TRADE/LATEST',
  'CHUNQIN TRADE',
  'COMTEXTILE/ONLY DHAKA',
  'CORPORATE FIELD',
  'CT IMPEX',
  'CLOTHING PARK LTD',
  'D & Z/DZ TEXTILE COMPANY LTD',
  'D & Z/DZ TEXTILE COMPANY LTD/OVI TEXTILE',
  'DVC/BANGLADESH LIAISON OFFICE',
  'DMI/AMIT/SAMIR/DAMODER MENON INTL/UNIVERSAL EXPREE/GET WAY NEXT',
  'DMI/AMIT/SAMIR/DAMODER MENON INTL/UNIVERSAL EXPREE/GATEWAY NEXT LIMITED',
  'DESIGN ACE/DAL KNITWEAR/GROUP DESIGN ACE',
  'EMON FASHION',
  'EXPERTEX BD',
  'EVERBEST FABRIC',
  'EURO BANGLA/CAPITAL POSHAK',
  'FAIRDEAL FABRICS',
  'FAIRDEAL FABRICS/MR HABIBUR',
  'FOUR SEASON',
  'FA TEX/ROKEY MENTION',
  'FABRITEX SOURCES LTD',
  'FABRITEX SOURCES LTD',
  'FASHION MINE/NEW FABRIC WORLD/YOTOPLA',
  'FASHION MINE',
  'FAIYAZ GROUP/APPAREL VILLAGE',
  'FABRIC WORLD',
  'FABRIC WORLD/NEW FABRIC WORLD',
  'FABRIC MART/HEAD OFFICE',
  'GLOBAL APPEAREL/KAISER',
  'GOODLINK ENTERPRISE',
  'HAPA FASHION/TANVIR',
  'HUA TEX',
  'HUAJIN TEXTILE/TEX-TRIM (BD) INTERNATIONAL',
  'HIGH HOPE INTERNATIONAL',
  'INTIMATES GLOBAL',
  'ISYG/I SOURCE YOUR GMT LTD',
  'IRIS FABRICS/DESIGN',
  'IRIS FABRICS/IRIS DESIGN/IRIS FASHION',
  'JINCO INT\'L/NOVO FREIGHT LOGI STICS',
  'JIANGSHU TEXTILE',
  'JSTEX LTD/GMT/GREEN BANGLA/GREEN DESIGINING/SEAROCK APP LTD',
  'JSTEX BD/LIANXIN TEX FABRICS',
  'JSTEX BD/LIANXING TEX FABRICS',
  'JAAN COMPOSITE',
  'KONG SHING',
  'KAZI O TEX',
  'KRAYONS SOURCING LTD',
  'LAPSAK/VALIANT CLOTHING LTD',
  'LIMELIGHT/BANGLADESH HUJUHU',
  'LIMELIGHT',
  'LOUIETEX MANUFACTRING LTD',
  'MORITO BANGLADESH',
  'MAA TRADE/MAA TEX/VOLCAN',
  'MHC APP',
  'MR TEX',
  'MUTISA CLOTHINGS',
  'NID HK INTERNATIONAL',
  'NAFISA/EMON FASHION LTD',
  'NAFISA',
  'NEXT SOURCING/NEXT BD/GIANT BUS',
  'NEXT ENTERPRISE/BD JIANGSHU',
  'NORWEST/KRAYON/STYLEBERRY LTD/DESIGN ARC/PDS',
  'NORWEST/KRAYON/STYLEBERRY LTD/DESIGN ARC',
  'POETICGEM/PDS',
  'POSH GMT',
  'PREFACE FASHION/RBSR',
  'PQS/DRESSYTEX SOURCING',
  'RADIANT FABRICS',
  'RUYI DHAKA/SHANDONG RUYI',
  'SOURCE BOOK/JIANGSU UNITY TEX INT CO BD LTD',
  'S OLIVER',
  'SS CORPORATION',
  'SARF TEX LIMITED',
  'SUNGETEX/TEXTILE FAIR',
  'TITHLEE TEXTILE IMPORT EXPORT CORPORATION',
  'TEXCESS INT\'L/RAK TEXTILE/WORLD UP FASHION',
  'TEXPERT',
  'TEX EBO INDUSTRIAL PVT LTD/TAG INDUTRY',
  'TEXTOWN BANGLADESH LIMITED',
  'VERTEX WEAR LIMITED/DRESS WORLD LIMITED/NEO FASHION LIMITED/VALIANT CLOTHING',
  'VERTEX WEAR LIMITED/DRESS WORLD LIMITED/NEO FASHION LIMITED/VERTEX UNIVERSAL WEAR',
  'UNIPOLE BD/PINKON',
  'URIGHT TRADING',
  'WELLDONE FABRIC',
  'UNITEX TEXTILE BD LIMITED',
  'ZHONGYOU TRADING/ROSE WOOD TRADING',
  'ZIL TEX FASHION/JIANGSU HIGH HOPE CORPORATION',
  'ZHONGXIN TRADING/THE ROSE WOOD',
  'THE ZSM INTERNATIONAL',
  'ZM IMPEX',
  'ZHONG ZAI INTERNATIONAL COM LTD/ZINFAB INT/YZ',
  'ZANN SOURCING FASHION LTD',
  'LEECO/BESTEC BD',
  'BSKL/BD SPINNER',
  'CTG KNITWEAR',
  'EAST PROFIT',
  'KDS',
  'MERIMCO',
  'WORLD YE',
  'NATIONAL ACC',
  'SEA BLUE/ASSIAN APP/CTG ASSIAN/PRIYAM',
  'GH HAEWAE CO LTD.',
  'MTM',
  'SHAMS DESIGN & MARKETING',
  'BARCODE/JIST'
].map(c => c.toUpperCase());

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('excelData');
    const savedHeaders = localStorage.getItem('excelHeaders');
    const savedFileName = localStorage.getItem('excelFileName');

    if (savedData && savedHeaders) {
      try {
        setExcelData(JSON.parse(savedData));
        setHeaders(JSON.parse(savedHeaders));
        setFileName(savedFileName || '');
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
  }, []);

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
      setError('Please upload a valid Excel file (XLSX, XLS or CSV)');
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
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1, 
          defval: '', 
          blankrows: true,
          raw: false
        });

        if (jsonData.length > 0) {
          let processedHeaders = jsonData[0].map(h => h || '');
          let processedData = jsonData.slice(1).filter(row => row.length > 0);

          // Get all column indexes
          const columnIndexes = {
            wgt: processedHeaders.findIndex(h => h.trim().toUpperCase() === 'WGT'),
            typeOfPayment: processedHeaders.findIndex(h => h.trim().toUpperCase() === 'TYPE OF PAYMENT'),
            frCostDollar: processedHeaders.findIndex(h => h.trim().toUpperCase() === 'FR. COST($)'),
            frCostTk: processedHeaders.findIndex(h => h.trim().toUpperCase() === 'FR. COST(TK)'),
            deliveryItem: processedHeaders.findIndex(h => h.trim().toUpperCase() === 'DELIVERY ITEM'),
            paidDate: processedHeaders.findIndex(h => h.trim().toUpperCase() === 'PAID DATE'),
            roundWeight: processedHeaders.findIndex(h => h.trim().toUpperCase() === 'ROUND WEIGHT'),
            volumeWeight: processedHeaders.findIndex(h => h.trim().toUpperCase() === 'VOLUME WEIGHT'),
            area: processedHeaders.findIndex(h => h.trim().toUpperCase() === 'AREA'),
            remarks: processedHeaders.findIndex(h => h.trim().toUpperCase() === 'REMARKS'),
            dollarRate: processedHeaders.findIndex(h => h.trim().toUpperCase() === 'DOLLER RATE'),
            custom: processedHeaders.findIndex(h => h.trim().toUpperCase() === 'CUSTOM'),
            total: processedHeaders.findIndex(h => h.trim().toUpperCase() === 'TOTAL'),
            companyName: processedHeaders.findIndex(h => h.trim().toUpperCase() === 'COMPANY NAME'),
            cityFact: processedHeaders.findIndex(h => h.trim().toUpperCase() === 'CITY FACT')
          };

          // Add ROUND WEIGHT column if needed
          if (columnIndexes.wgt !== -1 && columnIndexes.roundWeight === -1) {
            processedHeaders.push('ROUND WEIGHT');
            columnIndexes.roundWeight = processedHeaders.length - 1;
          }

          processedData = processedData.map(row => {
            const newRow = [...row];
            const getValue = (index) => (newRow[index] || '').toString().trim();


//০--------------------------------------------------------
if (columnIndexes.typeOfPayment !== -1) {
  const typeOfPaymentValue = getValue(columnIndexes.typeOfPayment).toUpperCase();
  
  if (typeOfPaymentValue.includes('USD')) {
    const usdValue = parseFloat(typeOfPaymentValue.replace('USD', ''));
    const increasedValue = usdValue * 1.1;
    const decimalPart = increasedValue - Math.floor(increasedValue);
    
    if (decimalPart >= 0.5 && decimalPart <= 0.9) {
      newRow[columnIndexes.frCostDollar] = Math.ceil(increasedValue).toString();
    } else {
      newRow[columnIndexes.frCostDollar] = Math.round(increasedValue).toString();
    }
  }
}

// VOLUME WEIGHT কলামে RO থাকলে Fr. COST($) = 7 বসানো
// SHANGHAI Rule Processing
if (columnIndexes.volumeWeight !== -1 && 
    columnIndexes.cityFact !== -1 && 
    columnIndexes.roundWeight !== -1 && 
    columnIndexes.frCostDollar !== -1) {
  
  const volWeight = (newRow[columnIndexes.volumeWeight] || '').toString().toUpperCase();
  const cityFact = (newRow[columnIndexes.cityFact] || '').toString().toUpperCase();
  const roundWeight = parseInt(newRow[columnIndexes.roundWeight]) || 0;

  if ((volWeight === 'RO' || volWeight === 'RO/') && cityFact === 'SHANGHAI') {
    if (roundWeight === 1) {
      newRow[columnIndexes.frCostDollar] = '$6';
    } 
    else if (roundWeight > 1 && roundWeight <= 50) {
      const cost = 6 + (roundWeight - 1) * 5.5;
      newRow[columnIndexes.frCostDollar] = `$${cost.toFixed(2)}`;
    } 
    else if (roundWeight > 50) {
      const cost = 6 + 49 * 5.5 + (roundWeight - 50) * 5.3;
      newRow[columnIndexes.frCostDollar] = `$${cost.toFixed(2)}`;
    }
  }
}
            //------------------------------------------------------

           // VOLUME WEIGHT, CITY FACT, ROUND WEIGHT প্রসেসিং

//------------------------------
            // 1. Process WGT and ROUND WEIGHT
            if (columnIndexes.wgt !== -1) {
              const wgtValue = getValue(columnIndexes.wgt);
              if (wgtValue !== '') {
                const num = parseFloat(wgtValue);
                if (!isNaN(num)) {
                  newRow[columnIndexes.roundWeight] = Math.ceil(num).toString();
                }
              }
            }

            const companyName = columnIndexes.companyName !== -1 ? 
              getValue(columnIndexes.companyName).toUpperCase() : '';
            const roundWeightStr = columnIndexes.roundWeight !== -1 ? 
              getValue(columnIndexes.roundWeight) : '0';
            const roundWeight = parseFloat(roundWeightStr) || 0;
            const area = columnIndexes.area !== -1 ? 
              getValue(columnIndexes.area).toUpperCase() : '';

            // MONTEX APPARELS LTD Company Rule
           // MONTEX APPARELS LTD Company Rule - High Priority
if (
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('MONTEXAPPARELS') || 
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('MONTEXAPPAREL')
) {
  // Calculate custom value (1kg=800, +500 per additional kg)
  const customValue = roundWeight === 1 ? 800 : 800 + (roundWeight - 1) * 500;
  
  // Set CUSTOM and TOTAL values
  if (columnIndexes.custom !== -1) {
    newRow[columnIndexes.custom] = customValue.toString();
    console.log(`MONTEX APPARELS: Set CUSTOM to ${customValue} for weight ${roundWeight}`);
  }
  if (columnIndexes.total !== -1) {
    newRow[columnIndexes.total] = customValue.toString();
    console.log(`MONTEX APPARELS: Set TOTAL to ${customValue} for weight ${roundWeight}`);
  }
  
  // Set VOLUME WEIGHT to PASSBOOK
  if (columnIndexes.volumeWeight !== -1) {
    newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
    console.log('MONTEX APPARELS: Set VOLUME WEIGHT to PASSBOOK');
  }
  
  // Skip other conditions
  return newRow;
}



            // 2. Process COMPANY NAME specific rules..........................
            // HRISHATEX Company Rule
           // HRISHATEX/HRISHA TEX Company Rule - High Priority
if (
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('HRISHATEX') || 
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('HRISHATEX')
) {
  // Calculate custom value
  const customValue = roundWeight === 1 ? 700 : 700 + (roundWeight - 1) * 500;
  
  // Set CUSTOM and TOTAL values
  if (columnIndexes.custom !== -1) {
    newRow[columnIndexes.custom] = customValue.toString();
    console.log(`HRISHATEX: Set CUSTOM to ${customValue} for weight ${roundWeight}`);
  }
  if (columnIndexes.total !== -1) {
    newRow[columnIndexes.total] = customValue.toString();
    console.log(`HRISHATEX: Set TOTAL to ${customValue} for weight ${roundWeight}`);
  }
  
  // Set VOLUME WEIGHT to PASSBOOK
  if (columnIndexes.volumeWeight !== -1) {
    newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
    console.log('HRISHATEX: Set VOLUME WEIGHT to PASSBOOK');
  }
  
  // Skip other conditions
  return newRow;
}




//.....................................ok






           // WORLD YE APPARELS Company Rule - Higher priority
// WORLD YE APPARELS Company Rule - High Priority
if (
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('WORLDYEAPPARELS') || 
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('WORLDYEAPPAREL')
) {
  // Calculate custom value
  const customValue = roundWeight === 1 ? 1000 : 1000 + (roundWeight - 1) * 500;
  
  // Set CUSTOM and TOTAL values
  if (columnIndexes.custom !== -1) {
    newRow[columnIndexes.custom] = customValue.toString();
    console.log(`WORLD YE APPARELS: Set CUSTOM to ${customValue} for weight ${roundWeight}`);
  }
  if (columnIndexes.total !== -1) {
    newRow[columnIndexes.total] = customValue.toString();
    console.log(`WORLD YE APPARELS: Set TOTAL to ${customValue} for weight ${roundWeight}`);
  }
  
  // Set VOLUME WEIGHT to PASSBOOK
  if (columnIndexes.volumeWeight !== -1) {
    newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
    console.log('WORLD YE APPARELS: Set VOLUME WEIGHT to PASSBOOK');
  }
  
  // Skip other conditions
  return newRow;
}



//............................................ok








            // TIMEX INC Company Rule
           // TIMEX INC Company Rule - High Priority
// TIMEX INC Company Rule - High Priority
if (
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('TIMEXINC') || 
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('TIMEX')
) {
  // Calculate custom value (1kg=1000, +800 per additional kg)
  const customValue = roundWeight === 1 ? 600 : 600 + (roundWeight - 1) * 500;
  
  // Set CUSTOM and TOTAL values
  if (columnIndexes.custom !== -1) {
    newRow[columnIndexes.custom] = customValue.toString();
    console.log(`TIMEX INC: Set CUSTOM to ${customValue} for weight ${roundWeight}`);
  }
  if (columnIndexes.total !== -1) {
    newRow[columnIndexes.total] = customValue.toString();
    console.log(`TIMEX INC: Set TOTAL to ${customValue} for weight ${roundWeight}`);
  }
  
  // Set VOLUME WEIGHT to PASSBOOK
  if (columnIndexes.volumeWeight !== -1) {
    newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
    console.log('TIMEX INC: Set VOLUME WEIGHT to PASSBOOK');
  }
  
  // Skip other conditions
  return newRow;
}


//..................................



            // MODISTE(BANGLADESH)LIMITED Company Rule
            // MODISTE(BANGLADESH)LIMITED Company Rule - High Priority
// MODISTE(BANGLADESH)LIMITED Company Rule - High Priority
if (
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('MODISTEBANGLADESH') || 
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('MODISTEBD')
) {
  // Calculate custom value (1kg=950, +750 per additional kg)
  const customValue = roundWeight === 1 ? 700 : 700 + (roundWeight - 1) * 400;
  
  // Set CUSTOM and TOTAL values
  if (columnIndexes.custom !== -1) {
    newRow[columnIndexes.custom] = customValue.toString();
    console.log(`MODISTE BD: Set CUSTOM to ${customValue} for weight ${roundWeight}`);
  }
  if (columnIndexes.total !== -1) {
    newRow[columnIndexes.total] = customValue.toString();
    console.log(`MODISTE BD: Set TOTAL to ${customValue} for weight ${roundWeight}`);
  }
  
  // Set VOLUME WEIGHT to PASSBOOK
  if (columnIndexes.volumeWeight !== -1) {
    newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
    console.log('MODISTE BD: Set VOLUME WEIGHT to PASSBOOK');
  }
  
  // Skip other conditions
  return newRow;
}

//............................



            // COMTEXTILE HK LTD Company Rule
            // COMTEXTILE HK LTD Company Rule - High Priority
// COMTEXTILE HK LTD Company Rule - High Priority
if (
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('COMTEXTILEHK') || 
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('COMTEXTILEHONGKONG')
) {
  // Calculate custom value (1kg=850, +650 per additional kg)
  const customValue = roundWeight === 1 ? 800 : 800 + (roundWeight - 1) * 500;
  
  // Set CUSTOM and TOTAL values
  if (columnIndexes.custom !== -1) {
    newRow[columnIndexes.custom] = customValue.toString();
    console.log(`COMTEXTILE HK: Set CUSTOM to ${customValue} for weight ${roundWeight}`);
  }
  if (columnIndexes.total !== -1) {
    newRow[columnIndexes.total] = customValue.toString();
    console.log(`COMTEXTILE HK: Set TOTAL to ${customValue} for weight ${roundWeight}`);
  }
  
  // Set VOLUME WEIGHT to PASSBOOK
  if (columnIndexes.volumeWeight !== -1) {
    newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
    console.log('COMTEXTILE HK: Set VOLUME WEIGHT to PASSBOOK');
  }
  
  // Skip other conditions
  return newRow;
}



            // JM TEX Company Rule
           // JM TEX Company Rule - High Priority
// JM TEX Company Rule - High Priority

if (
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('JMTEX') || 
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('JMTEXTILE')
) {
  // Calculate custom value (1kg=900, +700 per additional kg)
  const customValue = roundWeight === 1 ? 600 : 600 + (roundWeight - 1) * 500;
  
  // Set CUSTOM and TOTAL values
  if (columnIndexes.custom !== -1) {
    newRow[columnIndexes.custom] = customValue.toString();
    console.log(`JM TEX: Set CUSTOM to ${customValue} for weight ${roundWeight}`);
  }
  if (columnIndexes.total !== -1) {
    newRow[columnIndexes.total] = customValue.toString();
    console.log(`JM TEX: Set TOTAL to ${customValue} for weight ${roundWeight}`);
  }
  
  // Set VOLUME WEIGHT to PASSBOOK
  if (columnIndexes.volumeWeight !== -1) {
    newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
    console.log('JM TEX: Set VOLUME WEIGHT to PASSBOOK');
  }
  
  // Skip other conditions
  return newRow;
}

            // KAY GARMENTS LIMITED Company Rule
// KAY GARMENTS Company Rule - Updated and Prioritized
// KAY GARMENTS LIMITED Company Rule - High Priority
if (
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('KAYGARMENTS') || 
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('KAYGARMENT')
) {
  // Calculate custom value (1kg=750, +550 per additional kg)
  const customValue = roundWeight === 1 ? 700 : 700 + (roundWeight - 1) * 500;
  
  // Set CUSTOM and TOTAL values
  if (columnIndexes.custom !== -1) {
    newRow[columnIndexes.custom] = customValue.toString();
    console.log(`KAY GARMENTS: Set CUSTOM to ${customValue} for weight ${roundWeight}`);
  }
  if (columnIndexes.total !== -1) {
    newRow[columnIndexes.total] = customValue.toString();
    console.log(`KAY GARMENTS: Set TOTAL to ${customValue} for weight ${roundWeight}`);
  }
  
  // Set VOLUME WEIGHT to PASSBOOK
  if (columnIndexes.volumeWeight !== -1) {
    newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
    console.log('KAY GARMENTS: Set VOLUME WEIGHT to PASSBOOK');
  }
  
  // Skip other conditions
  return newRow;
}
  


            // AL YUSRA TEXTILES LTD Company Rule
            // AL YUSRA TEXTILES LTD Company Rule - High Priority
if (
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('ALYUSRATEXTILES') || 
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('ALYUSRATEXTILE')
) {
  // Calculate custom value
  const customValue = roundWeight === 1 ? 800 : 800 + (roundWeight - 1) * 500;
  
  // Set CUSTOM and TOTAL values
  if (columnIndexes.custom !== -1) {
    newRow[columnIndexes.custom] = customValue.toString();
    console.log(`AL YUSRA TEXTILES: Set CUSTOM to ${customValue} for weight ${roundWeight}`);
  }
  if (columnIndexes.total !== -1) {
    newRow[columnIndexes.total] = customValue.toString();
    console.log(`AL YUSRA TEXTILES: Set TOTAL to ${customValue} for weight ${roundWeight}`);
  }
  
  // Set VOLUME WEIGHT to PASSBOOK
  if (columnIndexes.volumeWeight !== -1) {
    newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
    console.log('AL YUSRA TEXTILES: Set VOLUME WEIGHT to PASSBOOK');
  }
  
  // Skip other conditions
  return newRow;
}
            // MODERN POLY INDUSTRIES LIMITED Company Rule
            // MODERN POLY INDUSTRIES Company Rule
// MODERN POLY INDUSTRIES Company Rule with Enhanced Features
else if (
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('MODERNPOLYINDUSTRIES') || 
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('MODERNPOLY')
) {
  // Basic Calculation: ROUND WEIGHT × 800
  const customValue = roundWeight * 800;
  
  // Set CUSTOM and TOTAL values
  newRow[columnIndexes.custom] = customValue.toString();
  newRow[columnIndexes.total] = customValue.toString();
  console.log(`MODERN POLY INDUSTRIES: Set CUSTOM/TOTAL to ${customValue} for weight ${roundWeight}`);
  
  // Special Features
  if (columnIndexes.volumeWeight !== -1) {
    newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
    console.log('MODERN POLY INDUSTRIES: Set VOLUME WEIGHT to PASSBOOK');
  }
  
  return newRow;
}


//.......................
            // - Company Rule
            // NATIONAL ACCESSORIES Company Rule
// NATIONAL ACCESSORIES Company Rule with Special Features
// NATIONAL ACCESSORIES LTD Company Rule with Enhanced Features
else if (
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('NATIONALACCESSORIES') || 
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('NATIONALACCESSORY')
) {
  // Basic Calculation: ROUND WEIGHT × 500
  const customValue = roundWeight * 500;
  
  // Set CUSTOM and TOTAL values
  newRow[columnIndexes.custom] = customValue.toString();
  newRow[columnIndexes.total] = customValue.toString();
  console.log(`NATIONAL ACCESSORIES: Set CUSTOM/TOTAL to ${customValue} for weight ${roundWeight}`);
  
  // Special Features
  if (columnIndexes.volumeWeight !== -1) {
    newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
    console.log('NATIONAL ACCESSORIES: Set VOLUME WEIGHT to PASSBOOK');
  }
  
  return newRow;
}
  
  
  
  
////....................

            // DIVINE INTIMATES LTD Company Rule
            // DIVINE INTIMATES Company Rule
// DIVINE INTIMATES Company Rule with Enhanced Features
else if (
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('DIVINEINTIMATES') || 
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('DIVINEINTIMATE')
) {
  // Basic Calculation: ROUND WEIGHT × 500
  const customValue = roundWeight * 500;
  
  // Set CUSTOM and TOTAL values
  newRow[columnIndexes.custom] = customValue.toString();
  newRow[columnIndexes.total] = customValue.toString();
  console.log(`DIVINE INTIMATES: Set CUSTOM/TOTAL to ${customValue} for weight ${roundWeight}`);
  
  // Special Features
  if (columnIndexes.volumeWeight !== -1) {
    newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
    console.log('DIVINE INTIMATES: Set VOLUME WEIGHT to PASSBOOK');
  }
  
  

  
  return newRow;
}


//...............


            // RAOZAN SWEATER LIMITED Company Rule
            // RAOZAN SWEATER Company Rule
// RAOZAN SWEATER Company Rule with Enhanced Features
else if (
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('RAOZANSWEATER') || 
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('RAOZANSWEATERS')
) {
  // Basic Calculation: ROUND WEIGHT × 600
  const customValue = roundWeight * 600;
  
  // Set CUSTOM and TOTAL values
  newRow[columnIndexes.custom] = customValue.toString();
  newRow[columnIndexes.total] = customValue.toString();
  console.log(`RAOZAN SWEATER: Set CUSTOM/TOTAL to ${customValue} for weight ${roundWeight}`);
  
  // Special Features
  if (columnIndexes.volumeWeight !== -1) {
    newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
    console.log('RAOZAN SWEATER: Set VOLUME WEIGHT to PASSBOOK');
  }
  
  return newRow;
}


//........................................
            // FARKANTEX LTD Company Rule
            // FARKANTEX/FARKAN TEX Company Rule
// FARKANTEX Company Rule with Enhanced Features
else if (
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('FARKANTEX') || 
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('FARKANTEXTILE')
) {
  // Basic Calculation: ROUND WEIGHT × 500
  const customValue = roundWeight * 500;
  
  // Set CUSTOM and TOTAL values
  newRow[columnIndexes.custom] = customValue.toString();
  newRow[columnIndexes.total] = customValue.toString();
  console.log(`FARKANTEX: Set CUSTOM/TOTAL to ${customValue} for weight ${roundWeight}`);
  
  // Special Features
  if (columnIndexes.volumeWeight !== -1) {
    newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
    console.log('FARKANTEX: Set VOLUME WEIGHT to PASSBOOK');
  }
  
  return newRow;
}


            // BLUE SKY Company Rules...................
            // BLUE SKY Company Rules with Flexible Name Matching
else if (
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('BLUESKY') || 
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('BLUESKIES')
) {
  // Set VOLUME WEIGHT
  if (columnIndexes.volumeWeight !== -1) {
    newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
    console.log('BLUE SKY: Set VOLUME WEIGHT to PASSBOOK');
  }

  // Weight-based pricing
  if (roundWeight === 1) {
    newRow[columnIndexes.custom] = '800';
    newRow[columnIndexes.total] = '800';
    console.log('BLUE SKY: Set CUSTOM/TOTAL to 800 for 1kg');
  } else if (roundWeight === 2) {
    newRow[columnIndexes.custom] = '1200';
    newRow[columnIndexes.total] = '1200';
    console.log('BLUE SKY: Set CUSTOM/TOTAL to 1200 for 2kg');
  } else if (roundWeight >= 3 && roundWeight <= 10) {
    newRow[columnIndexes.custom] = '1500';
    newRow[columnIndexes.total] = '1500';
    console.log(`BLUE SKY: Set CUSTOM/TOTAL to 1500 for ${roundWeight}kg (3-10kg range)`);
  } else if (roundWeight >= 11 && roundWeight <= 25) {
    newRow[columnIndexes.custom] = '2000';
    newRow[columnIndexes.total] = '2000';
    console.log(`BLUE SKY: Set CUSTOM/TOTAL to 2000 for ${roundWeight}kg (11-25kg range)`);
  } else if (roundWeight >= 26 && roundWeight <= 35) {
    newRow[columnIndexes.custom] = '2500';
    newRow[columnIndexes.total] = '2500';
    console.log(`BLUE SKY: Set CUSTOM/TOTAL to 2500 for ${roundWeight}kg (26-35kg range)`);
  } else if (roundWeight >= 36 && roundWeight <= 60) {
    newRow[columnIndexes.custom] = '3000';
    newRow[columnIndexes.total] = '3000';
    console.log(`BLUE SKY: Set CUSTOM/TOTAL to 3000 for ${roundWeight}kg (36-60kg range)`);
  } else if (roundWeight >= 61 && roundWeight <= 500) {
    newRow[columnIndexes.custom] = 'PLEASE CONTACT';
    newRow[columnIndexes.total] = 'PLEASE CONTACT';
    console.log(`BLUE SKY: Requires contact for ${roundWeight}kg (61-500kg range)`);
  }
}


            // FOUR H FASHION Company Rule
            // FOUR H FASHION Company Rule with Enhanced Features
else if (
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('FOURHFASHION') || 
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('4HFASHION')
) {
  // Basic Calculation: ROUND WEIGHT × 500
  const customValue = roundWeight * 500;
  
  // Set CUSTOM and TOTAL values
  newRow[columnIndexes.custom] = customValue.toString();
  newRow[columnIndexes.total] = customValue.toString();
  console.log(`FOUR H FASHION: Set CUSTOM/TOTAL to ${customValue} for weight ${roundWeight}`);
  
  // Special Features
  if (columnIndexes.volumeWeight !== -1) {
    newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
    console.log('FOUR H FASHION: Set VOLUME WEIGHT to PASSBOOK');
  }
  
  return newRow;
}



            // CHILDREN PLACE LTD Company Rules
            // CHILDREN PLACE LTD Company Rules with Flexible Name Matching
else if (
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('CHILDRENPLACE') ||
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('CHILDRENSPLACE') ||
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('CHILDPLACE')
) {
  // Set VOLUME WEIGHT (if column exists)
  if (columnIndexes.volumeWeight !== -1) {
    newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
    console.log('CHILDREN PLACE: Set VOLUME WEIGHT to PASSBOOK');
  }

  // Weight-based pricing with original values
  if (roundWeight === 1) {
    newRow[columnIndexes.custom] = '700';
    newRow[columnIndexes.total] = '700';
    console.log('CHILDREN PLACE: Set CUSTOM/TOTAL to 700 for 1kg');
  } else if (roundWeight === 2) {
    newRow[columnIndexes.custom] = '1200';
    newRow[columnIndexes.total] = '1200';
    console.log('CHILDREN PLACE: Set CUSTOM/TOTAL to 1200 for 2kg');
  } else if (roundWeight >= 3 && roundWeight <= 5) {
    newRow[columnIndexes.custom] = '1500';
    newRow[columnIndexes.total] = '1500';
    console.log(`CHILDREN PLACE: Set CUSTOM/TOTAL to 1500 for ${roundWeight}kg (3-5kg range)`);
  } else if (roundWeight >= 6 && roundWeight <= 10) {
    newRow[columnIndexes.custom] = '2000';
    newRow[columnIndexes.total] = '2000';
    console.log(`CHILDREN PLACE: Set CUSTOM/TOTAL to 2000 for ${roundWeight}kg (6-10kg range)`);
  } else if (roundWeight >= 11 && roundWeight <= 15) {
    newRow[columnIndexes.custom] = '2500';
    newRow[columnIndexes.total] = '2500';
    console.log(`CHILDREN PLACE: Set CUSTOM/TOTAL to 2500 for ${roundWeight}kg (11-15kg range)`);
  } else if (roundWeight >= 17 && roundWeight <= 40) {
    newRow[columnIndexes.custom] = '3000';
    newRow[columnIndexes.total] = '3000';
    console.log(`CHILDREN PLACE: Set CUSTOM/TOTAL to 3000 for ${roundWeight}kg (17-40kg range)`);
  }else if (roundWeight >= 41 && roundWeight <= 500) {
    newRow[columnIndexes.custom] = 'PLEASE CONTACT';
    newRow[columnIndexes.total] = 'PLEASE CONTACT';
    console.log(`CHILDREN PLACE: Requires contact for ${roundWeight}kg (41-500kg range)`);
  }
}


            
            // MOSTAFA GARMENTS Company Rules
            // MOSTAFA GARMENTS Company Rules with Flexible Name Matching
else if (
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('MOSTAFAGARMENTS') ||
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('MOSTAFAGARMENT') ||
  companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('MUSTAFAGARMENTS')
) {
  // Set VOLUME WEIGHT (if column exists)
  if (columnIndexes.volumeWeight !== -1) {
    newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
    console.log('MOSTAFA GARMENTS: Set VOLUME WEIGHT to PASSBOOK');
  }

  // Weight-based pricing with original values
  if (roundWeight === 1) {
    newRow[columnIndexes.custom] = '800';
    newRow[columnIndexes.total] = '800';
    console.log('MOSTAFA GARMENTS: Set CUSTOM/TOTAL to 800 for 1kg');
  } else if (roundWeight === 2) {
    newRow[columnIndexes.custom] = '1200';
    newRow[columnIndexes.total] = '1200';
    console.log('MOSTAFA GARMENTS: Set CUSTOM/TOTAL to 1200 for 2kg');
  } else if (roundWeight >= 3 && roundWeight <= 5) {
    newRow[columnIndexes.custom] = '1500';
    newRow[columnIndexes.total] = '1500';
    console.log(`MOSTAFA GARMENTS: Set CUSTOM/TOTAL to 1500 for ${roundWeight}kg (3-5kg range)`);
  } else if (roundWeight >= 6 && roundWeight <= 10) {
    newRow[columnIndexes.custom] = '1800';
    newRow[columnIndexes.total] = '1800';
    console.log(`MOSTAFA GARMENTS: Set CUSTOM/TOTAL to 1800 for ${roundWeight}kg (6-10kg range)`);
  } else if (roundWeight >= 11 && roundWeight <= 25) {
    newRow[columnIndexes.custom] = '2000';
    newRow[columnIndexes.total] = '2000';
    console.log(`MOSTAFA GARMENTS: Set CUSTOM/TOTAL to 2000 for ${roundWeight}kg (11-25kg range)`);
  } else if (roundWeight >= 26 && roundWeight <= 35) {
    newRow[columnIndexes.custom] = '2500';
    newRow[columnIndexes.total] = '2500';
    console.log(`MOSTAFA GARMENTS: Set CUSTOM/TOTAL to 2500 for ${roundWeight}kg (26-35kg range)`);
  } else if (roundWeight >= 36 && roundWeight <= 50) {
    newRow[columnIndexes.custom] = '3000';
    newRow[columnIndexes.total] = '3000';
    console.log(`MOSTAFA GARMENTS: Set CUSTOM/TOTAL to 3000 for ${roundWeight}kg (36-50kg range)`);
  } else if (roundWeight >= 51 && roundWeight <= 500) {
    newRow[columnIndexes.custom] = '5000';
    newRow[columnIndexes.total] = '5000';
    console.log(`MOSTAFA GARMENTS: Set CUSTOM/TOTAL to 5000 for ${roundWeight}kg (51-500kg range)`);
  }
}

//============================//
            // AREA based rules (BANGLADESH and CTG)
            else if (area === 'BANGLADESH' || area === 'CTG') {
              if (roundWeight === 1) {
                newRow[columnIndexes.custom] = '500';
                newRow[columnIndexes.total] = '500';
              } else {
                const multiplier = area === 'BANGLADESH' ? 350 : 400;
                const customValue = roundWeight * multiplier;
                newRow[columnIndexes.custom] = customValue.toString();
                newRow[columnIndexes.total] = customValue.toString();
              }
            }

            // 3. Process VOLUME WEIGHT (RO) and TYPE OF PAYMENT (USD)
   

  // কলাম ইনডেক্স খুঁজুন
  
            // 4. Process DELIVERY ITEM and PAID DATE
          if (columnIndexes.deliveryItem !== -1 && columnIndexes.paidDate !== -1) {
  const deliveryItem = getValue(columnIndexes.deliveryItem).toUpperCase().trim();
  const paymentType = columnIndexes.typeOfPayment !== -1 
    ? getValue(columnIndexes.typeOfPayment).toUpperCase().trim() 
    : '';
  
  const specialItems = ['CO MAIL', 'DOC', 'P'];
  
  if (specialItems.includes(deliveryItem) || 
      (paymentType === 'DUTY' && deliveryItem === 'SPX')) {
    
    // Clear specified columns
    const columnsToClear = [
      
      
      'freightCostBDT', 
      'custom', 
      'total'
    ];
    
    columnsToClear.forEach(col => {
      if (columnIndexes[col] !== -1) {
        newRow[columnIndexes[col]] = '';
        console.log(`${col.toUpperCase()} cleared`);
      }
    });
    
    // Set PAID DATE to N/A
    newRow[columnIndexes.paidDate] = 'N/A';
    console.log('PAID DATE set to N/A');
    
    console.log(`Processed special case for ${deliveryItem}`);
  }
}

            // 5. Process AREA and REMARKS
            if (columnIndexes.area !== -1 && columnIndexes.remarks !== -1) {
              const areaValue = getValue(columnIndexes.area).toUpperCase();
              if (areaValue === 'CTG') {
                newRow[columnIndexes.remarks] = 'CTG';
              }
            }

            // 6. Process DOLLER RATE and FR. COST(TK)
            if (columnIndexes.dollarRate !== -1 && 
                columnIndexes.frCostDollar !== -1 && 
                columnIndexes.frCostTk !== -1) {
              
              const dollarRateStr = getValue(columnIndexes.dollarRate).replace(/,/g, '');
              const frCostDollarStr = getValue(columnIndexes.frCostDollar).replace(/[^\d.]/g, '');
              
              const dollarRate = parseFloat(dollarRateStr);
              const frCostDollar = parseFloat(frCostDollarStr);

              if (!isNaN(dollarRate) && !isNaN(frCostDollar) && frCostDollarStr !== '') {
                const frCostTk = (dollarRate * frCostDollar).toFixed(2);
                newRow[columnIndexes.frCostTk] = frCostTk;
              }
            }



            // Check if VOLUME WEIGHT contains DESTROY/MAIL
// VOLUME WEIGHT কলামে DESTROY/MAIL আছে কিনা চেক করার জন্য
if (columnIndexes.volumeWeight !== -1 && 
    newRow[columnIndexes.volumeWeight].toString().includes('DESTROY/MAIL')) {
  
  // ROUND WEIGHT ফাকা করবো
  if (columnIndexes.roundWeight !== -1) {
    newRow[columnIndexes.roundWeight] = '';
    console.log('ROUND WEIGHT cleared');
  }
  
  
  
  // CUSTOM ফাকা করবো
  if (columnIndexes.custom !== -1) {
    newRow[columnIndexes.custom] = '';
    console.log('CUSTOM cleared');
  }
  
  // TOTAL ফাকা করবো
  if (columnIndexes.total !== -1) {
    newRow[columnIndexes.total] = '';
    console.log('TOTAL cleared');
  }
  
  // PAID DATE এ N/A সেট করবো
  if (columnIndexes.paidDate !== -1) {
    newRow[columnIndexes.paidDate] = 'N/A';
    console.log('PAID DATE set to N/A');
  }
  
  console.log('DESTROY/MAIL case processed successfully');
}
//=====================
//======================
//====================
//
            // 7. Process COMPANY NAME and REMARKS
            if (columnIndexes.companyName !== -1 && columnIndexes.remarks !== -1) {
              const existingRemarks = getValue(columnIndexes.remarks).toUpperCase();
              if (existingRemarks !== 'CTG') {
                const companyName = getValue(columnIndexes.companyName).toUpperCase();
                
                if (dmCompanies.some(dmComp => companyName.includes(dmComp))) {
                  newRow[columnIndexes.remarks] = 'DAILY & MONTHLY';
                } 
                else if (mCompanies.some(mComp => companyName.includes(mComp))) {
                  newRow[columnIndexes.remarks] = 'MONTHLY';
                } 
                else {
                  newRow[columnIndexes.remarks] = 'DAILY';
                }
              }
            }

            return newRow;
          });

          setHeaders(processedHeaders);
          setExcelData(processedData);
          
          localStorage.setItem('excelData', JSON.stringify(processedData));
          localStorage.setItem('excelHeaders', JSON.stringify(processedHeaders));
          localStorage.setItem('excelFileName', file.name);
        }
      } catch (error) {
        console.error("Error processing file:", error);
        setError('Error processing file. Please try a different file.');
      }
    };

    reader.onerror = () => {
      setError('Error reading file. Please try again.');
    };

    reader.readAsArrayBuffer(file);
  };

  const clearData = () => {
    if (window.confirm('Are you sure you want to clear all data?')) {
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
    XLSX.writeFile(wb, `processed_data_${new Date().toISOString().slice(0,10)}.xlsx`);
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
      <h2>বিল প্রসেসর</h2>
      
      <div className="upload-section">
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileUpload}
          className="file-input"
          id="excelFileInput"
        />
        <label htmlFor="excelFileInput" className="upload-button">
          এক্সেল ফাইল আপলোড করুন
        </label>
        
        {fileName && (
          <div className="file-actions">
            <span className="file-name">{fileName}</span>
            <button onClick={downloadData} className="action-button download">
              ডাউনলোড করুন
            </button>
            <button onClick={clearData} className="action-button clear">
              মুছে ফেলুন
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
                      {header || `Column ${index + 1}`}
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
            Total Rows: {excelData.length} | Total Columns: {headers.length}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <p>No data found. Please upload an Excel file.</p>
        </div>
      )}
    </div>
  );
};

export default ExcelProcessor;