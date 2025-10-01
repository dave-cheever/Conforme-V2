import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import ChatItem from '../../components/ChatItem';

const mockUseAppContext = vi.fn();
const mockLazyQuery = vi.fn();
let lazyQueryResult: { data: any; loading: boolean };

vi.mock('../../contexts/AppProvider', () => ({
  useAppContext: () => mockUseAppContext(),
}));

const mockChatMention = vi.fn();
vi.mock('../../components/ChatMention', () => ({
  __esModule: true,
  default: ({ tag }: { tag: string }) => {
    mockChatMention(tag);
    return <span data-id="001185" data-testid="chat-mention">{tag}</span>;
  },
}));

vi.mock('@apollo/client', async () => {
  const actual = await vi.importActual<typeof import('@apollo/client')>('@apollo/client');
  return {
    ...actual,
    useLazyQuery: () => [mockLazyQuery, lazyQueryResult] as any,
  };
});

describe('ChatItem', () => {
  beforeEach(() => {
    mockUseAppContext.mockReset();
    mockLazyQuery.mockReset();
    mockChatMention.mockReset();
    lazyQueryResult = {
      data: {
        author: [
          {
            displayName: 'Mentioned User',
            imgUrl: 'avatar.png',
            userId: 'author-1',
          },
        ],
      },
      loading: false,
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (comment: any) =>
    render(
      <ChakraProvider data-id="001186">
        <ChatItem comment={comment} data-id="001187" onAction={vi.fn()} />
      </ChakraProvider>,
    );

  test('renders chat text and replaces mentions with ChatMention components', async () => {
    mockUseAppContext.mockReturnValue({
      user: {
        userId: 'current-user',
        _id: 'current-user',
        displayName: 'Current User',
      },
    });

    const comment = {
      _id: 'comment-1',
      authorId: 'author-1',
      text: 'Hello @[John Doe](user-1)!',
    };

    renderComponent(comment);

    await waitFor(() => expect(mockLazyQuery).toHaveBeenCalledTimes(1));
    expect(mockLazyQuery).toHaveBeenCalledWith({
      variables: { userQueryInput: { usersIds: ['author-1'] } },
    });

    expect(mockChatMention).toHaveBeenCalledWith('@[John Doe](user-1)');
    expect(screen.getByText((content) => content.startsWith('Hello '))).toBeInTheDocument();
    expect(screen.getByTestId('chat-mention')).toHaveTextContent('@[John Doe](user-1)');
  });

  test('does not fetch author details when current user is the author', () => {
    mockUseAppContext.mockReturnValue({
      user: {
        userId: 'author-1',
        _id: 'author-1',
        displayName: 'Author',
      },
    });

    const comment = {
      _id: 'comment-2',
      authorId: 'author-1',
      text: '@[Jane Doe](user-2) welcome!',
    };

    renderComponent(comment);

    expect(mockLazyQuery).not.toHaveBeenCalled();
    expect(mockChatMention).toHaveBeenCalledWith('@[Jane Doe](user-2)');
  });
});

