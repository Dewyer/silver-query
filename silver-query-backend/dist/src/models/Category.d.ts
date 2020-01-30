export interface ICategory {
    name: string;
    subCategories?: ICategory[];
    _id: string;
    productsLink: string;
}
