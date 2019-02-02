import React, { Component } from "react";
import { View, Text, Slider, TouchableOpacity, Dimensions } from "react-native";
import styles from "./styles";
import { IconToggle, Icon, Divider, withTheme } from "react-native-material-ui";
import RNFS from "react-native-fs";
import MIcon from "react-native-vector-icons/MaterialIcons";
import TrackPlayer, { ProgressComponent } from "react-native-track-player";
import { PropTypes } from "prop-types";
import { Utils } from "../../../../lib";
import uiTheme from "../../../../theme";
import { material } from "react-native-typography";
import { performAction, Types } from "../../../../state";
import { connect } from "react-redux";
import StreamProgress from "./progress";

const screenWidth = Dimensions.get("window").width;

const root = "https://audio.emcitv.com/audio/bible/fr/audio-bible/";
const audioMap = require("./audiomap.json");

class StreamingScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      trackState: TrackPlayer.STATE_NONE,

      bible_current_book: undefined,
      track: undefined,
      isPlaying: false
    };
  }

  getUrl = index => {
    console.log("geturl ", index);
    const { version, bookId, chapter, ord } = index;

    let chapterString = "";
    let chapterNum = chapter;
    if (chapterNum < 10) {
      chapterString = "0" + chapterNum;
    } else {
      chapterString = chapterNum;
    }
    let bookString = audioMap[bookId];
    let testament = ord >= 40 ? "NT/" : "AT/";
    let url =
      root +
      testament +
      bookString +
      "/" +
      bookString +
      "-" +
      chapterString +
      ".mp3";
    return url;
  };

  componentDidMount() {
    TrackPlayer.setupPlayer();
    TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        // TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        // TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        TrackPlayer.CAPABILITY_STOP
      ],
      compactCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE
      ]
    });

    this.onTrackStateChanged = TrackPlayer.addEventListener(
      "playback-state",
      async data => {
        let nstate = { trackState: data.state }
        
        if(data.state === TrackPlayer.STATE_NONE || 
          data.state === TrackPlayer.STATE_PAUSED ||
          data.state === TrackPlayer.STATE_STOPPED){
            nstate.isPlaying = false;
          }
          this.setState(nstate);
      }
    );

    this.onPlaybackQueueEnded = TrackPlayer.addEventListener(
      "playback-queue-ended",
      async data => {
        console.log("playback queue ended", data);
        if (data.track) {
          this.props.nextChapterRequest();
        }
      }
    );
  }
  componentWillUnmount() {
    if (this.onTrackStateChanged) {
      this.onTrackStateChanged.remove();
    }

    if (this.onPlaybackQueueEnded) {
      this.onPlaybackQueueEnded.remove();
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { ui } = this.props;
    if (ui.bible_current_book !== prevState.bible_current_book) {
      console.log("current_book", ui.bible_current_book);
      const {
        version,
        name,
        ord,
        chapter,
        chaptersCount,
        id
      } = ui.bible_current_book;
      /*
  'current_book', { id: 'fra-LSG:Rev',
  01-25 11:08:29.567  5899  9572 I ReactNativeJS:   name: 'Apocalypse',
  01-25 11:08:29.567  5899  9572 I ReactNativeJS:   ord: 66,
  01-25 11:08:29.567  5899  9572 I ReactNativeJS:   version: 'fra-LSG',
  01-25 11:08:29.567  5899  9572 I ReactNativeJS:   chaptersCount: 22,
  01-25 11:08:29.567  5899  9572 I ReactNativeJS:   chapter: 22 }
            */
      const index = {
        version,
        bookId: id,
        ord,
        chapter,
        chaptersCount
      };

      var track = {
        id,
        url: this.getUrl(index),
        title: `${name} ${chapter}`,
        artist: "Cenacle Du St Esprit",
        artwork: "https://i.ibb.co/Wy5ZgkV/menu-logo-3x.jpg"
      };

      this.setState({
        index,
        progress: 0,
        bible_current_book: ui.bible_current_book,
        track
      });

      if (this.state.isPlaying) {
        this._addAndPlayTrack();
      } else {
        TrackPlayer.reset();
      }
    }
  };

  _addAndPlayTrack = () => {
    TrackPlayer.reset();
    TrackPlayer.add([this.state.track]).then(() => {
      TrackPlayer.play();
    });
  };

  //#region Actions
  _togglePlay = async () => {
    const { trackState } = this.state;
    if (trackState === TrackPlayer.STATE_PLAYING) {
      //pause
      TrackPlayer.pause();
      this.setState({ isPlaying: false });
    } else {
      const queue = await TrackPlayer.getQueue();
      if (queue.length === 0) {
        this._addAndPlayTrack();
      } else {
        TrackPlayer.play();
      }
      //play

      this.setState({ isPlaying: true });
    }
  };
  //#endregion

  //#region Button Render
  _renderButtonAction() {
    const { trackState } = this.state;
    let action = undefined;
    if (this.state.loading) {
      action = (
        <IconToggle
          name={"cloud-download"}
          size={30}
          color={uiTheme.palette.primaryColor}
        />
      );
    } else {
      action = (
        <IconToggle
          name={
            trackState === TrackPlayer.STATE_PLAYING ? "pause" : "play-arrow"
          }
          size={30}
          onPress={() => this._togglePlay()}
          color={uiTheme.palette.primaryColor}
        />
      );
    }

    return (
      <View style={styles.actionButtons}>
        {/* <IconToggle name={"skip-previous"} size={30} color={uiTheme.palette.primaryColor}  /> */}
        {action}
        {/* <IconToggle name={"skip-next"} size={30} color={uiTheme.palette.primaryColor}  /> */}
      </View>
    );
  }
  //#endregion

  render() {
    if (!this.props.visible) return <View />;

    return (
      <View>
        <View style={styles.horizontalContainer}>
          {this._renderButtonAction()}
        </View>
        <StreamProgress />
        <Divider />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  ui: state.ui
});

const mapDispatchToProps = dispatch => ({
  nextChapterRequest: params =>
    dispatch(performAction(params, Types.BIBLE_NEXT_CHAPTER))
});
// export default withTheme(BibleScreen)
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(StreamingScreen));
