/**
 * OpenStreetMap Service for ZooL Vet & Co
 * Handles location-based services using OSM Overpass API.
 */

export interface Location {
  lat: number;
  lng: number;
  isFallback?: boolean;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  rating?: number;
  distance?: string;
  type: 'vet' | 'groomer' | 'pharmacy' | 'shop' | 'boarding';
  location: Location;
  isSubsidized?: boolean;
  pricePoint?: 'budget' | 'standard' | 'premium';
}

export const getCurrentLocation = (): Promise<Location> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ lat: 8.5241, lng: 76.9366, isFallback: true });
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            isFallback: false
          });
        },
        (error) => {
          console.warn("Geolocation error:", error.message, "Code:", error.code);
          // Default to Trivandrum center if permission denied or timeout
          resolve({ lat: 8.5241, lng: 76.9366, isFallback: true });
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
      );
    }
  });
};

const placesApiCache = new Map<string, { timestamp: number, data: Place[] }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export const findNearbyPlaces = async (location: Location, type: string): Promise<Place[]> => {
  const cacheKey = `${location.lat.toFixed(3)},${location.lng.toFixed(3)}-${type}`;
  const now = Date.now();
  const cached = placesApiCache.get(cacheKey);
  
  if (cached && (now - cached.timestamp < CACHE_TTL)) {
    return cached.data;
  }

  try {
    // Determine OSM tags based on requested type
    let tags = "";
    if (type === "all" || type === "vet") {
      tags += `node["amenity"="veterinary"](around:5000,${location.lat},${location.lng});`;
    }
    if (type === "all" || type === "shop" || type === "groomer") {
      tags += `node["shop"="pet"](around:5000,${location.lat},${location.lng});`;
    }

    const query = `[out:json][timeout:15];(${tags});out body 15;`;
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query
    });

    if (!response.ok) throw new Error(`Overpass API error: ${response.status}`);
    
    const data = await response.json();
    const elements: any[] = data.elements || [];

    const places: Place[] = elements.map(el => {
      const isVet = el.tags.amenity === "veterinary";
      return {
        id: el.id.toString(),
        name: el.tags.name || (isVet ? 'Veterinary Clinic' : 'Pet Shop'),
        address: [el.tags['addr:street'], el.tags['addr:city']].filter(Boolean).join(', ') || 'Address not provided',
        type: isVet ? 'vet' : 'shop',
        location: { lat: el.lat, lng: el.lon },
        isSubsidized: el.tags.name?.toLowerCase().includes('government') || el.tags.name?.toLowerCase().includes('charity'),
        distance: 'Nearby' // We could calculate haversine here
      };
    });

    if (places.length > 0) {
      placesApiCache.set(cacheKey, { timestamp: Date.now(), data: places });
      return places;
    } else {
      throw new Error("No OSM results");
    }
  } catch (error) {
    console.warn("Falling back to mock data due to OSM API error or no results:", error);
    const mockData = getMockPlaces(location, type);
    placesApiCache.set(cacheKey, { timestamp: Date.now(), data: mockData });
    return mockData;
  }
};

const getMockPlaces = (location: Location, type: string): Place[] => {
  const allPlaces: Place[] = [
    { 
      id: '1', 
      name: 'Happy Paws Clinic', 
      type: 'vet', 
      rating: 4.8, 
      address: 'PMG, Trivandrum', 
      distance: '1.2 km',
      location: { lat: location.lat + 0.01, lng: location.lng + 0.01 }
    },
    { 
      id: '2', 
      name: 'The Grooming Room', 
      type: 'groomer', 
      rating: 4.5, 
      address: 'Kowdiar, Trivandrum', 
      distance: '2.5 km',
      location: { lat: location.lat - 0.02, lng: location.lng + 0.015 }
    },
    { 
      id: '3', 
      name: 'City Pet Hospital', 
      type: 'vet', 
      rating: 4.9, 
      address: 'Pattom, Trivandrum', 
      distance: '3.8 km',
      location: { lat: location.lat + 0.005, lng: location.lng - 0.01 }
    },
    { 
      id: '4', 
      name: 'Pet Care Pharmacy', 
      type: 'pharmacy', 
      rating: 4.2, 
      address: 'Kazhakootam, Trivandrum', 
      distance: '5.1 km',
      location: { lat: location.lat + 0.03, lng: location.lng + 0.02 }
    },
  ];

  if (type === 'all') return allPlaces;
  return allPlaces.filter(p => p.type === type);
};

export const getDirectionsUrl = (location: Location) => {
  return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=current%3B${location.lat}%2C${location.lng}`;
};

export const getStaticMapUrl = (location: Location, markers?: Location[]) => {
  // Free static map alternative using osm static map or similar if needed.
  // We mock a placeholder for now to save API hits.
  return `https://dummyimage.com/600x300/a8d8ea/2d2a26&text=OSM+Static+Map`;
};
