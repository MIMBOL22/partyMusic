export interface ISong {
    id: number;
    author: string;
    name: string;
    youtube: string | null;
    adder?:{
        id: number;
        firstName: string;
        lastName: string;
        vk_id: number;
    },
    likes: number;
    dislikes: number;
    rating: number;
}
