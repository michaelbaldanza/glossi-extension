interface AnchorProps {
  children: React.ReactNode;
  isDropItem?: Boolean,
  link?: string;
}

export default function Anchor(props: AnchorProps) {
  const link = props.link ?? '#';

  return (
    <a href={link} className={props.isDropItem ? 'dropdown-link' : 'nav-link'} target={link ? '_blank' : ''}>
      {props.children}
    </a>
  )
}