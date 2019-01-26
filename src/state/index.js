import performAction from './action';
import * as Types from './types';

export function* delay (delay){
    yield new Promise(resolve=>{
        setTimeout(()=>{
            resolve();
        },delay);
    })
}

export {
    performAction,
    Types
}