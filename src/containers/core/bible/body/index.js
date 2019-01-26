import React, { Component } from 'react'
import { Text, View, WebView, Platform } from 'react-native'
import styles from './styles'
import firebase from 'react-native-firebase'
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { performAction, Types } from '../../../../state';
import { request } from '../../../../state/types';
import { BibleParts } from '../../../../services/bible';
import BibleToolbar from '../toolbar';
// console.log('appname',app);
class BiblePageView extends Component {



  constructor(props) {
    super(props);

    this.state = {
      html: '',
      bible_chapter: undefined,
      fontSize: props.ui.bible_font_size,
      underline: [],
      bible_db_file_downloaded: false

    }
  }


  // componentDidMount() {
  //   this._setChapter('fra-LSG:Gen', 1);

  // }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { bible_chapter, ui } = nextProps;
    if ((bible_chapter != prevState.bible_chapter && !bible_chapter.fetching && bible_chapter.data) ||
      (prevState.fontSize != nextProps.ui.bible_font_size)) {
      const versesLength = bible_chapter.data.length;
      // console.log('nice stuff',bible_chapter);

      //preload html header
      let html = BibleParts.html(nextProps.ui.bible_font_size, nextProps.theme.palette.primaryColor);

      //compiles all verses into single html text
      for (let i = 0; i < versesLength; i++) {
        const verse = bible_chapter.data[i];
        let str = verse.data;
        if (verse.isHighlighted) {
          str = str.replace('class="verse"', 'class="verse highlight"');
        }

        html += str;
      }

      //append script
      html += `<script>${BibleParts.script}</script>`;
      //appead space in height
      html += `<div style="height:80px;"></div>`;

      //end tag
      html += "</body></html>"

      console.log('html', html.length);
      return {
        bible_chapter: nextProps.bible_chapter,
        fontSize: nextProps.ui.bible_font_size,
        html
      }
    } else if (ui.bible_db_file_downloaded !== prevState.bible_db_file_downloaded) {
      return {
        bible_db_file_downloaded: ui.bible_db_file_downloaded
      }
    }
    return {
      underline: nextProps.bible_underline.data
    };
  }

  componentDidMount() {
    if (this.state.bible_db_file_downloaded) {
      this._setChapter();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.ui.bible_db_file_downloaded !== this.state.bible_db_file_downloaded) {
      this._setChapter();
    }
  }

  componentWillUnmount(){
    this.props.setBibleUnderline([])
  }


  _setChapter() {
    const { ui } = this.props;

    let bookId = 'fra-LSG:Gen';
    let chapter = 1;

    if (ui.bible_current_book) {
      bookId = ui.bible_current_book.id;
      chapter = ui.bible_current_book.chapter;
    }

    this.props.setChapterRequest({
      bookId,
      chapter
    })
  }
  webjs = function webjs() {

  }
  render() {
    const { html, underline } = this.state;
    console.log('html render', html.length);
    return (
      <View style={{ flex: 1 }}>
        <WebView
          // html={html}
          source={{ html: html, baseUrl: Platform.OS === 'ios' ? undefined : '' }}
          style={{ flex: 1, padding: 60, flexGrow: 1 }}
          ref={ref => { this.webView = ref }}
          automaticallyAdjustContentInsets={true}
          injectedJavaScript={String(this.webjs) + "webjs();"}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onMessage={(event) => {
            const data = JSON.parse(event.nativeEvent.data)
            if (data.action === "clear") {
              let arr = [...underline];
              let zdata = arr.filter(o => o.verse == data.verse)[0]
              let index = arr.indexOf(zdata)
              arr.splice(index, 1);
              this.props.setBibleUnderline([...arr])

            } else if (data.action === "underline") {
              this.props.setBibleUnderline([...underline, data])
            } else if (data.action == "unhighlight") {
              RNBibleRealm.unhighlight({ verseId: data.verse });
            }


          }}
        />
        <BibleToolbar webView={this.webView} />
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  ui: state.ui,
  bible_chapter: state.bible_chapter,
  bible_underline: state.bible_underline
})

const mapDispatchToProps = (dispatch) => ({
  setChapterRequest: params => dispatch(performAction(params, request(Types.BIBLE_CHAPTER))),
  setBibleUnderline: params => dispatch(performAction(params, Types.BIBLE_UNDERLINE))
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(BiblePageView))
