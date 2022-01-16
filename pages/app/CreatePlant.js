import { TextField, Button, CircularProgress } from '@mui/material';
import React, { useState } from 'react';
import {ENCODE_STR, SESSION, BACKEND_TARGET_URL, PLANTS} from '../constants/Constants'

function CreatePlantDialog(props){

    const [name, setName] = useState(null);
    const [url, setUrl] = useState(null);
    const [alertText, setAlertText] = useState(null);
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem(SESSION));

        if(name && url && user){
            const plant_object = {'plant_name': name, 'plant_image_url':url}
            const response = await createPlant(plant_object, user);
            console.log(response);
            if(response){
                props.refreshPlants();
                props.cancel();
            } else {
                setAlertText("Sorry somethig went wrong try again !");
            }
        } else{
            setAlertText("Please enter correct name and URL !");
        }
        setLoading(false);
    }



    return (
        <div style={{'textAlign':'center'}}>
            <p>Create Plant !</p>
            <TextField
                    style={{"marginTop":"5%", "marginRight":"10%", "marginLeft":"10%", "width":"80%"}}
                    id="plant_name"
                    label="Plant Name"
                    variant="outlined"
                    type="text"
                    onChange={e => {
                        setAlertText(null);
                        setName(e.target.value)}
                    }
                ></TextField>
            <TextField
                    style={{"marginTop":"5%", "marginRight":"10%", "marginLeft":"10%", "width":"80%"}}
                    id="url"
                    label="Plant Image URL"
                    variant="outlined"
                    type="text"
                    onChange={e => {
                        setAlertText(null);
                        setUrl(e.target.value)
                        }
                    }
                ></TextField>
                <p>{alertText}</p>
            <Button style={{'marginTop':'5%'}} disabled={loading} onClick={submit}> Submit </Button>
            <Button style={{'marginTop':'5%'}} color='secondary' onClick={() => props.cancel()}> Cancel</Button>
            {loading ? <CircularProgress/> : null}
        </div>
    )
}

async function createPlant(object, user){
    const request = {
        'method': 'POST',
        'headers': {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + ENCODE_STR(user.email + ":" + user.password)
        },
        'body': JSON.stringify(object)
    }
    return await fetch(BACKEND_TARGET_URL + PLANTS, request)
        .then(res => res.json());
}

export default CreatePlantDialog;