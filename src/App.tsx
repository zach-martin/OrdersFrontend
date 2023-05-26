import React from "react";
import { useState, useEffect } from "react";
import {
	Typography,
	AppBar,
	Toolbar,
	Grid,
	Container,
	Button,
	CssBaseline,
	Select,
	FormControl,
	InputLabel,
	MenuItem,
	ListItemText,
	OutlinedInput,
	useMediaQuery,
	SvgIconTypeMap,
	SvgIconProps,
	Box,
	Dialog,
	DialogTitle,
	Input,
	FormLabel,
	TextField,
	DialogActions,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { createTheme, Theme, ThemeProvider } from "@mui/material";
import { makeStyles } from "@mui/styles";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { SvgIcon } from "@mui/material";
import { border, borderRadius, margin, padding } from "@mui/system";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import DeleteIcon from "@mui/icons-material/Delete";
import Checkbox from "@mui/material/Checkbox/Checkbox";
import AddIcon from "@mui/icons-material/Add";
import { grey } from "@mui/material/colors";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import ClickAwayListener from "@mui/material/ClickAwayListener";

declare module "@mui/material/styles" {
	interface Palette {
		neutral: Palette["primary"];
	}
	interface PaletteOptions {
		neutral: PaletteOptions["primary"];
	}
}
const theme = createTheme({
	palette: {
		background: {
			paper: "#fff",
		},
		text: {
			primary: "#000",
		},
		neutral: {
			main: "#000",
		},
	},
});

const Search = styled("div")(({ theme }) => ({
	backgroundColor: alpha(theme.palette.common.white, 0.15),

	position: "relative",
	border: "1px solid",
	borderColor: grey[400],
	borderTopLeftRadius: theme.shape.borderRadius,
	borderBottomLeftRadius: theme.shape.borderRadius,
	height: "36px",

	[theme.breakpoints.up("md")]: {
		marginLeft: theme.spacing(2),
	},
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: "inherit",
	"& .MuiInputBase-input": {
		paddingLeft: `calc(0.5em + ${theme.spacing(1)})`,
	},
}));

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
	mainContainer: {
		display: "flex",
		marginTop: 12,
		marginBottom: 12,
		gap: 24,
	},
}));

enum OrderType {
	Standard = "Standard",
	SaleOrder = "SaleOrder",
	PurchaseOrder = "PurchaseOrder",
	TransferOrder = "TransferOrder",
	ReturnOrder = "ReturnOrder",
}

type FriendlyFilter<T> = {
	label: string;
	value: T;
};

const orderTypes: FriendlyFilter<OrderType>[] = Object.values(OrderType).map(
	(t) => ({
		label: t.replace(/([A-Z])/g, " $1").trim(), // separate capital letters
		value: t,
	})
);

const columns: GridColDef[] = [
	{
		field: "id",
		headerName: "Order ID",
		width: 200,
		headerClassName: "column-theme",
		cellClassName: "column-theme",
		disableColumnMenu: true,
	},
	{
		field: "createdDate",
		headerName: "Creation Date",
		width: 300,
		headerClassName: "column-theme",
		cellClassName: "column-theme",
		disableColumnMenu: true,
	},
	{
		field: "createdByUsername",
		headerName: "Created By",
		width: 200,
		headerClassName: "column-theme",
		cellClassName: "column-theme",
		disableColumnMenu: true,
	},
	{
		field: "orderType",
		headerName: "Order Type",
		width: 200,
		headerClassName: "column-theme",
		cellClassName: "column-theme",
		disableColumnMenu: true,
	},
	{
		field: "customerName",
		headerName: "Customer",
		width: 200,
		headerClassName: "column-theme",
		cellClassName: "column-theme",
		disableColumnMenu: true,
	},
];

type OrderForm = {
	createdByUsername: string;
	orderType: OrderType;
	customerName: string;
};

interface Orders {
	id: number;
	createdDate: string;
	createdByUsername: string;
	orderType: OrderType;
	customerName: string;
}

interface OrderFilters {
	customerName: string;
	orderTypes: OrderType[];
}

const App = () => {
	const classes = useStyles();
	const [refreshState, setRefreshState] = useState<Boolean>(false);
	const [ordersDisplayed, setOrdersDisplayed] = useState<Orders[]>([]);

	const [orderFilters, setOrderFilters] = useState<OrderFilters>({
		customerName: "",
		orderTypes: [],
	});

	const [createOrder, setCreateOrder] = useState<OrderForm>({
		createdByUsername: "",
		orderType: OrderType.Standard,
		customerName: "",
	});

	const [rowSelectionModel, setRowSelectionModel] =
		React.useState<GridRowSelectionModel>([]);

	const handleChange = (event: SelectChangeEvent<OrderType[]>) => {
		setOrderFilters((prevState) => ({
			...prevState,
			orderTypes: event.target.value as OrderType[],
		}));
	};

	const [openCreate, setOpenCreate] = useState(false);

	const handleOpenCreate = () => {
		setOpenCreate(true);
	};

	const handleCloseCreate = () => {
		setOpenCreate(false);
		setCreateOrder({
			createdByUsername: "",
			orderType: OrderType.Standard,
			customerName: "",
		});
	};

	const handleSubmitCreate = () => {
		setOpenCreate(false);

		const newOrder = async () => {
			try {
				const response = await fetch("https://localhost:7066/create-order", {
					method: "post",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(createOrder),
				});

				if (response.ok) {
					return response;
				}
			} catch (e) {
				console.log(e);
			}
		};
		newOrder();
		setRefreshState(true);
		setCreateOrder({
			createdByUsername: "",
			orderType: OrderType.Standard,
			customerName: "",
		});
	};

	const handleDeleteOrders = () => {
		const deleteOrders = async () => {
			try {
				const response = await fetch("https://localhost:7066/delete-orders", {
					method: "delete",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(rowSelectionModel),
				});

				if (response.ok) {
					return response;
				}
			} catch (e) {
				console.log(e);
			}
		};
		deleteOrders();
		setRefreshState(true);
	};

	const handleFilters = () => {
		const filterOrders = async () => {
			try {
				console.log(orderFilters);
				const response = await fetch("https://localhost:7066/search-order", {
					method: "post",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(orderFilters),
				});

				if (response.ok) {
					const data = await response.json();
					setOrdersDisplayed(data as Orders[]);
				}
			} catch (e) {
				console.log(e);
			}
		};
		filterOrders();
	};

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				/*const { data, status } = await axios.get<Orders>(
					"https://localhost:7066/read-order/11",
					{
						headers: {
							Accept: "application/json",
						},
					}
				);
				console.log(data);
				if (status == 200) {
					setOrdersDisplayed([data]);
				}

				Doing fetching with axios
				*/
				const orders = await fetch("https://localhost:7066/read-orders");
				if (orders.ok) {
					const data = await orders.json();
					setOrdersDisplayed(data as Orders[]);
				}
			} catch (e) {
				console.log(e);
			}
		};

		fetchOrders();

		return () => {
			setRefreshState(false);
		};
	}, [refreshState]);

	return (
		<>
			<CssBaseline>
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
						<div>
							<SettingsIcon
								className={classes.toolbarButtons}
								color="neutral"
							/>
							<AccountCircleIcon
								className={classes.toolbarButtons}
								color="neutral"
							/>
						</div>
					</Toolbar>
				</AppBar>
				<main className={classes.mainContainer}>
					<Grid
						container
						spacing={{ xs: 1, md: 4 }}
						alignItems="center"
						justifyItems="center"
						justifyContent="flex-start"
					>
						<Grid
							item
							xs={12}
							md="auto"
							container
							sx={(theme) => ({
								alignItems: "center",
								justifyItems: "center",
								justifyContent: "space-between",
							})}
						>
							<Grid
								item
								md="auto"
								sx={{
									flexGrow: 1,
								}}
							>
								<Search>
									<StyledInputBase
										value={orderFilters.customerName || ""}
										onChange={(e) => {
											setOrderFilters((prevState) => ({
												...prevState,
												customerName: e.target.value,
											}));
										}}
										fullWidth
										placeholder="Customer Search…"
										inputProps={{ "aria-label": "search" }}
									/>
								</Search>
							</Grid>

							{/*!useMediaQuery(theme.breakpoints.down("md")) ? (
								<Grid item xs={2} sm="auto">
									<Search>
										<StyledInputBase
											placeholder="Customer Search…"
											inputProps={{ "aria-label": "search" }}
										/>
									</Search>
								</Grid>
							) : (
								""
							)*/}

							<Grid item md="auto" xs="auto">
								<Button
									onClick={handleFilters}
									variant="contained"
									color="primary"
									sx={{
										borderTopLeftRadius: 0,
										borderBottomLeftRadius: 0,
									}}
								>
									<SearchIcon />
								</Button>
							</Grid>
						</Grid>
						<Grid item xs={12} md="auto">
							<Button
								variant="contained"
								color="primary"
								sx={{
									[theme.breakpoints.down("lg")]: {
										//allows for the use of theme wihtout importing it
										width: "100%",
									},
								}}
								onClick={handleOpenCreate}
							>
								<AddIcon />
								CREATE ORDER
							</Button>
							<Dialog open={openCreate} onClose={handleCloseCreate}>
								<DialogTitle>Create Order</DialogTitle>
								<Box
									component="form"
									sx={{
										"& .MuiTextField-root": { m: 1, width: "25ch" },
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										minWidth: 300,
									}}
									noValidate
									autoComplete="off"
								>
									<TextField
										label="Name"
										required
										onChange={(e) => {
											setCreateOrder((prevState) => ({
												...prevState,
												createdByUsername: e.target.value,
											}));
										}}
										value={createOrder.createdByUsername}
									/>
									<TextField
										select
										label="Order Type"
										defaultValue="Standard"
										value={createOrder.orderType}
										onChange={(e) => {
											setCreateOrder((prevState) => ({
												...prevState,
												orderType: e.target.value as OrderType,
											}));
										}}
									>
										{orderTypes.map((type) => (
											<MenuItem key={type.value} value={type.value}>
												<ListItemText primary={type.label} />
											</MenuItem>
										))}
									</TextField>
									<TextField
										label="Customer"
										required
										onChange={(e) => {
											setCreateOrder((prevState) => ({
												...prevState,
												customerName: e.target.value,
											}));
										}}
										value={createOrder.customerName}
									/>
								</Box>
								<DialogActions>
									<Button variant="outlined" onClick={handleCloseCreate}>
										Cancel
									</Button>
									<Button variant="contained" onClick={handleSubmitCreate}>
										Submit
									</Button>
								</DialogActions>
							</Dialog>
						</Grid>

						<Grid item xs={12} md="auto">
							<Button
								variant="contained"
								color="primary"
								onClick={handleDeleteOrders}
								sx={{
									[theme.breakpoints.down("lg")]: {
										//allows for the use of theme wihtout importing it
										width: "100%",
									},
								}}
							>
								<DeleteIcon />
								DELETE SELECTED
							</Button>
						</Grid>
						<Grid item xs={12} md="auto">
							<FormControl
								sx={{
									height: "auto",
									width: "100%",
									[theme.breakpoints.up("md")]: {
										//allows for the use of theme wihtout importing it
										width: "150px",
									},
									[theme.breakpoints.up("lg")]: {
										//allows for the use of theme wihtout importing it
										width: "300px",
									},
								}}
							>
								<InputLabel size="normal" id="order-type-label">
									Order Type
								</InputLabel>
								<Select
									onClose={handleFilters}
									labelId="order-type-label"
									id="order-checkbox"
									multiple
									value={orderFilters.orderTypes}
									onChange={handleChange}
									input={<OutlinedInput label="Order Type" />}
									renderValue={(selected) =>
										orderTypes
											.filter((t) => selected.includes(t.value))
											.map((t) => t.label)
											.join(", ")
									}
								>
									{orderTypes.map((type) => (
										<MenuItem key={type.value} value={type.value}>
											<Checkbox
												checked={
													orderFilters.orderTypes.indexOf(type.value) > -1
												}
											/>
											<ListItemText primary={type.label} />
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
					</Grid>
				</main>

				<Box sx={{ height: 400, width: "100%" }}>
					<DataGrid
						sx={{
							m: 2,
							"& .column-theme": {
								paddingLeft: 4,
							},
						}}
						rows={ordersDisplayed}
						columns={columns}
						initialState={{
							pagination: {
								paginationModel: {
									pageSize: 5,
								},
							},
						}}
						pageSizeOptions={[5]}
						checkboxSelection
						disableRowSelectionOnClick
						rowSelectionModel={rowSelectionModel}
						onRowSelectionModelChange={(newRowSelectionModel) => {
							setRowSelectionModel(newRowSelectionModel);
						}}
					/>
				</Box>
			</CssBaseline>
		</>
	);
};

export default () => (
	<ThemeProvider theme={theme}>
		<App />
	</ThemeProvider>
);

const RedTechLogo = React.forwardRef<SVGSVGElement, SvgIconProps>(
	(props, ref) => (
		<SvgIcon
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			width="100%"
			height="100%"
			viewBox="0 0 260 239"
			fill="none"
			component="svg"
			ref={ref}
			{...props}
		>
			<rect width="260" height="239" fill="url(#pattern0)" />
			<defs>
				<pattern
					id="pattern0"
					patternContentUnits="objectBoundingBox"
					width="1"
					height="1"
				>
					<use xlinkHref="#image0" transform="scale(0.00384615 0.0041841)" />
				</pattern>
				<image
					id="image0"
					width="260"
					height="239"
					xlinkHref="data:image/png;base64,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"
				/>
			</defs>
		</SvgIcon>
	)
);
