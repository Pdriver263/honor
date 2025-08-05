import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext"; // AuthContext ইমপোর্ট
import CustomerForm from "./components/CustomerForm";
import TrackingResult from "./components/TrackingResult";
import AdminPanel from "./components/AdminPanel";
import PODForm from "./components/PODForm";
import PODList from "./components/PODList";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute"; // PrivateRoute ইমপোর্ট
import BillSubmitForm from "./components/BillSubmitForm";
import BillSubmissionList from "./components/BillSubmissionList"; // ⬅️ Import new component
import ExcelProcessor from './components/ExcelProcessor';
import Dashboard from "./components/Dashboard";
import IGMprocessor from './components/IGMprocessor';
import SampleList from './components/SampleList';
import MonthlyBill  from './components/MonthlyBill';
import DailyBill  from './components/DailyBill';
function App() {
    return (
        <AuthProvider> {/* পুরো অ্যাপ্লিকেশনকে AuthProvider দিয়ে মোড়ানো */}
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/customer-form"
                        element={
                            <PrivateRoute>
                                <CustomerForm />
                            </PrivateRoute>
                        }
                    />
                    <Route
          path="/bill-submit"
          element={
            <PrivateRoute>
              <BillSubmitForm />
            </PrivateRoute>
          }
        />



                    <Route
                        path="/tracking-result"
                        element={
                            <PrivateRoute>
                                <TrackingResult />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin-panel"
                        element={
                            <PrivateRoute>
                                <AdminPanel />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/pod-form"
                        element={
                            <PrivateRoute>
                                <PODForm />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/pod-list"
                        element={
                            <PrivateRoute>
                                <PODList />
                            </PrivateRoute>
                        }
                    />


                      <Route
                        path="/excel-processor"
                        element={
                            <PrivateRoute>
                                <ExcelProcessor />
                            </PrivateRoute>
                        }
                    />
                    


                    
                        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/bill-submission-list" element={<BillSubmissionList />} />
        <Route path="/bill-submit-form" element={<BillSubmitForm />} />

                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/IGM-processor" element={<IGMprocessor />} />


                    <Route path="/sample-list" element={<SampleList />} />
                    <Route path="/monthly-bill" element={<MonthlyBill />} />
                    <Route path="/daily-bill" element={<DailyBill />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;