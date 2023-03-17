import { createContext, Dispatch } from 'react';
import { INITIAL_STATE, performance } from '../reducers/performanceReducer';

export const PerformanceContext =
    createContext<{ state: performance, dispatch: Dispatch<any>}>({ state: INITIAL_STATE, dispatch: () => {} });