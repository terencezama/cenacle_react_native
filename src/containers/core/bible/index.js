import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { material } from 'react-native-typography'
import { withTheme } from 'react-native-material-ui'
import { i18n } from '../../../services';
import styles from './styles';
import { connect } from 'react-redux'
import Video from 'react-native-video';

import BibleHeader from './header';
import { Types, performAction } from '../../../state';
import { Screen, Player } from '../../../components';
import BibleBodyView from './body';
import BibleBookView from './book';
import BibleChapterView from './chapter';
import BibleHighlightsScreen from './highlight';
import BibleStream from './stream';
export {
    BibleBookView,
    BibleChapterView,
    BibleHighlightsScreen
}

class BibleScreen extends Component {
    static navigationOptions = (props) => {
        return {
            headerTitle: <BibleHeader {...props} />,
            headerMode: 'float'
        };
    }

    state = {
        index: {
            version: 'fra-LSG',
            book: 'Gen',
            ord: 1,
            chapter: 1,
        },
    }

    

    
    componentWillMount() {
        this.props.bibleDbFileCheck();
    }

    

    render() {
        const { ui } = this.props;
        return (
            <Screen loading={ui.bible_db_file_downloaded !== 1}>
                <BibleStream  visible={ui.bible_audio_visible} nextChapter={()=>{}}/>
                <BibleBodyView />
            </Screen>

        )
    }
}
const mapStateToProps = (state) => ({
    ui: state.ui
})

const mapDispatchToProps = (dispatch) => ({
    bibleDbFileCheck: (params) => dispatch(performAction(params, Types.BIBLE_CHECK_DB_FILE)),
})
// export default withTheme(BibleScreen)
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(BibleScreen))