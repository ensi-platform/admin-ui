import cn from 'classnames';

import { type IDropzoneItem, type IRowAction } from '../../types';
import { ActionSlot, stopRowPress } from '../ActionSlot';
import { FileCopy } from '../FileCopy';
import { Grip } from '../Grip';
import { ItemRoot } from '../ItemRoot';
import { Preview } from '../Preview';
import { SelectionMark } from '../SelectionMark';

import styles from './styles.module.css';

const onFrame = (action: IRowAction) => action.key === 'remove' || action.key === 'dismiss';

/** Grid file card. */
export const GridItem = ({
    element,
    elementProps,
    size,
    file,
    selected,
    gripLabel,
    actions,
    action,
    progress,
    failedLabel,
    replaceLabel,
}: IDropzoneItem) => (
    <ItemRoot element={element} elementProps={elementProps} className={cn(styles.item, styles[size])}>
        {selected ? <SelectionMark className={styles.check} /> : null}
        <div className={styles.frame}>
            <Preview file={file} />
            <ActionSlot actions={actions.filter(onFrame)} className={styles.frameRemove} />
        </div>
        <div className={styles.lead}>
            {gripLabel ? (
                <Grip label={gripLabel} className={cn(styles.iconButton, styles.grip)} iconClassName={styles.icon} />
            ) : null}
            <FileCopy file={file} progress={progress} failedLabel={failedLabel} replaceLabel={replaceLabel} />
            {action ? <span onPointerDown={stopRowPress}>{action}</span> : null}
            <ActionSlot actions={actions.filter(rowAction => !onFrame(rowAction))} />
        </div>
    </ItemRoot>
);

GridItem.displayName = 'Dropzone.GridItem';
