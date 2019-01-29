import { createStackNavigator, createDrawerNavigator } from 'react-navigation';
import { WelcomeScreen, ForgotScreen, LoginScreen, RegisterScreen, SharesScreen, EventsScreen, SummariesScreen, BibleScreen, PlaylistScreen, HazardScreen } from '../containers';
import theme from '../theme'
import { BibleBookView, BibleChapterView, BibleHighlightsScreen } from '../containers/core/bible';
import { DrawerComponent } from '../components';
import {Easing,Animated} from 'react-native'


const coreScreens = {
    SharesScreen: { screen: SharesScreen },
    EventsScreen: { screen: EventsScreen },
    SummariesScreen: { screen: SummariesScreen },
    BibleScreen: { screen: BibleScreen },
    BibleHighlightsScreen : {screen:BibleHighlightsScreen},
    PlaylistScreen: {screen:PlaylistScreen},
    HazardScreen: {screen:HazardScreen}
}

const RootStack = createStackNavigator({
    WelcomeScreen: { screen: WelcomeScreen },
    ForgotScreen: { screen: ForgotScreen },
    LoginScreen: { screen: LoginScreen },
    RegisterScreen: { screen: RegisterScreen },
    ...coreScreens,
    main: { screen: BibleScreen }
}, {
        initialRouteName: "WelcomeScreen",
        defaultNavigationOptions: {
            headerTintColor: theme.palette.primaryColor,
            headerTitleStyle: { color: theme.palette.textColor }
        }
    })

const ModalStack = createStackNavigator({
    root: RootStack,
    BibleBookView: { screen: BibleBookView },
    BibleChapterView: { screen: BibleChapterView }
}, {
        headerMode: 'none',
        mode: 'modal',
        // transitionConfig: () => ({
        //     transitionSpec: {
        //         duration: 300,
        //         easing: Easing.out(Easing.poly(4)),
        //         timing: Animated.timing,
        //     },
        //     screenInterpolator: sceneProps => {
        //         const { layout, position, scene } = sceneProps;
        //         const { index } = scene;

        //         const height = layout.initHeight;
        //         const translateY = position.interpolate({
        //             inputRange: [index - 1, index, index + 1],
        //             outputRange: [height, 0, 0],
        //         });

        //         const opacity = position.interpolate({
        //             inputRange: [index - 0.7, index, index + 0.7],
        //             outputRange: [0.3, 1, 0.3]
        //         })

        //         return { opacity };
        //     },
        // })
    })
const MainNavigator = createDrawerNavigator({
    main: ModalStack
}, {
        contentComponent: DrawerComponent,
    })

const lockScreens = ['WelcomeScreen', 'ForgotScreen', 'LoginScreen', 'RegisterScreen']

ModalStack.navigationOptions = ({ navigation }) => {
    let root = (navigation.state.index !== undefined ? navigation.state.routes[navigation.state.index] : navigation.state.routeName)
    console.log('rootstack', root);

    let drawerLockMode = 'locked-closed'

    const { index, routes } = root;
    if (routes) {
        const currentRoute = routes[index].routeName;
        if (lockScreens.indexOf(currentRoute) === -1) {
            drawerLockMode = 'unlocked'
        }
    }

    return {
        drawerLockMode,
    };
}

export {
    MainNavigator
}