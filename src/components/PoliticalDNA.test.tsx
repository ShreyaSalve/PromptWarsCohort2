import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PoliticalDNA } from './PoliticalDNA';
import React from 'react';

// Mocking motion to avoid animation issues in tests
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('PoliticalDNA Component', () => {
  it('renders the quiz initial state', () => {
    render(<PoliticalDNA onClose={() => {}} />);
    expect(screen.getByText('Political DNA')).toBeInTheDocument();
    expect(screen.getByText(/Question 1 of/i)).toBeInTheDocument();
  });

  it('progresses through questions and shows results', async () => {
    const onClose = vi.fn();
    render(<PoliticalDNA onClose={onClose} />);

    // Answer 4 questions (the current length of dnaQuestions)
    for (let i = 0; i < 4; i++) {
      const options = screen.getAllByRole('button');
      // The first button is the close button, others are options
      fireEvent.click(options[1]); // Click the first answer option
    }

    // Should show results now
    expect(screen.getByText('Analysis Complete')).toBeInTheDocument();
    expect(screen.getByText('Growth Visionary')).toBeInTheDocument();

    // Click Retake
    const retakeButton = screen.getByText('Retake');
    fireEvent.click(retakeButton);

    // Should be back to question 1
    expect(screen.getByText(/Question 1 of/i)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<PoliticalDNA onClose={onClose} />);
    
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]); // The X button
    
    expect(onClose).toHaveBeenCalled();
  });
});
