import React, { useState } from 'react';
import styles from '../../styles/app.home.module.css';
import {Drawer, List, ListItemText, ListItem, Link, Divider, Avatar, ListItemButton } from '@mui/material';
import Plants from './Plants';
import Profile from './Profile';

function Home(){
    const [display, setDisplay] = useState('Plants');
    return(
        <div className={styles.app_container}>
            <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '20%' },
          }}
          open
        >
          <List>
                    <div style={{'height':'50%', 'textAlign':'center', 'width':'100%'}}>
                        <Avatar
                            sx={{ width: 80, height: 80 }}
                            className={styles.sidebarlogo}
                            src="https://cdn-icons-png.flaticon.com/512/628/628283.png"
                        />
                    </div>
                    
                    <ListItemButton key="plants" onClick={() => setDisplay('Plants')}>
                        <ListItemText>Plants</ListItemText>
                    </ListItemButton>
                    <Divider></Divider>

                    <ListItemButton key="user" onClick={() => setDisplay('Profile')}>
                        <ListItemText>Profile</ListItemText>
                    </ListItemButton>
                    <Divider></Divider>
                </List>
        </Drawer>
        <div className={styles.main_content_holder}>
            {getView(display)}
        </div>
        </div>
    )
}

function getView(view){
    switch(view){
        case 'Plants' : return <Plants></Plants>
        case 'Profile': return <Profile></Profile>
    }
}

export default Home = Home;