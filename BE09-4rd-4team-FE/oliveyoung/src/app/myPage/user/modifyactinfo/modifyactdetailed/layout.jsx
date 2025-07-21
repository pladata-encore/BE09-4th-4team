'use client';

import React from 'react';
import SignUpHeader from '@/app/user/components/SignUpHeader';
import SignUpFooter from '@/app/user/components/SignUpFooter';

export default function Layout({ children }) {
  return (
    <>
      <SignUpHeader />
      {children}
      <SignUpFooter />
    </>
  );
}
