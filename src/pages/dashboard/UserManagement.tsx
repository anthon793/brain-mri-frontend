import React, { useState, useEffect } from 'react';
import {
  HiOutlineUserGroup,
  HiOutlinePlus,
  HiOutlineMagnifyingGlass,
  HiOutlineEllipsisVertical,
  HiOutlineShieldCheck,
  HiOutlineEnvelope,
  HiOutlineCalendarDays,
  HiOutlinePencil,
  HiOutlineTrash,
} from 'react-icons/hi2';
import { mockUsers } from '../../data/mockData';
import { userService } from '../../api';
import RoleBadge from '../../components/auth/RoleBadge';
import Modal from '../../components/ui/Modal';
import type { User, UserRole } from '../../types';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    userService.list({ page: 1, pageSize: 50 }).then((data) => {
      setUsers(data.items.map((u) => ({
        id: u.id, name: u.name, email: u.email, password: '',
        role: u.role, avatar: u.avatar, department: u.department,
        isActive: u.isActive, lastLogin: u.lastLogin,
      })));
    }).catch(() => { /* use mock fallback */ });
  }, []);

  // New user form
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('radiologist');
  const [newDept, setNewDept] = useState('');

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleActive = (userId: string) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u)));
  };

  const handleAddUser = () => {
    if (!newName.trim() || !newEmail.trim()) return;
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: newName,
      email: newEmail,
      password: 'temp123',
      role: newRole,
      avatar: newName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
      department: newDept || undefined,
      isActive: true,
    };
    setUsers([...users, newUser]);
    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
    setNewRole('radiologist');
    setNewDept('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Manage platform users, roles, and access permissions.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-primary-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-600 transition-colors shadow-md shadow-primary-500/25"
        >
          <HiOutlinePlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <HiOutlineUserGroup className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              <p className="text-xs text-gray-500">Total Users</p>
            </div>
          </div>
        </div>
        {(['super_admin', 'radiologist', 'researcher'] as UserRole[]).map((role) => (
          <div key={role} className="bg-white rounded-xl border border-gray-100 p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                <HiOutlineShieldCheck className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter((u) => u.role === role).length}
                </p>
                <p className="text-xs text-gray-500 capitalize">{role.replace('_', ' ')}s</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users by name or email..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                  User
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                  Role
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                  Department
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                  Last Login
                </th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">{u.avatar}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <HiOutlineEnvelope className="w-3 h-3" /> {u.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <RoleBadge role={u.role} />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{u.department || '—'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(u.id)}
                      className="flex items-center gap-2"
                    >
                      {u.isActive ? (
                        <span className="inline-flex h-5 w-8 items-center rounded-full bg-green-500 transition-colors">
                          <span className="inline-block h-3.5 w-3.5 translate-x-3.5 rounded-full bg-white shadow transition-transform" />
                        </span>
                      ) : (
                        <span className="inline-flex h-5 w-8 items-center rounded-full bg-gray-300 transition-colors">
                          <span className="inline-block h-3.5 w-3.5 translate-x-0.5 rounded-full bg-white shadow transition-transform" />
                        </span>
                      )}
                      <span
                        className={`text-xs font-semibold ${
                          u.isActive ? 'text-green-600' : 'text-gray-400'
                        }`}
                      >
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <HiOutlineCalendarDays className="w-3 h-3" />
                      {u.lastLogin
                        ? new Date(u.lastLogin).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative inline-block">
                      <button
                        onClick={() => setActiveMenu(activeMenu === u.id ? null : u.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <HiOutlineEllipsisVertical className="w-4 h-4" />
                      </button>
                      {activeMenu === u.id && (
                        <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl border border-gray-200 shadow-modal z-10 py-1 animate-fade-in">
                          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <HiOutlinePencil className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                            <HiOutlineTrash className="w-3.5 h-3.5" /> Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New User"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Dr. Jane Smith"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="jane.smith@neuroscan.ai"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as UserRole)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            >
              <option value="super_admin">Super Admin</option>
              <option value="radiologist">Radiologist</option>
              <option value="researcher">Researcher</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Department <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={newDept}
              onChange={(e) => setNewDept(e.target.value)}
              placeholder="e.g. Diagnostic Radiology"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddUser}
              className="px-5 py-2.5 bg-primary-500 text-white text-sm font-semibold rounded-xl hover:bg-primary-600 transition-colors shadow-md shadow-primary-500/25"
            >
              Add User
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;
