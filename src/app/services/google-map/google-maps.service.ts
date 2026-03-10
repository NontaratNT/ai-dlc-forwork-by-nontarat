/// <reference types="@types/google.maps" />
import { Injectable } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { from, Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  private geocoder: google.maps.Geocoder | null = null;
  private map: google.maps.Map | null = null;
  private marker: google.maps.Marker | null = null;
  private isLoaded = false;
  private loader: Loader;

  constructor() {
    this.loader = new Loader({
      apiKey: environment.config.googleMapsApiKey,
      version: 'weekly',
      language: 'th',
      region: 'TH'
    });
  }

  private initGeocoder(): Observable<google.maps.Geocoder> {
    if (this.geocoder) {
      return of(this.geocoder);
    }

    // Using loader.load() to load the Maps API
    return from(this.loader.load()).pipe(
      map(() => {
        this.geocoder = new google.maps.Geocoder();
        this.isLoaded = true;
        return this.geocoder;
      })
    );
  }

  initMap(mapElement: HTMLElement, center: { lat: number, lng: number }): Observable<google.maps.Map> {
    return from(this.loader.load()).pipe(
      map(() => {
        const options: google.maps.MapOptions = {
          center: center,
          zoom: 15,
          restriction: {
            latLngBounds: {
              north: 20.5,
              south: 5.5,
              west: 97.3,
              east: 105.7,
            },
            strictBounds: false
          },
          styles: [
            {
              featureType: "poi",
              stylers: [{ visibility: "off" }]
            },
            {
              featureType: "transit",
              stylers: [{ visibility: "off" }]
            }
          ]
        };
        this.map = new google.maps.Map(mapElement, options);
        this.marker = new google.maps.Marker({
          position: center,
          map: this.map,
          draggable: true
        });
        return this.map;
      })
    );
  }

  setMarkerPosition(lat: number, lng: number) {
    if (this.marker && this.map) {
      const pos = { lat, lng };
      this.marker.setPosition(pos);
      this.map.panTo(pos);
    }
  }

  loadGeoJson(url: string) {
    if (this.map) {
      this.map.data.loadGeoJson(url);
      this.map.data.setStyle((feature) => {
        // Hide standard Point markers loaded from GeoJSON
        if (feature.getGeometry()?.getType() === 'Point') {
          return { visible: false };
        }
        return {
          fillColor: 'blue',
          fillOpacity: 0.1,
          strokeColor: 'blue',
          strokeWeight: 1,
          visible: true
        };
      });
    }
  }

  onMapClick(callback: (lat: number, lng: number) => void) {
    if (this.map) {
      this.map.addListener('click', (event: any) => {
        if (event.latLng) {
          callback(event.latLng.lat(), event.latLng.lng());
        }
      });
      // Allow clicking on polygons/geojson data
      this.map.data.addListener('click', (event: any) => {
        if (event.latLng) {
          callback(event.latLng.lat(), event.latLng.lng());
        }
      });
    }

    if (this.marker) {
      this.marker.addListener('dragend', (event: any) => {
        if (event.latLng) {
          callback(event.latLng.lat(), event.latLng.lng());
        }
      });
    }
  }

  geocode(address: string): Observable<google.maps.GeocoderResult[]> {
    return this.initGeocoder().pipe(
      mergeMap(geocoder => {
        return new Observable<google.maps.GeocoderResult[]>(observer => {
          geocoder.geocode({
            address,
            componentRestrictions: { country: 'TH' }
          }, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
            if (status === google.maps.GeocoderStatus.OK && results) {
              observer.next(results);
              observer.complete();
            } else {
              observer.error(new Error('Geocoding failed: ' + status));
            }
          });
        });
      }),
      catchError(err => {
        console.error(err);
        throw err;
      })
    );
  }

  reverseGeocode(lat: number, lng: number): Observable<google.maps.GeocoderResult[]> {
    return this.initGeocoder().pipe(
      mergeMap(geocoder => {
        const latlng = { lat, lng };
        return new Observable<google.maps.GeocoderResult[]>(observer => {
          geocoder.geocode({ location: latlng }, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
            if (status === google.maps.GeocoderStatus.OK && results) {
              observer.next(results);
              observer.complete();
            } else {
              observer.error(new Error('Reverse Geocoding failed: ' + status));
            }
          });
        });
      }),
      catchError(err => {
        console.error(err);
        throw err;
      })
    );
  }
}
