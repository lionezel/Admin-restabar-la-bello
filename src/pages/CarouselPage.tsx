import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Button,
  Stack,
  Switch,
  TextField,
  Paper,
  Card,
  CardContent,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { GridColDef } from "@mui/x-data-grid";
import { PremiumDataGrid } from "../components/PremiumDataGrid";

import { useCollection } from "../hooks/useCollection";
import { Carousel } from "../interfaces/carousel";
import { Product } from "../interfaces/product";
import { ProductSelector } from "../components/ProductSelector";

export default function CarouselPage() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const {
    data: carousels,
    createItem,
    updateItem,
    deleteItem,
  } = useCollection<Carousel>(restaurantId ?? "", "carousels");

  const { data: products } = useCollection<Product>(
    restaurantId ?? "",
    "products"
  );

  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Carousel | null>(null);

  /* ------------------ DESKTOP COLUMNS ------------------ */
  const columns: GridColDef[] = [
    { field: "title", headerName: "Título", flex: 1 },
    { field: "order", headerName: "Orden", width: 100 },
    {
      field: "active",
      headerName: "Activo",
      width: 100,
      renderCell: (params) => (params.value ? "Sí" : "No"),
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 180,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            onClick={() => {
              setCurrent(params.row as Carousel);
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

  /* ------------------ HEADER ------------------ */
  const Header = (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      justifyContent="space-between"
      mb={2}
    >
      <Typography variant="h5">🎠 Carruseles</Typography>

      <Button
        variant="contained"
        fullWidth={isMobile}
        onClick={() => {
          setCurrent(null);
          setOpen(true);
        }}
      >
        Crear carrusel
      </Button>
    </Stack>
  );

  /* ------------------ MOBILE CARDS ------------------ */
  const MobileList = (
    <Stack spacing={2}>
      {carousels.map((c) => (
        <Card key={c.id} sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box flex={1}>
                <Typography fontWeight={600}>{c.title}</Typography>
                <Typography variant="body2">
                  Orden: {c.order}
                </Typography>
                <Typography
                  variant="caption"
                  color={c.active ? "success.main" : "error.main"}
                >
                  {c.active ? "Activo" : "Inactivo"}
                </Typography>
              </Box>

              <Stack>
                <IconButton
                  onClick={() => {
                    setCurrent(c);
                    setOpen(true);
                  }}
                >
                  <EditIcon />
                </IconButton>

                <IconButton
                  color="error"
                  onClick={() => deleteItem(c.id!)}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );

  /* ------------------ FORM ------------------ */
  const Form = open && (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h6">
          {current ? "Editar carrusel" : "Nuevo carrusel"}
        </Typography>

        <TextField
          label="Título"
          value={current?.title ?? ""}
          onChange={(e) =>
            setCurrent((prev) => ({
              ...(prev ?? {
                id: "",
                productIds: [],
                order: 1,
                active: true,
              }),
              title: e.target.value,
            }))
          }
          fullWidth
        />

        <TextField
          label="Orden"
          type="number"
          value={current?.order ?? 1}
          onChange={(e) =>
            setCurrent((prev) => ({
              ...(prev ?? {
                id: "",
                title: "",
                productIds: [],
                active: true,
              }),
              order: Number(e.target.value),
            }))
          }
        />

        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography>Activo</Typography>
          <Switch
            checked={current?.active ?? true}
            onChange={() =>
              setCurrent((prev) => ({
                ...(prev ?? {
                  id: "",
                  title: "",
                  order: 1,
                  productIds: [],
                }),
                active: !prev?.active,
              }))
            }
          />
        </Stack>

        <ProductSelector
          products={products}
          selected={current?.productIds ?? []}
          onChange={(ids) =>
            setCurrent((prev) => ({
              ...(prev ?? {
                id: "",
                title: "",
                order: 1,
                active: true,
              }),
              productIds: ids,
            }))
          }
        />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
        >
          <Button
            variant="contained"
            fullWidth={isMobile}
            onClick={async () => {
              if (current?.id) {
                await updateItem(current.id, {
                  title: current.title,
                  order: current.order,
                  active: current.active,
                  productIds: current.productIds,
                });
              } else {
                await createItem({
                  title: current?.title ?? "",
                  order: current?.order ?? 1,
                  active: current?.active ?? true,
                  productIds: current?.productIds ?? [],
                });
              }
              setOpen(false);
            }}
          >
            Guardar
          </Button>

          <Button fullWidth={isMobile} onClick={() => setOpen(false)}>
            Cancelar
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );

  return (
    <>
      {Header}

      {/* DESKTOP */}
      {!isMobile && (
        <Box sx={{ height: 500 }}>
          <PremiumDataGrid
            rows={carousels}
            columns={columns}
            getRowId={(row) => row.id!}
            onRowDoubleClick={(p) => {
              setCurrent(p.row as Carousel);
              setOpen(true);
            }}
          />
        </Box>
      )}

      {/* MOBILE */}
      {isMobile && MobileList}

      {Form}
    </>
  );
}
