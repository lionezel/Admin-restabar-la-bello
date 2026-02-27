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
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { GridColDef } from "@mui/x-data-grid";
import { PremiumDataGrid } from "../components/PremiumDataGrid";

import { useCollection } from "../hooks/useCollection";
import { Product } from "../interfaces/product";
import { ProductSelector } from "../components/ProductSelector";
import { Discount } from "../interfaces/Discount";

const emptyDiscount: Discount = {
  title: "",
  type: "percentage",
  value: 10,
  priority: 1,
  active: true,
  productIds: [],
};

export default function DiscountsPage() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const {
    data: discounts,
    createItem,
    updateItem,
    deleteItem,
  } = useCollection<Discount>(restaurantId ?? "", "discounts");

  const { data: products } = useCollection<Product>(
    restaurantId ?? "",
    "products"
  );

  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Discount>(emptyDiscount);

  /* ------------------ COLUMNS ------------------ */
  const columns: GridColDef[] = [
    { field: "title", headerName: "Título", flex: 1 },
    { field: "type", headerName: "Tipo", width: 120 },
    { field: "value", headerName: "Valor", width: 100 },
    { field: "priority", headerName: "Prioridad", width: 110 },
    {
      field: "active",
      headerName: "Activo",
      width: 100,
      renderCell: (p) => (p.value ? "Sí" : "No"),
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 160,
      renderCell: (p) => (
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            onClick={() => {
              setCurrent(p.row as Discount);
              setOpen(true);
            }}
          >
            Editar
          </Button>
          <Button
            size="small"
            color="error"
            onClick={() => deleteItem(p.row.id)}
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
      <Typography variant="h5">Descuentos</Typography>

      <Button
        variant="contained"
        fullWidth={isMobile}
        onClick={() => {
          setCurrent(emptyDiscount);
          setOpen(true);
        }}
      >
        Crear descuento
      </Button>
    </Stack>
  );

  /* ------------------ MOBILE ------------------ */
  const MobileList = (
    <Stack spacing={2}>
      {discounts.map((d) => (
        <Card key={d.id} sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack direction="row" spacing={2}>
              <Box flex={1}>
                <Typography fontWeight={600}>{d.title}</Typography>
                <Typography variant="body2">
                  {d.type === "percentage" ? `${d.value}%` : `$${d.value}`}
                </Typography>
                <Typography
                  variant="caption"
                  color={d.active ? "success.main" : "error.main"}
                >
                  {d.active ? "Activo" : "Inactivo"}
                </Typography>
              </Box>

              <Stack>
                <IconButton
                  onClick={() => {
                    setCurrent(d);
                    setOpen(true);
                  }}
                >
                  <EditIcon />
                </IconButton>

                <IconButton
                  color="error"
                  onClick={() => deleteItem(d.id!)}
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
          {current.id ? "Editar descuento" : "Nuevo descuento"}
        </Typography>

        <TextField
          label="Título"
          value={current.title}
          onChange={(e) =>
            setCurrent({ ...current, title: e.target.value })
          }
          fullWidth
        />

        <TextField
          select
          label="Tipo de descuento"
          value={current.type}
          onChange={(e) =>
            setCurrent({
              ...current,
              type: e.target.value as "percentage" | "fixed",
            })
          }
        >
          <MenuItem value="percentage">Porcentaje (%)</MenuItem>
          <MenuItem value="fixed">Monto fijo</MenuItem>
        </TextField>

        <TextField
          label="Valor"
          type="number"
          value={current.value}
          onChange={(e) =>
            setCurrent({ ...current, value: Number(e.target.value) })
          }
        />

        <TextField
          label="Prioridad"
          type="number"
          value={current.priority}
          onChange={(e) =>
            setCurrent({ ...current, priority: Number(e.target.value) })
          }
        />

        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography>Activo</Typography>
          <Switch
            checked={current.active}
            onChange={() =>
              setCurrent({ ...current, active: !current.active })
            }
          />
        </Stack>

        <ProductSelector
          products={products}
          selected={current.productIds}
          onChange={(ids) =>
            setCurrent({ ...current, productIds: ids })
          }
        />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Button
            variant="contained"
            fullWidth={isMobile}
            onClick={async () => {
              if (current.id) {
                await updateItem(current.id, current);
              } else {
                await createItem(current);
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

      {!isMobile && (
        <Box sx={{ height: 520 }}>
          <PremiumDataGrid
            rows={discounts}
            columns={columns}
            getRowId={(row) => row.id!}
            onRowDoubleClick={(p) => {
              setCurrent(p.row as Discount);
              setOpen(true);
            }}
          />
        </Box>
      )}

      {isMobile && MobileList}

      {Form}
    </>
  );
}
