interface ListItemProps {
  children: React.ReactNode;
  isDropItem?: Boolean;
}

export default function ListItem(props: ListItemProps) {
  return (
    <li className={props.isDropItem ? 'dropdown-item' : 'nav-item'}>
      {props.children}
    </li>
  );
}