import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  Button,
  Card,
  CardContent,
  Avatar,
  Switch,
  TextField,
  Divider,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { GridColDef } from "@mui/x-data-grid";
import { PremiumDataGrid } from "../components/PremiumDataGrid";

import { useCollection } from "../hooks/useCollection";
import ItemDialog from "../components/ItemDialog";

/* =======================
   TYPES
======================= */

type DeliverySettings = {
  id?: string;
  deliveryPrice: number;
  active: boolean;
};

type DeliveryUser = {
  id?: string;
  name: string;
  phone: string;
  active: boolean;
  avatar?: string;
};

/* =======================
   PAGE
======================= */

export default function DeliveryPage() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [tab, setTab] = useState(0);

  /* 🔹 Configuración delivery */
  const {
    data: settings,
    createItem: createSettings,
    updateItem: updateSettings,
  } = useCollection<DeliverySettings>(restaurantId!, "deliverySettings");

  const deliveryConfig = settings[0];

  /* 🔹 Domiciliarios */
  const {
    data: couriers,
    createItem,
    updateItem,
    deleteItem,
  } = useCollection<DeliveryUser>(restaurantId!, "deliveryUsers");

  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<DeliveryUser | null>(null);

  /* =======================
     TABLE
  ======================= */

  const columns: GridColDef[] = [
    {
      field: "avatar",
      headerName: "",
      width: 80,
      renderCell: (p) => <Avatar src={p.value} />,
    },
    { field: "name", headerName: "Nombre", flex: 2 },
    { field: "phone", headerName: "Teléfono", flex: 2 },
    {
      field: "active",
      headerName: "Activo",
      width: 120,
      renderCell: (p) => <Switch checked={p.value} />,
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 150,
      renderCell: (p) => (
        <Stack direction="row">
          <IconButton
            onClick={() => {
              setCurrent(p.row);
              setOpen(true);
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => deleteItem(p.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  /* =======================
     UI
  ======================= */

  return (
    <>
      <Typography variant="h4" mb={2}>
        🚚 Delivery
      </Typography>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Configuración" />
        <Tab label="Domiciliarios" />
      </Tabs>

      {/* ================= CONFIGURACIÓN ================= */}
      {tab === 0 && (
        <Card>
          <CardContent>
            <Typography fontWeight={600} mb={2}>
              ⚙️ Configuración de delivery
            </Typography>

            <Stack spacing={2} maxWidth={320}>
              <TextField
                label="Precio del domicilio"
                type="number"
                value={deliveryConfig?.deliveryPrice || ""}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  deliveryConfig?.id
                    ? updateSettings(deliveryConfig.id, {
                      ...deliveryConfig,
                      deliveryPrice: value,
                    })
                    : createSettings({ deliveryPrice: value, active: true });
                }}
              />

              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography>Delivery activo</Typography>
                <Switch
                  checked={deliveryConfig?.active || false}
                  onChange={(e) =>
                    updateSettings(deliveryConfig.id!, {
                      ...deliveryConfig,
                      active: e.target.checked,
                    })
                  }
                />
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* ================= DOMICILIARIOS ================= */}
      {tab === 1 && (
        <>
          <Stack direction="row" justifyContent="space-between" mb={2}>
            <Typography fontWeight={600}>🧍‍♂️ Domiciliarios</Typography>
            <Button
              variant="contained"
              onClick={() => {
                setCurrent(null);
                setOpen(true);
              }}
            >
              Agregar domiciliario
            </Button>
          </Stack>

          <Box sx={{ height: 420 }}>
            <PremiumDataGrid
              rows={couriers}
              columns={columns}
              getRowId={(r) => r.id!}
            />
          </Box>
        </>
      )}

      {/* ================= MODAL ================= */}
      <ItemDialog<DeliveryUser>
        open={open}
        onClose={() => setOpen(false)}
        initial={
          current || {
            name: "",
            phone: "",
            active: true,
            avatar: "",
          }
        }
        fields={[
          { key: "name", label: "Nombre" },
          { key: "phone", label: "Teléfono" },
          { key: "avatar", label: "Avatar", type: "image" },

        ]}
        onSubmit={async (values) => {
          current?.id
            ? updateItem(current.id, values)
            : createItem(values);
          setOpen(false);
        }}
      />
    </>
  );
}
