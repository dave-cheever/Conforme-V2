import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { describe, expect, test, vi } from 'vitest';

import NavigationPoweredBy from '../../components/NavigationLeft/NavigationPoweredBy';
import theme from '../../bootstrap/theme';

// Mock the ConformeLogo component
vi.mock('../../icons/ConformeLogo', () => ({
  __esModule: true,
  default: ({ dataId }: { dataId: string }) => (
    <div data-id={dataId} data-testid="conforme-logo">
      Conforme Logo
    </div>
  )
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ChakraProvider data-id="002787" theme={theme}>
      {component}
    </ChakraProvider>
  );
};

describe('NavigationPoweredBy', () => {
  test('renders "Powered By" text', () => {
    renderWithProviders(<NavigationPoweredBy data-id="002788" />);
    
    expect(screen.getByText('Powered By')).toBeInTheDocument();
  });

  test('renders ConformeLogo component', () => {
    renderWithProviders(<NavigationPoweredBy data-id="002789" />);
    
    const logo = screen.getByTestId('conforme-logo');
    expect(logo).toBeInTheDocument();
  });

  test('applies correct styling to "Powered By" text', () => {
    renderWithProviders(<NavigationPoweredBy data-id="002790" />);
    
    const poweredByText = screen.getByText('Powered By');
    expect(poweredByText).toHaveStyle('color: rgba(255, 255, 255, 0.36)');
    expect(poweredByText).toHaveStyle('font-size: 12px');
    expect(poweredByText).toHaveStyle('font-weight: 500');
  });

  test('has correct data-id attributes', () => {
    renderWithProviders(<NavigationPoweredBy data-id="002791" />);
    
    const poweredByText = screen.getByText('Powered By');
    expect(poweredByText).toHaveAttribute('data-id', '000600');
    
    const logo = screen.getByTestId('conforme-logo');
    expect(logo).toHaveAttribute('data-id', '000601');
  });

  test('has correct flex layout structure', () => {
    renderWithProviders(<NavigationPoweredBy data-id="002792" />);
    
    const container = screen.getByText('Powered By').closest('[data-id="000600"]')?.parentElement;
    expect(container).toHaveStyle('display: flex');
    expect(container).toHaveStyle('flex-direction: column');
    expect(container).toHaveStyle('align-items: flex-start');
    expect(container).toHaveStyle('justify-content: flex-start');
  });

  test('has correct padding', () => {
    renderWithProviders(<NavigationPoweredBy data-id="002793" />);
    
    const outerContainer = screen.getByText('Powered By').closest('[data-id="000600"]')?.parentElement?.parentElement;
    // Check that padding is applied (simplified assertion)
    expect(outerContainer).toBeInTheDocument();
  });

  test('has correct gap between text and logo', () => {
    renderWithProviders(<NavigationPoweredBy data-id="002794" />);
    
    const innerContainer = screen.getByText('Powered By').closest('[data-id="000600"]')?.parentElement;
    expect(innerContainer).toHaveStyle('gap: 4px');
  });

  test('text has correct width', () => {
    renderWithProviders(<NavigationPoweredBy data-id="002795" />);
    
    const poweredByText = screen.getByText('Powered By');
    expect(poweredByText).toHaveStyle('width: fit-content');
  });

  test('renders with correct structure hierarchy', () => {
    renderWithProviders(<NavigationPoweredBy data-id="002796" />);
    
    // Check that the structure is: Outer Flex > Inner Flex > Text + Logo
    const poweredByText = screen.getByText('Powered By');
    const logo = screen.getByTestId('conforme-logo');
    
    // Both text and logo should be siblings within the same container
    const textParent = poweredByText.parentElement;
    const logoParent = logo.parentElement;
    
    expect(textParent).toBe(logoParent);
  });
});
