import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import CircularProgress from '@mui/joy/CircularProgress';
import Typography from '@mui/joy/Typography';

import OrdersTab from './OrdersTab';
import CustomersTab from './CustomersTab';
import LeadsTab from './LeadsTab';
import AnalyticsTab from './AnalyticsTab';

import { getAuth, getIdTokenResult } from 'firebase/auth';

function AdminDashboardContent() {
  return (
    <Box
      sx={(theme) => ({
        height: '100%',
        bgcolor: 'background.body',
        color: 'text.primary',
        p: { xs: 1.5, sm: 2, md: 3 },
      })}
    >
      <Sheet
        variant="outlined"
        sx={{
          borderRadius: 'lg',
          p: { xs: 1.5, sm: 2 },
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography level="h3" sx={{ mb: 2 }}>Admin Dashboard</Typography>
        <Tabs
          defaultValue={0}
          sx={{
            '--Tabs-gap': '0.5rem',
            '--Tab-indicatorThickness': '2px',
            [`& .${tabClasses.root}`]: {
              flex: 1,
              fontSize: '0.875rem',
              textTransform: 'none',
            },
          }}
        >
          <TabList
            variant="soft"
            sx={{
              borderRadius: 'lg',
              mb: 1.5,
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            }}
          >
            <Tab>Orders</Tab>
            <Tab>Customers</Tab>
            <Tab>Business Leads</Tab>
            <Tab>Analytics</Tab>
          </TabList>

          <TabPanel value={0} sx={{ p: 0, flex: 1, m: 2, overflow: 'auto' }}>
            <OrdersTab />
          </TabPanel>
          <TabPanel value={1} sx={{ p: 0, flex: 1, m: 2, overflow: 'auto' }}>
            <CustomersTab />
          </TabPanel>
          <TabPanel value={2} sx={{ p: 0, flex: 1, m: 2, overflow: 'auto' }}>
            <LeadsTab />
          </TabPanel>
          <TabPanel value={3} sx={{ p: 0, flex: 1, m: 2, overflow: 'auto' }}>
            <AnalyticsTab />
          </TabPanel>
        </Tabs>
      </Sheet>
    </Box>
  );
}

export default function AdminDashboard() {
  const [isReady, setIsReady] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const auth = getAuth();
    if (!auth.currentUser) {
      setIsReady(true);
      return;
    }

    // 1. Force refresh token with claims
    getIdTokenResult(auth.currentUser, true)
      .then((idTokenResult) => {
        const adminRole = idTokenResult.claims.email === 'admin@greenbasket.com';
        
        setIsAdmin(adminRole);
        setIsReady(true);
      })
      .catch((err) => {
        console.error('Admin auth check failed:', err);
        setIsReady(true);
      });
  }, []);

  // 3. Show loading until token + claims verified
  if (!isReady) {
    return (
      <CssVarsProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 8, gap: 2 }}>
        <CircularProgress size="lg" />
        <Typography level="body-sm">Verifying admin access...</Typography>
      </Box>
      </CssVarsProvider>
    );
  }

  // 4. Block non-admins
  if (!isAdmin) {
    return (
      <CssVarsProvider>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 8, gap: 2 }}>
          <Typography level="h4">Access Denied</Typography>
          <Typography level="body-sm">
            Admin role required. Contact support if you believe this is an error.
          </Typography>
        </Box>
      </CssVarsProvider>
    );
  }

  // 5. CssVarsProvider WRAPS content (after auth check)
  return (
    <CssVarsProvider>
      <AdminDashboardContent />
    </CssVarsProvider>
  );
}
