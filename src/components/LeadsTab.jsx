import * as React from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import Stack from '@mui/joy/Stack';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import Input from '@mui/joy/Input';
import Table from '@mui/joy/Table';
import Chip from '@mui/joy/Chip';
import { db } from '../firebase';

export default function LeadsTab() {
  const [leads, setLeads] = React.useState([]);
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    const q = query(
      collection(db, 'contactRequests'),
      orderBy('createdAt', 'desc'),
    );
    const unsub = onSnapshot(q, (snap) => {
      setLeads(
        snap.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt:
              data.createdAt && data.createdAt.toDate
                ? data.createdAt.toDate()
                : null,
          };
        }),
      );
    });
    return () => unsub();
  }, []);

  const filtered = leads.filter((lead) => {
    const term = search.toLowerCase();
    return (
      (lead.name || '').toLowerCase().includes(term) ||
      (lead.email || '').toLowerCase().includes(term) ||
      (lead.phone || '').toLowerCase().includes(term) ||
      (lead.business || '').toLowerCase().includes(term) ||
      (lead.message || '').toLowerCase().includes(term)
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
        <Typography level="h2">Business Leads</Typography>
        <Input
          size="sm"
          placeholder="Search name / email / phone / business / message"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ maxWidth: { sm: 360 } }}
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
              <th>Message</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <tr key={lead.id}>
                <td>{lead.name}</td>
                <td>{lead.business}</td>
                <td>{lead.email}</td>
                <td>{lead.phone}</td>
                <td>
                  <Chip
                    size="sm"
                    variant="soft"
                    sx={{
                      maxWidth: 260,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {lead.message}
                  </Chip>
                </td>
                <td>
                  {lead.createdAt
                    ? lead.createdAt.toLocaleString(undefined, {
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
