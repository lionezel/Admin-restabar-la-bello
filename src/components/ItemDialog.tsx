import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Avatar,
  Typography,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { uploadImage } from "./uploadImage";

export interface Field<T> {
  key: keyof T;
  label: string;
  type?: "text" | "number" | "color" | "image" | "select";
  options?: { value: string; label: string }[];
}

interface Props<T extends Record<string, any>> {
  open: boolean;
  onClose: () => void;
  initial: T;
  fields: Field<T>[];
  onSubmit: (values: T) => Promise<void>;
}

export default function ItemDialog<T extends Record<string, any>>({
  open,
  onClose,
  initial,
  fields,
  onSubmit,
}: Props<T>) {
  const [values, setValues] = useState<T>(initial);
  const [loadingImage, setLoadingImage] = useState(false);

  useEffect(() => {
    setValues(initial);
  }, [initial]);

  const handleChange = (key: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {initial?.id ? "Editar" : "Nuevo registro"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          {fields.map((field) => {
            /* ---------- IMAGE / BANNER ---------- */
            if (field.type === "image") {
              return (
                <Stack key={String(field.key)} spacing={1}>
                  <Typography variant="subtitle2">
                    {field.label}
                  </Typography>

                  <Button
                    variant="outlined"
                    component="label"
                    disabled={loadingImage}
                  >
                    {loadingImage ? "Subiendo..." : "Subir banner"}
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        setLoadingImage(true);
                        const url = await uploadImage(
                          file,
                          `banners/${Date.now()}-${file.name}`
                        );
                        handleChange(field.key, url);
                        setLoadingImage(false);
                      }}
                    />
                  </Button>

                  {values[field.key] && (
                    <Avatar
                      src={values[field.key]}
                      variant="rounded"
                      sx={{
                        width: "100%",
                        height: 140,
                        borderRadius: 2,
                      }}
                    />
                  )}
                </Stack>
              );
            }

            /* ---------- SELECT INPUT ---------- */
            if (field.type === "select") {
              return (
                <TextField
                  key={String(field.key)}
                  select
                  label={field.label}
                  value={values[field.key] ?? ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  fullWidth
                >
                  {field.options?.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </TextField>
              );
            }

            /* ---------- NORMAL INPUT ---------- */
            return (
              <TextField
                key={String(field.key)}
                label={field.label}
                type={field.type || "text"}
                value={values[field.key] ?? ""}
                onChange={(e) =>
                  handleChange(
                    field.key,
                    field.type === "number"
                      ? Number(e.target.value)
                      : e.target.value
                  )
                }
                fullWidth
              />
            );
          })}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={() => onSubmit(values)}
          disabled={loadingImage}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
