import { CLOSE_THRESHOLD, MAX_SWIPE_CLOSE_VELOCITY, OFFSET_THRESHOLD, SWIPE_CLOSE_VELOCITY } from './constants';

export interface IShouldCloseSheetParams {
    /** Drag distance in px (positive = down). */
    deltaY: number;
    /** Panel height in px. */
    height: number;
    /** Absolute velocity in px/ms. */
    velocity: number;
    /** Offset applied when swipe started after scroll (px). */
    swipeStartOffset: number;
}

/** Whether a swipe gesture should dismiss the sheet. */
export const shouldCloseSheet = ({ deltaY, height, velocity, swipeStartOffset }: IShouldCloseSheetParams): boolean => {
    const closeByDistance = deltaY - swipeStartOffset > height * CLOSE_THRESHOLD;
    const velocityThreshold = swipeStartOffset > OFFSET_THRESHOLD ? MAX_SWIPE_CLOSE_VELOCITY : SWIPE_CLOSE_VELOCITY;
    const closeByVelocity = velocity > velocityThreshold;

    return closeByDistance || closeByVelocity;
};
