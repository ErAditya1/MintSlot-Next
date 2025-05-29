'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser, logoutUser } from '@/store/user/userSlice';
import { AxiosError } from 'axios';
import api from '@/api';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { handleSidebar } from '@/store/setting/settingSlice';


import { v4 as uuidv4 } from 'uuid';
import { CloudOff, Loader } from 'lucide-react';




// Loading Screen Component
export function LoadingScreen({ message, className = 'h-dvh w-full ', size = 50 }: any) {
  return (
    <div className={`bg-background text-foreground  flex justify-center items-center m-0 p-0 ${className}`}>
      <Loader className="animate-spin mx-4" size={size} />
      {message}
    </div>
  );
}

// No Network Screen Component
function NoNetworkScreen() {
  return (
    <div className="bg-background text-foreground h-dvh w-full flex justify-center items-center m-0 p-0 text-sm sm:text-md">
      <CloudOff className="mx-4" size={50} />
      No Network Connection...
    </div>
  );
}

// Page Component
function Page({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const accessToken = useMemo(() => {
    return searchParams.get('accessToken');
  }, [searchParams]);

  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [showOffline, setShowOffline] = useState(false);

  const dispatch = useAppDispatch();


















  const isPublicPath = useMemo(
    () =>
      ['/sign-in', '/sign-up', '/verify', '/reset-password', '/forget-password','/firebase-login'].some((path) =>
        pathname.startsWith(path) ,
      ),
    [pathname],
  );
  const commanPath = useMemo(
    () =>
      ['/terms-services', '/privacy-policy', '/support'].some((path) =>
        pathname.startsWith(path)|| pathname === '/',
      ),
    [pathname],
  );





  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Show "offline" message after a delay
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!isOnline) {
      timeout = setTimeout(() => setShowOffline(true), 3000);
    } else {
      setShowOffline(false);
    }
    return () => clearTimeout(timeout);
  }, [isOnline]);


  const getCurrentUser = () => {
    api
      .get('/api/v1/users/current-user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const { user, device } = response.data.data;
        user.accessToken = device.accessToken;
        user.refreshToken = device.refreshToken;
        user.accessTokenExpires = Date.now() + (1000 * 60 * 60)
        console.log(user)

        if (accessToken) {
          localStorage.setItem('MintSlotUser', JSON.stringify(user));
        }
        dispatch(loginUser(user));
        if (isPublicPath) router.push('/');
      })
      .catch((error) => {
        const axiosError = error as AxiosError<AxiosError>;
        if (!isPublicPath && !commanPath) {
          toast({
            title: 'Authentication Failed',
            description: axiosError.response?.data?.message || 'Error occurred',
            variant: 'destructive',
          });
          router.push('/sign-in');
        }
        dispatch(logoutUser());
      })
      .finally(() => setLoading(false));
  }



  // Authentication logic
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('MintSlotUser');
      const user = storedUser ? JSON.parse(storedUser) : null;
      console.log(user);


      if (accessToken) {
        getCurrentUser()
      }
      else if (user && user.accessTokenExpires > Date.now()) {

        dispatch(loginUser(user));
        setLoading(false);
        if (isPublicPath) router.push('/');

      } else if (user && user.accessTokenExpires <= Date.now()) {
        getCurrentUser()
      } else {
        if (!isPublicPath && !commanPath) {
          router.push('/sign-in');
        }
        dispatch(logoutUser());
        setLoading(false)
      }
      
      

    }


    if (!isOnline) {
      toast({
        title: 'No Internet Connection',
        description: 'Check your network and try again.',
        variant: 'warning',
      });
    }
  
  }, [accessToken, dispatch, isOnline, isPublicPath, router, pathname]);

  // Redirect logged-in users from public paths
  useEffect(() => {
    if (isLoggedIn && isPublicPath) {
      router.replace('/');
    }

  }, [isLoggedIn, isPublicPath, router]);


  useEffect(() => {
    // This code will only run on the client-side (browser)
    if (typeof window !== 'undefined') {
      let uniqueId = localStorage.getItem('uniqueId');
      if (!uniqueId) {
        // Generate a new unique ID if it doesn't exist
        const uniqueId = uuidv4();
        // Store it in localStorage and/or cookies
        localStorage.setItem('uniqueId', uniqueId);
        document.cookie = `uniqueId=${uniqueId}; path=/; max-age=${60 * 60 * 24 * 365}`;  // 1 year expiration
      }
      const blockConsole = () => {
        if (window.console) {
          // Override console methods with an empty function
          const methods: (keyof Console)[] = ['log', 'info', 'warn', 'debug', 'error'];
          methods.forEach((method) => {
            // Override with a function that matches the expected signature
            (window.console[method] as (...args: any[]) => void) = (...args: any[]) => { };
          });
        }
      };
      // Block the console with the specified arguments and return
      if (process.env.NODE_ENV === 'production') {
        blockConsole();
      }

      dispatch(handleSidebar(window.screen.width >= 900));
    }
  }, []);


  useEffect(() => {
    if (isLoggedIn && isOnline) {
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {


        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            navigator.serviceWorker.register('/service-worker.js')
              .then((registration) => {
                console.log('Service Worker registered', registration.scope);

                // Subscribe the user to Push Notifications
                registration.pushManager.getSubscription().then((subscription) => {
                  if (subscription) {
                    console.log('Already subscribed');
                  } else {
                    registration.pushManager.subscribe({
                      userVisibleOnly: true,
                      applicationServerKey: 'BOj4llN4WfhksTyrnYQl4so0KroAfkj6OkdxKYNIVBQKKLWj7nQrfKqZj9kaXpPz5iwJMZZqDedLTcE0r3Edf8M'
                    }).then((subscription) => {
                      console.log('User is subscribed', subscription);
                      // Send subscription to the backend
                      api.post("/api/v1/notification/save-subscription", { subscription: subscription })
                        .then((data) => console.log('Subscription sent', data))
                        .catch((error) => console.error('Subscription error', error));
                    });
                  }
                });
              })
              .catch((error) => {
                console.error('Service Worker registration failed', error);
              });
          }
        });

      };
    }


  }, [isLoggedIn, isOnline]);

  if (loading) return <LoadingScreen message="Verifying..." className="h-dvh w-screen" />;
  if (!isOnline && showOffline) return <NoNetworkScreen />;
  return <>{children}</>;
}

// UserContext Component
export default function UserContext({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingScreen message="Loading..." />}>
      <Page>{children}</Page>
    </Suspense>
  );
}
