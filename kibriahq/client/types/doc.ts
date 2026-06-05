export type Permission = {
    id: string | number,
    user_id: string | number;
    name: string,
    email: string,
    role: string
}

export type Doc = {
    id: string;
    name: string;
    body: string;
    permissions: Permission[];
    user_id: string | number;
    isAuthor: boolean;
    author: DocAuthor;
    created_at: string;
    updated_at: string;
}

export type DocAuthor = {
    id: string | number;
    name: string;
    email: string;
    color: string;
}