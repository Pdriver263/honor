import React, { useState, useEffect } from 'react';
import ExcelProcessor from './ExcelProcessor';
import DailyBill from './DailyBill';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ParentComponent = () => {
  const [processedData, setProcessedData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState({
    save: false,
    fetch: false,
    delete: false
  });
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  // Handle processed data from ExcelProcessor
  const handleDataProcessed = async (data, headers, fileName) => {
    if (!data.length || !headers.length) {
      toast.error('No data to save');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, save: true }));
      setError(null);

      const token = await currentUser.getIdToken();
      const response = await axios.post('/api/excel-data', {
        headers,
        data,
        fileName
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProcessedData(data);
      setHeaders(headers);
      toast.success('Data saved successfully');
      return response.data;
    } catch (err) {
      console.error('Save error:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.message || 'Failed to save data';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, save: false }));
    }
  };

  // Fetch latest data on component mount
  useEffect(() => {
    const fetchLatestData = async () => {
      if (!currentUser) return;

      try {
        setLoading(prev => ({ ...prev, fetch: true }));
        setError(null);

        const token = await currentUser.getIdToken();
        const response = await axios.get('/api/excel-data/latest', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success && response.data.data) {
          setProcessedData(response.data.data.data);
          setHeaders(response.data.data.headers);
        }
      } catch (err) {
        console.error('Fetch error:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(prev => ({ ...prev, fetch: false }));
      }
    };

    fetchLatestData();
  }, [currentUser]);

  // Handle data updates from DailyBill
  const handleDataUpdate = async (updatedData) => {
    try {
      setLoading(prev => ({ ...prev, save: true }));
      setError(null);

      const token = await currentUser.getIdToken();
      const latestData = await axios.get('/api/excel-data/latest', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!latestData.data.success) {
        throw new Error('Could not find existing data to update');
      }

      const response = await axios.put(
        `/api/excel-data/${latestData.data.data._id}`,
        {
          data: updatedData,
          headers
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setProcessedData(updatedData);
      toast.success('Data updated successfully');
      return response.data;
    } catch (err) {
      console.error('Update error:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.message || 'Failed to update data';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, save: false }));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Excel Data Processor</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Excel File</h2>
          <ExcelProcessor 
            onDataProcessed={handleDataProcessed} 
            disabled={loading.save || loading.fetch}
          />
          {loading.save && (
            <p className="text-blue-500 mt-2">Saving data...</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Daily Bills</h2>
          {loading.fetch ? (
            <p className="text-gray-500">Loading data...</p>
          ) : (
            <DailyBill 
              data={processedData} 
              headers={headers} 
              onDataUpdate={handleDataUpdate}
              loading={loading.save}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentComponent;