import React, { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { Box, Typography } from '@mui/material';
import { getInvestors } from '../apis/investorApi';
import type { InvestorSummary } from '../types/investor';
import { formatCurrency } from '../utils/formatting';

// Props definition: this component will receive a function to handle row clicks
interface Props {
  onInvestorSelect: (investorId: number) => void;
}

const InvestorsTable: React.FC<Props> = ({ onInvestorSelect }) => {
  const [investors, setInvestors] = useState<InvestorSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        setLoading(true);
        const data = await getInvestors();
        setInvestors(data);
      } catch (error) {
        console.error("Failed to fetch investors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvestors();
  }, []);

  const columns = useMemo<MRT_ColumnDef<InvestorSummary>[]>(
    () => [
      { accessorKey: 'id', header: 'Id', size: 50 },
      { accessorKey: 'name', header: 'Name', size: 200 },
      { accessorKey: 'type', header: 'Type', size: 150 },
      { accessorKey: 'country', header: 'Country', size: 150 },
      { accessorKey: 'date_added', header: 'Date Added' },
      {
        accessorKey: 'total_commitment',
        header: 'Total Commitment',
        Cell: ({ cell }) => (
        <Box component="span" sx={{ fontWeight: 'bold' }}>
            {formatCurrency(cell.getValue<number>())}
          </Box>           
        ),
      },
    ],
    []
  );

  return (
    <>
      <Typography variant="h5" component="h2" gutterBottom>
        Investors
      </Typography>
      <MaterialReactTable
        columns={columns}
        data={investors}
        state={{ isLoading: loading }}
        muiTableBodyRowProps={({ row }) => ({
          onClick: () => onInvestorSelect(row.original.id),
          sx: { cursor: 'pointer' },
        })}
      />
    </>
  );
};

export default InvestorsTable;