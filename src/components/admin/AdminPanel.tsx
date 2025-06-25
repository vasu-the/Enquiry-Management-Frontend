import React from 'react';

const AdminPanel: React.FC = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
            <div className="mb-6">
                <h2 className="text-xl font-semibold">User Management</h2>

            </div>
            <div>
                <h2 className="text-xl font-semibold">Enquiry Management</h2>

            </div>
        </div>
    );
};

export default AdminPanel;