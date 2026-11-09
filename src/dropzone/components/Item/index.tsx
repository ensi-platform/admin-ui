import cn from 'classnames';

import { type IDropzoneItem } from '../../types';
import { ActionSlot, stopRowPress } from '../ActionSlot';
import { FileCopy } from '../FileCopy';
import { Grip } from '../Grip';
import { ItemRoot } from '../ItemRoot';
import { SelectionMark } from '../SelectionMark';
import { TypeMark } from '../TypeMark';

import styles from './styles.module.css';

/** File row. */
export const Item = ({
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
        <div className={styles.lead}>
            {gripLabel ? (
                <Grip label={gripLabel} className={cn(styles.iconButton, styles.grip)} iconClassName={styles.icon} />
            ) : null}
            <span className={styles.tile}>
                {selected ? <SelectionMark className={styles.check} /> : null}
                <TypeMark type={file.type} />
            </span>
            <FileCopy
                file={file}
                progress={progress}
                failedLabel={failedLabel}
                replaceLabel={replaceLabel}
                progressClassName={styles.progressBleed}
            />
            {action ? <span onPointerDown={stopRowPress}>{action}</span> : null}
            <ActionSlot actions={actions} className={styles.action} />
        </div>
    </ItemRoot>
);

Item.displayName = 'Dropzone.Item';
