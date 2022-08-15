import React, { useEffect, useState } from "react";
import { Button, SafeAreaView, StyleSheet, Switch, Text, View } from "react-native";
import Player from "./src/Player";
import Recorder from "./src/Recorder";
import Slider from "@react-native-community/slider";
import TrackPlayer, { Capability, State, usePlaybackState, useProgress } from "react-native-track-player";

var track = {
  url: 'https://consumer-static-assets.stg.ableto.com/meditations/27_calm_breathe.mp3', // Load media from the network
  title: 'Avaritia',
  artist: 'deadmau5',
  album: 'while(1<2)',
  genre: 'Progressive House, Electro House',
  date: '2014-05-20T07:00:00+00:00', // RFC 3339
  artwork: 'http://example.com/cover.png', // Load artwork from the network
  duration: 402 // Duration in seconds
};

const tracks = [
  {
    url: 'https://consumer-static-assets.stg.ableto.com/meditations/27_calm_breathe.mp3', // Load media from the network
    title: 'Avaritia',
    artist: 'deadmau5',
    album: 'while(1<2)',
    genre: 'Progressive House, Electro House',
    date: '2014-05-20T07:00:00+00:00', // RFC 3339
    artwork: 'http://example.com/cover.png', // Load artwork from the network
    duration: 402 // Duration in seconds
  },
  {
    url: 'https://consumer-static-assets.stg.ableto.com/meditations/27_calm_breathe.mp3', // Load media from the network
    title: 'Avaritia',
    artist: 'deadmau5',
    album: 'while(1<2)',
    genre: 'Progressive House, Electro House',
    date: '2014-05-20T07:00:00+00:00', // RFC 3339
    artwork: 'http://example.com/cover.png', // Load artwork from the network
    duration: 402 // Duration in seconds
  },
  {
    url: 'https://consumer-static-assets.stg.ableto.com/meditations/27_calm_breathe.mp3', // Load media from the network
    title: 'Avaritia',
    artist: 'deadmau5',
    album: 'while(1<2)',
    genre: 'Progressive House, Electro House',
    date: '2014-05-20T07:00:00+00:00', // RFC 3339
    artwork: 'http://example.com/cover.png', // Load artwork from the network
    duration: 402 // Duration in seconds
  },
  {
    url: 'https://consumer-static-assets.stg.ableto.com/meditations/27_calm_breathe.mp3', // Load media from the network
    title: 'Avaritia',
    artist: 'deadmau5',
    album: 'while(1<2)',
    genre: 'Progressive House, Electro House',
    date: '2014-05-20T07:00:00+00:00', // RFC 3339
    artwork: 'http://example.com/cover.png', // Load artwork from the network
    duration: 402 // Duration in seconds
  },
  {
    url: 'https://consumer-static-assets.stg.ableto.com/meditations/27_calm_breathe.mp3', // Load media from the network
    title: 'Avaritia',
    artist: 'deadmau5',
    album: 'while(1<2)',
    genre: 'Progressive House, Electro House',
    date: '2014-05-20T07:00:00+00:00', // RFC 3339
    artwork: 'http://example.com/cover.png', // Load artwork from the network
    duration: 402 // Duration in seconds
  },

]

const setUpPlayer = async () => {
  await TrackPlayer.setupPlayer();
  await TrackPlayer.add(tracks);

  await TrackPlayer.updateOptions({
    stoppingAppPausesPlayback: false,
    capabilities: [Capability.Play, Capability.Pause, Capability.SeekTo],
  });
};

const togglePlayback = async (playbackState) => {
  const currentTrack = await TrackPlayer.getCurrentTrack();
  console.log('current track: ', currentTrack);

  if (currentTrack !== null) {
    if (playbackState === State.Ready || playbackState === State.Paused) {
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
  }
}

const App = () => {
  const playbackState = usePlaybackState();
  const progress = useProgress();
  console.log('Playback state: ', playbackState);

  let player: Player | null;
  let recorder: Recorder | null;
  let lastSeek: number;
  let _progressInterval: IntervalID;

  const [playPauseButton, setPlayPauseButton] =
    useState<string>('Preparing...');
  const [recordButton, setRecordButton] = useState<string>('Preparing...');
  const [stopButtonDisabled, setStopButtonDisabled] = useState<boolean>(true);
  const [playButtonDisabled, setPlayButtonDisabled] = useState<boolean>(true);
  const [recordButtonDisabled, setRecordButtonDisabled] =
    useState<boolean>(true);
  const [loopButtonStatus, setLoopButtonStatus] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    setUpPlayer();
    return () => TrackPlayer.destroy();
  }, []);



  const _updateState = () => {
    // setPlayPauseButton(() => (player && player.isPlaying ? 'Pause' : 'Play'));
    // setRecordButton(() =>
    //   recorder && recorder.isRecording ? 'Stop' : 'Record',
    // );
    // setStopButtonDisabled(() => !player || !player.canStop);
    // setPlayButtonDisabled(
    //   () => !player || !player.canPlay || recorder.isRecording,
    // );
    // setRecordButtonDisabled(() => !recorder || (player && !player.isStopped));
  };

  const _playPause = () => {

  };

  const _stop = () => {

  };

  const _seek = percentage => {

  };

  const _reloadPlayer = () => {

  };

  const _reloadRecorder = () => {

  };

  const _requestRecordAudioPermission = async () => {

  };

  const _toggleLooping = value => {

  };

  return (
    <SafeAreaView>
      <View>
        <Text style={styles.title}>Playback</Text>
      </View>
      <View>
        <Button
          title={playbackState === State.Playing ? 'Pause' : 'Play'}
          // disabled={state.playButtonDisabled}
          onPress={() => togglePlayback(playbackState)}
        />
        <Button
          title={'Stop'}
          disabled={stopButtonDisabled}
          onPress={() => _stop()}
        />
      </View>
      <View style={styles.settingsContainer}>
        <Switch
          onValueChange={value => _toggleLooping(value)}
          value={loopButtonStatus}
        />
        <Text>Toggle Looping</Text>
      </View>
      <View style={styles.slider}>
        <Slider
          step={0.0001}
          disabled={playButtonDisabled}
          onValueChange={percentage => _seek(percentage)}
          value={progress.position}
          minimumValue={0}
          maximumValue={progress.duration}
          onSlidingComplete={async value => {
            await TrackPlayer.seekTo(value);
          }}
        />
      </View>
      <View>
        <Text style={styles.errorMessage}>{error}</Text>
      </View>

      <Text>
        Beginning: {new Date(progress.position * 1000).toISOString().substr(14, 5)}
      </Text>
      <Text>
        Ending: {new Date((progress.duration - progress.position) * 1000).toISOString().substr(14, 5)}
      </Text>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
});

export default App;
