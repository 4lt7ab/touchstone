import type { Meta, StoryObj } from '@storybook/react';
import { Surface } from '@touchstone/atoms';
import { vars } from '@touchstone/themes';
import type { CSSProperties } from 'react';

const meta = {
  title: 'Themes/Tokens',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

interface SwatchProps {
  label: string;
  value: string;
  textColor?: string;
}

function Swatch({ label, value, textColor }: SwatchProps): JSX.Element {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        minWidth: '12rem',
      }}
    >
      <div
        style={{
          height: '4rem',
          background: value,
          color: textColor ?? vars.color.fg,
          border: `1px solid ${vars.color.border}`,
          borderRadius: vars.radius.md,
          padding: '0.5rem 0.75rem',
          fontFamily: vars.font.family.mono,
          fontSize: vars.font.size.xs,
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        {label}
      </div>
    </div>
  );
}

interface FeedbackChipProps {
  label: string;
  fg: string;
  bg: string;
}

function FeedbackChip({ label, fg, bg }: FeedbackChipProps): JSX.Element {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 0.75rem',
        background: bg,
        color: fg,
        border: `1px solid ${fg}`,
        borderRadius: vars.radius.md,
        fontFamily: vars.font.family.sans,
        fontSize: vars.font.size.sm,
      }}
    >
      <span
        style={{
          width: '0.5rem',
          height: '0.5rem',
          borderRadius: vars.radius.full,
          background: fg,
        }}
      />
      {label}
    </div>
  );
}

interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

function Section({ title, description, children }: SectionProps): JSX.Element {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <header>
        <h2
          style={{
            margin: 0,
            fontFamily: vars.font.family.sans,
            fontSize: vars.font.size.lg,
            fontWeight: vars.font.weight.semibold,
            color: vars.color.fg,
          }}
        >
          {title}
        </h2>
        {description ? (
          <p
            style={{
              margin: '0.25rem 0 0',
              fontFamily: vars.font.family.sans,
              fontSize: vars.font.size.sm,
              color: vars.color.fgMuted,
            }}
          >
            {description}
          </p>
        ) : null}
      </header>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        {children}
      </div>
    </section>
  );
}

const containerStyle: CSSProperties = {
  minHeight: '100vh',
  padding: '2rem',
  background: vars.color.bgPage,
  color: vars.color.fg,
  display: 'flex',
  flexDirection: 'column',
  gap: '2.5rem',
};

export const Tokens: Story = {
  render: () => (
    <div style={containerStyle}>
      <header>
        <h1
          style={{
            margin: 0,
            fontFamily: vars.font.family.display ?? vars.font.family.sans,
            fontSize: vars.font.size['2xl'],
            fontWeight: vars.font.weight.bold,
            color: vars.color.fg,
          }}
        >
          the named drawers
        </h1>
        <p
          style={{
            margin: '0.25rem 0 0',
            fontFamily: vars.font.family.sans,
            fontSize: vars.font.size.sm,
            color: vars.color.fgMuted,
          }}
        >
          every dye, every space, every weight has a name in the ledger. switch the cabinet to see
          how the same name fetches a different fire.
        </p>
      </header>

      <Section
        title="Surfaces"
        description="the layers of the bench, page below and overlay above. each depth is a thing the eye trusts without being told."
      >
        {(
          [
            'base',
            'solid',
            'raised',
            'muted',
            'panel',
            'input',
            'disabled',
            'overlay',
            'page',
          ] as const
        ).map((level) => (
          <Surface
            key={level}
            level={level}
            radius="md"
            padding="sm"
            style={{
              minWidth: '12rem',
              height: '4rem',
              border: `1px solid ${vars.color.border}`,
              fontFamily: vars.font.family.mono,
              fontSize: vars.font.size.xs,
              color: vars.color.fg,
              display: 'flex',
              alignItems: 'flex-end',
            }}
          >
            {level}
          </Surface>
        ))}
      </Section>

      <Section
        title="Foreground (text)"
        description="the inks in their orders — first hand, second hand, the marginalia, the placeholders, the silenced words."
      >
        <Swatch label="fg" value={vars.color.fg} textColor={vars.color.bg} />
        <Swatch label="fgSecondary" value={vars.color.fgSecondary} textColor={vars.color.bg} />
        <Swatch label="fgMuted" value={vars.color.fgMuted} textColor={vars.color.bg} />
        <Swatch label="fgPlaceholder" value={vars.color.fgPlaceholder} textColor={vars.color.bg} />
        <Swatch label="fgDisabled" value={vars.color.fgDisabled} textColor={vars.color.bg} />
        <Swatch label="fgInverse" value={vars.color.fgInverse} textColor={vars.color.fg} />
        <Swatch label="fgLink" value={vars.color.fgLink} textColor={vars.color.bg} />
      </Section>

      <Section
        title="Borders"
        description="what a thing's edge says: ordinary, attended to, in error."
      >
        {(['border', 'borderFocus', 'borderError'] as const).map((token) => (
          <div
            key={token}
            style={{
              minWidth: '12rem',
              height: '4rem',
              border: `2px solid ${vars.color[token]}`,
              borderRadius: vars.radius.md,
              padding: '0.5rem 0.75rem',
              display: 'flex',
              alignItems: 'flex-end',
              fontFamily: vars.font.family.mono,
              fontSize: vars.font.size.xs,
              color: vars.color.fg,
              background: vars.color.bg,
            }}
          >
            {token}
          </div>
        ))}
      </Section>

      <Section
        title="Actions"
        description="primary, secondary, destructive — each with a hand at rest and a hand at work."
      >
        <Swatch
          label="actionPrimary"
          value={vars.color.actionPrimary}
          textColor={vars.color.accentFg}
        />
        <Swatch
          label="actionPrimaryHover"
          value={vars.color.actionPrimaryHover}
          textColor={vars.color.accentFg}
        />
        <Swatch
          label="actionSecondary"
          value={vars.color.actionSecondary}
          textColor={vars.color.fg}
        />
        <Swatch
          label="actionSecondaryHover"
          value={vars.color.actionSecondaryHover}
          textColor={vars.color.fg}
        />
        <Swatch label="danger" value={vars.color.danger} textColor={vars.color.dangerFg} />
        <Swatch
          label="dangerHover"
          value={vars.color.dangerHover}
          textColor={vars.color.dangerFg}
        />
      </Section>

      <Section
        title="Feedback"
        description="the four small voices the master uses when the apprentice is across the room."
      >
        <FeedbackChip
          label="the seal held — record it in the ledger."
          fg={vars.color.success}
          bg={vars.color.successBg}
        />
        <FeedbackChip
          label="look once more before you strike."
          fg={vars.color.warning}
          bg={vars.color.warningBg}
        />
        <FeedbackChip
          label="the strike would unmake what was forged."
          fg={vars.color.danger}
          bg={vars.color.dangerBg}
        />
        <FeedbackChip
          label="a quiet word from the master."
          fg={vars.color.info}
          bg={vars.color.infoBg}
        />
      </Section>

      <Section
        title="Glow"
        description="the rim that knows the rhythm. silent on still themes; alive on the rhythmic ones."
      >
        <Swatch label="glow" value={vars.color.glow} textColor={vars.color.glowFg} />
        <Swatch label="glowFg" value={vars.color.glowFg} textColor={vars.color.glow} />
      </Section>
    </div>
  ),
};
