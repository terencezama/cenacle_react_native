import React, { Component } from 'react'
import { Text, View, Keyboard, FlatList, TouchableOpacity } from 'react-native'
import { material } from 'react-native-typography'
import { withTheme, Divider, Button, IconToggle, COLOR } from 'react-native-material-ui'
import { i18n } from '../../../services';
import styles from './styles';
import uiTheme from '../../../theme';
import {connect} from 'react-redux';
import { Types, performAction } from '../../../state';
import { request } from '../../../state/types';
class SummariesScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: i18n.t('summaries_title'),
            headerLeft: (
                <IconToggle name="menu" size={uiTheme.palette.iconSize} onPress={() => navigation.toggleDrawer()} />
            ),
        };
    }

    componentDidMount(){
        this.props.fetchSummaries();
    }

    _renderItem = ({ item, index }) => {
        const { desc,  date } = item;
        const color = this.props.theme.palette.primaryColor;
        return (
            <View>
                <View style={styles.content}>
                    <Text style={material.title}>{date.toString()}</Text>
                    <Text style={[material.body1]}>{desc}</Text>
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
                keyExtractor={(item, index) => index}
            />

        )
    }
}

const mapStateToProps = (state) => ({
    summaries: state.summaries,
})

const mapDispatchToProps = (dispatch) => ({
    fetchSummaries: params => dispatch(performAction(params, request(Types.SUMMARIES)))
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(SummariesScreen))