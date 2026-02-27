import { useRestaurants } from "../hooks/useRestaurants";
import { Box, Button } from "@mui/material";
import { RestaurantCard } from "../components";

import { useNavigate } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import { useAuth } from "../hooks/useAuth";
import { auth } from "../firebase/config";

export default function RestaurantsPage() {
  const { restaurants, createRestaurant, updateRestaurant, deleteRestaurant } =
    useRestaurants();
  const navigate = useNavigate();
  const { user, userDoc, loading } = useAuth();

  
console.log(auth.currentUser?.uid);
  return (
    <Box
      sx={{
        p: 4,
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
      }}
    >
      {userDoc?.isAdmin && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={() => navigate("/settings")}
          >
            Configuración
          </Button>
        </Box>
      )}

      <RestaurantCard
        restaurants={restaurants}
        createRestaurant={createRestaurant}
        updateRestaurant={updateRestaurant}
        deleteRestaurant={deleteRestaurant}
      />
    </Box>
  );
}
