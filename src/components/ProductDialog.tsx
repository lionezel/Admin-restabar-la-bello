import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Product, Variant } from "../interfaces/product";
import { storage } from "../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface Props {
  open: boolean;
  onClose: () => void;
  initial: Product;
  categories: { id: string; name: string }[];
  onSubmit: (values: Product) => Promise<void>;
}

export default function ProductDialog({
  open,
  onClose,
  initial,
  categories,
  onSubmit,
}: Props) {
  const [values, setValues] = useState<Product>(initial);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  useEffect(() => {
    setValues(initial);
  }, [initial]);

  const handleChange = <K extends keyof Product>(
    key: K,
    value: Product[K]
  ) => {
    setValues((p) => ({ ...p, [key]: value }));
  };

  const handleVariantChange = (
    index: number,
    key: keyof Variant,
    value: any
  ) => {
    const updated = [...values.variants];
    updated[index] = { ...updated[index], [key]: value };
    setValues({ ...values, variants: updated });
  };

  // 🔥 SUBIR IMAGEN A FIREBASE
  const uploadImage = async (file: File, index: number) => {
    try {
      setUploadingIndex(index);

      const storageRef = ref(
        storage,
        `products/${Date.now()}_${file.name}`
      );

      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      handleVariantChange(index, "image", url);
    } finally {
      setUploadingIndex(null);
    }
  };

  const addVariant = () => {
    setValues((p) => ({
      ...p,
      variants: [
        ...p.variants,
        {
          id: crypto.randomUUID(),
          label: "",
          price: 0,
          stock: 0,
          image: "",
        },
      ],
    }));
  };

  const removeVariant = (index: number) => {
    setValues((p) => ({
      ...p,
      variants: p.variants.filter((_, i) => i !== index),
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {initial.id ? "Editar producto" : "Nuevo producto"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Nombre"
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            fullWidth
          />

          <TextField
            select
            label="Categoría"
            value={values.category}
            onChange={(e) => handleChange("category", e.target.value)}
            fullWidth
          >
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.name}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Descripción"
            value={values.description}
            onChange={(e) => handleChange("description", e.target.value)}
            fullWidth
          />

          {/* VARIANTES */}
          {values.variants.map((v, i) => (
            <Stack
              key={v.id}
              spacing={1}
              p={2}
              border="1px solid #eee"
              borderRadius={2}
            >
              <TextField
                label="Variante (ej: 25ml, 50ml, 100ml)"
                value={v.label}
                onChange={(e) =>
                  handleVariantChange(i, "label", e.target.value)
                }
              />

              <Stack direction="row" spacing={1}>
                <TextField
                  label="Precio"
                  type="number"
                  value={v.price}
                  onChange={(e) =>
                    handleVariantChange(i, "price", Number(e.target.value))
                  }
                  fullWidth
                />

                <TextField
                  label="Stock"
                  type="number"
                  value={v.stock}
                  onChange={(e) =>
                    handleVariantChange(i, "stock", Number(e.target.value))
                  }
                  fullWidth
                />
              </Stack>

              {/* 🔥 SUBIR IMAGEN */}
              <Button component="label" variant="outlined">
                Subir imagen
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files &&
                    uploadImage(e.target.files[0], i)
                  }
                />
              </Button>

              {uploadingIndex === i && <CircularProgress size={24} />}

              {v.image && (
                <img
                  src={v.image}
                  alt="preview"
                  style={{
                    width: 90,
                    height: 90,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              )}

              <Button
                color="error"
                onClick={() => removeVariant(i)}
                disabled={values.variants.length === 1}
              >
                Eliminar variante
              </Button>
            </Stack>
          ))}

          <Button variant="outlined" onClick={addVariant}>
            ➕ Agregar variante
          </Button>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={() => onSubmit(values)}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
