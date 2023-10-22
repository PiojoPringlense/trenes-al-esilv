import { DeparturesArrivalsPairType } from "@/departuresTypes";
import { ISO2date, getStationName } from "@/utils";
import { useEffect, useState } from "react";
import LineIcon from "./LineIcon";

type Props = { horarios: DeparturesArrivalsPairType[] };

export default function Horarios({ horarios }: Props) {
	const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 600);
	const isEmpty = horarios.length === 0;

	useEffect(() => {
		function handleResize() {
			setIsWideScreen(window.innerWidth > 600);
		}

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	if (isEmpty)
		return <div className="mt-5 bg-[#D60058] p-4 rounded">No suitable trains at this date</div>;

	return (
		<table className="border-collapse border border-gray-400 m-6">
			<thead>
				<tr>
					<th className="border border-gray-400 px-4"></th>
					{isWideScreen && <th className="border border-gray-400 px-4"></th>}
					<th className="border border-gray-400 px-4" colSpan={2}>
						From
					</th>
					<th className="border border-gray-400 px-4" colSpan={2}>
						To
					</th>
				</tr>
				<tr>
					<th className="border border-gray-400 px-4">Train</th>
					{isWideScreen && <th className="border border-gray-400 px-4">Destination</th>}
					<th className="border border-gray-400 px-4">Station</th>
					<th className="border border-gray-400 px-4">Time</th>
					<th className="border border-gray-400 px-4">Station</th>
					<th className="border border-gray-400 px-4">Time</th>
				</tr>
			</thead>
			<tbody>
				{horarios.map((tren, i) => (
					<tr key={i}>
						<td className="border border-gray-400 px-4 flex items-center gap-2">
							<LineIcon line={tren.departure.line} color={tren.departure.lineColor} />
							{tren.departure.headsign}
						</td>
						{isWideScreen && (
							<td className="border border-gray-400 px-4">{tren.departure.direction}</td>
						)}
						<td className="border border-gray-400 px-4">
							{getStationName(tren.departure.estacionID, isWideScreen)}
						</td>
						<td className="border border-gray-400 px-4">
							{ISO2date(tren.departure.hora).toLocaleTimeString("FR-FR", {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</td>
						<td className="border border-gray-400 px-4">
							{getStationName(tren.arrival.estacionID, isWideScreen)}
						</td>
						<td className="border border-gray-400 px-4">
							{ISO2date(tren.arrival.hora).toLocaleTimeString("FR-FR", {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
