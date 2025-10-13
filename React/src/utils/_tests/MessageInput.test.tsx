import { useForm } from 'react-hook-form';

import { MockedProvider } from '@apollo/client/testing';
import { ChakraProvider } from '@chakra-ui/react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import MessageInput from '../../components/Response/MessageInput';

const { MentionMock, MentionsInputMock } = vi.hoisted(() => {
  function MentionsInputMock({ children, onBlur, onChange, onKeyDown, placeholder, value }) {
    return (
      <div data-id="001200">
        <textarea
          data-id="001201"
          data-testid="mentions-input"
          onBlur={(event) => onBlur?.(event)}
          onChange={(event) => onChange?.({ target: { value: event.target.value } })}
          onKeyDown={(event) => onKeyDown?.(event)}
          placeholder={placeholder}
          value={value ?? ''}
        />
        {children}
      </div>
    );
  }

  function MentionMock({ data, renderSuggestion }) {
    return (
      <div data-id="001202" data-testid="mentions-suggestions">
        {Array.isArray(data)
          ? data.map((item) => (
              <div data-id="001203" key={item.id}>
                {renderSuggestion ? renderSuggestion({ display: item.display, id: item.id }) : item.display}
              </div>
            ))
          : null}
      </div>
    );
  }

  return { MentionMock, MentionsInputMock };
});

vi.mock('react-mentions', () => ({
  Mention: MentionMock,
  MentionsInput: MentionsInputMock,
}));

const mockUseChatContext = vi.fn();
vi.mock('../../contexts/ChatProvider', () => ({
  useChatContext: () => mockUseChatContext(),
}));

const mockUseValidate = vi.hoisted(() => vi.fn(() => vi.fn()));
vi.mock('../../hooks/useValidate', () => ({
  __esModule: true,
  default: mockUseValidate,
}));

const mockOnAction = vi.fn();

describe('MessageInput', () => {
  beforeEach(() => {
    mockUseChatContext.mockReset();
    mockUseValidate.mockClear();
    mockOnAction.mockReset();
  });

  const renderComponent = (props: Partial<React.ComponentProps<typeof MessageInput>> = {}) => {
    function Wrapper() {
      const { control } = useForm({ defaultValues: { text: '' } });
      return (
        <MockedProvider data-id="001196">
          <ChakraProvider data-id="001197">
            <MessageInput control={control} data-id="001198" label="Comment" name="text" onAction={mockOnAction} {...props} />
          </ChakraProvider>
        </MockedProvider>
      );
    }

    return render(<Wrapper data-id="001199" />);
  };

  test('renders suggestions when chat participants exist', () => {
    mockUseChatContext.mockReturnValue({
      chatParticipants: [
        { _id: 'user-1', displayName: 'Participant One' },
        { _id: 'user-2', displayName: 'Participant Two' },
      ],
    });

    renderComponent();

    expect(mockUseValidate).toHaveBeenCalled();
    const input = screen.getByTestId('mentions-input');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '@' } });

    expect(screen.getAllByText('Participant One').length).toBeGreaterThan(0);
  });

  test('fires onAction when Enter is pressed without shift', () => {
    mockUseChatContext.mockReturnValue({ chatParticipants: [] });

    renderComponent({ placeholder: 'Send message' });

    const input = screen.getByPlaceholderText('Send message');
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockOnAction).toHaveBeenCalledTimes(1);
  });

  test('allows Shift+Enter without triggering onAction', () => {
    mockUseChatContext.mockReturnValue({ chatParticipants: [] });

    renderComponent({ placeholder: 'Type message' });

    const input = screen.getByPlaceholderText('Type message');
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });

    expect(mockOnAction).not.toHaveBeenCalled();
  });
});
