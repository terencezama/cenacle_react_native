import {AsyncStorage} from 'react-native';
import { Config } from '..';
const store = Config.store;

const setItem = async(key,value) => {
    try{
        await AsyncStorage.setItem(`${store}.${key}`,JSON.stringify(value));
    }catch(e){
        console.log('error retrieving item',e);
    }
}

const getItem = async(key) => {
    try{
        const value = await AsyncStorage.getItem(`${store}.${key}`)
        return JSON.parse(value);
    }catch(e){
        console.log('error getting item',e);
    }
}
export {
    setItem,
    getItem
}