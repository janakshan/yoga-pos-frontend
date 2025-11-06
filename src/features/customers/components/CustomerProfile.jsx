import React, { useState, useEffect } from 'react';
import {
  User,
  ShoppingBag,
  Award,
  CreditCard,
  DollarSign,
  FileText,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  Gift,
  Tag
} from 'lucide-react';
import { useCustomerCredit, useCustomerNotes, usePurchaseHistory } from '../hooks';
import { customerService } from '../services/customerService';
import {
  CUSTOMER_TYPE_LABELS,
  STATUS_LABELS,
  LOYALTY_TIER_LABELS,
  LOYALTY_TIER_BENEFITS,
  CREDIT_STATUS_LABELS,
  NOTE_TYPE_LABELS,
  NOTE_TYPES,
} from '../types/customer.types';
import toast from 'react-hot-toast';

const CustomerProfile = ({ customer, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState(NOTE_TYPES.GENERAL);
  const [isAddingNote, setIsAddingNote] = useState(false);

  // CRM Hooks
  const {
    fetchCreditTransactions,
    fetchStoreCreditTransactions,
    creditTransactions,
    storeCreditTransactions,
    createCharge,
    createPayment,
    addCredit,
    deductCredit,
    redeemPoints,
  } = useCustomerCredit();

  const {
    fetchCustomerNotes,
    addNote,
    deleteNote,
    customerNotes,
  } = useCustomerNotes();

  const {
    fetchCustomerPurchaseData,
    purchaseHistory,
    purchaseHistoryStats,
  } = usePurchaseHistory();

  // Load CRM data when customer changes
  useEffect(() => {
    if (customer) {
      fetchCreditTransactions(customer.id);
      fetchStoreCreditTransactions(customer.id);
      fetchCustomerNotes(customer.id);
      fetchCustomerPurchaseData(customer.id);
    }
  }, [customer]);

  if (!customer) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'purchase-history', label: 'Purchase History', icon: ShoppingBag },
    { id: 'loyalty', label: 'Loyalty Program', icon: Award },
    { id: 'credit', label: 'Credit Account', icon: CreditCard },
    { id: 'store-credit', label: 'Store Credit', icon: DollarSign },
    { id: 'notes', label: 'Notes', icon: FileText },
  ];

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      toast.error('Please enter a note');
      return;
    }

    try {
      setIsAddingNote(true);
      await addNote(customer.id, {
        note: newNote,
        type: noteType,
      });
      setNewNote('');
      setNoteType(NOTE_TYPES.GENERAL);
    } catch (error) {
      // Error handled in hook
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleRedeemPoints = async () => {
    const points = prompt('How many points would you like to redeem? (100 points = $1)');
    if (!points) return;

    const pointsNum = parseInt(points);
    if (isNaN(pointsNum) || pointsNum <= 0) {
      toast.error('Please enter a valid number of points');
      return;
    }

    try {
      await redeemPoints(customer.id, pointsNum);
      if (onUpdate) {
        const updated = await customerService.getById(customer.id);
        onUpdate(updated);
      }
    } catch (error) {
      // Error handled in hook
    }
  };

  // Overview Tab
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Customer Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Customer Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{customer.firstName} {customer.lastName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Customer Type</p>
            <p className="font-medium">{CUSTOMER_TYPE_LABELS[customer.customerType]}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              customer.status === 'active' ? 'bg-green-100 text-green-800' :
              customer.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
              'bg-red-100 text-red-800'
            }`}>
              {STATUS_LABELS[customer.status]}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Member Since</p>
            <p className="font-medium">{new Date(customer.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <h4 className="text-sm font-semibold mb-3 flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            Contact Information
          </h4>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Mail className="w-4 h-4 mr-2 text-gray-400" />
              <span>{customer.email}</span>
            </div>
            <div className="flex items-center text-sm">
              <Phone className="w-4 h-4 mr-2 text-gray-400" />
              <span>{customer.phone}</span>
            </div>
            {customer.alternatePhone && (
              <div className="flex items-center text-sm">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                <span>{customer.alternatePhone} (Alternate)</span>
              </div>
            )}
            <div className="flex items-start text-sm">
              <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
              <span>
                {customer.address.street}, {customer.address.city}, {customer.address.state} {customer.address.postalCode}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold text-green-600">${customer.stats.totalSpent.toFixed(2)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-blue-600">{customer.stats.totalPurchases}</p>
            </div>
            <ShoppingBag className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Order Value</p>
              <p className="text-2xl font-bold text-purple-600">${customer.stats.averageOrderValue.toFixed(2)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => setActiveTab('loyalty')}
          >
            <Award className="w-4 h-4 inline mr-2" />
            View Loyalty
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            onClick={() => setActiveTab('purchase-history')}
          >
            <ShoppingBag className="w-4 h-4 inline mr-2" />
            View Orders
          </button>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            onClick={() => setActiveTab('credit')}
          >
            <CreditCard className="w-4 h-4 inline mr-2" />
            Credit Account
          </button>
          <button
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            onClick={() => setActiveTab('notes')}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Add Note
          </button>
        </div>
      </div>
    </div>
  );

  // Purchase History Tab
  const renderPurchaseHistory = () => (
    <div className="space-y-4">
      {/* Stats Summary */}
      {purchaseHistoryStats && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Purchase Statistics</h3>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-xl font-bold">{purchaseHistoryStats.totalOrders}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-xl font-bold">${purchaseHistoryStats.totalSpent.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg Order Value</p>
              <p className="text-xl font-bold">${purchaseHistoryStats.averageOrderValue.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Saved</p>
              <p className="text-xl font-bold text-green-600">${purchaseHistoryStats.totalSaved.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Purchase List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {purchaseHistory.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No purchase history available
                  </td>
                </tr>
              ) : (
                purchaseHistory.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{order.items.length} items</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{order.paymentMethod}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Loyalty Tab
  const renderLoyalty = () => {
    const tierBenefits = LOYALTY_TIER_BENEFITS[customer.loyaltyInfo.tier];

    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">{LOYALTY_TIER_LABELS[customer.loyaltyInfo.tier]} Member</h3>
              <p className="text-purple-100">Member since {new Date(customer.loyaltyInfo.joinedDate).toLocaleDateString()}</p>
            </div>
            <Award className="w-16 h-16 opacity-50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-purple-100 text-sm">Current Points</p>
              <p className="text-3xl font-bold">{customer.loyaltyInfo.points}</p>
            </div>
            <div>
              <p className="text-purple-100 text-sm">Lifetime Points</p>
              <p className="text-3xl font-bold">{customer.loyaltyInfo.lifetimePoints || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Tier Benefits</h3>
          <div className="space-y-3">
            {tierBenefits.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center">
                <Gift className="w-5 h-5 text-purple-500 mr-3" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <button
              onClick={handleRedeemPoints}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Redeem Points for Store Credit
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Points Activity</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Points Earned</span>
              <span className="font-medium">{customer.loyaltyInfo.lifetimePoints || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Points Redeemed</span>
              <span className="font-medium">{customer.loyaltyInfo.redeemedPoints || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Current Balance</span>
              <span className="font-medium text-purple-600">{customer.loyaltyInfo.points}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Credit Tab
  const renderCredit = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Credit Account Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Credit Limit</p>
            <p className="text-xl font-bold">${customer.creditInfo?.creditLimit.toFixed(2) || '0.00'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Current Balance</p>
            <p className="text-xl font-bold text-red-600">
              ${customer.creditInfo?.currentBalance.toFixed(2) || '0.00'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Available Credit</p>
            <p className="text-xl font-bold text-green-600">
              ${customer.creditInfo?.availableCredit.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Credit Status</span>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
              customer.creditInfo?.creditStatus === 'good' ? 'bg-green-100 text-green-800' :
              customer.creditInfo?.creditStatus === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {CREDIT_STATUS_LABELS[customer.creditInfo?.creditStatus] || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Credit Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {creditTransactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No credit transactions
                  </td>
                </tr>
              ) : (
                creditTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.type === 'payment' ? 'bg-green-100 text-green-800' :
                        transaction.type === 'charge' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{transaction.description}</td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <span className={transaction.type === 'payment' ? 'text-green-600' : 'text-red-600'}>
                        {transaction.type === 'payment' ? '-' : '+'}${transaction.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ${transaction.balanceAfter.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Store Credit Tab
  const renderStoreCredit = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold">Store Credit Balance</h3>
            <p className="text-green-100">Available to use on purchases</p>
          </div>
          <DollarSign className="w-16 h-16 opacity-50" />
        </div>
        <div>
          <p className="text-4xl font-bold">${customer.storeCredit?.balance.toFixed(2) || '0.00'}</p>
          {customer.storeCredit?.expiryDate && (
            <p className="text-green-100 mt-2">
              Expires: {new Date(customer.storeCredit.expiryDate).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Store Credit Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {storeCreditTransactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No store credit transactions
                  </td>
                </tr>
              ) : (
                storeCreditTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.type === 'credit' ? 'bg-green-100 text-green-800' :
                        transaction.type === 'debit' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{transaction.reason}</td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <span className={transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                        {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ${transaction.balanceAfter.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Notes Tab
  const renderNotes = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Add New Note</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note Type</label>
            <select
              value={noteType}
              onChange={(e) => setNoteType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(NOTE_TYPES).map(([key, value]) => (
                <option key={value} value={value}>
                  {NOTE_TYPE_LABELS[value]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter note..."
            />
          </div>
          <button
            onClick={handleAddNote}
            disabled={isAddingNote}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isAddingNote ? 'Adding...' : 'Add Note'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Notes History</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {customerNotes.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No notes available
            </div>
          ) : (
            customerNotes.map((note) => (
              <div key={note.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mr-2 ${
                        note.type === NOTE_TYPES.SALES ? 'bg-blue-100 text-blue-800' :
                        note.type === NOTE_TYPES.SUPPORT ? 'bg-purple-100 text-purple-800' :
                        note.type === NOTE_TYPES.COMPLAINT ? 'bg-red-100 text-red-800' :
                        note.type === NOTE_TYPES.FEEDBACK ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {NOTE_TYPE_LABELS[note.type]}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(note.createdAt).toLocaleString()} by {note.createdBy}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{note.note}</p>
                  </div>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="ml-4 text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-50 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {customer.firstName} {customer.lastName}
            </h2>
            <p className="text-sm text-gray-500">{customer.email}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'purchase-history' && renderPurchaseHistory()}
          {activeTab === 'loyalty' && renderLoyalty()}
          {activeTab === 'credit' && renderCredit()}
          {activeTab === 'store-credit' && renderStoreCredit()}
          {activeTab === 'notes' && renderNotes()}
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
