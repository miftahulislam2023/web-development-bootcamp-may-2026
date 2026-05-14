import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';

import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { NavLink, Outlet } from 'react-router';
import { Activity, BanknoteArrowDown, BanknoteArrowUp, Settings, Wallet } from 'lucide-react';
import ListItemText from '@mui/material/ListItemText';
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

const menuItems = [
    {
        text: "My Activity",
        path: "/dashboard/my-activity",
        icon: <Activity />
    },
    {
        text: "My Incomes",
        path: "/dashboard/my-incomes",
        icon: <BanknoteArrowUp />
    },
    {
        text: "My Expenses",
        path: "/dashboard/my-expenses",
        icon: <BanknoteArrowDown />
    }
]

const Sidebar = ({ userData }) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', 
            fontFamily: 'inter' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{
            bgcolor: "#0b0b0b",
            color: "#f5f5f5",
            borderBottom: "1px solid #222",
            boxShadow: "none"
        }}>

            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={[
                    {
                        marginRight: 5,
                    },
                    open && { display: 'none' },
                    ]}
                >
                    <MenuIcon />
                </IconButton>

                <Typography variant="h6" noWrap component="div">
                    Dashboard
                </Typography>
        
            </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open} sx={{
            "& .MuiDrawer-paper": {
                backgroundColor: "#050505",
                color: "#f5f5f5",
                borderRight: "1px solid #222"
            }
        }}>

            {/* Logo and Collapse button */}
            
            <DrawerHeader sx = {{
                display:"flex",
                alignItems: "center",
                gap:"20px"
            }}>
                <NavLink to="/" className="lobster flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-white text-black flex justify-center items-center">
                    <Wallet />
                    </div>
                    <h1 className="text-xl text-white font-bold">WalletWatch</h1>
                </NavLink>

                <IconButton onClick={handleDrawerClose} sx = {{
                    color: "white",
                    "&:hover": {
                        backgroundColor: "#161616",
                        color: "#ffffff"
                    }
                }}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </DrawerHeader>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    justifyContent: "space-between"
                }}
            >

                {/* Upper section */}

                <Box>
                    <Divider />

                    {/* Menu Items */}

                    <List>
                        {
                            menuItems.map((item) => (
                                <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
                                    <ListItemButton
                                        component={NavLink}
                                        to={item.path}
                                        sx={[
                                            {
                                            minHeight: 48,
                                            px: 2.5,
                                            mx: 1,
                                            my: 0.5,
                                            borderRadius: 2,
                                            color: "#ffffff",
                                            "&:hover": {
                                                backgroundColor: "#161616",
                                                color: "#ffffff"
                                            },
                                            "&.active": {
                                                backgroundColor: "#161616",
                                                color: "#ffffff"
                                            }
                                            },
                                            open
                                            ? { justifyContent: "initial" }
                                            : { justifyContent: "center" },
                                        ]}
                                    >

                                        <ListItemIcon
                                        sx={[
                                            {
                                            minWidth: 0,
                                            justifyContent: "center",
                                            color: "inherit",
                                            },
                                            open
                                            ? {
                                                mr: 3,
                                                }
                                            : {
                                                mr: "auto",
                                                },
                                        ]}
                                        >
                                            {item.icon}
                                        </ListItemIcon>

                                        <ListItemText
                                            primary={item.text}
                                            sx={{
                                                opacity: open ? 1 : 0,
                                                "& .MuiTypography-root": {
                                                color: "#ffffff",
                                                fontWeight: 500,
                                                },
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                                )
                            )
                        }

                    </List>
                </Box>

                {/* Lower section */}

                <Box sx={{ mb: 2, px: 1.5 }}>
                    <Divider sx={{ borderColor: "#222", mb: 2 }} />

                    <Box
                        sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        px: 1,
                        py: 1.25,
                        borderRadius: 3,
                        color: "#ffffff",
                        overflow: "hidden",
                        "&:hover": {
                            backgroundColor: "#161616",
                            color: "#ffffff"
                            },
                            "&.active": {
                                backgroundColor: "#161616",
                                color: "#ffffff"
                            },
                        }}
                        component={NavLink}
                        to="/dashboard/my-profile"
                        >

                        <Box
                            component="img"
                            src={userData?.photoURL}
                            alt={userData?.name}
                            sx={{
                                width: 25,
                                height: 25,
                                borderRadius: "50%",
                                objectFit: "cover",
                                flexShrink: 0,
                                border: "1px solid #2a2a2a"
                            }}
                            />
                            <Box
                                sx={{
                                opacity: open ? 1 : 0,
                                transition: "opacity 0.2s ease",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                }}
                            >
                                <Typography
                                    sx={{
                                    fontSize: "0.8rem",
                                    fontWeight: 600,
                                    color: "#ffffff",
                                    lineHeight: 1.2,
                                    }}
                                >
                                    {userData?.name || "User Name"}
                                </Typography>

                                <Typography
                                    sx={{
                                    fontSize: "0.6rem",
                                    color: "#a3a3a3",
                                    lineHeight: 1.2,
                                    mt: 0.4,
                                    }}
                                >
                                    {userData?.email || "user@email.com"}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
        </Drawer>

      {/* Component */}

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet></Outlet>
      </Box>
    </Box>
  );
}


export default Sidebar;
