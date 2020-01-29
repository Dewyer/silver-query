import parse5 from "parse5";
import cheerio from "cheerio";
import { Category } from "../models/Category";
import { Product } from "../models/Product";
import { CategoriesCollection } from "../models/Categories";
import uuid from "uuid";
import { ProductsCollection } from "../models/ProductsCollection";
import { CrawlProgress } from "../models/CrawlProgress";
import DataRepository from "./DataRepository";

export interface HtmlObj
{
	nodeName:string,
	childNodes:HtmlObj[ ] | undefined,
	[ key:string ]: any
}

export default abstract class CrawlerService
{

	static PROXY_URL = "https://cors-anywhere.herokuapp.com/";
	static SILVERLAND = "silverland.hu";
	static ERROR_MSG = "Nincs megjeleníthető termék.";

	public static async fetchHtmlWithProxy(site:string) : Promise<string | null>
	{
		let res = await fetch(`${this.PROXY_URL}${(site)}`,{
			method:"GET"
		});

		if (res.status === 200)
		{
			let tt = await res.text();
			return tt;
		}
		return null;
	}

	public static async crawlCategories() : Promise<CategoriesCollection>
	{
		let resHtml = await this.fetchHtmlWithProxy(this.SILVERLAND);
		if (resHtml)
		{
			let DD = cheerio.load(resHtml);
			let levels = [".menulist>li>a", ".menulist>li>ul>li>a", ".menulist>li>ul>li>ul>li>a"];
			let cats:Category[ ] = [ ];
			let flat:Category[ ] = [ ];

			levels.forEach((level,levInd)=>
			{
				DD(level).each((ii,doc)=>{
					let name = doc.childNodes[0].data!;
					let id = doc.attribs["href"];
					let cat:Category = {
						name:name,
						id:uuid.v4(),
						subCategories:[ ],
						productsLink:id
					};

					if (levInd !== 0)
					{
						let parent = doc.parent.parent.parent.children[0].children[0].data;
						if (levInd === 1)
						{
							let parentCat = cats.find(x=>x.name === parent);
							if (parentCat)
							{
								parentCat.subCategories.push(cat);
							}
						}
						else
						{
							let what = cats.map(xx=>xx.subCategories.find(ll=>ll.name === parent)).find(xx=>xx !== undefined);
							if (what)
							{
								what.subCategories.push(cat);
							}
						}
					}
					else if (levInd === 0)
					{
						cats.push(cat);
					}
					flat.push(cat);
				});
			});
			return {
				flat:flat,
				graph:cats
			};
		}

		return {flat:[ ],graph:[ ]};
	}

	public static async crawlProduct(productEl:CheerioElement) : Promise<Product | null>
	{
		let href = this.getProductHrefFromListElement(productEl);
		let productHtml = await this.fetchHtmlWithProxy(href);

		if (productHtml)
		{
			let DD = cheerio.load(productHtml);
			let prod:Product = {
				title:"",
				priceHuf:0,
				productNumber:0,
				category:"",
				description:"",
				stockState:"other"
			};
			DD("#body>h2>em").each((ii,doc)=>{
				if (prod.title === "")
				{
					prod.title = doc.children[0].data ? doc.children[0].data : "";
					prod.title = prod.title.trim();
					prod.title = prod.title.substring(0, prod.title.length-2);
				}
			});

			DD("#body>div>p").each((ii,doc)=>{
				let fieldName = doc.children[0].data ? doc.children[0].data : "";
				let fieldVal = "";
				if (doc.children.length >= 2)
				{
					if (doc.children[1].children.length > 0)
						if (doc.children[1].children[0].data)
							fieldVal = doc.children[1].children[0].data;
				}

				if (fieldName.startsWith("Ár"))
				{
					prod.priceHuf = parseInt(fieldVal.trim().substring(0,fieldVal.length-2));
				}

				if (fieldName.startsWith("Szállítás"))
				{
					if (fieldVal === "Raktárról")
					{
						prod.stockState = "in-stock";
					}
					else if (fieldVal === "Csak rendelésre")
					{
						prod.stockState = "order-only";
					}
				}

				if (fieldName.startsWith("Termékszám"))
				{
					prod.productNumber= parseInt(fieldName.split(":")[1].trim());
				}
			});
			let desc = DD("#body>div>p>span").first().html();
			if (desc)
			{
				prod.description = desc;
			}
			//console.log(prod);
			return prod;
		}

		return null;
	}

	public static getProductHrefFromListElement(productEl: CheerioElement) : string
	{
		let href = "";
		productEl.children.forEach(xx =>
		{
			if (xx.attribs)
				if (xx.attribs["class"] === "more")
				{
					href = xx.children[1].attribs["href"];
				}
		})
		return href;
	}

	public static isNoProductErrorPage(dd:CheerioStatic) : boolean
	{
		let found = false;
		dd("#body>p").each((ii,doc)=>{
			if (doc.children[0].data)
			{
				let text = doc.children[0].data;
				if (text.toLowerCase().includes(this.ERROR_MSG.toLowerCase()))
				{
					found = true;
				}
			}
		});

		return found;
	}

	public static async crawlProducts(subSite:string) : Promise<Product[ ]>
	{
		console.log("getting products for: ",subSite);
		let prods:Product[ ] = [ ];

		let atPage = 0;
		while (true)
		{
			let finalUrl = `${this.SILVERLAND}${subSite}/${atPage*25}`;
			let siteHtml = await this.fetchHtmlWithProxy(finalUrl);
			if (siteHtml)
			{
				let DD = cheerio.load(siteHtml);
				let isError = this.isNoProductErrorPage(DD);
				if (isError)
				{
					break;
				}

				let allDocs:CheerioElement[ ] = [ ];
				DD("#body>div").each((ii,doc)=>{
					allDocs.push(doc);
				});

				for(let ii = 0 ; ii < allDocs.length;ii++)
				{
					let prod = await this.crawlProduct(allDocs[ii]);
					if (prod !== null)
						prods.push(prod!);
				}
			}
			else
			{
				break
			}
			console.log("at page: ",atPage);
			atPage++;
		}

		return [ ];
	}

	public static async doCrawl()
	{
		let categoriesCol = await this.crawlCategories();
		DataRepository.saveCategories(categoriesCol);

		let productsCol:ProductsCollection = DataRepository.getProductsCollection();
		let progress = DataRepository.getCrawlProgress();

		for (let ii = progress.atCatIndex; ii < categoriesCol.flat.length;ii++)
		{
			let thisCat = categoriesCol.flat[ii];
			console.log(thisCat.name, " at cat ",ii," / ",categoriesCol.flat.length);
			if (thisCat.productsLink !== "#")
			{
				let productsInThisCat = await this.crawlProducts(categoriesCol.flat[ii].productsLink);
				productsInThisCat.forEach(xx=>xx.category = thisCat.id);
				productsCol.byCategory[thisCat.id] = productsInThisCat;
			}
			DataRepository.saveProducts(productsCol);
			progress.atCatIndex = ii+1;
			DataRepository.saveCrawlProgress(progress);
		}

		DataRepository.saveProducts(productsCol);
		console.log("saved everything");
	}

	public static sleep(ms:number):Promise<void>
	{
		return new Promise((a,b)=>{setTimeout(()=>{a()},ms)})
	}

}
