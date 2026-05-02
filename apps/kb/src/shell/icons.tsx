import { BookIcon, CardIcon, GearIcon, RocketIcon, ShieldIcon } from '@touchstone/icons';

export function CategoryIcon({ kind }: { kind: 'rocket' | 'gear' | 'shield' | 'book' | 'card' }) {
  switch (kind) {
    case 'rocket':
      return <RocketIcon />;
    case 'gear':
      return <GearIcon />;
    case 'shield':
      return <ShieldIcon />;
    case 'book':
      return <BookIcon />;
    case 'card':
      return <CardIcon />;
  }
}
