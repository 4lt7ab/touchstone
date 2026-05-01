import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavItem } from '../NavItem/NavItem.js';
import { NavSection } from './NavSection.js';

describe('NavSection', () => {
  it('labels the group via aria-labelledby when label is provided', () => {
    render(
      <NavSection label="bench">
        <NavItem>orders</NavItem>
        <NavItem>moulds</NavItem>
      </NavSection>,
    );
    const group = screen.getByRole('group', { name: 'bench' });
    expect(group).toBeInTheDocument();
  });

  it('labels the group via aria-label when no visible label is given', () => {
    render(
      <NavSection aria-label="quick actions">
        <NavItem>orders</NavItem>
      </NavSection>,
    );
    expect(
      screen.getByRole('group', { name: 'quick actions' }),
    ).toBeInTheDocument();
  });

  it('makes the selected child the tab entry point', () => {
    render(
      <NavSection label="bench">
        <NavItem>orders</NavItem>
        <NavItem selected>moulds</NavItem>
        <NavItem>recipes</NavItem>
      </NavSection>,
    );
    expect(screen.getByRole('button', { name: 'orders' })).toHaveAttribute(
      'tabindex',
      '-1',
    );
    expect(screen.getByRole('button', { name: 'moulds' })).toHaveAttribute(
      'tabindex',
      '0',
    );
    expect(screen.getByRole('button', { name: 'recipes' })).toHaveAttribute(
      'tabindex',
      '-1',
    );
  });

  it('makes the first child the tab entry point when none is selected', () => {
    render(
      <NavSection label="bench">
        <NavItem>orders</NavItem>
        <NavItem>moulds</NavItem>
      </NavSection>,
    );
    expect(screen.getByRole('button', { name: 'orders' })).toHaveAttribute(
      'tabindex',
      '0',
    );
    expect(screen.getByRole('button', { name: 'moulds' })).toHaveAttribute(
      'tabindex',
      '-1',
    );
  });

  it('moves focus on ArrowDown / ArrowUp', async () => {
    render(
      <NavSection label="bench">
        <NavItem>orders</NavItem>
        <NavItem>moulds</NavItem>
        <NavItem>recipes</NavItem>
      </NavSection>,
    );
    const orders = screen.getByRole('button', { name: 'orders' });
    const moulds = screen.getByRole('button', { name: 'moulds' });
    const recipes = screen.getByRole('button', { name: 'recipes' });

    orders.focus();
    expect(orders).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    expect(moulds).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    expect(recipes).toHaveFocus();

    await userEvent.keyboard('{ArrowUp}');
    expect(moulds).toHaveFocus();
  });

  it('Home jumps to first, End jumps to last', async () => {
    render(
      <NavSection label="bench">
        <NavItem>orders</NavItem>
        <NavItem>moulds</NavItem>
        <NavItem>recipes</NavItem>
      </NavSection>,
    );
    const orders = screen.getByRole('button', { name: 'orders' });
    const recipes = screen.getByRole('button', { name: 'recipes' });

    orders.focus();
    await userEvent.keyboard('{End}');
    expect(recipes).toHaveFocus();

    await userEvent.keyboard('{Home}');
    expect(orders).toHaveFocus();
  });

  it('renders the visible label', () => {
    render(
      <NavSection label="bench">
        <NavItem>orders</NavItem>
      </NavSection>,
    );
    expect(screen.getByText('bench')).toBeInTheDocument();
  });
});
