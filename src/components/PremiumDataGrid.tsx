import { DataGrid, DataGridProps } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";

/**
 * PremiumDataGrid
 * Un componente envolvente avanzado para Material UI `DataGrid`
 * implementado con estética moderna (Glassmorphism, limpieza, animaciones sutiles).
 */
export const PremiumDataGrid = styled(DataGrid)<DataGridProps>(({ theme }) => ({
    border: "none",
    backgroundColor: "#ffffff",
    borderRadius: Number(theme.shape.borderRadius) * 3,
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.04)",
    overflow: "hidden",
    transition: "all 0.3s ease",

    "& .MuiDataGrid-columnHeaders": {
        backgroundColor: "#f8fafc",
        borderBottom: "2px solid #e2e8f0",
        color: theme.palette.text.primary,
        fontWeight: 800,
        fontSize: "0.95rem",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
    },

    "& .MuiDataGrid-columnHeaderTitle": {
        fontWeight: 800,
    },

    "& .MuiDataGrid-row": {
        transition: "all 0.2s ease-in-out",
        "&:hover": {
            backgroundColor: "#f1f5f9",
            transform: "scale(0.998)",
            cursor: "pointer",
        },
        // Remueve borde al último elemento
        "&:last-child .MuiDataGrid-cell": {
            borderBottom: "none",
        },
    },

    "& .MuiDataGrid-cell": {
        borderBottom: "1px solid #f1f5f9",
        color: theme.palette.text.secondary,
        fontSize: "0.9rem",
        fontWeight: 500,
    },

    "& .MuiDataGrid-footerContainer": {
        borderTop: "1px solid #e2e8f0",
        backgroundColor: "#fcfcfd",
    },

    "& .MuiDataGrid-virtualScroller": {
        backgroundColor: "transparent",
    },

    // Custom Pagination Text
    "& .MuiTablePagination-root": {
        color: theme.palette.text.secondary,
        fontWeight: 600,
    },
}));
