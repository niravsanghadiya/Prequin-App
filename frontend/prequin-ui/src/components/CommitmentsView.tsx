import React, { useEffect, useState, useMemo } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { Box, Button, Stack, Typography, CircularProgress } from '@mui/material';
import { getInvestorDetails } from '../apis/investorApi';
import type { InvestorDetail, Commitment } from '../types/investor';
import { formatCurrency } from '../utils/formatting';

interface AssetClassSummary {
  name: string;
  total: number;
}

const CommitmentsView: React.FC<{ investorId: number }> = ({ investorId }) => {
  const [investor, setInvestor] = useState<InvestorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  // State to track the currently selected asset class filter
  const [activeFilter, setActiveFilter] = useState<string>('All');

  useEffect(() => {
    if (!investorId) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await getInvestorDetails(investorId);
        setInvestor(data);
        setActiveFilter('All'); // Reset filter when a new investor is selected
      } catch (error) {
        console.error('Failed to fetch investor details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [investorId]); // This effect re-runs whenever the investorId prop changes

  // useMemo is used for optimization. This calculation only re-runs if `investor` changes.
  const assetClassTotals = useMemo<AssetClassSummary[]>(() => {
    if (!investor) return [];

    const totals: { [key: string]: number } = {};
    // Sum up the amounts for each asset class
    investor.commitments.forEach(c => {
      totals[c.asset_class] = (totals[c.asset_class] || 0) + c.amount;
    });

    // Convert the totals object into an array and sort it
    return Object.entries(totals)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total); // Sort by total amount descending
  }, [investor]);

  // This memoized value filters the commitments based on the active filter
  const filteredCommitments = useMemo(() => {
    if (!investor) return [];
    if (activeFilter === 'All') {
      return investor.commitments;
    }
    return investor.commitments.filter(c => c.asset_class === activeFilter);
  }, [investor, activeFilter]);

  const columns = useMemo<MRT_ColumnDef<Commitment>[]>(() => [
    { accessorKey: 'id', header: 'Id', size: 80 },
    { accessorKey: 'asset_class', header: 'Asset Class', size: 200 },
    { accessorKey: 'currency', header: 'Currency', size: 100 },
    {
      accessorKey: 'amount',
      header: 'Amount',
      
      Cell: ({ cell }) => formatCurrency(cell.getValue<number>()),
      size: 150,
      muiTableHeadCellProps: { align: 'right' },
      muiTableBodyCellProps: { align: 'right' },
    },
  ], []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!investor) return null; // Don't render anything if there's no investor data

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
        Commitments
      </Typography>

      {/* --- Filter Tabs --- */}
      <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
        {/* "All" button */}
        <Button
          variant={activeFilter === 'All' ? 'contained' : 'outlined'}
          onClick={() => setActiveFilter('All')}
          sx={{ textTransform: 'none', textAlign: 'center' }}
        >
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>All</Typography>
            <Typography variant="caption">{formatCurrency(investor.total_commitment)}</Typography>
          </Box>
        </Button>

        {/* Buttons for each Asset Class */}
        {assetClassTotals.map(ac => (
          <Button
            key={ac.name}
            variant={activeFilter === ac.name ? 'contained' : 'outlined'}
            onClick={() => setActiveFilter(ac.name)}
            sx={{ textTransform: 'none', textAlign: 'center' }}
          >
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{ac.name}</Typography>
              <Typography variant="caption">{formatCurrency(ac.total)}</Typography>
            </Box>
          </Button>
        ))}
      </Stack>

      {/* --- Commitments Table --- */}
      <MaterialReactTable
        columns={columns}
        data={filteredCommitments}
        enableToolbarInternalActions={false}
        enableColumnActions={false}
        enablePagination={true}
        enableSorting={false}
      />
    </Box>
  );
};

export default CommitmentsView;