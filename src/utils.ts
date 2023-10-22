import { DeparturesArrivalsPairType, DeparturesArrivalsType, TablaType } from "./departuresTypes";
import { LineaType, Rutas, Sentido } from "./types";

export const StopPointSQY = "stop_point:SNCF:87393843:RapidTransit";
export const StopPointDEF = "stop_point:SNCF:87382218:RapidTransit";
export const StopPointVRD = "stop_point:SNCF:87382861:RapidTransit";

type EstacionesIDType =
	| "stop_point:SNCF:87393843:RapidTransit"
	| "stop_point:SNCF:87382218:RapidTransit"
	| "stop_point:SNCF:87382861:RapidTransit";

export function getStationName(id: string, isWide: boolean) {
	const ESTACIONES = {
		"stop_point:SNCF:87393843:RapidTransit": {
			long: "Saint-Quentin en Yvelines",
			short: "SQY",
		},
		"stop_point:SNCF:87382218:RapidTransit": {
			long: "La Défense",
			short: "La Défense",
		},
		"stop_point:SNCF:87382861:RapidTransit": {
			long: "Versailles Rive Droite	",
			short: "Versailles",
		},
	};

	return ESTACIONES[id as EstacionesIDType][isWide ? "long" : "short"];
}

export const LINECOLORS = { L: "#7584BC", U: "#D60058" };

export async function getTrainTimesLineaU(date: string = getCurrentISODateTime()) {
	const linea = "SNCF:U";
	try {
		const response = await fetch(
			`https://api.sncf.com/v1/coverage/sncf/lines/line:${linea}/route_schedules?data_freshness=realtime&from_datetime=${date}`,
			{
				method: "GET",
				headers: {
					Authorization: process.env.SNCF_API_AUTH!,
				},
				cache: "no-store",
			}
		);

		if (response.ok) {
			const result: Rutas = await response.json();
			const tabla = result.route_schedules[0].table.headers.map((route, index) => {
				const direction = route.display_informations.direction;
				const headsign = route.display_informations.headsign;

				const [timeDEF] = result.route_schedules[0].table.rows
					.filter((row) => row.stop_point.id === StopPointDEF)
					.map((row) => row.date_times[index].date_time);
				const [timeSQYAller, timeSQYRetour] = result.route_schedules[0].table.rows
					.filter((row) => row.stop_point.id === StopPointSQY)
					.map((row) => row.date_times[index].date_time);

				return {
					headsign,
					direction,
					timeDEF,
					timeSQYAller,
					timeSQYRetour,
				};
			});
			const lineaUIda = tabla
				.filter((time) => time.headsign === "DEFI")
				.map((time) => {
					return {
						timeDEF: time.timeDEF,
						timeACA: time.timeSQYAller,
						direction: time.direction,
						headsign: time.headsign,
					};
				});
			const lineaUVuelta = tabla
				.filter((time) => time.headsign === "VERI")
				.map((time) => {
					return {
						timeDEF: time.timeDEF,
						timeACA: time.timeSQYRetour,
						direction: time.direction,
						headsign: time.headsign,
					};
				});
			return { status: "OK", lineaU: { lineaUIda, lineaUVuelta } };
		} else return { status: "NOK" };
	} catch (err) {
		console.error(err);
		return { status: "NOK" };
	}
}

export async function getTrainTimesLineaL(date: string = getCurrentISODateTime()) {
	try {
		const response = await fetch(
			`https://api.sncf.com/v1/coverage/sncf/stop_points/stop_point:SNCF:87382861:RapidTransit/lines/line:SNCF:L/route_schedules?data_freshness=realtime&from_datetime=${date}`,
			{
				method: "GET",
				headers: {
					Authorization: process.env.SNCF_API_AUTH!,
				},
				cache: "no-store",
			}
		);

		if (response.ok) {
			const result: Rutas = await response.json();
			const tabla = result.route_schedules[0].table.headers.map((route, index) => {
				const direction = route.display_informations.direction;
				const headsign = route.display_informations.headsign;

				const [timeDEFRetour, timeDEFAller] = result.route_schedules[0].table.rows
					.filter((row) => row.stop_point.id === StopPointDEF)
					.map((row) => row.date_times[index].date_time);
				const [timeVRDAller, timeVRDRetour] = result.route_schedules[0].table.rows
					.filter((row) => row.stop_point.id === StopPointVRD)
					.map((row) => row.date_times[index].date_time);

				return {
					headsign,
					direction,
					timeDEFAller,
					timeDEFRetour,
					timeVRDAller,
					timeVRDRetour,
				};
			});
			const lineaLIda = tabla
				.filter((time) => time.headsign === "PASA")
				.map((time) => {
					return {
						timeDEF: time.timeDEFAller,
						timeACA: time.timeVRDAller,
						direction: time.direction,
						headsign: time.headsign,
					};
				});
			const lineaLVuelta = tabla
				.filter((time) => time.headsign === "VASA")
				.map((time) => {
					return {
						timeDEF: time.timeDEFRetour,
						timeACA: time.timeVRDRetour,
						direction: time.direction,
						headsign: time.headsign,
					};
				});
			return { status: "OK", lineaL: { lineaLIda, lineaLVuelta } };
		} else return { status: "NOK" };
	} catch (err) {
		console.error(err);
		return { status: "NOK" };
	}
}

export function getCurrentISODateTime() {
	return new Date().toISOString().replaceAll("-", "").split("T")[0] + "T000000";
}

export function date2ISO(date: Date) {
	return (
		date.getFullYear().toString() +
		(date.getMonth() + 1).toString().padStart(2, "0") +
		date.getDate().toString().padStart(2, "0") +
		"T000000"
	);
}

export function ISO2date(ISOdate: string) {
	// Extract date and time components
	var year = Number(ISOdate.substring(0, 4));
	var month = Number(ISOdate.substring(4, 6));
	var day = Number(ISOdate.substring(6, 8));
	var hour = Number(ISOdate.substring(9, 11));
	var minute = Number(ISOdate.substring(11, 13));
	var second = Number(ISOdate.substring(13, 15));

	// Create a new Date object
	var date = new Date(year, month - 1, day, hour, minute, second);

	// Convert to timestamp and return
	return date;
}

export function sortTrains(a: LineaType, b: LineaType, sentido: Sentido) {
	if (sentido === "ida") {
		return ISO2date(a.timeACA).getTime() - ISO2date(b.timeACA).getTime();
	}
	return ISO2date(a.timeDEF).getTime() - ISO2date(b.timeDEF).getTime();
}

export async function getDeparturesArrivals(
	date: string = getCurrentISODateTime(),
	line: string,
	estacion: string,
	type: "departures" | "arrivals"
) {
	try {
		const response = await fetch(
			`https://api.sncf.com/v1/coverage/sncf/stop_points/${estacion}/lines/line:SNCF:${line}/${type}?data_freshness=realtime&from_datetime=${date}&count=100`,
			{
				method: "GET",
				headers: {
					Authorization: process.env.SNCF_API_AUTH!,
				},
				cache: "no-store",
			}
		);

		if (response.ok) {
			const result: DeparturesArrivalsType = await response.json();
			const tabla = result[type]?.map((departure) => {
				const headsign = departure.display_informations.headsign;
				const direction = departure.display_informations.direction;
				const line = departure.route.line.name;
				const lineColor = departure.route.line.color;
				const estacionID = departure.stop_point.id;
				const estacionName = departure.stop_point.name;
				const hora = departure.stop_date_time.departure_date_time;
				const journey = departure.links.find((link) => link.type === "vehicle_journey")?.id;
				return {
					headsign,
					direction,
					line,
					lineColor,
					estacionID,
					estacionName,
					hora,
					journey,
				};
			});
			if (tabla && tabla.length > 0) return { status: "OK", tabla };
			return { status: "NOK", tabla: [] };
		}
		return { status: "NOK", tabla: [] };
	} catch (err) {
		console.error(err);
		return { status: "NOK", tabla: [] };
	}
}

export function sortDepartureArrivalPair(
	a: DeparturesArrivalsPairType,
	b: DeparturesArrivalsPairType
) {
	return ISO2date(a.departure.hora).getTime() - ISO2date(b.departure.hora).getTime();
}

export function getDeparturesArrivalsPairs(departures: TablaType[], arrivals: TablaType[]) {
	const pairs = departures.reduce((result: DeparturesArrivalsPairType[], departure) => {
		const arrival = arrivals.find((arr) => arr.journey === departure.journey);
		if (arrival) {
			result.push({ departure, arrival });
		}
		return result;
	}, []);
	return pairs;
}
