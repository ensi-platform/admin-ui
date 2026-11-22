import { useState } from 'react';

export type TTextEditorMode = 'visual' | 'source';

/** Visual / source mode. The host sanitizes HTML; the editor does not lock the surface. */
export const useEditorMode = () => {
    const [mode, setMode] = useState<TTextEditorMode>('visual');

    return {
        mode,
        openSource: () => setMode('source'),
        openVisual: () => setMode('visual'),
    };
};
