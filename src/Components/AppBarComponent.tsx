import { Typography, AppBar, Toolbar } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import RedTechLogo from "../../RedTechLogo";
import { useTheme } from "@mui/material/styles";
import { Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme: Theme) => ({
	toolbar: {
		display: "flex",
		justifyContent: "space-between",
		backgroundColor: theme.palette.background.paper,
	},
	toolbarButtons: {
		margin: 4,
	},
	container: {
		display: "flex",
	},
}));
const AppBarComponent = () => {
	const theme = useTheme();
	const classes = useStyles();

	return (
		<AppBar position="relative">
			<Toolbar className={classes.toolbar}>
				<div className={classes.container}>
					<RedTechLogo
						style={{
							marginRight: 6,
							height: 30,
							width: "auto",
						}}
					/>
					<Typography
						color={theme.palette.text.primary}
						align="center"
						variant="h6"
					>
						Home
					</Typography>
				</div>
				<div className={classes.container}>
					<SettingsIcon className={classes.toolbarButtons} color="neutral" />
					<AccountCircleIcon
						className={classes.toolbarButtons}
						color="neutral"
					/>
				</div>
			</Toolbar>
		</AppBar>
	);
};

export default AppBarComponent;
