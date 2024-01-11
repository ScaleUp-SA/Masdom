import {
  CarsImages,
  CarsVideos,
  Damage,
  ListingCars,
  Message,
  RepairShops,
  ShopsImages,
} from "@prisma/client";

export type Session = {
  user: {
    name?: string; // Optional property
    email: string; // Required property
    image?: string; // Optional property
    username: string; // Required property
    isAdmin: boolean; // Required property
    id: string; // Required property
    phoneNumber: string; // Required property
  };
};

export interface Chat {
  users: {
    id: string;
    username: string;
    email: string;
    password: string;
    isAdmin: boolean;
    phoneNumber: string;
    createdAt: Date;
    updatedAt: Date;
  };
  messages: Message[];
}

export type CloudinaryUploadEvent = {
  event: "success";
  info: {
    access_mode: "public";
    asset_id: string;
    batchId: string;
    bytes: number;
    created_at: string; // Should be Date
    etag: string;
    folder: string;
    format: string;
    height: number;
    id: string;
    original_extension: string;
    original_filename: string;
    path: string;
    placeholder: boolean;
    public_id: string;
    resource_type: string;
    secure_url: string;
    signature: string;
    tags: string[];
    thumbnail_url: string;
    type: "upload";
    url: string;
    version: number;
    version_id: string;
    width: number;
  };
};

export interface FullCar extends ListingCars {
  CarsMakers: {
    id: string;
    name: string;
  } | null;
  CarsModels: {
    id: string;
    name: string;
  } | null;

  images: CarsImages[];
  videos: CarsVideos[];
  damage: Damage[];
}

export type FormData = {
  damage: Damage[];
  videos: CarsVideos[];
  images: CarsImages[];
  carId: string;
  title: string;
  mileage: number;
  year: string;
  carsModelsId: string;
  city: string;
  color: string;
  country: string;
  cylinders: number;
  offerDetails: string;
  ownerId: string;
  price: number;
  shape: string;
  carClass: string;
  carsMakersId: string;
  transmission: string;
};

export type ShopFormData = {
  images: ShopsImages[];
  shopId: string;
  name: string;
  city: string;
  country: string;
  cars: string[];
};

export interface FilterOption {
  value: string;
  label: string;
  checked: boolean;
}

export interface Filter {
  id: string;
  name: string;
  options: FilterOption[];
}

export interface FullShop extends RepairShops {
  images: ShopsImages[];
}
