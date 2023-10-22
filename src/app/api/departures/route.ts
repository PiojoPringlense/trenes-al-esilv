import {
	StopPointSQY,
	StopPointDEF,
	StopPointVRD,
	getCurrentISODateTime,
	getDeparturesArrivals,
	getDeparturesArrivalsPairs,
	sortDepartureArrivalPair,
} from "@/utils";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	var date = searchParams.get("date");
	if (!date?.match(/\d{8}T\d{6}/g)) {
		date = getCurrentISODateTime();
	}

	const salidasSQY = await getDeparturesArrivals(date, "U", StopPointSQY, "departures");
	const salidasVRD = await getDeparturesArrivals(date, "L", StopPointVRD, "departures");
	const llegadasDEFL = await getDeparturesArrivals(date, "L", StopPointDEF, "arrivals");
	const llegadasDEFU = await getDeparturesArrivals(date, "U", StopPointDEF, "arrivals");

	const llegadasSQY = await getDeparturesArrivals(date, "U", StopPointSQY, "arrivals");
	const llegadasVRD = await getDeparturesArrivals(date, "L", StopPointVRD, "arrivals");
	const salidasDEFL = await getDeparturesArrivals(date, "L", StopPointDEF, "departures");
	const salidasDEFU = await getDeparturesArrivals(date, "U", StopPointDEF, "departures");

	const status =
		salidasSQY.status === "NOK" &&
		salidasVRD.status === "NOK" &&
		llegadasDEFL.status === "NOK" &&
		llegadasDEFU.status === "NOK" &&
		salidasDEFU.status === "NOK" &&
		salidasDEFL.status === "NOK" &&
		llegadasVRD.status === "NOK" &&
		llegadasSQY.status === "NOK"
			? "NOK"
			: "OK";

	if (status === "NOK")
		return Response.json(
			{},
			{
				status: 500,
				statusText: "Error getting the data from the SNCF API",
			}
		);

	const resultIda = getDeparturesArrivalsPairs(salidasSQY.tabla, llegadasDEFU.tabla).concat(
		getDeparturesArrivalsPairs(salidasVRD.tabla, llegadasDEFL.tabla)
	);
	const resultVuelta = getDeparturesArrivalsPairs(salidasDEFU.tabla, llegadasSQY.tabla).concat(
		getDeparturesArrivalsPairs(salidasDEFL.tabla, llegadasVRD.tabla)
	);
	return Response.json({
		date,
		ida: resultIda.sort(sortDepartureArrivalPair),
		vuelta: resultVuelta.sort(sortDepartureArrivalPair),
	});
}
