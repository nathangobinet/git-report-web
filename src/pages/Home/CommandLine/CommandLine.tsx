import { CircularProgress, Paper, styled, Tooltip, Typography } from "@mui/material"
import { useContext, useState } from "react"
import { DataContext } from "../../../contexts/DataContext/DataContext"
import ThatsYou from "../../../assets/ThatsYou.svg";

const BlackPaper = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.common.black,
	borderRadius: 2,
	padding: theme.spacing(2),
	cursor: "pointer",
	"&::before": {
		content: '"$"',
		marginRight: theme.spacing(2),
		marginLeft: theme.spacing(1),
		color: "#00C2FF"
	},
	"&::after": {
		content: `url(${ThatsYou})`,
		fontFamily: "Caveat",
		fontSize: "1.5em",
		transform: "rotate(-3.47deg)",
		marginTop: "1em",
		marginLeft: "-7em",
		position: "absolute",
	}
}))

export default function CommandLine() {
	const { eventId, isError } = useContext(DataContext);

	const [isCopied, setIsCopied] = useState(false);

	const copy = () => {
		if (eventId) {
			navigator.clipboard.writeText(`sh -c "$(curl -fsSL https://flash.vps.webdock.cloud/api/script/${eventId})`);
			setIsCopied(true);
		}
	}

	return eventId ? (
		<Tooltip title={isCopied ? "Copied" : "Click to copy"} onClose={() => setIsCopied(false)} placement="top">
			<BlackPaper onClick={copy}>
				<span>sh -c "$(curl -fsSL https://flash.vps.webdock.cloud/api/script/<span style={{ color: "#9AE7FF" }}>{eventId}</span>)"</span>
			</BlackPaper>
		</Tooltip>
	) : (
		<LoadingOrError isError={isError} />
	)
}

const LoadingOrError = (props: {
	isError: boolean,
}) => {
	return props.isError ? (
		<Typography style={{
			alignSelf: "center",
		}}>Could not establish connection to the server.</Typography>
	) : (
		<CircularProgress style={{
			alignSelf: "center"
		}}
		/>
	)
}