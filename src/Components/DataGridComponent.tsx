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
	SvgIconProps,
	Box,
	Dialog,
	DialogTitle,
	TextField,
	DialogActions,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { SelectChangeEvent } from "@mui/material/Select";
import { createTheme, Theme, ThemeProvider } from "@mui/material";
import { makeStyles } from "@mui/styles";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import { SvgIcon } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import DeleteIcon from "@mui/icons-material/Delete";
import Checkbox from "@mui/material/Checkbox/Checkbox";
import AddIcon from "@mui/icons-material/Add";
import { grey } from "@mui/material/colors";
import {
	DataGrid,
	GridRow,
	renderEditInputCell,
	GridRenderCellParams,
	GridColDef,
	useGridApiContext,
	GridActionsCellItem,
	GridEventListener,
	GridRowId,
	GridRowModel,
	GridRowsProp,
	GridRowModesModel,
	GridRowModes,
	GridRowParams,
	MuiEvent,
} from "@mui/x-data-grid";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { Orders, orderTypes, Setter } from "../Models";

const DataGridComponent = (
	ordersDisplayed: Orders[],
	setOrdersDisplayed: Setter<Orders[]>,
	rowSelectionModel: GridRowSelectionModel,
	setRowSelectionModel: Setter<GridRowSelectionModel>
) => {
	function SelectEditInputCell(props: GridRenderCellParams) {
		const { id, value, field } = props;
		const apiRef = useGridApiContext();

		return (
			<TextField
				value={convertLabelToEnum(value)}
				select
				sx={{ width: "100%" }}
				onChange={(event) => {
					apiRef.current.setEditCellValue({
						id,
						field,
						value: convertLabelToEnum(event.target.value),
					});
				}}
			>
				{orderTypes.map((type) => (
					<MenuItem key={type.value} value={type.value}>
						<ListItemText primary={type.label} />
					</MenuItem>
				))}
			</TextField>
		);
	}

	function convertLabelToEnum(s: string | undefined) {
		return s?.replace(" ", "") ?? "";
	}

	const renderSelectEditInputCell: GridColDef["renderCell"] = (params) => {
		return <SelectEditInputCell {...params} />;
	};

	const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
		{}
	);

	const handleRowEditStart = (
		params: GridRowParams,
		event: MuiEvent<React.SyntheticEvent>
	) => {
		event.defaultMuiPrevented = true;
	};

	const handleRowEditStop: GridEventListener<"rowEditStop"> = (
		params,
		event
	) => {
		event.defaultMuiPrevented = true;
	};

	const handleEditClick = (id: GridRowId) => () => {
		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
	};

	const handleSaveClick = (id: GridRowId) => () => {
		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
	};

	const handleCancelClick = (id: GridRowId) => () => {
		setRowModesModel({
			...rowModesModel,
			[id]: { mode: GridRowModes.View, ignoreModifications: true },
		});
	};

	const processRowUpdate = (newRow: GridRowModel) => {
		const updateOrder = async () => {
			try {
				const response = await fetch("https://localhost:7066/update-order", {
					method: "post",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(newRow),
				});

				if (response.ok) {
					const data = await response;
				}
			} catch (e) {
				console.log(e);
			}
		};

		updateOrder();
		newRow.orderType = convertLabelToEnum(newRow.orderType);

		const updatedRow = newRow as Orders;
		setOrdersDisplayed(
			ordersDisplayed.map((row) => (row.id === newRow.id ? updatedRow : row))
		);
		return updatedRow;
	};

	const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
		setRowModesModel(newRowModesModel);
	};
	const columns: GridColDef[] = [
		{
			field: "id",
			headerName: "Order ID",
			width: 320,
			headerClassName: "column-theme",
			cellClassName: "column-theme",
			disableColumnMenu: true,
			sortable: false,
		},
		{
			field: "createdDate",
			headerName: "Creation Date",
			width: 220,
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
			editable: true,
			renderEditCell: renderSelectEditInputCell,
		},
		{
			field: "customerName",
			headerName: "Customer",
			width: 200,
			headerClassName: "column-theme",
			cellClassName: "column-theme",
			disableColumnMenu: true,
			editable: true,
		},
		{
			field: "actions",
			type: "actions",
			headerName: "Actions",
			width: 100,

			cellClassName: "actions",
			getActions: ({ id }) => {
				const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

				if (isInEditMode) {
					return [
						<GridActionsCellItem
							icon={<SaveIcon />}
							label="Save"
							onClick={handleSaveClick(id)}
						/>,
						<GridActionsCellItem
							icon={<CancelIcon />}
							label="Cancel"
							className="textPrimary"
							color="inherit"
							onClick={handleCancelClick(id)}
						/>,
					];
				}

				return [
					<GridActionsCellItem
						icon={<EditIcon />}
						label="Edit"
						className="textPrimary"
						color="inherit"
						onClick={handleEditClick(id)}
					/>,
				];
			},
		},
	];
	return (
		<Box sx={{ height: 400, width: "100%" }}>
			<DataGrid
				editMode="row"
				sx={{
					m: 2,
					"& .column-theme": {
						paddingLeft: 4,
					},
				}}
				rows={ordersDisplayed.map((o) => ({
					...o,
					orderType: orderTypes.find((ot) => ot.value === o.orderType)?.label,
				}))}
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
				rowModesModel={rowModesModel}
				onRowEditStart={handleRowEditStart}
				onRowEditStop={handleRowEditStop}
				processRowUpdate={processRowUpdate}
				onRowModesModelChange={handleRowModesModelChange}
				onProcessRowUpdateError={(e) => {
					console.log(e);
				}}
			/>
		</Box>
	);
};

export default DataGridComponent;
