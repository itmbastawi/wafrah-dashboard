'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { HealthScore } from '../../../types/inventory';

interface ProductSearchProps {
  products: HealthScore[];
  selectedProduct: HealthScore | null;
  onSelectProduct: (product: HealthScore) => void;
  placeholder?: string;
}

export function ProductSearch({
  products,
  selectedProduct,
  onSelectProduct,
  placeholder = 'Select a product...',
}: ProductSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    return products.filter((p) =>
      p.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  return (
    <div className="relative w-full max-w-sm">
      <div
        className="flex items-center gap-2 bg-surface-hover border border-border-default rounded-xl px-3 py-2.5 cursor-pointer hover:border-primary/30 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Search className="w-4 h-4 text-text-muted flex-shrink-0" />
        <input
          type="text"
          className="flex-1 bg-transparent text-sm text-text-primary placeholder-text-muted focus:outline-none"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onClick={(e) => e.stopPropagation()}
        />
        <ChevronDown
          className={`w-4 h-4 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-surface-elevated border border-border-default rounded-xl shadow-lg z-20 max-h-64 overflow-y-auto">
            {filteredProducts.length === 0 ? (
              <div className="px-4 py-3 text-sm text-text-muted">
                No products found
              </div>
            ) : (
              filteredProducts.map((product) => (
                <button
                  key={product.product_key}
                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-surface-hover transition-colors border-b border-border-default/50 last:border-b-0 ${
                    selectedProduct?.product_key === product.product_key
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-primary'
                  }`}
                  onClick={() => {
                    onSelectProduct(product);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                >
                  {product.product_name}
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
