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

  // M Companies list with pricing rules
  const mCompanies = {
    // Default rule for most companies
    'DEFAULT': {
      firstKg: 500,
      additionalKg: 400
    },
    // Special cases
    'A & A SOURCING': { allOver: 400 },
    'AA SOURCING': { allOver: 400 },
    'AMIA/JIANGSU GUOTAI/BD OFFICE/RUPAN': { firstKg: 500, additionalKg: 400 },
    'BANGLA TEX/FABRIC EXPRESS/ULLASH/AWAL/BENOJIR': { firstKg: 500, additionalKg: 400 },
    'BARAKAH GLOBAL': { firstKg: 500, additionalKg: 400 },
    'CHINA RESOURCE TEXTILE': { firstKg: 500, additionalKg: 400 },
    'CHINA RESOURCE INT\'L': { firstKg: 500, additionalKg: 400 },
    'CHUNQIN TRADE': { firstKg: 500, additionalKg: 400 },
    'COMTEXTILE/ONLY DHAKA': { firstKg: 500, additionalKg: 400 },
    'CORPORATE FIELD': { 
      tiers: [
        { min: 1, max: 5, rate: 450 },
        { min: 5, max: 10, rate: 430 },
        { min: 10, max: 15, rate: 410 },
        { min: 15, max: 20, rate: 380 }
      ] 
    },
    'CLOTHING PARK LTD': { allOver: 500 },
    'D & Z/DZ TEXTILE COMPANY LTD': { firstKg: 500, additionalKg: 400 },
    'OVI TEXTILE': { firstKg: 500, additionalKg: 400 },
    'DVC/BANGLADESH LIAISON OFFICE': { 
      smallRange: { min: 1, max: 3, fixed: 2000 },
      additionalRate: 600 
    },
    'DMI/AMIT/SAMIR/DAMODER MENON INTL/UNIVERSAL EXPREE': { allOver: 500 },
    'GATEWAY NEXT LIMITED': { allOver: 500 },
    'EMON FASHION': { firstKg: 500, additionalKg: 400 },
    'EVERBEST FABRIC': { allOver: 400, over10Kg: 350 },
    'EURO BANGLA/CAPITAL POSHAK': { firstKg: 500, additionalKg: 400 },
    'FAIRDEAL FABRICS': { firstKg: 500, additionalKg: 400 },
    'MR HABIBUR': { firstKg: 500, additionalKg: 400 },
    'FOUR SEASON': { allOver: 400 },
    'FA TEX/ROKEY MENTION': { firstKg: 500, additionalKg: 400 },
    'FABRIC MART/HEAD OFFICE': { firstKg: 500, additionalKg: 400 },
    'FABRITEX SOURCES LTD': { firstKg: 500, additionalKg: 400 },
    'FASHION MINE': { firstKg: 500, additionalKg: 400 },
    'FAIYAZ GROUP/APPAREL VILLAGE': { firstKg: 500, additionalKg: 400 },
    'FABRIC WORLD': { 
      smallRange: { min: 1, max: 15, rate: 500 },
      largeRate: 400 
    },
    'NEW FABRIC WORLD': { 
      smallRange: { min: 1, max: 15, rate: 500 },
      largeRate: 400 
    },
    'GLOBAL APPEAREL/KAISER': { firstKg: 500, additionalKg: 400 },
    'GOODLINK ENTERPRISE': { firstKg: 500, additionalKg: 400 },
    'HIGH HOPE INTERNATIONAL': { allOver: 400 },
    'INTIMATES GLOBAL': { firstKg: 500, additionalKg: 400 },
    'IRIS FABRICS': { firstKg: 500, additionalKg: 400 },
    'IRIS DESIGN': { firstKg: 500, additionalKg: 400 },
    'IRIS FASHION': { firstKg: 500, additionalKg: 400 },
    'JINCO INT\'L': { firstKg: 500, additionalKg: 400 },
    'NOVO FREIGHT LOGI STICS': { firstKg: 500, additionalKg: 400 },
    'JIANGSHU TEXTILE': { firstKg: 500, additionalKg: 400 },
    'JSTEX LTD/GMT/GREEN BANGLA/GREEN DESIGINING/SEAROCK APP LTD': { firstKg: 500, additionalKg: 400 },
    'JSTEX BD/LIANXING TEX FABRICS': { firstKg: 500, additionalKg: 400 },
    'JAAN COMPOSITE': { firstKg: 500, additionalKg: 400 },
    'KAZI O TEX': { firstKg: 700, additionalKg: 600 },
    'KRAYONS SOURCING LTD': { firstKg: 500, additionalKg: 300 },
    'LOUIETEX MANUFACTRING LTD': { firstKg: 500, additionalKg: 400 },
    'LAPSAK': { firstKg: 500, additionalKg: 400 },
    'VALIANT CLOTHING LTD': { firstKg: 500, additionalKg: 400 },
    'LIMELIGHT': { allOver: 400 },
    'MAA TRADE': { firstKg: 500, additionalKg: 400 },
    'MAA TEX': { firstKg: 500, additionalKg: 400 },
    'VOLCAN': { firstKg: 500, additionalKg: 400 },
    'MR TEX': { firstKg: 500, additionalKg: 400 },
    'MUTISA CLOTHINGS': { firstKg: 600, additionalKg: 500 },
    'NAFISA': { firstKg: 500, additionalKg: 400 },
    'NORWEST': { firstKg: 500, additionalKg: 300 },
    'KRAYON': { firstKg: 500, additionalKg: 300 },
    'STYLEBERRY LTD': { firstKg: 500, additionalKg: 300 },
    'DESIGN ARC': { firstKg: 500, additionalKg: 300 },
    'POETICGEM': { firstKg: 500, additionalKg: 400 },
    'PDS': { firstKg: 500, additionalKg: 400 },
    'POSH GMT': { firstKg: 500, additionalKg: 400 },
    'PREFACE FASHION': { firstKg: 500, additionalKg: 400 },
    'RBSR': { firstKg: 500, additionalKg: 400 },
    'PQS': { firstKg: 500, additionalKg: 400 },
    'DRESSYTEX SOURCING': { firstKg: 500, additionalKg: 400 },
    'RADIANT FABRICS': { firstKg: 500, additionalKg: 400 },
    'UNITEX TEXTILE BD LIMITED': { firstKg: 500, additionalKg: 400 },
    'SARF TEX LIMITED': { firstKg: 500, additionalKg: 400 },
    'SUNGETEX': { firstKg: 500, additionalKg: 400 },
    'TEXTILE FAIR': { firstKg: 500, additionalKg: 400 },
    'TEX EBO INDUSTRIAL PVT LTD': { firstKg: 500, additionalKg: 400 },
    'TAG INDUTRY': { firstKg: 500, additionalKg: 400 },
    'TEXCESS INT\'L': { firstKg: 500, additionalKg: 400 },
    'RAK TEXTILE': { firstKg: 500, additionalKg: 400 },
    'WORLD UP FASHION': { firstKg: 500, additionalKg: 400 },
    'TEXPERT': { 
      tiers: [
        { min: 1, max: 20, rate: 600 },
        { min: 21, max: 50, rate: 550 },
        { min: 51, max: Infinity, rate: 500 }
      ] 
    },
    'TEXTOWN BANGLADESH LIMITED': { firstKg: 600, additionalKg: 450 },
    'VERTEX WEAR LIMITED': { 
      tiers: [
        { min: 1, max: 5, fixed: 2000 },
        { min: 6, max: 10, fixed: 3000 },
        { min: 11, max: Infinity, rate: 300 }
      ] 
    },
    'DRESS WORLD LIMITED': { 
      tiers: [
        { min: 1, max: 5, fixed: 2000 },
        { min: 6, max: 10, fixed: 3000 },
        { min: 11, max: Infinity, rate: 300 }
      ] 
    },
    'NEO FASHION LIMITED': { 
      tiers: [
        { min: 1, max: 5, fixed: 2000 },
        { min: 6, max: 10, fixed: 3000 },
        { min: 11, max: Infinity, rate: 300 }
      ] 
    },
    'VERTEX UNIVERSAL WEAR': { 
      tiers: [
        { min: 1, max: 5, fixed: 2000 },
        { min: 6, max: 10, fixed: 3000 },
        { min: 11, max: Infinity, rate: 300 }
      ] 
    },
    'UNIPOLE BD': { firstKg: 550, additionalKg: 450 },
    'PINKON': { firstKg: 550, additionalKg: 450 },
    'URIGHT TRADING': { firstKg: 500, additionalKg: 400 },
    'WELLDONE FABRIC': { 
      smallRange: { min: 1, max: 49, rate: 350 },
      largeRate: 330 
    },
    'ZHONGYOU TRADING': { 
      firstKg: 450,
      mediumRange: { min: 2, max: 10, rate: 350 },
      largeRate: 300 
    },
    'ROSE WOOD TRADING': { 
      firstKg: 450,
      mediumRange: { min: 2, max: 10, rate: 350 },
      largeRate: 300 
    },
    'ZIL TEX FASHION': { allOver: 500 },
    'JIANGSU HIGH HOPE CORPORATION': { allOver: 500 },
    'ZHONGXIN TRADING': { firstKg: 500, additionalKg: 400 },
    'THE ROSE WOOD': { firstKg: 500, additionalKg: 400 },
    'ZHONG ZAI INTERNATIONAL COM LTD': { firstKg: 500, additionalKg: 400 },
    'ZINFAB INT': { firstKg: 500, additionalKg: 400 },
    'YZ': { firstKg: 500, additionalKg: 400 },
    'ZANN SOURCING FASHION LTD': { firstKg: 500, additionalKg: 400 }
  };

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

            // Process TYPE OF PAYMENT (USD)
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

            // Process WGT and ROUND WEIGHT
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
            const typeOfPayment = columnIndexes.typeOfPayment !== -1 ? 
              getValue(columnIndexes.typeOfPayment).toUpperCase() : '';
            const deliveryItem = columnIndexes.deliveryItem !== -1 ? 
              getValue(columnIndexes.deliveryItem).toUpperCase() : '';

            // Function to calculate M Company pricing
            const calculateMCompanyPricing = (companyName, weight) => {
              // Find matching company rule
              let matchingRule = null;
              let matchedCompany = '';
              
              // Check for exact matches first
              for (const [key, rule] of Object.entries(mCompanies)) {
                if (companyName.includes(key.toUpperCase())) {
                  matchingRule = rule;
                  matchedCompany = key;
                  break;
                }
              }
              
              // If no exact match found, use default rule
              if (!matchingRule) {
                matchingRule = mCompanies.DEFAULT;
              }
              
              // Calculate based on the rule
              if (matchingRule.allOver) {
                return weight * matchingRule.allOver;
              } 
              else if (matchingRule.firstKg && matchingRule.additionalKg) {
                if (weight === 1) return matchingRule.firstKg;
                return matchingRule.firstKg + (weight - 1) * matchingRule.additionalKg;
              }
              else if (matchingRule.tiers) {
                for (const tier of matchingRule.tiers) {
                  if (weight >= tier.min && weight <= tier.max) {
                    if (tier.fixed) return tier.fixed;
                    return weight * tier.rate;
                  }
                }
              }
              else if (matchingRule.smallRange && matchingRule.largeRate) {
                if (weight >= matchingRule.smallRange.min && weight <= matchingRule.smallRange.max) {
                  return weight * matchingRule.smallRange.rate;
                }
                return weight * matchingRule.largeRate;
              }
              else if (matchingRule.smallRange && matchingRule.additionalRate) {
                if (weight >= matchingRule.smallRange.min && weight <= matchingRule.smallRange.max) {
                  return matchingRule.smallRange.fixed;
                }
                return matchingRule.smallRange.fixed + (weight - matchingRule.smallRange.max) * matchingRule.additionalRate;
              }
              else if (matchingRule.firstKg && matchingRule.mediumRange && matchingRule.largeRate) {
                if (weight === 1) return matchingRule.firstKg;
                if (weight >= matchingRule.mediumRange.min && weight <= matchingRule.mediumRange.max) {
                  return matchingRule.firstKg + (weight - 1) * matchingRule.mediumRange.rate;
                }
                return matchingRule.firstKg + 
                       (matchingRule.mediumRange.max - 1) * matchingRule.mediumRange.rate + 
                       (weight - matchingRule.mediumRange.max) * matchingRule.largeRate;
              }
              
              // Default case if no rule matches
              return weight * 400;
            };

            // M Companies processing - when TYPE OF PAYMENT is PP and DELIVERY ITEM is SPX
            if (typeOfPayment === 'PP' && deliveryItem === 'SPX' && 
                columnIndexes.companyName !== -1 && columnIndexes.roundWeight !== -1) {
              
              // Check if company is in M Companies list
              let isMCompany = false;
              for (const companyPattern of Object.keys(mCompanies)) {
                if (companyName.includes(companyPattern.toUpperCase())) {
                  isMCompany = true;
                  break;
                }
              }
              
              if (isMCompany) {
                const customValue = calculateMCompanyPricing(companyName, roundWeight);
                
                if (columnIndexes.custom !== -1) {
                  newRow[columnIndexes.custom] = customValue.toString();
                }
                if (columnIndexes.total !== -1) {
                  newRow[columnIndexes.total] = customValue.toString();
                }
                
                // Set VOLUME WEIGHT to PASSBOOK
                if (columnIndexes.volumeWeight !== -1) {
                  newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
                }
                
                return newRow;
              }
            }

            // Special company rules (previous implementation)
            // MONTEX APPARELS LTD Company Rule
            if (companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('MONTEXAPPARELS') || 
                companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('MONTEXAPPAREL')) {
              const customValue = roundWeight === 1 ? 800 : 800 + (roundWeight - 1) * 500;
              
              if (columnIndexes.custom !== -1) {
                newRow[columnIndexes.custom] = customValue.toString();
              }
              if (columnIndexes.total !== -1) {
                newRow[columnIndexes.total] = customValue.toString();
              }
              if (columnIndexes.volumeWeight !== -1) {
                newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
              }
              return newRow;
            }

            // HRISHATEX Company Rule
            if (companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('HRISHATEX')) {
              const customValue = roundWeight === 1 ? 700 : 700 + (roundWeight - 1) * 500;
              
              if (columnIndexes.custom !== -1) {
                newRow[columnIndexes.custom] = customValue.toString();
              }
              if (columnIndexes.total !== -1) {
                newRow[columnIndexes.total] = customValue.toString();
              }
              if (columnIndexes.volumeWeight !== -1) {
                newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
              }
              return newRow;
            }

            // WORLD YE APPARELS Company Rule
            if (companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('WORLDYEAPPARELS') || 
                companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('WORLDYEAPPAREL')) {
              const customValue = roundWeight === 1 ? 1000 : 1000 + (roundWeight - 1) * 500;
              
              if (columnIndexes.custom !== -1) {
                newRow[columnIndexes.custom] = customValue.toString();
              }
              if (columnIndexes.total !== -1) {
                newRow[columnIndexes.total] = customValue.toString();
              }
              if (columnIndexes.volumeWeight !== -1) {
                newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
              }
              return newRow;
            }

            // TIMEX INC Company Rule
            if (companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('TIMEXINC') || 
                companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('TIMEX')) {
              const customValue = roundWeight === 1 ? 600 : 600 + (roundWeight - 1) * 500;
              
              if (columnIndexes.custom !== -1) {
                newRow[columnIndexes.custom] = customValue.toString();
              }
              if (columnIndexes.total !== -1) {
                newRow[columnIndexes.total] = customValue.toString();
              }
              if (columnIndexes.volumeWeight !== -1) {
                newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
              }
              return newRow;
            }

            // MODISTE(BANGLADESH)LIMITED Company Rule
            if (companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('MODISTEBANGLADESH') || 
                companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('MODISTEBD')) {
              const customValue = roundWeight === 1 ? 700 : 700 + (roundWeight - 1) * 400;
              
              if (columnIndexes.custom !== -1) {
                newRow[columnIndexes.custom] = customValue.toString();
              }
              if (columnIndexes.total !== -1) {
                newRow[columnIndexes.total] = customValue.toString();
              }
              if (columnIndexes.volumeWeight !== -1) {
                newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
              }
              return newRow;
            }

            // COMTEXTILE HK LTD Company Rule
            if (companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('COMTEXTILEHK') || 
                companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('COMTEXTILEHONGKONG')) {
              const customValue = roundWeight === 1 ? 800 : 800 + (roundWeight - 1) * 500;
              
              if (columnIndexes.custom !== -1) {
                newRow[columnIndexes.custom] = customValue.toString();
              }
              if (columnIndexes.total !== -1) {
                newRow[columnIndexes.total] = customValue.toString();
              }
              if (columnIndexes.volumeWeight !== -1) {
                newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
              }
              return newRow;
            }

            // JM TEX Company Rule
            if (companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('JMTEX') || 
                companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('JMTEXTILE')) {
              const customValue = roundWeight === 1 ? 600 : 600 + (roundWeight - 1) * 500;
              
              if (columnIndexes.custom !== -1) {
                newRow[columnIndexes.custom] = customValue.toString();
              }
              if (columnIndexes.total !== -1) {
                newRow[columnIndexes.total] = customValue.toString();
              }
              if (columnIndexes.volumeWeight !== -1) {
                newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
              }
              return newRow;
            }

            // KAY GARMENTS LIMITED Company Rule
            if (companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('KAYGARMENTS') || 
                companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('KAYGARMENT')) {
              const customValue = roundWeight === 1 ? 700 : 700 + (roundWeight - 1) * 500;
              
              if (columnIndexes.custom !== -1) {
                newRow[columnIndexes.custom] = customValue.toString();
              }
              if (columnIndexes.total !== -1) {
                newRow[columnIndexes.total] = customValue.toString();
              }
              if (columnIndexes.volumeWeight !== -1) {
                newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
              }
              return newRow;
            }

            // AL YUSRA TEXTILES LTD Company Rule
            if (companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('ALYUSRATEXTILES') || 
                companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('ALYUSRATEXTILE')) {
              const customValue = roundWeight === 1 ? 800 : 800 + (roundWeight - 1) * 500;
              
              if (columnIndexes.custom !== -1) {
                newRow[columnIndexes.custom] = customValue.toString();
              }
              if (columnIndexes.total !== -1) {
                newRow[columnIndexes.total] = customValue.toString();
              }
              if (columnIndexes.volumeWeight !== -1) {
                newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
              }
              return newRow;
            }

            // MODERN POLY INDUSTRIES LIMITED Company Rule
            if (companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('MODERNPOLYINDUSTRIES') || 
                companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('MODERNPOLY')) {
              const customValue = roundWeight * 800;
              
              if (columnIndexes.custom !== -1) {
                newRow[columnIndexes.custom] = customValue.toString();
              }
              if (columnIndexes.total !== -1) {
                newRow[columnIndexes.total] = customValue.toString();
              }
              if (columnIndexes.volumeWeight !== -1) {
                newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
              }
              return newRow;
            }

            // NATIONAL ACCESSORIES Company Rule
            if (companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('NATIONALACCESSORIES') || 
                companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('NATIONALACCESSORY')) {
              const customValue = roundWeight * 500;
              
              if (columnIndexes.custom !== -1) {
                newRow[columnIndexes.custom] = customValue.toString();
              }
              if (columnIndexes.total !== -1) {
                newRow[columnIndexes.total] = customValue.toString();
              }
              if (columnIndexes.volumeWeight !== -1) {
                newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
              }
              return newRow;
            }

            // DIVINE INTIMATES LTD Company Rule
            if (companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('DIVINEINTIMATES') || 
                companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('DIVINEINTIMATE')) {
              const customValue = roundWeight * 500;
              
              if (columnIndexes.custom !== -1) {
                newRow[columnIndexes.custom] = customValue.toString();
              }
              if (columnIndexes.total !== -1) {
                newRow[columnIndexes.total] = customValue.toString();
              }
              if (columnIndexes.volumeWeight !== -1) {
                newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
              }
              return newRow;
            }

            // RAOZAN SWEATER LIMITED Company Rule
            if (companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('RAOZANSWEATER') || 
                companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('RAOZANSWEATERS')) {
              const customValue = roundWeight * 600;
              
              if (columnIndexes.custom !== -1) {
                newRow[columnIndexes.custom] = customValue.toString();
              }
              if (columnIndexes.total !== -1) {
                newRow[columnIndexes.total] = customValue.toString();
              }
              if (columnIndexes.volumeWeight !== -1) {
                newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
              }
              return newRow;
            }

            // FARKANTEX LTD Company Rule
            if (companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('FARKANTEX') || 
                companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('FARKANTEXTILE')) {
              const customValue = roundWeight * 500;
              
              if (columnIndexes.custom !== -1) {
                newRow[columnIndexes.custom] = customValue.toString();
              }
              if (columnIndexes.total !== -1) {
                newRow[columnIndexes.total] = customValue.toString();
              }
              if (columnIndexes.volumeWeight !== -1) {
                newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
              }
              return newRow;
            }

            // BLUE SKY Company Rules
            if (companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('BLUESKY') || 
                companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('BLUESKIES')) {
              if (columnIndexes.volumeWeight !== -1) {
                newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
              }

              if (roundWeight === 1) {
                newRow[columnIndexes.custom] = '800';
                newRow[columnIndexes.total] = '800';
              } else if (roundWeight === 2) {
                newRow[columnIndexes.custom] = '1200';
                newRow[columnIndexes.total] = '1200';
              } else if (roundWeight >= 3 && roundWeight <= 10) {
                newRow[columnIndexes.custom] = '1500';
                newRow[columnIndexes.total] = '1500';
              } else if (roundWeight >= 11 && roundWeight <= 25) {
                newRow[columnIndexes.custom] = '2000';
                newRow[columnIndexes.total] = '2000';
              } else if (roundWeight >= 26 && roundWeight <= 35) {
                newRow[columnIndexes.custom] = '2500';
                newRow[columnIndexes.total] = '2500';
              } else if (roundWeight >= 36 && roundWeight <= 60) {
                newRow[columnIndexes.custom] = '3000';
                newRow[columnIndexes.total] = '3000';
              } else if (roundWeight >= 61 && roundWeight <= 500) {
                newRow[columnIndexes.custom] = 'PLEASE CONTACT';
                newRow[columnIndexes.total] = 'PLEASE CONTACT';
              }
              return newRow;
            }

            // FOUR H FASHION Company Rule
            if (companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('FOURHFASHION') || 
                companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('4HFASHION')) {
              const customValue = roundWeight * 500;
              
              if (columnIndexes.custom !== -1) {
                newRow[columnIndexes.custom] = customValue.toString();
              }
              if (columnIndexes.total !== -1) {
                newRow[columnIndexes.total] = customValue.toString();
              }
              if (columnIndexes.volumeWeight !== -1) {
                newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
              }
              return newRow;
            }

            // CHILDREN PLACE LTD Company Rules
            if (companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('CHILDRENPLACE') ||
                companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('CHILDRENSPLACE') ||
                companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('CHILDPLACE')) {
              if (columnIndexes.volumeWeight !== -1) {
                newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
              }

              if (roundWeight === 1) {
                newRow[columnIndexes.custom] = '700';
                newRow[columnIndexes.total] = '700';
              } else if (roundWeight === 2) {
                newRow[columnIndexes.custom] = '1200';
                newRow[columnIndexes.total] = '1200';
              } else if (roundWeight >= 3 && roundWeight <= 5) {
                newRow[columnIndexes.custom] = '1500';
                newRow[columnIndexes.total] = '1500';
              } else if (roundWeight >= 6 && roundWeight <= 10) {
                newRow[columnIndexes.custom] = '2000';
                newRow[columnIndexes.total] = '2000';
              } else if (roundWeight >= 11 && roundWeight <= 15) {
                newRow[columnIndexes.custom] = '2500';
                newRow[columnIndexes.total] = '2500';
              } else if (roundWeight >= 17 && roundWeight <= 40) {
                newRow[columnIndexes.custom] = '3000';
                newRow[columnIndexes.total] = '3000';
              } else if (roundWeight >= 41 && roundWeight <= 500) {
                newRow[columnIndexes.custom] = 'PLEASE CONTACT';
                newRow[columnIndexes.total] = 'PLEASE CONTACT';
              }
              return newRow;
            }

            // MOSTAFA GARMENTS Company Rules
            if (companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('MOSTAFAGARMENTS') ||
                companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('MOSTAFAGARMENT') ||
                companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').includes('MUSTAFAGARMENTS')) {
              if (columnIndexes.volumeWeight !== -1) {
                newRow[columnIndexes.volumeWeight] = 'PASSBOOK';
              }

              if (roundWeight === 1) {
                newRow[columnIndexes.custom] = '800';
                newRow[columnIndexes.total] = '800';
              } else if (roundWeight === 2) {
                newRow[columnIndexes.custom] = '1200';
                newRow[columnIndexes.total] = '1200';
              } else if (roundWeight >= 3 && roundWeight <= 5) {
                newRow[columnIndexes.custom] = '1500';
                newRow[columnIndexes.total] = '1500';
              } else if (roundWeight >= 6 && roundWeight <= 10) {
                newRow[columnIndexes.custom] = '1800';
                newRow[columnIndexes.total] = '1800';
              } else if (roundWeight >= 11 && roundWeight <= 25) {
                newRow[columnIndexes.custom] = '2000';
                newRow[columnIndexes.total] = '2000';
              } else if (roundWeight >= 26 && roundWeight <= 35) {
                newRow[columnIndexes.custom] = '2500';
                newRow[columnIndexes.total] = '2500';
              } else if (roundWeight >= 36 && roundWeight <= 50) {
                newRow[columnIndexes.custom] = '3000';
                newRow[columnIndexes.total] = '3000';
              } else if (roundWeight >= 51 && roundWeight <= 500) {
                newRow[columnIndexes.custom] = '5000';
                newRow[columnIndexes.total] = '5000';
              }
              return newRow;
            }

            // AREA based rules (BANGLADESH and CTG)
            if (area === 'BANGLADESH' || area === 'CTG') {
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

            // Process DELIVERY ITEM and PAID DATE
            if (columnIndexes.deliveryItem !== -1 && columnIndexes.paidDate !== -1) {
              const deliveryItem = getValue(columnIndexes.deliveryItem).toUpperCase().trim();
              const paymentType = columnIndexes.typeOfPayment !== -1 
                ? getValue(columnIndexes.typeOfPayment).toUpperCase().trim() 
                : '';
              
              const specialItems = ['CO MAIL', 'DOC', 'P'];
              
              if (specialItems.includes(deliveryItem) || 
                  (paymentType === 'DUTY' && deliveryItem === 'SPX')) {
                
                // Clear specified columns
                const columnsToClear = ['freightCostBDT', 'custom', 'total'];
                
                columnsToClear.forEach(col => {
                  if (columnIndexes[col] !== -1) {
                    newRow[columnIndexes[col]] = '';
                  }
                });
                
                // Set PAID DATE to N/A
                newRow[columnIndexes.paidDate] = 'N/A';
              }
            }

            // Process AREA and REMARKS
            if (columnIndexes.area !== -1 && columnIndexes.remarks !== -1) {
              const areaValue = getValue(columnIndexes.area).toUpperCase();
              if (areaValue === 'CTG') {
                newRow[columnIndexes.remarks] = 'CTG';
              }
            }

            // Process DOLLER RATE and FR. COST(TK)
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
            if (columnIndexes.volumeWeight !== -1 && 
                newRow[columnIndexes.volumeWeight].toString().includes('DESTROY/MAIL')) {
              
              if (columnIndexes.roundWeight !== -1) {
                newRow[columnIndexes.roundWeight] = '';
              }
              
              if (columnIndexes.custom !== -1) {
                newRow[columnIndexes.custom] = '';
              }
              
              if (columnIndexes.total !== -1) {
                newRow[columnIndexes.total] = '';
              }
              
              if (columnIndexes.paidDate !== -1) {
                newRow[columnIndexes.paidDate] = 'N/A';
              }
            }

            // Process COMPANY NAME and REMARKS
            if (columnIndexes.companyName !== -1 && columnIndexes.remarks !== -1) {
              const existingRemarks = getValue(columnIndexes.remarks).toUpperCase();
              if (existingRemarks !== 'CTG') {
                const companyName = getValue(columnIndexes.companyName).toUpperCase();
                
                if (dmCompanies.some(dmComp => companyName.includes(dmComp))) {
                  newRow[columnIndexes.remarks] = 'DAILY & MONTHLY';
                } 
                else if (Object.keys(mCompanies).some(mComp => companyName.includes(mComp.toUpperCase()))) {
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