export class Place {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public imageUrl: string,
        public price: number,
        public availableFrom: Date,
        public availableTo: Date,
        public userId?: string) {
    }
}

export function newSamplePlace(): Place {
    return new Place(Math.random().toString(), Math.random().toString(), Math.random().toString(), Math.random().toString(), 999.99, new Date(), new Date(), Math.random().toString());
}
