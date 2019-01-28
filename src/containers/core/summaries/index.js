import React, { Component } from 'react'
import { Text, View, Keyboard, FlatList, TouchableOpacity } from 'react-native'
import { material } from 'react-native-typography'
import { withTheme, Divider, Button, IconToggle, COLOR } from 'react-native-material-ui'
import { i18n, NavigationService } from '../../../services';
import styles from './styles';
import uiTheme from '../../../theme';
import { connect } from 'react-redux';
import { Types, performAction } from '../../../state';
import { request } from '../../../state/types';
import { BibleLink,BibleLinkId } from '../../../services/bible'
import moment from 'moment-with-locales-es6'
class SummariesScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: i18n.t('summaries_title'),
            headerLeft: (
                <IconToggle name="menu" size={uiTheme.palette.iconSize} onPress={() => navigation.toggleDrawer()} />
            ),
        };
    }

    componentDidMount() {
        this.props.fetchSummaries();
    }

    _renderItem = ({ item, index }) => {
        const { desc, date } = item;
        const linkColor = this.props.theme.palette.linkColor;

        const arr = desc.split(/(cdse:\/\/\S*)/);
        let dateString = moment(date).format('dddd DD/MM/YYYY');
        dateString = dateString.charAt(0).toUpperCase() + dateString.slice(1);

        return (
            <View key={item.id}>
                <View style={styles.content}>
                    <Text style={material.title}>{dateString}</Text>
                    <Text>{
                        arr.map((elem, index) => {
                            if (elem.indexOf('cdse') !== -1) {
                                const splits = elem.split(':');
                                let abrv = splits[1].replace('//', '');
                                // let book = 
                                return (<Text key={`${index}`} style={{ color: linkColor }}
                                    onPress={() => {
                                        const req = {
                                            bookId: BibleLinkId[abrv],
                                            chapter: parseInt(splits[2])
                                        };
                                        console.log(req);
                                        this.props.setChapterRequest(req);
                                        setTimeout(() => {
                                            NavigationService.reset('main');
                                        }, 300);
                                    }}
                                >{`${BibleLink[abrv]} ${splits[2]}${splits[3] ? ":" + splits[3] : ""}`}</Text>);
                            } else {
                                return (<Text key={`${index}`} style={[material.body1]}>{elem}</Text>);
                            }
                        })
                    }</Text>
                </View>
                <Divider />
            </View>

        )
    }

    render() {

        return (
            <FlatList
                data={this.props.summaries.data}
                renderItem={this._renderItem}
            // keyExtractor={(item, index) => `${index}`}
            />

        )
    }
}

const mapStateToProps = (state) => ({
    summaries: state.summaries,
})

const mapDispatchToProps = (dispatch) => ({
    fetchSummaries: params => dispatch(performAction(params, request(Types.SUMMARIES))),
    setChapterRequest: params => dispatch(performAction(params, request(Types.BIBLE_CHAPTER)))
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(SummariesScreen))