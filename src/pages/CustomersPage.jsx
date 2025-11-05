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
    <div className="h-full flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your customer database and relationships
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Customers</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeCustomers}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">VIP Customers</p>
                <p className="text-2xl font-bold text-purple-600">{stats.vipCustomers}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <Download className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-6 overflow-auto">
        {showForm ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search */}
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search customers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Showing {filteredCustomers.length} of {customers.length} customers
                  </p>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700"
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
