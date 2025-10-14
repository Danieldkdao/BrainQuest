import React from 'react'
import { useAuth } from '@clerk/clerk-expo'
import { Redirect } from 'expo-router';

const SSOCallback = () => {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
      return <Redirect href="/(main)" />;
    }

  return (
    <Redirect href="/(auth)"/>
  )
}

export default SSOCallback