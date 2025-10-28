import { generateUploadButton, generateUploadDropzone } from "@uploadthing/react";

import type { OurFileRouterType } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouterType>();
export const UploadDropzone = generateUploadDropzone<OurFileRouterType>();
