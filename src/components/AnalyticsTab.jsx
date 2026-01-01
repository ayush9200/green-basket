import * as React from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import Stack from '@mui/joy/Stack';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Chip from '@mui/joy/Chip';
import Grid from '@mui/joy/Grid';
import { startOfWeek, startOfMonth, startOfQuarter, startOfYear, format } from 'date-fns';
import { db } from '../firebase';

function bucketDate(date, period) {
  if (!date) return 'Unknown';
  switch (period) {
    case 'week':
      return format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-ww');
    case 'month':
      return format(startOfMonth(date), 'yyyy-MM');
    case 'quarter':
      return format(startOfQuarter(date), "yyyy-'Q'Q");
    case 'year':
    default:
      return format(startOfYear(date), 'yyyy');
  }
}

function countByPeriod(dates, period) {
  const map = {};
  dates.forEach((d) => {
    const key = bucketDate(d, period);
    map[key] = (map[key] || 0) + 1;
  });
  return Object.entries(map)
    .sort((a, b) => (a[0] < b[0] ? -1 : 1));
}

export default function AnalyticsTab() {
  const [orders, setOrders] = React.useState([]);
  const [customers, setCustomers] = React.useState([]);
  const [period, setPeriod] = React.useState('week');

  React.useEffect(() => {
    const unsubOrders = onSnapshot(collection(db, 'orders'), (snap) => {
      setOrders(
        snap.docs
          .map((d) => {
            const data = d.data();
            return data.createdAt && data.createdAt.toDate
              ? data.createdAt.toDate()
              : null;
          })
          .filter(Boolean),
      );
    });

    const unsubCustomers = onSnapshot(collection(db, 'customers'), (snap) => {
      setCustomers(
        snap.docs
          .map((d) => {
            const data = d.data();
            return data.createdAt && data.createdAt.toDate
              ? data.createdAt.toDate()
              : null;
          })
          .filter(Boolean),
      );
    });

    return () => {
      unsubOrders();
      unsubCustomers();
    };
  }, []);

  const orderCounts = countByPeriod(orders, period);
  const customerCounts = countByPeriod(customers, period);

  return (
    <Stack spacing={1.5}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="space-between"
      >
        <Typography level="h2">Analytics</Typography>
        <Select
          size="sm"
          value={period}
          onChange={(event, newValue) => {
            if (newValue) setPeriod(newValue);
          }}
          sx={{ width: { xs: '100%', sm: 180 } }}
        >
          <Option value="week">Per week</Option>
          <Option value="month">Per month</Option>
          <Option value="quarter">Per quarter</Option>
          <Option value="year">Per year</Option>
        </Select>
      </Stack>

      <Grid container spacing={1.5}>
        <Grid xs={12} md={6}>
          <Sheet variant="soft" sx={{ borderRadius: 'lg', p: 1.5 }}>
            <Typography level="title-md" sx={{ mb: 1 }}>
              Orders
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {orderCounts.map(([key, count]) => (
                <Chip key={key} variant="soft" size="sm">
                  {key}: {count}
                </Chip>
              ))}
            </Stack>
          </Sheet>
        </Grid>

        <Grid xs={12} md={6}>
          <Sheet variant="soft" sx={{ borderRadius: 'lg', p: 1.5 }}>
            <Typography level="title-md" sx={{ mb: 1 }}>
              Customers
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {customerCounts.map(([key, count]) => (
                <Chip key={key} variant="soft" size="sm">
                  {key}: {count}
                </Chip>
              ))}
            </Stack>
          </Sheet>
        </Grid>
      </Grid>
    </Stack>
  );
}
