import React, { Component } from 'react'
import { Text, View, FlatList } from 'react-native'
import styles from './styles'
import { connect } from 'react-redux';
import { withTheme, IconToggle, Divider, RippleFeedback, Icon } from 'react-native-material-ui';
import { performAction, Types } from '../../../../state';
import { request } from '../../../../state/types';
import uiTheme from '../../../../theme';
import { material } from 'react-native-typography';
import { i18n, NavigationService } from '../../../../services';
import HTMLView from 'react-native-htmlview';
import moment from 'moment-es6';
import Swipeout from 'react-native-swipeout';
// console.log('appname',app);
class BibleHighlights extends Component {

  static navigationOptions = ({ navigation }) => {

    return {
      title: i18n.t('highlights_title'),
      headerLeft: navigation.getParam('from') ? undefined : (
        <IconToggle name="menu" size={uiTheme.palette.iconSize} onPress={() => navigation.toggleDrawer()} />
      ),
    };
  }

  componentDidMount() {
    this.props.bibleHighlightsRequest();
  }
  _onItemPressed = item => {
    console.log('item',item);
    const split = item.verses[0].chapterId.split('.')
    this.props.setChapterRequest({
      bookId: split[0],
      chapter: parseInt(split[1])
    })

    setTimeout(() => {
      this.props.navigation.getParam('from') ? NavigationService.pop():NavigationService.reset('main')
    }, 300);
  }
  _deleteItem = (item) => {
    // alert(JSON.stringify(item));
    this.props.unhighlightVerses([...item.verses])
  }
  _renderItem = ({ item, index }) => {
    const swipeoutBtns = [
      {
        text: 'Delete',
        onPress: () => this._deleteItem(item),
        backgroundColor: 'red'
      }
    ]
    return (
      
        <Swipeout right={swipeoutBtns} backgroundColor={'white'} autoClose={true} >
        <RippleFeedback onPress={() => this._onItemPressed(item)}>
          <View>
          <View style={styles.content}>
            <Text style={[material.title, { marginBottom: 8 }]}>{item.title}</Text>
            {/* <Text style={material.caption}>{JSON.stringify(item, null, 4)}</Text> */}
            <View style={styles.htmlContainer}>
              <HTMLView
                value={item.data}
                // stylesheet={styles}
                addLineBreaks={false}
                style={styles.html}
              />
              <View style={styles.iconContainer}>
              <Icon name={'grain'} size={32} />
              </View>
            </View>
            <Text style={[material.caption, { textAlign: 'right' }]}>{moment(item.date).format('DD MMM YYYY')}</Text>
          </View>
          </View>
          </RippleFeedback>
          <Divider />

        </Swipeout>
      )
  }

  render() {
    const { highlights } = this.props;
    return (
      <FlatList
        data={highlights.data}
        renderItem={this._renderItem}
        keyExtractor={(item, index) => `${index}`}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  ui: state.ui,
  highlights: state.bible_highlights
})

const mapDispatchToProps = (dispatch) => ({
    setChapterRequest: params => dispatch(performAction(params, request(Types.BIBLE_CHAPTER))),
  bibleHighlightsRequest: params => dispatch(performAction(params, request(Types.BIBLE_HIGHLIGHTS))),
  unhighlightVerses: params => dispatch(performAction(params, Types.BIBLE_UNHIGHLIGHT_VERSES))

})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(BibleHighlights))
