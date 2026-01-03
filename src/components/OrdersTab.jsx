import * as React from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import Input from '@mui/joy/Input';
import Table from '@mui/joy/Table';
import Chip from '@mui/joy/Chip';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Button } from '@mui/joy';
import emailjs from '@emailjs/browser';

export default function OrdersTab() {
  const [orders, setOrders] = React.useState([]);
  const [search, setSearch] = React.useState('');

  const APPROVED_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_APPROVED_TEMPLATE_ID;
  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

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

  const approveOrder = async (orderDetails) => {

    await updateDoc(doc(db, 'orders', orderDetails.id), {
      status: 'Approved',
      approvedAt: new Date(),
    });

    // WhatsApp confirmation to user
    const confirmMsg = `✅ *Order #${orderDetails.profile?.id} CONFIRMED!*\n\n` +
      `Ready for delivery. Please coordinate pickup/delivery timing via WhatsApp.`;

    // const confirmUrl = `https://wa.me/${userPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(confirmMsg)}`;
    // window.open(confirmUrl, '_blank');

    // Email confirmation via EmailJS
    await emailjs.send(SERVICE_ID, APPROVED_TEMPLATE_ID, {
      business: orderDetails.profile?.business,
      phone: orderDetails.profile?.phone,
      email: orderDetails.profile?.email,
      address: orderDetails.profile?.address,
      order_id: orderDetails.profile?.id,

      items: orderDetails.items?.map(item => [
        item.imageUrl || '',
        item.name,
        `${item.quantity}${item.unit || 'kg'}`,
        `₹${item.pricePerKg * item.quantity}` // {{item_price}}
      ]),

      shipping: 'Free Cash on Delivery',
      total: `₹${orderDetails.totalAmount}`,

      to_email: orderDetails.profile?.email,

    }, PUBLIC_KEY);
    alert(`Order #${orderDetails.profile?.id} approved and confirmation email sent to user.`);
  };

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
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id}>
                <td>{o.profile?.business}</td>
                <td>{o.phone}</td>
                <td>{o.address}</td>
                <td>{o.items?.map(item => `${item.name} (${item.quantity}${item.unit || 'kg'})`).join(', ')}</td>
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
                <td>
                  <Chip
                    color={o.status === 'Approved' ? 'success' : 'warning'}
                    size="sm"
                  >
                    {o.status || 'Pending'}
                  </Chip>
                </td>
                <td style={{ justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                  {o.status !== 'Approved' && (
                    <Button
                      size="sm"
                      variant="soft"
                      onClick={() => approveOrder(o)}
                    >
                      Approve
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
    </Stack>
  );
}
