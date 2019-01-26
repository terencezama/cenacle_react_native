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
import { OpenMap } from '../../../lib';


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

    _callAction = (contact) =>{
        contact = contact.replace(' ','');
        Linking.openURL(`tel:${contact}`);
    }
    _findLocation = (location) => {
        // alert(location);
        const loc = location.split(', ');
        OpenMap({
            latitude:loc[0],
            longitude:loc[1],
            zoomLevel:5,
            name:i18n.t('events_title')
        })
        
    }

    _scheduleAction = () =>{

    }

    _renderItem = ({ item, index }) => {
        const { title, desc, contact, time, date, location } = item;
        const month = date.getMonth();
        const color = this.props.theme.palette.primaryColor;
        return (
            <View>
                <View style={styles.content}>
                    <View>
                    <View>
                        <Text style={material.title}>{title}</Text>
                        <Text style={[material.body1]} numberOfLines={3} ellipsizeMode="tail">{desc}</Text>
                    </View>
                    <View>
                        <Text style={material.title}>{date.toString()}</Text>
                        <Text style={[material.body1]}>{time}</Text>
                    </View>
                    </View>

                    <TouchableOpacity style={styles.buttonContainer} onPress={()=>this._callAction(contact)}>
                        <View style={styles.caption}>
                            <Icon name="phone" size={30} color={color} />
                            <Text style={[material.caption, { color: color }]}>{i18n.t('events_call')}</Text>
                        </View>
                        <Text style={[material.button]}>{contact}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonContainer} onPress={()=>this._findLocation(location)}>
                        <View style={styles.caption}>
                            <Icon name="location-on" size={30} color={color} />
                            <Text style={[material.caption, { color: color }]}>{i18n.t('events_loc')}</Text>
                        </View>
                        <Text style={[material.button]}>{location}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonContainer}>
                        <View style={styles.caption}>
                            <Icon name="event" size={30} color={color} />
                            <Text style={[material.caption, { color: color }]}>{i18n.t('events_plan')}</Text>
                        </View>
                        <Text style={[material.button]}>{contact}</Text>
                    </TouchableOpacity>

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