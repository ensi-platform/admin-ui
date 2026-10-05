import { useEffect, useRef, useState } from 'react';

import cn from 'classnames';

import { supportRef } from '@ds/common/support-ref';
import { typographyStyles } from '@ds/typography';

import { Check, Copy } from '@/icons';
import { useAuiLabels } from '@/provider';
import { Tooltip } from '@/tooltip';

import { type ICopyButtonProps } from './types';

import styles from './styles.module.css';

type TCopyPhase = 'idle' | 'copied' | 'failed';

const withValue = (template: string, value: string) => template.replaceAll('{value}', value);

export const CopyButton = supportRef(
    ({
        ref,
        children,
        timeout = 1000,
        className,
        dataTestId,
        onClick,
        onPointerEnter,
        onPointerLeave,
        onFocus,
        onBlur,
        ...props
    }: ICopyButtonProps) => {
        const { copy, copied, copyFailed } = useAuiLabels();
        const [phase, setPhase] = useState<TCopyPhase>('idle');
        const [isOpen, setIsOpen] = useState(false);
        const [tip, setTip] = useState(copy);
        const phaseRef = useRef(phase);
        const settlingRef = useRef(false);
        const overRef = useRef(false);
        const reopenRef = useRef<number | null>(null);
        const isCopied = phase === 'copied';
        const isFailed = phase === 'failed';
        const Icon = isCopied ? Check : Copy;
        const name = phase === 'idle' ? `${copy} ${children}` : tip;

        phaseRef.current = phase;

        useEffect(
            () => () => {
                if (reopenRef.current != null) {
                    window.clearTimeout(reopenRef.current);
                }
            },
            []
        );

        useEffect(() => {
            if (phase === 'idle') {
                return;
            }

            const timer = window.setTimeout(() => {
                settlingRef.current = true;
                phaseRef.current = 'idle';
                setPhase('idle');
                setIsOpen(false);

                reopenRef.current = window.setTimeout(() => {
                    settlingRef.current = false;
                    reopenRef.current = null;

                    if (!overRef.current) {
                        return;
                    }

                    setTip(copy);
                    setIsOpen(true);
                }, 16);
            }, timeout);

            return () => window.clearTimeout(timer);
        }, [copy, phase, timeout]);

        return (
            <Tooltip
                isOpen={isOpen}
                delay={0}
                closeDelay={0}
                onOpenChange={open => {
                    if (!open && phaseRef.current !== 'idle') {
                        return;
                    }

                    if (open && settlingRef.current) {
                        return;
                    }

                    if (open && phaseRef.current === 'idle') {
                        setTip(copy);
                    }

                    setIsOpen(open);
                }}
            >
                <Tooltip.Trigger>
                    <button
                        {...props}
                        ref={ref}
                        type="button"
                        className={cn(styles.root, typographyStyles.bodyS, className)}
                        data-test-id={dataTestId}
                        data-copied={isCopied || undefined}
                        data-failed={isFailed || undefined}
                        aria-label={name}
                        onPointerEnter={event => {
                            overRef.current = true;
                            onPointerEnter?.(event);
                        }}
                        onPointerLeave={event => {
                            overRef.current = false;
                            onPointerLeave?.(event);
                        }}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onClick={event => {
                            onClick?.(event);
                            overRef.current = true;

                            if (event.defaultPrevented) {
                                return;
                            }

                            window.navigator.clipboard.writeText(children).then(
                                () => {
                                    phaseRef.current = 'copied';
                                    setPhase('copied');
                                    setTip(withValue(copied, children));
                                    setIsOpen(true);
                                },
                                () => {
                                    phaseRef.current = 'failed';
                                    setPhase('failed');
                                    setTip(copyFailed);
                                    setIsOpen(true);
                                }
                            );
                        }}
                    >
                        {children}
                        <Icon className={styles.icon} />
                    </button>
                </Tooltip.Trigger>
                <Tooltip.Content placement="top">{tip}</Tooltip.Content>
            </Tooltip>
        );
    }
);

CopyButton.displayName = 'CopyButton';
