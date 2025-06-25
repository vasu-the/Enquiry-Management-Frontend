import React from 'react';
import UserDashboard from '../components/dashboard/UserDashboard';

const Dashboard: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <UserDashboard />
        </div>
    );
};

export default Dashboard;