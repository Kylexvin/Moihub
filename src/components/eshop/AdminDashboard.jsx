import { useState, useEffect } from 'react';
import { Calendar, ChevronDown, ChevronUp, Plus, RefreshCw, Check, Search } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedApp, setExpandedApp] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', icon: '' });
  const [selectedDate, setSelectedDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [approvingId, setApprovingId] = useState(null);
  const [customIcon, setCustomIcon] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Available icons for categories
  const icons = ['tshirt', 'smartphone', 'coffee', 'book', 'gift', 'home', 'utensils', 'heartbeat', 'car', 'plane', 'music'];

  // Fetch data from API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch vendor applications
      const appRes = await fetch('https://moihub.onrender.com/api/eshop/admin/vendor-applications', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const appData = await appRes.json();
      
      // Fetch categories
      const catRes = await fetch('https://moihub.onrender.com/api/eshop/vendor/categories', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const catData = await catRes.json();
      
      setApplications(appData.data || []);
      setCategories(catData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create new category
  const createCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/eshop/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newCategory)
      });
      
      if (res.ok) {
        // Reset form and refresh data
        setNewCategory({ name: '', description: '', icon: '' });
        setCustomIcon(false);
        fetchData();
      }
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  // Approve vendor application
  const approveVendor = async (id) => {
    try {
      setApprovingId(id);
  
      // Auto-calculate if no selectedDate
      const today = new Date();
      const autoDate = new Date(today.setDate(today.getDate() + 30));
      const finalDate = selectedDate || autoDate.toISOString().split('T')[0];
  
      const res = await fetch(`http://localhost:5000/api/eshop/admin/vendor/${id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          isApproved: true,
          subscriptionEndDate: finalDate
        })
      });
  
      if (res.ok) {
        fetchData();
        setShowDatePicker(false);
        setSelectedDate('');
      } else {
        const error = await res.json();
        console.error('Approval failed:', error.message);
      }
    } catch (error) {
      console.error('Error approving vendor:', error);
    } finally {
      setApprovingId(null);
    }
  };
  

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Filter applications based on search term
  const filteredApplications = applications.filter(app => 
    app.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-indigo-700 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">E-Shop Admin Dashboard</h1>
          <button 
            onClick={fetchData} 
            className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-800 transition-colors"
            title="Refresh data"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex">
          <button 
            className={`px-6 py-3 font-medium transition-colors ${activeTab === 'applications' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
            onClick={() => setActiveTab('applications')}
          >
            Vendor Applications
          </button>
          <button 
            className={`px-6 py-3 font-medium transition-colors ${activeTab === 'categories' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
            onClick={() => setActiveTab('categories')}
          >
            Categories
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-4 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <RefreshCw className="animate-spin h-8 w-8 text-indigo-600" />
          </div>
        ) : (
          <>
{/* Vendor Applications Tab */}
{activeTab === 'applications' && (
  <div>
    <div className="flex justify-between mb-4 items-center">
      <h2 className="text-lg font-semibold">Vendor Applications</h2>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search applications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>

    {filteredApplications.length === 0 ? (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <p className="text-gray-500">
          {searchTerm ? 'No matching applications found' : 'No applications found'}
        </p>
      </div>
    ) : (
      <div className="space-y-4">
        {filteredApplications.map((app) => (
          <div key={app._id} className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setExpandedApp(expandedApp === app._id ? null : app._id)}
            >
              <div>
                <h3 className="font-medium">{app.shopName}</h3>
                <p className="text-sm text-gray-500">{app.category?.name || 'No category'}</p>
              </div>
              <div className="flex items-center">
                {app.isApproved ? (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full mr-2 font-medium">Approved</span>
                ) : (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full mr-2 font-medium">Pending</span>
                )}
                {expandedApp === app._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>

            {expandedApp === app._id && (
              <div className="mt-4 border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500 uppercase font-medium">Email</p>
                    <p className="text-sm">{app.user?.email}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500 uppercase font-medium">Phone</p>
                    <p className="text-sm">{app.phoneNumber}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500 uppercase font-medium">Address</p>
                    <p className="text-sm">{app.address}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500 uppercase font-medium">Created</p>
                    <p className="text-sm">{formatDate(app.createdAt)}</p>
                  </div>
                  <div className="md:col-span-2 bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500 uppercase font-medium">Description</p>
                    <p className="text-sm">{app.description}</p>
                  </div>
                </div>

                {!app.isApproved && (
                  <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">Approval Process</h4>

                    <div className="relative mb-2">
                      <div className="flex items-center mb-2">
                        <label className="text-sm text-gray-600 mr-2">Subscription End Date:</label>
                        <button 
                          onClick={() => setShowDatePicker(!showDatePicker)}
                          className="text-sm flex items-center text-indigo-600 bg-white py-1 px-2 rounded border hover:bg-indigo-50"
                        >
                          <Calendar size={16} className="mr-1" />
                          {selectedDate ? formatDate(selectedDate) : 'Auto-set to +30 days'}
                        </button>
                      </div>

                      {showDatePicker && (
                        <div className="absolute z-10 bg-white p-3 border rounded-lg shadow-lg mt-1">
                          <input 
                            type="date" 
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <div className="flex justify-end mt-2">
                            <button 
                              onClick={() => setShowDatePicker(false)}
                              className="text-sm text-gray-500 px-3 py-1 mr-2 hover:bg-gray-100 rounded"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={() => setShowDatePicker(false)}
                              className="text-sm text-white bg-indigo-600 px-3 py-1 rounded hover:bg-indigo-700"
                            >
                              Confirm
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 italic mb-3">
                      {selectedDate 
                        ? `Using selected date: ${formatDate(selectedDate)}` 
                        : 'No date selected — will auto-approve for 30 days from today'}
                    </p>

                    <button 
                      onClick={() => approveVendor(app._id)}
                      disabled={approvingId === app._id}
                      className={`mt-1 flex justify-center items-center py-2 px-4 rounded-lg w-full md:w-auto ${
                        approvingId !== app._id
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      } transition-colors`}
                    >
                      {approvingId === app._id ? (
                        <RefreshCw size={16} className="animate-spin mr-2" />
                      ) : (
                        <Check size={16} className="mr-2" />
                      )}
                      Approve Vendor
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
)}

            
            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Categories</h2>
                
                {/* New Category Form */}
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                  <h3 className="font-medium mb-4 text-indigo-800">Create New Category</h3>
                  <form onSubmit={createCategory}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1 font-medium">Name</label>
                        <input
                          type="text"
                          required
                          value={newCategory.name}
                          onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Category name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1 font-medium">Icon</label>
                        <div className="flex items-center mb-2">
                          <div className="flex-1">
                            {!customIcon ? (
                              <select
                                value={newCategory.icon}
                                onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required={!customIcon}
                                disabled={customIcon}
                              >
                                <option value="">Select an icon</option>
                                {icons.map(icon => (
                                  <option key={icon} value={icon}>{icon}</option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="text"
                                value={newCategory.icon}
                                onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter custom icon name"
                                required={customIcon}
                                disabled={!customIcon}
                              />
                            )}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="customIcon"
                            checked={customIcon}
                            onChange={() => {
                              setCustomIcon(!customIcon);
                              setNewCategory({...newCategory, icon: ''});
                            }}
                            className="mr-2"
                          />
                          <label htmlFor="customIcon" className="text-xs text-gray-500">Use custom icon</label>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-gray-600 mb-1 font-medium">Description</label>
                        <textarea
                          required
                          value={newCategory.description}
                          onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Category description"
                          rows="2"
                        />
                      </div>
                    </div>
                    <button 
                      type="submit"
                      className="mt-4 flex items-center justify-center bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Plus size={16} className="mr-2" />
                      Create Category
                    </button>
                  </form>
                </div>
                
                {/* Categories List */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {categories.length === 0 ? (
                    <div className="col-span-3 bg-white rounded-lg shadow-sm border p-8 text-center">
                      <p className="text-gray-500">No categories found</p>
                    </div>
                  ) : (
                    categories.map((category) => (
                      <div key={category._id} className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium text-indigo-800">{category.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                          </div>
                          <div className="flex items-center justify-center h-10 w-10 bg-indigo-100 text-indigo-600 rounded-full">
                            <span className="text-xs font-medium">{category.icon}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}