import { describe, expect, it } from 'vitest';
import { markdownToPlainText } from './markdownToPlainText.js';

describe('markdownToPlainText', () => {
  it('strips heading markers', () => {
    expect(markdownToPlainText('# Title\n\nbody')).toBe('Title\n\nbody');
    expect(markdownToPlainText('### deeper')).toBe('deeper');
  });

  it('drops bold and italic markers', () => {
    expect(markdownToPlainText('the **anvil** rings')).toBe('the anvil rings');
    expect(markdownToPlainText('a _quiet_ note')).toBe('a quiet note');
    expect(markdownToPlainText('__loud__ and _quiet_')).toBe('loud and quiet');
  });

  it('keeps the text of links and images', () => {
    expect(markdownToPlainText('see [docs](https://example.com)')).toBe('see docs');
    expect(markdownToPlainText('![an anvil](anvil.png)')).toBe('an anvil');
  });

  it('keeps the inner text of inline code and fenced code blocks', () => {
    expect(markdownToPlainText('run `bun install`')).toBe('run bun install');
    expect(markdownToPlainText('```ts\nconst x = 1;\n```')).toContain('const x = 1;');
  });

  it('strips blockquote and list markers', () => {
    expect(markdownToPlainText('> a note')).toBe('a note');
    expect(markdownToPlainText('- one\n- two\n- three')).toBe('one\ntwo\nthree');
    expect(markdownToPlainText('1. step\n2. step\n3. step')).toBe('step\nstep\nstep');
  });

  it('drops horizontal rules', () => {
    expect(markdownToPlainText('above\n\n---\n\nbelow')).toBe('above\n\nbelow');
  });

  it('flattens GFM tables to their cells', () => {
    const md = '| name | role |\n| ---- | ---- |\n| ada | apprentice |';
    const out = markdownToPlainText(md);
    expect(out).toContain('name');
    expect(out).toContain('role');
    expect(out).toContain('ada');
    expect(out).toContain('apprentice');
    expect(out).not.toContain('|');
  });

  it('drops inline HTML tags but keeps their text', () => {
    expect(markdownToPlainText('<em>bright</em> stone')).toBe('bright stone');
  });

  it('returns an empty string for empty input', () => {
    expect(markdownToPlainText('')).toBe('');
  });

  it('survives a real-world preview snippet', () => {
    const md = [
      '## Release notes',
      '',
      'The **anvil** now rings on `cmd+s`. See the [docs](/docs/anvil)',
      'for the full recipe.',
      '',
      '- a new mark on the bench',
      '- a wider chamber',
    ].join('\n');
    const out = markdownToPlainText(md);
    expect(out.startsWith('Release notes')).toBe(true);
    expect(out).toContain('anvil');
    expect(out).toContain('cmd+s');
    expect(out).toContain('docs');
    expect(out).not.toContain('**');
    expect(out).not.toContain('`');
    expect(out).not.toContain('](');
  });
});
