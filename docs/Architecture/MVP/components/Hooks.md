### 4. Custom Hooks

**src/hooks/useAuth.js**
```javascript
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

**src/hooks/useCourses.js**
```javascript
import { useContext } from 'react';
import { CourseContext } from '../context/CourseContext';

export function useCourses() {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourses must be used within CourseProvider');
  }
  return context;
}
```

**src/hooks/useOffline.js**
```javascript
import { useState, useEffect } from 'react';
import NetInfo from '@react-native-netinfo/netinfo';

export function useOffline() {
  const [isOffline, setIsOffline] = useState(false);
  const [isWifi, setIsWifi] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
      setIsWifi(state.type === 'wifi');
    });

    return () => unsubscribe();
  }, []);

  return { isOffline, isWifi };
}
```
