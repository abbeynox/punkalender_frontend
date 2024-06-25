export interface Location {
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
    }[];
    createdAt: string;
    updatedAt: string;
    createdBy: {
      data: {
        id: number;
        attributes: {
          firstname: string;
          lastname: string;
          username: string;
          email: string;
          isActive: boolean;
          roles: {
            data: {
              id: number;
              attributes: {
                name: string;
                code: string;
                description: string;
              };
            }[];
          };
        };
      };
    };
    updatedBy: {
      data: {
        id: number;
        attributes: {
          firstname: string;
          lastname: string;
          username: string;
          email: string;
          isActive: boolean;
          roles: {
            data: {
              id: number;
              attributes: {
                name: string;
                code: string;
                description: string;
              };
            }[];
          };
        };
      };
    };
  };
}
