import React from 'react';
import { Box, CssBaseline, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, Card, CardContent, Grid, Grid2 } from '@mui/material';

const drawerWidth = 240;

const AdminDashboard = () => {

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {['Dashboard', 'Manage Products', 'Orders', 'Users'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />

        {/* Dashboard Metrics */}
        <Grid2 container spacing={3}>
          <Grid2 item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h5">Total Sales</Typography>
                <Typography variant="h6">$5000</Typography>
              </CardContent>
            </Card>
          </Grid2>
          <Grid2 item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h5">Products</Typography>
                <Typography variant="h6">150</Typography>
              </CardContent>
            </Card>
          </Grid2>
          {/* Add more cards for metrics like Orders, Users, etc. */}
        </Grid2>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
