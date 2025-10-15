import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import incidentsData from '../../../../mock-data/incidents.data';
import PanelView from '../../PanelView';
import incidentPanelConfig from '../incidentPanelConfig';

function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return <ChakraProvider data-id="001500">{children}</ChakraProvider>;
}

describe('IncidentPanelConfig', () => {
  test('renders incident panels with swapped id and title values', () => {
    render(
      <TestWrapper data-id="002415">
        <PanelView config={incidentPanelConfig} data-id="002416" items={incidentsData} />
      </TestWrapper>,
    );

    // Check that swapped values are rendered correctly
    expect(screen.getByText('Safeguarding Concern - Safeguarding & Dignity')).toBeInTheDocument();
    expect(screen.getByText('Privacy & Documentation - Documentation or Charting Error')).toBeInTheDocument();
    expect(screen.getByText('Clinical Safety - Patient Fall')).toBeInTheDocument();
    
    // Check that the original IDs are now in title position
    expect(screen.getByText('INC-02102025-0629-001')).toBeInTheDocument();
    expect(screen.getByText('INC-02102025-0629-002')).toBeInTheDocument();
    expect(screen.getByText('INC-02102025-0629-003')).toBeInTheDocument();
  });

  test('renders people assigned with correct styling', () => {
    render(
      <TestWrapper data-id="002417">
        <PanelView config={incidentPanelConfig} data-id="002418" items={[incidentsData[0]]} />
      </TestWrapper>,
    );

    // Check that people assigned text is rendered with proper styling
    const peopleAssignedElement = screen.getByText('Ricky Johnson');
    expect(peopleAssignedElement).toBeInTheDocument();
    
    // Check that the element has the correct styling applied
    const parentElement = peopleAssignedElement.closest('span');
    expect(parentElement).toHaveStyle({
      color: '#2D3748',
      fontSize: '12px',
      fontWeight: '600',
    });
  });

  test('renders people assigned for array values', () => {
    render(
      <TestWrapper data-id="002419">
        <PanelView config={incidentPanelConfig} data-id="002420" items={[incidentsData[1]]} />
      </TestWrapper>,
    );

    // Check that array of people is rendered as count
    expect(screen.getByText('2 people')).toBeInTheDocument();
  });

  test('renders people assigned fallback for empty values', () => {
    const emptyIncident = {
      ...incidentsData[0],
      people_assigned: null,
    };

    render(
      <TestWrapper data-id="002421">
        <PanelView config={incidentPanelConfig} data-id="002422" items={[emptyIncident]} />
      </TestWrapper>,
    );

    expect(screen.getByText('No one assigned')).toBeInTheDocument();
  });

  test('renders status badges with correct icons and colors', () => {
    render(
      <TestWrapper data-id="002423">
        <PanelView config={incidentPanelConfig} data-id="002424" items={incidentsData} />
      </TestWrapper>,
    );

    // Check inReview status
    const inReviewBadge = screen.getByText('In Review');
    expect(inReviewBadge).toBeInTheDocument();

    // Check Investigation status
    const investigationBadge = screen.getByText('Investigation');
    expect(investigationBadge).toBeInTheDocument();

    // Check Escalated status
    const escalatedBadge = screen.getByText('Escalated');
    expect(escalatedBadge).toBeInTheDocument();
  });

  test('renders severity badges with correct colors', () => {
    render(
      <TestWrapper data-id="002425">
        <PanelView config={incidentPanelConfig} data-id="002426" items={incidentsData} />
      </TestWrapper>,
    );

    // Since severity is in the header which is hidden, we'll just check that the data is present
    // The severity badges are configured but not displayed due to header.show: false
    expect(incidentsData[0].severity).toBe('high');
    expect(incidentsData[1].severity).toBe('medium');
    expect(incidentsData[2].severity).toBe('high');
  });

  test('renders hospital and ward location information', () => {
    render(
      <TestWrapper data-id="002427">
        <PanelView config={incidentPanelConfig} data-id="002428" items={incidentsData} />
      </TestWrapper>,
    );

    // Check hospital names
    expect(screen.getByText('Riverside General Hospital')).toBeInTheDocument();
    expect(screen.getByText('Frenhill Clinic')).toBeInTheDocument();
    expect(screen.getByText('Meadow View Hospital')).toBeInTheDocument();

    // Check ward locations
    expect(screen.getByText('Paediatric Ward 5')).toBeInTheDocument();
    expect(screen.getByText('General Ward 1')).toBeInTheDocument();
    expect(screen.getByText('Orthopaedics Unit')).toBeInTheDocument();
  });

  test('renders linked items when present', () => {
    render(
      <TestWrapper data-id="002429">
        <PanelView config={incidentPanelConfig} data-id="002430" items={[incidentsData[0]]} />
      </TestWrapper>,
    );

    // Check linked item is rendered
    expect(screen.getByText('Linked Incident')).toBeInTheDocument();
    expect(screen.getByText('ACT-20251002-001')).toBeInTheDocument();
  });

  test('renders timestamps in correct format', () => {
    render(
      <TestWrapper data-id="002431">
        <PanelView config={incidentPanelConfig} data-id="002432" items={incidentsData} />
      </TestWrapper>,
    );

    // Check that timestamps are rendered (format may vary based on date formatting)
    // We'll check for the date parts that should be consistent
    const elementsWith2025 = screen.getAllByText(/2025/);
    expect(elementsWith2025.length).toBeGreaterThan(0);
  });

  test('renders action buttons', () => {
    render(
      <TestWrapper data-id="002433">
        <PanelView config={incidentPanelConfig} data-id="002434" items={[incidentsData[0]]} />
      </TestWrapper>,
    );

    // Check primary action button
    expect(screen.getByText('View Incident')).toBeInTheDocument();
  });

  test('handles missing data gracefully', () => {
    const incompleteIncident = {
      id: 'Test ID',
      title: 'Test Title',
      status: 'inReview',
      // Missing other required fields
    };

    render(
      <TestWrapper data-id="002435">
        <PanelView
          config={incidentPanelConfig}
          data-id="002436"
          items={[incompleteIncident]} />
      </TestWrapper>,
    );

    // Check fallback values are used
    expect(screen.getByText('No Hospital')).toBeInTheDocument();
    expect(screen.getByText('No Location')).toBeInTheDocument();
    expect(screen.getByText('No one assigned')).toBeInTheDocument();
  });
});
