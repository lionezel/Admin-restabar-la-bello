import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
} from "@mui/material";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, functions } from "../firebase/config";
import { httpsCallable } from "firebase/functions";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CreateUserDialog({ open, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  const createUser = async () => {
    if (!email || !password) return;

    setLoading(true);

    const fn = httpsCallable(functions, "createUser");

    await fn({
      email,
      password,
      isAdmin,
    });

    setEmail("");
    setPassword("");
    setIsAdmin(false);
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Crear usuario</DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />

          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
            }
            label="Administrador"
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={createUser} disabled={loading}>
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
}
