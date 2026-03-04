import PropTypes from 'prop-types';
import { createValidator } from '../elementAcceptingRef/elementAcceptingRef';
import chainPropTypes from '../chainPropTypes';

export default chainPropTypes(PropTypes.elementType, createValidator('elementType'));
