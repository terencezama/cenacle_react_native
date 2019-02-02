import React, { Component } from 'react'
import { View, Text, FlatList, Image, Linking } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withTheme, Card, IconToggle, Divider, RippleFeedback } from 'react-native-material-ui'
import { performAction, Types } from '../../../state';
import { request } from '../../../state/types';
import { i18n } from '../../../services';
import uiTheme from '../../../theme';
import { Screen } from '../../../components';
import styles from './styles';
import { material } from 'react-native-typography';
class PlaylistScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: i18n.t('playlist_title'),
            headerLeft: (
                <IconToggle name="menu" size={uiTheme.palette.iconSize} onPress={() => navigation.toggleDrawer()} />
            ),
        };
    }

    state = {
        pageInfo: {},
        data: [],
        refreshing: false,
        playlistId:'PLNpxzHcoyB6p1PDo2I6mcqNferQBoSEaY',

        play: false,
        videoId: undefined
    }

    componentDidMount() {
        this._requestVideos();
    }

    componentDidUpdate = (prevProps, prevState) => {
        const { playlist } = this.props;
        if (prevProps.playlist !== playlist && !playlist.fetching && playlist.response) {
            this.setState({
                data: [
                    ...this.state.data,
                    ...playlist.response.items
                ],
                pageInfo: {
                    ...playlist.response.pageInfo,
                    nextPageToken: playlist.response.nextPageToken
                }
            });
        }
    };


    _requestVideos = () => {
        // this.props.setChapterRequest()
        this.props.requestYoutubeVideos(this.state.pageInfo);
    }

    _renderItem = ({ item }) => {
        return (
            <RippleFeedback onPress={() => { 
                const videoId = item.snippet.resourceId.videoId;
                const playlistId = this.state.playlistId;
                const index = item.snippet.position;
                Linking.openURL(`http://www.youtube.com/watch?v=${videoId}&list=${playlistId}&index=${index}`).catch((err) => {
                    alert(JSON.stringify(err));
                });
             }}>
                <View style={styles.itemContainer}>
                        <Image source={{ uri: item.snippet.thumbnails.medium.url }} style={styles.image} resizeMode={'contain'} />
                        <View style={styles.textContainer}>
                            <Text style={[material.title, styles.text]}>{item.snippet.title}</Text>
                        </View>
                        <Divider />
                    </View>
            </RippleFeedback>
        )

    }

    render() {
        const { refreshing, data } = this.state;
        const { playlist } = this.props;
        return (
            <Screen loading={false}>
                <FlatList
                    extraData={this.state}
                    data={data}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => `${index}`}
                    refreshing={refreshing}
                    onRefresh={() => {
                        this.setState({ refreshing: true })
                        this._requestVideos();
                    }}
                    onEndReached={() => {
                        if (!playlist.fetching && playlist.response && this.state.pageInfo.nextPageToken) {
                            this._requestVideos();
                        }
                    }}
                    onEndReachedThreshold={0.5}
                />
            </Screen>
        )
    }
}

const mapStateToProps = (state) => ({
    playlist: state.playlist

})

const mapDispatchToProps = (dispatch) => ({
    requestYoutubeVideos: params => dispatch(performAction(params, request(Types.YOUTUBE_VIDEOS)))
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(PlaylistScreen))
