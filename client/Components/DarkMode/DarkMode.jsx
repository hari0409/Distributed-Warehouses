import { Button, useColorMode } from "@chakra-ui/react";

function Theme() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <Button onClick={toggleColorMode} style={{ background: "#F73D93" }}>
        Change Theme
      </Button>
    </>
  );
}
export default Theme;
