

export const initialState = {
    plants : [],
    user: [],
    logs: []
}

export const ADD_USER = (user) =>  {
    return {
        "type" : "ADD_USER",
        "object": user
    }
}

export const REPLACE_PLANTS = (user) =>  {
    return {
        "type" : "ADD_USER",
        "object": user
    }
}

export const reducer = function (state, action) {
    if(!state){
        return initialState;
    }

    const newState = state;

    switch(action.type) {
        case "ADD_USER" : newState = Object.assign({}, state, {user : action.object});
                            break;
        case "REPLACE_PLANTS": newState = Object.assign({}, state, {plants: action.object});
                            break;

        case "REPLACE_LOGS": newState = Object.assign({}, state, {logs: action.object});
                            break;
    }

    return newState;
}