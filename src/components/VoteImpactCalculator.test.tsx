import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VoteImpactCalculator } from './VoteImpactCalculator';
import React from 'react';

// Mocking motion
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mocking recharts
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  BarChart: ({ children }: any) => <div>{children}</div>,
  Bar: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  Tooltip: () => <div />,
  Cell: () => <div />,
}));

describe('VoteImpactCalculator Component', () => {
  it('renders step 1 with location buttons', () => {
    render(<VoteImpactCalculator onClose={() => {}} />);
    expect(screen.getByText('Vote Calculator')).toBeInTheDocument();
    expect(screen.getByText('Pune')).toBeInTheDocument();
    expect(screen.getByText('Mumbai')).toBeInTheDocument();
  });

  it('navigates to step 2 after selection', () => {
    render(<VoteImpactCalculator onClose={() => {}} />);
    
    // Select a city
    fireEvent.click(screen.getByText('Delhi'));
    
    // Click Analyze button
    const analyzeButton = screen.getByText(/Analyze Magnitude/i);
    fireEvent.click(analyzeButton);
    
    // Should show step 2 content
    expect(screen.getByText(/Past Turnout: Delhi/i)).toBeInTheDocument();
    expect(screen.getByText(/The "Ripple Effect"/i)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<VoteImpactCalculator onClose={onClose} />);
    
    const closeButton = screen.getByRole('button', { name: '' }); // The X button is usually the first or has no text
    // Find button with X icon (lucide-react might not be easy to find by text, so we use role and check if it's the right one)
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]); // The X button is the first one in the header
    
    expect(onClose).toHaveBeenCalled();
  });
});
