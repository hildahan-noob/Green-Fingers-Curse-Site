import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, CheckCircle2 } from 'lucide-react';
import { CartItem, Voucher } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  vouchers: Voucher[];
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  vouchers,
  onClearCart,
}) => {
  const [selectedVoucherId, setSelectedVoucherId] = useState<string | null>(null);
  const [isCheckedOut, setIsCheckedOut] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const activeVoucher = vouchers.find((v) => v.id === selectedVoucherId);
  const discountAmount = activeVoucher && subtotal >= activeVoucher.minSpend ? activeVoucher.discount : 0;
  const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 5.99) : 0;
  const total = Math.max(0, subtotal - discountAmount + shipping);

  const handleCheckout = () => {
    setIsCheckedOut(true);
    setTimeout(() => {
      onClearCart();
      setIsCheckedOut(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1a1c1c] w-full max-w-md h-full flex flex-col shadow-2xl border-l border-[#e4bdc2]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#e2e2e2] bg-[#f9f9f9]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#e91e63]" />
            <h2 className="font-bold text-lg text-[#1a1c1c]">Your Shopping Cart</h2>
            <span className="text-xs bg-[#e91e63]/10 text-[#e91e63] px-2 py-0.5 rounded-full font-bold">
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)} items
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isCheckedOut ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-300">
            <CheckCircle2 className="w-16 h-16 text-[#006b1b] mb-4 animate-bounce" />
            <h3 className="font-bold text-2xl text-[#1a1c1c] mb-2">Order Confirmed!</h3>
            <p className="text-sm text-gray-600 mb-4">
              Thank you for shopping at Noi Gardens! Your plants are being carefully prepared for shipping.
            </p>
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-800 font-medium">
              Order #NG-2026-{Math.floor(1000 + Math.random() * 9000)}
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-[#e91e63]" />
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-1">Your cart is empty</h3>
            <p className="text-xs text-gray-500 mb-6 max-w-xs">
              Explore our curated collections and bring home vibrant greenery today!
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#e91e63] text-white rounded-full text-xs font-bold shadow-md hover:bg-[#b80049] transition-all cursor-pointer"
            >
              Browse Plants
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cartItems.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-3 bg-[#f9f9f9] p-3 rounded-xl border border-[#e2e2e2] items-center"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-[#1a1c1c] truncate">{product.name}</h4>
                    <p className="text-xs text-gray-500 italic">{product.botanicalName}</p>
                    <p className="text-sm font-extrabold text-[#e91e63] mt-1">${product.price.toFixed(2)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => onRemoveItem(product.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-1.5 bg-white border border-gray-300 rounded-md px-1 py-0.5">
                      <button
                        onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                        className="p-0.5 hover:bg-gray-100 rounded text-gray-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                        className="p-0.5 hover:bg-gray-100 rounded text-gray-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Vouchers Section */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-1.5 mb-2">
                  <Tag className="w-4 h-4 text-[#e91e63]" />
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Available Vouchers
                  </h4>
                </div>
                <div className="space-y-2">
                  {vouchers.map((v) => {
                    const isEligible = subtotal >= v.minSpend;
                    const isSelected = selectedVoucherId === v.id;
                    return (
                      <div
                        key={v.id}
                        onClick={() => {
                          if (isEligible) {
                            setSelectedVoucherId(isSelected ? null : v.id);
                          }
                        }}
                        className={`p-2.5 rounded-lg border text-xs flex justify-between items-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-pink-50 border-[#e91e63] text-[#e91e63]'
                            : isEligible
                            ? 'bg-white border-gray-200 hover:border-pink-300'
                            : 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                        }`}
                      >
                        <div>
                          <span className="font-bold">${v.discount} OFF</span>
                          <span className="ml-2 text-[10px]">Min spend ${v.minSpend}</span>
                        </div>
                        <button
                          type="button"
                          disabled={!isEligible}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isSelected
                              ? 'bg-[#e91e63] text-white'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {isSelected ? 'Applied ✓' : isEligible ? 'Apply' : 'Min Spend $ ' + v.minSpend}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer / Summary */}
            <div className="p-4 bg-[#f9f9f9] border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold">${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-xs text-[#e91e63] font-bold">
                  <span>Voucher Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-gray-600">
                <span>Estimated Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-[#1a1c1c] pt-2 border-t border-gray-200">
                <span>Total Payment</span>
                <span className="text-[#e91e63]">${total.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-3 py-3 bg-[#e91e63] hover:bg-[#b80049] text-white rounded-full font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
