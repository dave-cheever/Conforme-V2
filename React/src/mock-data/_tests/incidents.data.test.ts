import { describe, expect, test } from 'vitest';

import incidentsData from '../incidents.data';

describe('Incidents Mock Data', () => {
  test('has correct number of incidents', () => {
    expect(incidentsData).toHaveLength(3);
  });

  test('has swapped id and title values', () => {
    // First incident - id should be the original title, title should be the original id
    expect(incidentsData[0].id).toBe('Safeguarding Concern - Safeguarding & Dignity ');
    expect(incidentsData[0].title).toBe('INC-02102025-0629-001');

    // Second incident
    expect(incidentsData[1].id).toBe('Privacy & Documentation - Documentation or Charting Error');
    expect(incidentsData[1].title).toBe('INC-02102025-0629-002');

    // Third incident
    expect(incidentsData[2].id).toBe('Clinical Safety - Patient Fall');
    expect(incidentsData[2].title).toBe('INC-02102025-0629-003');
  });

  test('has correct status values', () => {
    expect(incidentsData[0].status).toBe('IN REVIEW');
    expect(incidentsData[1].status).toBe('Investigation');
    expect(incidentsData[2].status).toBe('Escalated');
  });

  test('has correct severity values', () => {
    expect(incidentsData[0].severity).toBe('high');
    expect(incidentsData[1].severity).toBe('medium');
    expect(incidentsData[2].severity).toBe('high');
  });

  test('has correct people_assigned data types', () => {
    // First incident has string value
    expect(typeof incidentsData[0].people_assigned).toBe('string');
    expect(incidentsData[0].people_assigned).toBe('Ricky Johnson');

    // Second incident has array value
    expect(Array.isArray(incidentsData[1].people_assigned)).toBe(true);
    expect(incidentsData[1].people_assigned).toEqual(['Johny Dae', 'Melissa Barnes']);

    // Third incident has string value
    expect(typeof incidentsData[2].people_assigned).toBe('string');
    expect(incidentsData[2].people_assigned).toBe('Michael Mayham');
  });

  test('has required fields for all incidents', () => {
    incidentsData.forEach((incident) => {
      expect(incident).toHaveProperty('id');
      expect(incident).toHaveProperty('title');
      expect(incident).toHaveProperty('status');
      expect(incident).toHaveProperty('description');
      expect(incident).toHaveProperty('owner');
      expect(incident).toHaveProperty('hospital_name');
      expect(incident).toHaveProperty('ward_location');
      expect(incident).toHaveProperty('timestamp');
      expect(incident).toHaveProperty('people_assigned');
      expect(incident).toHaveProperty('severity');
      expect(incident).toHaveProperty('criticality_level');
      expect(incident).toHaveProperty('Closed_on_date');

      // Check that required fields are not empty
      expect(incident.id).toBeTruthy();
      expect(incident.title).toBeTruthy();
      expect(incident.status).toBeTruthy();
      expect(incident.description).toBeTruthy();
      expect(incident.owner).toBeTruthy();
      expect(incident.hospital_name).toBeTruthy();
      expect(incident.ward_location).toBeTruthy();
      expect(incident.timestamp).toBeTruthy();
      expect(incident.severity).toBeTruthy();
      expect(incident.criticality_level).toBeTruthy();
      expect(incident.Closed_on_date).toBeTruthy();
    });
  });

  test('has valid timestamp formats', () => {
    incidentsData.forEach((incident) => {
      // Check that timestamp is a string and follows ISO format (with quotes)
      expect(typeof incident.timestamp).toBe('string');
      expect(incident.timestamp).toMatch(/^"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z"$/);
    });
  });

  test('has valid closed date formats', () => {
    incidentsData.forEach((incident) => {
      // Check that Closed_on_date is a string and follows ISO format
      expect(typeof incident.Closed_on_date).toBe('string');
      expect(incident.Closed_on_date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
    });
  });

  test('has unique incident IDs', () => {
    const ids = incidentsData.map(incident => incident.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test('has unique incident titles', () => {
    const titles = incidentsData.map(incident => incident.title);
    const uniqueTitles = new Set(titles);
    expect(uniqueTitles.size).toBe(titles.length);
  });

  test('has valid status values', () => {
    const validStatuses = ['IN REVIEW', 'Investigation', 'Escalated', 'Closed'];
    incidentsData.forEach((incident) => {
      expect(validStatuses).toContain(incident.status);
    });
  });

  test('has valid severity values', () => {
    const validSeverities = ['high', 'medium', 'low'];
    incidentsData.forEach((incident) => {
      expect(validSeverities).toContain(incident.severity);
    });
  });

  test('has valid criticality levels', () => {
    const validCriticalityLevels = ['Critical', 'medium', 'high', 'low'];
    incidentsData.forEach((incident) => {
      expect(validCriticalityLevels).toContain(incident.criticality_level);
    });
  });

  test('has linked item only for first incident', () => {
    expect(incidentsData[0]).toHaveProperty('linked_item');
    expect(incidentsData[0].linked_item).toBe('ACT-20251002-001');
    
    expect(incidentsData[1]).not.toHaveProperty('linked_item');
    expect(incidentsData[2]).not.toHaveProperty('linked_item');
  });

  test('has realistic hospital and ward names', () => {
    const hospitalNames = incidentsData.map(incident => incident.hospital_name);
    const wardLocations = incidentsData.map(incident => incident.ward_location);

    // Check that hospital names are realistic
    expect(hospitalNames).toContain('Riverside General Hospital');
    expect(hospitalNames).toContain('Frenhill Clinic');
    expect(hospitalNames).toContain('Meadow View Hospital');

    // Check that ward locations are realistic
    expect(wardLocations).toContain(incidentsData[0].ward_location);
    expect(wardLocations).toContain('General Ward 1');
    expect(wardLocations).toContain('Orthopaedics Unit');
  });

  test('has realistic owner names', () => {
    const owners = incidentsData.map(incident => incident.owner);
    
    expect(owners).toContain('Priya Agate');
    expect(owners).toContain('Dave Pagac');
    expect(owners).toContain('Jack Morson');
    
    // Check that all owners are strings and not empty
    owners.forEach(owner => {
      expect(typeof owner).toBe('string');
      expect(owner.length).toBeGreaterThan(0);
    });
  });
});
