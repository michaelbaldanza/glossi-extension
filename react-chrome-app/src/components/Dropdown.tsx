interface DropdownProps {
  children: React.ReactNode;
  text: string;
}

export default function Dropdown(props: DropdownProps) {
  return (
    <div className="dropdown">
      <button className="btn btn-link text-decoration-none dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        {props.text}
      </button>
      <ul className="dropdown-menu">
        {props.children}
      </ul>
    </div>
  );
}