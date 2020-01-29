
export interface Product
{
	title:string,
	category:string,
	productNumber:number,
	priceHuf:number,
	description:string,
	stockState:"in-stock"|"order-only"|"other"
}
