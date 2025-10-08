import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import ChangeViewButton from '../../components/ChangeViewButton';
import { TViewMode } from '../../interfaces/TViewMode';

// Mock the useDevice hook
const mockUseDevice = vi.fn();
vi.mock('../../hooks/useDevice', () => ({
  default: () => mockUseDevice(),
}));

// Mock the useAppContext
const mockUseAppContext = vi.fn();
vi.mock('../../contexts/AppProvider', () => ({
  useAppContext: () => mockUseAppContext(),
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(globalThis, 'localStorage', {
  value: mockLocalStorage,
});

describe('ChangeViewButton Mobile Responsive', () => {
  const mockSetViewMode = vi.fn();
  const defaultProps = {
    viewMode: 'panel' as TViewMode,
    setViewMode: mockSetViewMode,
    views: ['list', 'panel'] as TViewMode[],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  describe('Mobile Device Behavior', () => {
    test('hides view switcher on mobile devices', () => {
      mockUseDevice.mockReturnValue('mobile');
      mockUseAppContext.mockReturnValue({ user: { role: 'user' } });

      render(<ChangeViewButton data-id="001521" {...defaultProps} />);

      // Should not render any view buttons
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    test('forces panel view on mobile devices', () => {
      mockUseDevice.mockReturnValue('mobile');
      mockUseAppContext.mockReturnValue({ user: { role: 'user' } });

      render(<ChangeViewButton data-id="001522" {...defaultProps} viewMode="list" />);

      // Should call setViewMode with 'panel' for mobile
      expect(mockSetViewMode).toHaveBeenCalledWith('panel');
    });

    test('clears localStorage on mobile to prevent view conflicts', () => {
      mockUseDevice.mockReturnValue('mobile');
      mockUseAppContext.mockReturnValue({ user: { role: 'user' } });

      render(<ChangeViewButton data-id="001523" {...defaultProps} />);

      // Should remove any saved view mode on mobile
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('viewMode');
    });

    test('ignores saved view mode on mobile devices', () => {
      mockUseDevice.mockReturnValue('mobile');
      mockUseAppContext.mockReturnValue({ user: { role: 'user' } });
      mockLocalStorage.getItem.mockReturnValue('list');

      render(<ChangeViewButton data-id="001524" {...defaultProps} />);

      // Should still force panel view even if 'list' was saved
      expect(mockSetViewMode).toHaveBeenCalledWith('panel');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('viewMode');
    });
  });

  describe('Desktop/Tablet Device Behavior', () => {
    test('shows view switcher on desktop devices', () => {
      mockUseDevice.mockReturnValue('desktop');
      mockUseAppContext.mockReturnValue({ user: { role: 'user' } });

      render(<ChangeViewButton data-id="001525" {...defaultProps} />);

      // Should render view buttons
      expect(screen.getByLabelText('list')).toBeInTheDocument();
      expect(screen.getByLabelText('panel')).toBeInTheDocument();
    });

    test('shows view switcher on tablet devices', () => {
      mockUseDevice.mockReturnValue('tablet');
      mockUseAppContext.mockReturnValue({ user: { role: 'user' } });

      render(<ChangeViewButton data-id="001526" {...defaultProps} />);

      // Should render view buttons
      expect(screen.getByLabelText('list')).toBeInTheDocument();
      expect(screen.getByLabelText('panel')).toBeInTheDocument();
    });

    test('restores saved view mode on desktop/tablet', () => {
      mockUseDevice.mockReturnValue('desktop');
      mockUseAppContext.mockReturnValue({ user: { role: 'user' } });
      mockLocalStorage.getItem.mockReturnValue('list');

      render(<ChangeViewButton data-id="001527" {...defaultProps} />);

      // Should restore saved view mode
      expect(mockSetViewMode).toHaveBeenCalledWith('list');
    });

    test('uses default view mode when no saved preference on desktop/tablet', () => {
      mockUseDevice.mockReturnValue('desktop');
      mockUseAppContext.mockReturnValue({ user: { role: 'user' } });
      mockLocalStorage.getItem.mockReturnValue(null);

      render(<ChangeViewButton data-id="001528" {...defaultProps} viewMode="panel" />);

      // Should use the passed viewMode as default
      expect(mockSetViewMode).toHaveBeenCalledWith('panel');
    });
  });

  describe('Admin User Behavior', () => {
    test('admin users get panel view by default on desktop', () => {
      mockUseDevice.mockReturnValue('desktop');
      mockUseAppContext.mockReturnValue({ user: { role: 'admin' } });
      mockLocalStorage.getItem.mockReturnValue(null);

      render(<ChangeViewButton data-id="001529" {...defaultProps} viewMode="list" />);

      // Admin users should get panel view by default
      expect(mockSetViewMode).toHaveBeenCalledWith('panel');
    });

    test('admin users still get panel view on mobile (forced)', () => {
      mockUseDevice.mockReturnValue('mobile');
      mockUseAppContext.mockReturnValue({ user: { role: 'admin' } });

      render(<ChangeViewButton data-id="001530" {...defaultProps} viewMode="list" />);

      // Mobile forces panel view regardless of admin status
      expect(mockSetViewMode).toHaveBeenCalledWith('panel');
    });
  });

  describe('View Mode Switching', () => {
    test('saves view mode to localStorage when switching on desktop', () => {
      mockUseDevice.mockReturnValue('desktop');
      mockUseAppContext.mockReturnValue({ user: { role: 'user' } });

      render(<ChangeViewButton data-id="001531" {...defaultProps} />);

      // Click on list view button
      const listButton = screen.getByLabelText('list');
      fireEvent.click(listButton);

      // Should save to localStorage
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('viewMode', 'list');
      expect(mockSetViewMode).toHaveBeenCalledWith('list');
    });

    test('saves view mode to localStorage when switching to panel on desktop', () => {
      mockUseDevice.mockReturnValue('desktop');
      mockUseAppContext.mockReturnValue({ user: { role: 'user' } });

      render(<ChangeViewButton data-id="001532" {...defaultProps} viewMode="list" />);

      // Click on panel view button
      const panelButton = screen.getByLabelText('panel');
      fireEvent.click(panelButton);

      // Should save to localStorage
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('viewMode', 'panel');
      expect(mockSetViewMode).toHaveBeenCalledWith('panel');
    });
  });

  describe('Invalid View Mode Handling', () => {
    test('ignores invalid saved view modes on desktop', () => {
      mockUseDevice.mockReturnValue('desktop');
      mockUseAppContext.mockReturnValue({ user: { role: 'user' } });
      mockLocalStorage.getItem.mockReturnValue('invalid-view');

      render(<ChangeViewButton data-id="001533" {...defaultProps} viewMode="panel" />);

      // Should use default viewMode instead of invalid saved value
      expect(mockSetViewMode).toHaveBeenCalledWith('panel');
    });

    test('ignores view modes not in the views array on desktop', () => {
      mockUseDevice.mockReturnValue('desktop');
      mockUseAppContext.mockReturnValue({ user: { role: 'user' } });
      mockLocalStorage.getItem.mockReturnValue('grid'); // grid is not in ['list', 'panel']

      render(<ChangeViewButton data-id="001534" {...defaultProps} viewMode="panel" />);

      // Should use default viewMode instead of unsupported saved value
      expect(mockSetViewMode).toHaveBeenCalledWith('panel');
    });
  });

  describe('Device Change Handling', () => {
    test('switches to panel view when device changes to mobile', () => {
      // Start with desktop
      mockUseDevice.mockReturnValue('desktop');
      mockUseAppContext.mockReturnValue({ user: { role: 'user' } });

      const { rerender } = render(<ChangeViewButton data-id="001535" {...defaultProps} viewMode="list" />);

      // Change to mobile
      mockUseDevice.mockReturnValue('mobile');
      rerender(<ChangeViewButton data-id="001536" {...defaultProps} viewMode="list" />);

      // Should force panel view on mobile
      expect(mockSetViewMode).toHaveBeenCalledWith('panel');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('viewMode');
    });

    test('restores saved view when device changes from mobile to desktop', () => {
      // Start with mobile
      mockUseDevice.mockReturnValue('mobile');
      mockUseAppContext.mockReturnValue({ user: { role: 'user' } });

      const { rerender } = render(<ChangeViewButton data-id="001537" {...defaultProps} />);

      // Change to desktop with saved preference
      mockUseDevice.mockReturnValue('desktop');
      mockLocalStorage.getItem.mockReturnValue('list');
      rerender(<ChangeViewButton data-id="001538" {...defaultProps} />);

      // Should restore saved view mode
      expect(mockSetViewMode).toHaveBeenCalledWith('list');
    });
  });

  describe('View Button States', () => {
    test('renders both view buttons on desktop', () => {
      mockUseDevice.mockReturnValue('desktop');
      mockUseAppContext.mockReturnValue({ user: { role: 'user' } });

      render(<ChangeViewButton data-id="001539" {...defaultProps} viewMode="panel" />);

      const panelButton = screen.getByLabelText('panel');
      const listButton = screen.getByLabelText('list');

      // Both buttons should be present
      expect(panelButton).toBeInTheDocument();
      expect(listButton).toBeInTheDocument();
    });

    test('switches active state when clicking different view on desktop', () => {
      mockUseDevice.mockReturnValue('desktop');
      mockUseAppContext.mockReturnValue({ user: { role: 'user' } });

      render(<ChangeViewButton data-id="001540" {...defaultProps} viewMode="panel" />);

      const listButton = screen.getByLabelText('list');
      fireEvent.click(listButton);

      // Should call setViewMode to switch to list
      expect(mockSetViewMode).toHaveBeenCalledWith('list');
    });
  });

  describe('Accessibility', () => {
    test('view buttons have proper aria-labels on desktop', () => {
      mockUseDevice.mockReturnValue('desktop');
      mockUseAppContext.mockReturnValue({ user: { role: 'user' } });

      render(<ChangeViewButton data-id="001541" {...defaultProps} />);

      expect(screen.getByLabelText('list')).toBeInTheDocument();
      expect(screen.getByLabelText('panel')).toBeInTheDocument();
    });

    test('view buttons are accessible on desktop', () => {
      mockUseDevice.mockReturnValue('desktop');
      mockUseAppContext.mockReturnValue({ user: { role: 'user' } });

      render(<ChangeViewButton data-id="001542" {...defaultProps} />);

      // Both buttons should be accessible via aria-labels
      const listButton = screen.getByLabelText('list');
      const panelButton = screen.getByLabelText('panel');
      
      expect(listButton).toBeInTheDocument();
      expect(panelButton).toBeInTheDocument();
      expect(listButton).toHaveAttribute('type', 'button');
      expect(panelButton).toHaveAttribute('type', 'button');
    });
  });
});
