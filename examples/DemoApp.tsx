import React, { useState } from 'react';
import { 
  GoodUserProfile,
  GoodUserCard,
  ProductCard,
  GoodShoppingCart,
  BlogPostsWithHook,
  GoodComponent,
  useAuthStore,
  useUIStore
} from './index';

/**
 * Interactive Demo App showcasing all 5 React Normalization Rules
 */

function DemoApp() {
  const [activeTab, setActiveTab] = useState<'1RNF' | '2RNF' | '3RNF' | '4RNF' | '5RNF'>('1RNF');

  const tabs = [
    { id: '1RNF', label: '1RNF: Atomic State', description: 'Break down nested state' },
    { id: '2RNF', label: '2RNF: Single Responsibility', description: 'Compute derived state' },
    { id: '3RNF', label: '3RNF: No Transitive Deps', description: 'Eliminate cascading updates' },
    { id: '4RNF', label: '4RNF: Normalized Collections', description: 'Avoid data duplication' },
    { id: '5RNF', label: '5RNF: Context Separation', description: 'Separate concerns' }
  ];

  return (
    <div style={{ fontFamily: 'system-ui', maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⚛️ 5 React Normalization Rules</h1>
        <p style={{ fontSize: '1.25rem', color: '#666' }}>
          Database normalization principles applied to React state management
        </p>
      </header>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        borderBottom: '2px solid #e0e0e0',
        overflowX: 'auto'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '1rem 1.5rem',
              border: 'none',
              background: activeTab === tab.id ? '#007bff' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#333',
              cursor: 'pointer',
              borderRadius: '8px 8px 0 0',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            <div>{tab.label}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{tab.description}</div>
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ 
        background: '#f8f9fa', 
        padding: '2rem', 
        borderRadius: '8px',
        minHeight: '400px'
      }}>
        {activeTab === '1RNF' && <Demo1RNF />}
        {activeTab === '2RNF' && <Demo2RNF />}
        {activeTab === '3RNF' && <Demo3RNF />}
        {activeTab === '4RNF' && <Demo4RNF />}
        {activeTab === '5RNF' && <Demo5RNF />}
      </div>

      {/* Benefits */}
      <div style={{ 
        marginTop: '3rem', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem'
      }}>
        {[
          { icon: '⚡', title: 'Better Performance', desc: 'Minimize re-renders' },
          { icon: '🐛', title: 'Easier Debugging', desc: 'Clear state structure' },
          { icon: '✨', title: 'Cleaner Code', desc: 'Proven patterns' },
          { icon: '👥', title: 'Team-Friendly', desc: 'Easy to maintain' }
        ].map(benefit => (
          <div key={benefit.title} style={{ 
            padding: '1.5rem', 
            background: 'white', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{benefit.icon}</div>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{benefit.title}</h3>
            <p style={{ margin: 0, color: '#666' }}>{benefit.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Demo1RNF() {
  return (
    <div>
      <h2>1RNF: Atomic State</h2>
      <p>Each state variable should contain only primitive values or simple objects.</p>
      
      <div style={{ 
        background: 'white', 
        padding: '1.5rem', 
        borderRadius: '8px',
        marginTop: '1rem'
      }}>
        <h3>✅ Good Example: Flat, independent state</h3>
        <GoodUserProfile />
        
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#e8f5e9', borderRadius: '4px' }}>
          <strong>Benefits:</strong>
          <ul>
            <li>Simple updates - no deep nesting</li>
            <li>Easy to test individual pieces</li>
            <li>Clear separation of concerns</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Demo2RNF() {
  return (
    <div>
      <h2>2RNF: Single Responsibility</h2>
      <p>Each state should have a single reason to change. Derived state should be computed!</p>
      
      <div style={{ 
        background: 'white', 
        padding: '1.5rem', 
        borderRadius: '8px',
        marginTop: '1rem'
      }}>
        <h3>✅ User Card with Computed Values</h3>
        <GoodUserCard />
        
        <h3 style={{ marginTop: '2rem' }}>✅ Product with Calculated Pricing</h3>
        <ProductCard />
        
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#e3f2fd', borderRadius: '4px' }}>
          <strong>Benefits:</strong>
          <ul>
            <li>No manual syncing required</li>
            <li>Always consistent - computed values auto-update</li>
            <li>Single source of truth</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Demo3RNF() {
  return (
    <div>
      <h2>3RNF: No Transitive Dependencies</h2>
      <p>State shouldn't depend on other non-key state. Eliminate cascading updates!</p>
      
      <div style={{ 
        background: 'white', 
        padding: '1.5rem', 
        borderRadius: '8px',
        marginTop: '1rem'
      }}>
        <h3>✅ Shopping Cart Example</h3>
        <GoodShoppingCart />
        
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff3e0', borderRadius: '4px' }}>
          <strong>Benefits:</strong>
          <ul>
            <li>No useEffect needed to sync state</li>
            <li>Performance: useMemo prevents unnecessary recalculations</li>
            <li>No risk of state getting out of sync</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Demo4RNF() {
  return (
    <div>
      <h2>4RNF: Normalized Collections</h2>
      <p>Use normalized data structures (entities by ID). Avoid duplicating entity data!</p>
      
      <div style={{ 
        background: 'white', 
        padding: '1.5rem', 
        borderRadius: '8px',
        marginTop: '1rem'
      }}>
        <h3>✅ Blog Posts with Normalized Authors</h3>
        <BlogPostsWithHook />
        
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#f3e5f5', borderRadius: '4px' }}>
          <strong>Benefits:</strong>
          <ul>
            <li>Update once: changing author updates all related posts</li>
            <li>No data duplication - memory efficient</li>
            <li>O(1) lookups by ID</li>
            <li>Matches backend database structure</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Demo5RNF() {
  const login = useAuthStore(state => state.login);
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);
  const toggleTheme = useUIStore(state => state.toggleTheme);
  const theme = useUIStore(state => state.theme);

  return (
    <div>
      <h2>5RNF: Context Separation</h2>
      <p>Separate concerns into different contexts/stores. Perfect for Redux & Zustand!</p>
      
      <div style={{ 
        background: 'white', 
        padding: '1.5rem', 
        borderRadius: '8px',
        marginTop: '1rem'
      }}>
        <h3>✅ Separated Stores Demo</h3>
        
        <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
          <div style={{ flex: 1, padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
            <h4>Auth Store</h4>
            <p>User: {user ? user.name : 'Not logged in'}</p>
            <button 
              onClick={() => user ? logout() : login({ name: 'John Doe' })}
              style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
            >
              {user ? 'Logout' : 'Login'}
            </button>
          </div>
          
          <div style={{ flex: 1, padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
            <h4>UI Store</h4>
            <p>Theme: {theme}</p>
            <button 
              onClick={toggleTheme}
              style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
            >
              Toggle Theme
            </button>
          </div>
        </div>
        
        <GoodComponent />
        
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#fce4ec', borderRadius: '4px' }}>
          <strong>Benefits:</strong>
          <ul>
            <li>Better performance: components only re-render when their data changes</li>
            <li>Easier testing: test each store independently</li>
            <li>Clear domain boundaries</li>
            <li>Scalable architecture</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DemoApp;