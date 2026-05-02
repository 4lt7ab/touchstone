import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@touchstone/themes';

export const root = style({
  color: vars.color.fg,
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.md,
  lineHeight: vars.font.lineHeight.relaxed,
  selectors: {
    '&[data-width="reading"]': { maxWidth: '65ch' },
    '&[data-width="full"]': { maxWidth: 'none' },
    '&[data-density="compact"]': { fontSize: vars.font.size.sm },
  },
});

const sel = (suffix: string) => `${root} ${suffix}`;

globalStyle(sel('> :first-child'), { marginTop: 0 });
globalStyle(sel('> :last-child'), { marginBottom: 0 });

globalStyle(sel('h1, h2, h3, h4, h5, h6'), {
  fontFamily: vars.font.family.display,
  color: vars.color.fg,
  fontWeight: vars.font.weight.semibold,
  lineHeight: vars.font.lineHeight.tight,
  marginBottom: vars.space[3],
});
globalStyle(sel('h1'), {
  fontSize: vars.font.size['3xl'],
  marginTop: vars.space[10],
  letterSpacing: vars.letterSpacing.tight,
});
globalStyle(sel('h2'), {
  fontSize: vars.font.size['2xl'],
  marginTop: vars.space[8],
});
globalStyle(sel('h3'), {
  fontSize: vars.font.size.xl,
  marginTop: vars.space[6],
});
globalStyle(sel('h4'), {
  fontSize: vars.font.size.lg,
  marginTop: vars.space[5],
});
globalStyle(sel('h5, h6'), {
  fontSize: vars.font.size.md,
  marginTop: vars.space[5],
});

globalStyle(sel('p'), {
  margin: 0,
  marginTop: vars.space[4],
  marginBottom: vars.space[4],
});

globalStyle(sel('a'), {
  color: vars.color.fgLink,
  textDecoration: 'underline',
  textDecorationThickness: vars.borderWidth.thin,
  textUnderlineOffset: '0.2em',
});
globalStyle(sel('a:hover'), {
  textDecorationThickness: vars.borderWidth.thick,
});
globalStyle(sel('a:focus-visible'), {
  outline: `${vars.focus.ringWidth} solid ${vars.focus.ringColor}`,
  outlineOffset: vars.focus.ringOffset,
  borderRadius: vars.radius.sm,
});

globalStyle(sel('strong'), { fontWeight: vars.font.weight.semibold });
globalStyle(sel('em'), { fontStyle: 'italic' });

globalStyle(sel('ul, ol'), {
  margin: 0,
  marginTop: vars.space[4],
  marginBottom: vars.space[4],
  paddingLeft: vars.space[6],
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
});
globalStyle(sel('ul'), { listStyle: 'disc' });
globalStyle(sel('ol'), { listStyle: 'decimal' });
globalStyle(sel('li'), { paddingLeft: vars.space[1] });
globalStyle(sel('li > ul, li > ol'), {
  marginTop: vars.space[2],
  marginBottom: 0,
});

globalStyle(sel('blockquote'), {
  margin: 0,
  marginTop: vars.space[4],
  marginBottom: vars.space[4],
  paddingLeft: vars.space[4],
  paddingTop: vars.space[2],
  paddingBottom: vars.space[2],
  borderLeft: `${vars.borderWidth.accent} solid ${vars.color.border}`,
  color: vars.color.fgSecondary,
  fontStyle: 'italic',
});

globalStyle(sel('hr'), {
  margin: 0,
  marginTop: vars.space[8],
  marginBottom: vars.space[8],
  border: 'none',
  borderTop: `${vars.borderWidth.thin} solid ${vars.color.border}`,
});

globalStyle(sel('img'), {
  maxWidth: '100%',
  height: 'auto',
  borderRadius: vars.radius.md,
  marginTop: vars.space[4],
  marginBottom: vars.space[4],
});

globalStyle(sel('table'), {
  marginTop: vars.space[4],
  marginBottom: vars.space[4],
});

globalStyle(sel('pre'), {
  marginTop: vars.space[4],
  marginBottom: vars.space[4],
});

const compact = `${root}[data-density="compact"]`;
globalStyle(
  `${compact} p, ${compact} ul, ${compact} ol, ${compact} blockquote, ${compact} pre, ${compact} table`,
  {
    marginTop: vars.space[3],
    marginBottom: vars.space[3],
  },
);
globalStyle(`${compact} h1`, { marginTop: vars.space[6] });
globalStyle(`${compact} h2`, { marginTop: vars.space[5] });
globalStyle(
  `${compact} h3, ${compact} h4, ${compact} h5, ${compact} h6`,
  { marginTop: vars.space[4] },
);
