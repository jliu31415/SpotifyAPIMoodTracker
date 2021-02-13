import React, {Component} from 'react';
import './App.css';
import Spotify from 'spotify-web-api-js';

const spotifyWebApi = new Spotify()

class App extends Component {
  constructor(){
    super();
    const params = this.getHashParams();
    this.state = {
      loggedIn: params.access_token? true : false,
      nowPlaying: {
        name: "",
        image: "",
        trackID: "",
      },
      audioFeatures: {
        acousticness: "",
        danceability: "",
        duration_ms: "",
        energy: "",
        instrumentalness: "",
        key: "",  //0->C, 1->C#, etc. (pitch class notation)
        liveness: "",
        loudness: "",
        mode: "", //0->minor, 1->major
        speechiness: "",
        tempo: "",
        time_signature: "",
        valence: "" //conveys "musical positiveness"
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
        if (response.item != null) {
          this.setState({
            nowPlaying: {
              name: response.item.name,
              image: response.item.album.images[0].url,
              trackID: response.item.id
            }
          })
        }
        this.getAudioFeatures();
      }, null)
  }

  getAudioFeatures() {
    spotifyWebApi.getAudioFeaturesForTrack(this.state.nowPlaying.trackID)
      .then((response) => {
        this.setState({
          audioFeatures: {
            acousticness: response.acousticness,
            danceability: response.danceability,
            duration_ms: response.duration_ms,
            energy: response.energy,
            instrumentalness: response.instrumentalness,
            key: response.key,
            liveness: response.liveness,
            loudness: response.loudness,
            mode: response.mode,
            speechiness: response.speechiness,
            tempo: response.tempo,
            time_signature: response.time_signature,
            valence: response.valence
          }
        })
      })
  }

  //returns string representation of all audio features
  setAllAudioFeatures() {
    var features = "";
    for (var i = 0; i < this.attributes.length; i++) {
      var attrib = this.attributes[i];
      features += attrib.name + ": " + attrib.value + "\n";
    }
    console.log("test");
    console.log(features);
    return features;
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
