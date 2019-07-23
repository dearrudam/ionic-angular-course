import { PlaceLocation } from './location.model';

export class Place {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public imageUrl: string,
        public price: number,
        public availableFrom: Date,
        public availableTo: Date,
        public userId: string,
        public location: PlaceLocation) {
    }
}

export function newSamplePlace(): Place {
    return new Place(Math.random().toString(), Math.random().toString(), Math.random().toString(), Math.random().toString(), 999.99, new Date(), new Date(), Math.random().toString(), { lat: Math.random(), lng: Math.random(), address: Math.random().toString(), staticMapImageUrl: Math.random().toString() });
}
