import * as React from 'react';
import PropTypes from 'prop-types';
import chainPropTypes from '../chainPropTypes';

function isClassComponent(elementType: Function) {
  // elementType.prototype?.isReactComponent
  const { prototype = {} } = elementType;

  return Boolean(prototype.isReactComponent);
}

 export function createValidator(mode: 'element' | 'elementType') {
  return function acceptingRef(
    props: { [key: string]: unknown },
    propName: string,
    componentName: string,
    location: string,
    propFullName: string,
  ) {
    const propValue = props[propName];
    const safePropName = propFullName || propName;

    if (
      propValue == null ||
      // When server-side rendering React doesn't warn either.
      // This is only in place for Emotion compat.
      // TODO: Revisit once https://github.com/facebook/react/issues/20047 is resolved.
      typeof window === 'undefined'
    ) {
      return null;
    }

    let warningHint;

    const valueToCheck = mode === 'element' ? (propValue as any).type : propValue;

    /**
     * Blacklisting instead of whitelisting
     *
     * Blacklisting will miss some components, such as React.Fragment. Those will at least
     * trigger a warning in React.
     * We can't whitelist because there is no safe way to detect React.forwardRef
     * or class components. "Safe" means there's no public API.
     */
    if (typeof valueToCheck === 'function' && !isClassComponent(valueToCheck)) {
      warningHint =
        mode === 'element'
          ? 'Did you accidentally use a plain function component for an element instead?'
          : 'Did you accidentally provide a plain function component instead?';
    }

    if (mode === 'elementType' && propValue === React.Fragment) {
      warningHint = 'Did you accidentally provide a React.Fragment instead?';
    }

    if (warningHint !== undefined) {
      const noun = mode === 'element' ? 'element' : 'element type';
      return new Error(
        `Invalid ${location} \`${safePropName}\` supplied to \`${componentName}\`. ` +
          `Expected an ${noun} that can hold a ref. ${warningHint} ` +
          'For more information see https://mui.com/r/caveat-with-refs-guide',
      );
    }

    return null;
  };
}
const elementValidator = createValidator('element');

const elementAcceptingRef = chainPropTypes(
  PropTypes.element,
  elementValidator,
) as PropTypes.Requireable<unknown>;
elementAcceptingRef.isRequired = chainPropTypes(PropTypes.element.isRequired, elementValidator);

export default elementAcceptingRef;
