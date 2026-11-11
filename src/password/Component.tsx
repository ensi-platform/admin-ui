import { useState } from 'react';

import { supportRef } from '@ds/common/support-ref';

import { Eye, EyeOff } from '@/icons';
import { Input } from '@/input';
import { useAuiLabels } from '@/provider';

import { type IPasswordProps } from './types';

export const Password = supportRef(
    ({
        leftAddon,
        rightAddon,
        disabled = false,
        readOnly = false,
        autoComplete = 'current-password',
        ...props
    }: IPasswordProps) => {
        const { showPassword, hidePassword } = useAuiLabels();
        const [visible, setVisible] = useState(false);
        const showToggle = !disabled && !readOnly;
        const toggle = showToggle ? (
            <Input.AddonButton
                aria-label={visible ? hidePassword : showPassword}
                onClick={() => setVisible(current => !current)}
            >
                {visible ? <EyeOff /> : <Eye />}
            </Input.AddonButton>
        ) : null;

        return (
            <Input
                {...props}
                leftAddon={leftAddon}
                rightAddon={
                    rightAddon || toggle ? (
                        <>
                            {rightAddon}
                            {toggle}
                        </>
                    ) : undefined
                }
                disabled={disabled}
                readOnly={readOnly}
                autoComplete={autoComplete}
                type={visible ? 'text' : 'password'}
            />
        );
    }
);

Password.displayName = 'Password';
