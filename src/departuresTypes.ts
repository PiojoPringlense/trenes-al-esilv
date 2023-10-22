export type DeparturesArrivalsType =
	| {
			context: Context;
			departures: Departure[];
			arrivals?: never;
			disruptions: any[];
			exceptions: any[];
			feed_publishers: FeedPublisher[];
			links: RootObjectLink[];
			notes: any[];
			pagination: Pagination;
	  }
	| {
			context: Context;
			arrivals: Departure[];
			departures?: never;
			disruptions: any[];
			exceptions: any[];
			feed_publishers: FeedPublisher[];
			links: RootObjectLink[];
			notes: any[];
			pagination: Pagination;
	  };

export interface Context {
	current_datetime: string;
	timezone: string;
}

export interface Departure {
	display_informations: DisplayInformations;
	links: DepartureLink[];
	route: Route;
	stop_date_time: StopDateTime;
	stop_point: StopPoint;
}

export interface DisplayInformations {
	code: string;
	color: string;
	commercial_mode: string;
	description: string;
	direction: string;
	equipments: any[];
	headsign: string;
	label: string;
	links: any[];
	name: string;
	network: string;
	physical_mode: string;
	text_color: string;
	trip_short_name: string;
}

export interface DepartureLink {
	id: string;
	type: LinkType;
}

export enum LinkType {
	CommercialMode = "commercial_mode",
	Line = "line",
	Network = "network",
	PhysicalMode = "physical_mode",
	Route = "route",
	VehicleJourney = "vehicle_journey",
}

export interface Route {
	direction: DirectionClass;
	direction_type: string;
	geojson: Geojson;
	id: string;
	is_frequence: string;
	line: Line;
	links: any[];
	name: string;
	physical_modes: AlMode[];
}

export interface DirectionClass {
	embedded_type: string;
	id: string;
	name: string;
	quality: number;
	stop_area: StopArea;
}

export interface StopArea {
	administrative_regions?: AdministrativeRegion[];
	codes: CodeElement[];
	coord: Coord;
	id: string;
	label: string;
	links: any[];
	name: string;
	timezone: string;
}

export interface AdministrativeRegion {
	coord: Coord;
	id: string;
	insee: string;
	label: string;
	level: number;
	name: string;
	zip_code: string;
}

export interface Coord {
	lat: string;
	lon: string;
}

export interface CodeElement {
	type: string;
	value: string;
}

export interface Geojson {
	coordinates: any[];
	type: string;
}

export interface Line {
	closing_time: string;
	code: string;
	codes: any[];
	color: string;
	commercial_mode: AlMode;
	geojson: Geojson;
	id: string;
	links: any[];
	name: string;
	opening_time: string;
	physical_modes: AlMode[];
	text_color: string;
}

export interface AlMode {
	id: string;
	name: string;
}

export interface StopDateTime {
	additional_informations: any[];
	arrival_date_time: string;
	base_arrival_date_time: string;
	base_departure_date_time: string;
	data_freshness: string;
	departure_date_time: string;
	links: any[];
}

export interface StopPoint {
	administrative_regions: AdministrativeRegion[];
	commercial_modes: AlMode[];
	coord: Coord;
	equipments: any[];
	id: string;
	label: string;
	links: any[];
	name: string;
	physical_modes: PhysicalMode[];
	stop_area: StopArea;
}

export interface PhysicalMode {
	co2_emission_rate: Co2EmissionRate;
	id: string;
	name: string;
}

export interface Co2EmissionRate {
	unit: string;
	value: number;
}

export interface FeedPublisher {
	id: string;
	license: string;
	name: string;
	url: string;
}

export interface RootObjectLink {
	href: string;
	rel?: string;
	templated: boolean;
	type: string;
}

export interface Pagination {
	items_on_page: number;
	items_per_page: number;
	start_page: number;
	total_result: number;
}

export type TablaType = {
	headsign: string;
	direction: string;
	line: string;
	lineColor: string;
	estacionID: string;
	estacionName: string;
	hora: string;
	journey: string | undefined;
};

export type DeparturesArrivalsPairType = {
	departure: TablaType;
	arrival: TablaType;
};

export type DeparturesArrivalsAPIType = {
	date: string;
	ida: DeparturesArrivalsPairType[];
	vuelta: DeparturesArrivalsPairType[];
};

export type StatusType = "idle" | "resolved" | "rejected";
