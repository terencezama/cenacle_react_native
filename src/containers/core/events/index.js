import React, { Component } from 'react'
import { Text, View, Keyboard, FlatList, TouchableOpacity, Linking } from 'react-native'
import { material } from 'react-native-typography'
import { withTheme, Divider, IconToggle, Icon, COLOR } from 'react-native-material-ui'
import { i18n } from '../../../services';
import styles from './styles';
import { connect } from 'react-redux';
import { performAction, Types } from '../../../state';
import { request } from '../../../state/types';
import uiTheme from '../../../theme';
import { OpenMap, OpenDate } from '../../../lib';
import moment from 'moment-with-locales-es6';
import RNCalendarEvents from 'react-native-calendar-events'

class EventsScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: i18n.t('events_title'),
            headerLeft: (
                <IconToggle name="menu" size={uiTheme.palette.iconSize} onPress={() => navigation.toggleDrawer()} />
            ),
        };
    }

    componentDidMount() {
        this.props.fetchEvents()
    }

    _callAction = (contact) => {
        contact = contact.replace(' ', '');
        Linking.openURL(`tel:${contact}`);
    }
    _findLocation = (location) => {
        // alert(location);
        const loc = location.split(', ');
        OpenMap({
            latitude: loc[0],
            longitude: loc[1],
            zoomLevel: 5,
            name: i18n.t('events_title')
        })

    }

    _saveEvent = (event) => {
        const { time, date, location, title, desc } = event
        const t = time
        const hm = t.split(':')
        const hour = (t.toLowerCase() == 'pm') ? parseInt(hm[0]) + 12 : parseInt(hm[0])
        const min = parseInt(hm[1])

        let diff = 0
        let delta = 7
        if (hour > delta) {
            diff = hour - delta
        } else {
            diff = delta - hour
        }


        // otron.log(diff)

        let eventStartDate = new Date(date.setHours(hour, min))
        //13-x=7
        RNCalendarEvents.saveEvent(title, {
            startDate: eventStartDate,
            endDate: eventStartDate,
            alarms: [{
                date: diff * 60
            }]
        })

        OpenDate(eventStartDate)

    }

    _renderItem = ({ item, index }) => {
        const { title, desc, contact, time, date, location } = item;
        const color = this.props.theme.palette.primaryColor;
        return (
            <View>
                <View style={styles.root}>
                    <View style={styles.dateContainer}>
                        <Text style={[material.display3, styles.text, {
                            // fontWeight:'100'
                        }]}>{moment(date).format('DD')}</Text>
                        <Text style={[material.display1, styles.text, {
                            fontWeight: 'bold',
                            transform: [{
                                scaleY: 0.9
                            }],
                            marginTop: -15,
                        }]}>{moment(date).format('MMM').slice(0, 3).toUpperCase()}</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={material.title}>{title}</Text>
                        <Text style={[material.body1, { color: '#757575' }]} numberOfLines={0} ellipsizeMode="tail">{desc}</Text>
                        <View style={styles.timeContents}>
                            <Icon name={'access-time'} color={'white'} />
                            <Text style={[material.body1, { color: 'white', fontWeight:'bold',  }]}>{time}</Text>
                        </View>

                        <View style={styles.actionContainer}>
                            <IconToggle name="phone" size={30} />
                            <IconToggle name="location-on" size={30} />
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