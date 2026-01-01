import * as React from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import Input from '@mui/joy/Input';
import Table from '@mui/joy/Table';
import Chip from '@mui/joy/Chip';
import { db } from '../firebase';

export default function OrdersTab() {
  const [orders, setOrders] = React.useState([]);
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setOrders(
        snap.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt && data.createdAt.toDate
              ? data.createdAt.toDate()
              : null,
          };
        }),
      );
    });
    return () => unsub();
  }, []);

  const filtered = orders.filter((o) => {
    const term = search.toLowerCase();
    return (
      (o.name || '').toLowerCase().includes(term) ||
      (o.phone || '').toLowerCase().includes(term) ||
      (o.address || '').toLowerCase().includes(term)
    );
  });

  return (
    <Stack spacing={1.5}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="space-between"
      >
        <Typography level="h2">Orders</Typography>
        <Input
          size="sm"
          placeholder="Search name / phone / address"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ maxWidth: { sm: 260 } }}
        />
      </Stack>

      <Sheet
        variant="outlined"
        sx={{
          borderRadius: 'lg',
          overflow: 'auto',
        }}
      >
        <Table
          size="sm"
          borderAxis="bothBetween"
          stickyHeader
          sx={{
            '& thead th': { bgcolor: 'background.level1' },
            minWidth: 900,
          }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Order</th>
              <th>Source</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id}>
                <td>{o.name}</td>
                <td>{o.phone}</td>
                <td>{o.address}</td>
                <td>{o.orderText}</td>
                <td>
                  <Chip size="sm" variant="soft">
                    {o.source || 'N/A'}
                  </Chip>
                </td>
                <td>
                  {o.createdAt
                    ? o.createdAt.toLocaleString(undefined, {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
    </Stack>
  );
}
