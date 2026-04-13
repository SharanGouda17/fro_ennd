import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Package, Users, BarChart3, UserCheck, 
  Plus, Search, Edit2, Trash2, LogOut, Bell, 
  Moon, Sun, CheckCircle2, AlertCircle, X, ArrowRight 
} from 'lucide-react';
import { cn } from './utils/cn';

interface Asset {
  id: string;
  name: string;
  type: string;
  status: 'Available' | 'Assigned' | 'Maintenance' | 'Retired';
  assignee?: string;
  purchaseDate: string;
  value: number;
  serialNumber: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  department: string;
  avatar: string;
}

interface Assignment {
  id: string;
  assetId: string;
  userId: string;
  assignedDate: string;
  returnDate?: string;
}

const mockAssets: Asset[] = [
  { id: 'A001', name: 'MacBook Pro 16"', type: 'Laptop', status: 'Assigned', assignee: 'Sarah Chen', purchaseDate: '2024-01-15', value: 2499, serialNumber: 'MP16X-7842' },
  { id: 'A002', name: 'Dell UltraSharp 27"', type: 'Monitor', status: 'Available', purchaseDate: '2023-11-20', value: 429, serialNumber: 'DEL-U2723QE' },
  { id: 'A003', name: 'iPhone 15 Pro', type: 'Mobile', status: 'Assigned', assignee: 'Michael Torres', purchaseDate: '2024-03-10', value: 999, serialNumber: 'AP-15P-3921' },
  { id: 'A004', name: 'Ergonomic Office Chair', type: 'Furniture', status: 'Assigned', assignee: 'Emma Rodriguez', purchaseDate: '2022-08-05', value: 349, serialNumber: 'FURN-EC-112' },
  { id: 'A005', name: 'Lenovo ThinkPad X1', type: 'Laptop', status: 'Maintenance', purchaseDate: '2024-02-28', value: 1399, serialNumber: 'LN-TPX1-667' },
  { id: 'A006', name: 'HP LaserJet Printer', type: 'Hardware', status: 'Available', purchaseDate: '2023-09-12', value: 289, serialNumber: 'HP-LJ-8841' },
  { id: 'A007', name: 'Adobe Creative Cloud License', type: 'Software', status: 'Assigned', assignee: 'David Kim', purchaseDate: '2024-04-01', value: 599, serialNumber: 'ADOBE-CC-2024-7' },
  { id: 'A008', name: 'Samsung 4K Monitor', type: 'Monitor', status: 'Assigned', assignee: 'Sarah Chen', purchaseDate: '2023-12-18', value: 649, serialNumber: 'SAM-4K-2219' },
];

const mockUsers: User[] = [
  { id: 'U001', name: 'Alex Rivera', email: 'alex.rivera@company.com', role: 'admin', department: 'IT', avatar: '👨‍💼' },
  { id: 'U002', name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'manager', department: 'Design', avatar: '👩🏻‍💼' },
  { id: 'U003', name: 'Michael Torres', email: 'michael.torres@company.com', role: 'employee', department: 'Engineering', avatar: '👨🏽‍💻' },
  { id: 'U004', name: 'Emma Rodriguez', email: 'emma.rodriguez@company.com', role: 'employee', department: 'Marketing', avatar: '👩🏼‍💼' },
  { id: 'U005', name: 'David Kim', email: 'david.kim@company.com', role: 'manager', department: 'Operations', avatar: '🧔🏻‍♂️' },
];

const mockAssignments: Assignment[] = [
  { id: 'AS1', assetId: 'A001', userId: 'U002', assignedDate: '2024-05-12' },
  { id: 'AS2', assetId: 'A003', userId: 'U003', assignedDate: '2024-06-03' },
  { id: 'AS3', assetId: 'A004', userId: 'U004', assignedDate: '2024-04-22' },
  { id: 'AS4', assetId: 'A007', userId: 'U005', assignedDate: '2024-05-01' },
  { id: 'AS5', assetId: 'A008', userId: 'U002', assignedDate: '2024-03-15' },
];

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'manager', 'employee'] },
  { id: 'inventory', label: 'Inventory', icon: Package, roles: ['admin', 'manager'] },
  { id: 'myassets', label: 'My Assets', icon: UserCheck, roles: ['admin', 'manager', 'employee'] },
  { id: 'assignments', label: 'Assignments', icon: ArrowRight, roles: ['admin', 'manager'] },
  { id: 'users', label: 'Team', icon: Users, roles: ['admin'] },
  { id: 'reports', label: 'Reports', icon: BarChart3, roles: ['admin', 'manager'] },
];

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'inventory' | 'myassets' | 'assignments' | 'users' | 'reports'>('dashboard');
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [users] = useState<User[]>(mockUsers);
  const [assignments] = useState<Assignment[]>(mockAssignments);
  const [isDark, setIsDark] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notificationCount] = useState(3);
  const [newAsset, setNewAsset] = useState({
    name: '',
    type: 'Laptop',
    value: 0,
    serialNumber: '',
  });

  // Apply dark mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = 
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assignee?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || asset.status === statusFilter;
    const matchesType = typeFilter === 'All' || asset.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const availableAssets = assets.filter(a => a.status === 'Available').length;
  const assignedAssets = assets.filter(a => a.status === 'Assigned').length;
  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const maintenanceAssets = assets.filter(a => a.status === 'Maintenance').length;

  const getUserAssets = (userId: string) => {
    const userAssignments = assignments.filter(a => a.userId === userId);
    return assets.filter(asset => 
      userAssignments.some(ua => ua.assetId === asset.id)
    );
  };

  const userAssets = getUserAssets(currentUser.id);

  const assetTypes = ['Laptop', 'Monitor', 'Mobile', 'Furniture', 'Hardware', 'Software'];
  const assetDistribution = assetTypes.map(type => {
    const count = assets.filter(a => a.type === type).length;
    return { type, count, percentage: Math.round((count / assets.length) * 100) || 0 };
  });

  const handleAddAsset = () => {
    if (!newAsset.name || !newAsset.serialNumber) return;
    
    const asset: Asset = {
      id: `A${String(assets.length + 10).padStart(3, '0')}`,
      name: newAsset.name,
      type: newAsset.type as any,
      status: 'Available',
      purchaseDate: new Date().toISOString().split('T')[0],
      value: newAsset.value || 500,
      serialNumber: newAsset.serialNumber,
    };
    
    setAssets([...assets, asset]);
    setNewAsset({ name: '', type: 'Laptop', value: 0, serialNumber: '' });
    setShowAddModal(false);
  };

  const handleDeleteAsset = (id: string) => {
    if (!confirm('Delete this asset?')) return;
    setAssets(assets.filter(a => a.id !== id));
  };

  const updateAssetStatus = (id: string, newStatus: Asset['status'], assignee?: string) => {
    setAssets(assets.map(asset => {
      if (asset.id === id) {
        return { 
          ...asset, 
          status: newStatus,
          assignee: assignee || (newStatus === 'Available' ? undefined : asset.assignee)
        };
      }
      return asset;
    }));
  };

  const handleAssignAsset = (assetId: string, userName: string) => {
    const asset = assets.find(a => a.id === assetId);
    if (asset) {
      updateAssetStatus(assetId, 'Assigned', userName);
      setShowAssignModal(false);
      setSelectedAsset(null);
    }
  };

  const getRoleColor = (role: string) => {
    if (role === 'admin') return 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300';
    if (role === 'manager') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300';
    return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300';
  };

  const visibleNavItems = navItems.filter(item => 
    item.roles.includes(currentUser.role)
  );

  const StatCard = ({ icon: Icon, label, value, change, color }: { 
    icon: React.ElementType; 
    label: string; 
    value: string | number; 
    change?: string; 
    color?: string;
  }) => (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow transition-all">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">{label}</div>
          <div className="text-4xl font-semibold text-zinc-900 dark:text-white mt-3 tracking-tighter">{value}</div>
        </div>
        <div className={`p-3 rounded-2xl ${color || 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {change && (
        <div className="mt-4 flex items-center text-emerald-600 dark:text-emerald-400 text-xs font-medium">
          <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mr-1.5"></span>
          {change} from last month
        </div>
      )}
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white">Welcome back, {currentUser.name.split(' ')[0]}</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Here's what's happening with your company's assets today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          icon={Package} 
          label="Total Assets" 
          value={assets.length} 
          change="+2" 
          color="bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400" 
        />
        <StatCard 
          icon={UserCheck} 
          label="Assigned" 
          value={assignedAssets} 
          change="+1" 
          color="bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400" 
        />
        <StatCard 
          icon={CheckCircle2} 
          label="Available" 
          value={availableAssets} 
          change="—2" 
          color="bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400" 
        />
        <StatCard 
          icon={AlertCircle} 
          label="In Maintenance" 
          value={maintenanceAssets} 
          change="+1" 
          color="bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Asset Distribution */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-7 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="font-semibold text-lg">Asset Distribution</div>
            <div className="text-xs px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-500">By Category</div>
          </div>
          
          <div className="space-y-6 mt-2">
            {assetDistribution.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-28 text-sm font-medium text-zinc-500 dark:text-zinc-400">{item.type}</div>
                <div className="flex-1 h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all" 
                    style={{ width: `${item.percentage + 8}%` }}
                  ></div>
                </div>
                <div className="w-12 text-right font-mono text-sm font-semibold text-zinc-900 dark:text-white">
                  {item.count}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-xs flex justify-between text-zinc-400">
            <div>TOTAL ASSETS: <span className="font-semibold text-zinc-900 dark:text-white">{assets.length}</span></div>
            <div className="font-mono">100%</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-7 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="font-semibold text-lg">Recent Activity</div>
            <button 
              onClick={() => setCurrentView('assignments')}
              className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="space-y-4">
            {assets.slice(0, 5).map((asset, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 group border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center text-white text-xs font-mono shadow-inner">
                    {asset.id}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{asset.name}</div>
                    <div className="text-xs text-zinc-500">{asset.type} • {asset.serialNumber}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-0.5 text-[10px] font-medium rounded-full ${asset.status === 'Available' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-400' : 
                    asset.status === 'Assigned' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-400' : 
                    'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-400'}`}>
                    {asset.status}
                  </div>
                  {asset.assignee && (
                    <div className="text-xs text-zinc-500 max-w-[110px] truncate">{asset.assignee}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Inventory</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Manage all company assets • {filteredAssets.length} results</p>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-zinc-900 hover:bg-black dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-colors text-white text-sm font-medium px-5 h-10 rounded-2xl"
        >
          <Plus className="w-4 h-4" /> Add Asset
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search assets, assignees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 pl-11 py-3 rounded-3xl text-sm focus:outline-none focus:border-blue-400"
          />
        </div>
        
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 px-5 rounded-3xl text-sm focus:outline-none"
        >
          <option value="All">All Status</option>
          <option value="Available">Available</option>
          <option value="Assigned">Assigned</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Retired">Retired</option>
        </select>
        
        <select 
          value={typeFilter} 
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 px-5 rounded-3xl text-sm focus:outline-none"
        >
          <option value="All">All Types</option>
          {assetTypes.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800">
              <th className="px-8 py-5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">ASSET</th>
              <th className="px-4 py-5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">TYPE</th>
              <th className="px-4 py-5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">SERIAL</th>
              <th className="px-4 py-5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">STATUS</th>
              <th className="px-4 py-5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">ASSIGNEE</th>
              <th className="px-4 py-5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">VALUE</th>
              <th className="w-28"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filteredAssets.map((asset) => (
              <tr key={asset.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/70 group">
                <td className="px-8 py-5">
                  <div className="font-medium">{asset.name}</div>
                  <div className="text-xs text-zinc-400 font-mono">{asset.purchaseDate}</div>
                </td>
                <td className="px-4 py-5">
                  <span className="inline-block px-3 py-1 text-xs rounded-3xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                    {asset.type}
                  </span>
                </td>
                <td className="px-4 py-5 font-mono text-sm text-zinc-500">{asset.serialNumber}</td>
                <td className="px-4 py-5">
                  <span className={`inline-flex items-center gap-1.5 px-4 py-1 text-xs font-medium rounded-3xl
                    ${asset.status === 'Available' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/70 dark:text-emerald-400' : ''}
                    ${asset.status === 'Assigned' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/70 dark:text-blue-400' : ''}
                    ${asset.status === 'Maintenance' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/70 dark:text-amber-400' : ''}
                    ${asset.status === 'Retired' ? 'bg-zinc-200 text-zinc-500' : ''}`}>
                    {asset.status}
                  </span>
                </td>
                <td className="px-4 py-5 text-sm">
                  {asset.assignee ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs">
                        {asset.assignee.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span>{asset.assignee}</span>
                    </div>
                  ) : <span className="text-zinc-400 text-sm">—</span>}
                </td>
                <td className="px-4 py-5 font-medium tabular-nums"> ${asset.value}</td>
                <td className="px-4 py-5">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button 
                      onClick={() => {
                        setSelectedAsset(asset);
                        setShowAssignModal(true);
                      }}
                      className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-blue-500"
                      title="Assign"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        const newStatus = asset.status === 'Available' ? 'Maintenance' : 
                                        asset.status === 'Maintenance' ? 'Available' : 'Available';
                        updateAssetStatus(asset.id, newStatus);
                      }}
                      className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl"
                      title="Toggle Status"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteAsset(asset.id)}
                      className="p-2 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/40 rounded-xl text-zinc-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredAssets.length === 0 && (
          <div className="p-12 text-center text-zinc-400">
            No assets match your filters.
          </div>
        )}
      </div>
    </div>
  );

  const renderMyAssets = () => (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">My Assets</h1>
        <p className="text-zinc-500">Assets currently assigned to you</p>
      </div>
      
      {userAssets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userAssets.map(asset => (
            <div key={asset.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-3xl p-8 flex flex-col">
              <div className="flex justify-between">
                <div>
                  <div className="uppercase text-xs tracking-[1px] text-blue-500 font-medium mb-1">ASSIGNED</div>
                  <div className="text-2xl font-semibold">{asset.name}</div>
                </div>
                <div className="text-6xl opacity-10">{asset.type === 'Laptop' ? '💻' : asset.type === 'Monitor' ? '🖥️' : '📱'}</div>
              </div>
              
              <div className="mt-auto pt-8 border-t flex justify-between items-end">
                <div>
                  <div className="text-xs text-zinc-400">SERIAL NUMBER</div>
                  <div className="font-mono text-sm">{asset.serialNumber}</div>
                </div>
                
                <div className="text-right">
                  <div className="text-xs text-zinc-400">VALUE</div>
                  <div className="font-semibold text-xl">${asset.value}</div>
                </div>
              </div>
              
              <button 
                onClick={() => updateAssetStatus(asset.id, 'Available')}
                className="mt-6 text-xs border border-red-200 hover:bg-red-50 dark:border-red-900 text-red-600 dark:text-red-400 px-6 py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> RETURN ASSET
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/70 dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-3xl py-20 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6">
            📦
          </div>
          <div className="text-xl font-medium">No assets assigned yet</div>
          <p className="text-zinc-500 max-w-xs mx-auto mt-3">Assets assigned to you will appear here. Contact your manager if you need new equipment.</p>
        </div>
      )}
    </div>
  );

  const renderAssignments = () => {
    const assignedList = assets.filter(a => a.status === 'Assigned');
    
    return (
      <div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Active Assignments</h1>
            <p className="text-zinc-500 dark:text-zinc-400">{assignedList.length} assets currently in use</p>
          </div>
          <button
            onClick={() => setCurrentView('inventory')}
            className="flex items-center gap-2 text-sm border border-zinc-300 dark:border-zinc-700 px-5 h-9 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Manage Inventory
          </button>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-2 border border-zinc-100 dark:border-zinc-800">
          {assignedList.map((asset, index) => {
            return (
              <div key={asset.id} className={cn(
                "flex items-center justify-between px-8 py-6 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-3xl transition-colors",
                index !== assignedList.length - 1 && "border-b border-zinc-100 dark:border-zinc-700"
              )}>
                <div className="flex items-center gap-5">
                  <div className="font-mono text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 w-8 h-8 flex items-center justify-center rounded-2xl shadow-inner text-zinc-400">
                    {asset.id}
                  </div>
                  <div>
                    <p className="font-medium leading-none">{asset.name}</p>
                    <p className="text-xs text-zinc-500 mt-2 font-mono">{asset.serialNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-8">
                  <div>
                    <div className="text-xs text-zinc-400 mb-1">ASSIGNED TO</div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{asset.assignee ? asset.assignee.split(" ")[0][0] : '?'}</span>
                      <span className="font-medium">{asset.assignee}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => updateAssetStatus(asset.id, 'Available')}
                    className="flex items-center gap-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs px-5 py-2.5 rounded-2xl hover:border-red-300 hover:text-red-600"
                  >
                    REVOKE
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderUsers = () => (
    <div>
      <div className="flex justify-between mb-8 items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tighter">Team Directory</h1>
          <p className="text-zinc-500">Manage employees and their permissions</p>
        </div>
        <div className="text-xs px-4 py-2 rounded-3xl border border-zinc-200 dark:border-zinc-700 text-zinc-400">5 team members</div>
      </div>
      
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-3xl">
        {users.map((user, index) => (
          <div key={user.id} className={cn(
            "px-8 py-6 flex items-center justify-between",
            index < users.length - 1 && "border-b border-zinc-100 dark:border-zinc-800"
          )}>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-gradient-to-br from-zinc-700 to-black text-white flex items-center justify-center text-2xl rounded-2xl">
                {user.avatar}
              </div>
              <div>
                <div className="font-semibold">{user.name}</div>
                <div className="text-xs text-zinc-500">{user.email}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="text-right">
                <div className="text-xs text-zinc-400">DEPARTMENT</div>
                <div className="font-medium text-sm">{user.department}</div>
              </div>
              
              <div className={`px-5 py-1 text-xs font-medium rounded-3xl ${getRoleColor(user.role)}`}>
                {user.role.toUpperCase()}
              </div>
              
              {currentUser.role === 'admin' && user.id !== currentUser.id && (
                <button className="text-xs border px-6 py-2 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800">Edit Role</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Analytics &amp; Reports</h1>
        <p className="text-zinc-500">Company asset utilization and financial overview</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8">
          <div className="flex justify-between mb-8">
            <div>
              <div className="uppercase tracking-widest text-xs mb-1 text-zinc-500">TOTAL ASSET VALUE</div>
              <div className="text-6xl font-semibold tabular-nums tracking-tighter text-zinc-900 dark:text-white">
                ${totalValue.toLocaleString()}
              </div>
            </div>
            <div className="text-emerald-500 text-xs flex items-center self-end">↑12% YOY</div>
          </div>
          
          <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-3xl mb-2 overflow-hidden">
            <div className="h-2 w-[72%] bg-gradient-to-r from-violet-400 to-fuchsia-500 rounded-3xl"></div>
          </div>
          <div className="flex text-[10px] text-zinc-400 justify-between">
            <div>UTILIZATION RATE</div>
            <div>72%</div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 flex flex-col">
          <div className="font-medium mb-5">Asset Depreciation Projection</div>
          <div className="flex-1 flex items-end gap-3">
            {[65, 48, 82, 39, 71, 55].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2">
                <div 
                  className="w-full bg-gradient-to-t from-blue-500 to-indigo-400 rounded-t" 
                  style={{height: `${height}px`}}
                ></div>
                <div className="text-[10px] text-zinc-400">Q{i+1}</div>
              </div>
            ))}
          </div>
          <div className="text-xs text-center text-zinc-400 mt-8">Projected remaining value over next 6 quarters</div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8">
        <div className="font-semibold mb-6">Utilization by Department</div>
        <div className="grid grid-cols-3 gap-6">
          {[
            { dept: "Engineering", pct: 91, assets: 14 },
            { dept: "Design", pct: 76, assets: 8 },
            { dept: "Marketing", pct: 64, assets: 11 }
          ].map((d, i) => (
            <div key={i} className="border border-zinc-100 dark:border-zinc-700 rounded-3xl p-6">
              <div className="text-sm text-zinc-500">{d.dept}</div>
              <div className="text-5xl font-semibold tabular-nums mt-3 mb-1 text-zinc-900 dark:text-white">{d.pct}<span className="text-base align-super text-zinc-400">%</span></div>
              <div className="text-xs text-emerald-500">{d.assets} assets assigned</div>
              <div className="mt-6 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded">
                <div className="h-1.5 bg-black dark:bg-white rounded" style={{width: `${d.pct}%`}}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-100 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-200">
      {/* Sidebar */}
      <div className="w-72 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
        <div className="px-8 pt-10 pb-8 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-3xl tracking-tighter text-black dark:text-white">assetvault</div>
              <div className="text-[10px] text-zinc-400 -mt-1">ENTERPRISE</div>
            </div>
          </div>
        </div>

        <div className="px-3 py-8 flex-1 overflow-auto">
          <div className="px-5 text-xs font-medium text-zinc-400 mb-4 tracking-widest">CORE</div>
          
          <nav className="space-y-1 px-3">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as any)}
                  className={cn(
                    "w-full flex items-center gap-3 px-5 py-3.5 rounded-3xl text-sm transition-all",
                    isActive 
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow" 
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "" : "text-zinc-400")} />
                  {item.label}
                </button>
              );
            })}
          </nav>
          
          <div className="mt-12 px-5 text-xs font-medium text-zinc-400 mb-4 tracking-widest">RESOURCES</div>
          <div className="px-8 text-xs leading-relaxed text-zinc-400">
            Asset policies are available in the internal wiki. All hardware must be returned upon departure.
          </div>
        </div>

        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 mt-auto">
          <div 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl cursor-pointer relative"
          >
            <div className="w-8 h-8 bg-zinc-800 text-white rounded-2xl flex items-center justify-center text-xl flex-shrink-0">
              {currentUser.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-black dark:text-white truncate">{currentUser.name}</div>
              <div className="text-xs text-zinc-500 truncate">{currentUser.email}</div>
            </div>
            <div className={`text-[10px] px-2.5 py-px rounded font-mono tracking-widest ${getRoleColor(currentUser.role)}`}>
              {currentUser.role}
            </div>
          </div>
          
          {showUserMenu && (
            <div className="absolute bottom-24 left-8 bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-700 rounded-3xl py-2 w-64 z-50 text-sm">
              <div className="px-5 py-3 text-xs text-zinc-400 border-b">SWITCH DEMO ROLE</div>
              {mockUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => {
                    setCurrentUser(user);
                    setShowUserMenu(false);
                    // Reset view if the current view isn't allowed
                    if (!navItems.find(n => n.id === currentView)?.roles.includes(user.role)) {
                      setCurrentView('dashboard');
                    }
                  }}
                  className="w-full text-left px-5 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-3"
                >
                  <span>{user.avatar}</span>
                  <div>
                    <div>{user.name}</div>
                    <div className="text-xs text-zinc-400">{user.role}</div>
                  </div>
                </button>
              ))}
              <div className="border-t my-1"></div>
              <button 
                onClick={() => setShowUserMenu(false)}
                className="w-full text-left px-5 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 flex items-center gap-2 text-sm"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg px-8 flex items-center justify-between z-30">
          <div className="flex items-center gap-6 flex-1">
            <div className="flex items-center text-xs uppercase font-mono tracking-[2px] text-zinc-400">
              ACME CORP
            </div>
            
            <div className="h-3.5 w-px bg-zinc-200 dark:bg-zinc-700"></div>
            
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <span className="font-medium text-zinc-500 dark:text-white">Asset Management System</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="relative w-72 hidden md:block">
              <input 
                type="text" 
                placeholder="Quick find asset..." 
                className="w-full bg-zinc-100 dark:bg-zinc-800 text-sm border-none focus:ring-1 h-10 pl-10 rounded-3xl placeholder:text-zinc-400"
              />
              <Search className="absolute left-4 top-3 w-4 h-4 text-zinc-400" />
            </div>

            <button 
              onClick={() => setIsDark(!isDark)}
              className="w-9 h-9 flex items-center justify-center rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className="relative cursor-pointer">
              <button className="w-9 h-9 flex items-center justify-center rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors relative">
                <Bell className="w-4 h-4" />
                {notificationCount > 0 && (
                  <div className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-medium w-4 h-4 flex items-center justify-center rounded-full">
                    {notificationCount}
                  </div>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 pl-6 border-l border-zinc-200 dark:border-zinc-700">
              <div className="text-right text-xs">
                <div className="font-medium text-black dark:text-white text-sm leading-none">{currentUser.name}</div>
                <div className="text-zinc-400">{currentUser.department}</div>
              </div>
              <div className="w-8 h-8 bg-zinc-200 dark:bg-zinc-700 text-xl rounded-2xl flex items-center justify-center">
                {currentUser.avatar}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-10 bg-zinc-50 dark:bg-zinc-950">
          {currentView === 'dashboard' && renderDashboard()}
          {currentView === 'inventory' && renderInventory()}
          {currentView === 'myassets' && renderMyAssets()}
          {currentView === 'assignments' && renderAssignments()}
          {currentView === 'users' && renderUsers()}
          {currentView === 'reports' && renderReports()}
        </div>

        {/* Footer Bar */}
        <div className="h-11 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-700 text-xs flex items-center px-8 text-zinc-400 font-mono">
          ASSETVAULT v24.3.1 — 184 assets tracked • 4 pending maintenance tickets
        </div>
      </div>

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/70 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div 
            className="bg-white dark:bg-zinc-900 w-full max-w-md mx-4 rounded-3xl shadow-2xl" 
            onClick={e => e.stopPropagation()}
          >
            <div className="px-8 pt-8 pb-6 border-b flex items-center justify-between">
              <div>
                <div className="font-semibold text-xl">Register New Asset</div>
                <div className="text-xs text-zinc-500">Add to company inventory</div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-black dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div>
                <label className="text-xs font-medium block mb-2 text-zinc-500">ASSET NAME</label>
                <input 
                  type="text" 
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
                  className="w-full border border-zinc-200 dark:border-zinc-700 focus:border-blue-400 rounded-2xl px-5 py-3 text-sm"
                  placeholder="e.g. Microsoft Surface Laptop 5"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-medium block mb-2 text-zinc-500">CATEGORY</label>
                  <select 
                    value={newAsset.type}
                    onChange={(e) => setNewAsset({...newAsset, type: e.target.value})}
                    className="w-full border border-zinc-200 dark:border-zinc-700 focus:border-blue-400 rounded-2xl px-5 py-3 text-sm"
                  >
                    {assetTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="text-xs font-medium block mb-2 text-zinc-500">VALUE ($)</label>
                  <input 
                    type="number" 
                    value={newAsset.value}
                    onChange={(e) => setNewAsset({...newAsset, value: parseInt(e.target.value) || 0})}
                    className="w-full border border-zinc-200 dark:border-zinc-700 focus:border-blue-400 rounded-2xl px-5 py-3 text-sm"
                    placeholder="1299"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium block mb-2 text-zinc-500">SERIAL / IDENTIFIER</label>
                <input 
                  type="text" 
                  value={newAsset.serialNumber}
                  onChange={(e) => setNewAsset({...newAsset, serialNumber: e.target.value})}
                  className="w-full border border-zinc-200 dark:border-zinc-700 focus:border-blue-400 rounded-2xl px-5 py-3 text-sm font-mono"
                  placeholder="SN-938291"
                />
              </div>
            </div>
            
            <div className="px-8 py-6 border-t flex gap-4">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3.5 text-sm font-medium border border-zinc-300 dark:border-zinc-600 rounded-2xl"
              >
                CANCEL
              </button>
              <button 
                onClick={handleAddAsset}
                className="flex-1 py-3.5 bg-zinc-900 hover:bg-black dark:bg-white dark:text-zinc-900 text-white text-sm font-medium rounded-2xl transition-colors"
              >
                ADD TO INVENTORY
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && selectedAsset && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/70 flex items-center justify-center z-[60]" onClick={() => {setShowAssignModal(false); setSelectedAsset(null);}}>
          <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-3xl" onClick={e => e.stopPropagation()}>
            <div className="p-9">
              <div className="text-sm uppercase tracking-widest text-blue-500 mb-1">ASSIGN ASSET</div>
              <div className="text-2xl font-medium text-zinc-900 dark:text-white">{selectedAsset.name}</div>
              <div className="text-xs text-zinc-400 font-mono mt-1">{selectedAsset.serialNumber}</div>
              
              <div className="my-9">
                <div className="text-xs font-medium mb-4 text-zinc-500">ASSIGN TO TEAM MEMBER</div>
                <div className="space-y-2 max-h-[310px] overflow-auto pr-2">
                  {users.filter(u => u.role !== 'admin').map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleAssignAsset(selectedAsset.id, user.name)}
                      className="flex w-full items-center gap-4 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-4 rounded-2xl text-left transition-all active:scale-[0.985]"
                    >
                      <div className="text-3xl">{user.avatar}</div>
                      <div className="flex-1">
                        <div>{user.name}</div>
                        <div className="text-xs text-zinc-500">{user.department} • {user.email}</div>
                      </div>
                      <div className="text-xs text-emerald-500 font-medium">ASSIGN</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-zinc-100 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-700 px-9 py-6 text-xs flex items-center justify-between rounded-b-3xl">
              <div className="text-zinc-400">The asset status will be updated to ASSIGNED</div>
              <button onClick={() => {setShowAssignModal(false); setSelectedAsset(null);}} className="font-medium">CLOSE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
