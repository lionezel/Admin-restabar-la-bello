import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";

export interface RestaurantForm {
  name: string;
  description?: string;
  image?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  initial: RestaurantForm;
  onSubmit: (values: RestaurantForm) => Promise<void>;
}

export default function RestaurantDialog({
  open,
  onClose,
  initial,
  onSubmit,
}: Props) {
  const [values, setValues] = useState<RestaurantForm>(initial);

  useEffect(() => {
    setValues(initial);
  }, [initial]);

  const handleChange = (key: keyof RestaurantForm, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {initial.name ? "Editar restaurante" : "Nuevo restaurante"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Nombre"
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Descripción"
            value={values.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            fullWidth
            multiline
            rows={3}
          />

          <TextField
            label="URL de imagen"
            value={values.image || ""}
            onChange={(e) => handleChange("image", e.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={() => onSubmit(values)}
          disabled={!values.name.trim()}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
