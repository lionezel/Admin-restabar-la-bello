import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/config";

import AddIcon from "@mui/icons-material/Add";
import { CreateUserDialog } from "../components/CreateUserDialog";

interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  projects: string[];
}

interface Project {
  id: string;
  name: string;
}

export default function Settings() {
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openCreateUser, setOpenCreateUser] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [newIsAdmin, setNewIsAdmin] = useState(false);

  useEffect(() => {
    const load = async () => {
      const usersSnap = await getDocs(collection(db, "users"));
      const projectsSnap = await getDocs(collection(db, "restaurants"));

      setUsers(
        usersSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<User, "id">),
        }))
      );

      setProjects(
        projectsSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Project, "id">),
        }))
      );
    };

    load();
  }, []);

  const toggleProject = (projectId: string) => {
    if (!selectedUser) return;

    setSelectedUser({
      ...selectedUser,
      projects: selectedUser.projects.includes(projectId)
        ? selectedUser.projects.filter((p) => p !== projectId)
        : [...selectedUser.projects, projectId],
    });
  };

  const saveProjects = async () => {
    if (!selectedUser) return;

    await updateDoc(doc(db, "users", selectedUser.id), {
      projects: selectedUser.projects,
    });

    setUsers((prev) =>
      prev.map((u) => (u.id === selectedUser.id ? selectedUser : u))
    );

    setSelectedUser(null);
  };

  const createUser = async () => {
    if (!newEmail) return;

    const ref = await addDoc(collection(db, "users"), {
      email: newEmail,
      isAdmin: newIsAdmin,
      projects: [],
    });

    setUsers((prev) => [
      ...prev,
      {
        id: ref.id,
        email: newEmail,
        isAdmin: newIsAdmin,
        projects: [],
      },
    ]);

    setNewEmail("");
    setNewIsAdmin(false);
    setOpenCreate(false);
  };

  const columns: GridColDef[] = [
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "role",
      headerName: "Rol",
      width: 120,
      renderCell: (params) =>
        params.row.isAdmin ? (
          <Chip label="Admin" color="primary" size="small" />
        ) : (
          <Chip label="Usuario" size="small" />
        ),
    },
    {
      field: "projects",
      headerName: "Proyectos",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {(params.value || []).map((projectId: string) => (
            <Chip key={projectId} label={projectId} size="small" />
          ))}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 150,
      renderCell: (params) =>
        !params.row.isAdmin && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => setSelectedUser(params.row)}
          >
            Configurar
          </Button>
        ),
    },
  ];

  return (
    <Box p={4} bgcolor="#f4f6f8" minHeight="100vh">
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h5">Configuración de Usuarios</Typography>

            <Box display="flex" justifyContent="space-between" mb={2}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenCreateUser(true)}
              >
                Crear usuario
              </Button>
            </Box>
          </Box>

          <Box sx={{ height: 450 }}>
            <DataGrid
              rows={users}
              columns={columns}
              pageSizeOptions={[5, 10]}
              disableRowSelectionOnClick
              sx={{
                border: "none",
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f3f4f6",
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* 🔹 Modal permisos */}
      <Dialog
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        fullWidth
      >
        <DialogTitle>Proyectos permitidos</DialogTitle>

        <DialogContent>
          {projects.map((p) => (
            <FormControlLabel
              key={p.id}
              label={p.name}
              control={
                <Checkbox
                  checked={selectedUser?.projects.includes(p.id) || false}
                  onChange={() => toggleProject(p.id)}
                />
              }
            />
          ))}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setSelectedUser(null)}>Cancelar</Button>
          <Button variant="contained" onClick={saveProjects}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* 🔹 Modal crear usuario */}
      <CreateUserDialog
        open={openCreateUser}
        onClose={() => setOpenCreateUser(false)}
      />
    </Box>
  );
}
