import { fetchPhoto } from './js/api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { createMarkup } from './js/gallery';
import { refs } from './js/refs';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

let lightbox = new SimpleLightbox('.photo-card a', { 
                captionsData: 'alt',
                captionDelay: 250,
    });

const { searchForm, gallery, load_more } = refs;

const alertForNotify = {
    width: '380px',
    timeout: 3000,
    position: "right-top",
    borderRadius: '3px',
    fontSize: '16px',
};

const perPage = 40;
let page = 1;
let keyForPhoto = "";
    
load_more.classList.add("is-hidden");
    
searchForm.addEventListener("submit", onSearch);

function onSearch(event) {
    event.preventDefault();

    gallery.innerHTML = "";
    page = 1;
    const { searchQuery } = event.currentTarget.elements;
    keyForPhoto = searchQuery.value.trim()
        .toLowerCase().split(' ')
        .join(' ');
    
    if (keyForPhoto === "") {
        load_more.classList.add("is-hidden");
        Notify.info("Enter your request, please!", alertForNotify);
        return;
    }
    fetchPhoto(keyForPhoto, page, perPage).then(data => {
        const searchResults = data.hits;
        if (data.totalHits === 0) {
            Notify.failure("Sorry, there are no images matching your search query. Please try again.", alertForNotify);
        } else {
            Notify.info(`Hooray! We found ${data.totalHits} images.`, alertForNotify);
        }
        console.log(searchResults);
        const numberOfPage = Math.ceil(data.totalHits / perPage);
        createMarkup(searchResults);
    
        if (page >= numberOfPage) {
            load_more.classList.add("is-hidden");
            Notify.info("We're sorry, but you've reached the end of search results.", alertForNotify);
        } else {
            load_more.classList.remove("is-hidden");
            load_more.addEventListener("click", onLoadMore);
        }; lightbox.refresh();
    });

}

load_more.addEventListener("click", onLoadMore);

function onLoadMore() {
    page += 1;
    fetchPhoto(keyForPhoto, page, perPage).then(data => {
        const searchResults = data.hits;
        const numberOfPage = Math.ceil(data.totalHits / perPage);
        createMarkup(searchResults);
        if (page >= numberOfPage) {
            load_more.classList.add("is-hidden");

            Notify.info("We're sorry, but you've reached the end of search results.", alertForNotify);

            load_more.removeEventListener("click", onLoadMore);
        }
        lightbox.refresh();
    });
}

