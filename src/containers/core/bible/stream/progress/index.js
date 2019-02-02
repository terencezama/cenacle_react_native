import React from "react";
import { View, Text, Slider } from "react-native";
import TrackPlayer,{ ProgressComponent } from "react-native-track-player";
import * as Progress from "react-native-progress";
import { material } from "react-native-typography";
import styles from "../styles";
import uiTheme from "../../../../../theme";

export default class StreamProgress extends ProgressComponent {
  constructor(props) {
    super(props);
  }



  render() {
    return (
      <View>
        <View style={[styles.horizontalContainer,{backgroundColor:'transparent'}]}>
          <View style={styles.absolute}>
            <View style={styles.resizing}>
              <Progress.Bar
                progress={this.getBufferedProgress()}
                width={null}
                borderRadius={0}
                height={1}
                borderWidth={0}
                unfilledColor="#ADADAD"
                color={uiTheme.palette.darkPrimary}
              />
            </View>
          </View>
          <Slider
            minimumValue={0}
            maximumValue={1}
            step={0.001}
            value={this.getProgress()}
            onValueChange={value => {
              // alert(value);
              TrackPlayer.seekTo(value*this.state.duration);
              // this._onSeek(value);
            }}
            style={styles.slider}
            thumbTintColor={uiTheme.palette.primaryColor}
            minimumTrackTintColor="red"
            maximumTrackTintColor="transparent"
          />
        </View>

        <View style={styles.horizontalContainer}>
          <Text style={material.body1}>{parseFloat(this.state.position).toFixed(2)}</Text>

          <Text style={material.body1}>{parseFloat(this.state.duration).toFixed(2) }</Text>
        </View>
      </View>
    );
  }
}
