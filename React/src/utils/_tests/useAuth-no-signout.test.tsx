import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mocks
const mockSetUser = vi.fn();

vi.mock('../../utils/auth-client', () => ({
  default: {
    useSession: () => ({ data: null, isPending: false }),
    signOut: vi.fn(),
  },
}));

vi.mock('../../contexts/AppProvider', () => ({
  useAppContext: () => ({ setUser: mockSetUser }),
}));

import useAuth from '../../hooks/useAuth';
import authClient from '../../utils/auth-client';

function TestComponent() {
  useAuth();
  return null;
}

describe('useAuth - unauthenticated behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sets user to null without calling signOut when unauthenticated', () => {
    render(
      <MemoryRouter data-id="002912">
        <TestComponent data-id="002911" />
      </MemoryRouter>
    );

    expect(mockSetUser).toHaveBeenCalledWith(null);
    // ensure client signOut is not invoked implicitly on unauthenticated state
    expect((authClient as any).signOut).not.toHaveBeenCalled();
  });
});


