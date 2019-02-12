import firebase from "react-native-firebase";
import { Config } from "..";
import { Platform } from "react-native";

const init = async () => {
  // Build a channel
  const channel = new firebase.notifications.Android.Channel(
    "cenacle",
    "Cenacle Channel",
    firebase.notifications.Android.Importance.Max
  ).setDescription("Cenacle Channel");

  // Create the channel
  firebase.notifications().android.createChannel(channel);

  const enabled = await firebase.messaging().hasPermission();
  if (!enabled) {
    try {
      await firebase.messaging().requestPermission();
      await registerTopics();
    } catch (e) {}
  } else {
    await registerTopics();
  }
};

const registerTopics = async () => {
  const env = Config.env;
  let topics = [];

  if (Platform.OS === "ios") {
    topics = [
      `/topics/${env}_verse_ios`,
      `/topics/${env}_summaries_ios`,
      `/topics/${env}_shares_ios`,
      `/topics/${env}_events_ios`
    ];

    firebase.messaging().unsubscribeFromTopic(`/topics/${env}_verse`);
    firebase.messaging().unsubscribeFromTopic(`/topics/${env}_summaries`);
    firebase.messaging().unsubscribeFromTopic(`/topics/${env}_shares`);
    firebase.messaging().unsubscribeFromTopic(`/topics/${env}_events`);
  } else {
    topics = [
      `/topics/${env}_verse`,
      `/topics/${env}_summaries`,
      `/topics/${env}_shares`,
      `/topics/${env}_events`
    ];
  }

  topics.forEach(topic => {
    firebase.messaging().subscribeToTopic(topic);
    console.log(`topic>>> ${topic} registered`);
  });
};

init();

export const notify = message => {
  const { data } = message;
  const notification = new firebase.notifications.Notification()
    .setNotificationId(data.title)
    .setTitle(data.title)
    .setBody(data.message)
    .setData(data);

  if (Platform.Version < 21) {
    notification.android.setPriority(2);
  } else {
    notification.android.setPriority(1);
  }
  notification.android
    .setChannelId("cenacle")
    .android.setVibrate([1000, 1000])
    .android.setDefaults([firebase.notifications.Android.Defaults.Vibrate])
    .android.setSmallIcon("ic_stat_notif");
  firebase.notifications().displayNotification(notification);
};
export const notify_fcmnotif = notification => {
  if (Platform.Version < 21) {
    notification.android.setPriority(2);
  } else {
    notification.android.setPriority(1);
  }
  notification.android
    .setChannelId("cenacle")
    .android.setVibrate([1000, 1000])
    .android.setDefaults([firebase.notifications.Android.Defaults.Vibrate])
    .android.setSmallIcon("ic_stat_notif");
  firebase.notifications().displayNotification(notification);
};
