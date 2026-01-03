import * as React from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import Stack from '@mui/joy/Stack';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import Input from '@mui/joy/Input';
import Table from '@mui/joy/Table';
import { db } from '../firebase';

export default function CustomersTab() {
  const [customers, setCustomers] = React.useState([]);
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    const q = query(collection(db, 'customers'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setCustomers(
        snap.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt && data.createdAt.toDate
              ? data.createdAt.toDate()
              : null,
            updatedAt: data.updatedAt && data.updatedAt.toDate
              ? data.updatedAt.toDate()
              : null,
          };
        }),
      );
    });
    return () => unsub();
  }, []);

  const filtered = customers.filter((c) => {
    const term = search.toLowerCase();
    return (
      (c.name || '').toLowerCase().includes(term) ||
      (c.email || '').toLowerCase().includes(term) ||
      (c.phone || '').toLowerCase().includes(term) ||
      (c.business || '').toLowerCase().includes(term)
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
        <Typography level="h2">Customers</Typography>
        <Input
          size="sm"
          placeholder="Search name / email / phone / business"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ maxWidth: { sm: 320 } }}
        />
      </Stack>

      <Sheet
        variant="soft"
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
              <th>Business</th>
              <th>Email</th>
              <th>Phone</th>
              <th>GST</th>
              <th>Address</th>
              <th>Created</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.business}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>{c.gst}</td>
                <td>{c.address}</td>
                <td>
                  {c.createdAt
                    ? c.createdAt.toLocaleDateString()
                    : '—'}
                </td>
                <td>
                  {c.updatedAt
                    ? c.updatedAt.toLocaleDateString()
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
