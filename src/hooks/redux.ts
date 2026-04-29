import { useSelector as useReduxSelector, useDispatch as useReduxDispatch, type TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
export const useDispatch = () => useReduxDispatch<AppDispatch>();
