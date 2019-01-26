import React, { Component } from 'react'
import { Text, View, Keyboard, FlatList } from 'react-native'
import { material } from 'react-native-typography'
import { withTheme, Divider, IconToggle } from 'react-native-material-ui'
import { i18n } from '../../../services';
import styles from './styles';
import uiTheme from '../../../theme';
import { connect } from 'react-redux';
import { performAction, Types } from '../../../state';
import { request } from '../../../state/types';
import moment from 'moment-es6';
import { RichText } from '../../../components';
import HTMLView from 'react-native-htmlview';
class SharesScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: i18n.t('shares_title'),
            headerLeft: (
                <IconToggle name="menu" size={uiTheme.palette.iconSize} onPress={() => navigation.toggleDrawer()} />
            ),
        };
    }

    componentDidMount() {
        this.props.fetchShares();
    }
    _renderItem = ({ item, index }) => {
        const { title, content, date } = item;
        // console.log(item.content);
        return (
            <View>
                <View style={styles.content}>
                    <Text style={[material.title,{marginBottom:8}]}>{title}</Text>
                    {/* <Text style={[material.body1]} numberOfLines={3} ellipsizeMode="tail">{content}</Text> */}
                    {/* <RichText style={styles.richText} item={item}/> */}
                    <HTMLView
                        value={content}
                        stylesheet={styles}
                        addLineBreaks={false}
                    />
                    <Text style={[material.caption, { textAlign: 'right', color:this.props.theme.palette.primaryColor }]}>{moment(date).format('DD MMMM YYYY hh:mm')}</Text>
                </View>
                <Divider />
            </View>

        )
    }

    render() {
        const { shares } = this.props;

        return (
            <FlatList
                data={shares.data}
                renderItem={this._renderItem}
                keyExtractor={(item, index) => `${index}`}
            />

        )
    }
}

const mapStateToProps = (state) => ({
    shares: state.shares,
})

const mapDispatchToProps = (dispatch) => ({
    // setChapterRequest: params => dispatch(performAction(params, request(Types.BIBLE_CHAPTER))),
    fetchShares: params => dispatch(performAction(params, request(Types.SHARES)))
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(SharesScreen))