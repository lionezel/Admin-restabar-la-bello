import {
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Product } from "../interfaces/product";


interface Props {
  products: Product[];
  selected: string[];
  onChange: (ids: string[]) => void;
}

export const ProductSelector = ({
  products,
  selected,
  onChange,
}: Props) => {
  const toggle = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id]
    );
  };

  return (
    <List dense>
      {products.map((p: any) => (
        <ListItem key={p.id} disablePadding>
          <ListItemButton onClick={() => toggle(p.id)}>
            <Checkbox checked={selected.includes(p.id)} />
            <ListItemText primary={p.name} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};
