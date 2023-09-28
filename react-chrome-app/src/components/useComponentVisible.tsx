import { RefObject, useEffect, useRef } from 'react';

function useComponentVisible(arr: [boolean, React.Dispatch<React.SetStateAction<boolean>>]) {
  const [isComponentVisible, setIsComponentVisible] = arr;
  const ref: RefObject<HTMLInputElement> = useRef(null);
  const handleClickOutside = (event: MouseEvent) => {
    console.log(`handling click outside`)
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsComponentVisible(false);
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    }
  }, []);

  return { ref, isComponentVisible, setIsComponentVisible };
}

export default useComponentVisible;