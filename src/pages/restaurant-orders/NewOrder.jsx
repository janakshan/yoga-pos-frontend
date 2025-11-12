import { Link } from 'react-router-dom';
import OrderForm from '../../features/restaurant-orders/components/OrderForm';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

/**
 * New Order Page
 * Page for creating a new restaurant order
 */
export const NewOrder = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/orders"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Order</h1>
          <p className="text-gray-600 mt-1">
            Add order details and items to create a new restaurant order
          </p>
        </div>
      </div>

      {/* Order Form */}
      <OrderForm />
    </div>
  );
};

export default NewOrder;
