import { useState } from "react";
import { useParams } from "react-router-dom";
import {
    Typography,
    Button,
    Stack,
    Card,
    CardContent,
    Box,
    IconButton,
    useTheme,
    useMediaQuery,
    TextField,
    MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import { PremiumDataGrid } from "../components/PremiumDataGrid";

import { useCollection } from "../hooks/useCollection";
import ItemDialog from "../components/ItemDialog";
import { Addition } from "../interfaces/Addition";

export default function AdditionsPage() {
    const { restaurantId } = useParams<{ restaurantId: string }>();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const { data, createItem, updateItem, deleteItem } =
        useCollection<Addition>(restaurantId!, "additions");

    const { data: categories = [] } = useCollection<{ id: string; name: string }>(
        restaurantId!,
        "category"
    );

    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState<Addition | null>(null);

    const columns: GridColDef[] = [
        { field: "name", headerName: "Nombre", flex: 2 },
        { field: "category", headerName: "Categoría", flex: 1 },
        {
            field: "price",
            headerName: "Impacto Precio",
            flex: 1,
            renderCell: (params) => (
                <Typography color={params.value >= 0 ? "success.main" : "error.main"}>
                    {params.value >= 0 ? `+ $${params.value}` : `- $${Math.abs(params.value)}`}
                </Typography>
            ),
        },
        {
            field: "actions",
            headerName: "Acciones",
            width: 160,
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    <Button
                        size="small"
                        onClick={() => {
                            setCurrent(params.row as Addition);
                            setOpen(true);
                        }}
                    >
                        Editar
                    </Button>
                    <Button
                        size="small"
                        color="error"
                        onClick={() => deleteItem(params.row.id)}
                    >
                        Eliminar
                    </Button>
                </Stack>
            ),
        },
    ];

    return (
        <>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="space-between"
                mb={2}
            >
                <Typography variant="h5">➕ Adiciones</Typography>

                <Button
                    variant="contained"
                    onClick={() => {
                        setCurrent(null);
                        setOpen(true);
                    }}
                >
                    Agregar adición
                </Button>
            </Stack>

            {!isMobile && (
                <Box sx={{ height: 520 }}>
                    <PremiumDataGrid
                        rows={data}
                        columns={columns}
                        getRowId={(row) => row.id!}
                        onRowDoubleClick={(p: GridRowParams) => {
                            setCurrent(p.row as Addition);
                            setOpen(true);
                        }}
                    />
                </Box>
            )}

            {isMobile && (
                <Stack spacing={2}>
                    {data.map((item) => (
                        <Card key={item.id}>
                            <CardContent>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Box flex={1}>
                                        <Typography fontWeight={600}>{item.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.category}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color={item.price >= 0 ? "success.main" : "error.main"}
                                        >
                                            {item.price >= 0 ? `+ $${item.price}` : `- $${Math.abs(item.price)}`}
                                        </Typography>
                                    </Box>
                                    <IconButton
                                        onClick={() => {
                                            setCurrent(item);
                                            setOpen(true);
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Stack>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            )}

            <ItemDialog<Addition>
                open={open}
                onClose={() => setOpen(false)}
                initial={
                    current || {
                        name: "",
                        category: "",
                        price: 0,
                    }
                }
                fields={[
                    { key: "name", label: "Nombre" },
                    {
                        key: "category",
                        label: "Categoría",
                        type: "select",
                        options: categories.map((c) => ({ value: c.name, label: c.name })),
                    },
                    { key: "price", label: "Precio (Positivo suma, Negativo resta)", type: "number" },
                ]}
                onSubmit={async (values) => {
                    if (current?.id) await updateItem(current.id, values);
                    else await createItem(values);
                    setOpen(false);
                }}
            />
        </>
    );
}
