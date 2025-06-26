import React, { useEffect, useState } from 'react';

interface User {
  _id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

interface Enquiry {
  _id: string;
  title: string;
  category: string;
  description: string;
  fileUrl?: string;
  createdAt: string;
  user?: {
    _id: string;
    fullName: string;
    email: string;
  };
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [tab, setTab] = useState<'users' | 'enquiries'>('users');
  const [search, setSearch] = useState('');
  const [enquirySearch, setEnquirySearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('https://enquiry-management-backend.vercel.app/admin/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setUsers(data.data || []));

    fetch('https://enquiry-management-backend.vercel.app/api/admin/enquiries', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setEnquiries(data.data || []));
  }, [token]);

  const toggleStatus = async (id: string) => {
    await fetch(`https://enquiry-management-backend.vercel.app/api/admin/users/${id}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });

    setUsers(prev =>
      prev.map(user =>
        user._id === id ? { ...user, isActive: !user.isActive } : user
      )
    );
  };

  const filteredUsers = users
    .filter(user =>
      user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    )
    .filter(user =>
      statusFilter === 'all'
        ? true
        : statusFilter === 'active'
        ? user.isActive
        : !user.isActive
    );

  const filteredEnquiries = enquiries
    .filter(e => categoryFilter === 'all' || e.category === categoryFilter)
    .filter(e =>
      e.title.toLowerCase().includes(enquirySearch.toLowerCase()) ||
      e.user?.fullName?.toLowerCase().includes(enquirySearch.toLowerCase()) ||
      e.user?.email?.toLowerCase().includes(enquirySearch.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  return (
    <div className="p-10 font-serif bg-gray-100 min-h-screen">
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setTab('users')}
          className={`px-6 py-2 rounded shadow-md transition-all duration-300 text-white font-semibold ${tab === 'users' ? 'bg-indigo-600' : 'bg-gray-400 hover:bg-gray-500'}`}
        >
          Users
        </button>
        <button
          onClick={() => setTab('enquiries')}
          className={`px-6 py-2 rounded shadow-md transition-all duration-300 text-white font-semibold ${tab === 'enquiries' ? 'bg-indigo-600' : 'bg-gray-400 hover:bg-gray-500'}`}
        >
          Enquiries
        </button>
      </div>

      {tab === 'users' ? (
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">User Management</h2>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Search name or email"
              className="border border-gray-300 p-2 rounded w-full max-w-md"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="border border-gray-300 p-2 rounded"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <table className="w-full table-auto border text-sm rounded overflow-hidden">
            <thead className="bg-indigo-100 text-indigo-800 text-sm uppercase tracking-wider">
              <tr className="text-left">
                <th className="p-2">S.No</th>
                <th className="p-2">Full Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Status</th>
                <th className="p-2">Created At</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, i) => (
                <tr key={user._id} className="border-t border-gray-200 hover:bg-indigo-50">
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2">{user.fullName}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 text-xs rounded font-medium ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="p-2">
                    <button
                      onClick={() => toggleStatus(user._id)}
                      className={`px-3 py-1 rounded font-medium transition shadow
                        ${user.isActive
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Enquiries</h2>
          <div className="flex flex-wrap gap-4 mb-4">
            <input
              type="text"
              placeholder="Search title or user"
              className="border border-gray-300 p-2 rounded w-full max-w-md"
              value={enquirySearch}
              onChange={e => setEnquirySearch(e.target.value)}
            />
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="border border-gray-300 p-2 rounded"
            >
              <option value="all">All Categories</option>
              {Array.from(new Set(enquiries.map(e => e.category))).map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="border border-gray-300 p-2 rounded"
            >
              <option value="desc">Newest</option>
              <option value="asc">Oldest</option>
            </select>
          </div>
          <table className="w-full table-auto border text-sm rounded overflow-hidden">
            <thead className="bg-indigo-100 text-indigo-800 text-sm uppercase tracking-wider">
              <tr className="text-left">
                <th className="p-2">S.No</th>
                <th className="p-2">Title</th>
                <th className="p-2">Category</th>
                <th className="p-2">User</th>
                <th className="p-2">Email</th>
                <th className="p-2">File</th>
                <th className="p-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnquiries.map((enq, i) => (
                <tr key={enq._id} className="border-t border-gray-200 hover:bg-indigo-50">
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2">{enq.title}</td>
                  <td className="p-2">{enq.category}</td>
                  <td className="p-2">{enq.user?.fullName || 'N/A'}</td>
                  <td className="p-2">{enq.user?.email || 'N/A'}</td>
                  <td className="p-2">
                    {enq.fileUrl ? (
                      <div className="flex gap-2">
                        <a href={enq.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">View</a>
                        <a href={enq.fileUrl} download className="text-green-600 underline">Download</a>
                      </div>
                    ) : 'No File'}
                  </td>
                  <td className="p-2">{new Date(enq.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
