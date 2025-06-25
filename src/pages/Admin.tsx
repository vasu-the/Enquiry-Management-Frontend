import React, { useEffect, useState } from 'react';
import '../index.css';

type User = {
    _id: string;
    fullName: string;
    email: string;
    isActive: boolean;
    createdAt: string;
};

type Enquiry = {
    _id: string;
    title: string;
    description: string;
    category: string;
    fileUrl: string;
    createdAt: string;
    user: {
        _id: string;
        fullName: string;
        email: string;
    } | null;
    userId?: any;
};

const AdminDashboard: React.FC = () => {
    const [tab, setTab] = useState<'users' | 'enquiries'>('users');
    const [users, setUsers] = useState<User[]>([]);
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [sortAsc, setSortAsc] = useState(false);
    const [enquirySearch, setEnquirySearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<'all' | 'feedback' | 'issues' | 'feature requests'>('all');

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (tab === 'users') {
            setLoading(true);
            fetch('https://enquiry-management-backend.vercel.app/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => setUsers(data.data || []))
                .catch(err => {
                    console.error('User fetch error:', err);
                    setUsers([]);
                })
                .finally(() => setLoading(false));
        }
    }, [tab, token]);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (tab === 'enquiries') {
            console.log('[AdminDashboard] Fetching enquiries...');
            setLoading(true);

            fetch('https://enquiry-management-backend.vercel.app/api/admin/enquiries', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    console.log('[AdminDashboard] Enquiries response status:', res.status);
                    return res.json().then(data => {
                        console.log('[AdminDashboard] Enquiries response data:', data);
                        return { status: res.status, data };
                    });
                })
                .then(({ status, data }) => {
                    if (status !== 200) {
                        throw new Error(data.message || `Failed to fetch enquiries (status ${status})`);
                    }

                    console.log('[AdminDashboard] Raw enquiries data:', data);

                    // Correctly map user data
                    const formatted = (data.data || []).map((enq: any) => {
                        console.log('[AdminDashboard] Processing enquiry:', enq._id);
                        console.log('[AdminDashboard] User data in enquiry:', enq.userId);

                        return {
                            ...enq,
                            user: enq.userId ? {
                                _id: enq.userId._id,
                                fullName: enq.userId.fullName,
                                email: enq.userId.email
                            } : null
                        };
                    });

                    console.log('[AdminDashboard] Formatted enquiries:', formatted);
                    setEnquiries(formatted);
                })
                .catch(err => {
                    console.error('[AdminDashboard] Error fetching enquiries:', err);
                    setEnquiries([]);
                })
                .finally(() => {
                    console.log('[AdminDashboard] Enquiries fetch completed');
                    setLoading(false);
                });
        }
    }, [tab]);

    const toggleStatus = async (id: string) => {
        await fetch(`https://enquiry-management-backend.vercel.app/api/admin/users/${id}/status`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token}` }
        });

        setUsers(prev =>
            prev.map(u => (u._id === id ? { ...u, isActive: !u.isActive } : u))
        );
    };

    const filteredUsers = users
        .filter(u =>
            statusFilter === 'all' ||
            (statusFilter === 'active' && u.isActive) ||
            (statusFilter === 'inactive' && !u.isActive)
        )
        .filter(u =>
            u.fullName.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) =>
            sortAsc
                ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

    const filteredEnquiries = enquiries
        .filter(e =>
            categoryFilter === 'all' || e.category === categoryFilter
        )
        .filter(e =>
            e.title.toLowerCase().includes(enquirySearch.toLowerCase()) ||
            e.user?.fullName?.toLowerCase().includes(enquirySearch.toLowerCase()) ||
            e.user?.email?.toLowerCase().includes(enquirySearch.toLowerCase())
        );

    return (
        <div className="min-h-screen flex bg-gray-100">
            <aside className="w-56 bg-white shadow-2xl p-6 flex flex-col space-y-4">
                <h2 className="text-xl font-bold mb-4 text-center">Admin Panel</h2>
                <button onClick={() => setTab('users')} className={`py-2 px-4 rounded text-left ${tab === 'users' ? 'bg-blue-900 text-white' : 'bg-gray-200 text-blue-900'}`}>Users</button>
                <button onClick={() => setTab('enquiries')} className={`py-2 px-4 rounded text-left ${tab === 'enquiries' ? 'bg-blue-900 text-white' : 'bg-gray-200 text-blue-900'}`}>Enquiries</button>
            </aside>

            <main className="flex-1 p-8">
                <div className="bg-white rounded-xl shadow-2xl p-8 max-w-6xl mx-auto">
                    {loading && <div className="text-center text-gray-500">Loading...</div>}

                    {tab === 'users' ? (
                        <>
                            <div className="flex flex-wrap gap-4 mb-4">
                                <input
                                    type="text"
                                    placeholder="Search by name or email"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="search-bar"
                                />
                                <select
                                    className="status-dropdown"
                                    value={statusFilter}
                                    onChange={e => setStatusFilter(e.target.value as any)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                                <button
                                    className="border p-2 rounded bg-blue-100 text-blue-900"
                                    onClick={() => setSortAsc(s => !s)}
                                >
                                    Sort: {sortAsc ? '↑' : '↓'}
                                </button>
                            </div>

                            {filteredUsers.length === 0 ? (
                                <div className="text-center text-gray-400">No users found.</div>
                            ) : (
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>S. No.</th>
                                            <th>Full Name</th>
                                            <th>Email</th>
                                            <th>Signup Date</th>
                                            <th>Status</th>
                                            <th>Toggle</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((u, i) => (
                                            <tr key={u._id} className="text-center">
                                                <td>{i + 1}</td>
                                                <td>{u.fullName}</td>
                                                <td>{u.email}</td>
                                                <td>{new Date(u.createdAt).toLocaleString()}</td>
                                                <td>{u.isActive ? 'Active' : 'Inactive'}</td>
                                                <td>
                                                    <button
                                                        onClick={() => toggleStatus(u._id)}
                                                        className={`toggle-btn ${u.isActive ? '' : 'off'}`}
                                                    >
                                                        {u.isActive ? 'Active' : 'Inactive'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="flex flex-wrap gap-4 mb-4">
                                <input
                                    type="text"
                                    placeholder="Search by title, name or email"
                                    value={enquirySearch}
                                    onChange={e => setEnquirySearch(e.target.value)}
                                    className="search-bar"
                                />
                                <select
                                    className="category-dropdown"
                                    value={categoryFilter}
                                    onChange={e => setCategoryFilter(e.target.value as any)}
                                >
                                    <option value="all">All Categories</option>
                                    <option value="feedback">Feedback</option>
                                    <option value="issues">Issues</option>
                                    <option value="feature requests">Feature Requests</option>
                                </select>
                            </div>

                            {filteredEnquiries.length === 0 ? (
                                <div className="text-center text-gray-400">No enquiries found.</div>
                            ) : (
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>S. No.</th>
                                            <th>Enquiry ID</th>
                                            <th>User Name</th>
                                            <th>Email</th>
                                            <th>Title</th>
                                            <th>Category</th>
                                            <th>Submission Date</th>
                                            <th>File</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredEnquiries.map((e, i) => (
                                            <tr key={e._id} className="text-center">
                                                <td>{i + 1}</td>
                                                <td>{e._id}</td>
                                                <td>{e.user?.fullName ?? 'N/A'}</td>
                                                <td>{e.user?.email ?? 'N/A'}</td>
                                                <td>{e.title}</td>
                                                <td>{e.category}</td>
                                                <td>{new Date(e.createdAt).toLocaleString()}</td>
                                                <td>
                                                    {e.fileUrl ? (
                                                        <>
                                                            <a
                                                                href={`https://enquiry-management-backend.vercel.app/download/${e.fileUrl}`}
                                                                className="text-blue-900 underline mr-2"
                                                            >
                                                                Download
                                                            </a>
                                                            <a
                                                                href={`https://enquiry-management-backend.vercel.app/uploads/${e.fileUrl}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-green-700 underline"
                                                            >
                                                                View
                                                            </a>
                                                        </>
                                                    ) : '—'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
