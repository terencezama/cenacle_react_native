import React, { Component } from 'react'
import { Text, View, Modal, SafeAreaView, Alert, FlatList, TouchableOpacity } from 'react-native'
import MaterialTabs from 'react-native-material-tabs';
import { withTheme, IconToggle, Divider } from 'react-native-material-ui'
import { i18n } from '../../../../services';
import styles from './styles'
import { connect } from 'react-redux'
import { Types, performAction } from '../../../../state';
import { material } from 'react-native-typography';

class BibleBookView extends Component {
    state = {
        selectedTab: 0
    }
    componentDidMount() {
        const { selectedTab } = this.state;
        this.props.fetchBibleBooks(selectedTab);
    }
    componentDidUpdate = (prevProps, prevState) => {
        const { selectedTab } = this.state;
        if (prevState.selectedTab !== selectedTab) {
            setTimeout(() => {
                this.props.fetchBibleBooks(selectedTab)
                this.list.scrollToIndex({ index: 0 })
            }, 300);
        }
    };

    _onClose = () => {
        this.props.navigation.pop();
    }

    _onBookPressed = (book) => {
        this.props.navigation.navigate('BibleChapterView', { book })

    }


    _renderItem = ({ item, index }) => {

        return (
            <TouchableOpacity onPress={() => this._onBookPressed(item)}>
                <View style={styles.itemContainer}>
                    <Text style={material.subheading}>{item.name}</Text>
                </View>
                <Divider />
            </TouchableOpacity>

        )
    }


    render() {
        const { theme: { palette } } = this.props;
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: palette.primaryColor }}>
                <View style={{ flex: 1 }}>
                    <View style={styles.closeIcon}>
                        <IconToggle name="close" color={palette.primaryColor} size={palette.iconSize} style={{
                            container: {
                                backgroundColor: 'white',
                                borderRadius: palette.iconSize,
                                marginRight: 8
                            }
                        }}
                            onPress={this._onClose} />
                    </View>

                    <MaterialTabs
                        items={[i18n.t('bible_book_traditional'), i18n.t('bible_book_alphabetical')]}
                        selectedIndex={this.state.selectedTab}
                        onChange={index => this.setState({ selectedTab: index })}
                        barColor={palette.primaryColor}
                    />
                    <View style={{ flex: 1, backgroundColor: palette.backgroundColor }}>
                        <FlatList
                            data={this.props.ui.bible_books}
                            renderItem={this._renderItem}
                            extraData={this.state}
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
    ui: state.ui
})

const mapDispatchToProps = (dispatch) => ({
    fetchBibleBooks: params => dispatch(performAction(params, Types.BIBLE_BOOKS_REQUEST)),

})
// export default withTheme(BibleBookView)
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(BibleBookView))