import { createContext } from 'react';

import { type IModalHubContextValue } from './types';

export const ModalHubContext = createContext<IModalHubContextValue | null>(null);
