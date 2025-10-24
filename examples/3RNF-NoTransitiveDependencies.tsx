import { useState, useMemo, useEffect } from 'react';

/**
 * 3RNF: No Transitive Dependencies Example
 * Rule: State shouldn't depend on other non-key state. Eliminate cascading updates!
 */

// ❌ BAD: Cascading state updates
function BadShoppingCart() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Item 1', price: 10, quantity: 2 },
    { id: 2, name: 'Item 2', price: 20, quantity: 1 }
  ]);
  
  const [cartTotal, setCartTotal] = useState(0); // ❌ Depends on cartItems
  const [itemCount, setItemCount] = useState(0); // ❌ Depends on cartItems
  const [hasDiscount, setHasDiscount] = useState(false); // ❌ Depends on cartTotal

  // Need to manually keep everything in sync
  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setCartTotal(total);
    
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setItemCount(count);
    
    setHasDiscount(total > 100);
  }, [cartItems]);

  return (
    <div>
      <p>Items: {itemCount}</p>
      <p>Total: ${cartTotal}</p>
      {hasDiscount && <p>Discount applied!</p>}
    </div>
  );
}

// ✅ GOOD: Computed dependencies
function GoodShoppingCart() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Item 1', price: 10, quantity: 2 },
    { id: 2, name: 'Item 2', price: 20, quantity: 1 }
  ]);

  // Everything is computed - no manual syncing needed
  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const itemCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const hasDiscount = useMemo(
    () => cartTotal > 100,
    [cartTotal]
  );

  const addItem = (item: typeof cartItems[0]) => {
    setCartItems(prev => [...prev, item]);
    // No need to update cartTotal, itemCount, or hasDiscount!
  };

  return (
    <div>
      <p>Items: {itemCount}</p>
      <p>Total: ${cartTotal}</p>
      {hasDiscount && <p>Discount applied!</p>}
    </div>
  );
}

export { BadShoppingCart, GoodShoppingCart };
