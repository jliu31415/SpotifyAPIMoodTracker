import React, {Component} from 'react';
import './App.css';
import Spotify from 'spotify-web-api-js';

const spotifyWebApi = new Spotify()

class App extends Component {
  constructor(){
    super();
    const params = this.getHashParams();
    this.state ={
      loggedIn: params.access_token? true : false,
      nowPlaying: {
        name: "",
        image: "",
        trackID: "",
      },
      audioFeatures: {
        acousticness: ""
      }
    }
    if (params.access_token) {
      spotifyWebApi.setAccessToken(params.access_token);
    }
  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    //eslint-disable-next-line
    while (e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  update() {
    this.getNowPlaying();
  }

  getNowPlaying() {
    spotifyWebApi.getMyCurrentPlaybackState()
      .then((response) => {
        this.setState({
          nowPlaying: {
            name: response.item.name,
            image: response.item.album.images[0].url,
            trackID: response.item.id
          }
        })
        this.getAudioFeatures();
      })
  }

  getAudioFeatures() {
    spotifyWebApi.getAudioFeaturesForTrack(this.state.nowPlaying.trackID)
      .then((response) => {
        this.setState({
          audioFeatures: {
            acousticness: response.acousticness
          }
        })
      })
  }

  render() {
    return (
      <div className="App">
        <a href='http://localhost:8888'>
          <button>Login with Spotify</button>
        </a>
        <div> Now Playing: {this.state.nowPlaying.name}</div>
        <div> 
          <img src={this.state.nowPlaying.image} alt="" style={{width:100}}/>
        </div>
        <div> Acousticness: {this.state.audioFeatures.acousticness} </div>
        <button onClick={() => this.update()}>
          Update
        </button>
      </div>
    )
  }
}

export default App;
