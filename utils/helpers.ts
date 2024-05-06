export interface Marker {
  lat: number;
  lng: number;
}

export const calculatePolygonArea = (markers: Marker[]): number => {
  let area = 0;
  const numOfVertices = markers.length;
  let prevVertexIndex = numOfVertices - 1;

  for (let currIndex = 0; currIndex < numOfVertices; currIndex++) {
    const currentVertex = markers[currIndex];
    const previousVertex = markers[prevVertexIndex];

    area +=
      (previousVertex.lng + currentVertex.lng) *
      (previousVertex.lat - currentVertex.lat);

    prevVertexIndex = currIndex;
  }

  // Calculate the absolute value of the result and divide by 2 to get the final area
  area = Math.abs(area) / 2;

  return area;
};

export const convertCoordinates = (coordinates: any[]): any[] => {
  return coordinates.map((coordList: any[]) => {
    return coordList.map((coord: any) => {
      return {
        lat: coord.lat.toString(),
        lng: coord.lng.toString(),
      };
    });
  });
};

export const formatData = (data: any) => {
  let items: any = [];
  data[0].flatMap((data: any) => items.push(data));
  return items[0];
};
