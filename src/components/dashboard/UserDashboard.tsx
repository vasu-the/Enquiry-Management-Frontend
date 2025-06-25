import React from 'react';
import { RequireAuth } from '../../routes/RequireAuth';
import EnquiryForm from '../enquiry/EnquiryForm';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <RequireAuth>
      <nav className="user-dashboard-nav">
        <span className="user-dashboard-nav-title">User Dashboard</span>
        <div>
          <button
            className="user-dashboard-nav-link"
            onClick={() => navigate('/')}
          >
            Home
          </button>
        </div>
      </nav>
      <div className="p-4">
        <EnquiryForm />
      </div>
    </RequireAuth>
  );
};

export default Dashboard;