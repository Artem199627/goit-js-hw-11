import axios from 'axios';

const URL = "https://pixabay.com/api/";
const KEY = "40768065-7dee25ace16eff6300808fd58";

export async function fetchPhoto(q, page, per_page) {
    const url = `${URL}?key=${KEY}&q=${q}&page=${page}&per_page=${per_page}&image_type=photo&orientation=horizontal&safesearch=true`;
    const response = await axios.get(url);
    return response.data;
}

