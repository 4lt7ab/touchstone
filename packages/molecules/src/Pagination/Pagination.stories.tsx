import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Stack, Text } from '@touchstone/atoms';
import { Pagination } from './Pagination.js';

const meta = {
  title: 'Molecules/Pagination',
  component: Pagination,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    pageCount: 8,
    'aria-label': 'Ledger pages',
  },
};

export const Sized: Story = {
  render: () => (
    <Stack gap={4}>
      <Pagination pageCount={6} defaultPage={2} size="sm" />
      <Pagination pageCount={6} defaultPage={2} size="md" />
    </Stack>
  ),
};

export const ManyPages: Story = {
  render: () => {
    const Demo = () => {
      const [page, setPage] = useState(10);
      return (
        <Stack gap={3}>
          <Text tone="muted" size="sm">
            page {page} of 42
          </Text>
          <Pagination
            page={page}
            pageCount={42}
            onPageChange={setPage}
            siblingCount={1}
            boundaryCount={1}
          />
        </Stack>
      );
    };
    return <Demo />;
  },
};

export const WideWindow: Story = {
  args: {
    pageCount: 24,
    defaultPage: 12,
    siblingCount: 2,
    boundaryCount: 2,
  },
};

export const Disabled: Story = {
  args: {
    pageCount: 8,
    defaultPage: 3,
    disabled: true,
  },
};

export const WithPageSize: Story = {
  render: () => {
    const Demo = () => {
      const [page, setPage] = useState(1);
      const [pageSize, setPageSize] = useState(25);
      const total = 200;
      const pageCount = Math.max(1, Math.ceil(total / pageSize));
      return (
        <Stack gap={3}>
          <Text tone="muted" size="sm">
            page {page} of {pageCount} ({pageSize}/page, {total} total)
          </Text>
          <Pagination
            page={page}
            pageCount={pageCount}
            onPageChange={setPage}
            pageSize={pageSize}
            pageSizeOptions={[10, 25, 50, 100]}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setPage(1);
            }}
          />
        </Stack>
      );
    };
    return <Demo />;
  },
};
