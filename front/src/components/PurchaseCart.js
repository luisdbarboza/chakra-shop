import { Box, Heading, Button } from "@chakra-ui/react";

function PurchaseCart({ cartData }) {
  const totalAmount = cartData.reduce((sum, entry, index) => {
    return entry.quantity * entry.item.price + sum;
  }, 0);

  const totalItems = cartData.reduce((sum, entry, index) => {
    return entry.quantity + sum;
  }, 0);

  return (
    <Box bg="#F8F8F8" border="1px solid #C0C0C0" borderRadius="5px" p="1rem">
      <Heading size="1rem">
        Subtotal ({totalItems} items): ${totalAmount.toFixed(2)}
      </Heading>
      <Button bg="#F0C040" color="black" w="100%">
        Facturar
      </Button>
    </Box>
  );
}

export default PurchaseCart;
