import { useState } from "react";
import {
  Typography,
  Button,
  Stack,
  Avatar,
  Box,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import { PremiumDataGrid } from "../components/PremiumDataGrid";
import { useCollection } from "../hooks/useCollection";
import ItemDialog from "../components/ItemDialog";
import { useParams } from "react-router-dom";
import { Timestamp } from "firebase/firestore";

export type Category = {
  id?: string;
  name: string;
  description?: string;
  route: string;
  colorbg: string;
  image?: string;
  email?: string;
  role?: string;
  createdAt?: Timestamp;
  perfil?: string;
};

export default function UsersPage() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { data, createItem, updateItem, deleteItem } =
    useCollection<Category>(restaurantId!, "users");

  const formatDate = (date?: Timestamp) => {
    if (!date) return "-";
    return new Date(date.seconds * 1000).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Category | null>(null);

  const columns: GridColDef[] = [
    {
      field: "perfil",
      headerName: "Perfil",
      width: 90,
      renderCell: (params) => (
        <Avatar
          src={params.value}
          variant="rounded"
          sx={{ width: 45, height: 45 }}
        />
      ),
    },
    { field: "email", headerName: "Email", flex: 2 },
    { field: "role", headerName: "Rol", flex: 1 },
    { field: "createdAt", headerName: "Creación", flex: 1 },
    {
      field: "actions",
      headerName: "Acciones",
      width: 150,
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
      {/* HEADER */}
      <Stack
        direction={isMobile ? "column" : "row"}
        justifyContent="space-between"
        alignItems={isMobile ? "stretch" : "center"}
        spacing={2}
        mb={2}
      >
        <Typography variant="h5">👥 Usuarios</Typography>
        <Button
          variant="contained"
          fullWidth={isMobile}
          onClick={() => {
            setCurrent(null);
            setOpen(true);
          }}
        >
          Agregar usuario
        </Button>
      </Stack>

      {/* DESKTOP TABLE */}
      {!isMobile && (
        <Box sx={{ height: 520, width: "100%" }}>
          <PremiumDataGrid
            rows={data}
            columns={columns}
            pageSizeOptions={[5, 10]}
            onRowDoubleClick={(p: GridRowParams) => {
              setCurrent(p.row as Category);
              setOpen(true);
            }}
          />
        </Box>
      )}

      {/* MOBILE CARDS */}
      {isMobile && (
        <Stack spacing={2}>
          {data.map((user) => (
            <Card key={user.id} variant="outlined">
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar src={user.perfil} sx={{ width: 56, height: 56 }} />
                  <Box flex={1}>
                    <Typography fontWeight={600}>
                      {user.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Rol: {user.role}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(user.createdAt)}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1} mt={2}>
                  <Button
                    fullWidth
                    size="small"
                    onClick={() => {
                      setCurrent(user);
                      setOpen(true);
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    fullWidth
                    size="small"
                    color="error"
                    disabled={!user.id}
                    onClick={() => {
                      if (!user.id) return;
                      deleteItem(user.id);
                    }}
                  >
                    Eliminar
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* MODAL */}
      <ItemDialog<Category>
        open={open}
        onClose={() => setOpen(false)}
        initial={
          current || {
            name: "",
            description: "",
            route: "",
            colorbg: "",
            image: "",
          }
        }
        fields={[
          { key: "name", label: "Nombre" },
          { key: "description", label: "Descripción" },
          { key: "route", label: "Ruta" },
          { key: "colorbg", label: "Color de fondo", type: "color" },
          { key: "image", label: "Imagen" },
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
