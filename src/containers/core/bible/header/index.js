
import { material } from 'react-native-typography'


import React, { Component } from 'react'
import { View, Text } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { IconToggle, withTheme, Button } from 'react-native-material-ui';
import styles from './styles'
import { performAction, Types } from '../../../../state';

export class BibleHeader extends Component {
    state = {
        isFontSizable: false
    }

    _toggleFontSize = () => {
        const { isFontSizable } = this.state;
        this.setState({ isFontSizable: !isFontSizable })
    }

    _openBooks = () => {
        this.props.navigation.navigate('BibleBookView')
    }

    _toggleMenu = () => {
        this.props.navigation.toggleDrawer()
    }

    _increaseFontSize = () => {
        this.props.increaseFontSize();
    }
    _decreaseFontSize = () => {
        this.props.deacreaseFontSize();
    }

    _toggleAudio = ()=> {
        this.props.toggleAudio();
    }
    render() {
        const { title, theme: { palette: { primaryColor, darkTextColor, iconSize } }, ui } = this.props;
        const { isFontSizable } = this.state;
        return (
            <View style={styles.container}>

                <View style={styles.titleContainer}>
                    <IconToggle name="menu" size={iconSize} onPress={this._toggleMenu} />
                    {/* <Text style={[material.title, styles.title]}>{title}</Text> */}
                    <Button  text={ ui.bible_current_book? `${ui.bible_current_book.name} ${ui.bible_current_book.chapter}` : title} upperCase={false} raised primary onPress={this._openBooks}/>
                </View>
                <View style={styles.actionContainer}>

                    <IconToggle name="volume-up" color={primaryColor} size={iconSize} onPress={this._toggleAudio} />


                    {isFontSizable ?
                        (
                            <View style={[styles.fontContainer, { backgroundColor: primaryColor }]}>
                                <IconToggle name="close" color={'white'} onPress={this._toggleFontSize} size={iconSize} />
                                <IconToggle name="exposure-plus-1" color={darkTextColor} size={iconSize} onPress={this._increaseFontSize} />
                                <IconToggle name="exposure-neg-1" color={darkTextColor} size={iconSize} onPress={this._decreaseFontSize} />
                            </View>
                        ) : (
                            <IconToggle name="format-size" color={primaryColor} onPress={this._toggleFontSize} size={iconSize} />
                        )}


                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    ui:state.ui
})

const mapDispatchToProps =(dispatch) => ({
    increaseFontSize: params => dispatch(performAction(params,Types.BIBLE_INC_FONTSIZE)),
    deacreaseFontSize: params => dispatch(performAction(params,Types.BIBLE_DEC_FONTSIZE)),
    toggleAudio: params => dispatch(performAction(params,Types.BIBLE_AUDIO_TOGGLE))

})

BibleHeader.propTypes = {
    title: PropTypes.string.isRequired,
}

BibleHeader.defaultProps = {
    title: "Bible"
}

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(BibleHeader))

