import { Menu, MenuItem } from "@mui/material"
import { useState } from "react";
import { Restaurant } from "../../interfaces/Restaurant";



export const EditDeleteRestaurant = ({ deleteRestaurant }: any) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selected, setSelected] = useState<Restaurant | null>(null);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Restaurant | null>(null);

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelected(null);
    };

    const handleEdit = () => {
        if (selected) {
            setEditing(selected);
            setOpen(true);
        }
        handleMenuClose();
    };

    const handleDelete = async () => {
        if (selected) {
            const confirmDelete = window.confirm(
                `¿Estás seguro de eliminar "${selected.name}"?`
            );
            if (confirmDelete) {
                await deleteRestaurant(selected.id);
            }
        }
        handleMenuClose();
    };


    return 
}