import React, { useEffect } from 'react';
import { UtensilsCrossed, Users, MapPin, ShoppingBag, Truck, Globe } from 'lucide-react';
import { useStore } from '../../../store';
import { useTables } from '../../restaurant/tables/hooks/useTables';
import { useUsers } from '../../users/hooks/useUsers';
import { SERVICE_TYPE, SERVICE_TYPE_LABELS } from '../../restaurant-orders/types/order.types';

/**
 * RestaurantPOSHeader Component
 * Restaurant-specific controls for table, service type, and server selection
 * @returns {JSX.Element}
 */
export const RestaurantPOSHeader = () => {
  const tableId = useStore((state) => state.tableId);
  const tableName = useStore((state) => state.tableName);
  const serviceType = useStore((state) => state.serviceType);
  const serverId = useStore((state) => state.serverId);
  const serverName = useStore((state) => state.serverName);
  const setTable = useStore((state) => state.setTable);
  const setServiceType = useStore((state) => state.setServiceType);
  const setServer = useStore((state) => state.setServer);

  const { tables, fetchTables } = useTables();
  const { users, fetchUsers } = useUsers();

  useEffect(() => {
    fetchTables();
    fetchUsers({ role: 'waiter' }); // Fetch only waiters/servers
  }, []);

  const handleTableChange = (e) => {
    const selectedTableId = e.target.value;
    if (selectedTableId) {
      const table = tables.find((t) => t.id === selectedTableId);
      setTable(table.id, table.number);
    } else {
      setTable(null, null);
    }
  };

  const handleServerChange = (e) => {
    const selectedServerId = e.target.value;
    if (selectedServerId) {
      const server = users.find((u) => u.id === selectedServerId);
      setServer(server.id, `${server.firstName} ${server.lastName}`);
    } else {
      setServer(null, null);
    }
  };

  const serviceTypeIcons = {
    [SERVICE_TYPE.DINE_IN]: MapPin,
    [SERVICE_TYPE.TAKEAWAY]: ShoppingBag,
    [SERVICE_TYPE.DELIVERY]: Truck,
    [SERVICE_TYPE.ONLINE]: Globe,
  };

  const availableTables = tables.filter((t) => t.status === 'available' || t.id === tableId);

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 shadow-md">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-6 w-6 text-white" />
            <h2 className="text-xl font-bold text-white">Restaurant POS</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Service Type Selector */}
          <div>
            <label className="block text-xs font-medium text-orange-100 mb-1">
              Service Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(SERVICE_TYPE).map(([key, value]) => {
                const Icon = serviceTypeIcons[value];
                return (
                  <button
                    key={value}
                    onClick={() => setServiceType(value)}
                    className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      serviceType === value
                        ? 'bg-white text-orange-600 shadow-lg'
                        : 'bg-orange-600/30 text-white hover:bg-orange-600/50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{SERVICE_TYPE_LABELS[value]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table Selector (only for dine-in) */}
          {serviceType === SERVICE_TYPE.DINE_IN && (
            <div>
              <label className="block text-xs font-medium text-orange-100 mb-1">
                Table
              </label>
              <select
                value={tableId || ''}
                onChange={handleTableChange}
                className="w-full px-3 py-2 bg-white rounded-lg focus:ring-2 focus:ring-orange-300 focus:outline-none text-gray-900 font-medium"
              >
                <option value="">Select Table</option>
                {availableTables.map((table) => (
                  <option key={table.id} value={table.id}>
                    {table.number} - Cap: {table.capacity}
                    {table.section ? ` (${table.section})` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Server Selector */}
          <div className={serviceType === SERVICE_TYPE.DINE_IN ? '' : 'md:col-span-2'}>
            <label className="block text-xs font-medium text-orange-100 mb-1">
              Server / Waiter
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={serverId || ''}
                onChange={handleServerChange}
                className="w-full pl-10 pr-3 py-2 bg-white rounded-lg focus:ring-2 focus:ring-orange-300 focus:outline-none text-gray-900 font-medium appearance-none"
              >
                <option value="">No Server Assigned</option>
                {users
                  .filter((u) => u.role === 'waiter' || u.role === 'admin')
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        {/* Display Selected Info */}
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {serviceType && (
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white font-medium">
              {SERVICE_TYPE_LABELS[serviceType]}
            </div>
          )}
          {tableName && (
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white font-medium">
              <MapPin className="h-3 w-3 inline mr-1" />
              {tableName}
            </div>
          )}
          {serverName && (
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white font-medium">
              <Users className="h-3 w-3 inline mr-1" />
              {serverName}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantPOSHeader;
