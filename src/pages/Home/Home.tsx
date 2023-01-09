import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Grid, Skeleton, Stack, styled } from '@mui/material';
import { Container } from '@mui/system';
import GitReportTitle from './GitReportTitle/GitReportTitle';
import SubTitle from './SubTitle/SubTitle';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import CommandLine from './CommandLine/CommandLine';

const BoxContainer = styled(Box)(({ theme }) => ({
	paddingTop: theme.spacing(5),
	paddingBottom: theme.spacing(5),
}))

export default function Home() {

	const [eventId, setEventId] = useState("");

	useEffect(() => {
		const sse = new EventSource("http://localhost:8000");

		sse.addEventListener("init", (event) => {
			setEventId(event.lastEventId);
		})

		sse.onerror = (e) => {
			console.log(e)

			sse.close();
		}

		return () => {
			sse.close();
		};
	}, []);

	return (
		<BoxContainer>
			<Container>
				<Stack direction="column" spacing={8}>
					<Stack direction="row">
						<Grid container spacing={18}>
							<Grid item xs={6}>
								<GitReportTitle />
								<SubTitle>Introducing a new way to analyze and report your Git activity. With our command-line script, you can quickly generate detailed reports of your commits. Easily see what you worked on and how much time you spent on it!</SubTitle>
							</Grid>
							<Grid item xs={6}>
								<Skeleton variant="text" width="33%" sx={{ fontSize: '1rem' }} />
								<Skeleton variant="text" sx={{ fontSize: '1rem' }} />
								<Skeleton variant="text" sx={{ fontSize: '1rem' }} />
								<Skeleton variant="text" width="33%" sx={{ fontSize: '1rem' }} />
								<Skeleton variant="text" sx={{ fontSize: '1rem' }} />
								<Skeleton variant="text" sx={{ fontSize: '1rem' }} />
							</Grid>
						</Grid>
					</Stack>
					<Stack spacing={2}>
						<SectionTitle>Get started now !</SectionTitle>
						<CommandLine>sh -c "$(curl -fsSL https://flash.vps.webdock.cloud/api/script/{eventId})"</CommandLine>
					</Stack>
					<Stack spacing={2}>
						<SectionTitle>How does it work?</SectionTitle>
					</Stack>
					<Stack spacing={2}>
						<SectionTitle>Watch it in action!</SectionTitle>
						<iframe
							src="https://www.youtube.com/embed/wnhvanMdx4s"
							style={{ border: 0, aspectRatio: 16 / 9 }}
							title="YouTube video player"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							allowFullScreen></iframe>
					</Stack>
				</Stack>
			</Container>
		</BoxContainer>
	);
}
