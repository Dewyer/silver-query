
export interface ICategory
{
	name:string,
	subCategories:ICategory[ ],
	id:string,
	productsLink:string
}
