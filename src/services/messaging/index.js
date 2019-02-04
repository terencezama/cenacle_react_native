import { notify } from "../notification";

export default async (message) => {
    notify(message);
    
    return Promise.resolve();
}