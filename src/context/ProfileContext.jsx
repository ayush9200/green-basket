// src/context/ProfileContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';

const ProfileContext = createContext(null);

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Real-time profile listener
        const profileRef = doc(db, 'customers', firebaseUser.uid);
        const unsubscribeProfile = onSnapshot(profileRef, (docSnap) => {
          if (docSnap.exists()) {
            setProfile({ id: docSnap.id, ...docSnap.data() });
          } else {
            setProfile(null);
          }
          setLoading(false);
        });
        
        return unsubscribeProfile;
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return unsubscribeAuth;
  }, []);

  const updateProfile = async (newProfile) => {
    if (user) {
      await setDoc(doc(db, 'customers', user.uid), newProfile, { merge: true });
    }
  };

  const value = { profile, setProfile: updateProfile, loading, user };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
