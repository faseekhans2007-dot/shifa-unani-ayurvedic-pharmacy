import React, { useState } from 'react';
import { PRODUCTS, DEMO_PATIENT } from '../data/hospitalData';
import { PharmacyProduct } from '../types';
import { ShoppingBag, Search, Tag, Sparkles, CheckCircle2, ChevronRight, RefreshCw, ShoppingCart, Trash2, X, Star } from 'lucide-react';

interface PharmacyProps {
  isLoggedIn: boolean;
}

export default function Pharmacy({ isLoggedIn }: PharmacyProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<{ product: PharmacyProduct; qty: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'Talbina', label: 'Talbina' },
    { id: 'Asava/Arishtas (Liquid)', label: 'Liquids & Arqs (Steam-distilled)' },
    { id: 'Dry Fruits, Honey', label: 'Dry Fruits & Honey' },
    { id: 'Immunity', label: 'Immunity' },
  ];

  const filteredProducts = PRODUCTS.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.ingredients.some((i) => i.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCat = selectedCategory === 'all' || prod.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  // Cart operations
  const addToCart = (product: PharmacyProduct) => {
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([...cart, { product, qty: 1 }]);
    }
    setOrderSuccess(false); // reset order state if adding new pieces
    setIsCartOpen(true); // open cart drawer dynamically to show state feedback
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, increment: boolean) => {
    setCart(
      cart.map((item) => {
        if (item.product.id === productId) {
          const newQty = increment ? item.qty + 1 : item.qty - 1;
          return { ...item, qty: newQty < 1 ? 1 : newQty };
        }
        return item;
      })
    );
  };

  // Pricing math: Faseeh Ahmad gets a 15% Patient Treatment Program discount if checked in!
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.qty, 0);
  const patientDiscount = isLoggedIn ? cartSubtotal * 0.15 : 0;
  const finalTotal = cartSubtotal - patientDiscount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left animate-fade-in relative font-sans">
      
      {/* Header Banner */}
      <section className="space-y-4 max-w-3xl text-left">
        <span className="text-[9px] uppercase tracking-widest font-extrabold text-shifa-gold-dark bg-shifa-mint px-3.5 py-1 rounded-full border border-shifa-green/10">Shifa Apothecary</span>
        <h1 className="text-3xl md:text-5xl font-serif font-black text-shifa-charcoal leading-tight uppercase tracking-tight">
          Pure Traditional Pharmacopoeia
        </h1>
        <p className="text-shifa-charcoal/70 text-sm leading-relaxed font-light">
          Freshly prepared organic Talbina, hand-selected raw therapeutic Honey varieties, premium dry fruits, and advanced natural Immunity formulations prepared strictly following traditional Tibbi wisdom under rigorous modern scientific quality testing.
        </p>
      </section>

      {/* Logged in patient warning banner */}
      {isLoggedIn && (
        <div className="bg-gradient-to-r from-shifa-mint/90 via-white/80 to-shifa-mint/90 text-shifa-green border border-shifa-green/10 p-4 rounded-3xl mt-8 flex gap-3 text-xs justify-between items-center shadow-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-shifa-green" />
          <div className="flex gap-2 items-center relative z-10">
            <span className="font-extrabold text-[#112421] uppercase tracking-widest text-[10px]">15% Active Treatment Discount Activated</span>
            <span className="bg-shifa-green text-white font-mono text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-sm animate-pulse">
              Profile: Faseeh Ahmad
            </span>
          </div>
          <span className="text-shifa-gold-dark text-[10px] uppercase tracking-widest font-extrabold hidden sm:inline relative z-10 bg-white/70 px-3 py-1 rounded-md border border-shifa-green/5">Applied at checkout</span>
        </div>
      )}

      {/* Search & Category Filter bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-10">
        
        {/* Left Side: Category Filter buttons */}
        <div className="lg:col-span-3 space-y-4">
          <span className="text-[9px] text-[#1A2E2A]/50 uppercase tracking-widest font-extrabold block pl-1">
            Browse Categories
          </span>
          <div className="flex flex-wrap lg:flex-col gap-2.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`py-3.5 px-4 text-xs font-bold rounded-2xl text-left border transition-all duration-300 focus:outline-none cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-shifa-green border-shifa-green text-white shadow-xl luxury-button-glow font-extrabold rotate-[0.5deg]'
                    : 'bg-white border-shifa-green/5 text-shifa-charcoal hover:bg-shifa-mint/40 hover:border-shifa-green/20'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Quick Sourcing widget */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-shifa-green/5 mt-8 hidden lg:block space-y-3.5 shadow-md">
            <h4 className="font-sans text-shifa-green font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-shifa-gold animate-bounce" />
              Sourcing Guarantee
            </h4>
            <p className="text-[11px] text-shifa-charcoal/80 leading-relaxed font-light">
              Our apothecary harvests raw botanical elements organically via certified Ayurveda co-ops in India. No chemical fillers, no pesticide residues. Passed through strict microbiological screenings.
            </p>
          </div>
        </div>

        {/* Right Side: Product grids */}
        <div className="lg:col-span-9 space-y-8">
          {/* Active Search Field bar */}
          <div className="relative">
            <Search className="absolute left-4 top-4 text-shifa-charcoal/40 w-4 h-4" />
            <input
              type="text"
              placeholder="Search raw herbs, specific ingredients (Withania, Honey, Rose, Fumaria)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-24 py-4 rounded-2xl border border-shifa-green/10 text-sm focus:outline-none focus:ring-2 focus:ring-shifa-green bg-white text-shifa-charcoal placeholder-shifa-charcoal/40 shadow-sm transition-all focus:shadow-md"
            />
            {cart.length > 0 && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="absolute right-3 top-3 bg-shifa-green hover:bg-[#102C24] text-white font-extrabold text-[9px] uppercase tracking-widest py-1.5 px-3.5 rounded-xl flex items-center gap-1.5 border-0 cursor-pointer shadow-md duration-200 active:scale-95 luxury-button-glow"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-shifa-gold" /> Cart ({cart.reduce((a, c) => a + c.qty, 0)})
              </button>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center bg-white/85 py-14 rounded-3xl border border-shifa-green/10 max-w-md mx-auto p-6 space-y-3 shadow-md">
              <p className="text-sm font-bold text-shifa-charcoal font-serif">No formulas match your criteria</p>
              <p className="text-xs text-shifa-charcoal/60 font-light">Try searching for parameters like Talbina, Honey, or Dry Fruits.</p>
              <button onClick={() => setSearchTerm('')} className="text-xs text-shifa-green font-bold uppercase tracking-widest underline border-0 bg-transparent cursor-pointer select-none">
                Clear active filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-3xl border border-shifa-green/5 overflow-hidden shadow-md shifa-card-hover hover:border-shifa-green/20 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="p-4 space-y-4">
                    {/* Medicine display Image banner */}
                    <div className="w-full h-40 bg-[#FAFBF9] rounded-2xl overflow-hidden relative border border-shifa-green/5">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <span className="absolute bottom-2 left-2 text-[8px] tracking-widest uppercase font-black bg-shifa-green text-white py-1.5 px-3 rounded-md border border-shifa-gold/15 shadow-md">
                        {prod.category}
                      </span>
                      <span className="absolute top-2 right-2 text-[9px] uppercase tracking-widest font-black bg-white/95 text-shifa-green px-2 py-0.5 rounded-md shadow-sm border border-shifa-green/5">
                        ★ {prod.rating}
                      </span>
                    </div>

                    <div className="space-y-1 text-left">
                      <h4 className="font-serif font-black text-shifa-charcoal text-[15px] leading-snug truncate">
                        {prod.name}
                      </h4>
                      <p className="text-[8.5px] text-shifa-gold-dark font-extrabold uppercase tracking-widest mb-1">
                        {prod.isUnani ? 'Classic Unani-Tibb Pharmacology' : 'Ayurvedic Botanical Formula'}
                      </p>
                    </div>

                    <p className="text-[11px] text-[#1A2E2A]/80 leading-relaxed line-clamp-3 text-left font-light">
                      {prod.description}
                    </p>

                    <div className="pt-1 text-left">
                      <span className="text-[8.5px] uppercase text-[#1A2E2A]/50 font-extrabold tracking-widest block mb-1">Key Botanical Actives</span>
                      <div className="flex flex-wrap gap-1">
                        {prod.ingredients.slice(0, 3).map((ing, idx) => (
                          <span
                            key={idx}
                            className="bg-shifa-mint text-shifa-green text-[9px] px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wide border border-shifa-green/5"
                          >
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pricing footer bar */}
                  <div className="p-4 pt-3 border-t border-shifa-green/5 bg-[#FAFBF9]/90 flex justify-between items-center mt-auto">
                    <div className="text-left">
                      <span className="text-[8.5px] text-[#1A2E2A]/50 uppercase tracking-widest font-bold block">APOTHECARY PRICE</span>
                      <strong className="text-shifa-green font-serif text-sm font-black">₹{prod.price}</strong>
                    </div>

                    <button
                      onClick={() => addToCart(prod)}
                      className="bg-shifa-green hover:bg-[#123027] text-white font-extrabold text-[9px] uppercase tracking-widest py-2 px-4 rounded-xl transition-all duration-300 border-0 cursor-pointer shadow-sm hover:scale-[1.03]"
                    >
                      Dispense Pack
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart side panel sliding drawer overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-shifa-charcoal/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-slide-left p-6 relative">
            <button
              onClick={() => {
                setIsCartOpen(false);
                setOrderSuccess(false);
              }}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-shifa-mint text-shifa-charcoal cursor-pointer border-0 bg-transparent"
            >
              <X className="w-5 h-5 text-shifa-charcoal" />
            </button>

            {/* Cart Header */}
            <div className="space-y-1 pb-4 border-b border-shifa-charcoal/10 text-left">
              <h3 className="text-lg font-serif font-black text-shifa-charcoal flex items-center gap-1.5 pt-2 uppercase tracking-wide">
                <ShoppingBag className="w-5 h-5 text-shifa-green" />
                Herbal Cart Ledger
              </h3>
              <p className="text-[11px] text-[#1A2E2A]/60">Track and review raw apothecary formulations selected.</p>
            </div>

            {/* If Order Placed Successfully, render beautiful status */}
            {orderSuccess ? (
              <div className="flex-grow flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-shifa-mint text-shifa-green rounded-full flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-serif font-black text-shifa-charcoal uppercase leading-none">Order Dispatched Successfully!</h3>
                <p className="text-xs text-shifa-charcoal/80 leading-relaxed max-w-xs font-medium">
                  We have forwarded your traditional medicine order to the preparation chambers at M/S Shifa Unani Ayurvedic Apothecary Pharmacy. Packing is initialized for delivery tracking!
                </p>
                <button
                  onClick={() => {
                    setCart([]);
                    setOrderSuccess(false);
                    setIsCartOpen(false);
                  }}
                  className="bg-shifa-green hover:bg-shifa-charcoal text-white font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-widest border-0 cursor-pointer shadow-md"
                >
                  Continue Sourcing
                </button>
              </div>
            ) : (
              <>
                {/* Cart Item container list */}
                <div className="flex-grow overflow-y-auto py-4 space-y-4 pr-1 text-left">
                  {cart.length === 0 ? (
                    <div className="text-center py-20 space-y-2">
                      <p className="text-sm font-bold text-shifa-charcoal font-serif">Apothecary Cart is Empty</p>
                      <p className="text-xs text-shifa-charcoal/60">Load traditional formulas suggested for your body temperament balance.</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex gap-4 p-3.5 bg-[#F5F7F5] rounded-xl border border-shifa-charcoal/10 text-xs text-left"
                      >
                        <div className="w-12 h-12 bg-white rounded-lg overflow-hidden shrink-0 border border-shifa-charcoal/10">
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="flex-grow space-y-1 relative">
                          <h4 className="font-serif font-bold text-shifa-charcoal leading-snug line-clamp-1">{item.product.name}</h4>
                          <p className="text-[10px] text-shifa-charcoal/60 font-semibold">Price: ₹{item.product.price}</p>
                          
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => updateQuantity(item.product.id, false)}
                              className="w-5 h-5 rounded bg-white border border-shifa-charcoal/10 flex items-center justify-center font-bold text-shifa-charcoal"
                            >
                              -
                            </button>
                            <span className="font-mono font-bold text-xs text-shifa-charcoal">{item.qty}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, true)}
                              className="w-5 h-5 rounded bg-white border border-shifa-charcoal/10 flex items-center justify-center font-bold text-shifa-charcoal"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="absolute right-0 bottom-0 p-1 text-shifa-charcoal/40 hover:text-red-600 transition border-0 bg-transparent cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Cart pricing summaries and click actions */}
                {cart.length > 0 && (
                  <div className="pt-4 border-t border-shifa-charcoal/10 space-y-4 text-left">
                    <div className="space-y-1.5 text-xs font-semibold text-shifa-charcoal/80">
                      <div className="flex justify-between">
                        <span>Apothecary Subtotal</span>
                        <span>₹{cartSubtotal}</span>
                      </div>

                      {isLoggedIn && (
                        <div className="flex justify-between font-bold text-shifa-green bg-shifa-mint px-2 py-1.5 rounded border border-shifa-green/10 text-[11px] uppercase tracking-wider">
                          <span>Patient Program Benefit (15%)</span>
                          <span>- ₹{patientDiscount.toFixed(2)}</span>
                        </div>
                      )}

                      <div className="flex justify-between font-bold text-shifa-charcoal border-t border-shifa-charcoal/10 pt-2 text-sm font-serif">
                        <span>Total Apothecary Payable</span>
                        <span className="text-shifa-green">₹{finalTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setOrderSuccess(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-shifa-green hover:bg-shifa-charcoal text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest transition duration-150 transform active:scale-95 cursor-pointer border-0 shadow-md"
                    >
                      Place Prescription Order
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
