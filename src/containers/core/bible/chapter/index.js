import React, { Component } from 'react'
import { View, Text, Modal, SafeAreaView, VirtualizedList } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withTheme, IconToggle, Button } from 'react-native-material-ui'
import styles, { itemsPerRow } from './styles'
import { material } from 'react-native-typography';
import { performAction, Types } from '../../../../state';
import { request } from '../../../../state/types';




export class BibleChapterView extends Component {
    state = {
        title: '',
        chapters: 0,
        navigation: undefined
    }
    // static getDerivedStateFromProps(nextProps, prevState) {
    //     if (nextProps.navigation != prevState.navigation && nextProps.navigation) {
    //         // console.log('nice stuff',nextProps.navigation, nextProps.navigation.getParams());
    //         const  book  = nextProps.navigation.getParam('book');

    //         return {
    //             title: book.name,
    //             chapters: book.chaptersCount,
    //             navigation:nextProps.navigation
    //         }
    //     }
    //     return null;
    // }
    componentDidMount() {
        const book = this.props.navigation.getParam('book');
        setTimeout(() => {
            this.setState({
                title: book.name,
                chapters: book.chaptersCount,
                navigation: this.props.navigation
            })
        }, 300);
    }
    _onItemPressed = (item) => {
        console.log(item);
        const book = this.props.navigation.getParam('book');
        setTimeout(() => {
            this.props.setChapterRequest({
                bookId: book.id,
                chapter: parseInt(item)
            })
        }, 300);
        this.props.navigation.popToTop();
    }
    _renderItem = ({ item, index }) => {
        const { theme: { palette } } = this.props;
        return (
            <View style={styles.itemContainer}>
                {[...Array(5)].map((x, i) => {
                    const currentIndex = i + (index * itemsPerRow) + 1;
                    if (currentIndex <= this.state.chapters) {
                        return (
                            <Button key={`${currentIndex}`} primary raised text={`${currentIndex}`} style={{
                                container: styles.item,
                                text: { color: palette.primaryColor }
                            }}
                                onPress={this._onItemPressed}
                            />
                        )
                    } else {
                        return undefined;
                    }

                })}

            </View>

        )
    }

    render() {
        const { theme: { palette } } = this.props;
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: palette.primaryColor }}>
                <View style={{ flex: 1 }}>
                    <View style={styles.closeIcon}>
                        <Text style={[material.titleWhite, styles.textContainer]}>{this.state.title}</Text>
                        <IconToggle name="close" color={palette.primaryColor} size={palette.iconSize} style={{
                            container: {
                                backgroundColor: 'white',
                                borderRadius: palette.iconSize,
                                marginRight: 8
                            }
                        }}
                            onPress={() => this.props.navigation.pop()}
                        />
                    </View>
                    <View style={{ flex: 1, backgroundColor: palette.backgroundColor, marginTop: 8 }}>
                        <VirtualizedList
                            getItemCount={data => Math.floor(this.state.chapters / itemsPerRow) + 1}
                            getItem={(data, index) => {
                                return index;
                            }}
                            data={[]}
                            renderItem={this._renderItem}
                            keyExtractor={(item, index) => `${index}`}
                            ref={ref => { this.list = ref; }}

                        />
                    </View>
                </View>
            </SafeAreaView>

        )
    }
}

const mapStateToProps = (state) => ({
    ui: state.ui,
    bible_chapter: state.bible_chapter
})

const mapDispatchToProps = (dispatch) => ({
    // closeChapter: params => dispatch(performAction(null,Types.BIBLE_CHAPTER_UPDATE)),
    setChapterRequest: params => dispatch(performAction(params, request(Types.BIBLE_CHAPTER)))
})



export default connect(mapStateToProps, mapDispatchToProps)(withTheme(BibleChapterView))
