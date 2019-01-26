import React, { Component } from 'react'
import { View, Text, Slider, TouchableOpacity } from 'react-native'
import styles from './styles';
import { IconToggle, Icon, Divider, withTheme } from 'react-native-material-ui';
import RNFS from 'react-native-fs';
import MIcon from 'react-native-vector-icons/MaterialIcons'
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';
import { PropTypes } from 'prop-types';
import { Utils } from '../../../../lib';
import uiTheme from '../../../../theme';
import { material } from 'react-native-typography';
import { performAction, Types } from '../../../../state';
import { connect } from 'react-redux'

const root = 'https://audio.emcitv.com/audio/bible/fr/audio-bible/'
const audioMap = require('./audiomap.json');


class StreamingScreen extends Component {

    constructor(props) {
        super(props)

        this.state = {

        }
    }


    getUrl = (index) => {
        const { version, book, chapter, ord } = index
        const bookId = `${version}:${book}`

        let chapterString = "";
        let chapterNum = parseInt(chapter);
        if (chapterNum < 10) {
            chapterString = "0" + chapterNum;
        } else {
            chapterString = chapterNum;
        }
        let bookString = audioMap[bookId];
        let testament = ord >= 40 ? "NT/" : "AT/"
        let url = root + testament + bookString + "/" + bookString + "-" + chapterString + ".mp3"
        return url
    }




    componentDidMount() {
        TrackPlayer.setupPlayer();
        TrackPlayer.updateOptions({
            stopWithApp: true,
            capabilities: [
                TrackPlayer.CAPABILITY_PLAY,
                TrackPlayer.CAPABILITY_PAUSE,
                TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
                TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
                TrackPlayer.CAPABILITY_STOP
            ],
            compactCapabilities: [
                TrackPlayer.CAPABILITY_PLAY,
                TrackPlayer.CAPABILITY_PAUSE
            ]
        });
    }

    componentDidUpdate = (prevProps, prevState) => {
        const { ui } = this.props;
        if (prevProps.ui != ui) {
            console.log('current_book', ui.bible_current_book);
            const { version, name, ord, chapter, chaptersCount } = ui.bible_current_book;
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
                book: name,
                ord,
                chapter,
                chaptersCount
            }
            this.setState({
                index
            })

        }

    };



    //Seek the native media player
    _onSeek(value) {
        console.log("seek", value)
        TrackPlayer.seekTo(value);
    }



    //#region Actions
    _togglePlay = () => {

    }
    //#endregion



    //#region Button Render
    _renderButtonAction() {
        const { isPlaying } = this.state;
        let action = undefined;
        if (this.state.loading) {
            action = <IconToggle name={"cloud-download"} size={30} color={uiTheme.palette.primaryColor} />
        } else {
            action = <IconToggle name={isPlaying ? "pause" : "play-arrow"} size={30} onPress={() => this._togglePlay()} color={uiTheme.palette.primaryColor} />
        }

        return (
            <View style={styles.actionButtons}>
                {/* <IconToggle name={"skip-previous"} size={30} color={uiTheme.palette.primaryColor}  /> */}
                {action}
                {/* <IconToggle name={"skip-next"} size={30} color={uiTheme.palette.primaryColor}  /> */}
            </View>
        )
    }
    //#endregion

    render() {
        if (!this.props.visible) return null

        return (
            <View>
                <View style={styles.horizontalContainer}>
                    {this._renderButtonAction()}
                </View>

                <Slider
                    minimumValue={0}
                    maximumValue={this.state.duration}
                    step={1}
                    value={this.state.progress}
                    onValueChange={(value) => this._onSeek(value)}
                    style={styles.slider}
                    thumbTintColor={uiTheme.palette.primaryColor}
                />

                <View style={styles.horizontalContainer}>
                    <Text style={material.body1}>
                        {this.state.progressStr}
                    </Text>

                    <Text style={material.body1}>
                        {this.state.durationStr}
                    </Text>

                </View>
                <Divider />
            </View>
        )
    }
}


const mapStateToProps = (state) => ({
    ui: state.ui
})

const mapDispatchToProps = (dispatch) => ({
    bibleDbFileCheck: (params) => dispatch(performAction(params, Types.BIBLE_CHECK_DB_FILE)),
})
// export default withTheme(BibleScreen)
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(StreamingScreen))