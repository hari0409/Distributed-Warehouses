import { useColorMode } from "@chakra-ui/react";
import { MdDarkMode } from "react-icons/md";

function Theme() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <header>
      <MdDarkMode onClick={toggleColorMode} size={"2.25em"} />
    </header>
  );
}
export default Theme;
