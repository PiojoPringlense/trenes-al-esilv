"use client";
import { Sentido } from "@/types";
import { useState, useEffect } from "react";
import Horarios from "./Horarios";
import { date2ISO } from "@/utils";
import { DeparturesArrivalsAPIType, StatusType } from "@/departuresTypes";
import Loading from "./Loading";

type Props = {};

export default function Trains({}: Props) {
	const [date, setDate] = useState(new Date());
	const [sentido, setSentido] = useState<Sentido>("ida");
	const [horarios, setHorarios] = useState<DeparturesArrivalsAPIType>();
	const [status, setStatus] = useState<StatusType>("idle");

	useEffect(() => {
		async function getHorarios(date: Date) {
			setStatus("idle");
			const options = { method: "GET" };

			try {
				const response = await fetch(
					`http://localhost:3000/api/departures?date=${date2ISO(date)}`,
					options
				);
				if (response.ok) {
					const tabla = await response.json();
					setHorarios(tabla);
					setStatus("resolved");
				} else {
					setHorarios(undefined);
					setStatus("rejected");
				}
			} catch (error) {
				console.log(error);
				setHorarios(undefined);
				setStatus("rejected");
			}
		}
		getHorarios(date);
	}, [date]);

	return (
		<>
			<div className="flex gap-4 flex-col items-center">
				<div className="flex gap-8 items-center">
					<button
						className="border py-2 px-4 rounded"
						onClick={() =>
							setDate((date) => {
								const newDate = new Date(date.getTime());
								newDate.setDate(newDate.getDate() - 1);
								return newDate;
							})
						}>
						&larr; Prev
					</button>
					<span>{date.toDateString()}</span>
					<button
						className="border py-2 px-4 rounded"
						onClick={() =>
							setDate((date) => {
								const newDate = new Date(date.getTime());
								newDate.setDate(newDate.getDate() + 1);
								return newDate;
							})
						}>
						Next &rarr;
					</button>
				</div>
				<div className="flex gap-8 items-center">
					<label htmlFor="ida" className="flex gap-1 items-center">
						<input
							type="radio"
							id="ida"
							name="sentido"
							value="ida"
							checked={sentido === "ida"}
							onChange={() => setSentido("ida")}
						/>
						Outward
					</label>
					<label htmlFor="vuelta" className="flex gap-1 items-center">
						<input
							type="radio"
							id="vuelta"
							name="sentido"
							value="vuelta"
							checked={sentido === "vuelta"}
							onChange={() => setSentido("vuelta")}
						/>
						Return
					</label>
				</div>
			</div>
			{status === "resolved" &&
				horarios &&
				(sentido === "ida" ? (
					<Horarios horarios={horarios.ida} />
				) : (
					<Horarios horarios={horarios.vuelta} />
				))}
			{status === "idle" && <Loading />}
			{status === "rejected" && "Error getting data. Please try again later."}
		</>
	);
}