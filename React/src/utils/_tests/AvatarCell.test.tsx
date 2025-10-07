import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import AvatarCell from '../../components/Table/Cells/AvatarCell';
import { IUser } from '../../interfaces/IUser';

// Mock the theme
const mockTheme = {
  colors: {
    auditsList: {
      fontColor: '#000000',
    },
  },
};

// Mock ChakraProvider wrapper
function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return (
    <ChakraProvider data-id="001214" theme={mockTheme}>
      {children}
    </ChakraProvider>
  );
}

// Mock user data
const createMockUser = (id: string, displayName: string, imgUrl?: string): Partial<IUser> => ({
  _id: id,
  userId: id,
  displayName,
  email: `${id}@example.com`,
  role: 'user' as const,
  lastLogin: new Date('2024-01-01'),
  imgUrl,
});

const mockUsers = [
  createMockUser('user1', 'John Doe (Manager)', 'https://example.com/john.jpg'),
  createMockUser('user2', 'Jane Smith (Admin)', 'https://example.com/jane.jpg'),
  createMockUser('user3', 'Bob Johnson (User)', 'https://example.com/bob.jpg'),
  createMockUser('user4', 'Alice Brown (Lead)', 'https://example.com/alice.jpg'),
  createMockUser('user5', 'Charlie Wilson (Dev)', 'https://example.com/charlie.jpg'),
];

// Helper function to render component with wrapper
const renderWithWrapper = (users?: Partial<IUser>[], userType = 'assigned') =>
  render(
    <TestWrapper data-id="001215">
      <AvatarCell data-id="001216" users={users} userType={userType} />
    </TestWrapper>,
  );

describe('AvatarCell', () => {
  describe('Empty/No users scenarios', () => {
    test('renders "Unassigned" when users array is empty', () => {
      renderWithWrapper([]);
      expect(screen.getByText('Unassigned')).toBeInTheDocument();
    });

    test('renders "Unassigned" when users is undefined', () => {
      renderWithWrapper();
      expect(screen.getByText('Unassigned')).toBeInTheDocument();
    });

    test('renders "Unassigned" when users is null', () => {
      renderWithWrapper(null as any);
      expect(screen.getByText('Unassigned')).toBeInTheDocument();
    });
  });

  describe('Single user scenarios', () => {
    test('renders single user with avatar and display name', () => {
      renderWithWrapper([mockUsers[0]]);

      // Check avatar is rendered
      const avatar = screen.getByRole('img');
      expect(avatar).toBeInTheDocument();

      // Check display name is shown
      expect(screen.getByText('John Doe (Manager)')).toBeInTheDocument();

      // Should not show count text for single user
      expect(screen.queryByText('1 assigned')).not.toBeInTheDocument();
    });

    test('renders single user without image URL', () => {
      const userWithoutImage = createMockUser('user1', 'John Doe');
      renderWithWrapper([userWithoutImage]);

      const avatar = screen.getByRole('img');
      expect(avatar).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    test('handles user with empty display name', () => {
      const userWithEmptyName = { ...mockUsers[0], displayName: '' };
      renderWithWrapper([userWithEmptyName]);

      const avatar = screen.getByRole('img');
      expect(avatar).toBeInTheDocument();
    });
  });

  describe('Multiple users scenarios', () => {
    test('renders multiple users with count text', () => {
      renderWithWrapper(mockUsers.slice(0, 2), 'auditors');

      // Check both avatars are rendered
      const avatars = screen.getAllByRole('img');
      expect(avatars).toHaveLength(2);

      // Check count text is shown
      expect(screen.getByText('2 auditors')).toBeInTheDocument();

      // Should not show individual display name for multiple users
      expect(screen.queryByText('John Doe (Manager)')).not.toBeInTheDocument();
    });

    test('renders exactly 3 users without overflow', () => {
      renderWithWrapper(mockUsers.slice(0, 3), 'reviewers');

      const avatars = screen.getAllByRole('img');
      expect(avatars).toHaveLength(3);
      expect(screen.getByText('3 reviewers')).toBeInTheDocument();
    });

    test('renders maximum 3 avatars when more than 3 users provided', () => {
      renderWithWrapper(mockUsers, 'participants');

      // Should only render 3 avatars (maxVisible = 3)
      const avatars = screen.getAllByRole('img');
      expect(avatars).toHaveLength(3);

      // Should show total count including hidden users
      expect(screen.getByText('5 participants')).toBeInTheDocument();
    });

    test('uses default userType when not provided', () => {
      renderWithWrapper(mockUsers.slice(0, 2));
      expect(screen.getByText('2 assigned')).toBeInTheDocument();
    });
  });

  describe('User type variations', () => {
    test('displays correct text with custom userType', () => {
      const customTypes = ['managers', 'developers', 'testers', 'analysts'];

      for (const type of customTypes) {
        const { unmount } = renderWithWrapper(mockUsers.slice(0, 2), type);
        expect(screen.getByText(`2 ${type}`)).toBeInTheDocument();
        unmount();
      }
    });
  });

  describe('Edge cases and data validation', () => {
    test('handles users with undefined displayName', () => {
      const userWithUndefinedName = { ...mockUsers[0], displayName: undefined as any };
      renderWithWrapper([userWithUndefinedName]);

      const avatar = screen.getByRole('img');
      expect(avatar).toBeInTheDocument();
    });

    test('handles users with null displayName', () => {
      const userWithNullName = { ...mockUsers[0], displayName: null as any };
      renderWithWrapper([userWithNullName]);

      const avatar = screen.getByRole('img');
      expect(avatar).toBeInTheDocument();
    });

    test('handles mixed valid and invalid user data', () => {
      const mixedUsers = [mockUsers[0], { ...mockUsers[1], displayName: undefined as any }, mockUsers[2]];

      renderWithWrapper(mixedUsers, 'mixed');

      const avatars = screen.getAllByRole('img');
      expect(avatars).toHaveLength(3);
      expect(screen.getByText('3 mixed')).toBeInTheDocument();
    });

    test('handles users array with some undefined elements', () => {
      const usersWithUndefined = [mockUsers[0], undefined as any, mockUsers[1]];

      renderWithWrapper(usersWithUndefined, 'filtered');

      // Should still render the valid users
      const avatars = screen.getAllByRole('img');
      expect(avatars).toHaveLength(2); // Only valid users rendered
      expect(screen.getByText('2 filtered')).toBeInTheDocument(); // But count includes all
    });
  });
});
