import { Dry, Delete, Shower, Air } from '@mui/icons-material';
import { Alert, Avatar, CircularProgress, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Button, Divider, Dialog, AlertTitle, Snackbar } from '@mui/material';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styles from '../../styles/Plants.module.css';
import { BACKEND_TARGET_URL, PLANTS, SESSION, ENCODE_STR, DECODE_STR, WATER_PLANT } from '../constants/Constants';
import CreatePlantDialog from './CreatePlant';


function Plants(){
    const [plants, setPlants] = useState({});
    const [loading, setLoading] = useState(true);
    const [showering, setShowering] = useState({});
    const [createPlant, setCreatePlant] = useState(false);
    const router = useRouter();
    const [alertText, setAlertText] = useState(null);
    const [snackBar, setSnackBar] = useState(null);

    useEffect(() =>{
        const userObject = JSON.parse(localStorage.getItem(SESSION));

        console.log("logged user", userObject);
        if(!userObject){
            router.push("/login");
        } else 
            fetch(userObject);
    }, []);

    const fetch = async () => {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem(SESSION))
        const response = await GetPlants(user);

        console.log(response);

        setLoading(false);

        if(response.isResponse){
            const plants = changePlantStructure(response.response.message);
            console.log('Received plants');
            console.log(plants);
            setPlants(plants);
            const message = getPlantsWateringAlert(plants);
            setSnackBar(message);
        }
    }

    const deletePlant = async (plant_id) => {
        const user = JSON.parse(localStorage.getItem(SESSION))
        const value = await confirm("Do you want to delete ? ");
        console.log(value, user);
        if(value && user){
            console.log("Delte !");
            const response = await DeletePlants(user, plant_id);
            if(response.isResponse){
                setAlertText("Done Deleting !");
                setTimeout(() => setAlertText(null), 2000);
                fetch();
            } else{
                setAlertText("Something Went Wrong !");
                fetch();
            }
        } else{
            return;
        }
    }

    const showerPlant = async (plant_id) => {
        console.log("To Shower");
        console.log(plant_id)
        
        if(!showering[plant_id]){
            const user = JSON.parse(localStorage.getItem(SESSION));
            showering[plant_id] = true;
            
            const response = await WaterPlant(user, plant_id);
            console.log(response);

            const changedPlant = response.response.message;

            if(response.isResponse){
                const plantsObject = plants;
                plantsObject[changedPlant.plant_id] = changedPlant;
                setPlants(getNewObject(plantsObject));
                setTimeout(()  => doneWatering(plant_id), 50000)
            } else {
                setAlertText(response.response.message == "WATER_RESTING" ? "Please allow plants to rest" : "Something Went Wrong !");
                showering[plant_id] = false;
                setTimeout(()  => setAlertText(null), 2000);
            }
        }
    }

    const doneWatering = (plant_id) => {
        console.log("Fired");

        showering[plant_id] = false; 

        setAlertText("Done Watering and Drying !");
        setTimeout(()  => setAlertText(null), 2000);
    }

    const getNewObject = (object)=>{
        return JSON.parse(JSON.stringify(object));
    }

    const closingSnackBar = () =>{
        setSnackBar(null);
    }



    return(
        <div className={styles.container}>
            {loading ? 
            
            <div className="loading" style={{"marginTop":'10%', "padding":"10px"}}>
                <CircularProgress/> 
            </div>
            
            : 
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="left"
            >
                <Grid item xs={12} style={{'textAlign':'center'}}>
                    <p>Plants</p>
                    {alertText ? 
                    <Alert severity='info'>
                        <AlertTitle>{alertText}</AlertTitle>
                    </Alert> : null }
                    <List>
                    {plants ? Object.values(plants).map(element => {
                        return (
                            <div>
                            <ListItem key={element.plant_id} className={styles.individual_plants_holder}>
                                <ListItemAvatar>
                                    <Avatar
                                        src={element.plant_image_url}
                                    ></Avatar>
                                </ListItemAvatar>
                                <ListItemText>{element.plant_name}</ListItemText>
                                <p>{`( Created : ${dateFromNow(element.created_time)} )`}</p>
                                <IconButton 
                                    disabled={showering[element.plant_id]}
                                    aria-label='Shower Plant' 
                                    color='primary' 
                                    onClick={()=> showerPlant(element.plant_id)}>
                                    {showering[element.plant_id] ? <CircularProgress/> :  <Shower></Shower>}
                                </IconButton>
                                <IconButton disabled={showering[element.plant_id]} onClick={() => deletePlant(element.plant_id)}> 
                                    <Delete color='secondary'></Delete>
                                </IconButton>
                                    <Air></Air>
                                <div style={{width:'20%', textAlign:'center'}}>
                                    <p>{dateFromNow(element.watered_time)}</p>
                                </div>
                            </ListItem>
                            <Divider></Divider>
                            </div>
                        );
                    }) : null}
                    </List>
                </Grid>
                <Grid item xs={4}>
                    <Button disabled={checkWatering(showering)} onClick={() => setCreatePlant(true)}>Create Plant</Button>
                    <Button disabled={checkWatering(showering)} onClick={() => fetch()}>Refresh Plants</Button>
                </Grid>
            </Grid> 
            }
            <Dialog open={createPlant} onClose={() => setCreatePlant(false)}>
                <CreatePlantDialog refreshPlants={() => fetch()} cancel={() => setCreatePlant(false)}/>
            </Dialog>
            <Snackbar
                open={snackBar ? true : false}
                onClose={closingSnackBar}
                message={snackBar}
                autoHideDuration={10000}
            >
            </Snackbar>
        </div>
    )
}

function getPlantsWateringAlert(plants){
    const suffix = "";

    for(const plant in plants){
        if(plants[plant].watered_time == 0 || (checkHours(plants[plant].watered_time)))
            suffix = suffix + plants[plant].plant_name; + ", "
    }

    if(!suffix){
        return null;
    }

    return "Please water plants :" + suffix ;
}

function checkHours(date){
    return (Date.now() - date >= 21600000)
}

function checkWatering(object){
    for(const key in object){
        if(object[key] == true)
            return true;
    }
    return false;
}

function dateFromNow(long){
    if(long == 0)
        return "NOT WATERED";
    
    const date = new Date(long);
    return moment(date).fromNow();
}

async function GetPlants(user, callback){
    const request = {
        'method': 'GET',
        'headers': {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + ENCODE_STR(user.email + ":" + user.password)

        }
    }
    return await fetch(BACKEND_TARGET_URL + PLANTS, request)
        .then(res => res.json());
    
}

async function DeletePlants(user, plantId){
    const request = {
        'method': 'DELETE',
        'headers': {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + ENCODE_STR(user.email + ":" + user.password)

        }
    }
    return await fetch(BACKEND_TARGET_URL + PLANTS + "?plant_id="+plantId, request)
        .then(res => res.json());
}

async function WaterPlant(user, plantId){

    const object = {'plant_id':plantId, 'watered_user': {"user_name":user.email, "email":user.email}};

    const request = {
        'method': 'POST',
        'headers': {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + ENCODE_STR(user.email + ":" + user.password)

        },
        'body': JSON.stringify(object)
    }
    return await fetch(BACKEND_TARGET_URL + WATER_PLANT , request)
        .then(res => res.json());
}

function changePlantStructure(plants=[]){
    const result = {}
    for (const plant of plants){
        if(!result[plant.plant_id]){
            result[plant.plant_id] = plant;
        }
    }
    return result;
}

export default Plants;