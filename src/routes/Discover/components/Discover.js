import React,{useState,useEffect} from 'react';
import DiscoverBlock from './DiscoverBlock/components/DiscoverBlock';
import { Config } from '../../../Config';
import axios from 'axios';
import '../styles/_discover.scss';

export default function Discover(){

  const spotify = Config();  

  const [token, setToken] = useState("");
  const [releases, setReleases] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [categories, setCategories] = useState([]);

  console.log('RENDERING APP.JS');
  console.log(token);

  useEffect(() => {

    axios('https://accounts.spotify.com/api/token', {
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Authorization' : 'Basic ' + btoa(spotify.clientId + ':' + spotify.clientSecret)      
      },
      data: 'grant_type=client_credentials',
      method: 'POST'
    })
    .then(tokenResponse => {   
      setToken(tokenResponse.data.access_token);
      
      axios('https://api.spotify.com/v1/browse/new-releases', {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + tokenResponse.data.access_token}
      })
      .then (genreResponse => {        
        setReleases(genreResponse.data.albums.items);
      });

      axios('https://api.spotify.com/v1/browse/featured-playlists', {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + tokenResponse.data.access_token}
      })
      .then (genreResponse => {        
        setPlaylists(genreResponse.data.playlists.items);
      });

      axios('https://api.spotify.com/v1/browse/categories', {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + tokenResponse.data.access_token}
      })
      .then (genreResponse => {        
        setCategories(genreResponse.data.categories.items);
      });

    });

  }, [spotify.clientId, spotify.clientSecret]);

  
  return (
    <div className="discover">
      <DiscoverBlock text="RELEASED THIS WEEK" id="released" data={releases} />
      <DiscoverBlock text="FEATURED PLAYLISTS" id="featured" data={playlists} />
      <DiscoverBlock text="BROWSE" id="browse" data={categories} imagesKey="icons" />
    </div>
  );
}


