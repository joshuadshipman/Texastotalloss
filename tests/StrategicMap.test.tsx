import React from 'react';
import { render, screen } from '@testing-library/react';
import StrategicMap from '../src/components/StrategicMap';

/**
 * TDD Failing Test: StrategicMap Component
 * Goal: Verify that the map renders with the correct title and initializing state.
 */
describe('StrategicMap Component', () => {
  test('renders the map with initializing message', () => {
    render(<StrategicMap />);
    const initializingElement = screen.getByText(/Internal Map Initializing/i);
    expect(initializingElement).toBeInTheDocument();
  });
});
