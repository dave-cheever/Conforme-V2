import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import EditIncidentIcon from '../EditIncidentIcon';
import EscalatedStatusIcon from '../EscalatedStatusIcon';
import InvestigationStatusIcon from '../InvestigationStatusIcon';

describe('Incident Status Icons', () => {
  describe('EditIncidentIcon', () => {
    test('renders without crashing', () => {
      const { container } = render(<EditIncidentIcon data-id="002370" />);
      const svgElement = container.querySelector('svg');
      expect(svgElement).toBeInTheDocument();
    });

    test('renders with data-id attribute', () => {
      const { container } = render(<EditIncidentIcon data-id="002371" dataId="test-edit-icon" />);
      const svgElement = container.querySelector('svg');
      expect(svgElement).toHaveAttribute('data-id', 'test-edit-icon');
    });

    test('has correct SVG attributes', () => {
      const { container } = render(<EditIncidentIcon data-id="002372" />);
      const svgElement = container.querySelector('svg');
      
      expect(svgElement).toHaveAttribute('width', '10');
      expect(svgElement).toHaveAttribute('height', '11');
      expect(svgElement).toHaveAttribute('viewBox', '0 0 10 11');
      expect(svgElement).toHaveAttribute('fill', 'none');
    });

    test('contains correct path elements', () => {
      const { container } = render(<EditIncidentIcon data-id="002373" />);
      const svgElement = container.querySelector('svg');
      expect(svgElement).toBeInTheDocument();
    });
  });

  describe('InvestigationStatusIcon', () => {
    test('renders without crashing', () => {
      const { container } = render(<InvestigationStatusIcon data-id="002374" />);
      const svgElement = container.querySelector('svg');
      expect(svgElement).toBeInTheDocument();
    });

    test('renders with data-id attribute', () => {
      const { container } = render(<InvestigationStatusIcon data-id="002375" dataId="test-investigation-icon" />);
      const svgElement = container.querySelector('svg');
      expect(svgElement).toHaveAttribute('data-id', 'test-investigation-icon');
    });

    test('has correct SVG attributes', () => {
      const { container } = render(<InvestigationStatusIcon data-id="002376" />);
      const svgElement = container.querySelector('svg');
      
      expect(svgElement).toHaveAttribute('width', '10');
      expect(svgElement).toHaveAttribute('height', '11');
      expect(svgElement).toHaveAttribute('viewBox', '0 0 10 11');
      expect(svgElement).toHaveAttribute('fill', 'none');
    });

    test('contains correct clipPath id', () => {
      const { container } = render(<InvestigationStatusIcon data-id="002377" />);
      const svgElement = container.querySelector('svg');
      expect(svgElement).toBeTruthy();
      expect(svgElement!.innerHTML).toContain('clip0_2360_10033');
    });
  });

  describe('EscalatedStatusIcon', () => {
    test('renders without crashing', () => {
      const { container } = render(<EscalatedStatusIcon data-id="002378" />);
      const svgElement = container.querySelector('svg');
      expect(svgElement).toBeInTheDocument();
    });

    test('renders with data-id attribute', () => {
      const { container } = render(<EscalatedStatusIcon data-id="002379" dataId="test-escalated-icon" />);
      const svgElement = container.querySelector('svg');
      expect(svgElement).toHaveAttribute('data-id', 'test-escalated-icon');
    });

    test('has correct SVG attributes', () => {
      const { container } = render(<EscalatedStatusIcon data-id="002380" />);
      const svgElement = container.querySelector('svg');
      
      expect(svgElement).toHaveAttribute('width', '10');
      expect(svgElement).toHaveAttribute('height', '11');
      expect(svgElement).toHaveAttribute('viewBox', '0 0 10 11');
      expect(svgElement).toHaveAttribute('fill', 'none');
    });

    test('contains correct clipPath id', () => {
      const { container } = render(<EscalatedStatusIcon data-id="002381" />);
      const svgElement = container.querySelector('svg');
      expect(svgElement).toBeTruthy();
      expect(svgElement!.innerHTML).toContain('clip0_2360_14041');
    });
  });

  describe('Icon Consistency', () => {
    test('all icons have the same dimensions', () => {
      const { container: editContainer } = render(<EditIncidentIcon data-id="002382" />);
      let svgElement = editContainer.querySelector('svg');
      expect(svgElement).toHaveAttribute('width', '10');
      expect(svgElement).toHaveAttribute('height', '11');

      const { container: investigationContainer } = render(<InvestigationStatusIcon data-id="002383" />);
      svgElement = investigationContainer.querySelector('svg');
      expect(svgElement).toHaveAttribute('width', '10');
      expect(svgElement).toHaveAttribute('height', '11');

      const { container: escalatedContainer } = render(<EscalatedStatusIcon data-id="002384" />);
      svgElement = escalatedContainer.querySelector('svg');
      expect(svgElement).toHaveAttribute('width', '10');
      expect(svgElement).toHaveAttribute('height', '11');
    });

    test('all icons have white fill color', () => {
      const { container: editContainer } = render(<EditIncidentIcon data-id="002385" />);
      let svgElement = editContainer.querySelector('svg');
      expect(svgElement).toBeTruthy();
      expect(svgElement!.innerHTML).toContain('fill="white"');

      const { container: investigationContainer } = render(<InvestigationStatusIcon data-id="002386" />);
      svgElement = investigationContainer.querySelector('svg');
      expect(svgElement).toBeTruthy();
      expect(svgElement!.innerHTML).toContain('fill="white"');

      const { container: escalatedContainer } = render(<EscalatedStatusIcon data-id="002387" />);
      svgElement = escalatedContainer.querySelector('svg');
      expect(svgElement).toBeTruthy();
      expect(svgElement!.innerHTML).toContain('fill="white"');
    });

    test('all icons have unique clipPath ids', () => {
      const { container: editContainer } = render(<EditIncidentIcon data-id="002388" />);
      let svgElement = editContainer.querySelector('svg');
      expect(svgElement).toBeTruthy();
      const editClipPath = svgElement!.innerHTML.match(/clip0_\d+_\d+/)?.[0];

      const { container: investigationContainer } = render(<InvestigationStatusIcon data-id="002389" />);
      svgElement = investigationContainer.querySelector('svg');
      expect(svgElement).toBeTruthy();
      const investigationClipPath = svgElement!.innerHTML.match(/clip0_\d+_\d+/)?.[0];

      const { container: escalatedContainer } = render(<EscalatedStatusIcon data-id="002390" />);
      svgElement = escalatedContainer.querySelector('svg');
      expect(svgElement).toBeTruthy();
      const escalatedClipPath = svgElement!.innerHTML.match(/clip0_\d+_\d+/)?.[0];

      expect(editClipPath).toBeDefined();
      expect(investigationClipPath).toBeDefined();
      expect(escalatedClipPath).toBeDefined();
      
      // All clipPath IDs should be unique
      expect(editClipPath).not.toBe(investigationClipPath);
      expect(editClipPath).not.toBe(escalatedClipPath);
      expect(investigationClipPath).not.toBe(escalatedClipPath);
    });
  });
});
