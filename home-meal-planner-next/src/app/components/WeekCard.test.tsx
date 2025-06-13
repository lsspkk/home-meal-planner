import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WeekCard } from './WeekCard';
import * as useWeeklyMenusModule from '../hooks/useWeekMenus';
import * as useRecipeCollectionModule from '../hooks/useRecipeCollection';
import { recipes } from '../recipes';
import { ThemeProvider } from './ThemeProvider';

// Mock next/navigation useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

const week = {
  weekNumber: 1,
  start: new Date('2024-01-01'),
  end: new Date('2024-01-07'),
  idx: 0,
  key: '2024-week-1',
};

const selected = {
  '2024-week-1': [recipes[0].id, recipes[1].id],
};

describe('WeekCard', () => {
  beforeEach(() => {
    vi.spyOn(useWeeklyMenusModule, 'useWeeklyMenus').mockReturnValue({
      weeklyMenus: selected,
      save: vi.fn(),
      onAdd: vi.fn(),
      onRemove: vi.fn(),
      refresh: vi.fn(),
      isLoading: false,
      lastModified: 0,
    });
    vi.spyOn(useRecipeCollectionModule, 'useRecipeCollection').mockReturnValue({
      recipeCollection: {
        [recipes[0].id]: recipes[0],
        [recipes[1].id]: recipes[1],
        [recipes[2].id]: recipes[2],
      },
      save: vi.fn(),
    });
  });

  it('shows selected recipes for the week', () => {
    render(<ThemeProvider><WeekCard week={week} /></ThemeProvider>);
    expect(screen.getByText(recipes[0].title)).toBeInTheDocument();
    expect(screen.getByText(recipes[1].title)).toBeInTheDocument();
    // Should not show a recipe that is not selected
    expect(screen.queryByText(recipes[2].title)).not.toBeInTheDocument();
  });
}); 