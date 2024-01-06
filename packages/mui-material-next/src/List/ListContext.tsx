'use client';
import * as React from 'react';

/**
 * @ignore - internal component.
 */
const ListContext = React.createContext<{ dense?: boolean }>({});

if (process.env.NODE_ENV !== 'production') {
  ListContext.displayName = 'ListContext';
}

export default ListContext;
