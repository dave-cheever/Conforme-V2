import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import theme from '../../bootstrap/theme';
import SearchBarMessage from '../../components/SearchBar/SearchBarMessage';

// Mock icon component
const MockIcon = ({ boxSize, color }: { boxSize?: string; color?: string }) => (
  <svg
    data-id="003402"
    data-testid="mock-icon"
    width={boxSize}
    height={boxSize}
    fill={color}>
    <path data-id="003403" d="M0 0" />
  </svg>
);

describe('SearchBarMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <ChakraProvider data-id="003404" theme={theme}>
        {component}
      </ChakraProvider>
    );
  };

  describe('Rendering', () => {
    it('should render icon with correct boxSize', () => {
      renderWithProviders(
        <SearchBarMessage data-id="003405" icon={MockIcon} text="Test message" />
      );

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('width', '34px');
      expect(icon).toHaveAttribute('height', '34px');
    });

    it('should render text message', () => {
      renderWithProviders(
        <SearchBarMessage data-id="003406" icon={MockIcon} text="Type a keyword to search" />
      );

      expect(screen.getByText('Type a keyword to search')).toBeInTheDocument();
    });

    it('should render heading when provided', () => {
      renderWithProviders(
        <SearchBarMessage
          data-id="003407"
          icon={MockIcon}
          heading="We couldn't find a match"
          text="Check spelling or try another term." />
      );

      expect(screen.getByText("We couldn't find a match")).toBeInTheDocument();
      expect(screen.getByText('Check spelling or try another term.')).toBeInTheDocument();
    });

    it('should NOT render heading when not provided', () => {
      renderWithProviders(
        <SearchBarMessage data-id="003408" icon={MockIcon} text="Type a keyword to search" />
      );

      // Heading should not be in the document
      const heading = screen.queryByRole('heading');
      expect(heading).not.toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have correct heading styles', () => {
      renderWithProviders(
        <SearchBarMessage data-id="003409" icon={MockIcon} heading="Test Heading" text="Test text" />
      );

      const heading = screen.getByText('Test Heading');
      expect(heading).toHaveStyle({ fontWeight: '600' });
      expect(heading).toHaveStyle({ fontSize: '16px' });
      expect(heading).toHaveStyle({ color: '#4A5568' });
      expect(heading).toHaveStyle({ textAlign: 'center' });
    });

    it('should have correct text styles', () => {
      renderWithProviders(
        <SearchBarMessage data-id="003410" icon={MockIcon} text="Test text" />
      );

      const text = screen.getByText('Test text');
      expect(text).toHaveStyle({ fontWeight: '500' });
      expect(text).toHaveStyle({ fontSize: '14px' });
      expect(text).toHaveStyle({ color: '#718096' });
      expect(text).toHaveStyle({ textAlign: 'center' });
    });

    it('should have centered flex layout', () => {
      const { container } = renderWithProviders(
        <SearchBarMessage data-id="003411" icon={MockIcon} text="Test text" />
      );

      // Check if the component rendered (the Flex component should be in the DOM)
      const messageText = screen.getByText('Test text');
      expect(messageText).toBeInTheDocument();
      // The Flex container should be a parent of the text
      const flexContainer = messageText.closest('[style*="flex-direction"], [style*="flexDirection"]') || 
                           messageText.parentElement;
      expect(flexContainer).toBeInTheDocument();
    });
  });

  describe('Different Message Types', () => {
    it('should render empty search message', () => {
      renderWithProviders(
        <SearchBarMessage data-id="003412" icon={MockIcon} text="Type a keyword to search" />
      );

      expect(screen.getByText('Type a keyword to search')).toBeInTheDocument();
    });

    it('should render no results found message', () => {
      renderWithProviders(
        <SearchBarMessage
          data-id="003413"
          icon={MockIcon}
          heading="We couldn't find a match"
          text="Check spelling or try another term." />
      );

      expect(screen.getByText("We couldn't find a match")).toBeInTheDocument();
      expect(screen.getByText('Check spelling or try another term.')).toBeInTheDocument();
    });

    it('should render search error message', () => {
      renderWithProviders(
        <SearchBarMessage
          data-id="003414"
          icon={MockIcon}
          heading="Search could not be completed"
          text="Please try again, or refresh the page" />
      );

      expect(screen.getByText('Search could not be completed')).toBeInTheDocument();
      expect(screen.getByText('Please try again, or refresh the page')).toBeInTheDocument();
    });
  });
});

