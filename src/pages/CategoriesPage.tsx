import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Button,
  Stack,
  Avatar,
  Card,
  CardContent,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import { PremiumDataGrid } from "../components/PremiumDataGrid";

import { useCollection } from "../hooks/useCollection";
import ItemDialog from "../components/ItemDialog";

export type Category = {
  id?: string;
  name: string;
  description?: string;
  route: string;
  colorbg: string;
  banner?: string;
};

export default function CategoriesPage() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { data, createItem, updateItem, deleteItem } =
    useCollection<Category>(restaurantId!, "category");

  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Category | null>(null);

  const columns: GridColDef[] = [
    {
      field: "banner",
      headerName: "Banner",
      width: 120,
      renderCell: (params) => (
        <Avatar
          src={params.value}
          variant="rounded"
          sx={{ width: 80, height: 50 }}
        />
      ),
    },
    { field: "name", headerName: "Nombre", flex: 2 },
    { field: "description", headerName: "Descripción", flex: 3 },
    { field: "colorbg", headerName: "Color", flex: 1 },
    {
      field: "actions",
      headerName: "Acciones",
      width: 160,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            onClick={() => {
              setCurrent(params.row);
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
        <Typography variant="h5">📂 Categorías</Typography>

        <Button
          variant="contained"
          onClick={() => {
            setCurrent(null);
            setOpen(true);
          }}
        >
          Agregar categoría
        </Button>
      </Stack>

      {!isMobile && (
        <Box sx={{ height: 520 }}>
          <PremiumDataGrid
            rows={data}
            columns={columns}
            getRowId={(row) => row.id!}
            onRowDoubleClick={(p: GridRowParams) => {
              setCurrent(p.row as Category);
              setOpen(true);
            }}
          />
        </Box>
      )}

      {isMobile && (
        <Stack spacing={2}>
          {data.map((cat) => (
            <Card key={cat.id}>
              <CardContent>
                <Stack direction="row" spacing={2}>
                  <Avatar
                    src={cat.banner}
                    variant="rounded"
                    sx={{ width: 80, height: 80 }}
                  />
                  <Box flex={1}>
                    <Typography fontWeight={600}>
                      {cat.name}
                    </Typography>
                    <Typography variant="body2">
                      {cat.description}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() => {
                      setCurrent(cat);
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

      <ItemDialog<Category>
        open={open}
        onClose={() => setOpen(false)}
        initial={
          current || {
            name: "",
            description: "",
            route: "",
            colorbg: "",
            banner: "",
          }
        }
        fields={[
          { key: "name", label: "Nombre" },
          { key: "description", label: "Descripción" },
          { key: "route", label: "Ruta" },
          { key: "colorbg", label: "Color", type: "color" },
          { key: "banner", label: "Banner", type: "image" },
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
