// pagination
export interface PaginationParams {
	totalPages: number;
	currentPage: number;
	pageSize: number;
	totalItems: number;
}

export interface Pagination {
	pageSize: number;
	page: number;
}

// response
export interface ListResponse<T> {
	data: T[];
	pagination: PaginationParams;
}

export interface ListResponseNonPaging<T> {
	data: T[];
}

export interface Response<T> {
	data: T;
}

// request
export interface ListParams {
	[key: string]: any;
}

// Reducer
// export type ActionMap<M extends { [index: string]: any }> = {
// 	[Key in keyof M]: M[Key] extends undefined
// 		? {
// 				type: Key;
// 		  }
// 		: {
// 				type: Key;
// 				payload: M[Key];
// 		  };
// };

export interface ListValue {
	[key: string]: any;
}

// select option
export interface OptionSelectCustom<T> {
	name: string;
	value: T;
	image?: string;
	chainId?: number;
}

// file custom
export interface CustomFile extends File {
	path?: string;
	preview?: string;
	raw?: File;
}

export interface UploadItemResponse {
	itemMedia: string;
	itemOriginMedia: string;
}

// list
export interface ListId {
	_id: string;
}
