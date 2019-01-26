import React, { Component } from 'react'
import { View, TouchableOpacity, SafeAreaView, Clipboard, Share } from 'react-native'
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { performAction, Types } from '../../../../state';
import { request } from '../../../../state/types';
import styles from './styles';
import FAIcon from 'react-native-vector-icons/FontAwesome'
import MIcon from 'react-native-vector-icons/MaterialIcons'
import { NavigationService } from '../../../../services';

class BibleToolbar extends Component {


    constructor(props) {
        super(props);

        this.state = {


        }
    }


    componentDidMount() {


    }
    //#region utils
    _parseUnderlineVerse = () => {
        let arr = this.props.bible_underline.data;
        
        arr.sort(function (a, b) {
            const id1 = parseInt(a.id)
            const id2 = parseInt(b.id)

            return id1 - id2;
        });

        let versesRef = []
        arr.forEach(element => {
            const verse = element.verse.split('.')
            const book = verse[0]
            const chapterId = `${book}.${verse[1]}`
            const verseIndex = parseInt(verse[2])
            versesRef.push({
                chapterId,
                verseId: element.verse,
                verseIndex,
                data: element.text,
                title: this.state.title
            })
        })

        return versesRef
    }
    _parseUnderlineText = () => {
        const {ui} = this.props;
        let arr = this.props.bible_underline.data
        //sorting texts
        arr.sort(function (a, b) {
          const id1 = parseInt(a.id)
          const id2 = parseInt(b.id)
    
          return id1 - id2;
        });
        const count = arr.length
        let verse = `${ui.bible_current_book.name} ${ui.bible_current_book.chapter}:`
    
    
        let txt = ""
        // let prevId = parseInt(this.underline[0].id)
        // let el = this.underline[i]
        //   txt += el.text
    
        for (let i = 0; i < count; i++) {
          let el = arr[i]
          txt += el.text
    
          let c_i = parseInt(arr[i].id) //current index 
          let n_i = parseInt(i == count - 1 ? null : arr[i + 1].id) //next index
          let p_i = parseInt(i == 0 ? null : arr[i - 1].id) //previous index
    
          if (i == 0) {
            verse += `${c_i}`
          } else if (i == count - 1) {
            if (c_i - p_i == 1) {
              verse += `-${c_i}`
            } else {
              verse += `,${c_i}`
            }
          } else if (c_i - p_i == 1 && n_i - c_i == 1) {
            //contine
          } else if (c_i - p_i != 1 && n_i - c_i == 1) {
            //1 3# 4 5 
            verse += `,${c_i}`
    
          } else if (c_i - p_i != 1 && n_i - c_i != 1) {
            verse += `,${c_i}`
          } else if (c_i - p_i == 1 && n_i - c_i != 1) {
            verse += `-${c_i}`
          }
    
        }
    
        txt = txt.replace(/(<\/p>)/g, " ")
        txt = txt.replace(/(<sup(.*?)sup>)|(<.*?>)/g, "")
        txt += "\n" + verse
        // console.log(txt)
        return txt
    
      }
    //#endregion

    //#region Actions
    _clearHighlight = () => {

    }
    _clearSelection = () => {
        this.props.webView.postMessage(JSON.stringify({
            action: 'clear-underline'
          }));
        //   let arr = this.props.bible_underline.data
        //   arr.splice(0)

          this.props.setBibleUnderline([]);
    }
    _copyAction = () => {
        Clipboard.setString(this._parseUnderlineText());
    }
    _shareAction = () => {
        Share.share({
            message: this._parseUnderlineText()
          })

    }
    _highlightAction = () => {
        const verses = this._parseUnderlineVerse()

        const msg = {
            action: "highlight",
            // verses:verses
        }
        this.props.webView.postMessage(JSON.stringify(msg));
        this.props.setBibleUnderline([]);
        this.props.highlightVerses({verses})
    }

    _showHistory = () => {

    }

    _showHighlights = () => {
        // this.props.navigation.navigate('BibleHighlightsScreen')
        NavigationService.navigate('BibleHighlightsScreen',{from:true});
    }

    _previousChapter = () => {
        this.props.prevChapterRequest();
    }

    _nextChapter = () => {
        this.props.nextChapterRequest();
    }
    //#endregion

    render() {
        const iconColor = 'white'
        const { theme: { palette }, bible_underline } = this.props;
        if (bible_underline.data.length !== 0) {

            let isHighlighted = false
            isHighlighted = bible_underline.data.some(element => {
                return element.highlighted == true;
            })
            const highlightRender = !isHighlighted ? null : (
                <TouchableOpacity style={[styles.iconContainer, { backgroundColor: "black" }]} onPress={() => { this.clearHighlight() }}>
                    <MIcon name="format-clear" color={palette.primaryColor} size={20} />
                </TouchableOpacity>
            )

            return (
                <View style={styles.body}>
                    <SafeAreaView>
                        <View style={styles.container}>
                            <TouchableOpacity style={styles.iconContainer} onPress={() => this._clearSelection()}>
                                <FAIcon name="times" color={iconColor} size={20} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconContainer} onPress={() => this._copyAction()}>
                                <FAIcon name="copy" color={iconColor} size={20} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconContainer} onPress={() => this._shareAction()}>
                                <MIcon name="share" color={iconColor} size={20} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconContainer} onPress={() => this._highlightAction()}>
                                <MIcon name="highlight" color={iconColor} size={20} />
                            </TouchableOpacity>
                            {highlightRender}
                        </View>
                    </SafeAreaView>
                </View>
            )
        } else {
            return (

                <View style={styles.body}>
                    <SafeAreaView>
                        <View style={styles.container}>
                            <TouchableOpacity style={styles.iconContainer} onPress={() => { this._previousChapter() }}>
                                <FAIcon name="arrow-left" color={iconColor} size={15} />
                            </TouchableOpacity>
                            {/* <TouchableOpacity style={styles.iconContainer} onPress={() => { this._showHistory() }}>
                                <FAIcon name="history" color={iconColor} size={20} />
                            </TouchableOpacity> */}
                            <TouchableOpacity style={styles.iconContainer} onPress={() => { this._showHighlights() }}>
                                <MIcon name="bookmark" color={iconColor} size={20} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconContainer} onPress={() => this._nextChapter()}>
                                <FAIcon name="arrow-right" color={iconColor} size={15} />
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </View>

            )
        }
    }
}

const mapStateToProps = (state) => ({
    ui: state.ui,
    bible_underline:state.bible_underline
})

const mapDispatchToProps = (dispatch) => ({
    setChapterRequest: params => dispatch(performAction(params, request(Types.BIBLE_CHAPTER))),
    nextChapterRequest: params => dispatch(performAction(params, Types.BIBLE_NEXT_CHAPTER)),
    prevChapterRequest: params => dispatch(performAction(params, Types.BIBLE_PREV_CHAPTER)),
    setBibleUnderline: params => dispatch(performAction(params, Types.BIBLE_UNDERLINE)),
    highlightVerses: params => dispatch(performAction(params,Types.BIBLE_HIGHLIGHT_VERSES)),
    unhighlightVerses: params => dispatch(performAction(params,Types.BIBLE_UNHIGHLIGHT_VERSES)),

})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(BibleToolbar))
