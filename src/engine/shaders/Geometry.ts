interface Square {
    type: GeometryType.SQUARE,
    vertices: 4,
}

interface Triangle {
    type: GeometryType.TRIANGLE,
    vertices: 3,
}

interface Asteroid {
    type: GeometryType.ASTEROID,
    vertices: 8,
}

type Geometry = Square | Triangle | Asteroid;

export enum GeometryType {
    SQUARE,
    TRIANGLE,
    ASTEROID,
}