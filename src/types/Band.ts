export interface Band {
  id: number;
  attributes: {
    bandname: string;
    country: string;
    musicstyle: MusicStyle;
    description: string;
    bandphoto: Photo;
    linklist: Link[];
    events: Event[];
    createdAt: string;
    updatedAt: string;
    createdBy: User;
    updatedBy: User;
  };
}

export interface MusicStyle {
  id: number;
  Punk: boolean;
  Metal: boolean;
  Rock: boolean;
  Ska: boolean;
}

export interface Photo {
  data: {
    id: number;
    attributes: PhotoAttributes;
  };
}

export interface PhotoAttributes {
  name: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
  formats: string;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string;
  provider: string;
  provider_metadata: string;
  related: RelatedData;
  folder: FolderData;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  updatedBy: User;
}

export interface RelatedData {
  data: Related[];
}

export interface Related {
  id: number;
  attributes: {};
}

export interface FolderData {
  data: Folder;
}

export interface Folder {
  id: number;
  attributes: FolderAttributes;
}

export interface FolderAttributes {
  name: string;
  pathId: number;
  parent: ParentData;
  children: FolderData[];
  files: FileData[];
  path: string;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  updatedBy: User;
}

export interface ParentData {
  data: Parent;
}

export interface Parent {
  id: number;
  attributes: {};
}

export interface FileData {
  data: File[];
}

export interface File {
  id: number;
  attributes: FileAttributes;
}

export interface FileAttributes {
  name: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
  formats: string;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string;
  provider: string;
  provider_metadata: string;
  related: RelatedData;
  folder: FolderData;
  folderPath: string;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  updatedBy: User;
}

export interface Link {
  id: number;
  url: string;
  title: string;
}

export interface Event {
  id: number;
  attributes: EventAttributes;
}

export interface EventAttributes {
  name: string;
  type: string;
  musicstyle: MusicStyle;
  eventtext: string;
  eventstart: number;
  eventend: number;
  bands: Band[];
  location: Location;
  ticket: Ticket;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  updatedBy: User;
}

export interface Location {
  data: LocationData;
}

export interface LocationData {
  id: number;
  attributes: LocationAttributes;
}

export interface LocationAttributes {
  name: string;
  description: string;
  Adresse: Address;
  dogsAllowed: boolean;
  email: string;
  linklist: Link;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  updatedBy: User;
}

export interface Address {
  id: number;
  street: string;
  city: string;
  plz: number;
}

export interface Ticket {
  id: number;
  type: string;
  ticketlink: string;
  chf: number;
}

export interface User {
  data: UserData;
}

export interface UserData {
  id: number;
  attributes: UserAttributes;
}

export interface UserAttributes {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  resetPasswordToken: string;
  registrationToken: string;
  isActive: boolean;
  roles: RoleData;
  blocked: boolean;
  preferedLanguage: string;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  updatedBy: User;
}

export interface RoleData {
  data: Role[];
}

export interface Role {
  id: number;
  attributes: RoleAttributes;
}

export interface RoleAttributes {
  name: string;
  code: string;
  description: string;
  users: UserData[];
  permissions: PermissionData[];
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  updatedBy: User;
}

export interface PermissionData {
  data: Permission[];
}

export interface Permission {
  id: number;
  attributes: PermissionAttributes;
}

export interface PermissionAttributes {
  action: string;
  actionParameters: string;
  subject: string;
  properties: string;
  conditions: string;
  role: RoleData;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  updatedBy: User;
}
