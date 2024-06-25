export interface Event {
  id: number;
  attributes: {
    name: string;
    type: string;
    eventtext: string;
    eventstart: number;
    eventend: number;
    bands: {
      data: Band[];
    };
    location: {
      data: {
        id: number;
        attributes: {
          name: string;
          description: string;
          Adresse: {
            id: number;
            street: string;
            city: string;
            plz: number;
          };
          dogsAllowed: boolean;
          email: string;
          linklist: {
            id: number;
            url: string;
            title: string;
          };
          createdAt: string;
          updatedAt: string;
        };
      };
    };
    ticket?: {
      id: number;
      type: string;
      ticketlink: string;
      chf: number;
    };
    createdAt: string;
    updatedAt: string;
    creator?: string;
  };
}

export interface Band {
  id: number;
  attributes: {
    bandname: string;
    country: string;
    musicstyle: {
      id: number;
      Punk: boolean;
      Metal: boolean;
      Rock: boolean;
      Ska: boolean;
    };
    description: string;
    bandphoto: {
      data: {
        id: number;
        attributes: {
          name: string;
          url: string;
        };
      };
    };
    linklist: {
      id: number;
      url: string;
      title: string;
    }[];
    events: {
      data: Event[];
    };
  };
}
