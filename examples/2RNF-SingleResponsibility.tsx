import { useState, useMemo } from 'react';

/**
 * 2RNF: Single Responsibility Example
 * Rule: Each state should have a single reason to change. Derived state should be computed!
 */

// ❌ BAD: Redundant derived state
function BadUserCard() {
  const [user, setUser] = useState({
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe', // ❌ Redundant!
    email: 'john@example.com',
    displayName: 'John Doe (john@example.com)' // ❌ Redundant!
  });

  // Now we have to manually keep fullName and displayName in sync
  const updateFirstName = (newName: string) => {
    setUser(prev => ({
      ...prev,
      firstName: newName,
      fullName: `${newName} ${prev.lastName}`, // Manual sync
      displayName: `${newName} ${prev.lastName} (${prev.email})` // Manual sync
    }));
  };

  return <h1>{user.displayName}</h1>;
}

// ✅ GOOD: Single source of truth with computed values
function GoodUserCard() {
  const [user, setUser] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com'
  });

  // Computed values are automatically in sync
  const fullName = useMemo(
    () => `${user.firstName} ${user.lastName}`,
    [user.firstName, user.lastName]
  );

  const displayName = useMemo(
    () => `${fullName} (${user.email})`,
    [fullName, user.email]
  );

  // Simple update - no manual syncing needed
  const updateFirstName = (newName: string) => {
    setUser(prev => ({ ...prev, firstName: newName }));
  };

  return <h1>{displayName}</h1>;
}

// ✅ Another example: Price calculations
function ProductCard() {
  const [product, setProduct] = useState({
    price: 100,
    quantity: 2,
    taxRate: 0.1
  });

  // All calculations are derived
  const subtotal = useMemo(
    () => product.price * product.quantity,
    [product.price, product.quantity]
  );

  const tax = useMemo(
    () => subtotal * product.taxRate,
    [subtotal, product.taxRate]
  );

  const total = useMemo(
    () => subtotal + tax,
    [subtotal, tax]
  );

  return (
    <div>
      <p>Subtotal: ${subtotal}</p>
      <p>Tax: ${tax}</p>
      <p>Total: ${total}</p>
    </div>
  );
}

export { BadUserCard, GoodUserCard, ProductCard };
