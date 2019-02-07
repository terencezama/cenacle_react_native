import React, { Component } from 'react'
import { Text, View, Keyboard, FlatList, TouchableOpacity, Linking, Alert } from 'react-native'
import { material } from 'react-native-typography'
import { withTheme, Divider, IconToggle, Icon, COLOR } from 'react-native-material-ui'
import { i18n } from '../../../services';
import styles from './styles';
import { connect } from 'react-redux';
import { performAction, Types } from '../../../state';
import { request } from '../../../state/types';
import uiTheme from '../../../theme';
// import { OpenMap, OpenDate } from '../../../lib';
import moment from 'moment-with-locales-es6';
import firebase from 'react-native-firebase';
import { showLocation } from 'react-native-map-link';

// import RNCalendarEvents from 'react-native-calendar-events'

class EventsScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: i18n.t('events_title'),
            headerLeft: (
                <IconToggle name="menu" size={uiTheme.palette.iconSize} onPress={() => navigation.toggleDrawer()} />
            ),
        };
    }
    now = new Date();
    componentDidMount() {
        this.props.fetchEvents()
    }

    _callAction = (contact) => {
        contact = contact.replace(' ', '');
        const url = `tel:${contact}`;
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                return Linking.openURL(url).catch(() => null);
            } else {
                Alert.alert(
                    'Error',
                    `${contact}`
                )
            }
        })
    }
    _findLocation = (location) => {
        // alert(location);

        const loc = location.replace(' ','').split(',');
        showLocation({
            latitude: loc[0],
            longitude: loc[1],
            googleForceLatLon: true,  // optionally force GoogleMaps to use the latlon for the query instead of the title
        })

    }

    _saveEvent = async (event) => {
        const { time, jsdate, location, title, desc } = event

        const notification = new firebase.notifications.Notification()
            .setNotificationId(event.id)
            .setTitle(event.title)
            .setBody(`${event.desc} ${time}`)
            .setData(event)
            .android.setChannelId('cenacle');
        let date = new Date(jsdate.getTime());
        date.setHours(6);
        console.log('event date',date,jsdate);
        firebase.notifications().scheduleNotification(notification, {
            fireDate: date.getTime(),
        })
    }

    _renderItem = ({ item, index }) => {
        const { title, desc, contact, time, date, location, jsdate } = item;
        const color = this.props.theme.palette.primaryColor;
        const gray = '#757575'
        return (
            <View>
                <View style={styles.root}>
                    <View style={[styles.dateContainer, { backgroundColor: jsdate<= this.now ? gray:color }]}>
                        <Text style={[material.display2, styles.text, {
                            // fontWeight:'100'
                        }]}>{moment(date).format('DD')}</Text>
                        <Text style={[material.headline, styles.text, {
                            fontWeight: 'bold',
                            transform: [{
                                scaleY: 0.9
                            }],
                            marginTop: -15,
                        }]}>{moment(date).format('MMM').slice(0, 3).toUpperCase()}</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={material.title}>{title}</Text>
                        <Text style={[material.body1, { color: gray }]} numberOfLines={0} ellipsizeMode="tail">{desc}</Text>
                        <View style={[styles.timeContents, { backgroundColor: jsdate<= this.now?gray:color }]}>
                            <Icon name={'access-time'} color={'white'} />
                            <Text style={[material.body1, { color: 'white', fontWeight: 'bold', }]}>{time}</Text>
                        </View>

                        <View style={styles.actionContainer}>
                            {contact ? (
                                <IconToggle name="phone" size={30} onPress={() => this._callAction(contact)} />
                            ) : undefined}
                            {location ? (
                                <IconToggle name="location-on" size={30} onPress={() => this._findLocation(location)}/>
                            ) : undefined}
                            <IconToggle name="event" size={30} onPress={() => this._saveEvent(item)} />
                        </View>
                    </View>

                </View>
                <Divider />
            </View>

        )
    }

    render() {
        const { events } = this.props;
        return (
            <FlatList
                data={events.data}
                renderItem={this._renderItem}
                keyExtractor={(item, index) => `${index}`}
            />

        )
    }
}

// export default withTheme(EventsScreen)
const mapStateToProps = (state) => ({
    events: state.events,
})

const mapDispatchToProps = (dispatch) => ({
    // setChapterRequest: params => dispatch(performAction(params, request(Types.BIBLE_CHAPTER))),
    fetchEvents: params => dispatch(performAction(params, request(Types.EVENTS)))
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(EventsScreen))