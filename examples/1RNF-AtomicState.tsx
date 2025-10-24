import { useState } from 'react';

/**
 * 1RNF: Atomic State Example
 * Rule: Each state variable should contain only primitive values or simple objects
 */

// ❌ BAD: Deeply nested state
function BadUserProfile() {
  const [user, setUser] = useState({
    profile: {
      name: 'John Doe',
      email: 'john@example.com',
      address: {
        street: '123 Main St',
        city: 'New York',
        country: 'USA'
      }
    },
    posts: [
      { id: 1, title: 'Post 1', comments: [{ id: 1, text: 'Comment 1' }] }
    ],
    settings: {
      theme: 'dark',
      notifications: { email: true, push: false }
    }
  });

  // Updating nested state is complex and error-prone
  const updateCity = (newCity: string) => {
    setUser(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        address: {
          ...prev.profile.address,
          city: newCity
        }
      }
    }));
  };

  return <div>{user.profile.address.city}</div>;
}

// ✅ GOOD: Atomic state
function GoodUserProfile() {
  // Each piece of state is flat and independent
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com'
  });
  
  const [address, setAddress] = useState({
    street: '123 Main St',
    city: 'New York',
    country: 'USA'
  });
  
  const [posts, setPosts] = useState([
    { id: 1, title: 'Post 1' }
  ]);
  
  const [comments, setComments] = useState([
    { id: 1, postId: 1, text: 'Comment 1' }
  ]);
  
  const [settings, setSettings] = useState({
    theme: 'dark' as 'dark' | 'light',
    emailNotifications: true,
    pushNotifications: false
  });

  // Updating is simple and clear
  const updateCity = (newCity: string) => {
    setAddress(prev => ({ ...prev, city: newCity }));
  };

  return <div>{address.city}</div>;
}

export { BadUserProfile, GoodUserProfile };
