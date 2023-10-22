import { getCurrentISODateTime, getTrainTimesLineaL, getTrainTimesLineaU } from "@/utils";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	var date = searchParams.get("date");
	if (!date?.match(/\d{8}T\d{6}/g)) {
		date = getCurrentISODateTime();
	}
	console.log(date);
	const responseLineaU = await getTrainTimesLineaU(date ? date : undefined);
	const responseLineaL = await getTrainTimesLineaL(date ? date : undefined);
	const response: any = {};
	response.status =
		responseLineaL.status === "OK" && responseLineaU.status === "OK" ? "OK" : "NOK";
	response.lineaL = responseLineaL.lineaL;
	response.lineaU = responseLineaU.lineaU;
	return Response.json(response);
}
