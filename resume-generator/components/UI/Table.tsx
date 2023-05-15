import { TableContainer, Table as CTable, Thead, Tr, Tbody, Th } from "@chakra-ui/react";


export const Table = ({ headers, children }: { headers: string[], children: React.ReactNode }) => {
    return (
        <TableContainer bg="white" borderRadius={5}>
            <CTable variant="simple">
                <Thead>
                    <Tr>
                        {headers.map(header => <Th key={header}>{header}</Th>)}
                    </Tr>
                </Thead>
                <Tbody>
                    {children}
                </Tbody>
            </CTable>
        </TableContainer>
    );
};