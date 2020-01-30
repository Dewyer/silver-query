export interface Category {
    name: string;
    subCategories: Category[];
    id: string;
    productsLink: string;
}
