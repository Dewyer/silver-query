import cheerio from "cheerio";
import { ICategory } from "../models/Category";
import { CategoriesCollection } from "../models/Categories";
import uuid from "uuid";
import fetch from "node-fetch";
import {singleton, container} from "tsyringe";
import CategoryRepository from "../repositories/CategoryRepository";
import { Category, CategoryModel } from "../models/database/CategoryModel";
import {Types} from 'mongoose';
import { Product, ProductModel } from "../models/database/ProductModel";
import ProductRepository from "../repositories/ProductRepository";
import CrawlProgressRepository from "../repositories/CrawlProgressRepository";

@singleton()
export default class CrawlerService
{

	PROXY_URL = "https://cors-anywhere.herokuapp.com/";
	SILVERLAND = "http://www.silverland.hu";
	ERROR_MSG = "Nincs megjeleníthető termék.";

	_categoryRepository:CategoryRepository;
	_productRepository:ProductRepository;
	_crawlProgressRepository:CrawlProgressRepository;

	constructor()
	{
		this._categoryRepository = container.resolve(CategoryRepository);
		this._productRepository = container.resolve(ProductRepository);
		this._crawlProgressRepository = container.resolve(CrawlProgressRepository);
	}

	public async fetchHtmlWithProxy(site:string) : Promise<string | null>
	{
		let res = await fetch(`${encodeURI(site)}`,{
			method:"GET"
		});

		if (res.status === 200)
		{
			let tt = await res.text();
			return tt;
		}
		return null;
	}

	public async crawlCategories() : Promise<CategoriesCollection>
	{
		let resHtml = await this.fetchHtmlWithProxy(this.SILVERLAND);
		if (resHtml)
		{
			let DD = cheerio.load(resHtml);
			let levels = [".menulist>li>a", ".menulist>li>ul>li>a", ".menulist>li>ul>li>ul>li>a"];
			let cats:Category[ ] = [ ];
			let flat: Category[ ] = [ ];

			levels.forEach((level,levInd)=>
			{
				DD(level).each((ii,doc)=>{
					let name = doc.childNodes[0].data!;
					let id = doc.attribs["href"];
					let cat: Category = new CategoryModel({
						name:name,
						_id: new Types.ObjectId(),
						subCategoriesIds:[],
						productsLink :id
					});
					cat.subCategories = [];
					
					if (levInd !== 0)
					{
						let parent = doc.parent.parent.parent.children[0].children[0].data;
						if (levInd === 1)
						{
							let parentCat = cats.find(x=>x.name === parent);
							if (parentCat)
							{
								parentCat.subCategories!.push(cat);
							}
						}
						else
						{
							let what = cats.map(xx=>xx.subCategories!.find(ll=>ll.name === parent)).find(xx=>xx !== undefined);
							if (what)
							{
								what.subCategories!.push(cat);
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

	public async crawlProduct(productEl:CheerioElement) : Promise<Product | null>
	{
		let href = this.getProductHrefFromListElement(productEl);
		let productHtml = await this.fetchHtmlWithProxy(href);

		if (productHtml)
		{
			let DD = cheerio.load(productHtml);
			let prod:Product = new ProductModel({
				title:"",
				priceHuf:0,
				productNumber:0,
				categoryId:"",
				description:"",
				stockState:"other",
				silverUrl:encodeURI(href)
			});
			
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

	public getProductHrefFromListElement(productEl: CheerioElement) : string
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

	public isNoProductErrorPage(dd:CheerioStatic) : boolean
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

	public async crawlProducts(subSite:string) : Promise<Product[ ]>
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

		return prods;
	}

	public async doCrawl()
	{
		console.log("Start crawl.")
		let categoriesCol = await this.crawlCategories();
		let didWipe = await this._categoryRepository.wipeCategories();
		
		await this._categoryRepository.bulkAddCategory(categoriesCol.flat);

		let progress = await this._crawlProgressRepository.getActiveProgress();

		for (let ii = progress.atCategoryIndex; ii < categoriesCol.flat.length;ii++)
		{
			let thisCat = categoriesCol.flat[ii];
			console.log(thisCat.name, " at cat ",ii," / ",categoriesCol.flat.length);
			if (thisCat.productsLink !== "#")
			{
				let productsInThisCat = await this.crawlProducts(categoriesCol.flat[ii].productsLink);
				productsInThisCat.forEach(xx=>xx.categoryId = thisCat._id.toHexString());
				await this._productRepository.bulkAddProduct(productsInThisCat);
			}
			
			progress.atCategoryIndex = ii+1;
			await this._crawlProgressRepository.updateCrawlProgress(progress);
		}

		console.log("saved everything");
	}

	private sleep(ms:number):Promise<void>
	{
		return new Promise((a,b)=>{setTimeout(()=>{a()},ms)})
	}

}
