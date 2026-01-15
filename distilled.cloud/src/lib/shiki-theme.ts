import type { ThemeRegistration } from 'shiki';

export const distilledTheme: ThemeRegistration = {
  name: 'distilled',
  type: 'dark',
  colors: {
    'editor.background': '#18181b',
    'editor.foreground': '#fafafa',
  },
  tokenColors: [
    // Comments
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: {
        foreground: '#a1a1aa',
      },
    },
    // Strings
    {
      scope: ['string', 'string.quoted', 'string.template'],
      settings: {
        foreground: '#34d399',
      },
    },
    // Keywords (import, const, yield, new, etc.)
    {
      scope: [
        'keyword',
        'storage.type',
        'storage.modifier',
        'keyword.control',
        'keyword.operator.new',
        'keyword.operator.expression',
      ],
      settings: {
        foreground: '#a855f7',
      },
    },
    // Functions and methods
    {
      scope: [
        'entity.name.function',
        'meta.function-call',
        'support.function',
        'variable.function',
      ],
      settings: {
        foreground: '#60a5fa',
      },
    },
    // Variables and identifiers
    {
      scope: [
        'variable',
        'variable.other',
        'variable.parameter',
        'entity.name',
      ],
      settings: {
        foreground: '#fafafa',
      },
    },
    // Object properties
    {
      scope: ['variable.other.property', 'meta.object-literal.key'],
      settings: {
        foreground: '#fafafa',
      },
    },
    // Numbers
    {
      scope: ['constant.numeric'],
      settings: {
        foreground: '#60a5fa',
      },
    },
    // Constants, booleans, null
    {
      scope: ['constant.language', 'constant.language.boolean'],
      settings: {
        foreground: '#a855f7',
      },
    },
    // Operators
    {
      scope: ['keyword.operator', 'punctuation'],
      settings: {
        foreground: '#a1a1aa',
      },
    },
    // Types and classes
    {
      scope: [
        'entity.name.type',
        'entity.name.class',
        'support.type',
        'support.class',
      ],
      settings: {
        foreground: '#34d399',
      },
    },
    // Module/namespace
    {
      scope: ['entity.name.namespace', 'entity.name.module'],
      settings: {
        foreground: '#34d399',
      },
    },
  ],
};
