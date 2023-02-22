import { environment } from "../../../environments/environment";

const base = environment.apiBaseURL;

/* please maintain ASCENDING ORDER of keys */
export const apiMap: { [apiID: string]: string } = {
    songs: base + "/songs",
}