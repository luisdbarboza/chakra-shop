import { useContext } from "react";
import {
  Box,
  Heading,
  Button,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { getUserOrders } from "../graphql/queries";
import { AuthContext } from "context/AuthContext";

function OrderHistory() {
  const { user } = useContext(AuthContext);
  const { data, loading, error } = useQuery(getUserOrders, {
    variables: {
      id: user.id,
    },
  });

  return (
    <Box p="2rem">
      <Heading>Historial de Pedidos</Heading>
      <Table variant="striped" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>Fecha</Th>
            <Th>Total</Th>
            <Th>Pagado</Th>
            <Th>Ver</Th>
          </Tr>
        </Thead>
        <Tbody>
          {loading || !data || !data.user ? (
            <Text>Cargando...</Text>
          ) : (
            <>
              {data.user.orders.map((order, index) => {
                return (
                  <Tr>
                    <Td>2021-06-04</Td>
                    <Td>{order.totalAmount}</Td>
                    <Td>No</Td>
                    <Td>
                      <Link href={`/orderDetails/${order.id}`}>
                        <Button>Detalles</Button>
                      </Link>
                    </Td>
                  </Tr>
                );
              })}
            </>
          )}
        </Tbody>
      </Table>
    </Box>
  );
}

export default OrderHistory;
