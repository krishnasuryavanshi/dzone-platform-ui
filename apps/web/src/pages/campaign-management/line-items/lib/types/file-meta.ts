export interface IFileMeta {
  file: IFileMetaData & IFileNameMeta;
}

export interface IFileUploadMeta {
  file: IFileMetaData;
}

export interface IFileMetaData {
  types: string[];
  size: string;
  storageLocation?: string;
  allowedMultiples?: boolean;
  allowedEncryption?: boolean;
  progress?: boolean;
}

export interface IFileNameMeta {
  name: {
    length: number;
    regex: string;
  };
}

export interface IFileUploadMeta {
  types: string[];
  size: string;
  headers: string[];
}

export interface IFileUploadMetaData extends IFileUploadMeta, IFileNameMeta {}

export type DialogStateHandler = (
  state: Record<string, string | number | boolean>,
) => void;
export type FileHandler = (file: any) => void;
