/** Point in viewport coordinates. */
export interface ICoordinates {
    x: number;
    y: number;
}

/** Axis-aligned box from getBoundingClientRect corners. */
export interface IRectangle {
    bottomLeft: ICoordinates;
    topLeft: ICoordinates;
    topRight: ICoordinates;
}

/** Aim triangle (prev mouse → submenu top/bottom). */
export interface ITriangle {
    A: ICoordinates;
    B: ICoordinates;
    C: ICoordinates;
}

/** Bounding box for aim / hit tests; undefined when elem missing or rect falsy. */
export const getRectangle = (elem?: HTMLElement | null): IRectangle | undefined => {
    const boundingBox = elem?.getBoundingClientRect();

    if (!boundingBox) {
        return undefined;
    }

    return {
        topLeft: {
            x: boundingBox.left,
            y: boundingBox.top,
        },
        topRight: {
            x: boundingBox.right,
            y: boundingBox.top,
        },
        bottomLeft: {
            x: boundingBox.left,
            y: boundingBox.bottom,
        },
    };
};

/** Whether point is inside axis-aligned rectangle. */
export const isInsideRectangle = (rectangle: IRectangle, point: ICoordinates) => {
    const { topLeft, topRight, bottomLeft } = rectangle;

    return point.x >= topLeft.x && point.x <= topRight.x && point.y >= topLeft.y && point.y <= bottomLeft.y;
};

const toEdge = (pointA: ICoordinates, pointB: ICoordinates) => ({
    v1: pointA,
    v2: pointB,
});

const toVector = (pointA: ICoordinates, pointB: ICoordinates) => ({
    x: pointB.x - pointA.x,
    y: pointB.y - pointA.y,
});

const getPolarity = (edge: { v1: ICoordinates; v2: ICoordinates }, point: ICoordinates) => {
    const vectorA = toVector(edge.v1, edge.v2);
    const vectorB = toVector(edge.v1, point);
    const scalar = vectorA.x * vectorB.y - vectorA.y * vectorB.x;

    return scalar >= 0 ? 1 : -1;
};

const checkSameSide = (edge: { v1: ICoordinates; v2: ICoordinates }, point1: ICoordinates, point2: ICoordinates) =>
    getPolarity(edge, point1) === getPolarity(edge, point2);

/** Whether point is inside triangle (same-side edge test). */
export const isInsideTriangle = (triangle: ITriangle, point: ICoordinates) => {
    const { A, B, C } = triangle;

    return (
        checkSameSide(toEdge(A, B), C, point) &&
        checkSameSide(toEdge(A, C), B, point) &&
        checkSameSide(toEdge(B, C), A, point)
    );
};

/** Mouse client coordinates from a native MouseEvent. */
export const getMousePosition = (mouseEvent: MouseEvent): ICoordinates => ({
    x: mouseEvent.clientX,
    y: mouseEvent.clientY,
});
