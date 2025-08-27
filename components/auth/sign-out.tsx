'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export function SignOut() {
  return (
    <Button
      variant="outline"
      onClick={() => signOut({ callbackUrl: '/auth/signin' })}
    >
      Se déconnecter
    </Button>
  );
}