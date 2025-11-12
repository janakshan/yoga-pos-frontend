import { useState, useEffect } from 'react';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useStore } from '../../../store';
import { generateId } from '../../../utils/generateId';

const IngredientSelector = ({ onSelect, onClose }) => {
  const products = useStore((state) => state.products);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [ingredientData, setIngredientData] = useState({
    quantity: 1,
    unit: 'g',
    unitCost: 0,
    notes: '',
  });

  useEffect(() => {
    // Filter products based on search term
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setIngredientData((prev) => ({
      ...prev,
      unitCost: product.cost || 0,
    }));
  };

  const handleAddIngredient = () => {
    if (!selectedProduct) return;

    const ingredient = {
      id: generateId('recipe_ingredient'),
      inventoryItemId: selectedProduct.id,
      inventoryItemName: selectedProduct.name,
      inventoryItemSku: selectedProduct.sku || '',
      quantity: parseFloat(ingredientData.quantity) || 0,
      unit: ingredientData.unit,
      unitCost: parseFloat(ingredientData.unitCost) || 0,
      totalCost:
        (parseFloat(ingredientData.quantity) || 0) * (parseFloat(ingredientData.unitCost) || 0),
      notes: ingredientData.notes,
      isOptional: false,
      substituteIngredients: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSelect(ingredient);
    handleClose();
  };

  const handleClose = () => {
    setSelectedProduct(null);
    setIngredientData({
      quantity: 1,
      unit: 'g',
      unitCost: 0,
      notes: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black opacity-30" onClick={handleClose}></div>

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Select Ingredient</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Choose from Inventory
                </h3>

                {/* Search */}
                <div className="relative mb-4">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Product List */}
                <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
                  {filteredProducts.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      {searchTerm ? 'No products found' : 'No products available'}
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {filteredProducts.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleProductSelect(product)}
                          className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                            selectedProduct?.id === product.id ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-500">SKU: {product.sku || 'N/A'}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">
                                Cost: ${(product.cost || 0).toFixed(2)}
                              </p>
                              <p className="text-xs text-gray-500">
                                Stock: {product.stockQuantity || 0} {product.unit || 'units'}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Ingredient Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingredient Details</h3>

                {selectedProduct ? (
                  <div className="space-y-4">
                    {/* Selected Product Info */}
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="font-medium text-gray-900">{selectedProduct.name}</p>
                      <p className="text-sm text-gray-600">{selectedProduct.sku}</p>
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={ingredientData.quantity}
                        onChange={(e) =>
                          setIngredientData((prev) => ({
                            ...prev,
                            quantity: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter quantity"
                      />
                    </div>

                    {/* Unit */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit *
                      </label>
                      <select
                        value={ingredientData.unit}
                        onChange={(e) =>
                          setIngredientData((prev) => ({
                            ...prev,
                            unit: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="g">Grams (g)</option>
                        <option value="kg">Kilograms (kg)</option>
                        <option value="ml">Milliliters (ml)</option>
                        <option value="l">Liters (l)</option>
                        <option value="oz">Ounces (oz)</option>
                        <option value="lb">Pounds (lb)</option>
                        <option value="cup">Cups</option>
                        <option value="tbsp">Tablespoons (tbsp)</option>
                        <option value="tsp">Teaspoons (tsp)</option>
                        <option value="pcs">Pieces (pcs)</option>
                        <option value="units">Units</option>
                      </select>
                    </div>

                    {/* Unit Cost */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit Cost ($) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={ingredientData.unitCost}
                        onChange={(e) =>
                          setIngredientData((prev) => ({
                            ...prev,
                            unitCost: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Cost per unit"
                      />
                    </div>

                    {/* Total Cost (calculated) */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Total Cost:</span>
                        <span className="text-lg font-bold text-blue-600">
                          $
                          {(
                            (parseFloat(ingredientData.quantity) || 0) *
                            (parseFloat(ingredientData.unitCost) || 0)
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes (Optional)
                      </label>
                      <textarea
                        value={ingredientData.notes}
                        onChange={(e) =>
                          setIngredientData((prev) => ({
                            ...prev,
                            notes: e.target.value,
                          }))
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Additional notes for this ingredient"
                      />
                    </div>

                    {/* Add Button */}
                    <button
                      onClick={handleAddIngredient}
                      disabled={
                        !selectedProduct ||
                        !ingredientData.quantity ||
                        parseFloat(ingredientData.quantity) <= 0
                      }
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Ingredient
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-center">
                      Select a product from the list to add as an ingredient
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngredientSelector;
