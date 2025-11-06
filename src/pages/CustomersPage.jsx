import React, { useState, useEffect } from 'react';
import { useCustomers } from '../features/customers/hooks/useCustomers.js';
import { CustomerForm } from '../features/customers/components/CustomerForm.jsx';
import { CustomerList } from '../features/customers/components/CustomerList.jsx';
import { Plus, Search, Filter, Download, Users } from 'lucide-react';
import {
  CUSTOMER_TYPES,
  CUSTOMER_STATUS,
  LOYALTY_TIERS,
  CUSTOMER_TYPE_LABELS,
  STATUS_LABELS,
  LOYALTY_TIER_LABELS,
} from '../features/customers/types/customer.types.js';

const CustomersPage = () => {
  const {
    customers,
    isLoading,
    stats,
    fetchCustomers,
    fetchCustomerStats,
    createCustomer,
    updateCustomerById,
    deleteCustomer,
  } = useCustomers();

  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    customerType: '',
    loyaltyTier: '',
  });

  // Fetch customers on mount
  useEffect(() => {
    fetchCustomers();
    fetchCustomerStats();
  }, []);

  // Filter customers based on search and filters
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      searchTerm === '' ||
      customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);

    const matchesStatus = !filters.status || customer.status === filters.status;
    const matchesType = !filters.customerType || customer.customerType === filters.customerType;
    const matchesTier =
      !filters.loyaltyTier || customer.loyaltyInfo.tier === filters.loyaltyTier;

    return matchesSearch && matchesStatus && matchesType && matchesTier;
  });

  const handleCreateCustomer = async (data) => {
    try {
      await createCustomer(data);
      setShowForm(false);
      fetchCustomerStats();
    } catch (error) {
      console.error('Failed to create customer:', error);
    }
  };

  const handleUpdateCustomer = async (data) => {
    try {
      await updateCustomerById(editingCustomer.id, data);
      setEditingCustomer(null);
      setShowForm(false);
      fetchCustomerStats();
    } catch (error) {
      console.error('Failed to update customer:', error);
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleDelete = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(customerId);
        fetchCustomerStats();
      } catch (error) {
        console.error('Failed to delete customer:', error);
      }
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCustomer(null);
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      customerType: '',
      loyaltyTier: '',
    });
    setSearchTerm('');
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Customers</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your customer database and relationships
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 sm:px-6 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Customers</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCustomers}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Active Customers</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">{stats.activeCustomers}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 rounded-full p-3">
                <Users className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">VIP Customers</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.vipCustomers}</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-3">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  ${stats.totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full p-3">
                <Download className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 sm:px-6 pb-6 overflow-auto">
        {showForm ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <CustomerForm
              initialData={editingCustomer}
              onSubmit={editingCustomer ? handleUpdateCustomer : handleCreateCustomer}
              onCancel={handleCancelForm}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search */}
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search customers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  >
                    <option value="">All Status</option>
                    {Object.entries(CUSTOMER_STATUS).map(([key, value]) => (
                      <option key={value} value={value}>
                        {STATUS_LABELS[value]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type Filter */}
                <div>
                  <select
                    value={filters.customerType}
                    onChange={(e) => setFilters({ ...filters, customerType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  >
                    <option value="">All Types</option>
                    {Object.entries(CUSTOMER_TYPES).map(([key, value]) => (
                      <option key={value} value={value}>
                        {CUSTOMER_TYPE_LABELS[value]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Loyalty Tier Filter */}
                <div>
                  <select
                    value={filters.loyaltyTier}
                    onChange={(e) => setFilters({ ...filters, loyaltyTier: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  >
                    <option value="">All Tiers</option>
                    {Object.entries(LOYALTY_TIERS).map(([key, value]) => (
                      <option key={value} value={value}>
                        {LOYALTY_TIER_LABELS[value]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              {(searchTerm || filters.status || filters.customerType || filters.loyaltyTier) && (
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {filteredCustomers.length} of {customers.length} customers
                  </p>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            {/* Customer List */}
            <CustomerList
              customers={filteredCustomers}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomersPage;
