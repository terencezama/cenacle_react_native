import React, { Component } from 'react';
import { ScrollView, Image, Text, View } from 'react-native'
import { DrawerItems, SafeAreaView } from 'react-navigation';
import styles from './styles'
import { Drawer,Avatar, withTheme } from 'react-native-material-ui';
import { i18n, NavigationService } from '../../services';
import { Images } from '../../assets';
import {material} from 'react-native-typography';
import firebase from 'react-native-firebase'
import {connect} from 'react-redux'
import { performAction, Types } from '../../state';
const CustomDrawerContentComponent = (props) => {
    _navigate = (screen) =>{
        NavigationService.reset(screen);
        // props.navigation.navigate(screen);
    }
    return (
        <ScrollView >
            <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
                <Drawer>
                <View>
                <Image source={Images.menu_logo} style={{flex:1,backgroundColor:'green'}} />
                <View style={styles.textContainer}>
                    <Text style={material.title}>{props.ui.user?props.ui.user.nickname:''}</Text>
                    <Text style={material.subheading}>{props.ui.user?props.ui.user.email:''}</Text>
                </View>
                </View>
                    <Drawer.Section
                        divider
                        items={[
                            { icon: 'event-note', value: i18n.t('menu/verse'), onPress:()=>this._navigate('WelcomeScreen') },
                            { icon: 'book', value: i18n.t('menu/bible'), onPress:()=>this._navigate('BibleScreen')},
                            { icon: 'share', value: i18n.t('menu/shares'), onPress:()=>this._navigate('SharesScreen')  },
                            { icon: 'event', value: i18n.t('menu/events'), onPress:()=>this._navigate('EventsScreen') },
                            { icon: 'history', value: i18n.t('menu/summaries'), onPress:()=>this._navigate('SummariesScreen') },
                            { icon: 'video-library', value: i18n.t('menu/playlist'), onPress:()=>this._navigate('PlaylistScreen') },
                            { icon: 'refresh', value: i18n.t('menu/hazard'), onPress:()=>this._navigate('HazardScreen') },
                            
                        ]}
                    />
                    <Drawer.Section
                        title="Personal"
                        items={[
                            // { icon: 'bookmark-border', value: i18n.t("menu/notifications") },
                            { icon: 'highlight', value: i18n.t("menu/highlights"), onPress:()=>this._navigate('BibleHighlightsScreen') },
                            // { icon: 'history', value: i18n.t("menu/history") },
                            { icon: 'power-settings-new', value: i18n.t("menu/logout"), active:true, onPress:()=>{props.logoutRequest()}},
                        ]}
                    />
                </Drawer>
            </SafeAreaView>
        </ScrollView>
    );
}
const mapStateToProps = (state) => ({
    ui: state.ui,
})

const mapDispatchToProps = (dispatch) => ({
    logoutRequest: () => dispatch(performAction(undefined,Types.USER_LOGOUT)),
})
// export default withTheme(BibleBookView)
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(CustomDrawerContentComponent))
// export default withTheme(CustomDrawerContentComponent);