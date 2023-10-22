import { ESTACIONES } from "@/utils";

export interface Rutas {
	context: Context;
	disruptions: any[];
	exceptions: any[];
	feed_publishers: FeedPublisher[];
	links: RootObjectLink[];
	notes: any[];
	pagination: Pagination;
	route_schedules: RouteSchedule[];
}

export interface Context {
	current_datetime: string;
	timezone: Timezone;
}

export enum Timezone {
	EuropeParis = "Europe/Paris",
}

export interface FeedPublisher {
	id: string;
	license: string;
	name: string;
	url?: string;
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

export interface RouteSchedule {
	additional_informations: null;
	display_informations: DisplayInformations;
	geojson: Geojson;
	links: RouteScheduleLink[];
	table: Table;
}

export interface DisplayInformations {
	code: CodeEnum;
	color: Color;
	commercial_mode: CommercialMode;
	description?: string;
	direction: string;
	equipments: any[] | null;
	headsign?: string;
	label?: CodeEnum;
	links: any[];
	name: CodeEnum;
	network: CommercialMode;
	physical_mode?: PhysicalMode;
	text_color: TextColor;
	trip_short_name: null | string;
}

export enum CodeEnum {
	Empty = "",
	U = "U",
}

export enum Color {
	D60058 = "D60058",
	Empty = "",
}

export enum CommercialMode {
	Empty = "",
	Transilien = "TRANSILIEN",
}

export enum PhysicalMode {
	RERTransilien = "RER / Transilien",
	Rer = "RER",
	Transilien = "TRANSILIEN",
}

export enum TextColor {
	Empty = "",
	Ffffff = "FFFFFF",
}

export interface Geojson {
	coordinates: any[];
	type: string;
}

export interface RouteScheduleLink {
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

export interface Table {
	headers: Header[];
	rows: Row[];
}

export interface Header {
	additional_informations: AdditionalInformation[];
	display_informations: DisplayInformations;
	links: RouteScheduleLink[];
}

export enum AdditionalInformation {
	Regular = "regular",
}

export interface Row {
	date_times: DateTime[];
	stop_point: StopPoint;
}

export interface DateTime {
	additional_informations: any[];
	base_date_time?: string;
	data_freshness: DataFreshness | null;
	date_time: string;
	links: DateTimeLink[];
}

export enum DataFreshness {
	BaseSchedule = "base_schedule",
}

export interface DateTimeLink {
	id: string;
	rel: Rel;
	type: LinkType;
	value: string;
}

export enum Rel {
	VehicleJourneys = "vehicle_journeys",
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
	physical_modes: AlMode[];
	stop_area: StopArea;
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

export interface AlMode {
	id: ID;
	name: PhysicalMode;
}

export enum ID {
	CommercialModeTN = "commercial_mode:TN",
	CommercialModeTNRER = "commercial_mode:TNRER",
	PhysicalModeRapidTransit = "physical_mode:RapidTransit",
}

export interface StopArea {
	administrative_regions: AdministrativeRegion[];
	codes: CodeElement[];
	coord: Coord;
	id: string;
	label: string;
	links: any[];
	name: string;
	timezone: Timezone;
}

export interface CodeElement {
	type: CodeType;
	value: string;
}

export enum CodeType {
	Source = "source",
	Uic = "uic",
}

export interface HorariosType {
	lineaL: LineaL;
	lineaU: LineaU;
	status: string;
}

export interface LineaL {
	lineaLIda: LineaType[];
	lineaLVuelta: LineaType[];
}
export interface LineaU {
	lineaUIda: LineaType[];
	lineaUVuelta: LineaType[];
}

export interface LineaType {
	direction: string;
	headsign: HeadsignType;
	timeDEF: string;
	timeACA: string;
}

export type HeadsignType = keyof typeof ESTACIONES;

export type Sentido = "ida" | "vuelta";
