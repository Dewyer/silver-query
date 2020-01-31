import { RequestError } from "../../models/RequestError";
import { CategoriesCollection, AllCategoriesResponse, GraphFunctions} from "../../models/backendmodels";

export default abstract class BackendService
{
	static baseUrlDebug:string="http://localhost:4200/";
	static baseUrl:string="asd";

	private static async sendRequest<T>(endpoint: string, data: any, method: string = "GET", authenticated = false): Promise<T>
	{
		let token = "asd";
		let baseUrl = this.baseUrlDebug;
		let headers = authenticated ? {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${token}`
		} : { "Content-Type": "application/json" };

		let resp = await fetch(baseUrl + endpoint, {
			method: method,
			body: (data != null && data != undefined && method != "GET") ? JSON.stringify(data) : undefined,
			headers: headers as any,
		});

		if (resp.status === 200)
		{
			try
			{
				let rr: T = await resp.json();
				return rr;
			}
			catch
			{
				return {} as T;
			}
		}
		else
		{
			//TODO fail
			throw { webStatus: resp.status, response: resp } as RequestError;
		}
	}

	public static async getCategories(): Promise<CategoriesCollection>
	{
		let cc = await this.sendRequest<AllCategoriesResponse>("api/category/all",null,"GET");
		return {graph:cc.graph,flat:GraphFunctions.getFlatCategoriesFromGraph(cc.graph)};
	}

}
