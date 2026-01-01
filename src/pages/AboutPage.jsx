import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

const founders = [
  { name: 'Vipin Singh', role: 'Founder', bio: 'Founder of Green Basket and have a great passion for sustainable agriculture. Built a direct farmer relationships in Haryana, Punjab, Delhi.' },
  { name: 'Rahul Sharma', role: 'Operations and Supply Chain', bio: 'Runs daily procurement and dispatch.' },
  { name: 'Ravinder Jadeja', role: 'Growth', bio: 'Works with B2B partners and marketing. Amazing work experience in the field.' },
];

const AboutPage = () => (
  <Box>
    <Typography variant="h3" sx={{ m: 2 }}>
      About us
    </Typography>
    <Typography sx={{ m: 2 }}>
      Started by three friends, Green Basket sources directly from farmers, eliminating the middleman and passing savings and freshness to businesses.
    </Typography>

    <Grid container spacing={2} sx={{ m: 2 }} alignItems="stretch">
      {founders.map((f) => (
        <Grid item xs={12} md={4} key={f.name} sx={{ display: 'flex' }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', minWidth: 400, maxWidth: 400 }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h5" color='success' p={1}>{f.name}</Typography>
              <Typography variant="subtitle2" px={1} color="text.secondary">
                {f.role}
              </Typography>
              <Typography variant="body2" sx={{ p: 1 }}>
                {f.bio}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default AboutPage;
