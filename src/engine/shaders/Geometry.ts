interface Square {
    type: GeometryType.SQUARE,
    vertices: 4,
}

interface Triangle {
    type: GeometryType.TRIANGLE,
    vertices: 3,
}
type Geometry = Square | Triangle;

export enum GeometryType {
    SQUARE,
    TRIANGLE,
}