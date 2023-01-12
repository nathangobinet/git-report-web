import React, { createContext, useCallback, useEffect, useState } from 'react';
import Papa, { ParseLocalConfig, ParseRemoteConfig, ParseWorkerConfig } from 'papaparse';
import { useNavigate } from 'react-router-dom';
import { Commit } from '../../types/Commit';
import { ProjectMap } from '../../types/ReportData';
import Dropzone, { useDropzone } from 'react-dropzone';
import { RemoteParser } from '../Parsers/RemoteParser';
import { LocalParser } from '../Parsers/LocalParser';

type EventId = string | undefined;

interface DataContextSpecs {
	eventId: EventId,
	projects: ProjectMap,
	isError: boolean,
}

export const DataContext = createContext<DataContextSpecs>({
	eventId: undefined,
	projects: new Map(),
	isError: false,
});

const parseCommit = (e: any): Commit => ({
	id: e[1],
	username: e[2],
	email: e[3],
	date: new Date(e[4]),
	description: e[5]
})

const mapData = (data: any[]): ProjectMap => {
	const projects: ProjectMap = new Map();

	data.forEach(e => {
		const projectName = e[0];
		if (!projects.has(projectName)) {
			projects.set(projectName, {
				name: projectName,
				commits: "",
				options: {
					shown: true,
				}
			})
		}

		projects.get(projectName)!.commits += "\n" + parseCommit(e).description;

		// TODO: Remove this line when commits will be handled as objects
		projects.get(projectName)!.commits = projects.get(projectName)!.commits.trim();
	})


	// projects.set("Test", {
	// 	commits: "qsdq\n",
	// 	name: "Salut",
	// 	options: {
	// 		shown: true,
	// 	}
	// })
	// projects.set("SQSD", {
	// 	commits: "",
	// 	name: "Salqdsut",
	// 	options: {
	// 		shown: true,
	// 	}
	// })
	// projects.set("SQSssD", {
	// 	commits: "",
	// 	name: "Salqdqqqsut",
	// 	options: {
	// 		shown: true,
	// 	}
	// })
	// projects.set("ssssSQSD", {
	// 	commits: "",
	// 	name: "Salqqsdqdqsdsdsqdsdsut",
	// 	options: {
	// 		shown: true,
	// 	}
	// })

	return projects;
}

export function DataContextProvider({ children }: { children: React.ReactNode }): JSX.Element {
	const navigate = useNavigate();

	const [eventId, setEventId] = useState<EventId>(undefined);
	const [projects, setProjects] = useState<ProjectMap>(new Map());
	const [isError, setIsError] = useState(false);

	const onCsvReceived = (results: any) => {
		setProjects(mapData(results.data));
		return navigate("/report");
	}

	useEffect(() => {
		const sse = new EventSource("/api/see");

		sse.addEventListener("init", (event) => {
			setEventId(event.lastEventId);
		})

		sse.addEventListener('commits-ready', (event) => {
			const id = event.lastEventId;
			const url = `/api/get-commits/${id}`;
			RemoteParser.parse(url, onCsvReceived)
		});

		sse.onerror = (e) => {
			setIsError(true);
			sse.close();
		}

		return () => {
			sse.close();
		};
	}, [navigate]);

	const contextValue = {
		eventId,
		projects,
		isError,
	};

	return (
		<DataContext.Provider value={contextValue}>
			<Dropzone
				noClick={true}
				onDrop={files => {
					const reader = new FileReader()

					reader.onabort = () => console.log('file reading was aborted')
					reader.onerror = () => console.log('file reading has failed')
					reader.onload = () => LocalParser.parse(reader.result as string, onCsvReceived)
					reader.readAsText(files[0])
				}}
				onDragEnter={() => {
					console.log("enter")
				}}
				onDragLeave={() => {
					console.log("enter")
				}}
				multiple={false}
			>
				{({ getRootProps, getInputProps }) => (
					<div {...getRootProps()}>
						<input {...getInputProps()} hidden />
						{children}
					</div>
				)}
			</Dropzone>
		</DataContext.Provider >
	);
}