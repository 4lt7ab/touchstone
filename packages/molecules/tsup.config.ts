import { createConfig } from '@touchstone/tsup-config';

export default createConfig({
  external: ['react-markdown', 'remark-gfm'],
});
