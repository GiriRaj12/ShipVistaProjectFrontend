import base64 from 'base-64';
import UTF8 from 'utf8';

export const BACKEND_TARGET_URL = "http://localhost:5041";

export const USER = "/api/user";

export const PLANTS = "/api/plants";

export const LOGIN = "/user/login";

export const WATER_PLANT = "/api/plant/water";

export const SESSION = "plants_app_user";

export function ENCODE_STR(string){
    const utf8 = UTF8.encode(string);
    return base64.encode(utf8);
}

export function DECODE_STR(string){
    const utf8 = UTF8.decode(string);
    return base64.decode(utf8);
}