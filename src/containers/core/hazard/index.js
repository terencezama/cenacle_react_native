import React, { Component } from 'react'
import { View, Text, ScrollView } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styles from './styles';
import { withTheme, IconToggle, Divider, Button } from 'react-native-material-ui';
import uiTheme from '../../../theme';
import { i18n, NavigationService } from '../../../services';
import { material } from 'react-native-typography';
import { performAction, Types } from '../../../state';
import { request } from '../../../state/types';
import HTMLView from 'react-native-htmlview';
export class HazardScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: i18n.t('hazard_title'),
      headerLeft: (
        <IconToggle name="menu" size={uiTheme.palette.iconSize} onPress={() => navigation.toggleDrawer()} />
      ),
    };
  }

  state = {
    title: '',
    html: undefined,
    bible_hazard: undefined
  }
  _ask = () => {
    this.props.hazardToggleRequest();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { bible_hazard } = nextProps;
    if (bible_hazard !== prevState.bible_hazard) {
      console.log('Bible Hazard >>>', bible_hazard);
      let html = '';
      let title = '';
      if (bible_hazard.data) {
        const { book, verses, chapter } = bible_hazard.data;
        title = `${book.name} ${chapter}`;

        verses.forEach(verse => {
          html += verse.data;
        })
        return {
          bible_hazard,
          title,
          html,
          chapter,
          bookId: book.id
        }
      }

    }
    return null;
  }

  _openInBible = () => {
    const { bookId, chapter } = this.state;
    this.props.setChapterRequest({
      bookId,
      chapter
    })
    setTimeout(() => {
      NavigationService.reset('main');
    }, 300);
  }

  render() {
    const { title, html } = this.state;
    return (
      <View>

        <ScrollView ref={ref => { this.scrollView = ref; }}>
          <View style={styles.instruction}>
            <View style={styles.textContainer}>
              <Text style={[material.body1, styles.text]}>{`${i18n.t('hazard_ask')}`} </Text>
            </View>
            <View style={styles.iconContainer}>
              <IconToggle name={'refresh'} size={40} onPress={() => this._ask()} />
            </View>
          </View>
          <Divider />
          {html ? (
            <View style={styles.chapterContainer}>
              <Text style={material.title}>{title}</Text>
              <HTMLView
                value={html}
                stylesheet={{
                  flex: 1,
                  flexDirection: 'row',
                }}
                addLineBreaks={false}
              />
              <Button text={i18n.t('hazard_continue')} primary onPress={() => this._openInBible()} raised />
            </View>
          ) : undefined}

        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  bible_hazard: state.bible_hazard
})

const mapDispatchToProps = dispatch => ({
  setChapterRequest: params => dispatch(performAction(params, request(Types.BIBLE_CHAPTER))),
  hazardToggleRequest: params => dispatch(performAction(params, request(Types.BIBLE_CHAPTER_HAZARD)))
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(HazardScreen))
