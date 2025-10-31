import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockNavigate, mockSignOut } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockSignOut: vi.fn(async () => {}),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('../../utils/auth-client', () => ({
  default: {
    signOut: mockSignOut,
  },
}));

const mockSetUser = vi.fn();
const mockUser = { displayName: 'John Doe', imgUrl: 'x', firstName: 'John' };

vi.mock('../../contexts/AppProvider', () => ({
  useAppContext: () => ({ user: mockUser, setUser: mockSetUser }),
}));

import useLogout from '../../hooks/useLogout';

describe('useLogout - navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('calls signOut and stores logout user (no setUser or navigation required in hook)', async () => {
    const logout = useLogout();
    await logout();

    expect(mockSetUser).not.toHaveBeenCalled();
    expect(localStorage.getItem('logOutUser')).toBeTruthy();
    expect(mockSignOut).toHaveBeenCalled();
  });
});


