import React from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Slider from '@react-native-community/slider';
import TrackPlayer, {
  Capability,
  State,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

const tracks = [
  {
    url: 'https://consumer-static-assets.stg.ableto.com/meditations/27_calm_breathe.mp3', // Load media from the network
    title: 'Avaritia',
    artist: 'deadmau5',
    album: 'while(1<2)',
    genre: 'Progressive House, Electro House',
    date: '2014-05-20T07:00:00+00:00', // RFC 3339
    artwork: 'http://example.com/cover.png', // Load artwork from the network
    duration: 402, // Duration in seconds
  },
  {
    url: 'https://consumer-static-assets.stg.ableto.com/meditations/27_calm_breathe.mp3', // Load media from the network
    title: 'Avaritia',
    artist: 'deadmau5',
    album: 'while(1<2)',
    genre: 'Progressive House, Electro House',
    date: '2014-05-20T07:00:00+00:00', // RFC 3339
    artwork: 'http://example.com/cover.png', // Load artwork from the network
    duration: 402, // Duration in seconds
  },
  {
    url: 'https://consumer-static-assets.stg.ableto.com/meditations/27_calm_breathe.mp3', // Load media from the network
    title: 'Avaritia',
    artist: 'deadmau5',
    album: 'while(1<2)',
    genre: 'Progressive House, Electro House',
    date: '2014-05-20T07:00:00+00:00', // RFC 3339
    artwork: 'http://example.com/cover.png', // Load artwork from the network
    duration: 402, // Duration in seconds
  },
  {
    url: 'https://consumer-static-assets.stg.ableto.com/meditations/27_calm_breathe.mp3', // Load media from the network
    title: 'Avaritia',
    artist: 'deadmau5',
    album: 'while(1<2)',
    genre: 'Progressive House, Electro House',
    date: '2014-05-20T07:00:00+00:00', // RFC 3339
    artwork: 'http://example.com/cover.png', // Load artwork from the network
    duration: 402, // Duration in seconds
  },
  {
    url: 'https://consumer-static-assets.stg.ableto.com/meditations/27_calm_breathe.mp3', // Load media from the network
    title: 'Avaritia',
    artist: 'deadmau5',
    album: 'while(1<2)',
    genre: 'Progressive House, Electro House',
    date: '2014-05-20T07:00:00+00:00', // RFC 3339
    artwork: 'http://example.com/cover.png', // Load artwork from the network
    duration: 402, // Duration in seconds
  },
];

const setUpPlayer = async () => {
  await TrackPlayer.setupPlayer();
  await TrackPlayer.add(tracks);

  await TrackPlayer.updateOptions({
    stoppingAppPausesPlayback: false,
    capabilities: [Capability.Play, Capability.Pause, Capability.SeekTo],
  });
};

const togglePlayback = async playbackState => {
  const currentTrack = await TrackPlayer.getCurrentTrack();

  if (currentTrack !== null) {
    if (playbackState === State.Ready || playbackState === State.Paused) {
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
  }
};

const AppTrackPlayer = () => {
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const {navigate} = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      setUpPlayer();

      return () => TrackPlayer.destroy();
    }, []),
  );

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View>
        <Text style={styles.title}>Playback</Text>
      </View>
      <View>
        <Button
          title={playbackState === State.Playing ? 'Pause' : 'Play'}
          // disabled={state.playButtonDisabled}
          onPress={() => togglePlayback(playbackState)}
        />
      </View>
      <View style={styles.slider}>
        <Slider
          step={0.0001}
          value={progress.position}
          minimumValue={0}
          maximumValue={progress.duration}
          onSlidingComplete={async value => {
            await TrackPlayer.seekTo(value);
          }}
        />
      </View>
      <Text>
        Beginning:{' '}
        {new Date(progress.position * 1000).toISOString().substr(14, 5)}
      </Text>
      <Text>
        Ending:{' '}
        {new Date((progress.duration - progress.position) * 1000)
          .toISOString()
          .substr(14, 5)}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => navigate('Details')}
          style={styles.button}>
          <Text style={styles.buttonText}>Details Screen</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  slider: {
    height: 10,
    margin: 10,
    marginBottom: 50,
  },
  settingsContainer: {
    alignItems: 'center',
  },
  container: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
  },
  errorMessage: {
    fontSize: 15,
    textAlign: 'center',
    padding: 10,
    color: 'red',
  },
  buttonContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'blue',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    paddingVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default AppTrackPlayer;
