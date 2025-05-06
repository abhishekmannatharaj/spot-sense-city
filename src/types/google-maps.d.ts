
declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, opts?: MapOptions);
      setMap(map: Map | null): void;
      setCenter(latLng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
      setOptions(options: MapOptions): void;
      panTo(latLng: LatLng | LatLngLiteral): void;
      getCenter(): LatLng;
      getZoom(): number;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setMap(map: Map | null): void;
      setPosition(latLng: LatLng | LatLngLiteral): void;
      setTitle(title: string): void;
      setIcon(icon: string | Icon | Symbol): void;
      setVisible(visible: boolean): void;
      getPosition(): LatLng;
      addListener(eventName: string, handler: Function): MapsEventListener;
    }

    interface MarkerOptions {
      position: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      icon?: string | Icon | Symbol;
      label?: string | MarkerLabel;
      draggable?: boolean;
      clickable?: boolean;
      visible?: boolean;
      zIndex?: number;
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      disableDefaultUI?: boolean;
      zoomControl?: boolean;
      mapTypeControl?: boolean;
      streetViewControl?: boolean;
      fullscreenControl?: boolean;
      mapTypeId?: string;
      styles?: any[];
    }

    interface Symbol {
      path: SymbolPath | string;
      fillColor?: string;
      fillOpacity?: number;
      scale?: number;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
    }

    interface Icon {
      url: string;
      size?: Size;
      scaledSize?: Size;
      origin?: Point;
      anchor?: Point;
    }

    interface MarkerLabel {
      text: string;
      color?: string;
      fontFamily?: string;
      fontSize?: string;
      fontWeight?: string;
    }

    class LatLng {
      constructor(lat: number, lng: number, noWrap?: boolean);
      lat(): number;
      lng(): number;
      toString(): string;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    class Size {
      constructor(width: number, height: number, widthUnit?: string, heightUnit?: string);
      width: number;
      height: number;
      equals(other: Size): boolean;
    }

    class Point {
      constructor(x: number, y: number);
      x: number;
      y: number;
      equals(other: Point): boolean;
    }

    enum SymbolPath {
      CIRCLE,
      FORWARD_CLOSED_ARROW,
      FORWARD_OPEN_ARROW,
      BACKWARD_CLOSED_ARROW,
      BACKWARD_OPEN_ARROW
    }

    interface MapsEventListener {
      remove(): void;
    }
  }
}
