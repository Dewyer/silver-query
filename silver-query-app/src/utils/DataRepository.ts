import { CategoriesCollection } from "../models/Categories";
import { ProductsCollection } from "../models/ProductsCollection";
import { CrawlProgress } from "../models/CrawlProgress";

export default abstract class DataRepository
{

	private static getDefaultCategoriesCollection() : CategoriesCollection
	{
		return ({
			flat:[ ],
			graph:[ ]
		});
	}

	private static getDefaultProductsCollection() : ProductsCollection
	{
		return ({
			byCategory:{}
		});
	}

	private static getDefaultProgress() : CrawlProgress
	{
		return ({
			atCatIndex:0
		});
	}

	private static getObjectFromStorage<T>(key:string):T | null
	{
		let objStr = localStorage.getItem(key);
		if (objStr)
		{
			return JSON.parse(objStr) as T;
		}
		return null;
	}

	public static saveObjectToStorage(key:string,obj:any)
	{
		localStorage.setItem(key,JSON.stringify(obj));
	}

	public static getCategoriesCollection(): CategoriesCollection
	{
		let savedPos = this.getObjectFromStorage<CategoriesCollection>("categories");
		return savedPos ? savedPos : this.getDefaultCategoriesCollection();
	}

	public static getProductsCollection() : ProductsCollection
	{
		let savedPos = this.getObjectFromStorage<ProductsCollection>("products");
		return savedPos ? savedPos : this.getDefaultProductsCollection();
	}

	public static getCrawlProgress() : CrawlProgress
	{
		let savedPos = this.getObjectFromStorage<CrawlProgress>("progress");
		return savedPos ? savedPos : this.getDefaultProgress();
	}

	public static saveCategories(newCat:CategoriesCollection)
	{
		this.saveObjectToStorage("categories",newCat);
	}

	public static saveProducts(newProd: ProductsCollection)
	{
		this.saveObjectToStorage("products", newProd);
	}

	public static saveCrawlProgress(prog:CrawlProgress)
	{
		this.saveObjectToStorage("progress",prog);
	}
}
